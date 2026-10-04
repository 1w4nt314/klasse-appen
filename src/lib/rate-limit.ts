/**
 * Simpel begrænsning af loginforsøg i hukommelsen. Rækker til én instans;
 * nulstilles ved genstart.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}
