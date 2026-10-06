// Opgavelab — regneark: deterministisk generator af regnestykker (+ − · :).
// Kun seed + config gemmes; opgaverne genereres her, ens hver gang. Hver opgave har sin
// egen PRNG-strøm (mulberry32 seedet med seed og opgavens nummer), så et ændret antal ikke
// omrokerer de tidligere opgaver. Aldrig Math.random.
//
// Ingen gentagelser i samme blok: opgave i trækkes igen fra sin egen strøm (se DRILL_TRIES_MAX),
// så længe stykket allerede findes blandt opgave 0..i−1 ("3 + 5" og "5 + 3" regnes som det samme). Opgave i afhænger kun af opgaverne før den, så de første k opgaver er de samme,
// når antallet øges. Er talområdet for lille til lutter forskellige stykker, vælges det af
// forsøgene, der er brugt færrest gange indtil nu (gentagelser fordeles jævnt).
//
// Al regning sker i heltal (decimaltal trækkes som heltal × 10^d), og tallene formateres
// her uden flydende tal — derfor ingen 0,1 + 0,2-fejl. Ingen runtime-imports (kun
// `import type`), så filen kan køres i Node med --experimental-strip-types.

import type { DrillConfig, DrillOp } from "../model/types";

/** Regningsarterne i fast rækkefølge (validering og generator bruger den). */
export const DRILL_OPS: readonly DrillOp[] = ["add", "sub", "mul", "div"];

/** Tegnene på arket: plus, U+2212-minus, gangeprik, kolon. */
export const OP_SIGN: Record<DrillOp, string> = { add: "+", sub: "−", mul: "·", div: ":" };

export const DEFAULT_DRILL_CONFIG: DrillConfig = {
  ops: ["add"],
  count: 20,
  columns: 2,
  aMin: 10,
  aMax: 99,
  bMin: 1,
  bMax: 9,
  tables: [],
  division: "exact",
  noNegative: true,
  decimals: 0,
  title: "Regn stykkerne",
};

export type DrillItem = {
  op: DrillOp;
  /** Tallene i stykket (med decimaler: den rigtige værdi, fx 12,3). */
  a: number;
  b: number;
  /** "12 + 7 =" */
  text: string;
  /** "19", "−3", "3 rest 1", "4,5" */
  answer: string;
};

