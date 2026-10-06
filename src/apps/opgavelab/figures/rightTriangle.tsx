// Opgavelab — figuren "Retvinklet trekant": geometri og regler fra core/rightTriangle.ts
// (Node-testbar), Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, rightTriangleSpec, vertices } from "../core/rightTriangle";
import { makeSolver } from "../core/solveKit";
import { displayName, visibleParams } from "../model/params";
import type { FigureObjectOf, Point, RightTriangleShape } from "../model/types";
import {
  BRAND,
  INK,
  LABEL_GAP,
  add,
  besides,
  labelBox,
  r2,
  sub,
  unit,
} from "../render/primitives";
import type { Measure } from "../render/textLayout";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"rightTriangle", RightTriangleShape>;
type Corner = "A" | "B" | "C";

/** mm mellem hjørnenavn og vinkelværdi, når værdien står udenfor. */
const OUTSIDE_GAP = 1.6;
/** Ny trekant: 8 × 6 cm (c = 10 cm), så vinkelværdierne får plads inde i figuren. */
const NEW_MM = { a: 80, b: 60 } as const;

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

/**
 * Etiketterne. Svararket: `solved` giver facit for skjulte parametre med et regnestykke, og
 * etiketten viser facit i stedet for figurens egen værdi, så figur og udregning stemmer.
 * Geometrien (fx vinkelværdiens placering) bruger altid figurens egne værdier.
 */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const shape = fig.shape;
  const v = vertices(shape);
  const values = compute(shape);
  const textValue = (k: string) => (mode === "svarark" && Object.prototype.hasOwnProperty.call(solved, k) ? solved[k] : values[k]);
  const vis = visibleParams(fig);
  const answer = mode === "svarark";
  const shown = (k: string) => answer || vis.has(k);
  const color = (k: string) => (answer && !vis.has(k) ? BRAND : INK);
  const out: Label[] = [];
  const neighbors: Record<Corner, [Point, Point]> = {
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
  const nameLabels = {} as Record<Corner, { label: Label; bis: Point; nb: { hw: number; hh: number } }>;
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

/** Trekant, vinkelbuer ved A og B og retvinkel-kvadrat ved C (kun når C er synlig). */
function drawing(fig: Fig, mode: SheetMode): ReactNode {
  const v = vertices(fig.shape);
  const vis = visibleParams(fig);
  const answer = mode === "svarark";
  const out: ReactNode[] = [
    <polygon
      key="body"
      points={`${r2(v.A.x)},${r2(v.A.y)} ${r2(v.B.x)},${r2(v.B.y)} ${r2(v.C.x)},${r2(v.C.y)}`}
      fill="none"
      stroke={INK}
      strokeWidth={0.5}
      strokeLinejoin="round"
    />,
    <path key="arcA" d={arcPath(v.A, v.B, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
    <path key="arcB" d={arcPath(v.B, v.A, v.C, 5)} fill="none" stroke={INK} strokeWidth={0.3} />,
  ];
  if (answer || vis.has("C")) {
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
        stroke={answer && !vis.has("C") ? BRAND : INK}
        strokeWidth={0.3}
      />,
    );
  }
  return out;
}

export const rightTriangle: FigureDef<"rightTriangle", RightTriangleShape> = {
  ...rightTriangleSpec,
  ...makeSolver(rightTriangleSpec),
  type: "rightTriangle",
  name: "Retvinklet trekant",
  icon: () => (
    <>
      <path d="M5 4v16h14L5 4Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M5 15h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  newShape: () => ({ ...rightTriangleSpec.defaultShape(), a: NEW_MM.a, b: NEW_MM.b }),
  labels,
  drawing,
};
