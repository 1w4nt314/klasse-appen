"use client";

// Opgavelab — A4-arket som ren SVG (1 enhed = 1 mm). Samme komponent bruges på
// skærmen og i PDF-eksporten (svg2pdf), så reglerne her er bevidst stramme:
//  - ét <text> pr. tekstrun med eksplicit x/y, ingen <tspan>
//  - ingen <style>, klasser eller filtre — alle stilattributter står direkte
//  - editor-overlay (markering, håndtag) kommer KUN som `children`
// Figurerne tegnes generisk: streger og etiketter kommer fra figurens FigureDef (defOf).

import { memo, useMemo, type ReactNode, type Ref, type SVGProps } from "react";
import { defOf } from "../figures/registry";
import type { SheetMode } from "../figures/types";
import { docSolvedValues } from "../model/figures";
import { PAGE } from "../model/types";
import type { CalcObject, Document as SheetDoc, DrillObject, FigureObject, FormulaObject, TextObject } from "../model/types";
import { DRILL_BLANK, layoutDrill, layoutFormula, numberSheet } from "./drillLayout";
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
type BlockViewProps<O> = { obj: O; mode: SheetMode; number: string; measure: Measure };

const DrillView = memo(function DrillView({ obj, mode, number, measure }: BlockViewProps<DrillObject>) {
  const l = layoutDrill(obj, number, measure);
  return (
    <g data-ol-id={obj.id} data-ol-type="drill">
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
});

// ---- formelblok ----

/**
 * Tre runs pr. linje som regnearket: nummer (fed), stykket ("3 · (4 + 5) =") og svarstregen — på
 * svararket facit i BRAND ("27"; afrundet: "2 · π ≈ 6,28"; kan ikke regnes ud: "= ?").
 */
const FormulaView = memo(function FormulaView({ obj, mode, number, measure }: BlockViewProps<FormulaObject>) {
  const l = layoutFormula(obj, number, measure);
  return (
    <g data-ol-id={obj.id} data-ol-type="formula">
      {l.title && (
        <T x={l.title.x} y={l.title.baseline} size={l.sizeMm} bold data-ol-role="title">
          {l.title.text}
        </T>
      )}
      {l.items.map((it) => (
        <g key={it.label} data-ol-item={it.label} data-ol-error={it.error ? "" : undefined}>
          <T x={it.xLabel} y={it.baseline} size={l.sizeMm} bold data-ol-role="number">
            {it.label}
          </T>
          <T x={it.xText} y={it.baseline} size={l.sizeMm} data-ol-role="body">
            {mode === "svarark" ? it.textSvar : it.text}
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
});

// ---- figur ----

/** Ingen løste værdier (opgavearket): én fast instans, så FigureView ikke tegnes om uden grund. */
const NO_SOLVED: Record<string, number> = {};

/**
 * Én figur. memo: et træk ændrer kun den trukne figur (de andre objekter beholder identiteten i
 * dokumentet), så de andre figurers etiketter løses og måles ikke igen ved hvert træk-trin.
 */
const FigureView = memo(function FigureView({
  fig,
  mode,
  number,
  measure,
  solved,
}: {
  fig: FigureObject;
  mode: SheetMode;
  number: string;
  measure: Measure;
  solved: Record<string, number>;
}) {
  const def = defOf(fig);
  const nb = number ? numberBox(fig, number, measure) : null;
  const labels = def.labels(fig, mode, measure, solved);
  return (
    <g
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
});

// ---- arket ----

/** Sidefoden "Side n af N": midt i bundmargenen, under objektgrænsen (PAGE.h − margen = 287). */
const FOOTER_Y = 291;
const FOOTER_PT = 9;
const FOOTER_FILL = "#566372";

export function SheetSvg({
  doc,
  mode,
  page = 0,
  numbering,
  measure = measureText,
  children,
  svgRef,
  svgProps,
}: {
  doc: SheetDoc;
  mode: SheetMode;
  /** Siden (0-baseret), der tegnes: kun dens objekter (+ sidefoden, når dokumentet har flere sider). */
  page?: number;
  /** Objekt-id → nummer; udledes af dokumentet hvis udeladt. */
  numbering?: ReadonlyMap<string, string>;
  measure?: Measure;
  /** Editor-overlay. Sendes KUN med fra editoren. */
  children?: ReactNode;
  svgRef?: Ref<SVGSVGElement>;
  svgProps?: Omit<SVGProps<SVGSVGElement>, "ref" | "viewBox" | "children">;
}) {
  const nums = useMemo(() => numbering ?? numberSheet(doc, measure), [numbering, doc, measure]);
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
        if (o.page !== page) return null;
        if (o.type === "text") return renderText(o, measure);
        if (o.type === "figure")
          return (
            <FigureView
              key={o.id}
              fig={o}
              mode={mode}
              number={nums.get(o.id) ?? ""}
              measure={measure}
              solved={mode === "svarark" ? docSolvedValues(doc, o) : NO_SOLVED}
            />
          );
        if (o.type === "drill") return <DrillView key={o.id} obj={o} mode={mode} number={nums.get(o.id) ?? ""} measure={measure} />;
        if (o.type === "formula") return <FormulaView key={o.id} obj={o} mode={mode} number={nums.get(o.id) ?? ""} measure={measure} />;
        return renderCalc(doc, o, mode, nums.get(o.id) ?? "", measure);
      })}
      {doc.pageCount > 1 && (
        <T x={PAGE.w / 2} y={FOOTER_Y} size={FOOTER_PT * PT_MM} anchor="middle" fill={FOOTER_FILL} data-ol-role="pagefooter">
          {`Side ${page + 1} af ${doc.pageCount}`}
        </T>
      )}
      {children}
    </svg>
  );
}
