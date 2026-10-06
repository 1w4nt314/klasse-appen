"use server";

// Opgavelab — lærerens gemte opgaver. Hver handling starter med getTeacher(),
// og hver forespørgsel på et dokument har `user_id = ?`, så ingen kan læse,
// overskrive eller slette en andens opgave. Alt input er `unknown` og valideres.

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { opgavelabLimiter } from "@/lib/rate-limit";
import { getTeacher } from "@/lib/session";
import { cleanName, parseDocument } from "./model/validate";
import { LIMITS } from "./model/types";
import type { Document as SheetDoc } from "./model/types";

export type DocSummary = { id: string; name: string; subject: string; updatedAt: number };
/** `notes`: beskeder om rettelser ved indlæsning (fx dublet-aliasser i gamle dokumenter). */
export type LoadResult = { ok: true; doc: SheetDoc; name: string; id: string; notes: string[] } | { ok: false; error: string };
export type SaveResult =
  | { ok: true; id: string; name: string; updatedAt: number }
  | { ok: false; error: string; existsId?: string };
export type DeleteResult = { ok: true } | { ok: false; error: string };

const MAX_DOCS = 200;
const NOT_LOGGED_IN = "Du skal være logget ind.";
const BUSY = "For mange handlinger lige nu. Prøv igen om lidt.";
const FAILED = "Det lykkedes ikke. Prøv igen.";
const NOT_FOUND = "Opgaven findes ikke.";

/** Højst så mange handlinger pr. 10 min — mod fejlklik i en løkke og misbrug. */
const limited = (userId: string) => opgavelabLimiter.limited(`docs:${userId}`, 120, 10 * 60 * 1000);

const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 64;

type Row = { id: string; name: string; subject: string; updated_at: number };

/** Lærerens opgaver, nyeste først. null = ikke logget ind, for mange kald eller fejl. */
export async function listDocs(): Promise<DocSummary[] | null> {
  const teacher = await getTeacher();
  if (!teacher || limited(teacher.id)) return null;
  try {
    // node:sqlite giver rækker uden prototype — kopieres til almindelige objekter.
    const rows = db()
      .prepare("select id, name, subject, updated_at from opgavelab_docs where user_id = ? order by updated_at desc, name")
      .all(teacher.id) as Row[];
    return rows.map((r) => ({ id: r.id, name: r.name, subject: r.subject, updatedAt: r.updated_at }));
  } catch {
    return null;
  }
}

export async function loadDoc(id: unknown): Promise<LoadResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, error: NOT_LOGGED_IN };
  if (!isId(id)) return { ok: false, error: NOT_FOUND };
  if (limited(teacher.id)) return { ok: false, error: BUSY };
  try {
    const row = db()
      .prepare("select id, name, data from opgavelab_docs where id = ? and user_id = ?")
      .get(id, teacher.id) as { id: string; name: string; data: string } | undefined;
    if (!row) return { ok: false, error: NOT_FOUND };
    let parsed: SheetDoc | null = null;
    const notes: string[] = [];
    try {
      parsed = parseDocument(JSON.parse(row.data), notes);
    } catch {
      parsed = null;
    }
    if (!parsed) return { ok: false, error: "Opgaven kan ikke åbnes — indholdet er beskadiget." };
    // Rækkens navn er autoritativt.
    return { ok: true, doc: { ...parsed, name: row.name }, name: row.name, id: row.id, notes };
  } catch {
    return { ok: false, error: FAILED };
  }
}

/** Samme navn uanset store/små bogstaver — også Æ/Ø/Å (SQLites lower() kender kun ASCII). */
function findByName(userId: string, name: string): { id: string } | null {
  const wanted = name.toLocaleLowerCase("da");
  const rows = db().prepare("select id, name from opgavelab_docs where user_id = ?").all(userId) as {
    id: string;
    name: string;
  }[];
  const hit = rows.find((r) => r.name.toLocaleLowerCase("da") === wanted);
  return hit ? { id: hit.id } : null;
}

export async function saveDoc(input: unknown): Promise<SaveResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, error: NOT_LOGGED_IN };
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, error: FAILED };
  if (limited(teacher.id)) return { ok: false, error: BUSY };
  const { id, name, data, overwrite } = input as Record<string, unknown>;

  const clean = cleanName(name);
  if (!clean) return { ok: false, error: `Skriv et navn på højst ${LIMITS.nameChars} tegn.` };
  const parsed = parseDocument(data);
  if (!parsed) return { ok: false, error: "Opgaven kunne ikke gemmes — indholdet er ugyldigt." };
  const json = JSON.stringify({ ...parsed, name: clean });
  if (Buffer.byteLength(json, "utf8") > LIMITS.jsonBytes) return { ok: false, error: "Opgaven er for stor til at blive gemt." };

  try {
    const conn = db();
    const now = Date.now();
    // Eget dokument: kun hvis id'et findes OG tilhører læreren — ellers er det en ny opgave.
    const own = isId(id)
      ? (conn.prepare("select id from opgavelab_docs where id = ? and user_id = ?").get(id, teacher.id) as
          | { id: string }
          | undefined)
      : undefined;
    const clash = findByName(teacher.id, clean);
    let targetId = own?.id ?? null;
    if (clash && clash.id !== targetId) {
      // Navnet findes på et ANDET af lærerens dokumenter.
      if (overwrite !== true) return { ok: false, error: "exists", existsId: clash.id };
      targetId = clash.id;
    }
    if (targetId) {
      conn
        .prepare("update opgavelab_docs set name = ?, subject = ?, data = ?, updated_at = ? where id = ? and user_id = ?")
        .run(clean, parsed.subject, json, now, targetId, teacher.id);
      return { ok: true, id: targetId, name: clean, updatedAt: now };
    }
    const { n } = conn.prepare("select count(*) as n from opgavelab_docs where user_id = ?").get(teacher.id) as {
      n: number;
    };
    if (n >= MAX_DOCS) return { ok: false, error: `Du kan højst gemme ${MAX_DOCS} opgaver. Slet nogle først.` };
    const newId = randomUUID();
    conn
      .prepare(
        `insert into opgavelab_docs (id, user_id, name, subject, data, created_at, updated_at)
         values (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(newId, teacher.id, clean, parsed.subject, json, now, now);
    return { ok: true, id: newId, name: clean, updatedAt: now };
  } catch (err) {
    // Samtidig gem med samme navn: unikheden vinder, og klienten spørger igen.
    if (String(err).includes("UNIQUE")) {
      const again = findByName(teacher.id, clean);
      return { ok: false, error: "exists", existsId: again?.id };
    }
    return { ok: false, error: FAILED };
  }
}

export async function deleteDoc(id: unknown): Promise<DeleteResult> {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false, error: NOT_LOGGED_IN };
  if (!isId(id)) return { ok: false, error: NOT_FOUND };
  if (limited(teacher.id)) return { ok: false, error: BUSY };
  try {
    const res = db().prepare("delete from opgavelab_docs where id = ? and user_id = ?").run(id, teacher.id);
    return res.changes > 0 ? { ok: true } : { ok: false, error: NOT_FOUND };
  } catch {
    return { ok: false, error: FAILED };
  }
}
