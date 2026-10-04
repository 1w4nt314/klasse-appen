/**
 * Simpel begrænsning i hukommelsen. Rækker til én instans; nulstilles ved genstart.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function bucket(key: string, windowMs: number) {
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  // Ryd lidt op en gang imellem, så kortet ikke vokser uendeligt.
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  return entry;
}

/** Tæl et forsøg og returnér true, hvis grænsen nu er overskredet. */
export function rateLimited(key: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const entry = bucket(key, windowMs);
  entry.count++;
  return entry.count > limit;
}

/** Er grænsen nået? (Tæller ikke.) Bruges sammen med `hit` for kun at tælle fejl. */
export function isLimited(key: string, limit: number, windowMs: number) {
  return bucket(key, windowMs).count >= limit;
}

/** Tæl et (mislykket) forsøg. */
export function hit(key: string, windowMs: number) {
  bucket(key, windowMs).count++;
}
