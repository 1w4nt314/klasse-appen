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
  docSolvedValues,
  figureBoundsOnSheet,
  getFigureDef,
  solvedValues,
  visibleParams,
} from "../model/figures";
import { DEFAULT_SETTINGS, PAGE } from "../model/types";
import type {
  Bounds,
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

function arcRadius(v: Point, p: Point, q: Point, radius: number): number {
  return Math.min(radius, 0.4 * Math.min(Math.hypot(p.x - v.x, p.y - v.y), Math.hypot(q.x - v.x, q.y - v.y)));
}

function arcPath(v: Point, p: Point, q: Point, radius: number): string {
  const u = unit(sub(p, v));
  const w = unit(sub(q, v));
  const r = arcRadius(v, p, q, radius);
  const s = add(v, u, r);
  const e = add(v, w, r);
  const sweep = u.x * w.y - u.y * w.x > 0 ? 1 : 0;
  return `M ${r2(s.x)} ${r2(s.y)} A ${r2(r)} ${r2(r)} 0 0 ${sweep} ${r2(e.x)} ${r2(e.y)}`;
}

/** En placeret etiket: tekstens centrum (c) og halve mål, i figurens lokale mm. */
type Label = {
  key: string;
  text: string;
  c: Point;
  hw: number;
  hh: number;
  bold?: boolean;
  fill: string;
  data: Record<`data-${string}`, string>;
  /** Kun sideetiketter: sidens retning, så etiketten kan glide langs siden. */
  dir?: Point;
  /** Kun sideetiketter: enhedsnormal væk fra figuren. */
  n?: Point;
};

const LABEL_GAP = 1; // mm luft mellem etiket og linje
const OUTSIDE_GAP = 1.6; // mm mellem hjørnenavn og vinkelværdi, når værdien står udenfor
/** Halv højde af en tekstlinje (versaler/cifre) i forhold til skriftstørrelsen. */
const HALF_H = 0.37;

function labelBox(text: string, measure: Measure, bold = false): { hw: number; hh: number } {
  return { hw: measure(text, LABEL_MM / PT_MM, bold) / 2 + 0.3, hh: LABEL_MM * HALF_H + 0.2 };
}

/** Centrum for en boks, der ligger på n-siden af p med `gap` mm luft (n er en enhedsvektor). */
function besides(p: Point, n: Point, gap: number, hw: number, hh: number): Point {
  return add(p, n, gap + Math.abs(n.x) * hw + Math.abs(n.y) * hh);
}

/**
 * @param solved svararket: facit for skjulte parametre med et regnestykke (param → værdi).
 *   Etiketten viser facit i stedet for figurens egen værdi, så figur og udregning stemmer.
 *   Geometrien (fx vinkelværdiens placering) bruger altid figurens egne værdier.
 */
function rightTriangleLabels(
  fig: FigureObject,
  shape: RightTriangleShape,
  mode: SheetMode,
  measure: Measure,
  solved: Record<string, number> = {},
): Label[] {
  const def = getFigureDef(fig.figure)!;
  const v = def.vertices(shape) as Record<"A" | "B" | "C", Point>;
  const values = def.compute(shape);
  const textValue = (k: string) => (mode === "svarark" && Object.prototype.hasOwnProperty.call(solved, k) ? solved[k] : values[k]);
  const vis = visibleParams(fig);
  const answer = mode === "svarark";
  const shown = (k: string) => answer || vis.has(k);
  const color = (k: string) => (answer && !vis.has(k) ? BRAND : INK);
  const out: Label[] = [];
  const neighbors: Record<"A" | "B" | "C", [Point, Point]> = {
    A: [v.B, v.C],
    B: [v.A, v.C],
    C: [v.A, v.B],
  };

  // Sidetekster og hjørnenavne placeres først, så vinkelværdier uden for figuren kan undgå dem.
  const sideLabels: Label[] = [];
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
    const name = displayName(fig, s.key);
    const text = shown(s.key) ? `${name} = ${FMT.len(textValue(s.key))}` : name;
    const { hw, hh } = labelBox(text, measure);
    sideLabels.push({
      key: `side${s.key}`,
      text,
      c: besides(mid, n, LABEL_GAP + 0.6, hw, hh),
      hw,
      hh,
      fill: color(s.key),
      data: { "data-ol-param": s.key },
      dir,
      n,
    });
  }
  const nameLabels = {} as Record<"A" | "B" | "C", { label: Label; bis: Point; nb: { hw: number; hh: number } }>;
  for (const k of ["A", "B", "C"] as const) {
    const [p, q] = neighbors[k];
    // Vinkelhalveringslinjen ind i trekanten; hjørnenavnet står modsat (udad).
    const bis = unit(add(unit(sub(p, v[k])), unit(sub(q, v[k]))));
    const name = displayName(fig, k);
    const nb = labelBox(name, measure, true);
    const outward = { x: -bis.x, y: -bis.y };
    nameLabels[k] = {
      bis,
      nb,
      label: {
        key: `name${k}`,
        text: name,
        c: besides(v[k], outward, 1.6, nb.hw, nb.hh),
        ...nb,
        bold: true,
        fill: INK,
        data: { "data-ol-name": k },
      },
    };
  }
  // Små figurer: en sideetiket, der rammer et hjørnenavn, glider det mindste stykke langs siden.
  const overlaps = (a: Label, c: Point, b: Label) =>
    Math.abs(c.x - b.c.x) < a.hw + b.hw + 1.2 && Math.abs(c.y - b.c.y) < a.hh + b.hh + 0.6;
  for (const sl of sideLabels) {
    const names = (["A", "B", "C"] as const).map((k) => nameLabels[k].label);
    if (!sl.dir || !names.some((nl) => overlaps(sl, sl.c, nl))) continue;
    const dir = sl.dir;
    let moved = false;
    search: for (let t = 0.5; t <= 8; t += 0.5) {
      for (const sgn of [1, -1]) {
        const at = add(sl.c, dir, sgn * t);
        if (!names.some((nl) => overlaps(sl, at, nl))) {
          sl.c = at;
          moved = true;
          break search;
        }
      }
    }
    // Er etiketten bredere end siden, rykkes den i stedet længere væk fra figuren.
    if (!moved && sl.n) {
      for (let t = 0.5; t <= 8; t += 0.5) {
        const at = add(sl.c, sl.n, t);
        if (!names.some((nl) => overlaps(sl, at, nl))) {
          sl.c = at;
          break;
        }
      }
    }
  }
  const obstacles: Label[] = [...sideLabels, ...(["A", "B", "C"] as const).map((k) => nameLabels[k].label)];

  for (const k of ["A", "B", "C"] as const) {
    const [p, q] = neighbors[k];
    const { bis, nb, label: nameLabel } = nameLabels[k];
    out.push(nameLabel);

    if (!shown(k)) continue;
    // Vinkelværdien står på halveringslinjen så langt inde, at boksen hverken rammer
    // siderne, vinkelbuen eller retvinkel-kvadratet.
    const text = FMT.ang(textValue(k));
    const { hw, hh } = labelBox(text, measure);
    const along = Math.abs(bis.x) * hw + Math.abs(bis.y) * hh;
    const across = Math.abs(bis.y) * hw + Math.abs(bis.x) * hh;
    const theta = (values[k] * Math.PI) / 360; // halv vinkel
    const dSides = along + (LABEL_GAP + across * Math.cos(theta)) / Math.max(Math.sin(theta), 0.02);
    const inner = k === "C" ? (shown("C") ? 3 * Math.SQRT2 : 0) : arcRadius(v[k], p, q, 5);
    const dInner = along + inner + 0.6;
    const minSide = Math.min(Math.hypot(p.x - v[k].x, p.y - v[k].y), Math.hypot(q.x - v[k].x, q.y - v[k].y));
    const want = Math.max(dSides, dInner);
    let c: Point;
    if (want <= 0.6 * minSide) {
      c = add(v[k], bis, want);
    } else {
      // Ikke plads inde i vinklen (små figurer): værdien står udenfor på samme linje som
      // hjørnenavnet, helst lige til højre for det ("A  53,1°"), ellers til venstre.
      const nameC = nameLabel.c;
      const right = { x: nameC.x + nb.hw + OUTSIDE_GAP + hw, y: nameC.y };
      const left = { x: nameC.x - nb.hw - OUTSIDE_GAP - hw, y: nameC.y };
      const hits = (at: Point) =>
        obstacles.some(
          (o) => o !== nameLabel && Math.abs(at.x - o.c.x) < hw + o.hw + 0.3 && Math.abs(at.y - o.c.y) < hh + o.hh + 0.3,
        );
      c = !hits(right) || hits(left) ? right : left;
    }
    const angle: Label = { key: `ang${k}`, text, c, hw, hh, fill: color(k), data: { "data-ol-param": k } };
    out.push(angle);
    obstacles.push(angle);
  }
  out.push(...sideLabels);
  return out;
}

