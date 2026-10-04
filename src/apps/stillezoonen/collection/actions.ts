"use server";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { zooLimiter } from "@/lib/rate-limit";
import { getTeacher } from "@/lib/session";
import { isKnownCreature } from "./catalog";
import { MY_COLLECTION } from "./rarity";

export type ZooClass = { id: string; name: string };
export type Sighting = {
  collection: string;
  theme: string;
  creature: string;
  firstSeen: number;
  count: number;
};

const MAX_CLASSES = 50;
const MAX_NAME = 24;

/** "  2.a  " → "2.a". Kontroltegn fjernes. Tom eller for lang → null. */
function cleanName(name: unknown) {
  if (typeof name !== "string") return null;
  const n = name.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
  return n && n.length <= MAX_NAME ? n : null;
}

/** Højst så mange ændringer af klasser pr. 10 min — mod fejlklik i en løkke og misbrug. */
const classOpsLimited = (userId: string) => zooLimiter.limited(`classes:${userId}`, 60, 10 * 60 * 1000);

/** Lærerens egen samling eller en af lærerens klasser. */
function ownsCollection(userId: string, collection: unknown): collection is string {
  if (collection === MY_COLLECTION) return true;
  if (typeof collection !== "string" || collection.length > 64) return false;
  return !!db().prepare("select 1 from zoo_classes where id = ? and user_id = ?").get(collection, userId);
}

/** Klasser og alle spottede figurer for den indloggede lærer. */
export async function getZooData(): Promise<{ classes: ZooClass[]; sightings: Sighting[] } | null> {
  const teacher = await getTeacher();
  if (!teacher) return null;
  const conn = db();
  // node:sqlite giver rækker uden prototype — de kan ikke sendes til browseren,
  // så de kopieres over i almindelige objekter.
  const classes = (
    conn
      .prepare("select id, name from zoo_classes where user_id = ? order by name collate nocase")
      .all(teacher.id) as ZooClass[]
  ).map((c) => ({ id: c.id, name: c.name }));
  const sightings = (
    conn
      .prepare(
        `select collection, theme, creature, first_seen as firstSeen, count
           from zoo_sightings where user_id = ?`,
      )
      .all(teacher.id) as Sighting[]
  ).map((r) => ({
    collection: r.collection,
    theme: r.theme,
    creature: r.creature,
    firstSeen: r.firstSeen,
    count: r.count,
  }));
  return { classes, sightings };
}

/** En figur er blevet spottet. `isNew` = første gang i denne samling. */
export async function recordSighting(collection: unknown, theme: unknown, creature: unknown) {
  const teacher = await getTeacher();
  if (!teacher || !isKnownCreature(theme, creature) || !ownsCollection(teacher.id, collection))
    return { ok: false as const };
  if (zooLimiter.limited(`sighting:${teacher.id}`, 600, 10 * 60 * 1000)) return { ok: false as const };
  // Tjekket af isKnownCreature ovenfor.
  const t = theme as string;
  const c = creature as string;
  const now = Date.now();
  const conn = db();
  const inserted = conn
    .prepare(
      `insert or ignore into zoo_sightings (user_id, collection, theme, creature, first_seen, last_seen, count)
       values (?, ?, ?, ?, ?, ?, 1)`,
    )
    .run(teacher.id, collection, t, c, now, now);
  if (inserted.changes === 0)
    conn
      .prepare(
        `update zoo_sightings set count = count + 1, last_seen = ?
          where user_id = ? and collection = ? and theme = ? and creature = ?`,
      )
      .run(now, teacher.id, collection, t, c);
  return { ok: true as const, isNew: inserted.changes === 1 };
}

type ClassResult = { ok: true; cls: ZooClass } | { ok: false; error: string };

/** Samme navn uanset store/små bogstaver — også Æ/Ø/Å (SQLites lower() kender kun ASCII). */
const nameTaken = (userId: string, name: string, exceptId?: string) => {
  const wanted = name.toLocaleLowerCase("da");
  return (
    db()
      .prepare("select id, name from zoo_classes where user_id = ?")
      .all(userId) as { id: string; name: string }[]
  ).some((c) => c.id !== exceptId && c.name.toLocaleLowerCase("da") === wanted);
};

export async function createClass(name: unknown): Promise<ClassResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, error: "Du skal være logget ind." };
  if (classOpsLimited(teacher.id)) return { ok: false, error: "For mange ændringer lige nu. Prøv igen om lidt." };
  const clean = cleanName(name);
  if (!clean) return { ok: false, error: `Skriv et navn på højst ${MAX_NAME} tegn, fx “2.A”.` };
  const conn = db();
  const { n } = conn.prepare("select count(*) as n from zoo_classes where user_id = ?").get(teacher.id) as {
    n: number;
  };
  if (n >= MAX_CLASSES) return { ok: false, error: `Du kan højst have ${MAX_CLASSES} klasser.` };
  if (nameTaken(teacher.id, clean)) return { ok: false, error: `Du har allerede en klasse, der hedder ${clean}.` };
  const id = randomUUID();
  try {
    conn
      .prepare("insert into zoo_classes (id, user_id, name, created_at) values (?, ?, ?, ?)")
      .run(id, teacher.id, clean, Date.now());
  } catch (err) {
    if (String(err).includes("UNIQUE"))
      return { ok: false, error: `Du har allerede en klasse, der hedder ${clean}.` };
    throw err;
  }
  return { ok: true, cls: { id, name: clean } };
}

export async function renameClass(id: unknown, name: unknown): Promise<ClassResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, error: "Du skal være logget ind." };
  if (classOpsLimited(teacher.id)) return { ok: false, error: "For mange ændringer lige nu. Prøv igen om lidt." };
  const clean = cleanName(name);
  if (!clean) return { ok: false, error: `Skriv et navn på højst ${MAX_NAME} tegn.` };
  if (typeof id !== "string" || id === MY_COLLECTION || !ownsCollection(teacher.id, id))
    return { ok: false, error: "Klassen findes ikke." };
  if (nameTaken(teacher.id, clean, id)) return { ok: false, error: `Du har allerede en klasse, der hedder ${clean}.` };
  db().prepare("update zoo_classes set name = ? where id = ? and user_id = ?").run(clean, id, teacher.id);
  return { ok: true, cls: { id, name: clean } };
}

/** Sletter klassen og alt, den har spottet. */
export async function deleteClass(id: unknown) {
  const teacher = await getTeacher();
  if (!teacher || typeof id !== "string" || id === MY_COLLECTION || !ownsCollection(teacher.id, id))
    return { ok: false as const, error: "Klassen findes ikke." };
  if (classOpsLimited(teacher.id))
    return { ok: false as const, error: "For mange ændringer lige nu. Prøv igen om lidt." };
  const conn = db();
  conn.prepare("delete from zoo_sightings where user_id = ? and collection = ?").run(teacher.id, id);
  conn.prepare("delete from zoo_classes where id = ? and user_id = ?").run(id, teacher.id);
  return { ok: true as const };
}
