// Opgavelab — geometri-kerne for terningen: kassen med l = b = h = s i kavalerperspektiv (dybden
// halv størrelse under 45°, som core/box.ts). Formen er { s } i mm; ankeret er det forreste nederste
// venstre hjørne. Ét håndtag "s" i det forreste nederste højre hjørne: s = x.
// Find-reglerne (RULES) køres af core/solveKit.ts (makeSolver). ∛ (U+221B) findes i DejaVu Sans.
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  CubeShape,
  DragOpts,
  DragResult,
  FigureSpec,
  ParamDef,
  ParamKind,
  Point,
  Rule,
} from "../model/types";

/** Min/max side i mm (1–12 cm); den tegnede terning er da højst 12 · (1 + 0,354) ≈ 16,2 cm. */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 120;

/** Dybden s tegnes som en forskydning på (DEPTH_XY · s, −DEPTH_XY · s) mm (k = 0,5 under 45°). */
export const DEPTH_XY = 0.5 * Math.SQRT1_2;

export const PARAMS: ParamDef[] = [
  { key: "s", label: "Side s", kind: "length" },
  // Afledte mål: skjult som standard og står i mål-boksen under figuren, når de er synlige.
  { key: "V", label: "Rumfang V", kind: "volume", derived: true },
  { key: "O", label: "Overflade O", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { s: "length", V: "volume", O: "area" };

function clampS(v: number): number {
  return v < MIN_SIDE_MM ? MIN_SIDE_MM : v > MAX_SIDE_MM ? MAX_SIDE_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

export function defaultShape(): CubeShape {
  return { s: 50 };
}

/** Håndtaget (forreste nederste højre hjørne), relativt til ankeret. */
export function vertices(shape: CubeShape): Record<string, Point> {
  return { s: { x: shape.s, y: 0 } };
}

/** De 6 yderhjørner (klik-fladen dækker forside, top og højre side). */
export function outline(shape: CubeShape): Point[] {
  const { s } = shape;
  const d = DEPTH_XY * s;
  return [
    { x: 0, y: 0 },
    { x: s, y: 0 },
    { x: s + d, y: -d },
    { x: s + d, y: -s - d },
    { x: d, y: -s - d },
    { x: 0, y: -s },
  ];
}

export function bounds(shape: CubeShape): Bounds {
  const d = DEPTH_XY * shape.s;
  return { minX: 0, minY: -shape.s - d, maxX: shape.s + d, maxY: 0 };
}

/** cm, uafrundet: side s, rumfang V og overflade O. */
export function compute(shape: CubeShape): Record<string, number> {
  const s = shape.s / 10;
  return { s, V: s * s * s, O: 6 * s * s };
}

/** Træk i "s": s = x (snappet til snapMm, klemt 1–12 cm). Ankeret flyttes ikke. */
export function dragVertex(shape: CubeShape, vertex: string, local: Point, opts: DragOpts): DragResult<CubeShape> {
  const none = { x: 0, y: 0 };
  if (vertex !== "s" || !Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  return { shape: { s: clampS(snapTo(local.x, opts.snapMm)) }, offset: none };
}

export function validateShape(raw: unknown): CubeShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { s } = raw as Record<string, unknown>;
  if (typeof s !== "number" || !Number.isFinite(s)) return null;
  return { s: clampS(s) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. */
const RULES: Record<string, Rule[]> = {
  V: [{ given: ["s"], rhs: "{s}³", value: (v) => v.s * v.s * v.s }],
  O: [{ given: ["s"], rhs: "6 · {s}²", value: (v) => 6 * v.s * v.s }],
  s: [
    { given: ["V"], rhs: "∛{V}", value: (v) => Math.cbrt(v.V) },
    { given: ["O"], rhs: "√({O} / 6)", value: (v) => Math.sqrt(Math.max(0, v.O) / 6) },
  ],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/cube.tsx. */
export const cubeSpec: FigureSpec<CubeShape> = {
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
