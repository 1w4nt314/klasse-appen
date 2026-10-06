// Opgavelab — figuren "Retvinklet trekant": geometri og regler fra core/rightTriangle.ts
// (Node-testbar), Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { compute, rightTriangleSpec, vertices } from "../core/rightTriangle";
import { makeSolver } from "../core/solveKit";
import { visibleParams } from "../model/params";
import type { FigureObjectOf, RightTriangleShape } from "../model/types";
import { BRAND, INK, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { derivedLabels, rightAngleMark } from "./shared";
import { arcPath, arcRadius, triangleLabels } from "./triangleLabels";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"rightTriangle", RightTriangleShape>;

/** Ny trekant: 8 × 6 cm (c = 10 cm), så vinkelværdierne får plads inde i figuren. */
const NEW_MM = { a: 80, b: 60 } as const;

/** Siderne: a = BC (modstående A), b = AC (modstående B), c = AB (modstående C). */
const SIDES = [
  { key: "a", p: "B", q: "C", opp: "A" },
  { key: "b", p: "A", q: "C", opp: "B" },
  { key: "c", p: "A", q: "B", opp: "C" },
] as const;

/**
 * Etiketterne (fælles trekantlogik i figures/triangleLabels.tsx). Svararket: `solved` giver facit
 * for skjulte parametre med et regnestykke, og etiketten viser facit i stedet for figurens egen
 * værdi, så figur og udregning stemmer. Geometrien bruger altid figurens egne værdier.
 * Retvinkelkvadratet ved C (kun når C er synlig) fylder 3·√2 mm fra hjørnet.
 */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const shape = fig.shape;
  const v = vertices(shape);
  const values = compute(shape);
  const out = triangleLabels({
    fig,
    mode,
    measure,
    solved,
    v,
    values,
    sides: SIDES,
    markRadius: (k, shown, p, q) => (k === "C" ? (shown ? 3 * Math.SQRT2 : 0) : arcRadius(v[k], p, q, 5)),
  });
  // Afledte mål (T, O): kun når de er synlige, i mål-boksen under figuren.
  out.push(...derivedLabels(fig, rightTriangleSpec.params, values, rightTriangleSpec.bounds(shape), measure, out));
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
    out.push(
      <path
        key="square"
        data-ol-role="right-angle"
        d={rightAngleMark(v.C, v.B, v.A)}
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
  group: "trekanter",
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
