"use client";

// Opgavelab — midterfeltet: arket skaleret til at passe, markering, håndtag,
// flyt af objekter og hjørnetræk med pointer events. Overlayet sendes som
// `children` til SheetSvg og findes derfor aldrig i eksport-træet.

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { formatByKind } from "../core/format";
import { calcDrift, calcProblem, defOf, displayName, dragOpts } from "../model/figures";
import { LIMITS, PAGE } from "../model/types";
import type { Bounds, DragResult, Document as SheetDoc, FigureObject, FigureShape, Point, SheetObject } from "../model/types";
import { keyStep } from "../core/keyStep";
import { SheetSvg, figureExtent, type SheetMode } from "../render/SheetSvg";
import { objectBox, type Measure } from "../render/textLayout";
import { blockProblem, figureProblem, pushIntoSheet, type KnownBoxes } from "../render/placeBlock";
import { numberSheet } from "../render/drillLayout";
import { toSvg } from "./pointer";

const BRAND = "#1a4f8b";
const WARN = "#b7791f";
const WARN_FILL = "rgba(245, 190, 60, 0.22)";
/** Facit afviger tydeligt fra figuren (calcDrift): orange i stedet for gul. */
const DRIFT = "#c2410c";
const DRIFT_FILL = "rgba(234, 120, 40, 0.16)";
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
  /** Håndtagets position (ankerets koordinater) ved start. */
  handle0: Point;
  active: boolean;
};

type Drag = MoveDrag | VertexDrag;

/** Objektets udstrækning på arket; for figurer inkl. etiketter og opgavenummer. */
function boxFor(o: SheetObject, doc: SheetDoc, numbering: ReadonlyMap<string, string>, measure: Measure): Bounds {
  return o.type === "figure" ? figureExtent(o, numbering.get(o.id) ?? "", measure) : objectBox(o, doc, numbering, measure);
}

