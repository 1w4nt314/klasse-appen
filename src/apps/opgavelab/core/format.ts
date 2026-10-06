// Opgavelab — talformatering (da-DK) og små talhjælpere.
// Ingen runtime-imports (kun `import type`), så filen kan køres i Node med
// --experimental-strip-types.

import type { Fmt } from "../model/types";

/** Typografisk minus (U+2212). */
export const MINUS = "−";
/** Gangeprik (U+00B7). */
export const TIMES = "·";
export const DEG = "°";

const formatters = new Map<number, Intl.NumberFormat>();

function formatter(decimals: number): Intl.NumberFormat {
  let f = formatters.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat("da-DK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    formatters.set(decimals, f);
  }
  return f;
}

/** Tal med fast antal decimaler, decimalkomma og U+2212-minus. Aldrig "−0,0". */
export function fmtNum(n: number, decimals: number): string {
  if (!Number.isFinite(n)) return "?";
  const d = Math.max(0, Math.min(10, Math.floor(decimals)));
  const factor = 10 ** d;
  const rounded = Math.round(Math.abs(n) * factor) / factor;
  const text = formatter(d).format(rounded);
  return n < 0 && rounded !== 0 ? MINUS + text : text;
}

/** Længde i cm: altid 1 decimal, fx "5,0 cm". */
export function fmtLen(cm: number): string {
  return `${fmtNum(cm, 1)} cm`;
}

/** Vinkel i grader: 1 decimal, ",0" fjernes, fx "90°" og "36,9°". */
export function fmtAng(deg: number): string {
  const text = fmtNum(deg, 1);
  return (text.endsWith(",0") ? text.slice(0, -2) : text) + DEG;
}

/** Standard-formatering til solve(). */
export const FMT: Fmt = { len: fmtLen, ang: fmtAng, num: fmtNum };

/** Afrund v til nærmeste multiplum af step; step <= 0 giver v uændret. */
export function snap(v: number, step: number): number {
  if (!(step > 0)) return v;
  return Math.round(v / step) * step;
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
