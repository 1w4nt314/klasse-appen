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
import type { Bounds, CalcObject, Document as SheetDoc, FigureObject, Point, SheetObject, TextObject } from "../model/types";
import { blockBox, numberSheet, type BlockObject } from "./drillLayout";
import { figureExtent } from "./figureLayout";
import { calcGuards, calcStray, placeCalc, strayCount, takenBoxes } from "./placeCalc";
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
 * Plads til en boks på w × h mm på siden `page` (kun sidens objekter tæller).
 * `numbered`: den del af boksen (relativt til dens øverste venstre hjørne), der er en nummereret ting — en figurs
 * udstrækning, et regneark, en formelblok (udeladt for tekst). Den lægges aldrig nærmere et eksisterende regnestykke
 * end regnestykkets egen figur (så ville det blive "stray", calcStray); kan ingen ledig plads opfylde det, bruges den
 * ledige plads, der rammer færrest regnestykker (først i læseretningen), og editoren/eksporten advarer som altid.
 * @returns boksens øverste venstre hjørne, `free`: false når arket er fuldt (boksen dækker så det
 *   mindst mulige og lægges nederst blandt de pladser, der dækker lige lidt), og `strays`: antal regnestykker,
 *   pladsen står nærmere end deres egen figur (0, når der var en plads uden).
 */
export function placeBox(
  doc: SheetDoc,
  w: number,
  h: number,
  measure: Measure,
  page: number,
  numbered?: Bounds,
): Point & { free: boolean; strays: number } {
  const taken = takenBoxes(doc, measure, page);
  const guards = numbered ? calcGuards(doc, measure, page) : [];
  const lo = PAGE.margin;
  const hiY = Math.max(lo, PAGE.h - PAGE.margin - h);
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const xs: number[] = [];
  for (let x = PAGE.margin; x <= xMax + 1e-9; x += X_STEP) xs.push(r2(x));
  if (xs[xs.length - 1] !== r2(xMax)) xs.push(r2(xMax));
  const ys: number[] = [];
  for (let y = lo; y <= hiY + 1e-9; y += Y_STEP) ys.push(r2(y));
  if (ys[ys.length - 1] !== r2(hiY)) ys.push(r2(hiY));

  let least: { x: number; y: number; n: number } | null = null;
  for (const y of ys) {
    for (const x of xs) {
      if (taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b, PAD))) continue;
      if (guards.length === 0 || !numbered) return { x, y, free: true, strays: 0 };
      const n = strayCount(guards, {
        minX: x + numbered.minX,
        minY: y + numbered.minY,
        maxX: x + numbered.maxX,
        maxY: y + numbered.maxY,
      });
      if (n === 0) return { x, y, free: true, strays: 0 };
      if (!least || n < least.n) least = { x, y, n };
    }
  }
  if (least) return { x: least.x, y: least.y, free: true, strays: least.n };
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
  return { x: best.x, y: best.y, free: false, strays: 0 };
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
export function placeBlock(doc: SheetDoc, block: BlockObject, measure: Measure, page: number): Point & { free: boolean } {
  // Mål blokken ved (0, 0); nummeret "00" er et bredt nok bud på etiketbredden.
  const box = blockBox({ ...block, x: 0, y: 0 }, "00", measure);
  const w = box.maxX - box.minX;
  const h = box.maxY - box.minY;
  return placeBox(doc, w, h, measure, page, { minX: 0, minY: 0, maxX: w, maxY: h });
}

/** Placering af en ny tekstboks (dens bredde og højde med standardteksten). */
export function placeText(doc: SheetDoc, text: TextObject, measure: Measure, page: number): Point & { free: boolean } {
  const box = objectBox({ ...text, x: 0, y: 0 }, doc, new Map(), measure);
  return placeBox(doc, box.maxX - box.minX, box.maxY - box.minY, measure, page);
}

/**
 * Placering af en ny figur (alle typer): hele udstrækningen (etiketter som på svararket og nummer "00")
 * lægges på første ledige plads som en blok. Returnerer figurens anker (x, y).
 */
