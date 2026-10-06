// Opgavelab — tekst- og objektlayout (ren TS, ingen React/DOM). Bruges af både
// SheetSvg (tegning) og editoren (markering, grænser).

import { FMT } from "../core/format";
import { displayName, displayNames, getFigureDef, figureBoundsOnSheet, visibleParams } from "../model/figures";
import type { Bounds, CalcObject, Document as SheetDoc, FigureObject, SheetObject, TextObject } from "../model/types";

export const PT_MM = 25.4 / 72;
export const LINE_HEIGHT = 1.3;
export const WRAP_SAFETY = 0.98;

/** Måler tekstbredde i mm for en given skriftstørrelse (pt). */
export type Measure = (text: string, sizePt: number, bold?: boolean) => number;

/** Groft skøn, når der ikke er nogen måler (før fonten er hentet). */
export const estimateMeasure: Measure = (text, sizePt) => text.length * sizePt * PT_MM * 0.58;

/** Ombryder tekst (respekterer \n) til linjer, der højst er widthMm brede. */
export function wrapLines(text: string, widthMm: number, sizePt: number, measure: Measure): string[] {
  const max = Math.max(1, widthMm * WRAP_SAFETY);
  const out: string[] = [];
  for (const para of text.replace(/\r\n?/g, "\n").split("\n")) {
    const words = para.split(/ +/).filter((w) => w.length > 0);
    if (words.length === 0) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate, sizePt) <= max) {
        line = candidate;
        continue;
      }
      if (line) out.push(line);
      line = "";
      // Meget lange ord brydes tegn for tegn.
      let rest = word;
      while (measure(rest, sizePt) > max && rest.length > 1) {
        let n = rest.length - 1;
        while (n > 1 && measure(rest.slice(0, n), sizePt) > max) n -= 1;
        out.push(rest.slice(0, n));
        rest = rest.slice(n);
      }
      line = rest;
    }
    out.push(line);
  }
  return out;
}

export type TextLayout = { lines: string[]; sizeMm: number; lineH: number; ascent: number; height: number };

export function layoutText(obj: TextObject, measure: Measure): TextLayout {
  const sizeMm = obj.sizePt * PT_MM;
  const lines = wrapLines(obj.text, obj.width, obj.sizePt, measure);
  const lineH = sizeMm * LINE_HEIGHT;
  return { lines, sizeMm, lineH, ascent: sizeMm * 0.95, height: Math.max(1, lines.length) * lineH };
}

export const CALC_PT = 12;
export const CALC_GAP = 3;
export const BLANK = "________";

export type CalcContent = { number: string; body: string; sizeMm: number; widthMm: number };

/**
 * Indholdet af et regnestykke: opgave → "X = ________", svarark →
 * "X = 180° − A − B = 180° − 36,9° − 53,1° = 90°" (substituted kun hvis den afviger).
 * Er facit afrundet, står "≈" før det: "a = √(c² − b²) = √(11,1² − 9,3²) ≈ 6,1 cm".
 */
export function calcContent(
  doc: SheetDoc,
  calc: CalcObject,
  mode: "opgave" | "svarark",
  number: string,
  measure: Measure,
): CalcContent {
  const fig = doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === calc.figureId);
  const name = fig ? displayName(fig, calc.param) : calc.param;
  let body = `${name} = ${BLANK}`;
  if (mode === "svarark" && fig) {
    const def = getFigureDef(fig.figure);
    const sol = def?.solve(calc.param, visibleParams(fig), def.compute(fig.shape), displayNames(fig), FMT, doc.settings);
    if (sol) {
      const rhs = sol.formula.includes(" = ") ? sol.formula.slice(sol.formula.indexOf(" = ") + 3) : sol.formula;
      body = sol.formula;
      if (sol.substituted && sol.substituted !== rhs) body += ` = ${sol.substituted}`;
      body += ` ${sol.approx ? "≈" : "="} ${sol.result}`;
    } else {
      body = `${name} = ?`;
    }
  }
  const sizeMm = CALC_PT * PT_MM;
  const numW = number ? measure(number, CALC_PT, true) + CALC_GAP : 0;
  return { number, body, sizeMm, widthMm: numW + measure(body, CALC_PT) };
}

/**
 * Objektets udstrækning på arket i mm (til markering og grænser). Et regnestykke er bredest
 * på svararket (standard); `mode: "opgave"` giver den smalle "X = ____"-boks til markering.
 */
export function objectBox(
  obj: SheetObject,
  doc: SheetDoc,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  mode: "opgave" | "svarark" = "svarark",
): Bounds {
  if (obj.type === "figure") return figureBoundsOnSheet(obj);
  if (obj.type === "text") {
    const l = layoutText(obj, measure);
    return { minX: obj.x, minY: obj.y, maxX: obj.x + obj.width, maxY: obj.y + l.height };
  }
  const c = calcContent(doc, obj, mode, numbering.get(obj.id) ?? "", measure);
  return { minX: obj.x, minY: obj.y, maxX: obj.x + c.widthMm, maxY: obj.y + c.sizeMm * LINE_HEIGHT };
}
