"use client";

// Opgavelab — A4-arket som ren SVG (1 enhed = 1 mm). Samme komponent bruges på
// skærmen og i PDF-eksporten (svg2pdf), så reglerne her er bevidst stramme:
//  - ét <text> pr. tekstrun med eksplicit x/y, ingen <tspan>
//  - ingen <style>, klasser eller filtre — alle stilattributter står direkte
//  - editor-overlay (markering, håndtag) kommer KUN som `children`
// Figurerne tegnes generisk: streger og etiketter kommer fra figurens FigureDef (defOf).

import { useMemo, type ReactNode, type Ref, type SVGProps } from "react";
import { numberDocument } from "../core/numbering";
import { defOf } from "../figures/registry";
import type { SheetMode } from "../figures/types";
import { docSolvedValues, figureBoundsOnSheet } from "../model/figures";
import { PAGE } from "../model/types";
import type { CalcObject, Document as SheetDoc, DrillObject, FigureObject, TextObject } from "../model/types";
import { DRILL_BLANK, layoutDrill } from "./drillLayout";
import { numberBox } from "./figureLayout";
import { FONT_FAMILY, measureText } from "./measure";
import { BRAND, LABEL_MM, NUMBER_MM, T, labelBaseline, r2 } from "./primitives";
import {
  CALC_GAP,
  PT_MM,
  calcContent,
  layoutText,
  type Measure,
} from "./textLayout";

export type { SheetMode } from "../figures/types";
export { figureExtent } from "./figureLayout";

// ---- tekst ----

function renderText(obj: TextObject, measure: Measure) {
  const l = layoutText(obj, measure);
  return (
    <g key={obj.id} data-ol-id={obj.id} data-ol-type="text">
      {l.lines.map((line, i) =>
        line ? (
          <T key={i} x={obj.x} y={obj.y + l.ascent + i * l.lineH} size={l.sizeMm}>
            {line}
          </T>
        ) : null,
      )}
    </g>
  );
}

// ---- regnestykke ----

function renderCalc(doc: SheetDoc, obj: CalcObject, mode: SheetMode, number: string, measure: Measure) {
  const c = calcContent(doc, obj, mode, number, measure);
  const baseline = obj.y + c.sizeMm * 0.95;
  const numW = number ? measure(number, c.sizeMm / PT_MM, true) + CALC_GAP : 0;
  return (
    <g key={obj.id} data-ol-id={obj.id} data-ol-type="calc">
      {number && (
        <T x={obj.x} y={baseline} size={c.sizeMm} bold data-ol-role="number">
          {number}
        </T>
      )}
      <T x={obj.x + numW} y={baseline} size={c.sizeMm} data-ol-role="body">
        {c.body}
      </T>
    </g>
  );
}

// ---- regneark ----

/**
 * Tre runs pr. opgave: nummer (fed), stykket (højrestillet, så "=" står under hinanden) og
 * svarstregen — på svararket svaret i BRAND i stedet for stregen.
 */
function renderDrill(obj: DrillObject, mode: SheetMode, number: string, measure: Measure) {
  const l = layoutDrill(obj, number, measure);
  return (
    <g key={obj.id} data-ol-id={obj.id} data-ol-type="drill">
      {l.title && (
        <T x={l.title.x} y={l.title.baseline} size={l.sizeMm} bold data-ol-role="title">
          {l.title.text}
        </T>
      )}
      {l.items.map((it) => (
        <g key={it.label} data-ol-item={it.label}>
          <T x={it.xLabel} y={it.baseline} size={l.sizeMm} bold data-ol-role="number">
            {it.label}
          </T>
          <T x={it.xTextEnd} y={it.baseline} size={l.sizeMm} anchor="end" data-ol-role="body">
            {it.text}
          </T>
          {mode === "svarark" ? (
            <T x={it.xAnswer} y={it.baseline} size={l.sizeMm} fill={BRAND} data-ol-role="answer">
              {it.answer}
            </T>
          ) : (
            <T x={it.xAnswer} y={it.baseline} size={l.sizeMm} data-ol-role="blank">
              {DRILL_BLANK}
            </T>
          )}
        </g>
      ))}
    </g>
  );
}

// ---- figur ----

function renderFigure(doc: SheetDoc, fig: FigureObject, mode: SheetMode, number: string, measure: Measure) {
  const def = defOf(fig);
  const nb = number ? numberBox(fig, number, measure) : null;
  const labels = def.labels(fig, mode, measure, mode === "svarark" ? docSolvedValues(doc, fig) : {});
  return (
    <g
      key={fig.id}
      transform={`translate(${r2(fig.x)} ${r2(fig.y)})`}
      data-ol-id={fig.id}
      data-ol-type="figure"
    >
      {def.drawing(fig, mode)}
      {labels.map((l) => (
        <T
          key={l.key}
          x={l.c.x}
          y={labelBaseline(l.c.y)}
          size={LABEL_MM}
          anchor="middle"
          bold={l.bold}
          fill={l.fill}
          {...l.data}
        >
          {l.text}
        </T>
      ))}
      {nb && (
        <T x={nb.x} y={nb.baseline} size={NUMBER_MM} bold data-ol-role="number">
          {number}
        </T>
      )}
    </g>
  );
}

// ---- arket ----

export function SheetSvg({
  doc,
  mode,
  numbering,
  measure = measureText,
  children,
  svgRef,
  svgProps,
}: {
  doc: SheetDoc;
  mode: SheetMode;
  /** Objekt-id → nummer; udledes af dokumentet hvis udeladt. */
  numbering?: ReadonlyMap<string, string>;
  measure?: Measure;
  /** Editor-overlay. Sendes KUN med fra editoren. */
  children?: ReactNode;
  svgRef?: Ref<SVGSVGElement>;
  svgProps?: Omit<SVGProps<SVGSVGElement>, "ref" | "viewBox" | "children">;
}) {
  const nums = useMemo(() => numbering ?? numberDocument(doc, figureBoundsOnSheet), [numbering, doc]);
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${PAGE.w} ${PAGE.h}`}
      fontFamily={FONT_FAMILY}
      data-ol-sheet={mode}
      {...svgProps}
    >
      <rect x={0} y={0} width={PAGE.w} height={PAGE.h} fill="#ffffff" />
      {doc.objects.map((o) => {
        if (o.type === "text") return renderText(o, measure);
        if (o.type === "figure") return renderFigure(doc, o, mode, nums.get(o.id) ?? "", measure);
        if (o.type === "drill") return renderDrill(o, mode, nums.get(o.id) ?? "", measure);
        return renderCalc(doc, o, mode, nums.get(o.id) ?? "", measure);
      })}
      {children}
    </svg>
  );
}