export function placeFigure(doc: SheetDoc, fig: FigureObject, measure: Measure, page: number): Point & { free: boolean } {
  const ext = figureExtent({ ...fig, x: 0, y: 0 }, "00", measure);
  const w = ext.maxX - ext.minX;
  const h = ext.maxY - ext.minY;
  const at = placeBox(doc, w, h, measure, page, { minX: 0, minY: 0, maxX: w, maxY: h });
  // Ikke afrundet: ankeret skal give præcis den fundne udstrækning (en afrunding på 0,005 mm kunne skubbe
  // etiketterne ud over margenen, og så ville editoren afvise ethvert træk i figuren).
  return { x: at.x - ext.minX, y: at.y - ext.minY, free: at.free };
}

function clampRange(v: number, lo: number, hi: number): number {
  return hi < lo ? lo : Math.min(Math.max(v, lo), hi);
}

/** Forskydning (dx, dy) begrænset, så boksen bliver inden for arkets margen (SheetEditor: træk og piletaster). */
export function clampDelta(box: Bounds, dx: number, dy: number): Point {
  const m = PAGE.margin;
  return {
    x: clampRange(dx, m - box.minX, PAGE.w - m - box.maxX),
    y: clampRange(dy, m - box.minY, PAGE.h - m - box.maxY),
  };
}

/**
 * Ankeret (x, y), som objektet `obj` får, når det flyttes til siden `page`: de samme koordinater, hvis pladsen
 * dér er fri (inden for margenen og uden at røre sidens objekter — for en figur også dens regnestykker, der
 * følger med), ellers første ledige plads på siden (som et nyt objekt; en figur med regnestykker helst med plads til
 * dem alle i samme opstilling). Er siden fuld, bliver objektet lagt, hvor det dækker mindst; blockProblem/figureProblem
 * markerer det så som altid. `obj` skal stå i `doc`.
 */
export function placeOnPage(
  doc: SheetDoc,
  obj: TextObject | FigureObject | BlockObject,
  page: number,
  measure: Measure,
): Point {
  const numbering = numberSheet(doc, measure);
  // Nummeret "00": et bredt nok bud på etiketbredden (numrene skifter, når objektet skifter side).
  const own: Bounds =
    obj.type === "figure"
      ? figureExtent(obj, "00", measure)
      : obj.type === "text"
        ? objectBox(obj, doc, new Map(), measure)
        : blockBox(obj, "00", measure);
  const parts = [own];
  if (obj.type === "figure") {
    for (const o of doc.objects) if (o.type === "calc" && o.figureId === obj.id) parts.push(objectBox(o, doc, numbering, measure));
  }
  const taken = takenBoxes(doc, measure, page);
  const m = PAGE.margin;
  const inside = own.minX >= m - EPS && own.minY >= m - EPS && own.maxX <= PAGE.w - m + EPS && own.maxY <= PAGE.h - m + EPS;
  // Et nummereret objekt må heller ikke komme nærmere et af målsidens regnestykker end dets egen figur (placeBox).
  const strays = obj.type === "text" ? 0 : strayCount(calcGuards(doc, measure, page), own);
  if (inside && strays === 0 && !parts.some((b) => taken.some((t) => hits(b, t, PAD)))) return { x: obj.x, y: obj.y };
  if (parts.length > 1) {
    // En figur med regnestykker: helst en ledig plads til det hele (figur og regnestykker med samme indbyrdes
    // placering), så lærerens opstilling bevares. Er der ingen, lægges figuren alene (followToPage ordner resten).
    const all: Bounds = {
      minX: Math.min(...parts.map((b) => b.minX)),
      minY: Math.min(...parts.map((b) => b.minY)),
      maxX: Math.max(...parts.map((b) => b.maxX)),
      maxY: Math.max(...parts.map((b) => b.maxY)),
    };
    const w = all.maxX - all.minX;
    const h = all.maxY - all.minY;
    if (w <= PAGE.w - 2 * m && h <= PAGE.h - 2 * m) {
      const fig = { minX: own.minX - all.minX, minY: own.minY - all.minY, maxX: own.maxX - all.minX, maxY: own.maxY - all.minY };
      const spot = placeBox(doc, w, h, measure, page, fig);
      if (spot.free && spot.strays === 0) return { x: obj.x + spot.x - all.minX, y: obj.y + spot.y - all.minY };
    }
  }
  const at =
    obj.type === "figure" ? placeFigure(doc, obj, measure, page) : obj.type === "text" ? placeText(doc, obj, measure, page) : placeBlock(doc, obj, measure, page);
  return { x: at.x, y: at.y };
}

