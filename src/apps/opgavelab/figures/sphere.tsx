// Opgavelab — figuren "Kugle": geometri og regler fra core/sphere.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning (cirkel med ækvator: forreste halvdel fuld, bagerste stiplet),
// etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { EQUATOR_RY, compute, sphereSpec } from "../core/sphere";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { FigureObjectOf, Point, SphereShape } from "../model/types";
import { INK, LABEL_GAP, add, besides, labelBox, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, HIDDEN_EDGE, derivedLabels, ellipsePath, paramShow } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"sphere", SphereShape>;

/** Radiuslinjens retning: 35° op mod højre (SVG: y nedad). */
const R_DEG = 35;
const R_DIR: Point = { x: Math.cos((R_DEG * Math.PI) / 180), y: -Math.sin((R_DEG * Math.PI) / 180) };
/** mm luft mellem en etiket og kuglens rand / ækvator, når den står indeni. */
const EDGE_GAP = 0.8;

/** Ligger hele boksen inden for cirklen (r − EDGE_GAP) og OVER ækvators bagerste (stiplede) halvbue? */
function fitsAboveEquator(c: Point, hw: number, hh: number, r: number): boolean {
  const lim = r - EDGE_GAP;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) if (Math.hypot(c.x + sx * hw, c.y + sy * hh) > lim) return false;
  // Den bagerste halvbue y = −ry · √(1 − (x / r)²) er højest ved boksens mindste |x|; boksens bund skal ligge over den.
  const xMin = c.x - hw <= 0 && c.x + hw >= 0 ? 0 : Math.min(Math.abs(c.x - hw), Math.abs(c.x + hw));
  const arcY = -EQUATOR_RY * r * Math.sqrt(Math.max(0, 1 - (xMin / r) ** 2));
  return c.y + hh + EDGE_GAP < arcY;
}

/** Etiketter: r ved radiuslinjen (indeni over ækvator, ellers udenfor), d ved diameteren (kun når synlig), afledte mål under. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { r } = fig.shape;
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const out: Label[] = [];

  const name = displayName(fig, "r");
  const text = show.shown("r") ? `${name} = ${FMT.len(show.value("r"))}` : name;
  const { hw, hh } = labelBox(text, measure);
  const left: Point = { x: R_DIR.y, y: -R_DIR.x }; // op og til venstre for linjen
  let c: Point | null = null;
  for (const t of [0.5, 0.6, 0.7, 0.4]) {
    const cand = besides(add({ x: 0, y: 0 }, R_DIR, r * t), left, LABEL_GAP + 0.6, hw, hh);
    if (fitsAboveEquator(cand, hw, hh, r)) {
      c = cand;
      break;
    }
  }
  if (!c) c = besides(add({ x: 0, y: 0 }, R_DIR, r), R_DIR, LABEL_GAP + 0.6, hw, hh);
  out.push({ key: "sider", text, c, hw, hh, fill: show.color("r"), data: { "data-ol-param": "r" } });

  if (fig.params.d?.visible) {
    // Diameteren d: etiketten til venstre for den stiplede linjes venstre ende.
    const dText = `${displayName(fig, "d")} = ${FMT.len(values.d)}`;
    const db = labelBox(dText, measure);
    const dc = besides({ x: -r, y: 0 }, { x: -1, y: 0 }, LABEL_GAP + 0.6, db.hw, db.hh);
    out.push({ key: "sided", text: dText, c: dc, hw: db.hw, hh: db.hh, fill: INK, data: { "data-ol-param": "d" } });
  }
  const others = sphereSpec.params.filter((p) => p.key !== "d");
  out.push(...derivedLabels(fig, others, values, sphereSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Kuglen: cirkel, ækvator (forreste halvdel fuld, bagerste stiplet), centrumprik og radiuslinje. */
function drawing(fig: Fig): ReactNode {
  const { r } = fig.shape;
  const ry = EQUATOR_RY * r;
  const e = add({ x: 0, y: 0 }, R_DIR, r);
  const o = { x: 0, y: 0 };
  const out: ReactNode[] = [
    <path key="hidden" data-ol-role="hidden-edges" d={ellipsePath(o, r, ry, "back")} fill="none" stroke={INK} {...HIDDEN_EDGE} />,
    <path
      key="body"
      data-ol-role="edges"
      d={`${ellipsePath(o, r, r, "full")} ${ellipsePath(o, r, ry, "front")}`}
      fill="none"
      stroke={INK}
      strokeWidth={0.5}
    />,
    <path key="radius" d={`M 0 0 L ${r2(e.x)} ${r2(e.y)}`} fill="none" stroke={INK} strokeWidth={0.4} />,
    <circle key="centre" cx={0} cy={0} r={0.7} fill={INK} />,
  ];
  if (fig.params.d?.visible) {
    out.push(<path key="diam" d={`M ${r2(-r)} 0 L ${r2(r)} 0`} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.5 1" />);
  }
  return out;
}

export const sphere: FigureDef<"sphere", SphereShape> = {
  ...sphereSpec,
  ...makeSolver(sphereSpec),
  type: "sphere",
  name: "Kugle",
  group: "rumfigurer",
  handleName: (_key, displayName) => `Radius ${displayName}`,
  icon: () => (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M3 12a9 3 0 0 0 18 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 12a9 3 0 0 1 18 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="2 1.5" />
    </>
  ),
  newShape: () => sphereSpec.defaultShape(),
  labels,
  drawing,
};