function labelsBounds(labels: Label[], base: Bounds): Bounds {
  const b = { ...base };
  for (const l of labels) {
    b.minX = Math.min(b.minX, l.c.x - l.hw);
    b.maxX = Math.max(b.maxX, l.c.x + l.hw);
    b.minY = Math.min(b.minY, l.c.y - l.hh);
    b.maxY = Math.max(b.maxY, l.c.y + l.hh);
  }
  return b;
}

/**
 * Svararkets etiketter fylder mest; facit kan have en anden bredde end figurens egen værdi
 * (fx 9,9 → 10,0 cm). Pladsen regnes derfor som foreningen af begge varianter, så den kun
 * afhænger af figuren (ikke af dokumentets regnestykker) og er ens overalt.
 */
function svararkLabelBounds(fig: FigureObject, measure: Measure): Bounds {
  const def = getFigureDef(fig.figure)!;
  const base = labelsBounds(rightTriangleLabels(fig, fig.shape, "svarark", measure), def.bounds(fig.shape));
  const solved = solvedValues(fig, DEFAULT_SETTINGS);
  return Object.keys(solved).length === 0
    ? base
    : labelsBounds(rightTriangleLabels(fig, fig.shape, "svarark", measure, solved), base);
}

/** Opgavenummerets placering (lokale mm): til venstre for etiketterne, øverst. Ens i begge modes. */
function numberBox(fig: FigureObject, number: string, measure: Measure): { x: number; baseline: number; box: Bounds } {
  // Svararket viser alle værdier, så dets etiketter er de bredeste: placér ud fra dem.
  const ext = svararkLabelBounds(fig, measure);
  const w = measure(number, NUMBER_MM / PT_MM, true);
  const x = ext.minX - 3.5 - w;
  const top = ext.minY;
  return { x, baseline: top + NUMBER_MM * 0.73, box: { minX: x, minY: top, maxX: x + w, maxY: top + NUMBER_MM * 0.75 } };
}

