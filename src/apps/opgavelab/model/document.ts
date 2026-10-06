// Opgavelab — nyt dokument, nye objekter og id-generator (ren TS).

import { PAGE, DEFAULT_SETTINGS } from "./types";
import type { CalcObject, Document as SheetDoc, DrillObject, FigureObject, SheetObject, TextObject } from "./types";
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
    objects: [],
  };
}

export const DEFAULT_TEXT = "Skriv opgavetekst her";
export const TEXT_DEFAULTS = { width: 120, sizePt: 12 } as const;

/** Forskydning, så nye objekter ikke lægger sig præcis oven på hinanden. */
function cascade(existing: number): number {
  return (existing % 6) * 8;
}

export function makeText(id: string, existing: number): TextObject {
  const o = cascade(existing);
  return {
    id,
    type: "text",
    x: PAGE.margin + 15 + o,
    y: PAGE.margin + 15 + o,
    width: TEXT_DEFAULTS.width,
    text: DEFAULT_TEXT,
    sizePt: TEXT_DEFAULTS.sizePt,
  };
}

/** Ny figur (figurens newShape) med bounding box centreret midt på arket (let forskudt pr. eksisterende figur). */
export function makeFigure<K extends FigureKind>(id: string, kind: K, existing: number): FigureObject | null {
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
export function makeDrill(id: string, existing: number, seed: number): DrillObject {
  const o = cascade(existing);
  return {
    id,
    type: "drill",
    x: PAGE.margin,
    y: PAGE.margin + 15 + o,
    width: DRILL_WIDTH,
    seed: seed >>> 0,
    config: { ...DEFAULT_DRILL_CONFIG, ops: [...DEFAULT_DRILL_CONFIG.ops], tables: [...DEFAULT_DRILL_CONFIG.tables] },
  };
}

/** Nyt regnestykke placeret under figuren (kan flyttes uafhængigt). */
export function makeCalc(id: string, fig: FigureObject, param: string, siblings: number): CalcObject {
  const b = figureBoundsOnSheet(fig);
  return {
    id,
    type: "calc",
    figureId: fig.id,
    param,
    x: b.minX,
    y: Math.min(b.maxY + 14 + siblings * 9, PAGE.h - PAGE.margin - 6),
  };
}

export function findObject(doc: SheetDoc, id: string | null): SheetObject | undefined {
  return id ? doc.objects.find((o) => o.id === id) : undefined;
}
