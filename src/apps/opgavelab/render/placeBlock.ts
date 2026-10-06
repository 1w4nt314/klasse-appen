// Opgavelab — hvor et nyt objekt (figur, regneark eller formelblok) lægges, og om det passer på arket.
// Ren TS.
//
// placeBox: første ledige plads top→bund (derefter venstre→højre) inden for margenen, uden at
// dække figurer, tekst, regnestykker eller blokke. Er der intet ledigt, lægges objektet dér, hvor
// det dækker MINDST (nederst ved lighed) — ikke oven på alt — og blockProblem/figureProblem markerer det.
// placeBlock (regneark, formler), placeFigure (alle figurtyper) og placeText bruger den.
// blockProblem: bruges af panelet (advarsel), editor-overlayet (markering) og eksport-dialogen.

import { defOf } from "../figures/registry";
import { PAGE } from "../model/types";
import type { Bounds, Document as SheetDoc, FigureObject, Point, TextObject } from "../model/types";
import { blockBox, type BlockObject } from "./drillLayout";
import { figureExtent } from "./figureLayout";
import { takenBoxes } from "./placeCalc";
import { objectBox, type Measure } from "./textLayout";

const PAD = 1.5; // mm luft mellem det nye objekt og andre objekter
const X_STEP = 5; // mm mellem alternative vandrette placeringer
const Y_STEP = 1;
const EPS = 0.05; // mm: under det regnes en kant som "på margenen"

const r2 = (v: number) => Math.round(v * 100) / 100;

const hits = (a: Bounds, b: Bounds, pad: number) =>
  a.minX < b.maxX + pad && a.maxX > b.minX - pad && a.minY < b.maxY + pad && a.maxY > b.minY - pad;

/** Arealet (mm²), hvor a og b overlapper. */
const overlapArea = (a: Bounds, b: Bounds) =>
  Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX)) * Math.max(0, Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY));

/**
 * Plads til en boks på w × h mm.
 * @returns boksens øverste venstre hjørne og `free`: false når arket er fuldt (boksen dækker så det
 *   mindst mulige og lægges nederst blandt de pladser, der dækker lige lidt).
 */
export function placeBox(doc: SheetDoc, w: number, h: number, measure: Measure): Point & { free: boolean } {
  const taken = takenBoxes(doc, measure);
  const lo = PAGE.margin;
  const hiY = Math.max(lo, PAGE.h - PAGE.margin - h);
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const xs: number[] = [];
  for (let x = PAGE.margin; x <= xMax + 1e-9; x += X_STEP) xs.push(r2(x));
  if (xs[xs.length - 1] !== r2(xMax)) xs.push(r2(xMax));
  const ys: number[] = [];
  for (let y = lo; y <= hiY + 1e-9; y += Y_STEP) ys.push(r2(y));
  if (ys[ys.length - 1] !== r2(hiY)) ys.push(r2(hiY));

  for (const y of ys) {
    for (const x of xs) {
      if (!taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b, PAD))) return { x, y, free: true };
    }
  }
  // Fuldt ark: mindst dækket areal; ved lighed nederst, derefter længst til venstre.
  let best: { x: number; y: number; cost: number } = { x: PAGE.margin, y: r2(hiY), cost: Infinity };
  for (let k = ys.length - 1; k >= 0; k--) {
    const y = ys[k];
    for (const x of xs) {
      const box = { minX: x, minY: y, maxX: x + w, maxY: y + h };
      let cost = 0;
      for (const b of taken) {
        cost += overlapArea(box, b);
        if (cost >= best.cost) break;
      }
      if (cost < best.cost - 1e-6) best = { x, y, cost };
    }
  }
  return { x: best.x, y: best.y, free: false };
}

/**
 * Forskydning, der bringer en udstrækning ind inden for arkets margen — aldrig mod retningen `dir` (en
 * cirkel, der vokser mod højre ved venstre margen, må flytte sig mod højre og ned; et hjørne, der trækkes
 * op over margenen, skubbes ikke ned). {0, 0} når den allerede passer; null når den ikke kan.
 */
