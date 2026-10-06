// Opgavelab — regneark: deterministisk generator af regnestykker (+ − · :).
// Kun seed + config gemmes; opgaverne genereres her, ens hver gang. Hver opgave har sin
// egen PRNG-strøm (mulberry32 seedet med seed og opgavens nummer), så et ændret antal ikke
// omrokerer de tidligere opgaver. Aldrig Math.random.
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

/** Den ene opgave nr. index (0-baseret) for (config, seed). */
export function generateItem(config: DrillConfig, seed: number, index: number): DrillItem {
  const rng = mulberry32(mixSeed(seed, index));
  const ops = DRILL_OPS.filter((o) => config.ops.includes(o));
  const list = ops.length > 0 ? ops : (["add"] as DrillOp[]);
  const op = list.length === 1 ? list[0] : list[int(rng, 0, list.length - 1)];
  const { aMin, aMax, bMin, bMax } = config;
  const factor = () => (config.tables.length > 0 ? config.tables[int(rng, 0, config.tables.length - 1)] : int(rng, bMin, bMax));
  const divisor = () => (config.tables.length > 0 ? config.tables[int(rng, 0, config.tables.length - 1)] : int(rng, Math.max(1, bMin), Math.max(1, bMax)));
  const sign = OP_SIGN[op];

  if (op === "add" || op === "sub") {
    const d = config.decimals;
    const k = 10 ** d;
    let a = int(rng, aMin * k, aMax * k);
    let b = int(rng, bMin * k, bMax * k);
    if (op === "sub" && config.noNegative && a < b) [a, b] = [b, a];
    const r = op === "add" ? a + b : a - b;
    return { op, a: a / k, b: b / k, text: `${fixedText(a, d)} ${sign} ${fixedText(b, d)} =`, answer: fixedText(r, d) };
  }
  if (op === "mul") {
    const a = int(rng, aMin, aMax);
    const b = factor();
    return { op, a, b, text: `${fixedText(a, 0)} ${sign} ${fixedText(b, 0)} =`, answer: fixedText(a * b, 0) };
  }
  // Division: b ≥ 1 altid.
  if (config.division === "exact") {
    const b = divisor();
    const q = int(rng, aMin, aMax);
    const a = b * q;
    return { op, a, b, text: `${fixedText(a, 0)} ${sign} ${fixedText(b, 0)} =`, answer: fixedText(q, 0) };
  }
  const a = int(rng, aMin, aMax);
  const b = divisor();
  const q = Math.floor(a / b);
  const r = a - q * b;
  return {
    op,
    a,
    b,
    text: `${fixedText(a, 0)} ${sign} ${fixedText(b, 0)} =`,
    answer: r === 0 ? fixedText(q, 0) : `${fixedText(q, 0)} rest ${fixedText(r, 0)}`,
  };
}

/** Alle opgaverne for (config, seed). Samme input giver altid samme output. */
export function generate(config: DrillConfig, seed: number): DrillItem[] {
  const n = Math.max(0, Math.floor(config.count));
  const out: DrillItem[] = [];
  for (let i = 0; i < n; i++) out.push(generateItem(config, seed, i));
  return out;
}
