import { connection } from "next/server";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export type Teacher = { id: string; name: string; school: string; email: string };

/** Den indloggede lærer, eller null. Caches pr. request. */
export const getTeacher = cache(async (): Promise<Teacher | null> => {
  // Altid dynamisk: siden afhænger af hvem der er logget ind.
  await connection();
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, school")
    .eq("id", user.id)
    .maybeSingle();

  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.full_name || meta.full_name || "",
    school: profile?.school || meta.school || "",
  };
});
