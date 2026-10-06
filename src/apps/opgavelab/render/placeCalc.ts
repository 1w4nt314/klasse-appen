// Opgavelab — hvor et nyt regnestykke lægges: lige under figuren, inden for arkets margen
// og uden at dække noget andet på arket — andre regnestykker, tekstbokse og figurer
// (inkl. deres etiketter og opgavenummer). Ren TS, ingen React/DOM.

import { PAGE } from "../model/types";
import type { Bounds, CalcObject, Document as SheetDoc, FigureObject, Point } from "../model/types";
import { numberSheet } from "./drillLayout";
import { figureExtent } from "./figureLayout";
import { LINE_HEIGHT, calcContent, objectBox, type Measure } from "./textLayout";

const GAP_BELOW = 3; // mm mellem figurens nederste etiket og regnestykket
const PAD = 1.5; // mm luft mellem regnestykket og andre objekter
const X_STEP = 5; // mm mellem alternative vandrette placeringer

const hits = (a: Bounds, b: Bounds) =>
  a.minX < b.maxX + PAD && a.maxX > b.minX - PAD && a.minY < b.maxY + PAD && a.maxY > b.minY - PAD;

const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * Alt, der allerede står på arket, som rektangler. Figurer med hele udstrækningen (etiketter og
 * nummer, som på svararket); regnestykker, regneark og tekst med deres (svararks-)boks.
 * `ownId`/`ownExt`: en figur, hvis udstrækning allerede er regnet (placeCalc).
 */
export function takenBoxes(doc: SheetDoc, measure: Measure, ownId?: string, ownExt?: Bounds): Bounds[] {
  const numbering = numberSheet(doc, measure);
  return doc.objects.map((o) =>
    o.type === "figure"
      ? o.id === ownId && ownExt
        ? ownExt
        : figureExtent(o, numbering.get(o.id) ?? "00", measure)
      : objectBox(o, doc, numbering, measure),
  );
}

export function placeCalc(doc: SheetDoc, fig: FigureObject, param: string, measure: Measure): Point {
  // Svararket er bredest; bruges, så stykket også passer inden for margenen dér.
  const probe: CalcObject = { id: "probe", type: "calc", x: 0, y: 0, figureId: fig.id, param };
  const c = calcContent(doc, probe, "svarark", "00a", measure);
  const w = c.widthMm;
  const h = c.sizeMm * LINE_HEIGHT;
  const ext = figureExtent(fig, "00", measure);
  const taken = takenBoxes(doc, measure, fig.id, ext);

  const lo = PAGE.margin;
  const hi = PAGE.h - PAGE.margin - h;
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const x0 = r2(Math.min(Math.max(ext.minX, PAGE.margin), xMax));
  const free = (x: number, y: number) => !taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b));

  // Først nedad fra figuren, så opad (hvis figuren står nederst).
  const column = (x: number): number | null => {
    for (let y = ext.maxY + GAP_BELOW; y <= hi; y += 1) if (free(x, y)) return r2(y);
    for (let y = Math.min(hi, ext.minY - h - GAP_BELOW); y >= lo; y -= 1) if (free(x, y)) return r2(y);
    return null;
  };
  const y0 = column(x0);
  if (y0 !== null) return { x: x0, y: y0 };
  // Ingen plads i figurens spalte: prøv andre vandrette placeringer, nærmeste først.
  const xs: number[] = [];
  for (let x = PAGE.margin; x <= xMax + 1e-9; x += X_STEP) xs.push(r2(x));
  xs.push(r2(xMax));
  xs.sort((a, b) => Math.abs(a - x0) - Math.abs(b - x0));
  for (const x of xs) {
    const y = column(x);
    if (y !== null) return { x, y };
  }
  // Arket er fuldt: nederst i figurens spalte (læreren kan flytte det).
  return { x: x0, y: Math.max(lo, hi) };
}
