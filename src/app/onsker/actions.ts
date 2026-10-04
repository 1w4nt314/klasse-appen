"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rateLimited } from "@/lib/rate-limit";
import { getTeacher } from "@/lib/session";
import { isCategory, isStatus, MAX_BODY, MAX_PER_DAY, MAX_TITLE } from "@/lib/wishes";

export type WishFormState =
  | {
      error?: string;
      ok?: boolean;
      /** Det udfyldte, så formularen ikke tømmes ved en fejl. */
      values?: { title: string; body: string; category: string };
    }
  | undefined;

const DAY = 24 * 60 * 60 * 1000;

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/\s+\n/g, "\n")
    .trim()
    .slice(0, max);

export async function createWish(_: WishFormState, form: FormData): Promise<WishFormState> {
  const teacher = await getTeacher();
  if (!teacher) return { error: "Du skal være logget ind." };

  const rawTitle = String(form.get("title") ?? "");
  const rawBody = String(form.get("body") ?? "");
  const category = form.get("category");
  const values = { title: rawTitle, body: rawBody, category: String(category ?? "") };
  if (rawTitle.trim().length > MAX_TITLE || rawBody.trim().length > MAX_BODY)
    return { error: "Teksten er for lang.", values };
  const title = clean(rawTitle, MAX_TITLE).replace(/\s+/g, " ");
  const body = clean(rawBody, MAX_BODY);
  if (title.length < 3) return { error: "Skriv en kort overskrift (mindst 3 tegn).", values };
  if (!isCategory(category)) return { error: "Vælg hvad ønsket handler om.", values };

  const conn = db();
  const { n } = conn
    .prepare("select count(*) as n from wishes where user_id = ? and created_at > ?")
    .get(teacher.id, Date.now() - DAY) as { n: number };
  // Tælleren i hukommelsen fanger også ønsker, der er oprettet og slettet igen.
  if (n >= MAX_PER_DAY || rateLimited(`wish:${teacher.id}`, MAX_PER_DAY, DAY))
    return {
      error: `Du kan højst skrive ${MAX_PER_DAY} ønsker pr. døgn. Prøv igen i morgen.`,
      values,
    };

  const id = randomUUID();
  conn
    .prepare(
      "insert into wishes (id, user_id, title, body, category, status, created_at) values (?, ?, ?, ?, ?, 'open', ?)",
    )
    .run(id, teacher.id, title, body, category, Date.now());
  // Man synes naturligvis selv om sit eget ønske.
  conn
    .prepare("insert or ignore into wish_likes (wish_id, user_id, created_at) values (?, ?, ?)")
    .run(id, teacher.id, Date.now());

  revalidatePath("/onsker");
  return { ok: true };
}

export async function setLike(wishId: unknown, liked: unknown) {
  const teacher = await getTeacher();
  if (!teacher || typeof wishId !== "string" || typeof liked !== "boolean") return { ok: false };
  if (rateLimited(`like:${teacher.id}`, 300, 10 * 60 * 1000)) return { ok: false };
  const conn = db();
  const exists = conn.prepare("select 1 from wishes where id = ?").get(wishId);
  if (!exists) return { ok: false };
  if (liked) {
    conn
      .prepare("insert or ignore into wish_likes (wish_id, user_id, created_at) values (?, ?, ?)")
      .run(wishId, teacher.id, Date.now());
  } else {
    conn.prepare("delete from wish_likes where wish_id = ? and user_id = ?").run(wishId, teacher.id);
  }
  revalidatePath("/onsker");
  return { ok: true };
}

/** Egne ønsker kan slettes af forfatteren; alle ønsker af platform-admin. */
export async function deleteWish(wishId: unknown) {
  const teacher = await getTeacher();
  if (!teacher || typeof wishId !== "string") return { ok: false };
  const result = teacher.isAdmin
    ? db().prepare("delete from wishes where id = ?").run(wishId)
    : db().prepare("delete from wishes where id = ? and user_id = ?").run(wishId, teacher.id);
  revalidatePath("/onsker");
  return { ok: result.changes > 0 };
}

export async function setWishStatus(wishId: unknown, status: unknown) {
  const teacher = await getTeacher();
  if (!teacher?.isAdmin || typeof wishId !== "string" || !isStatus(status)) return { ok: false };
  db().prepare("update wishes set status = ? where id = ?").run(status, wishId);
  revalidatePath("/onsker");
  return { ok: true };
}
