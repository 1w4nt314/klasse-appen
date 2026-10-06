// Opgavelab — geometri-kerne for cirklen. Formen er { r } i mm; ankeret er centrum. Ét håndtag
// "r" på randen til højre: r = |p| (håndtaget lægger sig til højre igen). Find-reglerne (RULES)
// køres af den generiske motor i core/solveKit.ts (makeSolver). π står som "π" i rhs og er
// Math.PI i udregningen, så alle π-regler giver "≈".
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  CircleShape,
  DragOpts,
  DragResult,
  FigureSpec,
  ParamDef,
  ParamKind,
  Point,
  Rule,
} from "../model/types";

/** Min/max radius i mm (0,5–7 cm). */
export const MIN_R_MM = 5;
export const MAX_R_MM = 70;

/** Antal hjørner i klik-polygonen. */
export const OUTLINE_POINTS = 24;

export const PARAMS: ParamDef[] = [
  { key: "r", label: "Radius r", kind: "length" },
  // Afledte mål: skjult som standard; d tegnes som stiplet diameter, de øvrige i mål-boksen.
  { key: "d", label: "Diameter d", kind: "length", derived: true },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
  { key: "A", label: "Areal A", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { r: "length", d: "length", O: "length", A: "area" };

function clampR(v: number): number {
  return v < MIN_R_MM ? MIN_R_MM : v > MAX_R_MM ? MAX_R_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function defaultShape(): CircleShape {
  return { r: 30 };
}

/** Håndtagets punkt (på randen, til højre for centrum), relativt til ankeret. */
export function vertices(shape: CircleShape): Record<string, Point> {
  return { r: { x: shape.r, y: 0 } };
}

/** Regulær polygon på randen (klik-fladen). */
export function outline(shape: CircleShape): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < OUTLINE_POINTS; i++) {
    const t = (2 * Math.PI * i) / OUTLINE_POINTS;
    pts.push({ x: shape.r * Math.cos(t), y: shape.r * Math.sin(t) });
  }
  return pts;
}

export function bounds(shape: CircleShape): Bounds {
  return { minX: -shape.r, minY: -shape.r, maxX: shape.r, maxY: shape.r };
}

/** cm, uafrundet: radius r, diameter d, omkreds O og areal A. */
export function compute(shape: CircleShape): Record<string, number> {
  const r = shape.r / 10;
  return { r, d: 2 * r, O: 2 * Math.PI * r, A: Math.PI * r * r };
}

/** Træk i "r": r = afstanden fra centrum (snappet til snapMm, clampet 0,5–7 cm). Ankeret flyttes ikke. */
export function dragVertex(shape: CircleShape, vertex: string, local: Point, opts: DragOpts): DragResult<CircleShape> {
  const none = { x: 0, y: 0 };
  if (vertex !== "r" || !Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  return { shape: { r: clampR(snapTo(Math.hypot(local.x, local.y), opts.snapMm)) }, offset: none };
}

export function validateShape(raw: unknown): CircleShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { r } = raw as Record<string, unknown>;
  if (typeof r !== "number" || !Number.isFinite(r)) return null;
  return { r: clampR(r) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. Alle π-regler er irrationelle → "≈". */
const RULES: Record<string, Rule[]> = {
  d: [
    { given: ["r"], rhs: "2 · {r}", value: (v) => 2 * v.r },
    { given: ["O"], rhs: "{O} / π", value: (v) => v.O / Math.PI },
  ],
  r: [
    { given: ["d"], rhs: "{d} / 2", value: (v) => v.d / 2 },
    { given: ["O"], rhs: "{O} / (2 · π)", value: (v) => v.O / (2 * Math.PI) },
    { given: ["A"], rhs: "√({A} / π)", value: (v) => Math.sqrt(Math.max(0, v.A) / Math.PI) },
  ],
  O: [
    { given: ["r"], rhs: "2 · π · {r}", value: (v) => 2 * Math.PI * v.r },
    { given: ["d"], rhs: "π · {d}", value: (v) => Math.PI * v.d },
  ],
  A: [
    { given: ["r"], rhs: "π · {r}²", value: (v) => Math.PI * v.r * v.r },
    { given: ["d"], rhs: "π · ({d} / 2)²", value: (v) => Math.PI * (v.d / 2) * (v.d / 2) },
  ],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/circle.tsx. */
export const circleSpec: FigureSpec<CircleShape> = {
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
