// Opgavelab — figuren "Parallelogram": geometri og regler fra core/parallelogram.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { compute, corners, heightFootX, outline, parallelogramSpec } from "../core/parallelogram";
import { makeSolver } from "../core/solveKit";
import { displayName } from "../model/params";
import type { FigureObjectOf, ParallelogramShape, Point } from "../model/types";
import { INK, LABEL_GAP, add, labelBox, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import {
  DERIVED_CLEARANCE,
  HIDDEN_EDGE,
  derivedLabels,
  freeSpot,
  separateLabels,
  insideConvex,
  lineBox,
  paramShow,
  placeHeightLabel,
  polyPoints,
  rightAngleMark,
  sideLabel,
} from "./shared";
import { arcPath, arcRadius } from "./triangleLabels";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"parallelogram", ParallelogramShape>;

/** Retvinkelmærkets størrelse ved højdens fodpunkt (mm). */
const MARK_MM = 3;
/** Under så mange mm fra venstre kant er højden den skrå side selv (v ≈ 90°): ingen stiplet linje. */
const FLUSH_MM = 0.5;
/** Vinkelbuens radius (mm). */
const ARC_MM = 5;

/** Den stiplede højde: fra det øverste venstre hjørne lodret ned til linjen gennem g. */
function height(shape: ParallelogramShape) {
  const c = corners(shape);
  const x = heightFootX(shape);
  const foot: Point = { x, y: 0 };
  const flush = x < FLUSH_MM;
  /** Fodpunktet ligger uden for g: grundlinjen forlænges stiplet fra nederste højre hjørne. */
  const extension = x > shape.g + 1e-6;
  // Retvinkelmærket vender mod den længste del af grundlinjen (ved forlængelse: mod g).
  const dirX = extension ? -1 : shape.g - x >= x ? 1 : -1;
  return { c, foot, top: c.tl, flush, extension, toward: { x: dirX, y: 0 } as Point };
}

/** Etiketter: g under, b ved den højre skrå side, v ved vinkelbuen, h ved den stiplede højde (kun når synlig). */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const shape = fig.shape;
  const values = compute(shape);
  const show = paramShow(fig, mode, values, solved);
  const ht = height(shape);
  const { c } = ht;
  const poly = outline(shape);
  const centre: Point = { x: (c.bl.x + c.tr.x) / 2, y: (c.bl.y + c.tr.y) / 2 };
  const out: Label[] = [];
  const side = (key: string, p: Point, q: Point) => {
    const name = displayName(fig, key);
    const text = show.shown(key) ? `${name} = ${FMT.len(show.value(key))}` : name;
    const sl = sideLabel(p, q, centre, text, measure);
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
  side("g", c.bl, c.br);
  side("b", c.br, c.tr);

  // Vinkel v: inde i vinklen ved nederste venstre hjørne, når der er plads (og højden ikke er i vejen),
  // ellers til venstre for hjørnet.
  const hVisible = fig.params.h?.visible === true;
  const vName = displayName(fig, "v");
  const vText = show.shown("v") ? `${vName} = ${FMT.ang(show.value("v"))}` : vName;
  const vb = labelBox(vText, measure);
  const half = (shape.v * Math.PI) / 360;
  const bis = { x: Math.cos(half), y: -Math.sin(half) };
  const along = Math.abs(bis.x) * vb.hw + Math.abs(bis.y) * vb.hh;
  const across = Math.abs(bis.y) * vb.hw + Math.abs(bis.x) * vb.hh;
  const dSides = along + (LABEL_GAP + across * Math.cos(half)) / Math.max(Math.sin(half), 0.02);
  const dInner = along + arcRadius(c.bl, c.br, c.tl, ARC_MM) + 0.6;
  const want = Math.max(dSides, dInner);
  const inside = add(c.bl, bis, want);
  const clearOfHeight = !hVisible || ht.flush || inside.x + vb.hw + LABEL_GAP <= ht.foot.x;
  const fits =
    want <= 0.6 * Math.min(shape.g, shape.b) && clearOfHeight && insideConvex(inside, vb.hw, vb.hh, poly, 0.4);
  out.push({
    key: "angv",
    text: vText,
    c: fits ? inside : { x: -vb.hw - 1.6, y: -vb.hh + 0.6 },
    hw: vb.hw,
    hh: vb.hh,
    fill: show.color("v"),
    data: { "data-ol-param": "v" },
  });

  let hPlaced = !hVisible;
  if (hVisible) {
    const text = `${displayName(fig, "h")} = ${FMT.len(values.h)}`;
    if (ht.flush) {
      // v ≈ 90°: højden er den skrå side selv; etiketten står ved den (til venstre).
      const sl = sideLabel(c.bl, c.tl, centre, text, measure);
      const label: Label = { key: "sideh", text, c: sl.c, hw: sl.hw, hh: sl.hh, fill: INK, data: { "data-ol-param": "h" }, dir: sl.dir, n: sl.n };
      freeSpot(label, out);
      out.push(label);
      hPlaced = true;
    } else {
      const markC = add(add(ht.foot, ht.toward, MARK_MM / 2), { x: 0, y: -1 }, MARK_MM / 2);
      const label = placeHeightLabel({
        foot: ht.foot,
        top: ht.top,
        poly,
        text,
        measure,
        others: out,
        mark: { c: markC, hw: MARK_MM / 2, hh: MARK_MM / 2 },
      });
      if (label) {
        out.push(label);
        hPlaced = true;
      }
    }
  }
  // Små figurer og lange navne: ingen etiketter oven i hinanden.
  const lines: ReturnType<typeof lineBox>[] = [];
  if (hVisible && !ht.flush) {
    lines.push(lineBox(ht.top, ht.foot));
    if (ht.extension) lines.push(lineBox(c.br, ht.foot));
  }
  separateLabels(out, lines);
  // Afledte mål (O, A og evt. h): kun når de er synlige, i mål-boksen under figuren.
  const derived = parallelogramSpec.params.filter((p) => !(p.key === "h" && hPlaced));
  out.push(...derivedLabels(fig, derived, values, parallelogramSpec.bounds(shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Parallelogrammet med vinkelbue ved v, og den stiplede højde (med retvinkelmærke), når h er synlig. */
function drawing(fig: Fig): ReactNode {
  const shape = fig.shape;
  const c = corners(shape);
  const out: ReactNode[] = [
    <polygon key="body" points={polyPoints(outline(shape))} fill="none" stroke={INK} strokeWidth={0.5} strokeLinejoin="round" />,
    <path key="arcV" d={arcPath(c.bl, c.br, c.tl, ARC_MM)} fill="none" stroke={INK} strokeWidth={0.3} />,
  ];
  if (fig.params.h?.visible) {
    const ht = height(shape);
    if (!ht.flush) {
      const dash = { strokeDasharray: HIDDEN_EDGE.strokeDasharray, strokeWidth: 0.3 };
      out.push(
        <path
          key="height"
          data-ol-role="height"
          d={`M ${r2(ht.top.x)} ${r2(ht.top.y)} L ${r2(ht.foot.x)} ${r2(ht.foot.y)}`}
          fill="none"
          stroke={INK}
          {...dash}
        />,
      );
      if (ht.extension) {
        out.push(
          <path
            key="baseExt"
            data-ol-role="base-extension"
            d={`M ${r2(c.br.x)} ${r2(c.br.y)} L ${r2(ht.foot.x)} ${r2(ht.foot.y)}`}
            fill="none"
            stroke={INK}
            {...dash}
          />,
        );
      }
      out.push(
        <path
          key="heightMark"
          data-ol-role="right-angle"
          d={rightAngleMark(ht.foot, add(ht.foot, { x: 0, y: -1 }, 10), add(ht.foot, ht.toward, 10), MARK_MM)}
          fill="none"
          stroke={INK}
          strokeWidth={0.3}
        />,
      );
    }
  }
  return out;
}

export const parallelogram: FigureDef<"parallelogram", ParallelogramShape> = {
  ...parallelogramSpec,
  ...makeSolver(parallelogramSpec),
  type: "parallelogram",
  name: "Parallelogram",
  group: "firkanter",
  handleName: (key, name) => (key === "b" ? `Håndtag for ${name} og vinklen` : `Håndtag for ${name}`),
  icon: () => <path d="M7 6h14l-4 12H3L7 6Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
  newShape: () => parallelogramSpec.defaultShape(),
  labels,
  drawing,
};
