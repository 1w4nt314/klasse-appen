// Opgavelab — figuren "Terning" i kavalerperspektiv: geometri og regler fra core/cube.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning (som kassen, figures/shared.tsx: cuboid), etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, cubeSpec } from "../core/cube";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { CubeShape, FigureObjectOf } from "../model/types";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, cuboid, cuboidDrawing, derivedLabels, paramShow, sideLabel } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"cube", CubeShape>;

/** Etiketter: kun s under forkanten; V og O i mål-boksen under figuren, når de er synlige. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { s } = fig.shape;
  const { corners: c } = cuboid(s, s, s);
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const name = displayName(fig, "s");
  const text = show.shown("s") ? `${name} = ${FMT.len(show.value("s"))}` : name;
  const sl = sideLabel(c.fbl, c.fbr, { x: s / 2, y: -s / 2 }, text, measure);
  const out: Label[] = [
    { key: "sides", text, c: sl.c, hw: sl.hw, hh: sl.hh, fill: show.color("s"), data: { "data-ol-param": "s" }, dir: sl.dir, n: sl.n },
  ];
  out.push(...derivedLabels(fig, cubeSpec.params, values, cubeSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

function drawing(fig: Fig): ReactNode {
  const { s } = fig.shape;
  return cuboidDrawing(s, s, s);
}

export const cube: FigureDef<"cube", CubeShape> = {
  ...cubeSpec,
  ...makeSolver(cubeSpec),
  type: "cube",
  name: "Terning",
  group: "rumfigurer",
  handleName: (_key, name) => `Håndtag for ${name}`,
  icon: () => (
    <>
      <path d="M3 9h11v11H3ZM3 9l5-5h11l-5 5M19 4v11l-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <path d="M8 4v11h11M8 15l-5 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="2 1.5" />
    </>
  ),
  newShape: () => cubeSpec.defaultShape(),
  labels,
  drawing,
};
