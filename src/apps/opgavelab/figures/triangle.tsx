// Opgavelab — figuren "Fri trekant": geometri og regler fra core/triangle.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { makeSolver } from "../core/solveKit";
import { compute, heightFoot, triangleSpec, vertices } from "../core/triangle";
import { displayName } from "../model/params";
import type { FigureObjectOf, Point, TriangleShape } from "../model/types";
import { INK, LABEL_GAP, add, besides, labelBox, r2, sub, unit } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, HIDDEN_EDGE, derivedLabels, polyPoints, rightAngleMark } from "./shared";
import { CORNERS, arcPath, arcRadius, triangleLabels, type Corner } from "./triangleLabels";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"triangle", TriangleShape>;

/** Siderne: a = BC (modstående A), b = AC (modstående B), c = AB (modstående C). */
const SIDES = [
  { key: "a", p: "B", q: "C", opp: "A" },
  { key: "b", p: "A", q: "C", opp: "B" },
  { key: "c", p: "A", q: "B", opp: "C" },
] as const;

/** Retvinkelmærkets størrelse ved højdens fodpunkt (mm). */
const MARK_MM = 3;
/** Fodpunktet regnes som "på c", når det ligger mindst så langt (mm) inde fra A og B. */
const FOOT_INSIDE_MM = 0.5;

/** Højden fra C på c: fodpunkt H, om H ligger på selve c, og retningen langs c, mærket vender mod. */
function height(shape: TriangleShape) {
  const v = vertices(shape);
  const { H } = heightFoot(shape);
  const dA = Math.hypot(H.x - v.A.x, H.y - v.A.y);
  const dB = Math.hypot(H.x - v.B.x, H.y - v.B.y);
  const onC = dA + dB <= shape.c + 1e-6 && dA >= FOOT_INSIDE_MM && dB >= FOOT_INSIDE_MM;
  const near: Corner = dA <= dB ? "A" : "B";
  // Mærket og h-etiketten vender mod den største deltrekant (på c), ellers ind mod trekanten
  // (ligger fodpunktet i et hjørne — ret vinkel ved A eller B — mod det andet hjørne).
  const nearDist = Math.min(dA, dB);
  const far: Corner = onC || nearDist < FOOT_INSIDE_MM ? (dA >= dB ? "A" : "B") : near;
  /** Stiplet forlængelse af c fra det nærmeste hjørne til fodpunktet (kun når H ligger uden for c). */
  const extension = !onC && nearDist >= FOOT_INSIDE_MM;
  return { v, H, onC, far, near, extension, toward: unit(sub(v[far], H)) };
}

/** De to andre hjørner end k. */
const others = (v: Record<Corner, Point>, k: Corner): [Point, Point] =>
  k === "A" ? [v.B, v.C] : k === "B" ? [v.A, v.C] : [v.A, v.B];

/** Kommer boksen nærmere end r til punktet p? */
function boxNearPoint(box: { c: Point; hw: number; hh: number }, p: Point, r: number): boolean {
  const dx = Math.max(0, Math.abs(p.x - box.c.x) - box.hw);
  const dy = Math.max(0, Math.abs(p.y - box.c.y) - box.hh);
  return Math.hypot(dx, dy) < r;
}

const hits = (a: { c: Point; hw: number; hh: number }, b: { c: Point; hw: number; hh: number }, m = 0.3) =>
  Math.abs(a.c.x - b.c.x) < a.hw + b.hw + m && Math.abs(a.c.y - b.c.y) < a.hh + b.hh + m;

/** Ligger boksen inde i trekanten med mindst `gap` mm til alle tre sider? */
function insideTriangle(c: Point, hw: number, hh: number, v: Record<Corner, Point>, gap: number): boolean {
  const corners: [Corner, Corner, Corner][] = [
    ["A", "B", "C"],
    ["B", "C", "A"],
    ["C", "A", "B"],
  ];
  for (const [p, q, r] of corners) {
    const d = unit(sub(v[q], v[p]));
    const n = { x: -d.y, y: d.x };
    const sr = (v[r].x - v[p].x) * n.x + (v[r].y - v[p].y) * n.y;
    const sc = ((c.x - v[p].x) * n.x + (c.y - v[p].y) * n.y) * Math.sign(sr);
    if (sc - (Math.abs(n.x) * hw + Math.abs(n.y) * hh) < gap) return false;
  }
  return true;
}

