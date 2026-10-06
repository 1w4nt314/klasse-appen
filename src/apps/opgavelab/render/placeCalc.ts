// Opgavelab — hvor et nyt regnestykke lægges: lige under figuren, inden for arkets margen
// og uden at dække noget andet på arket — andre regnestykker, tekstbokse og figurer
// (inkl. deres etiketter og opgavenummer). Regnestykket lægges aldrig nærmere en ANDEN figur
// (eller et regneark/en formelblok) end sin egen, så "2a" aldrig står ved figur 1 (calcStray).
// Ren TS, ingen React/DOM.

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

/** Så mange mm nærmere skal et regnestykke være sin egen figur end alle andre nummererede ting. */
export const OWN_MARGIN_MM = 1;

/** Afstanden (mm) mellem to bokse; 0, når de rører eller overlapper. */
export function boxGap(a: Bounds, b: Bounds): number {
  const dx = Math.max(0, a.minX - b.maxX, b.minX - a.maxX);
  const dy = Math.max(0, a.minY - b.maxY, b.minY - a.maxY);
  return Math.hypot(dx, dy);
}

/** Opgavearkets (smalle) boks for regnestykket — nummeret og "X = ____", det eleven ser ved figuren. */
function calcLabelBox(doc: SheetDoc, calc: CalcObject, numbering: ReadonlyMap<string, string>, measure: Measure): Bounds {
  return objectBox(calc, doc, numbering, measure, "opgave");
}

/**
 * De nummererede ting på arket, et regnestykke kan forveksles med: figurer (hele udstrækningen) og
 * regneark/formelblokke PÅ SIDEN `page` (en anden side kan aldrig forveksles med). `known`: allerede regnede bokse (editoren).
 */
function numberedBoxes(
  doc: SheetDoc,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  page: number,
  known?: ReadonlyMap<string, Bounds>,
): { id: string; box: Bounds }[] {
  const out: { id: string; box: Bounds }[] = [];
  for (const o of doc.objects) {
    if (o.page !== page) continue;
    if (o.type !== "figure" && o.type !== "drill" && o.type !== "formula") continue;
    const box =
      known?.get(o.id) ??
      (o.type === "figure" ? figureExtent(o, numbering.get(o.id) ?? "", measure) : objectBox(o, doc, numbering, measure));
    out.push({ id: o.id, box });
  }
  return out;
}

/**
 * Står regnestykket tydeligt nærmere en anden figur (eller et regneark/en formelblok) end sin egen? Så id'et på
 * den nærmeste anden, ellers null. Fx et regnestykke "2a", der efter et træk står lige under figur 1.
 */
export function calcStray(
  doc: SheetDoc,
  calc: CalcObject,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  known?: ReadonlyMap<string, Bounds>,
): string | null {
  const box = calcLabelBox(doc, calc, numbering, measure);
  let own = Infinity;
  let other: { id: string; d: number } | null = null;
  for (const n of numberedBoxes(doc, numbering, measure, calc.page, known)) {
    const d = boxGap(box, n.box);
    if (n.id === calc.figureId) own = d;
    else if (!other || d < other.d) other = { id: n.id, d };
  }
  return other && other.d + OWN_MARGIN_MM < own ? other.id : null;
}

/**
 * Alt, der allerede står på siden `page`, som rektangler (andre sider ses ikke). Figurer med hele
 * udstrækningen (etiketter og nummer, som på svararket); regnestykker, regneark og tekst med deres
 * (svararks-)boks. Numrene regnes for hele dokumentet. `ownId`/`ownExt`: en figur, hvis udstrækning
 * allerede er regnet (placeCalc).
 */
export function takenBoxes(doc: SheetDoc, measure: Measure, page: number, ownId?: string, ownExt?: Bounds): Bounds[] {
  const numbering = numberSheet(doc, measure);
  return doc.objects.filter((o) => o.page === page).map((o) =>
    o.type === "figure"
      ? o.id === ownId && ownExt
        ? ownExt
        : figureExtent(o, numbering.get(o.id) ?? "00", measure)
      : objectBox(o, doc, numbering, measure),
  );
}