export function pushIntoSheet(ext: Bounds, dir: Point = { x: 0, y: 0 }): Point | null {
  const m = PAGE.margin;
  if (ext.maxX - ext.minX > PAGE.w - 2 * m || ext.maxY - ext.minY > PAGE.h - 2 * m) return null;
  const dx = ext.minX < m ? m - ext.minX : ext.maxX > PAGE.w - m ? PAGE.w - m - ext.maxX : 0;
  const dy = ext.minY < m ? m - ext.minY : ext.maxY > PAGE.h - m ? PAGE.h - m - ext.maxY : 0;
  // Aldrig MOD retningen (et hjørne, der trækkes ud over margenen, stopper som før); på tværs er i orden.
  // dir = {0, 0} (standard): alle retninger. Editoren (SheetEditor.fitOrPush) vurderer selv retningen ud fra
  // pointerens og håndtagets flytning, og om figuren bliver mindre (core/pushRule).
  if (dx * dir.x < 0 || dy * dir.y < 0) return null;
  return { x: dx, y: dy };
}

/**
 * Placering af en ny blok (`block` er ikke i `doc` endnu; kun dens størrelse bruges).
 * @returns x/y (mm) og `free`: false når arket er fuldt.
 */
export function placeBlock(doc: SheetDoc, block: BlockObject, measure: Measure): Point & { free: boolean } {
  // Mål blokken ved (0, 0); nummeret "00" er et bredt nok bud på etiketbredden.
  const box = blockBox({ ...block, x: 0, y: 0 }, "00", measure);
  return placeBox(doc, box.maxX - box.minX, box.maxY - box.minY, measure);
}

/** Placering af en ny tekstboks (dens bredde og højde med standardteksten). */
export function placeText(doc: SheetDoc, text: TextObject, measure: Measure): Point & { free: boolean } {
  const box = objectBox({ ...text, x: 0, y: 0 }, doc, new Map(), measure);
  return placeBox(doc, box.maxX - box.minX, box.maxY - box.minY, measure);
}

/**
 * Placering af en ny figur (alle typer): hele udstrækningen (etiketter som på svararket og nummer "00")
 * lægges på første ledige plads som en blok. Returnerer figurens anker (x, y).
 */
export function placeFigure(doc: SheetDoc, fig: FigureObject, measure: Measure): Point & { free: boolean } {
  const ext = figureExtent({ ...fig, x: 0, y: 0 }, "00", measure);
  const at = placeBox(doc, ext.maxX - ext.minX, ext.maxY - ext.minY, measure);
  // Ikke afrundet: ankeret skal give præcis den fundne udstrækning (en afrunding på 0,005 mm kunne skubbe
  // etiketterne ud over margenen, og så ville editoren afvise ethvert træk i figuren).
  return { x: at.x - ext.minX, y: at.y - ext.minY, free: at.free };
}

export type BlockProblem = {
  /** Kanter, blokken går ud over (margenen). */
  outside: ("bottom" | "right" | "left" | "top")[];
  /** Navne på andre objekter, blokken dækker, fx "Retvinklet trekant 1". */
  covers: string[];
};

/**
 * Udstrækninger, der allerede er regnet (editoren: én gang pr. render for alle objekter, som
 * figureExtent/objectBox med objektets nummer). Udeladt eller uden objektet → regnes her.
 */
export type KnownBoxes = ReadonlyMap<string, Bounds>;

/** Kanter (margenen), boksen går ud over (mere end EPS). */
function outsideOf(box: Bounds): BlockProblem["outside"] {
  const m = PAGE.margin;
  const outside: BlockProblem["outside"] = [];
  if (box.maxY > PAGE.h - m + EPS) outside.push("bottom");
  if (box.maxX > PAGE.w - m + EPS) outside.push("right");
  if (box.minX < m - EPS) outside.push("left");
  if (box.minY < m - EPS) outside.push("top");
  return outside;
}

