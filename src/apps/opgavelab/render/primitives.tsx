// Opgavelab — fælles tegne-byggesten til arket og figurfilerne (figures/*).
// Ingen "use client" og ingen runtime-imports fra registry'et, så figurfilerne kan
// importeres overalt (også af validering på serveren) uden cyklusser.

import { PT_MM } from "../model/types";
import type { Point } from "../model/types";
import type { Measure } from "./textLayout";

export const INK = "#16212e";
export const BRAND = "#1a4f8b";
/** Etiketternes skriftstørrelse i mm (ca. 12 pt). */
export const LABEL_MM = 4.2;
/** Opgavenummerets skriftstørrelse i mm. */
export const NUMBER_MM = 5;
/** mm luft mellem etiket og linje. */
export const LABEL_GAP = 1;
/** Halv højde af en tekstlinje (versaler/cifre) i forhold til skriftstørrelsen; placering. */
export const HALF_H = 0.37;
/**
 * Tekstens lodrette udstrækning i forhold til skriftstørrelsen, til udstrækning (margen og
 * markering) — ikke til placering. DejaVu Sans' linjeboks er 0,93 over og 0,24 under
 * grundlinjen (hhea 1901/2048 og 483/2048) og dækker alle glyffer inkl. Å, g/p og komma.
 * Browseren afrunder linjeboksen til hele skærmpixel (getBBox målt op til 0,96/0,27 ved
 * små zoomniveauer), så der lægges lidt luft på.
 */
export const FONT_ASCENT = 1;
export const FONT_DESCENT = 0.3;

export const r2 = (v: number) => Math.round(v * 100) / 100;
export const unit = (p: Point): Point => {
  const l = Math.hypot(p.x, p.y) || 1;
  return { x: p.x / l, y: p.y / l };
};
export const add = (p: Point, q: Point, k = 1): Point => ({ x: p.x + q.x * k, y: p.y + q.y * k });
export const sub = (p: Point, q: Point): Point => ({ x: p.x - q.x, y: p.y - q.y });

type Anchor = "start" | "middle" | "end";

type TextProps = {
  x: number;
  y: number;
  size: number;
  anchor?: Anchor;
  bold?: boolean;
  fill?: string;
  children: string;
} & Record<`data-${string}`, string | undefined>;

/** Ét <text> med eksplicit x/y og direkte stilattributter (svg2pdf-venligt). */
export function T({ x, y, size, anchor = "start", bold, fill = INK, children, ...data }: TextProps) {
  return (
    <text
      x={r2(x)}
      y={r2(y)}
      fontSize={r2(size)}
      textAnchor={anchor}
      fontWeight={bold ? 700 : 400}
      fill={fill}
      {...data}
    >
      {children}
    </text>
  );
}

/** Placeringsboks for en etiket (halve mål i mm). */
export function labelBox(text: string, measure: Measure, bold = false): { hw: number; hh: number } {
  return { hw: measure(text, LABEL_MM / PT_MM, bold) / 2 + 0.3, hh: LABEL_MM * HALF_H + 0.2 };
}

/** Etikettens grundlinje, når boksens centrum er cy. */
export const labelBaseline = (cy: number) => cy + LABEL_MM * HALF_H;

/** Centrum for en boks, der ligger på n-siden af p med `gap` mm luft (n er en enhedsvektor). */
export function besides(p: Point, n: Point, gap: number, hw: number, hh: number): Point {
  return add(p, n, gap + Math.abs(n.x) * hw + Math.abs(n.y) * hh);
}
