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
const TEXT_WEIGHT = 20; // fuldt ark: så meget værre er det at dække tekst end en figurs udstrækning (pr. mm²)

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

/** mm ekstra luft i placeBox' regnestykke-vagt: numre og "00"-bud kan ændre bredderne en smule efter placeringen. */
const GUARD_SLACK_MM = 0.5;

/**
 * Regnestykkerne på siden `page`, der i dag står ved deres egen figur (calcStray null), med opgavearkets boks og
 * afstanden til figuren. placeBox bruger dem, så et nyt objekt (eller et, der flyttes hertil) ikke lægges nærmere et
 * regnestykke end dets egen figur — så ville regnestykket blive "stray" (samme regel som calcStray).
 */
export type CalcGuard = { label: Bounds; own: number };

export function calcGuards(doc: SheetDoc, measure: Measure, page: number): CalcGuard[] {
  const out: CalcGuard[] = [];
  let numbering: ReadonlyMap<string, string> | null = null;
  for (const c of doc.objects) {
    if (c.type !== "calc" || c.page !== page) continue;
    const fig = doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === c.figureId);
    if (!fig || fig.page !== page) continue;
    numbering ??= numberSheet(doc, measure);
    if (calcStray(doc, c, numbering, measure) !== null) continue; // advarer allerede
    const label = calcLabelBox(doc, c, numbering, measure);
    out.push({ label, own: boxGap(label, figureExtent(fig, numbering.get(fig.id) ?? "", measure)) });
  }
  return out;
}

/** Hvor mange af regnestykkerne `guards`, en nummereret ting med boksen `box` ville stå nærmere end deres egen figur. */
export function strayCount(guards: readonly CalcGuard[], box: Bounds): number {
  let n = 0;
  for (const g of guards) if (boxGap(g.label, box) + OWN_MARGIN_MM < g.own + GUARD_SLACK_MM) n++;
  return n;
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
  // Den bredeste af svararket (facit) og opgavearket ("X = ________" er bredere end et kort svar eller "X = ?"),
  // så stykket passer inden for margenen og ikke dækker noget på nogen af dem (som objectBox).
  const probe: CalcObject = { id: "probe", type: "calc", x: 0, y: 0, figureId: fig.id, param, page: fig.page };
  const c = calcContent(doc, probe, "svarark", "00a", measure);
  const label = calcContent(doc, probe, "opgave", "00a", measure).widthMm;
  const w = Math.max(c.widthMm, label);
  const h = c.sizeMm * LINE_HEIGHT;
  const ext = figureExtent(fig, "00", measure);
  const taken = takenBoxes(doc, measure, fig.page, fig.id, ext);
  // Ejerskab måles med opgavearkets smalle boks (nummer + "X = ____"); de andre nummererede ting med deres udstrækning.
  const numbering = numberSheet(doc, measure);
  const others = numberedBoxes(doc, numbering, measure, fig.page)
    .filter((n) => n.id !== fig.id)
    .map((n) => n.box);
  // Figurens udstrækning med sit rigtige nummer (som calcStray måler); `ext` med "00" holder fri plads til et længere nummer.
  const own = figureExtent(fig, numbering.get(fig.id) ?? "", measure);

  const lo = PAGE.margin;
  const hi = PAGE.h - PAGE.margin - h;
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const x0 = r2(Math.min(Math.max(ext.minX, PAGE.margin), xMax));
  const free = (x: number, y: number) => !taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b));
  // Det rigtige nummer kendes først bagefter; "00a" er det bredeste bud, figurens nummer + "a" det smalleste.
  // Ejerskabet skal holde for begge (et smallere nummer flytter boksens højre kant væk fra en figur til højre).
  const labelMin = Math.min(label, calcContent(doc, probe, "opgave", `${numbering.get(fig.id) ?? ""}a`, measure).widthMm);
  /** Afstanden til egen figur, når regnestykket her står tydeligt nærmest sin egen figur; ellers null. */
  const ownGap = (x: number, y: number): number | null => {
    const b = { minX: x, minY: y, maxX: x + label, maxY: y + h };
    const d = boxGap(b, own);
    if (!others.every((o) => d + OWN_MARGIN_MM <= boxGap(b, o))) return null;
    if (labelMin >= label - 1e-9) return d;
    const n = { minX: x, minY: y, maxX: x + labelMin, maxY: y + h };
    const dn = boxGap(n, own);
    return others.every((o) => dn + OWN_MARGIN_MM <= boxGap(n, o)) ? d : null;
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
  // Arket er fuldt: dér, hvor regnestykket dækker mindst (også figurens andre regnestykker, så to aldrig lægges
  // oven i hinanden); ved lighed nærmest figurens spalte og nederst. Læreren kan flytte det; markeringen viser det.
  // Tekst (regnestykker, tekstbokse, regneark, formler) vejer tungere end en figurs udstrækning, der mest er luft
  // omkring stregerne: to tekster oven i hinanden kan ingen læse.
  const weight = doc.objects.filter((o) => o.page === fig.page).map((o) => (o.type === "figure" ? 1 : TEXT_WEIGHT));
  let full = { x: x0, y: Math.max(lo, hi), cost: Infinity, dx: Infinity };
  for (const x of xs) {
    const dx = Math.abs(x - x0);
    for (let y = Math.max(lo, hi); y >= lo - 1e-9; y -= 1) {
      const box = { minX: x, minY: y, maxX: x + w, maxY: y + h };
      let cost = 0;
      for (let i = 0; i < taken.length; i++) {
        const b = taken[i];
        cost +=
          weight[i] *
          Math.max(0, Math.min(box.maxX, b.maxX) - Math.max(box.minX, b.minX)) *
          Math.max(0, Math.min(box.maxY, b.maxY) - Math.max(box.minY, b.minY));
        if (cost > full.cost + 1e-6) break;
      }
      if (cost < full.cost - 1e-6 || (cost < full.cost + 1e-6 && dx < full.dx)) full = { x, y: r2(y), cost, dx };
    }
  }
  return { x: full.x, y: full.y };
}
