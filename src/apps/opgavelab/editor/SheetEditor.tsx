"use client";

// Opgavelab — midterfeltet: arket skaleret til at passe, markering, håndtag,
// flyt af objekter og hjørnetræk med pointer events. Overlayet sendes som
// `children` til SheetSvg og findes derfor aldrig i eksport-træet.

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { numberDocument } from "../core/numbering";
import { calcProblem, dragOpts, figureBoundsOnSheet, getFigureDef } from "../model/figures";
import { PAGE } from "../model/types";
import type { Bounds, Document as SheetDoc, FigureObject, FigureShape, Point, SheetObject } from "../model/types";
import { SheetSvg, figureExtent, type SheetMode } from "../render/SheetSvg";
import { objectBox, type Measure } from "../render/textLayout";
import { toSvg } from "./pointer";

const BRAND = "#1a4f8b";
const WARN = "#b7791f";
const WARN_FILL = "rgba(245, 190, 60, 0.22)";
const DRAG_THRESHOLD_MM = 1;
/** Piletaster flytter det markerede objekt så mange mm (Shift: NUDGE_BIG). */
const NUDGE = 1;
const NUDGE_BIG = 5;

type MoveDrag = {
  kind: "move";
  pointerId: number;
  id: string;
  start: Point;
  origin: Point;
  box: Bounds;
  active: boolean;
};

type VertexDrag = {
  kind: "vertex";
  pointerId: number;
  id: string;
  vertex: string;
  start: Point;
  /** Figurens anker og form ved trækkets start (dragVertex regner altid ud fra dem). */
  anchor: Point;
  shape: FigureShape;
  /** Hjørnets position minus pointerens ved start, så hjørnet ikke springer til pointeren. */
  grab: Point;
  /** Seneste lokale punkt, der gav en figur inden for margenen. */
  lastLocal: Point;
  active: boolean;
};

type Drag = MoveDrag | VertexDrag;

/** Objektets udstrækning på arket; for figurer inkl. etiketter og opgavenummer. */
function boxFor(o: SheetObject, doc: SheetDoc, numbering: ReadonlyMap<string, string>, measure: Measure): Bounds {
  return o.type === "figure" ? figureExtent(o, numbering.get(o.id) ?? "", measure) : objectBox(o, doc, numbering, measure);
}

function clampRange(v: number, lo: number, hi: number): number {
  return hi < lo ? lo : Math.min(Math.max(v, lo), hi);
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Forskydning (dx, dy) begrænset, så boksen bliver inden for arkets margen. */
function clampDelta(box: Bounds, dx: number, dy: number): Point {
  const m = PAGE.margin;
  return {
    x: clampRange(dx, m - box.minX, PAGE.w - m - box.maxX),
    y: clampRange(dy, m - box.minY, PAGE.h - m - box.maxY),
  };
}

/** Ligger boksen inden for arkets margen? */
function fitsSheet(b: Bounds): boolean {
  const m = PAGE.margin;
  const e = 1e-6;
  return b.minX >= m - e && b.minY >= m - e && b.maxX <= PAGE.w - m + e && b.maxY <= PAGE.h - m + e;
}

function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT";
}

