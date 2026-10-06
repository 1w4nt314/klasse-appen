// Opgavelab — figuren "Kasse" i kavalerperspektiv: geometri og regler fra core/box.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning (figures/shared.tsx: cuboid/project), etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { boxSpec, compute } from "../core/box";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { BoxShape, FigureObjectOf, Point } from "../model/types";
import type { Measure } from "../render/textLayout";
import { DERIVED_CLEARANCE, cuboid, cuboidDrawing, derivedLabels, paramShow, separateLabels, sideLabel } from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"box", BoxShape>;

/** Etiketter: l under forkanten, h til venstre for forsiden, b ved den højre nederste dybdekant; V og O under. */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const { l, b, h } = fig.shape;
  const { corners: c } = cuboid(l, b, h);
  const values = compute(fig.shape);
  const show = paramShow(fig, mode, values, solved);
  const front: Point = { x: l / 2, y: -h / 2 };
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
  side("l", c.fbl, c.fbr, front);
  side("h", c.fbl, c.ftl, front);
  // b ved den skrå kant fra det forreste til det bagerste nederste højre hjørne (ned og til højre for den).
  side("b", c.fbr, c.kbr, front);
  separateLabels(out);
  out.push(...derivedLabels(fig, boxSpec.params, values, boxSpec.bounds(fig.shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

function drawing(fig: Fig): ReactNode {
  const { l, b, h } = fig.shape;
  return cuboidDrawing(l, b, h);
}

export const box: FigureDef<"box", BoxShape> = {
  ...boxSpec,
  ...makeSolver(boxSpec),
  type: "box",
  name: "Kasse",
  group: "rumfigurer",
  handleName: (_key, name) => `Håndtag for ${name}`,
  icon: () => (
    <>
      <path d="M3 9h12v11H3ZM3 9l5-5h12l-5 5M20 4v11l-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <path d="M8 4v11h12M8 15l-5 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeDasharray="2 1.5" />
    </>
  ),
  newShape: () => boxSpec.defaultShape(),
  labels,
  drawing,
};