/** Navn på et håndtag til skærmlæsere: figurens eget (handleName) eller "Hjørne X". */
function handleLabel(def: { handleName?: (key: string, displayName: string) => string }, key: string, name: string): string {
  return def.handleName ? def.handleName(key, name) : `Hjørne ${name}`;
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

/** Et skub mod trækket skal efterlade mindst så stor en del af håndtagets flytning langs trækket (fitOrPush). */
const KEEP_ALONG_DRAG = 0.75;

/** Arealet af figurens tegnede omrids (mm²): bliver figuren mindre ved et træk? */
function drawnArea(def: { bounds(shape: FigureShape): Bounds }, shape: FigureShape): number {
  const b = def.bounds(shape);
  return (b.maxX - b.minX) * (b.maxY - b.minY);
}

/** Så stor (mm, bredde eller højde) er en figur, der har nået arkets størrelsesgrænse (fx parallelogrammets bredde 160). */
const SHEET_SIZE_MM = 135;

/**
 * Står længden `param` ved sin grænse, fordi FIGUREN er så stor, som arket tillader (og ikke fordi målet selv er
 * ved sit maksimum, 15 cm)? Så "bredere" eller "højere" — fx parallelogrammets g ved 13,5 cm, når bredden
 * g + b · cos v er 16 cm. Ellers null ("Maks. g nået").
 */
function sheetSizeLimit(fig: FigureObject, param: string): "bredere" | "højere" | null {
  const def = defOf(fig);
  if (def.params.find((q) => q.key === param)?.kind !== "length") return null;
  const v = def.compute(fig.shape)[param];
  if (!(v < LIMITS.sideMaxCm - 0.05)) return null;
  const b = def.bounds(fig.shape);
  const w = b.maxX - b.minX;
  const h = b.maxY - b.minY;
  if (Math.max(w, h) < SHEET_SIZE_MM) return null;
  return w / (PAGE.w - 2 * PAGE.margin) >= h / (PAGE.h - 2 * PAGE.margin) ? "bredere" : "højere";
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
  /** Kort tekst til skærmlæsere efter et tastatur-hjørnetræk. */
  const [announce, setAnnounce] = useState("");

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

  const numbering = useMemo(() => numberSheet(doc, measure), [doc, measure]);
  // Alle objekters udstrækning, én gang pr. render (figurernes gemmes desuden pr. objekt i figureExtent, så et
  // træk kun regner den trukne figur igen), og hvilke figurer/blokke der dækker andre eller går ud over arket —
  // med billige rektangel-tests i stedet for at regne alle udstrækninger igen for hver figur.
  const boxes = useMemo<KnownBoxes>(
    () => new Map(doc.objects.map((o) => [o.id, boxFor(o, doc, numbering, measure)])),
    [doc, numbering, measure],
  );
  const layoutWarn = useMemo(() => {
    const out = new Set<string>();
    for (const o of doc.objects) {
      const p =
        o.type === "figure"
          ? figureProblem(doc, o, numbering, measure, boxes)
          : o.type === "drill" || o.type === "formula"
            ? blockProblem(doc, o, numbering, measure, boxes)
            : null;
      if (p) out.add(o.id);
    }
    return out;
  }, [doc, numbering, measure, boxes]);

  const sheetW = size ? Math.max(0, Math.min(size.w, (size.h * PAGE.w) / PAGE.h)) : 0;
  const sheetH = (sheetW * PAGE.h) / PAGE.w;

  const selected = doc.objects.find((o) => o.id === selectedId) ?? null;

  /**
   * Piletast på et hjørnehåndtag: flyt hjørnet ét trin (snap-trin, ellers 2 mm; Shift: 5 gange så meget),
   * se core/keyStep. Ændres formen ikke, siges hvorfor (grænse, arkets kant, anden led) — aldrig en død tast.
   */
  function keyVertex(fig: FigureObject, vertex: string, dir: Point, big: boolean) {
    const def = defOf(fig);
    const opts = dragOpts(doc.settings, false);
    const step = (doc.settings.snapCm > 0 ? opts.snapMm : 2) * (big ? 5 : 1);
    // Går figuren ud over margenen, skubbes den ind på arket efter samme regel som musetræk (fitOrPush) og kun,
    // så længe håndtaget stadig flytter sig i pilens retning.
    const p0 = def.vertices(fig.shape)[vertex];
    const place = (r: DragResult<FigureShape>): FigureObject | null => {
      const q = def.vertices(r.shape)[vertex];
      if (!p0 || !q) return null;
      const moved = { x: r.offset.x + q.x - p0.x, y: r.offset.y + q.y - p0.y };
      const shrinks = drawnArea(def, r.shape) < drawnArea(def, fig.shape);
      const next = fitOrPush({ ...fig, shape: r.shape, x: fig.x + r.offset.x, y: fig.y + r.offset.y } as FigureObject, moved, shrinks);
      const p1 = next ? def.vertices(next.shape)[vertex] : null;
      if (!next || !p1) return null;
      const progress = (next.x + p1.x - fig.x - p0.x) * dir.x + (next.y + p1.y - fig.y - p0.y) * dir.y;
      return progress > 1e-9 || (next.x === fig.x + r.offset.x && next.y === fig.y + r.offset.y) ? next : null;
    };
    const res = keyStep<FigureShape>(def, fig.shape, vertex, dir, step, opts, (r) => place(r) !== null);
    const handle = handleLabel(def, vertex, displayName(fig, vertex));
    if (!res.ok) {
      const name = res.reason !== "axis" && res.param ? displayName(fig, res.param) : null;
      const size = res.reason === "limit" && res.bigger && res.param ? sheetSizeLimit(fig, res.param) : null;
      say(
        res.reason === "axis"
          ? res.axis === "horizontal"
            ? `${handle} ændres med pil venstre og højre`
            : res.axis === "vertical"
              ? `${handle} ændres med pil op og ned`
              : `${handle} kan ikke flyttes med piletasterne`
          : res.reason === "sheet"
            ? name
              ? `${name} kan ikke blive ${res.bigger ? "større" : "mindre"} — figuren skal være på arket`
              : "Figuren skal være på arket"
            : name && size
              ? `${name} kan ikke blive større — figuren kan ikke blive ${size} på arket`
              : name
                ? `${res.bigger ? "Maks." : "Min."} ${name} nået`
                : "Håndtaget kan ikke flyttes længere i den retning",
      );
      return;
    }
    const next = place(res.result);
    if (!next) return;
    onReshape(fig.id, next.shape, next.x, next.y);
    onCommit();
    const vals = def.compute(next.shape);
    // Skjulte afledte mål (areal, omkreds …) læses ikke op.
    const parts = def.params
      .filter((q) => !q.derived || next.params[q.key]?.visible)
      .map((q) => `${displayName(next, q.key)} ${formatByKind(q.kind, vals[q.key])}`);
    say(`${handleLabel(def, vertex, displayName(next, vertex))} flyttet. ${parts.join(", ")}`);
  }

  /** Skærmlæser-besked; samme tekst to gange i træk læses også op (med et usynligt mellemrum). */
  function say(text: string) {
    setAnnounce((prev) => (prev === text ? `${text}\u00a0` : text));
  }

  // Piletaster flytter det markerede objekt (1 mm, Shift = 5 mm); hvert tryk er ét fortryd-trin.
  const latest = useRef({ doc, selected, boxes, onMove, onCommit, mode, keyVertex });
  useEffect(() => {
    latest.current = { doc, selected, boxes, onMove, onCommit, mode, keyVertex };
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
      // Står fokus på et hjørnehåndtag, ændrer piletasterne trekanten i stedet for at flytte den.
      const handle = e.target instanceof Element ? e.target.closest("[data-ol-handle]")?.getAttribute("data-ol-handle") : null;
      if (handle && obj.type === "figure") {
        cur.keyVertex(obj, handle, v, e.shiftKey);
        return;
      }
      const step = e.shiftKey ? NUDGE_BIG : NUDGE;
      const box = cur.boxes.get(obj.id);
      if (!box) return;
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
    const pt = toSvg(svg, e);
    const p = defOf(selected).vertices(selected.shape)[vertex];
    if (!pt || !p) return;
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
      handle0: { x: p.x, y: p.y },
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
    const wasSelected = id !== null && id === selectedId;
    onSelect(id);
    if (!id || mode !== "opgave") return;
    // Touch: første tryk på et umarkeret objekt markerer det kun. Ellers ville samme træk
    // både scrolle siden (svg'et har touch-action: pan-y, når intet er markeret) og flytte
    // objektet. Når noget er markeret, er touch-action none, og næste træk flytter.
    if (e.pointerType === "touch" && !wasSelected) return;
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
      box: boxes.get(obj.id) ?? boxFor(obj, doc, numbering, measure),
      active: false,
    };
    setDragging(true);
  }

  /**
   * Figuren, hvis den er inden for arkets margen. Ellers skubbes den ind på arket (pushIntoSheet): en figur ved
   * margenen — hvor nye figurer lægges — kan vokse ud mod kanten og flytter sig ind i stedet for at sidde fast.
   * Ens for mus og tastatur. `moved` er håndtagets flytning (før skub) — trækkets retning:
   *  - skub i trækkets retning og på tværs af det (fx nedad, når cylinderens r trækkes mod højre) er i orden;
   *  - et skub MOD trækket må højst tage 1 − KEEP_ALONG_DRAG af håndtagets flytning: håndtaget følger altid
   *    pointeren. Et hjørne, der trækkes op over topmargenen (eller et håndtag mod højre margen), ville stå
   *    stille, mens figuren gled væk — dér stopper formændringen ved margenen, og figuren bliver, hvor den er;
   *  - når figuren bliver MINDRE (`shrinks`), må den rykke mod trækket, så længe skubbet er mindre end
   *    håndtagets flytning pr. akse — så en etiket, der er bredere end figuren (kvadratets "s = 1,5 cm" eller
   *    parallelogrammets g), bliver på arket, og en figur ved margenen stadig kan gøres mindre.
   * null når den ikke kan være på arket.
   */
  function fitOrPush(next: FigureObject, moved: Point, shrinks: boolean): FigureObject | null {
    const number = numbering.get(next.id) ?? "";
    const ext = figureExtent(next, number, measure);
    if (fitsSheet(ext)) return next;
    const push = pushIntoSheet(ext);
    if (!push) return null;
    const len2 = moved.x * moved.x + moved.y * moved.y;
    if (len2 < 1e-12) return null;
    // Hvor meget af håndtagets flytning, der er tilbage langs trækket efter skubbet (1 = hele; på tværs: 1).
    const kept = ((moved.x + push.x) * moved.x + (moved.y + push.y) * moved.y) / len2;
    const smaller = (p: number, h: number) => p === 0 || Math.sign(p) === Math.sign(h) || Math.abs(p) < Math.abs(h) - 1e-6;
    if (kept < KEEP_ALONG_DRAG && !(shrinks && smaller(push.x, moved.x) && smaller(push.y, moved.y))) return null;
    const pushed = { ...next, x: next.x + push.x, y: next.y + push.y };
    return fitsSheet(figureExtent(pushed, number, measure)) ? pushed : null;
  }

  /** Figuren efter et hjørnetræk til `local` (ankerets koordinater ved start), eller null hvis den ikke kan være på arket. */
  function reshapeAt(d: VertexDrag, fig: FigureObject, local: Point, coarse: boolean): FigureObject | null {
    const def = defOf(fig);
    const res = def.dragVertex(d.shape, d.vertex, local, dragOpts(doc.settings, coarse));
    const q = def.vertices(res.shape)[d.vertex] ?? d.handle0;
    // Håndtagets flytning siden trækkets start (før skub), og om figuren er blevet mindre end ved start.
    const moved = { x: res.offset.x + q.x - d.handle0.x, y: res.offset.y + q.y - d.handle0.y };
    const shrinks = drawnArea(def, res.shape) < drawnArea(def, d.shape);
    const next = {
      ...fig,
      shape: res.shape,
      // Ikke afrundet: ved C-træk skal A og B blive præcis, hvor de var.
      x: d.anchor.x + res.offset.x,
      y: d.anchor.y + res.offset.y,
    } as FigureObject;
    return fitOrPush(next, moved, shrinks);
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
      <p className="sr-only" role="status" aria-live="polite" data-ol-announce="">
        {announce}
      </p>
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
              "aria-label": "Opgaveark (A4). Tab går til objekterne; Enter markerer, piletaster flytter, Escape afmarkerer.",
              tabIndex: -1,
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
              boxes={boxes}
              layoutWarn={layoutWarn}
              activeHandle={activeHandle}
              onSelect={onSelect}
            />
          </SheetSvg>
        </div>
      )}
    </div>
  );
}

