import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";

export type Teacher = { id: string; name: string; school: string; email: string };

const COOKIE = "klasse_session";
const SESSION_DAYS = 30;

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function createUser(input: {
  email: string;
  fullName: string;
  school: string;
  passwordHash: string;
}) {
  const id = randomUUID();
  db()
    .prepare(
      "insert into users (id, email, full_name, school, password_hash, created_at) values (?, ?, ?, ?, ?, ?)",
    )
    .run(id, input.email, input.fullName, input.school, input.passwordHash, Date.now());
  return id;
}

export function findUserByEmail(email: string) {
  return db()
    .prepare("select id, password_hash from users where email = ?")
    .get(email) as { id: string; password_hash: string } | undefined;
}

/** Opret en session og sæt cookien. Kun i Server Actions/Route Handlers. */
export async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const conn = db();
  conn.prepare("delete from sessions where expires_at < ?").run(Date.now());
  conn
    .prepare("insert into sessions (token_hash, user_id, expires_at) values (?, ?, ?)")
    .run(sha256(token), userId, expires);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) db().prepare("delete from sessions where token_hash = ?").run(sha256(token));
  store.delete(COOKIE);
}

/** Den indloggede lærer, eller null. Caches pr. request. */
export const getTeacher = cache(async (): Promise<Teacher | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `select u.id, u.email, u.full_name, u.school
         from sessions s join users u on u.id = s.user_id
        where s.token_hash = ? and s.expires_at > ?`,
    )
    .get(sha256(token), Date.now()) as
    | { id: string; email: string; full_name: string; school: string }
    | undefined;
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.full_name, school: row.school };
});

/** Som getTeacher, men sender til login hvis man ikke er logget ind. */
export async function requireTeacher(next: string) {
  const teacher = await getTeacher();
  if (!teacher) redirect(`/login?next=${encodeURIComponent(next)}`);
  return teacher;
}

export const SESSION_COOKIE = COOKIE;