export function SheetEditor({
  doc,
  mode,
  selectedId,
  measure,
  onSelect,
  onMove,
  onReshape,
  onCommit,
}: {
  doc: SheetDoc;
  /** "svarark" er en skrivebeskyttet forhåndsvisning (vælg, men ikke flyt). */
  mode: SheetMode;
  selectedId: string | null;
  measure: Measure;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onReshape: (id: string, shape: FigureShape, x: number, y: number) => void;
  onCommit: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const numbering = useMemo(() => numberDocument(doc, figureBoundsOnSheet), [doc]);

  const sheetW = size ? Math.max(0, Math.min(size.w, (size.h * PAGE.w) / PAGE.h)) : 0;
  const sheetH = (sheetW * PAGE.h) / PAGE.w;

  const selected = doc.objects.find((o) => o.id === selectedId) ?? null;

  // Piletaster flytter det markerede objekt (1 mm, Shift = 5 mm); hvert tryk er ét fortryd-trin.
  const latest = useRef({ doc, selected, numbering, measure, onMove, onCommit, mode });
  useEffect(() => {
    latest.current = { doc, selected, numbering, measure, onMove, onCommit, mode };
  });
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const dir: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
      };
      const v = dir[e.key];
      const cur = latest.current;
      const obj = cur.selected;
      if (!v || !obj || drag.current || cur.mode !== "opgave") return;
      e.preventDefault();
      const step = e.shiftKey ? NUDGE_BIG : NUDGE;
      const box = boxFor(obj, cur.doc, cur.numbering, cur.measure);
      const d = clampDelta(box, v.x * step, v.y * step);
      if (d.x === 0 && d.y === 0) return;
      cur.onMove(obj.id, r2(obj.x + d.x), r2(obj.y + d.y));
      cur.onCommit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function endDrag(e: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    setActiveHandle(null);
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    onCommit();
  }

  function startVertexDrag(e: ReactPointerEvent<SVGSVGElement>, svg: SVGSVGElement, vertex: string) {
    if (!selected || selected.type !== "figure") return;
    const def = getFigureDef(selected.figure);
    const pt = toSvg(svg, e);
    const p = def?.vertices(selected.shape)[vertex];
    if (!def || !pt || !p) return;
    svg.setPointerCapture(e.pointerId);
    drag.current = {
      kind: "vertex",
      pointerId: e.pointerId,
      id: selected.id,
      vertex,
      start: pt,
      anchor: { x: selected.x, y: selected.y },
      shape: selected.shape,
      grab: { x: selected.x + p.x - pt.x, y: selected.y + p.y - pt.y },
      lastLocal: { x: p.x, y: p.y },
      active: false,
    };
    setDragging(true);
    setActiveHandle(vertex);
  }

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const svg = svgRef.current;
    if (!svg || drag.current) return;
    const target = e.target as Element;
    const handle = target.closest("[data-ol-handle]")?.getAttribute("data-ol-handle");
    if (handle) {
      startVertexDrag(e, svg, handle);
      return;
    }
    const hit = target.closest("[data-ol-hit]");
    const id = hit?.getAttribute("data-ol-hit") ?? null;
    onSelect(id);
    if (!id || mode !== "opgave") return;
    const obj = doc.objects.find((o) => o.id === id);
    const pt = toSvg(svg, e);
    if (!obj || !pt) return;
    svg.setPointerCapture(e.pointerId);
    drag.current = {
      kind: "move",
      pointerId: e.pointerId,
      id,
      start: pt,
      origin: { x: obj.x, y: obj.y },
      box: boxFor(obj, doc, numbering, measure),
      active: false,
    };
    setDragging(true);
  }

  /** Figuren efter et hjørnetræk til `local` (ankerets koordinater ved start), eller null hvis den ikke kan være på arket. */
  function reshapeAt(d: VertexDrag, fig: FigureObject, local: Point, coarse: boolean): FigureObject | null {
    const def = getFigureDef(fig.figure);
    if (!def) return null;
    const res = def.dragVertex(d.shape, d.vertex, local, dragOpts(doc.settings, coarse));
    const next: FigureObject = {
      ...fig,
      shape: res.shape,
      // Ikke afrundet: ved C-træk skal A og B blive præcis, hvor de var.
      x: d.anchor.x + res.offset.x,
      y: d.anchor.y + res.offset.y,
    };
    return fitsSheet(figureExtent(next, numbering.get(fig.id) ?? "", measure)) ? next : null;
  }

  function moveVertex(d: VertexDrag, pt: Point, coarse: boolean) {
    const fig = doc.objects.find((o): o is FigureObject => o.id === d.id && o.type === "figure");
    if (!fig) return;
    const local = { x: pt.x + d.grab.x - d.anchor.x, y: pt.y + d.grab.y - d.anchor.y };
    let next = reshapeAt(d, fig, local, coarse);
    if (next) {
      d.lastLocal = local;
    } else {
      // Uden for margenen: find det yderste punkt på vejen fra sidste gyldige punkt, der stadig passer.
      let lo = 0;
      let hi = 1;
      const at = (t: number) => ({
        x: d.lastLocal.x + (local.x - d.lastLocal.x) * t,
        y: d.lastLocal.y + (local.y - d.lastLocal.y) * t,
      });
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        if (reshapeAt(d, fig, at(mid), coarse)) lo = mid;
        else hi = mid;
      }
      if (lo === 0) {
        next = reshapeAt(d, fig, d.lastLocal, coarse);
      } else {
        d.lastLocal = at(lo);
        next = reshapeAt(d, fig, d.lastLocal, coarse);
      }
      if (!next) return;
    }
    onReshape(fig.id, next.shape, next.x, next.y);
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg || d.pointerId !== e.pointerId) return;
    const pt = toSvg(svg, e);
    if (!pt) return;
    const dx = pt.x - d.start.x;
    const dy = pt.y - d.start.y;
    if (!d.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_MM) return;
      d.active = true;
    }
    if (d.kind === "vertex") {
      moveVertex(d, pt, e.shiftKey);
      return;
    }
    const c = clampDelta(d.box, dx, dy);
    onMove(d.id, r2(d.origin.x + c.x), r2(d.origin.y + c.y));
  }

  return (
    <div className="ol-stage" ref={stageRef} data-dragging={dragging || undefined} data-ol-mode={mode}>
      {mode === "svarark" && (
        <p className="ol-viewnote" data-ol-viewnote="">
          Svarark (forhåndsvisning) — skjulte størrelser står i blåt
        </p>
      )}
      {size && sheetW > 0 && (
        <div className="ol-sheet" style={{ width: sheetW, height: sheetH }}>
          <SheetSvg
            doc={doc}
            mode={mode}
            numbering={numbering}
            measure={measure}
            svgRef={svgRef}
            svgProps={{
              role: "group",
              "aria-label": "Opgaveark (A4)",
              width: "100%",
              height: "100%",
              style: { touchAction: selectedId ? "none" : "pan-y", display: "block" },
              onPointerDown,
              onPointerMove,
              onPointerUp: endDrag,
              onPointerCancel: endDrag,
              onLostPointerCapture: endDrag,
            }}
          >
            <Overlay
              doc={doc}
              mode={mode}
              selected={selected}
              numbering={numbering}
              measure={measure}
              activeHandle={activeHandle}
            />
          </SheetSvg>
        </div>
      )}
    </div>
  );
}

