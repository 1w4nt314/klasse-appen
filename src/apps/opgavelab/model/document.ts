// Opgavelab — nyt dokument, nye objekter og id-generator (ren TS).

import { PAGE, DEFAULT_SETTINGS } from "./types";
import type {
  CalcObject,
  Document as SheetDoc,
  FigureKind,
  FigureObject,
  SheetObject,
  TextObject,
} from "./types";
import { defaultParams, figureBoundsOnSheet, getFigureDef } from "./figures";

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

/** Ny figur med bounding box centreret midt på arket (let forskudt pr. eksisterende figur). */
export function makeFigure(id: string, kind: FigureKind, existing: number): FigureObject | null {
  const def = getFigureDef(kind);
  if (!def) return null;
  const shape = def.defaultShape();
  const b = def.bounds(shape);
  const o = cascade(existing);
  const cx = PAGE.w / 2 + o;
  const cy = PAGE.h / 2 + o;
  return {
    id,
    type: "figure",
    figure: kind,
    x: cx - (b.minX + b.maxX) / 2,
    y: cy - (b.minY + b.maxY) / 2,
    shape,
    params: defaultParams(def),
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
