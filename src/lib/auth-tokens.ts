import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

/**
 * Engangs-links til bekræftelse af e-mail og nulstilling af adgangskode.
 * Kun en hash af tokenet gemmes, så en kopi af databasen ikke giver adgang.
 */
export type TokenPurpose = "verify" | "reset";

export const TOKEN_TTL: Record<TokenPurpose, number> = {
  verify: 24 * 60 * 60 * 1000,
  reset: 60 * 60 * 1000,
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Nyt token. Tidligere tokens af samme slags for brugeren ugyldiggøres. */
export function createToken(userId: string, purpose: TokenPurpose) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const conn = db();
  conn.prepare("delete from auth_tokens where expires_at < ?").run(now);
  conn.prepare("delete from auth_tokens where user_id = ? and purpose = ?").run(userId, purpose);
  conn
    .prepare(
      "insert into auth_tokens (token_hash, user_id, purpose, expires_at, created_at) values (?, ?, ?, ?, ?)",
    )
    .run(sha256(token), userId, purpose, now + TOKEN_TTL[purpose], now);
  return token;
}

/** Brugeren bag et gyldigt token — uden at bruge det. */
export function peekToken(token: unknown, purpose: TokenPurpose) {
  if (typeof token !== "string" || token.length < 20 || token.length > 100) return null;
  const row = db()
    .prepare(
      `select t.user_id from auth_tokens t join users u on u.id = t.user_id
        where t.token_hash = ? and t.purpose = ? and t.expires_at > ? and u.disabled_at is null`,
    )
    .get(sha256(token), purpose, Date.now()) as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

/** Brug tokenet (engangs). Returnerer bruger-id, eller null hvis ugyldigt/udløbet/brugt. */
export function consumeToken(token: unknown, purpose: TokenPurpose) {
  const userId = peekToken(token, purpose);
  if (!userId) return null;
  // Slettes i samme synkrone kald, så to samtidige forsøg ikke begge lykkes.
  const result = db()
    .prepare("delete from auth_tokens where token_hash = ? and purpose = ?")
    .run(sha256(token as string), purpose);
  return result.changes === 1 ? userId : null;
}