/**
 * Hvor figurens regnestykker skal stå, når figuren flyttes til siden `page` med ankeret `at` (fra placeOnPage):
 * samme forskydning som figuren, med hvert regnestykkes (svararks-)boks holdt inden for margenen (som ved træk).
 * Går et regnestykke så ud over arket, står det ved en anden figur/blok end sin egen (calcStray), eller dækker
 * det noget på målsiden, lægges det i stedet som et nyt regnestykke ved figuren (placeCalc). `fig` skal stå i `doc`.
 */
export function followToPage(
  doc: SheetDoc,
  fig: FigureObject,
  page: number,
  at: Point,
  measure: Measure,
): { id: string; x: number; y: number }[] {
  const calcs = doc.objects.filter((o): o is CalcObject => o.type === "calc" && o.figureId === fig.id);
  if (calcs.length === 0) return [];
  const numbering = numberSheet(doc, measure);
  const dx = at.x - fig.x;
  const dy = at.y - fig.y;
  const pos = new Map<string, Point>();
  for (const c of calcs) {
    const d = clampDelta(objectBox(c, doc, numbering, measure), dx, dy);
    pos.set(c.id, { x: r2(c.x + d.x), y: r2(c.y + d.y) });
  }
  const own = new Set<string>([fig.id, ...calcs.map((c) => c.id)]);
  const place = (o: SheetObject): SheetObject => {
    if (o.id === fig.id) return { ...o, page, x: at.x, y: at.y };
    const p = pos.get(o.id);
    return p ? { ...o, page, x: p.x, y: p.y } : o;
  };
  let moved: SheetDoc = { ...doc, objects: doc.objects.map(place) };
  for (const c of calcs) {
    const nums = numberSheet(moved, measure);
    const cur = moved.objects.find((o): o is CalcObject => o.id === c.id && o.type === "calc");
    if (!cur) continue;
    const box = objectBox(cur, moved, nums, measure);
    const covers = moved.objects.some(
      (o) =>
        o.page === page &&
        !own.has(o.id) &&
        hits(box, o.type === "figure" ? figureExtent(o, nums.get(o.id) ?? "", measure) : objectBox(o, moved, nums, measure), -EPS),
    );
    if (!covers && outsideOf(box).length === 0 && calcStray(moved, cur, nums, measure) === null) continue;
    const rest: SheetDoc = { ...moved, objects: moved.objects.filter((o) => o.id !== c.id) };
    const f = rest.objects.find((o): o is FigureObject => o.id === fig.id && o.type === "figure");
    if (!f) continue;
    const p = placeCalc(rest, f, c.param, measure);
    pos.set(c.id, { x: p.x, y: p.y });
    moved = { ...moved, objects: moved.objects.map((o) => (o.id === c.id ? { ...o, x: p.x, y: p.y } : o)) };
  }
  return calcs.map((c) => ({ id: c.id, ...(pos.get(c.id) ?? { x: c.x, y: c.y }) }));
}

/**
 * Kanter (margenen), regnestykkets svararks-boks går ud over — fx efter et nyt, langt navn på en størrelse. Tom,
 * når det er på arket. `boxes`: allerede regnede bokse (editoren: svararks-boksen).
 */
export function calcOutside(
  doc: SheetDoc,
  calc: CalcObject,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
  boxes?: KnownBoxes,
): BlockProblem["outside"] {
  return outsideOf(boxes?.get(calc.id) ?? objectBox(calc, doc, numbering, measure));
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

/** null når blokken ligger inden for margenen og ikke dækker noget andet på sin side. */
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
    if (o.id === block.id || o.page !== block.page) continue;
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
    if (o.id === fig.id || o.page !== fig.page || o.type === "drill" || o.type === "formula") continue;
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

