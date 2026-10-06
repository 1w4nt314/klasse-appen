// Opgavelab — geometri-kerne for kuglen. Formen er { r } i mm; ankeret er centrum. Kuglen tegnes
// som en cirkel med en ækvatorellipse (ry = 0,3 · r): forreste halvdel fuld, bagerste stiplet.
// Ét håndtag "r" på ækvator til højre: r = |p| (som cirklen). Find-reglerne (RULES) køres af
// core/solveKit.ts (makeSolver). π står som "π" i rhs og er Math.PI i udregningen → altid "≈".
// ∛ (U+221B) findes i DejaVu Sans.
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
  SphereShape,
} from "../model/types";

/** Min/max radius i mm (0,5–7 cm). */
export const MIN_R_MM = 5;
export const MAX_R_MM = 70;

/** Ækvatorellipsens halve højde som del af r. */
export const EQUATOR_RY = 0.3;

/** Antal hjørner i klik-polygonen. */
export const OUTLINE_POINTS = 24;

export const PARAMS: ParamDef[] = [
  { key: "r", label: "Radius r", kind: "length" },
  // Afledte mål: skjult som standard; d tegnes som stiplet diameter, de øvrige i mål-boksen.
  { key: "d", label: "Diameter d", kind: "length", derived: true },
  { key: "V", label: "Rumfang V", kind: "volume", derived: true },
  { key: "O", label: "Overflade O", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { r: "length", d: "length", V: "volume", O: "area" };

function clampR(v: number): number {
  return v < MIN_R_MM ? MIN_R_MM : v > MAX_R_MM ? MAX_R_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function defaultShape(): SphereShape {
  return { r: 30 };
}

/** Håndtagets punkt (på ækvator, til højre for centrum), relativt til ankeret. */
export function vertices(shape: SphereShape): Record<string, Point> {
  return { r: { x: shape.r, y: 0 } };
}

/** Regulær polygon på randen (klik-fladen). */
export function outline(shape: SphereShape): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < OUTLINE_POINTS; i++) {
    const t = (2 * Math.PI * i) / OUTLINE_POINTS;
    pts.push({ x: shape.r * Math.cos(t), y: shape.r * Math.sin(t) });
  }
  return pts;
}

export function bounds(shape: SphereShape): Bounds {
  return { minX: -shape.r, minY: -shape.r, maxX: shape.r, maxY: shape.r };
}

/** cm, uafrundet: radius r, diameter d, rumfang V og overflade O. */
export function compute(shape: SphereShape): Record<string, number> {
  const r = shape.r / 10;
  return { r, d: 2 * r, V: (4 / 3) * Math.PI * r * r * r, O: 4 * Math.PI * r * r };
}

/** Træk i "r": r = afstanden fra centrum (snappet til snapMm, klemt 0,5–7 cm). Ankeret flyttes ikke. */
export function dragVertex(shape: SphereShape, vertex: string, local: Point, opts: DragOpts): DragResult<SphereShape> {
  const none = { x: 0, y: 0 };
  if (vertex !== "r" || !Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  return { shape: { r: clampR(snapTo(Math.hypot(local.x, local.y), opts.snapMm)) }, offset: none };
}

export function validateShape(raw: unknown): SphereShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { r } = raw as Record<string, unknown>;
  if (typeof r !== "number" || !Number.isFinite(r)) return null;
  return { r: clampR(r) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. Alle π-regler er irrationelle → "≈". */
const RULES: Record<string, Rule[]> = {
  V: [{ given: ["r"], rhs: "4/3 · π · {r}³", value: (v) => (4 / 3) * Math.PI * v.r * v.r * v.r }],
  O: [{ given: ["r"], rhs: "4 · π · {r}²", value: (v) => 4 * Math.PI * v.r * v.r }],
  d: [{ given: ["r"], rhs: "2 · {r}", value: (v) => 2 * v.r }],
  r: [
    { given: ["d"], rhs: "{d} / 2", value: (v) => v.d / 2 },
    { given: ["O"], rhs: "√({O} / (4 · π))", value: (v) => Math.sqrt(Math.max(0, v.O) / (4 * Math.PI)) },
    { given: ["V"], rhs: "∛(3 · {V} / (4 · π))", value: (v) => Math.cbrt((3 * v.V) / (4 * Math.PI)) },
  ],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/sphere.tsx. */
export const sphereSpec: FigureSpec<SphereShape> = {
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
