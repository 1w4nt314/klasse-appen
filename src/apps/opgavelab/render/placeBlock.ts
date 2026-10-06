// Opgavelab — hvor en ny blok (regneark eller formelblok) lægges, og om en blok passer på arket.
// Ren TS.
//
// placeBlock: første ledige plads top→bund (derefter venstre→højre) inden for margenen, uden at
// dække figurer, tekst, regnestykker eller andre blokke. Er der intet ledigt, lægges blokken
// nederst (og blockProblem markerer den, fordi den så overlapper eller går ud over arket).
// blockProblem: bruges af panelet (advarsel), editor-overlayet (markering) og eksport-dialogen.

import { defOf } from "../figures/registry";
import { PAGE } from "../model/types";
import type { Bounds, Document as SheetDoc, Point } from "../model/types";
import { blockBox, type BlockObject } from "./drillLayout";
import { figureExtent } from "./figureLayout";
import { takenBoxes } from "./placeCalc";
import { objectBox, type Measure } from "./textLayout";

const PAD = 1.5; // mm luft mellem det nye regneark og andre objekter
const X_STEP = 5; // mm mellem alternative vandrette placeringer
const Y_STEP = 1;
const EPS = 0.05; // mm: under det regnes en kant som "på margenen"

const r2 = (v: number) => Math.round(v * 100) / 100;

const hits = (a: Bounds, b: Bounds, pad: number) =>
  a.minX < b.maxX + pad && a.maxX > b.minX - pad && a.minY < b.maxY + pad && a.maxY > b.minY - pad;

/**
 * Placering af en ny blok (`block` er ikke i `doc` endnu; kun dens størrelse bruges).
 * @returns x/y (mm) og `free`: false når arket er fuldt, og blokken er lagt nederst.
 */
export function placeBlock(doc: SheetDoc, block: BlockObject, measure: Measure): Point & { free: boolean } {
  // Mål blokken ved (0, 0); nummeret "00" er et bredt nok bud på etiketbredden.
  const box = blockBox({ ...block, x: 0, y: 0 }, "00", measure);
  const w = box.maxX - box.minX;
  const h = box.maxY - box.minY;
  const taken = takenBoxes(doc, measure);

  const lo = PAGE.margin;
  const hiY = PAGE.h - PAGE.margin - h;
  const xMax = Math.max(PAGE.margin, PAGE.w - PAGE.margin - w);
  const xs: number[] = [];
  for (let x = PAGE.margin; x <= xMax + 1e-9; x += X_STEP) xs.push(r2(x));
  if (xs[xs.length - 1] !== r2(xMax)) xs.push(r2(xMax));

  for (let y = lo; y <= hiY + 1e-9; y += Y_STEP) {
    for (const x of xs) {
      if (!taken.some((b) => hits({ minX: x, minY: y, maxX: x + w, maxY: y + h }, b, PAD))) return { x, y: r2(y), free: true };
    }
  }
  return { x: PAGE.margin, y: r2(Math.max(lo, hiY)), free: false };
}

export type BlockProblem = {
  /** Kanter, blokken går ud over (margenen). */
  outside: ("bottom" | "right" | "left" | "top")[];
  /** Navne på andre objekter, blokken dækker, fx "Retvinklet trekant 1". */
  covers: string[];
};

/** null når blokken ligger inden for margenen og ikke dækker noget andet. */
export function blockProblem(
  doc: SheetDoc,
  block: BlockObject,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
): BlockProblem | null {
  const box = blockBox(block, numbering.get(block.id) ?? "", measure);
  const m = PAGE.margin;
  const outside: BlockProblem["outside"] = [];
  if (box.maxY > PAGE.h - m + EPS) outside.push("bottom");
  if (box.maxX > PAGE.w - m + EPS) outside.push("right");
  if (box.minX < m - EPS) outside.push("left");
  if (box.minY < m - EPS) outside.push("top");

  const covers: string[] = [];
  for (const o of doc.objects) {
    if (o.id === block.id) continue;
    const num = numbering.get(o.id);
    const other = o.type === "figure" ? figureExtent(o, num ?? "00", measure) : objectBox(o, doc, numbering, measure);
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

