"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

const NOT_CONFIGURED: FormState = {
  error: "Login er ikke sat op endnu. Du kan prøve apps'ene uden login.",
};

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

/** Kun interne stier, så ?next= ikke kan sende folk ud af sitet. */
function safeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/apps";
}

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: str(form, "email"),
    password: String(form.get("password") ?? ""),
  });
  if (error) {
    if (error.code === "email_not_confirmed")
      return { error: "Du mangler at bekræfte din e-mail. Tjek din indbakke." };
    return { error: "Forkert e-mail eller adgangskode." };
  }
  redirect(safeNext(str(form, "next")));
}

export async function signup(_: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const fullName = str(form, "full_name");
  const school = str(form, "school");
  const email = str(form, "email");
  const password = String(form.get("password") ?? "");

  if (!fullName || !school || !email)
    return { error: "Udfyld venligst navn, skole og e-mail." };
  if (password.length < 8)
    return { error: "Adgangskoden skal være mindst 8 tegn." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, school },
      emailRedirectTo: `${await origin()}/auth/confirm?next=/apps`,
    },
  });
  if (error) {
    if (error.code === "user_already_exists")
      return { error: "Der findes allerede en bruger med den e-mail. Prøv at logge ind." };
    if (error.code === "weak_password")
      return { error: "Adgangskoden er for svag. Prøv en længere." };
    return { error: "Brugeren kunne ikke oprettes. Prøv igen om lidt." };
  }
  // Uden e-mailbekræftelse er brugeren logget ind med det samme.
  if (data.session) redirect("/apps");
  return {
    message: `Næsten færdig! Vi har sendt en mail til ${email}. Klik på linket i mailen for at aktivere din bruger.`,
  };
}

export async function requestPasswordReset(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const email = str(form, "email");
  if (!email) return { error: "Skriv din e-mail." };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/confirm?next=/ny-adgangskode`,
  });
  // Samme svar uanset om e-mailen findes, så man ikke kan lede efter brugere.
  return {
    message: "Hvis e-mailen findes hos os, har vi sendt et link til at vælge en ny adgangskode.",
  };
}

export async function updatePassword(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const password = String(form.get("password") ?? "");
  if (password.length < 8)
    return { error: "Adgangskoden skal være mindst 8 tegn." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Adgangskoden kunne ikke gemmes. Prøv igen." };
  redirect("/apps");
}