// ---- overlay ----

function hitProps(id: string) {
  return {
    "data-ol-hit": id,
    fill: "transparent",
    stroke: "transparent",
    pointerEvents: "all" as const,
    style: { cursor: "move", touchAction: "none" as const },
  };
}

function Overlay({
  doc,
  mode,
  selected,
  numbering,
  measure,
  activeHandle,
}: {
  doc: SheetDoc;
  mode: SheetMode;
  selected: SheetObject | null;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  activeHandle: string | null;
}) {
  return (
    <g data-ol-overlay="">
      {doc.objects.map((o) => {
        if (o.type === "figure") return <FigureHit key={o.id} fig={o} />;
        const b = objectBox(o, doc, numbering, measure, mode);
        const fig = o.type === "calc" ? doc.objects.find((f): f is FigureObject => f.type === "figure" && f.id === o.figureId) : null;
        const problem = o.type === "calc" && fig ? calcProblem(fig, o.param, doc.settings) : null;
        return (
          <g key={o.id}>
            {problem && (
              // Kun i editoren: regnestykket kan ikke udregnes ud fra de synlige størrelser.
              <rect
                data-ol-warn={o.id}
                x={b.minX - 1.2}
                y={b.minY - 1.2}
                width={b.maxX - b.minX + 2.4}
                height={b.maxY - b.minY + 2.4}
                rx={1}
                fill={WARN_FILL}
                stroke={WARN}
                strokeWidth={0.4}
                strokeDasharray="1.2 0.8"
                pointerEvents="none"
              />
            )}
            <rect
              x={b.minX - 1}
              y={b.minY - 1}
              width={b.maxX - b.minX + 2}
              height={b.maxY - b.minY + 2}
              {...hitProps(o.id)}
            />
          </g>
        );
      })}
      {selected && mode === "opgave" && (
        <Selection obj={selected} doc={doc} numbering={numbering} measure={measure} activeHandle={activeHandle} />
      )}
    </g>
  );
}

function FigureHit({ fig }: { fig: FigureObject }) {
  const def = getFigureDef(fig.figure);
  if (!def) return null;
  const v = def.vertices(fig.shape);
  const pts = Object.values(v)
    .map((p) => `${fig.x + p.x},${fig.y + p.y}`)
    .join(" ");
  return <polygon points={pts} strokeWidth={5} strokeLinejoin="round" {...hitProps(fig.id)} />;
}

function Selection({
  obj,
  doc,
  numbering,
  measure,
  activeHandle,
}: {
  obj: SheetObject;
  doc: SheetDoc;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  activeHandle: string | null;
}) {
  const b = obj.type === "figure" ? boxFor(obj, doc, numbering, measure) : objectBox(obj, doc, numbering, measure, "opgave");
  const pad = 1.5;
  const def = obj.type === "figure" ? getFigureDef(obj.figure) : null;
  const verts = obj.type === "figure" && def ? def.vertices(obj.shape) : null;
  return (
    <g data-ol-selection={obj.id} pointerEvents="none">
      <rect
        x={b.minX - pad}
        y={b.minY - pad}
        width={b.maxX - b.minX + 2 * pad}
        height={b.maxY - b.minY + 2 * pad}
        fill="none"
        stroke={BRAND}
        strokeWidth={0.35}
        strokeDasharray="2 1.5"
      />
      {verts &&
        Object.entries(verts).map(([k, p]) => {
          const active = activeHandle === k;
          return (
            <g key={k} transform={`translate(${obj.x + p.x} ${obj.y + p.y})`} data-ol-handle-active={active || undefined}>
              {active && <circle r={3.2} fill={BRAND} fillOpacity={0.18} />}
              <circle r={active ? 2 : 1.5} fill={active ? BRAND : "#ffffff"} stroke={BRAND} strokeWidth={0.5} />
              <circle
                r={4}
                fill="transparent"
                data-ol-handle={k}
                pointerEvents="all"
                style={{ cursor: active ? "grabbing" : "grab", touchAction: "none" }}
              />
            </g>
          );
        })}
    </g>
  );
}
