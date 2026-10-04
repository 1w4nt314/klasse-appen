/**
 * Simpel begrænsning i hukommelsen. Rækker til én instans; nulstilles ved genstart.
 */
const MAX_KEYS = 10_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

function bucket(key: string, windowMs: number) {
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  // Hårdt loft, så mange unikke nøgler ikke kan fylde hukommelsen: ryd udløbne,
  // og er der stadig for mange, de ældste (Map holder indsættelsesrækkefølgen).
  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    for (const k of buckets.keys()) {
      if (buckets.size <= MAX_KEYS * 0.9) break;
      if (k !== key) buckets.delete(k);
    }
  }
  return entry;
}

/** Tæl et forsøg og returnér true, hvis grænsen nu er overskredet. */
export function rateLimited(key: string, limit = 10, windowMs = 15 * 60 * 1000) {
  const entry = bucket(key, windowMs);
  entry.count++;
  return entry.count > limit;
}

/** Giv et forsøg tilbage — fx når et login lykkedes, så kun fejl tæller. */
export function refund(key: string) {
  const entry = buckets.get(key);
  if (entry && entry.count > 0) entry.count--;
}