/** Skærer linjestykket pq boksen (centrum c, halve mål hw/hh, udvidet med m mm)? (Liang–Barsky) */
function segmentHitsBox(p: Point, q: Point, box: { c: Point; hw: number; hh: number }, m = 0.8): boolean {
  const d = sub(q, p);
  let t0 = 0;
  let t1 = 1;
  const clip = (den: number, num: number) => {
    if (Math.abs(den) < 1e-12) return num >= 0;
    const t = num / den;
    if (den > 0) t1 = Math.min(t1, t);
    else t0 = Math.max(t0, t);
    return t0 <= t1;
  };
  const x0 = box.c.x - box.hw - m;
  const x1 = box.c.x + box.hw + m;
  const y0 = box.c.y - box.hh - m;
  const y1 = box.c.y + box.hh + m;
  return clip(-d.x, p.x - x0) && clip(d.x, x1 - p.x) && clip(-d.y, p.y - y0) && clip(d.y, y1 - p.y);
}

/**
 * Sideetiketter, der rammer den stiplede højde eller forlængelsen af c (stumpe trekanter: siden
 * ved den stumpe vinkel ligger mellem højden og trekanten), glider langs siden eller længere ud;
 * er der ikke plads, flyttes de ind i trekanten. Uændret, hvis intet virker.
 */
function clearSideLabels(out: Label[], segs: readonly (readonly [Point, Point])[], v: Record<Corner, Point>) {
  for (const sl of out) {
    if (!sl.key.startsWith("side") || !sl.dir || !sl.n) continue;
    if (!segs.some(([p, q]) => segmentHitsBox(p, q, sl))) continue;
    const { dir, n } = sl;
    const free = (c: Point) => {
      const box = { c, hw: sl.hw, hh: sl.hh };
      return !segs.some(([p, q]) => segmentHitsBox(p, q, box)) && !out.some((o) => o !== sl && hits(o, box));
    };
    const side = SIDES.find((s) => `side${s.key}` === sl.key);
    const sideLen = side ? Math.hypot(v[side.q].x - v[side.p].x, v[side.q].y - v[side.p].y) : 20;
    const slides = (limit: number) => {
      const list: number[] = [0];
      for (let t = 0.5; t <= limit; t += 0.5) list.push(t, -t);
      return list;
    };
    // 1) Lidt langs siden (centrum i sidens midterste halvdel), så etiketten stadig hører til siden.
    let at = slides(sideLen / 4).map((t) => add(sl.c, dir, t)).find(free);
    // 2) Inde i trekanten, ud for siden.
    if (!at && side) {
      const mid = { x: (v[side.p].x + v[side.q].x) / 2, y: (v[side.p].y + v[side.q].y) / 2 };
      const inner = besides(mid, { x: -n.x, y: -n.y }, LABEL_GAP + 0.6, sl.hw, sl.hh);
      at = slides(sideLen / 4)
        .map((t) => add(inner, dir, t))
        .find((c) => free(c) && insideTriangle(c, sl.hw, sl.hh, v, LABEL_GAP));
    }
    // 3) Længere ud (forbi højden) eller helt langs siden.
    if (!at) {
      const cands: Point[] = [];
      for (let t = 0.5; t <= 40; t += 0.5) cands.push(add(sl.c, n, t));
      for (const t of slides(sideLen / 2)) cands.push(add(sl.c, dir, t));
      at = cands.find(free);
    }
    if (at) sl.c = at;
  }
}

