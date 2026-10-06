// Opgavelab — figuren "Kvadrat": geometri og regler fra core/square.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, outline, squareSpec } from "../core/square";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { FigureObjectOf, SquareShape } from "../model/types";
import { INK, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, derivedLabels, paramShow, polyPoints, sideLabel } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"square", SquareShape>;

/** Etiketter: s under, diagonalen d ved midten (kun når d er synlig), afledte mål under. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { s } = fig.shape;
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const out: Label[] = [];
  const name = displayName(fig, "s");
  const text = show.shown("s") ? `${name} = ${FMT.len(show.value("s"))}` : name;
  const sl = sideLabel({ x: 0, y: s }, { x: s, y: s }, { x: s / 2, y: s / 2 }, text, measure);
  out.push({
    key: "sides",
    text,
    c: sl.c,
    hw: sl.hw,
    hh: sl.hh,
    fill: show.color("s"),
    data: { "data-ol-param": "s" },
    dir: sl.dir,
    n: sl.n,
  });
  if (fig.params.d?.visible) {
    // Diagonalen d: etiketten ligger inde i kvadratet, over linjen (væk fra nederste venstre hjørne).
    const dText = `${displayName(fig, "d")} = ${FMT.len(values.d)}`;
    const dl = sideLabel({ x: 0, y: 0 }, { x: s, y: s }, { x: 0, y: s }, dText, measure);
    out.push({ key: "sided", text: dText, c: dl.c, hw: dl.hw, hh: dl.hh, fill: INK, data: { "data-ol-param": "d" } });
  }
  const others = squareSpec.params.filter((p) => p.key !== "d");
  out.push(...derivedLabels(fig, others, values, squareSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Kvadratet, og den stiplede diagonal når d er synlig. */
function drawing(fig: Fig): ReactNode {
  const { s } = fig.shape;
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
      <path key="diag" d={`M 0 0 L ${r2(s)} ${r2(s)}`} fill="none" stroke={INK} strokeWidth={0.3} strokeDasharray="1.5 1" />,
    );
  }
  return out;
}

export const square: FigureDef<"square", SquareShape> = {
  ...squareSpec,
  ...makeSolver(squareSpec),
  type: "square",
  name: "Kvadrat",
  group: "firkanter",
  handleName: () => "Hjørne for s",
  icon: () => <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
  newShape: () => squareSpec.defaultShape(),
  labels,
  drawing,
};
