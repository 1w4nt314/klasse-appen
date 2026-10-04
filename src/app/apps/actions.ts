"use server";

import { revalidatePath } from "next/cache";
import { getApp } from "@/apps/registry";
import { db } from "@/lib/db";
import { getTeacher } from "@/lib/session";

export async function setFavorite(slug: string, favorite: boolean) {
  const teacher = await getTeacher();
  if (!teacher || !getApp(slug)) return { ok: false };

  if (favorite) {
    db()
      .prepare(
        "insert or ignore into favorites (user_id, app_slug, created_at) values (?, ?, ?)",
      )
      .run(teacher.id, slug, Date.now());
  } else {
    db()
      .prepare("delete from favorites where user_id = ? and app_slug = ?")
      .run(teacher.id, slug);
  }

  revalidatePath("/apps");
  return { ok: true };
}
