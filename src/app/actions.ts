"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { isIPv6 } from "node:net";
import { consumeToken, createToken, peekToken } from "@/lib/auth-tokens";
import { knownDeviceId, rememberDevice } from "@/lib/known-device";
import { clearPendingSignups, createPendingSignup, findPendingSignup, pendingKey } from "@/lib/pending-signups";
import { appUrl, emailEnabled, linkMail, sendMail } from "@/lib/mail";
import { loginLimiter, mailLimiter, signupLimiter } from "@/lib/rate-limit";
import {
  createUser,
  findUserByEmail,
  findUserById,
  hashPassword,
  markEmailVerified,
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
  if (password.length > MAX_PASSWORD) return { error: "Forkert e-mail eller adgangskode.", values };

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
  // En bruger uden bekræftet mail (kun mulig fra tidlige test-udgaver) behandles
  // som ukendt — mailen er aldrig bevist.
  if (!user || !ok || !user.email_verified_at)
    return {
      // Samme svar for alle — også for en oprettelse, der endnu ikke er bekræftet.
      error: emailEnabled()
        ? "Forkert e-mail eller adgangskode. Har du lige oprettet dig, skal du først bekræfte din e-mail via linket i mailen."
        : "Forkert e-mail eller adgangskode.",
      values,
    };
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
  const confirm = String(form.get("password_confirm") ?? "");
  const values = { full_name: fullName, school, email: str(form, "email") };
  const fail = (error: string): FormState => ({ error, values });

  if (!fullName || !school || !email) return fail("Udfyld venligst navn, skole og e-mail.");
  if (!EMAIL_RE.test(email)) return fail("E-mailadressen ser ikke rigtig ud.");
  const passwordError = checkNewPassword(password, confirm);
  if (passwordError) return fail(passwordError);
  if (fullName.length > 120 || school.length > 160 || email.length > 254)
    return fail("Et af felterne er for langt.");

  const ip = await clientIp();
  if (signupLimiter.limited(`signup:${ip}`, 50, 60 * 60 * 1000))
    return fail("For mange oprettelser herfra. Prøv igen senere.");

  const passwordHash = await hashPassword(password);

  if (!emailEnabled()) {
    // Uden mail: som før — oprettet og logget ind med det samme.
    if (findUserByEmail(email))
      return fail("Der findes allerede en bruger med den e-mail. Prøv at logge ind.");
    const id = createUser({ email, fullName, school, passwordHash, verified: true });
    await startSession(id);
    redirect("/apps");
  }

  // Med mail: brugeren oprettes først, når linket i mailen er brugt (se
  // confirmSignup). Svaret er det samme, uanset om mailen findes — opslag og
  // afsendelse sker efter svaret. Grænsen pr. modtager tælles ens i begge
  // tilfælde, så ingen kan bombe en adresse med mails.
  if (mailLimiter.limited(`signup-ip:${ip}`, MAIL_IP_LIMIT, QUARTER)) return fail(tooManyFromHere);
  const base = await appUrl();
  if (recipientAllowed("signup", email))
    after(() => {
      const existing = findUserByEmail(email);
      if (existing) {
        if (existing.disabled_at) return;
        return sendMail(
          existing.email,
          "Du har allerede en bruger på Klasse-appen",
          linkMail({
            greeting: `Hej ${existing.full_name}`,
            lines: [
              "Nogen (måske dig) har prøvet at oprette en ny bruger på Klasse-appen med denne e-mail. Du har allerede en bruger, så der er ikke oprettet en ny.",
              "Har du glemt din adgangskode, kan du vælge en ny her:",
            ],
            button: "Nulstil adgangskode",
            link: `${base}/glemt`,
            footer: "Var det ikke dig, kan du se bort fra denne mail.",
          }),
        );
      }
      const token = createPendingSignup({ email, full_name: fullName, school, password_hash: passwordHash });
      return sendMail(
        email,
        "Bekræft din e-mail til Klasse-appen",
        linkMail({
          greeting: `Hej ${fullName}`,
          lines: [
            "Tak fordi du vil oprette en bruger på Klasse-appen. Bekræft din e-mail med den adgangskode, du valgte — så er din bruger oprettet.",
          ],
          button: "Bekræft min e-mail",
          link: `${base}/bekraeft?token=${token}`,
          footer:
            "Linket virker i 24 timer. Har du ikke selv prøvet at oprette en bruger, kan du se bort fra denne mail — så bliver der ikke oprettet noget.",
        }),
      );
    });
  return { sent: email };
}