/**
 * Etiketterne (fælles trekantlogik i figures/triangleLabels.tsx) + højden h ved den stiplede
 * linje, når h er synlig. Svararket: `solved` giver facit for skjulte parametre med et
 * regnestykke. Skjulte afledte mål (h, T, O) tegnes aldrig (facit står i regnestykket).
 */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const shape = fig.shape;
  const values = compute(shape);
  const hVisible = fig.params.h?.visible === true;
  const ht = height(shape);
  const { v, H } = ht;
  const out = triangleLabels({
    fig,
    mode,
    measure,
    solved,
    v,
    values,
    sides: SIDES,
    // Ved C deler den synlige højde vinklen: værdien står i den største delvinkel.
    wedge: (k) => (k === "C" && hVisible && ht.onC ? [H, v[ht.far]] : null),
    // Værdien må hverken krydse den modstående side (flade, stumpe trekanter) eller højden.
    // Ved C (højden synlig og fodpunktet på c) heller ikke retvinkelmærket ved fodpunktet.
    clearOf: (k) => {
      const opp: Record<Corner, [Point, Point]> = { A: [v.B, v.C], B: [v.A, v.C], C: [v.A, v.B] };
      if (!hVisible) return [opp[k]];
      if (k !== "C") return [opp[k], [v.C, H]];
      if (!ht.onC) return [opp[k]];
      const top = add(H, unit(sub(v.C, H)), MARK_MM);
      return [opp[k], [top, add(top, ht.toward, 10)]];
    },
  });

  let hPlaced = !hVisible;
  if (hVisible) {
    const segs: [Point, Point][] = [[v.C, H]];
    if (ht.extension) segs.push([v[ht.near], H]);
    clearSideLabels(out, segs, v);
    // "h = 4,7 cm" ved siden af den stiplede højde: inde i den største deltrekant, eller (fodpunkt
    // på forlængelsen) udenfor, væk fra trekanten. Er der ikke plads, står h i mål-boksen.
    const text = `${displayName(fig, "h")} = ${FMT.len(values.h)}`;
    const { hw, hh } = labelBox(text, measure);
    const mark = { c: add(add(H, ht.toward, MARK_MM / 2), unit(sub(v.C, H)), MARK_MM / 2), hw: MARK_MM / 2, hh: MARK_MM / 2 };
    const back = { x: -ht.toward.x, y: -ht.toward.y };
    // Fodpunkt på c: helst i den største deltrekant, ellers i den anden.
    const sides = ht.onC ? [ht.toward, back] : [back];
    search: for (const side of sides) {
      for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
        const at = { x: H.x + (v.C.x - H.x) * t, y: H.y + (v.C.y - H.y) * t };
        const c = besides(at, side, LABEL_GAP + 0.6, hw, hh);
        const box = { c, hw, hh };
        if (out.some((l) => hits(l, box)) || hits(mark, box, 0.2)) continue;
        // Heller ikke vinkelbuerne (cirkler om hjørnerne).
        if (CORNERS.some((k) => boxNearPoint(box, v[k], arcRadius(v[k], ...others(v, k), 5) + 0.6))) continue;
        // Udenfor (fodpunkt på forlængelsen) står boksen altid på den modsatte side af trekanten.
        if (ht.onC && !insideTriangle(c, hw, hh, v, LABEL_GAP)) continue;
        out.push({ key: "sideh", text, c, hw, hh, fill: INK, data: { "data-ol-param": "h" } });
        hPlaced = true;
        break search;
      }
    }
  }
  // Afledte mål (T, O og evt. h): kun når de er synlige, i mål-boksen under figuren.
  const derived = triangleSpec.params.filter((p) => !(p.key === "h" && hPlaced));
  // Hjørnenavne regnes lidt bredere, så mål-boksen ikke står lige i forlængelse af fx "B" ("BO = …").
  const around = out.map((l) => (l.data["data-ol-name"] ? { ...l, hw: l.hw + 1.5 } : l));
  out.push(...derivedLabels(fig, derived, values, triangleSpec.bounds(shape), measure, around, DERIVED_CLEARANCE));
  return out;
}

/** Trekant med vinkelbuer ved alle tre hjørner; højden h stiplet med retvinkelmærke, når h er synlig. */
function drawing(fig: Fig): ReactNode {
  const v = vertices(fig.shape);
  const out: ReactNode[] = [
    <polygon key="body" points={polyPoints([v.A, v.B, v.C])} fill="none" stroke={INK} strokeWidth={0.5} strokeLinejoin="round" />,
    <path key="arcA" d={arcPath(v.A, v.B, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
    <path key="arcB" d={arcPath(v.B, v.A, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
    <path key="arcC" d={arcPath(v.C, v.A, v.B, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
  ];
  if (fig.params.h?.visible) {
    const { H, extension, near, toward } = height(fig.shape);
    const dash = { strokeDasharray: HIDDEN_EDGE.strokeDasharray, strokeWidth: 0.3 };
    out.push(
      <path key="height" data-ol-role="height" d={`M ${r2(v.C.x)} ${r2(v.C.y)} L ${r2(H.x)} ${r2(H.y)}`} fill="none" stroke={INK} {...dash} />,
    );
    if (extension) {
      // Fodpunktet ligger på forlængelsen af c: grundlinjen forlænges stiplet fra det nærmeste hjørne.
      out.push(
        <path
          key="baseExt"
          data-ol-role="base-extension"
          d={`M ${r2(v[near].x)} ${r2(v[near].y)} L ${r2(H.x)} ${r2(H.y)}`}
          fill="none"
          stroke={INK}
          {...dash}
        />,
      );
    }
    out.push(
      <path
        key="heightMark"
        data-ol-role="right-angle"
        d={rightAngleMark(H, v.C, add(H, toward, 10), MARK_MM)}
        fill="none"
        stroke={INK}
        strokeWidth={0.3}
      />,
    );
  }
  return out;
}

export const triangle: FigureDef<"triangle", TriangleShape> = {
  ...triangleSpec,
  ...makeSolver(triangleSpec),
  type: "triangle",
  name: "Fri trekant",
  group: "trekanter",
  icon: () => <path d="M3 19h18L9 5 3 19Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
  newShape: () => triangleSpec.defaultShape(),
  labels,
  drawing,
};
