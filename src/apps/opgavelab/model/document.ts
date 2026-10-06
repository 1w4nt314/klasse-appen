// Opgavelab — nyt dokument, nye objekter og id-generator (ren TS).

import { PAGE, DEFAULT_SETTINGS } from "./types";
import type { CalcObject, Document as SheetDoc, DrillObject, FigureObject, FormulaObject, SheetObject, TextObject } from "./types";
import { DEFAULT_DRILL_CONFIG } from "../core/drill";
import { FIGURES, asFigure, type FigureKind } from "../figures/registry";
import { defaultParams, figureBoundsOnSheet } from "./figures";

let counter = 0;

/** Kort, unikt id til et objekt (unikt nok inden for ét ark og på tværs af sessioner). */
export function newId(prefix = "o"): string {
  counter += 1;
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${counter.toString(36)}${rnd}`;
}

export function newDocument(name = ""): SheetDoc {
  return {
    schemaVersion: 1,
    subject: "matematik",
    name,
    settings: { ...DEFAULT_SETTINGS },
    pageCount: 1,
    objects: [],
  };
}

export const DEFAULT_TEXT = "Skriv opgavetekst her";
export const TEXT_DEFAULTS = { width: 120, sizePt: 12 } as const;

/** Forskydning, så nye objekter ikke lægger sig præcis oven på hinanden. */
function cascade(existing: number): number {
  return (existing % 6) * 8;
}

/** Nye objekter lægges på siden `page` (0-baseret; standard første side). */
export function makeText(id: string, existing: number, page = 0): TextObject {
  const o = cascade(existing);
  return {
    id,
    type: "text",
    x: PAGE.margin + 15 + o,
    y: PAGE.margin + 15 + o,
    width: TEXT_DEFAULTS.width,
    text: DEFAULT_TEXT,
    sizePt: TEXT_DEFAULTS.sizePt,
    page,
  };
}

/** Ny figur (figurens newShape) med bounding box centreret midt på arket (let forskudt pr. eksisterende figur). */
export function makeFigure<K extends FigureKind>(id: string, kind: K, existing: number, page = 0): FigureObject | null {
  if (!Object.prototype.hasOwnProperty.call(FIGURES, kind)) return null;
  const def = FIGURES[kind];
  const shape = def.newShape();
  const b = def.bounds(shape);
  const o = cascade(existing);
  const cx = PAGE.w / 2 + o;
  const cy = PAGE.h / 2 + o;
  return asFigure<K>({
    id,
    type: "figure",
    figure: kind,
    x: cx - (b.minX + b.maxX) / 2,
    y: cy - (b.minY + b.maxY) / 2,
    shape,
    params: defaultParams(def),
    page,
  });
}

/**
 * Nyt seed til et regneark (uint32). Kaldes i event-handleren (aldrig under rendering eller i
 * reduceren), så samme handling altid giver samme dokument.
 */
export function newSeed(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

export const DRILL_WIDTH = 180;

/** Nyt regneark med standardindstillinger: ved venstre margen, let forskudt nedad pr. eksisterende regneark. */
export function makeDrill(id: string, existing: number, seed: number, page = 0): DrillObject {
  const o = cascade(existing);
  return {
    id,
    type: "drill",
    x: PAGE.margin,
    y: PAGE.margin + 15 + o,
    width: DRILL_WIDTH,
    seed: seed >>> 0,
    config: { ...DEFAULT_DRILL_CONFIG, ops: [...DEFAULT_DRILL_CONFIG.ops], tables: [...DEFAULT_DRILL_CONFIG.tables] },
    page,
  };
}

export const FORMULA_WIDTH = 120;
export const DEFAULT_FORMULA_LINES = ["3 · (4 + 5) ="];
export const DEFAULT_FORMULA_TITLE = "Regn ud";

/** Ny formelblok med ét eksempel-stykke: ved venstre margen, let forskudt nedad pr. eksisterende blok. */
export function makeFormula(id: string, existing: number, page = 0): FormulaObject {
  const o = cascade(existing);
  return {
    id,
    type: "formula",
    x: PAGE.margin,
    y: PAGE.margin + 15 + o,
    width: FORMULA_WIDTH,
    lines: [...DEFAULT_FORMULA_LINES],
    decimals: 2,
    title: DEFAULT_FORMULA_TITLE,
    page,
  };
}

/** Nyt regnestykke placeret under figuren (kan flyttes uafhængigt) — altid på figurens side. */
export function makeCalc(id: string, fig: FigureObject, param: string, siblings: number): CalcObject {
  const b = figureBoundsOnSheet(fig);
  return {
    id,
    type: "calc",
    figureId: fig.id,
    param,
    x: b.minX,
    y: Math.min(b.maxY + 14 + siblings * 9, PAGE.h - PAGE.margin - 6),
    page: fig.page,
  };
}

export function findObject(doc: SheetDoc, id: string | null): SheetObject | undefined {
  return id ? doc.objects.find((o) => o.id === id) : undefined;
}

/** Objekterne på siden `page` (0-baseret), i dokumentets rækkefølge. */
export function pageObjects(doc: SheetDoc, page: number): SheetObject[] {
  return doc.objects.filter((o) => o.page === page);
}

/** Siden (0-baseret), objektet står på — eller null, hvis det ikke findes. */
export function pageOf(doc: SheetDoc, id: string | null): number | null {
  return findObject(doc, id)?.page ?? null;
}
