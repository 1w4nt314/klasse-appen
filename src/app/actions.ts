"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isKnownDevice, rememberDevice } from "@/lib/known-device";
import { loginLimiter, signupLimiter } from "@/lib/rate-limit";
import {
  createUser,
  findUserByEmail,
  hashPassword,
  startSession,
  verifyPassword,
} from "@/lib/session";

export type FormState =
  | {
      error?: string;
      /** Udfyldte felter (aldrig adgangskode), så formularen ikke tømmes ved fejl. */
      values?: Record<string, string>;
    }
  | undefined;

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

/** Kun interne stier, så ?next= ikke kan sende folk ud af sitet. */
function safeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/apps";
}

/**
 * Klientens IP. Render tilføjer den rigtige adresse SIDST i X-Forwarded-For;
 * de første led kan klienten selv have sat. Antager præcis én betroet proxy
 * (Render). Kommer der fx Cloudflare foran, skal det næstsidste led bruges.
 */
async function clientIp() {
  const h = await headers();
  const parts = h.get("x-forwarded-for")?.split(",").map((p) => p.trim()).filter(Boolean);
  return parts?.at(-1) ?? "ukendt";
}

const LOGIN_WINDOW = 15 * 60 * 1000;

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email: str(form, "email") };

  const ip = await clientIp();
  const user = email ? findUserByEmail(email) : undefined;
  // Fra en kendt enhed (har logget ind som denne lærer før) gælder en grænse,
  // som andre på samme IP ikke kan bruge op. Ellers: pr. IP+mail og pr. IP.
  const limits: [key: string, limit: number][] =
    user && (await isKnownDevice(user.id))
      ? [[`device:${user.id}:${ip}`, 10]]
      : [
          [`ip-mail:${ip}:${email}`, 10],
          [`ip:${ip}`, 50],
        ];
  const blocked = { error: "For mange forsøg. Vent et kvarter og prøv igen.", values };
  // Spærrede forsøg tælles ikke og opretter ingen nye nøgler.
  if (limits.some(([key, limit]) => loginLimiter.isOver(key, limit))) return blocked;
  // Forsøget tælles MED DET SAMME (før den langsomme kode-tjek), så samtidige
  // forespørgsler ikke kan smutte forbi grænsen. Et vellykket login gives tilbage.
  if (!limits.every(([key]) => loginLimiter.hit(key, LOGIN_WINDOW))) return blocked;

  // Tjek adgangskoden selv når brugeren ikke findes, så svartiden ikke afslører det.
  const ok = await verifyPassword(
    password,
    user?.password_hash ??
      "scrypt$00000000000000000000000000000000$" + "0".repeat(128),
  );
  if (!user || !ok) return { error: "Forkert e-mail eller adgangskode.", values };
  if (user.disabled_at)
    return { error: "Din bruger er deaktiveret. Kontakt Klasse-appen, hvis det er en fejl.", values };

  for (const [key] of limits) loginLimiter.refund(key);
  await rememberDevice(user.id);
  await startSession(user.id);
  redirect(safeNext(str(form, "next")));
}

export async function signup(_: FormState, form: FormData): Promise<FormState> {
  const fullName = str(form, "full_name");
  const school = str(form, "school");
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { full_name: fullName, school, email: str(form, "email") };
  const fail = (error: string): FormState => ({ error, values });

  if (!fullName || !school || !email) return fail("Udfyld venligst navn, skole og e-mail.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return fail("E-mailadressen ser ikke rigtig ud.");
  if (password.length < 8) return fail("Adgangskoden skal være mindst 8 tegn.");
  if (fullName.length > 120 || school.length > 160 || email.length > 254)
    return fail("Et af felterne er for langt.");

  if (signupLimiter.limited(`signup:${await clientIp()}`, 20, 60 * 60 * 1000))
    return fail("For mange oprettelser herfra. Prøv igen senere.");

  if (findUserByEmail(email))
    return fail("Der findes allerede en bruger med den e-mail. Prøv at logge ind.");

  const id = createUser({
    email,
    fullName,
    school,
    passwordHash: await hashPassword(password),
  });
  await startSession(id);
  redirect("/apps");
}