/**
 * Grænser for mails:
 * - pr. IP (30/kvarter): overskrides den, får man en ærlig fejl — den siger
 *   intet om den enkelte mail, og en skole med fælles IP skal kunne se det.
 * - pr. modtager og slags (3/kvarter): overskrides den, sendes der bare ikke,
 *   og svaret er det samme. Ingen dagsgrænse, for den kunne en fremmed bruge
 *   op og spærre en lærer et helt døgn.
 */
const QUARTER = 15 * 60 * 1000;
const MAIL_IP_LIMIT = 30;
const tooManyFromHere = "For mange mails herfra lige nu. Vent et kvarter og prøv igen.";
const recipientAllowed = (kind: string, email: string) => !mailLimiter.limited(`${kind}:${email}`, 3, QUARTER);

/**
 * Glemt adgangskode. Svaret er altid det samme og kommer lige hurtigt, uanset
 * om mailen findes — opslag og afsendelse sker først efter svaret.
 *
 * Fra lærerens egen kendte enhed gælder grænsen pr. modtager ikke, så fremmede
 * ikke kan forhindre en lærer i at nulstille ved selv at bede om links.
 */
export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const values = { email: str(form, "email") };
  if (!emailEnabled())
    return { error: "Nulstilling via e-mail er ikke slået til endnu. Kontakt Klasse-appen.", values };
  if (!EMAIL_RE.test(email) || email.length > 254)
    return { error: "E-mailadressen ser ikke rigtig ud.", values };

  if (mailLimiter.limited(`reset-ip:${await clientIp()}`, MAIL_IP_LIMIT, QUARTER))
    return { error: tooManyFromHere, values };

  const base = await appUrl();
  after(async () => {
    const user = findUserByEmail(email);
    if (!user || user.disabled_at) return;
    const ownDevice = (await knownDeviceId(user.id)) !== null;
    if (!ownDevice && !recipientAllowed("reset", email)) return;
    return sendMail(
      user.email,
      "Nulstil din adgangskode til Klasse-appen",
      linkMail({
        greeting: `Hej ${user.full_name}`,
        lines: ["Vi har fået en anmodning om at nulstille adgangskoden til din bruger på Klasse-appen."],
        button: "Vælg ny adgangskode",
        link: `${base}/nulstil?token=${createToken(user.id, "reset")}`,
        footer:
          "Linket virker i 1 time og kan kun bruges én gang. Har du ikke bedt om det, kan du se bort fra mailen — din adgangskode er uændret.",
      }),
    );
  });
  return {
    notice: `Hvis der findes en bruger med ${email}, har vi sendt en mail med et link til at nulstille adgangskoden. Linket virker i 1 time. Tjek også spam.`,
  };
}

/**
 * /bekraeft: linket + den adgangskode, man valgte ved oprettelsen. Først her
 * oprettes brugeren. Koden gør, at kun den, der lavede oprettelsen, kan
 * gennemføre den. (Et klik — ikke selve linket — bekræfter, så mail-scannere
 * ikke bruger det op.)
 */
export async function confirmSignup(_: FormState, form: FormData): Promise<FormState> {
  const token = form.get("token");
  const password = String(form.get("password") ?? "");
  const pending = findPendingSignup(token);
  if (!pending) return { error: "Linket er udløbet eller allerede brugt. Opret dig igen." };
  if (mailLimiter.limited(`confirm:${pendingKey(token as string)}`, 10, QUARTER))
    return { error: "For mange forsøg. Vent et kvarter og prøv igen." };
  if (password.length > MAX_PASSWORD || !(await verifyPassword(password, pending.password_hash)))
    return { error: "Forkert adgangskode. Brug den, du valgte, da du oprettede brugeren." };

  if (findUserByEmail(pending.email)) {
    clearPendingSignups(pending.email);
    return { error: "Der findes allerede en bruger med denne e-mail. Prøv at logge ind." };
  }
  let id: string;
  try {
    id = createUser({
      email: pending.email,
      fullName: pending.full_name,
      school: pending.school,
      passwordHash: pending.password_hash,
      verified: true,
    });
  } catch (err) {
    // To bekræftelser på samme tid: den anden rammer unik-kravet på e-mail.
    if (String(err).includes("UNIQUE"))
      return { error: "Der findes allerede en bruger med denne e-mail. Prøv at logge ind." };
    throw err;
  }
  clearPendingSignups(pending.email);
  await startSession(id);
  await rememberDevice(id);
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
