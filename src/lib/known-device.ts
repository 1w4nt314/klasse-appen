import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

/**
 * "Kendt enhed" (OWASP): efter et vellykket login får browseren en signeret
 * cookie for den lærer. Fra en kendt enhed gælder en grænse, som kun den
 * enhed kan bruge op — så én elev bag skolens fælles IP ikke kan låse alle
 * lærerne ude ved at gætte forkert.
 */
const COOKIE = "klasse_device";
const MAX_USERS = 5;
const YEAR = 365 * 24 * 60 * 60 * 1000;

function secret() {
  const conn = db();
  conn
    .prepare("insert or ignore into app_secrets (name, value) values ('device', ?)")
    .run(randomBytes(32).toString("base64url"));
  const row = conn.prepare("select value from app_secrets where name = 'device'").get() as {
    value: string;
  };
  return row.value;
}

const sign = (userId: string) =>
  createHmac("sha256", secret()).update(`device:${userId}`).digest("base64url");

async function entries() {
  const raw = (await cookies()).get(COOKIE)?.value ?? "";
  return raw.split("~").filter(Boolean).slice(0, MAX_USERS);
}

export async function isKnownDevice(userId: string) {
  const expected = Buffer.from(`${userId}.${sign(userId)}`);
  return (await entries()).some((e) => {
    const b = Buffer.from(e);
    return b.length === expected.length && timingSafeEqual(b, expected);
  });
}

/** Kun i Server Actions/Route Handlers (sætter en cookie). */
export async function rememberDevice(userId: string) {
  const mine = `${userId}.${sign(userId)}`;
  const others = (await entries()).filter((e) => !e.startsWith(`${userId}.`));
  (await cookies()).set(COOKIE, [mine, ...others].slice(0, MAX_USERS).join("~"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + YEAR),
  });
}
