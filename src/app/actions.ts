"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isIPv6 } from "node:net";
import { consumeToken, createToken, peekToken } from "@/lib/auth-tokens";
import { knownDeviceId, rememberDevice } from "@/lib/known-device";
import { appUrl, emailEnabled, linkMail, sendMail } from "@/lib/mail";
import { loginLimiter, mailLimiter, signupLimiter } from "@/lib/rate-limit";
import {
  createUser,
  findUserByEmail,
  findUserById,
  hashPassword,
  markEmailVerified,
  releaseStaleSignup,
  setPassword,
  startSession,
  verifyPassword,
} from "@/lib/session";

export type FormState =
  | {
      error?: string;
      /** Neutral besked (fx "vi har sendt en mail, hvis …"). */
      notice?: string;
      /** Udfyldte felter (aldrig adgangskode), så formularen ikke tømmes ved fejl. */
      values?: Record<string, string>;
      /** Login: korrekt kode, men e-mailen er ikke bekræftet endnu. */
      unverified?: boolean;
      /** Oprettelse: bekræftelsesmail sendt til denne adresse. */
      sent?: string;
    }
  | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSWORD = 200;

function checkNewPassword(password: string, confirm: string) {
  if (password.length < 8) return "Adgangskoden skal være mindst 8 tegn.";
  if (password.length > MAX_PASSWORD) return "Adgangskoden er for lang.";
  if (password !== confirm) return "De to adgangskoder er ikke ens.";
  return null;
}

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
  const ip = parts?.at(-1) ?? "ukendt";
  // En IPv6-forbindelse råder typisk over et helt /64 — tæl det som én adresse.
  return isIPv6(ip) ? `${ipv6Prefix64(ip)}::/64` : ip;
}

/** De første fire grupper af en IPv6-adresse (udfolder "::"). */
function ipv6Prefix64(ip: string) {
  const [head, tail = ""] = ip.split("%")[0].split("::");
  const a = head ? head.split(":") : [];
  const b = ip.includes("::") ? (tail ? tail.split(":") : []) : [];
  const groups = ip.includes("::") ? [...a, ...Array(8 - a.length - b.length).fill("0"), ...b] : a;
  return groups.slice(0, 4).map((g) => (parseInt(g, 16) || 0).toString(16)).join(":");
}

const LOGIN_WINDOW = 15 * 60 * 1000;

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email: str(form, "email") };

  const ip = await clientIp();
  const user = email ? findUserByEmail(email) : undefined;
  // Fra en kendt enhed gælder kun enhedens egen grænse, som andre ikke kan
  // bruge op. Ukendte enheder: pr. IP+mail, pr. IP og en blød grænse pr. konto
  // (rammer kun nye enheder — lærerens egne kendte enheder kommer stadig ind).
  const deviceId = user ? await knownDeviceId(user.id) : null;
  const limits: [key: string, limit: number][] = deviceId
    ? [[`device:${deviceId}`, 10]]
    : [
        [`ip-mail:${ip}:${email}`, 10],
        [`ip:${ip}`, 50],
        [`account:${email}`, 100],
      ];
  const blocked = { error: "For mange forsøg. Vent et kvarter og prøv igen.", values };
  // Spærrede forsøg tælles ikke og opretter ingen nye nøgler.
  if (limits.some(([key, limit]) => loginLimiter.isOver(key, limit))) return blocked;
  // Forsøget tælles MED DET SAMME (før den langsomme kode-tjek), så samtidige
  // forespørgsler ikke kan smutte forbi grænsen. Et vellykket login gives tilbage.
  for (const [key] of limits) loginLimiter.hit(key, LOGIN_WINDOW);

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
  // Bekræftelse kræves kun, når der kan sendes mails (se lib/mail.ts).
  if (!user.email_verified_at && emailEnabled())
    return {
      error: "Du mangler at bekræfte din e-mail. Tjek din indbakke — og evt. spam.",
      values,
      unverified: true,
    };

  await rememberDevice(user.id);
  await startSession(user.id);
  redirect(safeNext(str(form, "next")));
}

export async function signup(_: FormState, form: FormData): Promise<FormState> {
  const fullName = str(form, "full_name");
  const school = str(form, "school");
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("password_confirm") ?? "");
  const values = { full_name: fullName, school, email: str(form, "email") };
  const fail = (error: string): FormState => ({ error, values });

  if (!fullName || !school || !email) return fail("Udfyld venligst navn, skole og e-mail.");
  if (!EMAIL_RE.test(email)) return fail("E-mailadressen ser ikke rigtig ud.");
  const passwordError = checkNewPassword(password, confirm);
  if (passwordError) return fail(passwordError);
  if (fullName.length > 120 || school.length > 160 || email.length > 254)
    return fail("Et af felterne er for langt.");

  if (signupLimiter.limited(`signup:${await clientIp()}`, 20, 60 * 60 * 1000))
    return fail("For mange oprettelser herfra. Prøv igen senere.");

  releaseStaleSignup(email);
  if (findUserByEmail(email))
    return fail("Der findes allerede en bruger med den e-mail. Prøv at logge ind.");

  // Uden mailopsætning oprettes brugeren som i dag og logges ind med det samme.
  const verified = !emailEnabled();
  const id = createUser({
    email,
    fullName,
    school,
    passwordHash: await hashPassword(password),
    verified,
  });
  if (verified) {
    await startSession(id);
    redirect("/apps");
  }
  await sendVerifyMail(id, email, fullName);
  return { sent: email };
}