export function placeCalc(doc: SheetDoc, fig: FigureObject, param: string, measure: Measure): Point {
  // Svararket er bredest; bruges, så stykket også passer inden for margenen dér.
  const probe: CalcObject = { id: "probe", type: "calc", x: 0, y: 0, figureId: fig.id, param, page: fig.page };
  const c = calcContent(doc, probe, "svarark", "00a", measure);
  const w = c.widthMm;
  const h = c.sizeMm * LINE_HEIGHT;
  const ext = figureExtent(fig, "00", measure);
  const taken = takenBoxes(doc, measure, fig.page, fig.id, ext);
  // Ejerskab måles med opgavearkets smalle boks (nummer + "X = ____"); de andre nummererede ting med deres udstrækning.
  const numbering = numberSheet(doc, measure);
  const others = numberedBoxes(doc, numbering, measure, fig.page)
    .filter((n) => n.id !== fig.id)
    .map((n) => n.box);
  const label = calcContent(doc, probe, "opgave", "00a", measure).widthMm;
  // Figurens udstrækning med sit rigtige nummer (som calcStray måler); `ext` med "00" holder fri plads til et længere nummer.
  const own = figureExtent(fig, numbering.get(fig.id) ?? "", measure);

  const lo = PAGE.margin;
  const hi = PAGE.h - PAGE.margin - h;
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const x0 = r2(Math.min(Math.max(ext.minX, PAGE.margin), xMax));
  const free = (x: number, y: number) => !taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b));
  /** Afstanden til egen figur, når regnestykket her står tydeligt nærmest sin egen figur; ellers null. */
  const ownGap = (x: number, y: number): number | null => {
    const b = { minX: x, minY: y, maxX: x + label, maxY: y + h };
    const d = boxGap(b, own);
    return others.every((o) => d + OWN_MARGIN_MM <= boxGap(b, o)) ? d : null;
  };
  const ok = (x: number, y: number) => free(x, y) && ownGap(x, y) !== null;

  // Først nedad fra figuren, så opad (hvis figuren står nederst) — kun hvor regnestykket står ved sin egen figur
  // (aldrig forbi en anden figur, der står lige under eller over).
  const column = (x: number, accept: (x: number, y: number) => boolean): number | null => {
    for (let y = ext.maxY + GAP_BELOW; y <= hi; y += 1) if (accept(x, y)) return r2(y);
    for (let y = Math.min(hi, ext.minY - h - GAP_BELOW); y >= lo; y -= 1) if (accept(x, y)) return r2(y);
    return null;
  };
  const y0 = column(x0, ok);
  if (y0 !== null) return { x: x0, y: y0 };
  // Ingen plads i figurens spalte: den ledige plads tættest på figuren (ved siden af, over …), stadig nærmest den.
  // Findes ingen (arket er for fyldt ved figuren), den ledige plads, hvor regnestykket er mindst tvetydigt
  // (egen afstand minus afstanden til den nærmeste anden) — editoren og eksporten advarer så (calcStray).
  let best: { x: number; y: number; d: number } | null = null;
  let least: { x: number; y: number; a: number; d: number } | null = null;
  for (let x = lo; x <= xMax + 1e-9; x += 1) {
    for (let y = lo; y <= hi + 1e-9; y += 1) {
      if (!free(x, y)) continue;
      const g = ownGap(x, y);
      if (g !== null) {
        // Under eller til højre for figuren foretrækkes frem for over/til venstre (læseretningen).
        const d = g + (y + h <= ext.minY || x + label <= ext.minX ? 2 : 0);
        if (!best || d < best.d - 1e-9) best = { x: r2(x), y: r2(y), d };
      } else if (!best) {
        const b = { minX: x, minY: y, maxX: x + label, maxY: y + h };
        const d = boxGap(b, own);
        const a = d - Math.min(...others.map((o) => boxGap(b, o)));
        if (!least || a < least.a - 1e-9 || (a < least.a + 1e-9 && d < least.d)) least = { x: r2(x), y: r2(y), a, d };
      }
    }
  }
  if (best) return { x: best.x, y: best.y };
  if (least) return { x: least.x, y: least.y };
  // Ingen ledig plads: som før — figurens spalte, så andre vandrette placeringer, nærmeste først.
  const y1 = column(x0, free);
  if (y1 !== null) return { x: x0, y: y1 };
  const xs: number[] = [];
  for (let x = PAGE.margin; x <= xMax + 1e-9; x += X_STEP) xs.push(r2(x));
  xs.push(r2(xMax));
  xs.sort((a, b) => Math.abs(a - x0) - Math.abs(b - x0));
  for (const x of xs) {
    const y = column(x, free);
    if (y !== null) return { x, y };
  }
  // Arket er fuldt: nederst i figurens spalte (læreren kan flytte det).
  return { x: x0, y: Math.max(lo, hi) };
}
