// Opgavelab — geometri-kerne for parallelogrammet. Formen er { g, b, v } (mm og grader): grundlinjen g
// ligger vandret nederst, den skrå side b står ud fra nederste venstre hjørne (ankeret) i vinklen v
// opad mod højre. Højden h = b · sin v er afledt. Find-reglerne (RULES) kører i core/solveKit.ts.
// To håndtag: "g" (nederste højre hjørne: g = x) og "b" (øverste venstre hjørne: polar fra ankeret,
// b = afstanden og v = vinklen, snappet i hele grader og klemt til 20–90°).
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  DragOpts,
  DragResult,
  FigureSpec,
  ParallelogramShape,
  ParamDef,
  ParamKind,
  Point,
  Rule,
} from "../model/types";

/** Min/max side i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;
/** Vinklen v i grader: 20–90 (stumpe vinkler er den spejlede figur). */
export const MIN_V_DEG = 20;
export const MAX_V_DEG = 90;
/** Figurens bredde (g + b · cos v) må højst være så meget (mm), så den og dens etiketter står på A4. */
export const MAX_WIDTH_MM = 160;

const RAD = Math.PI / 180;

export const PARAMS: ParamDef[] = [
  { key: "g", label: "Grundlinje g", kind: "length" },
  { key: "b", label: "Skrå side b", kind: "length" },
  { key: "v", label: "Vinkel v", kind: "angle", noFind: "Vinklen v kan ikke findes med et regnestykke her — den ændres ved at trække i hjørnet øverst til venstre." },
  // Afledte mål: skjult som standard. h tegnes som stiplet højde, O og A i mål-boksen.
  { key: "h", label: "Højde h", kind: "length", derived: true },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
  { key: "A", label: "Areal A", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { g: "length", b: "length", v: "angle", h: "length", O: "length", A: "area" };

const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);

/** clamp(x, lo, max), men en værdi højst 5e-10 mm over max (flydende-tals-støj) bevares uændret. */
const clampMax = (x: number, lo: number, max: number) => (x < lo ? lo : x <= max + 5e-10 ? x : Math.max(lo, max));

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

/** Rund ned til et helt trin (snap), ellers uændret. */
function floorTo(v: number, step: number): number {
  return step > 0 ? Math.floor(v / step + 1e-9) * step : v;
}

/** Største b (mm) ved grundlinjen g og vinklen v, så bredden holder sig inden for MAX_WIDTH_MM. */
function maxB(g: number, v: number): number {
  const c = Math.cos(v * RAD);
  return Math.min(MAX_SIDE_MM, c > 1e-9 ? (MAX_WIDTH_MM - g) / c : Infinity);
}

export function defaultShape(): ParallelogramShape {
  return { g: 80, b: 50, v: 60 };
}

/** De fire hjørner (lokale mm, y nedad): nederste venstre = ankeret. */
export function corners(shape: ParallelogramShape): { bl: Point; br: Point; tl: Point; tr: Point } {
  const dx = shape.b * Math.cos(shape.v * RAD);
  const dy = -shape.b * Math.sin(shape.v * RAD);
  return { bl: { x: 0, y: 0 }, br: { x: shape.g, y: 0 }, tl: { x: dx, y: dy }, tr: { x: shape.g + dx, y: dy } };
}

/** Håndtagene: "g" nederst til højre, "b" øverst til venstre (b og v). */
export function vertices(shape: ParallelogramShape): Record<string, Point> {
  const c = corners(shape);
  return { g: c.br, b: c.tl };
}

/** Klik-fladen: de fire hjørner. */
export function outline(shape: ParallelogramShape): Point[] {
  const c = corners(shape);
  return [c.bl, c.br, c.tr, c.tl];
}

export function bounds(shape: ParallelogramShape): Bounds {
  const c = corners(shape);
  return { minX: 0, minY: c.tl.y, maxX: c.tr.x, maxY: 0 };
}

/** Højdens fodpunkt x (lokale mm) på grundlinjens linje: lodret under det øverste venstre hjørne. */
export function heightFootX(shape: ParallelogramShape): number {
  return shape.b * Math.cos(shape.v * RAD);
}

/** cm og grader, uafrundet: g, b, v, højde h = b · sin v, omkreds O og areal A = g · h. */
export function compute(shape: ParallelogramShape): Record<string, number> {
  const g = shape.g / 10;
  const b = shape.b / 10;
  const h = b * Math.sin(shape.v * RAD);
  return { g, b, v: shape.v, h, O: 2 * g + 2 * b, A: g * h };
}

/**
 * Træk i "g": g = x (snappet, 1–15 cm, og så bredden holder). Træk i "b": polar fra ankeret —
 * b = afstanden (snappet), v = vinklen (hele grader med snapDeg, ellers fri), klemt til 20–90°;
 * b begrænses, så bredden holder. Ankeret flyttes aldrig.
 */
export function dragVertex(shape: ParallelogramShape, vertex: string, local: Point, opts: DragOpts): DragResult<ParallelogramShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  if (vertex === "g") {
    const cos = Math.cos(shape.v * RAD);
    const hi = Math.min(MAX_SIDE_MM, floorTo(MAX_WIDTH_MM - shape.b * cos, opts.snapMm));
    return { shape: { ...shape, g: clamp(snapTo(local.x, opts.snapMm), MIN_SIDE_MM, Math.max(MIN_SIDE_MM, hi)) }, offset: none };
  }
  if (vertex === "b") {
    const ang = Math.atan2(-local.y, local.x) / RAD;
    const v = clamp(opts.snapDeg ? snapTo(ang, opts.degStep && opts.degStep > 0 ? opts.degStep : 1) : ang, MIN_V_DEG, MAX_V_DEG);
    const hi = floorTo(maxB(shape.g, v), opts.snapMm);
    const b = clamp(snapTo(Math.hypot(local.x, local.y), opts.snapMm), MIN_SIDE_MM, Math.max(MIN_SIDE_MM, hi));
    return { shape: { g: shape.g, b, v }, offset: none };
  }
  return { shape, offset: none };
}

/** Felter tjekkes; g, b og v klemmes, og b afkortes, så bredden holder. Ukendte felter smides væk. */
export function validateShape(raw: unknown): ParallelogramShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { g, b, v } = raw as Record<string, unknown>;
  for (const x of [g, b, v]) if (typeof x !== "number" || !Number.isFinite(x)) return null;
  const gg = clamp(g as number, MIN_SIDE_MM, MAX_SIDE_MM);
  const vv = clamp(v as number, MIN_V_DEG, MAX_V_DEG);
  return { g: gg, b: clampMax(b as number, MIN_SIDE_MM, maxB(gg, vv)), v: vv };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst, så de aldrig fortrænger en fremadregel. */
const RULES: Record<string, Rule[]> = {
  A: [{ given: ["g", "h"], rhs: "{g} · {h}", value: (v) => v.g * v.h }],
  O: [{ given: ["g", "b"], rhs: "2 · {g} + 2 · {b}", value: (v) => 2 * v.g + 2 * v.b }],
  g: [
    { given: ["A", "h"], rhs: "{A} / {h}", value: (v) => v.A / v.h },
    { given: ["O", "b"], rhs: "{O} / 2 − {b}", value: (v) => v.O / 2 - v.b },
  ],
  b: [{ given: ["O", "g"], rhs: "{O} / 2 − {g}", value: (v) => v.O / 2 - v.g }],
  h: [{ given: ["A", "g"], rhs: "{A} / {g}", value: (v) => v.A / v.g }],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/parallelogram.tsx. */
export const parallelogramSpec: FigureSpec<ParallelogramShape> = {
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
