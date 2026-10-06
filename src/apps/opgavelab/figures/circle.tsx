// Opgavelab — figuren "Cirkel": geometri og regler fra core/circle.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { circleSpec, compute } from "../core/circle";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { CircleShape, FigureObjectOf, Point } from "../model/types";
import { INK, LABEL_GAP, add, besides, labelBox, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, derivedLabels, ellipsePath, paramShow } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"circle", CircleShape>;

/** Radiuslinjens retning: 40° op mod højre (SVG: y nedad). */
const R_DEG = 40;
const R_DIR: Point = { x: Math.cos((R_DEG * Math.PI) / 180), y: -Math.sin((R_DEG * Math.PI) / 180) };
/** mm luft mellem en etiket og cirklens rand, når den står indeni. */
const EDGE_GAP = 0.8;

/** Ligger hele boksen (centrum c, halve mål hw/hh) inden for cirklen med radius r − EDGE_GAP? */
function fitsInside(c: Point, hw: number, hh: number, r: number): boolean {
  const lim = r - EDGE_GAP;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) if (Math.hypot(c.x + sx * hw, c.y + sy * hh) > lim) return false;
  return true;
}

/** Etiketter: r ved midten af radiuslinjen, d ved diameteren (kun når d er synlig), afledte mål under. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { r } = fig.shape;
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const out: Label[] = [];

  // r: indeni cirklen, over radiuslinjen (til venstre for den); passer den ikke, udenfor ved randen.
  const name = displayName(fig, "r");
  const text = show.shown("r") ? `${name} = ${FMT.len(show.value("r"))}` : name;
  const { hw, hh } = labelBox(text, measure);
  const mid = add({ x: 0, y: 0 }, R_DIR, r / 2);
  const left: Point = { x: R_DIR.y, y: -R_DIR.x }; // 90° mod uret: op og til venstre for linjen
  let c = besides(mid, left, LABEL_GAP + 0.6, hw, hh);
  if (!fitsInside(c, hw, hh, r)) c = besides(add({ x: 0, y: 0 }, R_DIR, r), R_DIR, LABEL_GAP + 0.6, hw, hh);
  out.push({ key: "sider", text, c, hw, hh, fill: show.color("r"), data: { "data-ol-param": "r" } });

  if (fig.params.d?.visible) {
    // Diameteren d: etiketten under linjen midt i cirklen; passer den ikke, under cirklen.
    const dText = `${displayName(fig, "d")} = ${FMT.len(values.d)}`;
    const db = labelBox(dText, measure);
    let dc = besides({ x: 0, y: 0 }, { x: 0, y: 1 }, LABEL_GAP + 0.6, db.hw, db.hh);
    if (!fitsInside(dc, db.hw, db.hh, r)) dc = besides({ x: 0, y: r }, { x: 0, y: 1 }, LABEL_GAP + 0.6, db.hw, db.hh);
    out.push({ key: "sided", text: dText, c: dc, hw: db.hw, hh: db.hh, fill: INK, data: { "data-ol-param": "d" } });
  }
  const others = circleSpec.params.filter((p) => p.key !== "d");
  out.push(...derivedLabels(fig, others, values, circleSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Cirklen med centrumprik og radiuslinje; den stiplede diameter når d er synlig. */
function drawing(fig: Fig): ReactNode {
  const { r } = fig.shape;
  const e = add({ x: 0, y: 0 }, R_DIR, r);
  const out: ReactNode[] = [
    <path key="body" d={ellipsePath({ x: 0, y: 0 }, r, r, "full")} fill="none" stroke={INK} strokeWidth={0.5} />,
    <path key="radius" d={`M 0 0 L ${r2(e.x)} ${r2(e.y)}`} fill="none" stroke={INK} strokeWidth={0.4} />,
    <circle key="centre" cx={0} cy={0} r={0.7} fill={INK} />,
  ];
  if (fig.params.d?.visible) {
    out.push(
      <path key="diam" d={`M ${r2(-r)} 0 L ${r2(r)} 0`} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.5 1" />,
    );
  }
  return out;
}

export const circle: FigureDef<"circle", CircleShape> = {
  ...circleSpec,
  ...makeSolver(circleSpec),
  type: "circle",
  name: "Cirkel",
  group: "cirkler",
  handleName: (_key, displayName) => `Radius ${displayName}`,
  icon: () => (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 12 18.4 7.9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  newShape: () => circleSpec.defaultShape(),
  labels,
  drawing,
};
