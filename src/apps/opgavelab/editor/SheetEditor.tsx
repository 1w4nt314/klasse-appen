"use client";

// Opgavelab — midterfeltet: arket skaleret til at passe, markering, håndtag og
// flyt af objekter med pointer events. Overlayet sendes som `children` til
// SheetSvg og findes derfor aldrig i eksport-træet.

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { numberDocument } from "../core/numbering";
import { figureBoundsOnSheet, getFigureDef } from "../model/figures";
import { PAGE } from "../model/types";
import type { Bounds, Document as SheetDoc, FigureObject, SheetObject } from "../model/types";
import { SheetSvg } from "../render/SheetSvg";
import { objectBox, type Measure } from "../render/textLayout";
import { toSvg } from "./pointer";

const BRAND = "#1a4f8b";
/** Plads til tal og sidetekster uden for figurens bounding box (mm). */
const FIGURE_PAD = { l: 12, t: 8, r: 12, b: 6 };
const DRAG_THRESHOLD_MM = 1;

type Drag = {
  pointerId: number;
  id: string;
  start: { x: number; y: number };
  origin: { x: number; y: number };
  box: Bounds;
  pad: { l: number; t: number; r: number; b: number };
  active: boolean;
};

function padFor(o: SheetObject) {
  return o.type === "figure" ? FIGURE_PAD : { l: 0, t: 0, r: 0, b: 0 };
}

function clampRange(v: number, lo: number, hi: number): number {
  return hi < lo ? lo : Math.min(Math.max(v, lo), hi);
}

export function SheetEditor({
  doc,
  selectedId,
  measure,
  onSelect,
  onMove,
  onCommit,
}: {
  doc: SheetDoc;
  selectedId: string | null;
  measure: Measure;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onCommit: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);

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

  function endDrag(e: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    onCommit();
  }

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const svg = svgRef.current;
    if (!svg || drag.current) return;
    const target = e.target as Element;
    // Håndtag får funktion i punkt 4; indtil videre gør de ingenting.
    if (target.closest("[data-ol-handle]")) return;
    const hit = target.closest("[data-ol-hit]");
    const id = hit?.getAttribute("data-ol-hit") ?? null;
    onSelect(id);
    if (!id) return;
    const obj = doc.objects.find((o) => o.id === id);
    const pt = toSvg(svg, e);
    if (!obj || !pt) return;
    svg.setPointerCapture(e.pointerId);
    drag.current = {
      pointerId: e.pointerId,
      id,
      start: pt,
      origin: { x: obj.x, y: obj.y },
      box: objectBox(obj, doc, numbering, measure),
      pad: padFor(obj),
      active: false,
    };
    setDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg || d.pointerId !== e.pointerId) return;
    const pt = toSvg(svg, e);
    if (!pt) return;
    let dx = pt.x - d.start.x;
    let dy = pt.y - d.start.y;
    if (!d.active) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_MM) return;
      d.active = true;
    }
    const m = PAGE.margin;
    dx = clampRange(dx, m + d.pad.l - d.box.minX, PAGE.w - m - d.pad.r - d.box.maxX);
    dy = clampRange(dy, m + d.pad.t - d.box.minY, PAGE.h - m - d.pad.b - d.box.maxY);
    onMove(d.id, Math.round((d.origin.x + dx) * 100) / 100, Math.round((d.origin.y + dy) * 100) / 100);
  }

  return (
    <div className="ol-stage" ref={stageRef} data-dragging={dragging || undefined}>
      {size && sheetW > 0 && (
        <div className="ol-sheet" style={{ width: sheetW, height: sheetH }}>
          <SheetSvg
            doc={doc}
            mode="opgave"
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
            <Overlay doc={doc} selected={selected} numbering={numbering} measure={measure} />
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
  selected,
  numbering,
  measure,
}: {
  doc: SheetDoc;
  selected: SheetObject | null;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
}) {
  return (
    <g data-ol-overlay="">
      {doc.objects.map((o) => {
        if (o.type === "figure") return <FigureHit key={o.id} fig={o} />;
        const b = objectBox(o, doc, numbering, measure);
        return (
          <rect
            key={o.id}
            x={b.minX - 1}
            y={b.minY - 1}
            width={b.maxX - b.minX + 2}
            height={b.maxY - b.minY + 2}
            {...hitProps(o.id)}
          />
        );
      })}
      {selected && <Selection obj={selected} doc={doc} numbering={numbering} measure={measure} />}
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
}: {
  obj: SheetObject;
  doc: SheetDoc;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
}) {
  const b = objectBox(obj, doc, numbering, measure);
  const pad = obj.type === "figure" ? 3 : 1.5;
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
        Object.entries(verts).map(([k, p]) => (
          <g key={k} transform={`translate(${obj.x + p.x} ${obj.y + p.y})`}>
            <circle r={1.5} fill="#ffffff" stroke={BRAND} strokeWidth={0.5} />
            <circle r={4} fill="transparent" data-ol-handle={k} pointerEvents="all" style={{ cursor: "grab", touchAction: "none" }} />
          </g>
        ))}
    </g>
  );
}
