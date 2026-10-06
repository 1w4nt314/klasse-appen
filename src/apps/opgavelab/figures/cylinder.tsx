// Opgavelab — figuren "Cylinder": geometri og regler fra core/cylinder.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning (topellipse hel, bund halv fuld/halv stiplet), etiketter,
// ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, cylinderSpec, ellipseRy } from "../core/cylinder";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { CylinderShape, FigureObjectOf, Point } from "../model/types";
import { INK, LABEL_GAP, besides, labelBox, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, HIDDEN_EDGE, derivedLabels, ellipsePath, paramShow, separateLabels, sideLabel } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"cylinder", CylinderShape>;

/** mm luft mellem en etiket og toppellipsens kant, når den står indeni. */
const EDGE_GAP = 0.8;

/** Ligger hele boksen (centrum c, halve mål hw/hh) inden for ellipsen (rx, ry) mindre EDGE_GAP? */
function fitsInEllipse(c: Point, hw: number, hh: number, rx: number, ry: number): boolean {
  const a = rx - EDGE_GAP;
  const b = ry - EDGE_GAP;
  if (a <= 0 || b <= 0) return false;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) if (((c.x + sx * hw) / a) ** 2 + ((c.y + sy * hh) / b) ** 2 > 1) return false;
  return true;
}

/** Rammer boksen (med EDGE_GAP luft) bundens bagerste, stiplede halvbue? (Den stikker op i toppen, når h er lille.) */
function hitsBackArc(c: Point, hw: number, hh: number, r: number, h: number, ry: number): boolean {
  for (let i = 0; i <= 48; i++) {
    const t = (Math.PI * i) / 48;
    const x = r * Math.cos(t);
    const y = h - ry * Math.sin(t);
    if (Math.abs(x - c.x) < hw + EDGE_GAP && Math.abs(y - c.y) < hh + EDGE_GAP) return true;
  }
  return false;
}

/** Etiketter: r over radiuslinjen (ellers til højre for randen), h til højre for højre side, d (kun når synlig) til venstre. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { r, h } = fig.shape;
  const ry = ellipseRy(r);
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const out: Label[] = [];

  const rName = displayName(fig, "r");
  const rText = show.shown("r") ? `${rName} = ${FMT.len(show.value("r"))}` : rName;
  const rb = labelBox(rText, measure);
  let rc = { x: r / 2, y: -(LABEL_GAP + 0.3) - rb.hh };
  if (!fitsInEllipse(rc, rb.hw, rb.hh, r, ry) || hitsBackArc(rc, rb.hw, rb.hh, r, h, ry)) {
    rc = besides({ x: r, y: 0 }, { x: 1, y: 0 }, LABEL_GAP + 1.8, rb.hw, rb.hh);
  }
  out.push({ key: "sider", text: rText, c: rc, hw: rb.hw, hh: rb.hh, fill: show.color("r"), data: { "data-ol-param": "r" } });

  const hName = displayName(fig, "h");
  const hText = show.shown("h") ? `${hName} = ${FMT.len(show.value("h"))}` : hName;
  const sl = sideLabel({ x: r, y: 0 }, { x: r, y: h }, { x: 0, y: h / 2 }, hText, measure);
  out.push({ key: "sideh", text: hText, c: sl.c, hw: sl.hw, hh: sl.hh, fill: show.color("h"), data: { "data-ol-param": "h" }, dir: sl.dir, n: sl.n });

  if (fig.params.d?.visible) {
    const dText = `${displayName(fig, "d")} = ${FMT.len(values.d)}`;
    const db = labelBox(dText, measure);
    const dc = besides({ x: -r, y: 0 }, { x: -1, y: 0 }, LABEL_GAP + 0.6, db.hw, db.hh);
    out.push({ key: "sided", text: dText, c: dc, hw: db.hw, hh: db.hh, fill: INK, data: { "data-ol-param": "d" } });
  }
  separateLabels(out);
  const others = cylinderSpec.params.filter((p) => p.key !== "d");
  out.push(...derivedLabels(fig, others, values, cylinderSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Cylinderen: hel topellipse, to sider, bundens forreste halvbue fuld og den bagerste stiplet (ét <path>). */
function drawing(fig: Fig): ReactNode {
  const { r, h } = fig.shape;
  const ry = ellipseRy(r);
  const body =
    `${ellipsePath({ x: 0, y: 0 }, r, ry, "full")} M ${r2(-r)} 0 L ${r2(-r)} ${r2(h)} M ${r2(r)} 0 L ${r2(r)} ${r2(h)} ` +
    ellipsePath({ x: 0, y: h }, r, ry, "front");
  const out: ReactNode[] = [
    <path key="hidden" data-ol-role="hidden-edges" d={ellipsePath({ x: 0, y: h }, r, ry, "back")} fill="none" stroke={INK} {...HIDDEN_EDGE} />,
    <path key="body" data-ol-role="edges" d={body} fill="none" stroke={INK} strokeWidth={0.5} />,
    <path key="radius" d={`M 0 0 L ${r2(r)} 0`} fill="none" stroke={INK} strokeWidth={0.4} />,
    <circle key="centre" cx={0} cy={0} r={0.7} fill={INK} />,
  ];
  if (fig.params.d?.visible) {
    out.push(<path key="diam" d={`M ${r2(-r)} 0 L ${r2(r)} 0`} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.5 1" />);
  }
  return out;
}

export const cylinder: FigureDef<"cylinder", CylinderShape> = {
  ...cylinderSpec,
  ...makeSolver(cylinderSpec),
  type: "cylinder",
  name: "Cylinder",
  group: "rumfigurer",
  handleName: (_key, name) => `Håndtag for ${name}`,
  icon: () => (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M5 6v12M19 6v12M5 18a7 2.8 0 0 0 14 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M5 18a7 2.8 0 0 1 14 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="2 1.5" />
    </>
  ),
  newShape: () => cylinderSpec.defaultShape(),
  labels,
  drawing,
};
