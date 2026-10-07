// Opgavelab — rene sideoperationer på et dokument (ingen React/DOM; testbar i Node med
// --experimental-strip-types, derfor kun `import type`). Reduceren (editor/useDocument.ts) kalder dem.
//
// Invarianter, som alle funktioner bevarer:
//  - 1 ≤ pageCount ≤ MAX_PAGES, og alle objekter har 0 ≤ page < pageCount (tomme sider er tilladt);
//  - et regnestykke står altid på sin figurs side (calc.page === figurens page).
// En ugyldig handling (side uden for intervallet, sidste side, for mange sider, ukendt id, et regnestykke
// alene) giver det UÆNDREDE dokument (samme reference), så kalderen kan se, at intet skete.

import type { CalcObject, Document as SheetDoc, SheetObject } from "./types";

/** = LIMITS.pages (model/types.ts; filen må ikke importere runtime-værdier). */
export const MAX_PAGES = 20;
/** = PAGE.w, PAGE.h, PAGE.margin (model/types.ts). */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;
/** Som makeCalc: et regnestykkes anker højst så langt fra arkets bund (mm). */
const CALC_BOTTOM = 6;

const isPage = (doc: SheetDoc, p: number) => Number.isInteger(p) && p >= 0 && p < doc.pageCount;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** Ny tom side efter siden `after` (−1 = først); senere sider rykker én frem. Fuldt → uændret. */
export function insertPage(doc: SheetDoc, after: number): SheetDoc {
  if (doc.pageCount >= MAX_PAGES || !Number.isInteger(after) || after < -1 || after >= doc.pageCount) return doc;
  return {
    ...doc,
    pageCount: doc.pageCount + 1,
    objects: doc.objects.map((o) => (o.page > after ? { ...o, page: o.page + 1 } : o)),
  };
}

/**
 * Sletter siden `index` med alle dens objekter (regnestykker følger deres figur), og senere sider rykker
 * én tilbage. Den sidste side kan ikke slettes (uændret).
 */
export function removePage(doc: SheetDoc, index: number): SheetDoc {
  if (doc.pageCount <= 1 || !isPage(doc, index)) return doc;
  const gone = new Set(doc.objects.filter((o) => o.page === index && o.type === "figure").map((o) => o.id));
  return {
    ...doc,
    pageCount: doc.pageCount - 1,
    objects: doc.objects
      .filter((o) => o.page !== index && !(o.type === "calc" && gone.has(o.figureId)))
      .map((o) => (o.page > index ? { ...o, page: o.page - 1 } : o)),
  };
}

/** Bytter siderne i og j (med alt indhold; nummereringen følger med). Ugyldig eller i = j → uændret. */
export function swapPages(doc: SheetDoc, i: number, j: number): SheetDoc {
  if (!isPage(doc, i) || !isPage(doc, j) || i === j) return doc;
  return {
    ...doc,
    objects: doc.objects.map((o) => (o.page === i ? { ...o, page: j } : o.page === j ? { ...o, page: i } : o)),
  };
}

/** Et regnestykkes nye anker, når figuren flyttes (dx, dy) — standard: holdt inden for margenen som makeCalc. */
export type CalcFollow = (calc: CalcObject, dx: number, dy: number) => { x: number; y: number };

export const followInMargin: CalcFollow = (c, dx, dy) =>
  dx === 0 && dy === 0
    ? { x: c.x, y: c.y }
    : { x: clamp(c.x + dx, MARGIN, PAGE_W - MARGIN), y: clamp(c.y + dy, MARGIN, PAGE_H - MARGIN - CALC_BOTTOM) };

/**
 * Flytter objektet `id` til siden `page`, evt. til ankeret `at` (udeladt: samme koordinater). En figurs
 * regnestykker følger med til siden med samme forskydning (`follow`; standard holdt inden for margenen).
 * Et regnestykke kan ikke flyttes alene (uændret) — det står altid på figurens side.
 */
export function moveObjectToPage(
  doc: SheetDoc,
  id: string,
  page: number,
  at?: { x: number; y: number },
  follow: CalcFollow = followInMargin,
): SheetDoc {
  const obj = doc.objects.find((o) => o.id === id);
  if (!obj || obj.type === "calc" || !isPage(doc, page)) return doc;
  const x = at?.x ?? obj.x;
  const y = at?.y ?? obj.y;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return doc;
  if (obj.page === page && obj.x === x && obj.y === y) return doc;
  const dx = x - obj.x;
  const dy = y - obj.y;
  return {
    ...doc,
    objects: doc.objects.map((o): SheetObject => {
      if (o.id === id) return { ...o, page, x, y };
      if (o.type === "calc" && obj.type === "figure" && o.figureId === id) return { ...o, ...follow(o, dx, dy), page };
      return o;
    }),
  };
}

/** Sider uden objekter (0-baseret, stigende). */
export function emptyPages(doc: SheetDoc): number[] {
  const used = new Set(doc.objects.map((o) => o.page));
  const out: number[] = [];
  for (let p = 0; p < doc.pageCount; p++) if (!used.has(p)) out.push(p);
  return out;
}
