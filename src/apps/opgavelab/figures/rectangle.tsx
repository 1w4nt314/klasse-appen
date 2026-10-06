// Opgavelab — figuren "Rektangel": geometri og regler fra core/rectangle.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, rectangleSpec, outline } from "../core/rectangle";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { FigureObjectOf, Point, RectangleShape } from "../model/types";
import { INK, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, derivedLabels, paramShow, polyPoints, sideLabel } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"rectangle", RectangleShape>;

/** Etiketter: l under, b til højre, diagonalen d ved midten (kun når d er synlig), afledte mål under. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { l, b } = fig.shape;
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const centre: Point = { x: l / 2, y: b / 2 };
  const out: Label[] = [];
  const side = (key: string, p: Point, q: Point, away: Point) => {
    const name = displayName(fig, key);
    const text = show.shown(key) ? `${name} = ${FMT.len(show.value(key))}` : name;
    const sl = sideLabel(p, q, away, text, measure);
    out.push({
      key: `side${key}`,
      text,
      c: sl.c,
      hw: sl.hw,
      hh: sl.hh,
      fill: show.color(key),
      data: { "data-ol-param": key },
      dir: sl.dir,
      n: sl.n,
    });
  };
  side("l", { x: 0, y: b }, { x: l, y: b }, centre);
  side("b", { x: l, y: 0 }, { x: l, y: b }, centre);
  if (fig.params.d?.visible) {
    // Diagonalen d: etiketten ligger inde i rektanglet, over linjen (væk fra nederste venstre hjørne).
    const text = `${displayName(fig, "d")} = ${FMT.len(values.d)}`;
    const sl = sideLabel({ x: 0, y: 0 }, { x: l, y: b }, { x: 0, y: b }, text, measure);
    out.push({ key: "sided", text, c: sl.c, hw: sl.hw, hh: sl.hh, fill: INK, data: { "data-ol-param": "d" } });
  }
  const others = rectangleSpec.params.filter((p) => p.key !== "d");
  out.push(...derivedLabels(fig, others, values, rectangleSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Rektanglet, og den stiplede diagonal når d er synlig. */
function drawing(fig: Fig): ReactNode {
  const { l, b } = fig.shape;
  const out: ReactNode[] = [
    <polygon
      key="body"
      points={polyPoints(outline(fig.shape))}
      fill="none"
      stroke={INK}
      strokeWidth={0.5}
      strokeLinejoin="round"
    />,
  ];
  if (fig.params.d?.visible) {
    out.push(
      <path key="diag" d={`M 0 0 L ${r2(l)} ${r2(b)}`} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.5 1" />,
    );
  }
  return out;
}

export const rectangle: FigureDef<"rectangle", RectangleShape> = {
  ...rectangleSpec,
  ...makeSolver(rectangleSpec),
  type: "rectangle",
  name: "Rektangel",
  group: "firkanter",
  handleName: () => "Hjørne for l og b",
  icon: () => <rect x="3" y="6" width="18" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
  newShape: () => rectangleSpec.defaultShape(),
  labels,
  drawing,
};
