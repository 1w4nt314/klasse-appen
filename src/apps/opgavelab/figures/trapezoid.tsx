// Opgavelab — figuren "Trapez": geometri og regler fra core/trapezoid.ts (Node-testbar),
// Find-motoren fra core/solveKit.ts + tegning, etiketter, ikon og oprettelse.

import type { ReactNode } from "react";
import { FMT } from "../core/format";
import { makeSolver } from "../core/solveKit";
import { compute, corners, heightX, outline, trapezoidSpec } from "../core/trapezoid";
import { displayName } from "../model/params";
import type { FigureObjectOf, Point, TrapezoidShape } from "../model/types";
import { INK, add, r2 } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import {
  DERIVED_CLEARANCE,
  HIDDEN_EDGE,
  derivedLabels,
  freeSpot,
  lineBox,
  separateLabels,
  paramShow,
  placeHeightLabel,
  polyPoints,
  rightAngleMark,
  sideLabel,
} from "./shared";
import type { FigureDef, Label, SheetMode } from "./types";

type Fig = FigureObjectOf<"trapezoid", TrapezoidShape>;

/** Retvinkelmærkets størrelse ved højdens fodpunkt (mm). */
const MARK_MM = 3;
/** Ligger den lodrette højde inden for så mange mm af et ben, er benet selv højden (retvinklet trapez). */
const FLUSH_MM = 0.5;

/** Den stiplede højde: lodret fra oversiden ned til linjen gennem a. */
function height(shape: TrapezoidShape) {
  const c = corners(shape);
  const { x, onBase } = heightX(shape);
  const foot: Point = { x, y: 0 };
  const top: Point = { x, y: -shape.h };
  // Højden falder sammen med det venstre eller højre ben (så er benet selv højden).
  const leftFlush = Math.abs(x) < FLUSH_MM && Math.abs(x - shape.off) < FLUSH_MM;
  const rightFlush = Math.abs(x - shape.a) < FLUSH_MM && Math.abs(x - (shape.off + shape.b)) < FLUSH_MM;
  const flush: "left" | "right" | null = leftFlush ? "left" : rightFlush ? "right" : null;
  // Retvinkelmærket vender mod den længste del af a; ligger fodpunktet uden for a, mod a.
  const dirX = onBase ? (flush === "left" ? 1 : flush === "right" ? -1 : shape.a - x >= x ? 1 : -1) : x < 0 ? 1 : -1;
  return { c, foot, top, onBase, flush, toward: { x: dirX, y: 0 } as Point };
}

/** Etiketter: a under, b over, benene c/d (kun når synlige), h ved den stiplede højde (kun når synlig). */
function labels(fig: Fig, mode: SheetMode, measure: Measure, solved: Record<string, number> = {}): Label[] {
  const shape = fig.shape;
  const values = compute(shape);
  const show = paramShow(fig, mode, values, solved);
  const ht = height(shape);
  const { c } = ht;
  const poly = outline(shape);
  const centre: Point = { x: (c.bl.x + c.br.x + c.tl.x + c.tr.x) / 4, y: (c.bl.y + c.br.y + c.tl.y + c.tr.y) / 4 };
  const out: Label[] = [];
  const side = (key: string, p: Point, q: Point, shownAlways: boolean) => {
    const name = displayName(fig, key);
    const text = shownAlways ? `${name} = ${FMT.len(show.value(key))}` : name;
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
  side("a", c.bl, c.br, show.shown("a"));
  side("b", c.tl, c.tr, show.shown("b"));

  // Benene c og d er afledte: kun når de er synlige, ved benet (som diagonalen d i rektanglet).
  const legs: [string, Point, Point][] = [["c", c.bl, c.tl], ["d", c.br, c.tr]];
  for (const [key, p, q] of legs) {
    if (fig.params[key]?.visible) side(key, p, q, true);
  }

  const hVisible = fig.params.h?.visible === true;
  let hPlaced = !hVisible;
  if (hVisible) {
    const text = `${displayName(fig, "h")} = ${FMT.len(values.h)}`;
    if (ht.flush) {
      const [p, q] = ht.flush === "left" ? [c.bl, c.tl] : [c.br, c.tr];
      const sl = sideLabel(p, q, centre, text, measure);
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
    if (!ht.onBase) lines.push(lineBox(ht.foot.x < 0 ? c.bl : c.br, ht.foot));
  }
  separateLabels(out, lines);
  // h (hvis der ikke var plads ved linjen) og afledte mål O, A: i mål-boksen under figuren.
  const rest = trapezoidSpec.params.filter((p) => p.key !== "c" && p.key !== "d" && !(p.key === "h" && hPlaced));
  const boxed = rest.map((p) => (p.key === "h" ? { ...p, derived: true as const } : p));
  out.push(...derivedLabels(fig, boxed, values, trapezoidSpec.bounds(shape), measure, out, DERIVED_CLEARANCE));
  return out;
}

/** Trapezet, og den stiplede højde (med retvinkelmærke), når h er synlig. */
function drawing(fig: Fig): ReactNode {
  const shape = fig.shape;
  const out: ReactNode[] = [
    <polygon key="body" points={polyPoints(outline(shape))} fill="none" stroke={INK} strokeWidth={0.5} strokeLinejoin="round" />,
  ];
  if (fig.params.h?.visible) {
    const ht = height(shape);
    const dash = { strokeDasharray: HIDDEN_EDGE.strokeDasharray, strokeWidth: 0.3 };
    if (!ht.flush) {
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
      if (!ht.onBase) {
        // Fodpunktet ligger uden for a: grundlinjen forlænges stiplet fra det nærmeste hjørne.
        const from = ht.foot.x < 0 ? ht.c.bl : ht.c.br;
        out.push(
          <path
            key="baseExt"
            data-ol-role="base-extension"
            d={`M ${r2(from.x)} ${r2(from.y)} L ${r2(ht.foot.x)} ${r2(ht.foot.y)}`}
            fill="none"
            stroke={INK}
            {...dash}
          />,
        );
      }
    }
    // Retvinkelmærket sidder ved fodpunktet (også når benet selv er højden).
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
  return out;
}

export const trapezoid: FigureDef<"trapezoid", TrapezoidShape> = {
  ...trapezoidSpec,
  ...makeSolver(trapezoidSpec),
  type: "trapezoid",
  name: "Trapez",
  group: "firkanter",
  handleName: (key, name) => (key === "h" ? `Håndtag for ${name} og forskydningen` : `Håndtag for ${name}`),
  icon: () => <path d="M8 6h8l5 12H3L8 6Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />,
  newShape: () => trapezoidSpec.defaultShape(),
  labels,
  drawing,
};
