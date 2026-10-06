// Opgavelab — layout af et regneark (ren TS, ingen React/DOM). Bruges af SheetSvg (tegning)
// og af objectBox (markering, flyt, margen, placeCalc). Layoutet er ens på opgave og svarark:
// pladsen til svaret er den bredeste af svarstregen og svarene, så intet flytter sig.

import { generate, type DrillItem } from "../core/drill";
import { itemLabel } from "../core/numbering";
import { PT_MM } from "../model/types";
import type { Bounds, DrillObject } from "../model/types";
import type { Measure } from "./textLayout";

/** Skriftstørrelse (pt) for titel og opgaver. */
export const DRILL_PT = 12;
/** Afstand mellem opgavernes grundlinjer (mm). */
export const DRILL_ROW_MM = 11;
/** Svarstregen på opgavearket (som regnestykkernes). */
export const DRILL_BLANK = "________";
/** mm mellem nummer og stykke, mellem "=" og svar, og mindst mellem kolonner. */
const LABEL_GAP = 3;
const ANSWER_GAP = 1.5;
const COL_GAP = 4;
/** mm mellem titlens grundlinje og første opgaves top. */
const TITLE_GAP = 3;
/** Grundlinjen ligger så langt under tekstens top (andel af skriftstørrelsen). */
const ASCENT = 0.95;
/** Tegnet tekst under grundlinjen (DejaVu Sans' linjeboks, som FONT_DESCENT i primitives). */
const DESCENT = 0.3;

export type DrillRun = {
  /** "3a" (fed). */
  label: string;
  /** "12 + 7 =" — højrestillet, så lighedstegnene står under hinanden i kolonnen. */
  text: string;
  /** Svaret ("19"); svarstregen tegnes i stedet på opgavearket. */
  answer: string;
  xLabel: number;
  /** Højre kant af stykket (text-anchor end). */
  xTextEnd: number;
  xAnswer: number;
  baseline: number;
};

export type DrillLayout = {
  sizeMm: number;
  title: { text: string; x: number; baseline: number } | null;
  items: DrillRun[];
  /** Kolonner, der faktisk bruges (højst config.columns; færre hvis blokken er for smal). */
  columns: number;
  /** Blokkens udstrækning på arket (mm). */
  box: Bounds;
};

/**
 * @param number blokkens nummer ("3"); opgaverne får "3a" … (≤ 26) eller "3.1" …
 */
export function layoutDrill(obj: DrillObject, number: string, measure: Measure): DrillLayout {
  const sizeMm = DRILL_PT * PT_MM;
  const items: DrillItem[] = generate(obj.config, obj.seed);
  const labels = items.map((_, i) => itemLabel(number, i, items.length));
  const labelW = Math.max(0, ...labels.map((l) => measure(l, DRILL_PT, true)));
  const textW = Math.max(0, ...items.map((it) => measure(it.text, DRILL_PT)));
  const answerW = Math.max(measure(DRILL_BLANK, DRILL_PT), ...items.map((it) => measure(it.answer, DRILL_PT)));
  const itemW = labelW + LABEL_GAP + textW + ANSWER_GAP + answerW;
  const fit = Math.floor((obj.width + COL_GAP) / (itemW + COL_GAP));
  const columns = Math.max(1, Math.min(obj.config.columns, fit));
  const colW = obj.width / columns;
  const rows = Math.max(1, Math.ceil(items.length / columns));

  const title = obj.config.title.trim();
  const titleRun = title ? { text: title, x: obj.x, baseline: obj.y + sizeMm * ASCENT } : null;
  const top = obj.y + (titleRun ? sizeMm * ASCENT + sizeMm * DESCENT + TITLE_GAP : 0);
  const first = top + sizeMm * ASCENT;

  const runs: DrillRun[] = items.map((it, i) => {
    // Kolonnevis: a, b, c … ned ad første kolonne, så videre i næste.
    const col = Math.floor(i / rows);
    const row = i % rows;
    const xLabel = obj.x + col * colW;
    const xTextEnd = xLabel + labelW + LABEL_GAP + textW;
    return {
      label: labels[i],
      text: it.text,
      answer: it.answer,
      xLabel,
      xTextEnd,
      xAnswer: xTextEnd + ANSWER_GAP,
      baseline: first + row * DRILL_ROW_MM,
    };
  });
  const usedCols = Math.max(1, Math.ceil(items.length / rows));
  const contentW = (usedCols - 1) * colW + itemW;
  const lastBaseline = first + (rows - 1) * DRILL_ROW_MM;
  return {
    sizeMm,
    title: titleRun,
    items: runs,
    columns,
    box: {
      minX: obj.x,
      minY: obj.y,
      maxX: obj.x + Math.max(obj.width, contentW, titleRun ? measure(title, DRILL_PT, true) : 0),
      maxY: lastBaseline + sizeMm * DESCENT,
    },
  };
}
