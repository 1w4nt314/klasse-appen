// Opgavelab — geometri-kerne for kvadratet. Formen er { s } i mm; ankeret er øverste venstre
// hjørne. Ét håndtag "s" i nederste højre hjørne: s = max(x, y). Find-reglerne (RULES) køres af
// den generiske motor i core/solveKit.ts (makeSolver).
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
  Rule,
  SquareShape,
} from "../model/types";

/** Min/max side i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;

export const PARAMS: ParamDef[] = [
  { key: "s", label: "Side s", kind: "length" },
  // Afledte mål: skjult som standard; d tegnes som stiplet diagonal, de øvrige i mål-boksen.
  { key: "d", label: "Diagonal d", kind: "length", derived: true },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
  { key: "A", label: "Areal A", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { s: "length", d: "length", O: "length", A: "area" };

function clampSide(v: number): number {
  return v < MIN_SIDE_MM ? MIN_SIDE_MM : v > MAX_SIDE_MM ? MAX_SIDE_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function defaultShape(): SquareShape {
  return { s: 60 };
}

/** Håndtagets punkt (nederste højre hjørne), relativt til ankeret. */
export function vertices(shape: SquareShape): Record<string, Point> {
  return { s: { x: shape.s, y: shape.s } };
}

/** De fire hjørner (klik-fladen). */
export function outline(shape: SquareShape): Point[] {
  return [
    { x: 0, y: 0 },
    { x: shape.s, y: 0 },
    { x: shape.s, y: shape.s },
    { x: 0, y: shape.s },
  ];
}

export function bounds(shape: SquareShape): Bounds {
  return { minX: 0, minY: 0, maxX: shape.s, maxY: shape.s };
}

/** cm, uafrundet: s, diagonal d, omkreds O og areal A. */
export function compute(shape: SquareShape): Record<string, number> {
  const s = shape.s / 10;
  return { s, d: s * Math.SQRT2, O: 4 * s, A: s * s };
}

/** Træk i "s": s = max(x, y) (snappet til snapMm, clampet 1–15 cm). Ankeret flyttes ikke. */
export function dragVertex(shape: SquareShape, vertex: string, local: Point, opts: DragOpts): DragResult<SquareShape> {
  const none = { x: 0, y: 0 };
  if (vertex !== "s" || !Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  return { shape: { s: clampSide(snapTo(Math.max(local.x, local.y), opts.snapMm)) }, offset: none };
}

export function validateShape(raw: unknown): SquareShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { s } = raw as Record<string, unknown>;
  if (typeof s !== "number" || !Number.isFinite(s)) return null;
  return { s: clampSide(s) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. √2 og √A er irrationelle → "≈" når afrundet. */
const RULES: Record<string, Rule[]> = {
  A: [{ given: ["s"], rhs: "{s} · {s}", value: (v) => v.s * v.s }],
  O: [{ given: ["s"], rhs: "4 · {s}", value: (v) => 4 * v.s }],
  d: [{ given: ["s"], rhs: "{s} · √2", value: (v) => v.s * Math.SQRT2 }],
  s: [
    { given: ["O"], rhs: "{O} / 4", value: (v) => v.O / 4 },
    { given: ["A"], rhs: "√{A}", value: (v) => Math.sqrt(Math.max(0, v.A)) },
  ],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/square.tsx. */
export const squareSpec: FigureSpec<SquareShape> = {
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
