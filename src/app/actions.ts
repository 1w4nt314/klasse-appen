"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimited } from "@/lib/rate-limit";
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

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "ukendt";
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email: str(form, "email") };

  if (rateLimited(`login:${await clientIp()}:${email}`))
    return { error: "For mange forsøg. Vent et kvarter og prøv igen.", values };

  const user = email ? findUserByEmail(email) : undefined;
  // Tjek adgangskoden selv når brugeren ikke findes, så svartiden ikke afslører det.
  const ok = await verifyPassword(
    password,
    user?.password_hash ??
      "scrypt$00000000000000000000000000000000$" + "0".repeat(128),
  );
  if (!user || !ok) return { error: "Forkert e-mail eller adgangskode.", values };
  if (user.disabled_at)
    return { error: "Din bruger er deaktiveret. Kontakt Klasse-appen, hvis det er en fejl.", values };

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

  if (rateLimited(`signup:${await clientIp()}`, 20, 60 * 60 * 1000))
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
