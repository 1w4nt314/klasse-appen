// Opgavelab — hvor et nyt regnestykke lægges: lige under figuren, inden for arkets margen
// og uden at dække et andet regnestykke (ren TS, ingen React/DOM).

import { numberDocument } from "../core/numbering";
import { figureBoundsOnSheet } from "../model/figures";
import { PAGE } from "../model/types";
import type { Bounds, CalcObject, Document as SheetDoc, FigureObject, Point } from "../model/types";
import { figureExtent } from "./SheetSvg";
import { LINE_HEIGHT, calcContent, objectBox, type Measure } from "./textLayout";

const GAP_BELOW = 3; // mm mellem figurens nederste etiket og regnestykket
const PAD = 1.5; // mm luft mellem regnestykker

const hits = (a: Bounds, b: Bounds) =>
  a.minX < b.maxX + PAD && a.maxX > b.minX - PAD && a.minY < b.maxY + PAD && a.maxY > b.minY - PAD;

export function placeCalc(doc: SheetDoc, fig: FigureObject, param: string, measure: Measure): Point {
  // Svararket er bredest; bruges, så stykket også passer inden for margenen dér.
  const probe: CalcObject = { id: "probe", type: "calc", x: 0, y: 0, figureId: fig.id, param };
  const c = calcContent(doc, probe, "svarark", "00a", measure);
  const w = c.widthMm;
  const h = c.sizeMm * LINE_HEIGHT;
  const ext = figureExtent(fig, "00", measure);
  const numbering = numberDocument(doc, figureBoundsOnSheet);
  const taken = doc.objects.filter((o) => o.type === "calc").map((o) => objectBox(o, doc, numbering, measure));

  const lo = PAGE.margin;
  const hi = PAGE.h - PAGE.margin - h;
  const x = Math.round(Math.min(Math.max(ext.minX, PAGE.margin), Math.max(PAGE.margin, PAGE.w - PAGE.margin - w)) * 100) / 100;
  const free = (y: number) => !taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b));

  // Først nedad fra figuren, så opad (hvis figuren står nederst), ellers nederst på arket.
  for (let y = ext.maxY + GAP_BELOW; y <= hi; y += 1) if (free(y)) return { x, y: Math.round(y * 100) / 100 };
  for (let y = Math.min(hi, ext.minY - h - GAP_BELOW); y >= lo; y -= 1) if (free(y)) return { x, y: Math.round(y * 100) / 100 };
  return { x, y: Math.max(lo, hi) };
}