// ---- overlay ----

/** Tastaturadgang til et objekt på arket: Tab når det, Enter/mellemrum markerer det. */
function hitProps(id: string, label: string, pressed: boolean, onSelect: (id: string | null) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": pressed,
    onKeyDown: (e: ReactKeyboardEvent<SVGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(id);
      }
    },
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
  boxes,
  layoutWarn,
  activeHandle,
  onSelect,
}: {
  doc: SheetDoc;
  mode: SheetMode;
  selected: SheetObject | null;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  /** Alle objekters udstrækning (SheetEditor: figureExtent/objectBox med nummer). */
  boxes: KnownBoxes;
  /** Figurer og blokke, der dækker andre objekter eller går ud over arket (figureProblem/blockProblem). */
  layoutWarn: ReadonlySet<string>;
  activeHandle: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <g data-ol-overlay="">
      {doc.objects.map((o) => {
        const number = numbering.get(o.id);
        const pressed = selected?.id === o.id;
        if (o.type === "figure") {
          // Kun i editoren: figuren dækker en anden figur, en tekst eller et regnestykke (fx lagt på et fuldt ark).
          const fb = layoutWarn.has(o.id) ? (boxes.get(o.id) ?? null) : null;
          return (
            <g key={o.id}>
              {fb && (
                <rect
                  data-ol-layout-warn={o.id}
                  x={fb.minX - 1.2}
                  y={fb.minY - 1.2}
                  width={fb.maxX - fb.minX + 2.4}
                  height={fb.maxY - fb.minY + 2.4}
                  rx={1}
                  fill={WARN_FILL}
                  stroke={WARN}
                  strokeWidth={0.6}
                  strokeDasharray="2 1.2"
                  pointerEvents="none"
                />
              )}
              <FigureHit fig={o} number={number} pressed={pressed} onSelect={onSelect} />
            </g>
          );
        }
        const label =
          o.type === "text"
            ? `Tekst${number ? ` ${number}` : ""}: ${o.text.replace(/\s+/g, " ").trim().slice(0, 40) || "tom"}`
            : o.type === "drill"
              ? `Regneark ${number ?? ""}`.trim()
              : o.type === "formula"
                ? `Formler ${number ?? ""}`.trim()
                : `Regnestykke ${number ?? ""}`.trim();
        // Regnestykker er bredere på svararket (facit); de andre objekter fylder det samme i begge visninger.
        const b = o.type === "calc" ? objectBox(o, doc, numbering, measure, mode) : (boxes.get(o.id) ?? objectBox(o, doc, numbering, measure, mode));
        const fig = o.type === "calc" ? doc.objects.find((f): f is FigureObject => f.type === "figure" && f.id === o.figureId) : null;
        const problem = o.type === "calc" && fig ? calcProblem(fig, o.param, doc.settings) : null;
        // Regneark og formelblokke, der går ud over arket eller dækker andre objekter (kun markering i editoren).
        const layoutProblem = (o.type === "drill" || o.type === "formula") && layoutWarn.has(o.id);
        const drift = o.type === "calc" && fig && !problem ? calcDrift(fig, o.param, doc.settings) : null;
        return (
          <g key={o.id}>
            {drift && (
              // Kun i editoren: facit regnet på de viste tal afviger tydeligt fra figuren.
              <rect
                data-ol-drift={o.id}
                x={b.minX - 1.2}
                y={b.minY - 1.2}
                width={b.maxX - b.minX + 2.4}
                height={b.maxY - b.minY + 2.4}
                rx={1}
                fill={DRIFT_FILL}
                stroke={DRIFT}
                strokeWidth={0.4}
                strokeDasharray="1.2 0.8"
                pointerEvents="none"
              />
            )}
            {layoutProblem && (
              // Kun i editoren: blokken går ud over arket eller dækker noget.
              <rect
                data-ol-layout-warn={o.id}
                x={b.minX - 1.2}
                y={b.minY - 1.2}
                width={b.maxX - b.minX + 2.4}
                height={b.maxY - b.minY + 2.4}
                rx={1}
                fill={WARN_FILL}
                stroke={WARN}
                strokeWidth={0.6}
                strokeDasharray="2 1.2"
                pointerEvents="none"
              />
            )}
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
              {...hitProps(o.id, `${label} — tryk Enter for at markere`, pressed, onSelect)}
            />
          </g>
        );
      })}
      {selected && mode === "opgave" && (
        <Selection obj={selected} doc={doc} numbering={numbering} measure={measure} box={boxes.get(selected.id)} activeHandle={activeHandle} />
      )}
    </g>
  );
}

