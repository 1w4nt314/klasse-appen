"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getTeacher } from "@/lib/session";

/** Deaktivér eller genaktivér en bruger. Kun platform-admin, og ikke sig selv. */
export async function setUserDisabled(userId: unknown, disabled: unknown) {
  const admin = await getTeacher();
  if (!admin?.isAdmin) return { ok: false, error: "Kun for platform-admin." };
  if (typeof userId !== "string" || typeof disabled !== "boolean")
    return { ok: false, error: "Ugyldig forespørgsel." };
  if (userId === admin.id) return { ok: false, error: "Du kan ikke deaktivere dig selv." };

  const conn = db();
  const target = conn.prepare("select role from users where id = ?").get(userId) as
    | { role: string }
    | undefined;
  if (!target) return { ok: false, error: "Brugeren findes ikke." };
  // To admins må ikke kunne låse hinanden ude. Fjern admin-rollen via shell først.
  if (disabled && target.role === "admin")
    return { ok: false, error: "En admin kan ikke deaktiveres her. Fjern admin-rollen via serverens shell først." };

  const result = conn
    .prepare("update users set disabled_at = ? where id = ?")
    .run(disabled ? Date.now() : null, userId);
  if (result.changes === 0) return { ok: false, error: "Brugeren findes ikke." };
  // Log brugeren ud med det samme.
  if (disabled) conn.prepare("delete from sessions where user_id = ?").run(userId);

  revalidatePath("/admin");
  return { ok: true };
}
