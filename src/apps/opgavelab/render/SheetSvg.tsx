"use client";

// Opgavelab — A4-arket som ren SVG (1 enhed = 1 mm). Samme komponent bruges på
// skærmen og i PDF-eksporten (svg2pdf), så reglerne her er bevidst stramme:
//  - ét <text> pr. tekstrun med eksplicit x/y, ingen <tspan>
//  - ingen <style>, klasser eller filtre — alle stilattributter står direkte
//  - editor-overlay (markering, håndtag) kommer KUN som `children`

import { useMemo, type ReactNode, type Ref, type SVGProps } from "react";
import { FMT } from "../core/format";
import { numberDocument } from "../core/numbering";
import {
  displayName,
  figureBoundsOnSheet,
  getFigureDef,
  visibleParams,
} from "../model/figures";
import { PAGE } from "../model/types";
import type {
  CalcObject,
  Document as SheetDoc,
  FigureObject,
  Point,
  RightTriangleShape,
  TextObject,
} from "../model/types";
import { FONT_FAMILY, measureText } from "./measure";
import {
  CALC_GAP,
  PT_MM,
  calcContent,
  layoutText,
  type Measure,
} from "./textLayout";

export type SheetMode = "opgave" | "svarark";

const INK = "#16212e";
const BRAND = "#1a4f8b";
const LABEL_MM = 4.2; // ca. 12 pt
const NUMBER_MM = 5;

const r2 = (v: number) => Math.round(v * 100) / 100;
const unit = (p: Point): Point => {
  const l = Math.hypot(p.x, p.y) || 1;
  return { x: p.x / l, y: p.y / l };
};
const add = (p: Point, q: Point, k = 1): Point => ({ x: p.x + q.x * k, y: p.y + q.y * k });
const sub = (p: Point, q: Point): Point => ({ x: p.x - q.x, y: p.y - q.y });

type Anchor = "start" | "middle" | "end";

/** Placerer en etiket ved punktet p, så den ligger på den side af p som retningen n peger mod. */
function labelPos(p: Point, n: Point, size: number): { x: number; y: number; anchor: Anchor } {
  const anchor: Anchor = n.x > 0.4 ? "start" : n.x < -0.4 ? "end" : "middle";
  return { x: r2(p.x), y: r2(p.y + size * (0.35 + 0.5 * n.y)), anchor };
}

type TextProps = {
  x: number;
  y: number;
  size: number;
  anchor?: Anchor;
  bold?: boolean;
  fill?: string;
  children: string;
} & Record<`data-${string}`, string | undefined>;

function T({ x, y, size, anchor = "start", bold, fill = INK, children, ...data }: TextProps) {
  return (
    <text
      x={r2(x)}
      y={r2(y)}
      fontSize={r2(size)}
      textAnchor={anchor}
      fontWeight={bold ? 700 : 400}
      fill={fill}
      {...data}
    >
      {children}
    </text>
  );
}

// ---- tekst ----

function renderText(obj: TextObject, measure: Measure) {
  const l = layoutText(obj, measure);
  return (
    <g key={obj.id} data-ol-id={obj.id} data-ol-type="text">
      {l.lines.map((line, i) =>
        line ? (
          <T key={i} x={obj.x} y={obj.y + l.ascent + i * l.lineH} size={l.sizeMm}>
            {line}
          </T>
        ) : null,
      )}
    </g>
  );
}

// ---- regnestykke ----

function renderCalc(doc: SheetDoc, obj: CalcObject, mode: SheetMode, number: string, measure: Measure) {
  const c = calcContent(doc, obj, mode, number, measure);
  const baseline = obj.y + c.sizeMm * 0.95;
  const numW = number ? measure(number, c.sizeMm / PT_MM, true) + CALC_GAP : 0;
  return (
    <g key={obj.id} data-ol-id={obj.id} data-ol-type="calc">
      {number && (
        <T x={obj.x} y={baseline} size={c.sizeMm} bold data-ol-role="number">
          {number}
        </T>
      )}
      <T x={obj.x + numW} y={baseline} size={c.sizeMm} data-ol-role="body">
        {c.body}
      </T>
    </g>
  );
}