async function sendVerifyMail(userId: string, email: string, name: string) {
  const link = `${await appUrl()}/bekraeft?token=${createToken(userId, "verify")}`;
  await sendMail(
    email,
    "Bekræft din e-mail til Klasse-appen",
    linkMail({
      greeting: `Hej ${name}`,
      lines: ["Tak fordi du har oprettet en bruger på Klasse-appen. Bekræft din e-mail, så er du klar."],
      button: "Bekræft min e-mail",
      link,
      footer: "Linket virker i 24 timer. Har du ikke oprettet en bruger, kan du se bort fra denne mail.",
    }),
  );
}

/** Grænse for mails pr. IP og pr. modtager. Overskrides den, sendes der bare ikke. */
async function mayMail(kind: string, email: string) {
  const ip = await clientIp();
  const W = 15 * 60 * 1000;
  return !mailLimiter.limited(`${kind}-ip:${ip}`, 10, W) && !mailLimiter.limited(`${kind}:${email}`, 3, W);
}

/** "Send link igen" fra login. Svarer det samme, uanset om mailen findes. */
export async function resendVerification(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  if (EMAIL_RE.test(email) && (await mayMail("verify", email))) {
    const user = findUserByEmail(email);
    if (user && !user.email_verified_at && !user.disabled_at && emailEnabled())
      void sendVerifyMail(user.id, user.email, user.full_name);
  }
  return { notice: "Hvis brugeren mangler at blive bekræftet, har vi sendt et nyt link. Tjek også spam." };
}

/**
 * Glemt adgangskode. Svaret er altid det samme og kommer lige hurtigt, uanset
 * om mailen findes — mailen sendes uden at vente på den.
 */
export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const values = { email: str(form, "email") };
  if (!EMAIL_RE.test(email) || email.length > 254)
    return { error: "E-mailadressen ser ikke rigtig ud.", values };

  if (await mayMail("reset", email)) {
    const user = findUserByEmail(email);
    if (user && !user.disabled_at) {
      const link = `${await appUrl()}/nulstil?token=${createToken(user.id, "reset")}`;
      void sendMail(
        user.email,
        "Nulstil din adgangskode til Klasse-appen",
        linkMail({
          greeting: `Hej ${user.full_name}`,
          lines: ["Vi har fået en anmodning om at nulstille adgangskoden til din bruger på Klasse-appen."],
          button: "Vælg ny adgangskode",
          link,
          footer:
            "Linket virker i 1 time og kan kun bruges én gang. Har du ikke bedt om det, kan du se bort fra mailen — din adgangskode er uændret.",
        }),
      );
    }
  }
  return {
    notice: `Hvis der findes en bruger med ${email}, har vi sendt en mail med et link til at nulstille adgangskoden. Linket virker i 1 time. Tjek også spam.`,
  };
}

/** Knappen på /bekraeft. (Et klik — ikke selve linket — bekræfter, så mail-scannere ikke bruger det op.) */
export async function confirmEmail(_: FormState, form: FormData): Promise<FormState> {
  const userId = consumeToken(form.get("token"), "verify");
  if (!userId) return { error: "Linket er udløbet eller allerede brugt. Prøv at logge ind." };
  markEmailVerified(userId);
  await startSession(userId);
  await rememberDevice(userId);
  redirect("/apps");
}

/** Ny adgangskode fra linket på /nulstil. Logger alle andre steder ud. */
export async function resetPassword(_: FormState, form: FormData): Promise<FormState> {
  const token = form.get("token");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("password_confirm") ?? "");
  if (!peekToken(token, "reset"))
    return { error: "Linket er udløbet eller allerede brugt. Bed om et nyt." };
  const passwordError = checkNewPassword(password, confirm);
  if (passwordError) return { error: passwordError };

  const passwordHash = await hashPassword(password);
  // Først nu bruges tokenet (engangs) — to samtidige forsøg kan ikke begge lykkes.
  const userId = consumeToken(token, "reset");
  if (!userId || !findUserById(userId))
    return { error: "Linket er udløbet eller allerede brugt. Bed om et nyt." };
  setPassword(userId, passwordHash);
  // Linket i mailen beviser, at man ejer adressen.
  markEmailVerified(userId);
  await startSession(userId);
  await rememberDevice(userId);
  redirect("/apps");
}