/** mulberry32: lille, hurtig 32-bit PRNG; returnerer tal i [0, 1). */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed til opgave nr. index (0-baseret): uafhængig af antallet af opgaver. */
export function mixSeed(seed: number, index: number): number {
  return (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
}

/** Heltal i [lo, hi] (begge med). */
function int(rng: () => number, lo: number, hi: number): number {
  if (hi <= lo) return lo;
  return lo + Math.floor(rng() * (hi - lo + 1));
}

/**
 * Heltallet n vist med d decimaler (n er tallet × 10^d): decimalkomma, punktum som
 * tusindtalsseparator og U+2212-minus — som fmtNum i core/format.ts, men uden flydende tal.
 */
export function fixedText(n: number, d: number): string {
  const neg = n < 0;
  const abs = String(Math.abs(Math.trunc(n)));
  const padded = abs.padStart(d + 1, "0");
  const intPart = padded.slice(0, padded.length - d) || "0";
  const frac = d > 0 ? padded.slice(padded.length - d) : "";
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const text = frac ? `${grouped},${frac}` : grouped;
  return neg && Math.trunc(n) !== 0 ? `−${text}` : text;
}

/**
 * Højst så mange udtræk pr. opgave, mens der ledes efter et stykke, der ikke er brugt endnu (et lille
 * talområde, hvor kun få stykker er tilbage, kan kræve mange). Giver også det en gentagelse, er
 * talområdet (næsten sikkert) brugt op på det niveau, og de følgende opgaver nøjes med et stykke, der
 * højst er brugt lige så mange gange — så gentagelserne fordeles jævnt og hurtigt.
 */
export const DRILL_TRIES_MAX = 1000;

/** Ét udtræk som heltal (+/− med decimaler: tallet × 10^decimals). */
type Raw = { op: DrillOp; a: number; b: number };

/**
 * Ens stykker har samme nøgle. Ved + og · (uden tabeller) er rækkefølgen ligegyldig ("3 + 5" = "5 + 3");
 * med tabeller hører "3 · 2" til 2-tabellen og "2 · 3" til 3-tabellen, så de er forskellige.
 */
function rawKey(config: DrillConfig, r: Raw): string {
  const sym = r.op === "add" || (r.op === "mul" && config.tables.length === 0);
  const [p, q] = sym && r.b < r.a ? [r.b, r.a] : [r.a, r.b];
  return `${r.op}:${p}:${q}`;
}

/** Nøglen for en færdig opgave (ens stykker ↔ ens nøgle, som under genereringen). */
export function itemKey(config: DrillConfig, it: DrillItem): string {
  return rawKey(config, { op: it.op, a: it.a, b: it.b });
}

/** Den ene opgave nr. index (0-baseret) for (config, seed), uden hensyn til de andre opgaver. */
export function generateItem(config: DrillConfig, seed: number, index: number): DrillItem {
  return toItem(config, drawRaw(config, mulberry32(mixSeed(seed, index))));
}

/** Ét udtræk fra strømmen `rng` (kun tal; teksten laves af toItem). */
function drawRaw(config: DrillConfig, rng: () => number): Raw {
  const ops = DRILL_OPS.filter((o) => config.ops.includes(o));
  const list = ops.length > 0 ? ops : (["add"] as DrillOp[]);
  const op = list.length === 1 ? list[0] : list[int(rng, 0, list.length - 1)];
  const { aMin, aMax, bMin, bMax } = config;
  const factor = () => (config.tables.length > 0 ? config.tables[int(rng, 0, config.tables.length - 1)] : int(rng, bMin, bMax));
  // Divisor ≥ 1 altid. ": 1" springes over, når intervallet tillader en divisor ≥ 2 (trækkes om fra 2–bMax,
  // så de øvrige udtræk er uændrede). Tabeller bruges som valgt (også 1).
  const divisor = () => {
    if (config.tables.length > 0) return config.tables[int(rng, 0, config.tables.length - 1)];
    const hi = Math.max(1, bMax);
    const b = int(rng, Math.max(1, bMin), hi);
    return b === 1 && hi >= 2 ? int(rng, 2, hi) : b;
  };

  if (op === "add" || op === "sub") {
    const k = 10 ** config.decimals;
    let a = int(rng, aMin * k, aMax * k);
    let b = int(rng, bMin * k, bMax * k);
    if (op === "sub" && config.noNegative && a < b) [a, b] = [b, a];
    return { op, a, b };
  }
  if (op === "mul") {
    const a = int(rng, aMin, aMax);
    return { op, a, b: factor() };
  }
  if (config.division === "exact") {
    const b = divisor();
    return { op, a: b * int(rng, aMin, aMax), b };
  }
  let a = int(rng, aMin, aMax);
  const b = divisor();
  // Med rest: dividenden er mindst divisoren ("1 : 7 = 0 rest 1" giver ingen mening), når intervallet tillader det.
  if (a < b && aMax >= b) a = int(rng, Math.max(aMin, b), aMax);
  return { op, a, b };
}

/** Teksten og svaret til et udtræk. */
function toItem(config: DrillConfig, { op, a, b }: Raw): DrillItem {
  const sign = OP_SIGN[op];
  if (op === "add" || op === "sub") {
    const d = config.decimals;
    const k = 10 ** d;
    const r = op === "add" ? a + b : a - b;
    return { op, a: a / k, b: b / k, text: `${fixedText(a, d)} ${sign} ${fixedText(b, d)} =`, answer: fixedText(r, d) };
  }
  const text = `${fixedText(a, 0)} ${sign} ${fixedText(b, 0)} =`;
  if (op === "mul") return { op, a, b, text, answer: fixedText(a * b, 0) };
  // Division: b ≥ 1 altid.
  const q = Math.floor(a / b);
  const r = a - q * b;
  return { op, a, b, text, answer: r === 0 ? fixedText(q, 0) : `${fixedText(q, 0)} rest ${fixedText(r, 0)}` };
}

/**
 * Alle opgaverne for (config, seed). Samme input giver altid samme output, og opgave i afhænger
 * kun af opgave 0..i−1 (præfiks-stabil). Første udtræk er generateItem(config, seed, i).
 */
export function generate(config: DrillConfig, seed: number): DrillItem[] {
  // Layout, nummerering og advarsler genererer samme blok flere gange pr. tegning: genbrug resultatet.
  const memoKey = `${seed >>> 0}|${JSON.stringify(config)}`;
  const hit = memo.get(memoKey);
  if (hit) return hit.slice();
  const items = generateUncached(config, seed);
  if (memo.size >= MEMO_MAX) memo.delete(memo.keys().next().value as string);
  memo.set(memoKey, items);
  return items.slice();
}

const MEMO_MAX = 64;
const memo = new Map<string, DrillItem[]>();

function generateUncached(config: DrillConfig, seed: number): DrillItem[] {
  const n = Math.max(0, Math.floor(config.count));
  const out: DrillItem[] = [];
  const used = new Map<string, number>();
  // Hvor mange gange hvert stykke mindst er brugt, når talområdet er brugt op (0 = der er stadig ubrugte).
  let level = 0;
  for (let i = 0; i < n; i++) {
    const rng = mulberry32(mixSeed(seed, i));
    let best: Raw | null = null;
    let bestUses = Infinity;
    for (let t = 0; t < DRILL_TRIES_MAX; t++) {
      const raw = drawRaw(config, rng);
      const uses = used.get(rawKey(config, raw)) ?? 0;
      if (uses < bestUses) {
        best = raw;
        bestUses = uses;
      }
      if (bestUses <= level) break;
    }
    if (bestUses > level) level = bestUses;
    const raw = best as Raw;
    used.set(rawKey(config, raw), bestUses + 1);
    out.push(toItem(config, raw));
  }
  return out;
}