// ---- retvinklet trekant ----

function arcPath(v: Point, p: Point, q: Point, radius: number): string {
  const u = unit(sub(p, v));
  const w = unit(sub(q, v));
  const r = Math.min(radius, 0.4 * Math.min(Math.hypot(p.x - v.x, p.y - v.y), Math.hypot(q.x - v.x, q.y - v.y)));
  const s = add(v, u, r);
  const e = add(v, w, r);
  const sweep = u.x * w.y - u.y * w.x > 0 ? 1 : 0;
  return `M ${r2(s.x)} ${r2(s.y)} A ${r2(r)} ${r2(r)} 0 0 ${sweep} ${r2(e.x)} ${r2(e.y)}`;
}

function renderRightTriangle(
  fig: FigureObject,
  shape: RightTriangleShape,
  mode: SheetMode,
  measure: Measure,
): ReactNode {
  const def = getFigureDef(fig.figure)!;
  const v = def.vertices(shape) as Record<"A" | "B" | "C", Point>;
  const values = def.compute(shape);
  const vis = visibleParams(fig);
  const answer = mode === "svarark";
  const shown = (k: string) => answer || vis.has(k);
  const color = (k: string) => (answer && !vis.has(k) ? BRAND : INK);
  const G: Point = { x: (v.A.x + v.B.x + v.C.x) / 3, y: (v.A.y + v.B.y + v.C.y) / 3 };
  const out: ReactNode[] = [];

  out.push(
    <polygon
      key="body"
      points={`${r2(v.A.x)},${r2(v.A.y)} ${r2(v.B.x)},${r2(v.B.y)} ${r2(v.C.x)},${r2(v.C.y)}`}
      fill="none"
      stroke={INK}
      strokeWidth={0.5}
      strokeLinejoin="round"
    />,
  );

  // Vinkelbuer ved A og B; retvinkel-kvadrat ved C kun når C er synlig.
  out.push(
    <path key="arcA" d={arcPath(v.A, v.B, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
    <path key="arcB" d={arcPath(v.B, v.A, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
  );
  if (shown("C")) {
    const u = unit(sub(v.B, v.C));
    const w = unit(sub(v.A, v.C));
    const p1 = add(v.C, u, 3);
    const p2 = add(p1, w, 3);
    const p3 = add(v.C, w, 3);
    out.push(
      <path
        key="square"
        data-ol-role="right-angle"
        d={`M ${r2(p1.x)} ${r2(p1.y)} L ${r2(p2.x)} ${r2(p2.y)} L ${r2(p3.x)} ${r2(p3.y)}`}
        fill="none"
        stroke={color("C")}
        strokeWidth={0.3}
      />,
    );
  }

  // Hjørnenavne (alias ?? nøgle), 4 mm udad fra tyngdepunktet.
  for (const k of ["A", "B", "C"] as const) {
    const n = unit(sub(v[k], G));
    const lp = labelPos(add(v[k], n, 4), n, LABEL_MM);
    out.push(
      <T key={`name${k}`} x={lp.x} y={lp.y} size={LABEL_MM} anchor={lp.anchor} bold data-ol-name={k}>
        {displayName(fig, k)}
      </T>,
    );
  }

  // Vinkelværdier, indad langs vinkelhalveringslinjen (længere ind ved spidse vinkler).
  const neighbors: Record<"A" | "B" | "C", [Point, Point]> = {
    A: [v.B, v.C],
    B: [v.A, v.C],
    C: [v.A, v.B],
  };
  for (const k of ["A", "B", "C"] as const) {
    if (!shown(k)) continue;
    const [p, q] = neighbors[k];
    const bis = unit(add(unit(sub(p, v[k])), unit(sub(q, v[k]))));
    const text = FMT.ang(values[k]);
    const half = measure(text, LABEL_MM / PT_MM) / 2 + 0.8;
    const theta = (values[k] * Math.PI) / 360; // halv vinkel
    const maxD = 0.55 * Math.min(Math.hypot(p.x - v[k].x, p.y - v[k].y), Math.hypot(q.x - v[k].x, q.y - v[k].y));
    const d = Math.max(7, Math.min(half / Math.max(Math.tan(theta), 0.05), Math.max(7, maxD)));
    const pos = add(v[k], bis, d);
    out.push(
      <T
        key={`ang${k}`}
        x={pos.x}
        y={pos.y + LABEL_MM * 0.35}
        size={LABEL_MM}
        anchor="middle"
        fill={color(k)}
        data-ol-param={k}
      >
        {text}
      </T>,
    );
  }

  // Sider: a = BC (modstående A), b = AC (modstående B), c = AB (modstående C).
  const sides: { key: "a" | "b" | "c"; p: Point; q: Point; opp: Point }[] = [
    { key: "a", p: v.B, q: v.C, opp: v.A },
    { key: "b", p: v.A, q: v.C, opp: v.B },
    { key: "c", p: v.A, q: v.B, opp: v.C },
  ];
  for (const s of sides) {
    const mid: Point = { x: (s.p.x + s.q.x) / 2, y: (s.p.y + s.q.y) / 2 };
    const dir = unit(sub(s.q, s.p));
    let n: Point = { x: -dir.y, y: dir.x };
    const away = sub(mid, s.opp);
    if (n.x * away.x + n.y * away.y < 0) n = { x: -n.x, y: -n.y };
    const lp = labelPos(add(mid, n, 3.2), n, LABEL_MM);
    const name = displayName(fig, s.key);
    const text = shown(s.key) ? `${name} = ${FMT.len(values[s.key])}` : name;
    out.push(
      <T key={`side${s.key}`} x={lp.x} y={lp.y} size={LABEL_MM} anchor={lp.anchor} fill={color(s.key)} data-ol-param={s.key}>
        {text}
      </T>,
    );
  }
  return out;
}

function renderFigure(fig: FigureObject, mode: SheetMode, number: string, measure: Measure) {
  const def = getFigureDef(fig.figure);
  if (!def) return null;
  const b = def.bounds(fig.shape);
  return (
    <g
      key={fig.id}
      transform={`translate(${r2(fig.x)} ${r2(fig.y)})`}
      data-ol-id={fig.id}
      data-ol-type="figure"
    >
      {renderRightTriangle(fig, fig.shape, mode, measure)}
      {number && (
        <T x={b.minX - 10} y={b.minY + NUMBER_MM * 0.3} size={NUMBER_MM} bold data-ol-role="number">
          {number}
        </T>
      )}
    </g>
  );
}

// ---- arket ----

export function SheetSvg({
  doc,
  mode,
  numbering,
  measure = measureText,
  children,
  svgRef,
  svgProps,
}: {
  doc: SheetDoc;
  mode: SheetMode;
  /** Objekt-id → nummer; udledes af dokumentet hvis udeladt. */
  numbering?: ReadonlyMap<string, string>;
  measure?: Measure;
  /** Editor-overlay. Sendes KUN med fra editoren. */
  children?: ReactNode;
  svgRef?: Ref<SVGSVGElement>;
  svgProps?: Omit<SVGProps<SVGSVGElement>, "ref" | "viewBox" | "children">;
}) {
  const nums = useMemo(() => numbering ?? numberDocument(doc, figureBoundsOnSheet), [numbering, doc]);
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${PAGE.w} ${PAGE.h}`}
      fontFamily={FONT_FAMILY}
      data-ol-sheet={mode}
      {...svgProps}
    >
      <rect x={0} y={0} width={PAGE.w} height={PAGE.h} fill="#ffffff" />
      {doc.objects.map((o) => {
        if (o.type === "text") return renderText(o, measure);
        if (o.type === "figure") return renderFigure(o, mode, nums.get(o.id) ?? "", measure);
        return renderCalc(doc, o, mode, nums.get(o.id) ?? "", measure);
      })}
      {children}
    </svg>
  );
}
