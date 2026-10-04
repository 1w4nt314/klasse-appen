import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

/**
 * "Kendt enhed" (OWASP): efter et vellykket login får browseren en signeret
 * cookie med et tilfældigt enheds-id og de lærere, der har logget ind på den.
 * Fra en kendt enhed gælder en grænse pr. enhed, som ingen andre kan bruge op
 * — så én elev bag skolens fælles IP ikke kan låse lærerne ude.
 *
 * Format: `<enheds-id>~<bruger-id>.<signatur>~…`, signatur = HMAC(enhed:bruger).
 */
const COOKIE = "klasse_device";
const MAX_USERS = 5;
const YEAR = 365 * 24 * 60 * 60 * 1000;

let cachedSecret: string | undefined;
function secret() {
  if (cachedSecret) return cachedSecret;
  const conn = db();
  conn
    .prepare("insert or ignore into app_secrets (name, value) values ('device', ?)")
    .run(randomBytes(32).toString("base64url"));
  const row = conn.prepare("select value from app_secrets where name = 'device'").get() as {
    value: string;
  };
  return (cachedSecret = row.value);
}

const sign = (deviceId: string, userId: string) =>
  createHmac("sha256", secret()).update(`device:${deviceId}:${userId}`).digest("base64url");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

async function readCookie() {
  const [deviceId = "", ...entries] = ((await cookies()).get(COOKIE)?.value ?? "").split("~");
  // Kun gyldigt signerede poster tæller (og bliver gemt igen).
  const users = /^[\w-]{16,64}$/.test(deviceId)
    ? entries.slice(0, MAX_USERS).filter((e) => {
        const [userId = "", sig = ""] = e.split(".");
        return userId !== "" && safeEqual(sig, sign(deviceId, userId));
      })
    : [];
  return { deviceId: users.length ? deviceId : null, users };
}

/** Enheds-id'et, hvis browseren er en kendt enhed for denne lærer — ellers null. */
export async function knownDeviceId(userId: string) {
  const { deviceId, users } = await readCookie();
  return deviceId && users.some((e) => e.startsWith(`${userId}.`)) ? deviceId : null;
}

/** Kun i Server Actions/Route Handlers (sætter en cookie). */
export async function rememberDevice(userId: string) {
  const current = await readCookie();
  const deviceId = current.deviceId ?? randomBytes(16).toString("base64url");
  const others = current.users.filter((e) => !e.startsWith(`${userId}.`));
  const value = [deviceId, `${userId}.${sign(deviceId, userId)}`, ...others].slice(0, MAX_USERS + 1);
  (await cookies()).set(COOKIE, value.join("~"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + YEAR),
  });
}