/** null når blokken ligger inden for margenen og ikke dækker noget andet. */
export function blockProblem(
  doc: SheetDoc,
  block: BlockObject,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  boxes?: KnownBoxes,
): BlockProblem | null {
  const box = boxes?.get(block.id) ?? blockBox(block, numbering.get(block.id) ?? "", measure);
  const outside = outsideOf(box);

  const covers: string[] = [];
  for (const o of doc.objects) {
    if (o.id === block.id) continue;
    const num = numbering.get(o.id);
    const other = boxes?.get(o.id) ?? (o.type === "figure" ? figureExtent(o, num ?? "00", measure) : objectBox(o, doc, numbering, measure));
    // Strengt overlap (ingen luft): en ellers korrekt placeret blok flagges aldrig.
    if (!hits(box, other, -EPS)) continue;
    covers.push(
      o.type === "figure"
        ? `${defOf(o).name}${num ? ` ${num}` : ""}`
        : o.type === "drill"
          ? `regneark ${num ?? ""}`.trim()
          : o.type === "formula"
            ? `formler ${num ?? ""}`.trim()
            : o.type === "calc"
            ? `regnestykke ${num ?? ""}`.trim()
            : "en tekst",
    );
  }
  return outside.length === 0 && covers.length === 0 ? null : { outside, covers };
}

/**
 * En figur, der går ud over arkets margen (fx et langt navn på en størrelse, når figuren ikke kan skubbes ind —
 * se fitFigure), eller dækker en anden figur, en tekst eller et regnestykke (fx lagt nederst på et fuldt ark).
 * Regneark og formelblokke tælles ikke med her: de markeres selv (blockProblem). null når figuren er på arket
 * og intet dækker.
 */
export function figureProblem(
  doc: SheetDoc,
  fig: FigureObject,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  boxes?: KnownBoxes,
): BlockProblem | null {
  const box = boxes?.get(fig.id) ?? figureExtent(fig, numbering.get(fig.id) ?? "", measure);
  const covers: string[] = [];
  for (const o of doc.objects) {
    if (o.id === fig.id || o.type === "drill" || o.type === "formula") continue;
    const num = numbering.get(o.id);
    const other = boxes?.get(o.id) ?? (o.type === "figure" ? figureExtent(o, num ?? "", measure) : objectBox(o, doc, numbering, measure));
    if (!hits(box, other, -EPS)) continue;
    covers.push(o.type === "figure" ? `${defOf(o).name}${num ? ` ${num}` : ""}` : o.type === "calc" ? `regnestykke ${num ?? ""}`.trim() : "en tekst");
  }
  const outside = outsideOf(box);
  return outside.length === 0 && covers.length === 0 ? null : { outside, covers };
}

/**
 * Figuren skubbet ind inden for arkets margen (pushIntoSheet), når en ændring i panelet (et navn, Vis) har gjort
 * dens udstrækning større end pladsen ved en margen. Uændret (samme objekt), når den allerede er på arket, eller
 * når den er for stor til arket — så markerer figureProblem den.
 */
export function fitFigure(fig: FigureObject, number: string, measure: Measure): FigureObject {
  const ext = figureExtent(fig, number, measure);
  const m = PAGE.margin;
  const e = 1e-6;
  if (ext.minX >= m - e && ext.minY >= m - e && ext.maxX <= PAGE.w - m + e && ext.maxY <= PAGE.h - m + e) return fig;
  const push = pushIntoSheet(ext);
  if (!push || (push.x === 0 && push.y === 0)) return fig;
  return { ...fig, x: fig.x + push.x, y: fig.y + push.y };
}

function joinNames(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}

/** Sætninger til panelet og eksport-dialogen; `subject` fx "Regneark 1" (første ord med stort). */
export function blockProblemText(p: BlockProblem, subject: string): string[] {
  const out: string[] = [];
  if (p.outside.includes("bottom")) out.push(`${subject} går ud over arkets bund`);
  if (p.outside.includes("right")) out.push(`${subject} går ud over arkets højre margen`);
  if (p.outside.includes("left") || p.outside.includes("top")) out.push(`${subject} går ud over arkets margen`);
  if (p.covers.length > 0) out.push(`${subject} dækker ${joinNames(p.covers)}`);
  return out;
}

