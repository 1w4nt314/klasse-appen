"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getTeacher } from "@/lib/session";

/** Deaktivér eller genaktivér en bruger. Kun platform-admin, og ikke sig selv. */
export async function setUserDisabled(userId: string, disabled: boolean) {
  const admin = await getTeacher();
  if (!admin?.isAdmin) return { ok: false, error: "Kun for platform-admin." };
  if (userId === admin.id) return { ok: false, error: "Du kan ikke deaktivere dig selv." };

  const conn = db();
  const result = conn
    .prepare("update users set disabled_at = ? where id = ?")
    .run(disabled ? Date.now() : null, userId);
  if (result.changes === 0) return { ok: false, error: "Brugeren findes ikke." };
  // Log brugeren ud med det samme.
  if (disabled) conn.prepare("delete from sessions where user_id = ?").run(userId);

  revalidatePath("/admin");
  return { ok: true };
}
