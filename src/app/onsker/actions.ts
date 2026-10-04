"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getTeacher } from "@/lib/session";
import {
  MAX_BODY,
  MAX_PER_DAY,
  MAX_TITLE,
  WISH_CATEGORIES,
  WISH_STATUSES,
  type WishCategory,
  type WishStatus,
} from "@/lib/wishes";

export type WishFormState = { error?: string; ok?: boolean } | undefined;

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/\s+\n/g, "\n")
    .trim()
    .slice(0, max);

export async function createWish(_: WishFormState, form: FormData): Promise<WishFormState> {
  const teacher = await getTeacher();
  if (!teacher) return { error: "Du skal være logget ind." };

  const title = clean(form.get("title"), MAX_TITLE).replace(/\s+/g, " ");
  const body = clean(form.get("body"), MAX_BODY);
  const category = String(form.get("category") ?? "") as WishCategory;
  if (title.length < 3) return { error: "Skriv en kort overskrift (mindst 3 tegn)." };
  if (!(category in WISH_CATEGORIES)) return { error: "Vælg hvad ønsket handler om." };

  const conn = db();
  const { n } = conn
    .prepare("select count(*) as n from wishes where user_id = ? and created_at > ?")
    .get(teacher.id, Date.now() - 24 * 60 * 60 * 1000) as { n: number };
  if (n >= MAX_PER_DAY)
    return { error: `Du kan højst skrive ${MAX_PER_DAY} ønsker pr. døgn. Prøv igen i morgen.` };

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

export async function setLike(wishId: string, liked: boolean) {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false };
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
export async function deleteWish(wishId: string) {
  const teacher = await getTeacher();
  if (!teacher) return { ok: false };
  const result = teacher.isAdmin
    ? db().prepare("delete from wishes where id = ?").run(wishId)
    : db().prepare("delete from wishes where id = ? and user_id = ?").run(wishId, teacher.id);
  revalidatePath("/onsker");
  return { ok: result.changes > 0 };
}

export async function setWishStatus(wishId: string, status: WishStatus) {
  const teacher = await getTeacher();
  if (!teacher?.isAdmin || !(status in WISH_STATUSES)) return { ok: false };
  db().prepare("update wishes set status = ? where id = ?").run(status, wishId);
  revalidatePath("/onsker");
  return { ok: true };
}
