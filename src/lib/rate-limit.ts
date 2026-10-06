/**
 * Simpel begrænsning i hukommelsen. Rækker til én instans; nulstilles ved genstart.
 * Hver slags grænse har sit eget kort, så en strøm af login-forsøg ikke kan
 * skubbe fx ønske-grænserne ud.
 */
type Entry = { count: number; resetAt: number };

export function createLimiter(maxKeys = 100_000) {
  const buckets = new Map<string, Entry>();

  // Trimmer ned til 90 %, så en fuld gennemgang højst sker for hver 10 % nye nøgler.
  const evict = (now: number) => {
    const target = Math.floor(maxKeys * 0.9);
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    for (const [k, v] of buckets) {
      if (buckets.size <= target) return;
      if (v.count <= 1) buckets.delete(k);
    }
    for (const k of buckets.keys()) {
      if (buckets.size <= target) return;
      buckets.delete(k);
    }
  };

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
     * Tæl et forsøg. Er kortet fuldt, ryddes først udløbne nøgler, så nøgler
     * med højst ét forsøg (de mindst værdifulde — fx et angrebs engangs-nøgler),
     * og til sidst de ældste. Nye forsøg afvises aldrig af pladshensyn, så en
     * oversvømmelse ikke kan lukke login for alle.
     */
    hit(key: string, windowMs: number) {
      const now = Date.now();
      let entry = live(key, now);
      if (!entry) {
        if (buckets.size >= maxKeys) evict(now);
        entry = { count: 0, resetAt: now + windowMs };
        buckets.set(key, entry);
      }
      entry.count++;
    },
    /** Giv et forsøg tilbage — fx når et login lykkedes, så kun fejl tæller. */
    refund(key: string) {
      const entry = live(key, Date.now());
      if (!entry) return;
      if (entry.count <= 1) buckets.delete(key);
      else entry.count--;
    },
    /** Tjek og tæl i ét. True = afvis. Afviste forsøg tælles ikke. */
    limited(key: string, limit: number, windowMs: number) {
      if (this.isOver(key, limit)) return true;
      this.hit(key, windowMs);
      return false;
    },
  };
}

export const loginLimiter = createLimiter();
export const signupLimiter = createLimiter();
export const wishLimiter = createLimiter();
export const likeLimiter = createLimiter();
export const mailLimiter = createLimiter();
export const zooLimiter = createLimiter();
export const opgavelabLimiter = createLimiter();