/** memo: kun den flyttede/ændrede figurs klik-flade tegnes om ved et træk-trin. */
const FigureHit = memo(function FigureHit({
  fig,
  number,
  pressed,
  onSelect,
}: {
  fig: FigureObject;
  number: string | undefined;
  pressed: boolean;
  onSelect: (id: string | null) => void;
}) {
  const def = defOf(fig);
  // Klik-fladen: figurens yderkant (outline), ellers hjørnerne.
  const pts = (def.outline?.(fig.shape) ?? Object.values(def.vertices(fig.shape)))
    .map((p) => `${fig.x + p.x},${fig.y + p.y}`)
    .join(" ");
  const label = `${def.name}${number ? ` ${number}` : ""} — tryk Enter for at markere`;
  return <polygon points={pts} strokeWidth={5} strokeLinejoin="round" {...hitProps(fig.id, label, pressed, onSelect)} />;
});

function Selection({
  obj,
  doc,
  numbering,
  measure,
  box,
  activeHandle,
}: {
  obj: SheetObject;
  doc: SheetDoc;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  /** Figurens udstrækning, hvis den allerede er regnet. */
  box: Bounds | undefined;
  activeHandle: string | null;
}) {
  const b =
    obj.type === "figure" ? (box ?? boxFor(obj, doc, numbering, measure)) : objectBox(obj, doc, numbering, measure, "opgave");
  const pad = 1.5;
  const verts = obj.type === "figure" ? defOf(obj).vertices(obj.shape) : null;
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
                role="button"
                tabIndex={0}
                aria-label={`${handleLabel(defOf(obj as FigureObject), k, displayName(obj as FigureObject, k))} — træk for at ændre`}
                aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
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
