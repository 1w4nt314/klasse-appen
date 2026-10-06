// Opgavelab — geometri-kerne for rektanglet. Formen er { l, b } i mm (l vandret, b lodret);
// ankeret er øverste venstre hjørne. Ét håndtag "lb" i nederste højre hjørne: l = x, b = y.
// Find-reglerne (RULES) køres af den generiske motor i core/solveKit.ts (makeSolver).
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  DragOpts,
  DragResult,
  FigureSpec,
  ParamDef,
  ParamKind,
  Point,
  RectangleShape,
  Rule,
} from "../model/types";

/** Min/max side i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;

export const PARAMS: ParamDef[] = [
  { key: "l", label: "Længde l", kind: "length" },
  { key: "b", label: "Bredde b", kind: "length" },
  // Afledte mål: skjult som standard; d tegnes som stiplet diagonal, de øvrige i mål-boksen.
  { key: "d", label: "Diagonal d", kind: "length", derived: true },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
  { key: "A", label: "Areal A", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { l: "length", b: "length", d: "length", O: "length", A: "area" };

function clampSide(v: number): number {
  return v < MIN_SIDE_MM ? MIN_SIDE_MM : v > MAX_SIDE_MM ? MAX_SIDE_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function defaultShape(): RectangleShape {
  return { l: 80, b: 50 };
}

/** Håndtagets punkt (nederste højre hjørne), relativt til ankeret. */
export function vertices(shape: RectangleShape): Record<string, Point> {
  return { lb: { x: shape.l, y: shape.b } };
}

/** De fire hjørner (klik-fladen). */
export function outline(shape: RectangleShape): Point[] {
  return [
    { x: 0, y: 0 },
    { x: shape.l, y: 0 },
    { x: shape.l, y: shape.b },
    { x: 0, y: shape.b },
  ];
}

export function bounds(shape: RectangleShape): Bounds {
  return { minX: 0, minY: 0, maxX: shape.l, maxY: shape.b };
}

/** cm, uafrundet: l, b, diagonal d, omkreds O og areal A. */
export function compute(shape: RectangleShape): Record<string, number> {
  const l = shape.l / 10;
  const b = shape.b / 10;
  return { l, b, d: Math.hypot(l, b), O: 2 * l + 2 * b, A: l * b };
}

/** Træk i "lb": l = x og b = y (snappet til snapMm, clampet 1–15 cm). Ankeret flyttes ikke. */
export function dragVertex(shape: RectangleShape, vertex: string, local: Point, opts: DragOpts): DragResult<RectangleShape> {
  const none = { x: 0, y: 0 };
  if (vertex !== "lb" || !Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  return { shape: { l: clampSide(snapTo(local.x, opts.snapMm)), b: clampSide(snapTo(local.y, opts.snapMm)) }, offset: none };
}

export function validateShape(raw: unknown): RectangleShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { l, b } = raw as Record<string, unknown>;
  if (typeof l !== "number" || !Number.isFinite(l)) return null;
  if (typeof b !== "number" || !Number.isFinite(b)) return null;
  return { l: clampSide(l), b: clampSide(b) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst, så de aldrig fortrænger en fremadregel. */
const RULES: Record<string, Rule[]> = {
  A: [{ given: ["l", "b"], rhs: "{l} · {b}", value: (v) => v.l * v.b }],
  O: [{ given: ["l", "b"], rhs: "2 · {l} + 2 · {b}", value: (v) => 2 * v.l + 2 * v.b }],
  d: [{ given: ["l", "b"], rhs: "√({l}² + {b}²)", value: (v) => Math.hypot(v.l, v.b) }],
  l: [
    { given: ["A", "b"], rhs: "{A} / {b}", value: (v) => v.A / v.b },
    { given: ["O", "b"], rhs: "{O} / 2 − {b}", value: (v) => v.O / 2 - v.b },
  ],
  b: [
    { given: ["A", "l"], rhs: "{A} / {l}", value: (v) => v.A / v.l },
    { given: ["O", "l"], rhs: "{O} / 2 − {l}", value: (v) => v.O / 2 - v.l },
  ],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/rectangle.tsx. */
export const rectangleSpec: FigureSpec<RectangleShape> = {
  params: PARAMS,
  defaultShape,
  vertices,
  compute,
  dragVertex,
  validateShape,
  bounds,
  outline,
  kinds: KIND,
  rules: RULES,
};
