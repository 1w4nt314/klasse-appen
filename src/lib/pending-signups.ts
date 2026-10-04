import { createHash, randomBytes } from "node:crypto";
import { TOKEN_TTL } from "./auth-tokens";
import { db } from "./db";

/**
 * En oprettelse, der venter på, at e-mailen bliver bekræftet. Brugeren findes
 * først i `users`, når linket er brugt — så en fremmed hverken kan reservere,
 * slette eller overtage en lærers mail ved at oprette sig med den.
 */
export type PendingSignup = {
  email: string;
  full_name: string;
  school: string;
  password_hash: string;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function createPendingSignup(input: PendingSignup) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const conn = db();
  conn.prepare("delete from pending_signups where expires_at < ?").run(now);
  conn
    .prepare(
      `insert into pending_signups (token_hash, email, full_name, school, password_hash, expires_at, created_at)
       values (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(sha256(token), input.email, input.full_name, input.school, input.password_hash, now + TOKEN_TTL.verify, now);
  return token;
}

export function findPendingSignup(token: unknown) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return null;
  return (
    (db()
      .prepare(
        "select email, full_name, school, password_hash from pending_signups where token_hash = ? and expires_at > ?",
      )
      .get(sha256(token), Date.now()) as PendingSignup | undefined) ?? null
  );
}

/** Når en oprettelse er gennemført, er alle andre ventende for samme mail uden betydning. */
export function clearPendingSignups(email: string) {
  const conn = db();
  conn.prepare("delete from pending_signups where email = ? or expires_at < ?").run(email, Date.now());
}

/** Bruges som nøgle til at begrænse forsøg på ét link. */
export const pendingKey = (token: string) => sha256(token).slice(0, 32);
