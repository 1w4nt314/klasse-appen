"use server";

import { revalidatePath } from "next/cache";
import { getApp } from "@/apps/registry";
import { createClient } from "@/lib/supabase/server";

export async function setFavorite(slug: string, favorite: boolean) {
  if (!getApp(slug)) return { ok: false };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = favorite
    ? await supabase
        .from("favorites")
        .upsert({ user_id: user.id, app_slug: slug }, { ignoreDuplicates: true })
    : await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("app_slug", slug);

  revalidatePath("/apps");
  return { ok: !error };
}
