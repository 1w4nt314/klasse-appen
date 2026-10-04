/**
 * Simpel begrænsning i hukommelsen. Rækker til én instans; nulstilles ved genstart.
 * Hver slags grænse har sit eget kort, så en strøm af login-forsøg ikke kan
 * skubbe fx ønske-grænserne ud.
 */
type Entry = { count: number; resetAt: number };

export function createLimiter(maxKeys = 100_000) {
  const buckets = new Map<string, Entry>();
  let lastSweep = 0;

  const live = (key: string, now: number) => {
    const entry = buckets.get(key);
    return entry && entry.resetAt > now ? entry : undefined;
  };

  return {
    /** Er grænsen nået? Opretter ingen nøgle. */
    isOver(key: string, limit: number) {
      return (live(key, Date.now())?.count ?? 0) >= limit;
    },
    /**
     * Tæl et forsøg. Er kortet fuldt (kun udløbne nøgler ryddes — aktive
     * grænser slettes aldrig), afvises forsøget i stedet: returnerer false.
     */
    hit(key: string, windowMs: number) {
      const now = Date.now();
      let entry = live(key, now);
      if (!entry) {
        if (buckets.size >= maxKeys && now - lastSweep > 1000) {
          lastSweep = now;
          for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
        }
        if (buckets.size >= maxKeys) return false;
        entry = { count: 0, resetAt: now + windowMs };
        buckets.set(key, entry);
      }
      entry.count++;
      return true;
    },
    /** Giv et forsøg tilbage — fx når et login lykkedes, så kun fejl tæller. */
    refund(key: string) {
      const entry = live(key, Date.now());
      if (entry && entry.count > 0) entry.count--;
    },
    /** Tjek og tæl i ét. True = afvis. Afviste forsøg tælles ikke. */
    limited(key: string, limit: number, windowMs: number) {
      return this.isOver(key, limit) || !this.hit(key, windowMs);
    },
  };
}

export const loginLimiter = createLimiter();
export const signupLimiter = createLimiter();
export const wishLimiter = createLimiter();
export const likeLimiter = createLimiter();