/**
 * Hele figurens udstrækning på ARKET inkl. etiketter (som på svararket) og opgavenummer.
 * Editoren holder denne boks inden for arkets margen.
 */
export function figureExtent(fig: FigureObject, number: string, measure: Measure = measureText): Bounds {
  const def = getFigureDef(fig.figure);
  if (!def) return { minX: fig.x, minY: fig.y, maxX: fig.x, maxY: fig.y };
  let b = svararkLabelBounds(fig, measure);
  if (number) {
    const nb = numberBox(fig, number, measure).box;
    b = {
      minX: Math.min(b.minX, nb.minX),
      minY: Math.min(b.minY, nb.minY),
      maxX: Math.max(b.maxX, nb.maxX),
      maxY: Math.max(b.maxY, nb.maxY),
    };
  }
  return { minX: fig.x + b.minX, minY: fig.y + b.minY, maxX: fig.x + b.maxX, maxY: fig.y + b.maxY };
}

function renderRightTriangle(
  fig: FigureObject,
  shape: RightTriangleShape,
  mode: SheetMode,
  measure: Measure,
  solved: Record<string, number>,
): ReactNode {
  const def = getFigureDef(fig.figure)!;
  const v = def.vertices(shape) as Record<"A" | "B" | "C", Point>;
  const vis = visibleParams(fig);
  const answer = mode === "svarark";
  const shown = (k: string) => answer || vis.has(k);
  const color = (k: string) => (answer && !vis.has(k) ? BRAND : INK);
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

  for (const l of rightTriangleLabels(fig, shape, mode, measure, solved)) {
    out.push(
      <T
        key={l.key}
        x={l.c.x}
        y={l.c.y + LABEL_MM * HALF_H}
        size={LABEL_MM}
        anchor="middle"
        bold={l.bold}
        fill={l.fill}
        {...l.data}
      >
        {l.text}
      </T>,
    );
  }
  return out;
}

function renderFigure(doc: SheetDoc, fig: FigureObject, mode: SheetMode, number: string, measure: Measure) {
  const def = getFigureDef(fig.figure);
  if (!def) return null;
  const nb = number ? numberBox(fig, number, measure) : null;
  return (
    <g
      key={fig.id}
      transform={`translate(${r2(fig.x)} ${r2(fig.y)})`}
      data-ol-id={fig.id}
      data-ol-type="figure"
    >
      {renderRightTriangle(fig, fig.shape, mode, measure, mode === "svarark" ? docSolvedValues(doc, fig) : {})}
      {nb && (
        <T x={nb.x} y={nb.baseline} size={NUMBER_MM} bold data-ol-role="number">
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
        if (o.type === "figure") return renderFigure(doc, o, mode, nums.get(o.id) ?? "", measure);
        return renderCalc(doc, o, mode, nums.get(o.id) ?? "", measure);
      })}
      {children}
    </svg>
  );
}
