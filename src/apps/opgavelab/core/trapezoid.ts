// Opgavelab — geometri-kerne for trapezet. Formen er { a, b, h, off } i mm: a nederst, b øverst
// (begge vandrette), højden h og forskydningen off af øverste venstre hjørne i forhold til nederste
// venstre (ankeret). Benene c (venstre) og d (højre) er afledte og har ingen Find-regel.
// Tre håndtag: "a" (nederste højre: a = x), "b" (øverste højre: b = x − off) og "h" (øverste venstre:
// h = −y og off = x). Find-reglerne (RULES) kører i core/solveKit.ts.
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
  TrapezoidShape,
} from "../model/types";

/** Min/max side og højde i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;
/** Figurens bredde må højst være så meget (mm), så den og dens etiketter står på A4. */
export const MAX_WIDTH_MM = 160;

export const NO_FIND_LEG =
  "Benene c og d kan ikke findes med et regnestykke — længden afhænger af både højden og forskydningen (Pythagoras). Sæt flueben ved Vis, hvis de skal stå på figuren.";

export const PARAMS: ParamDef[] = [
  { key: "a", label: "Grundlinje a", kind: "length" },
  { key: "b", label: "Overside b", kind: "length" },
  { key: "h", label: "Højde h", kind: "length" },
  // Afledte mål: skjult som standard. c og d tegnes ved benene, O og A i mål-boksen.
  { key: "c", label: "Venstre ben c", kind: "length", derived: true, noFind: NO_FIND_LEG },
  { key: "d", label: "Højre ben d", kind: "length", derived: true, noFind: NO_FIND_LEG },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
  { key: "A", label: "Areal A", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { a: "length", b: "length", h: "length", c: "length", d: "length", O: "length", A: "area" };

const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

/** Rund ned til et helt trin (snap), ellers uændret. */
function floorTo(v: number, step: number): number {
  return step > 0 ? Math.floor(v / step + 1e-9) * step : v;
}

/** Tilladt interval for forskydningen: |off| ≤ a, og bredden (max(a, off + b) − min(0, off)) ≤ MAX_WIDTH_MM. */
export function offRange(a: number, b: number): { lo: number; hi: number } {
  return { lo: Math.max(-a, a - MAX_WIDTH_MM), hi: Math.min(a, MAX_WIDTH_MM - b) };
}

/** off klemt til offRange; en værdi højst 5e-10 mm uden for (flydende-tals-støj) bevares uændret. */
function clampOff(off: number, a: number, b: number): number {
  const { lo, hi } = offRange(a, b);
  return off < lo ? (off >= lo - 5e-10 ? off : lo) : off > hi ? (off <= hi + 5e-10 ? off : hi) : off;
}

export function defaultShape(): TrapezoidShape {
  return { a: 90, b: 50, h: 45, off: 20 };
}

/** De fire hjørner (lokale mm, y nedad): nederste venstre = ankeret. */
export function corners(shape: TrapezoidShape): { bl: Point; br: Point; tl: Point; tr: Point } {
  return {
    bl: { x: 0, y: 0 },
    br: { x: shape.a, y: 0 },
    tl: { x: shape.off, y: -shape.h },
    tr: { x: shape.off + shape.b, y: -shape.h },
  };
}

/** Håndtagene: "a" nederst til højre, "b" øverst til højre, "h" øverst til venstre (h og forskydning). */
export function vertices(shape: TrapezoidShape): Record<string, Point> {
  const c = corners(shape);
  return { a: c.br, b: c.tr, h: c.tl };
}

/** Klik-fladen: de fire hjørner. */
export function outline(shape: TrapezoidShape): Point[] {
  const c = corners(shape);
  return [c.bl, c.br, c.tr, c.tl];
}

export function bounds(shape: TrapezoidShape): Bounds {
  return {
    minX: Math.min(0, shape.off),
    minY: -shape.h,
    maxX: Math.max(shape.a, shape.off + shape.b),
    maxY: 0,
  };
}

/**
 * Den lodrette højde: x for linjen fra den øverste side ned til grundlinjens linje. Helst under
 * øverste venstre hjørne, ellers under øverste højre, ellers (oversiden dækker grundlinjen) ved
 * nederste venstre hjørne. `onBase`: fodpunktet ligger på selve a (ellers forlænges a stiplet).
 */
export function heightX(shape: TrapezoidShape): { x: number; onBase: boolean } {
  const { a, b, off } = shape;
  const within = (x: number) => x >= -1e-6 && x <= a + 1e-6;
  if (within(off)) return { x: off, onBase: true };
  if (within(off + b)) return { x: off + b, onBase: true };
  if (off < 0 && off + b > a) return { x: 0, onBase: true };
  return { x: off + b, onBase: false };
}

/** cm, uafrundet: a, b, h, benene c (venstre) og d (højre), omkreds O og areal A = ½ · h · (a + b). */
export function compute(shape: TrapezoidShape): Record<string, number> {
  const a = shape.a / 10;
  const b = shape.b / 10;
  const h = shape.h / 10;
  const c = Math.hypot(shape.off, shape.h) / 10;
  const d = Math.hypot(shape.a - shape.off - shape.b, shape.h) / 10;
  return { a, b, h, c, d, O: a + b + c + d, A: (h * (a + b)) / 2 };
}

/**
 * Træk i "a": a = x (snappet; mindst |off|, så |off| ≤ a), "b": b = x − off, "h": h = −y og off = x
 * (snappet; off klemt så |off| ≤ a og bredden holder). De øvrige mål står fast; ankeret flyttes aldrig.
 */
export function dragVertex(shape: TrapezoidShape, vertex: string, local: Point, opts: DragOpts): DragResult<TrapezoidShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  const { a, b, off } = shape;
  const snap = opts.snapMm;
  if (vertex === "a") {
    const lo = Math.max(MIN_SIDE_MM, Math.abs(off));
    const hi = Math.min(MAX_SIDE_MM, floorTo(off < 0 ? MAX_WIDTH_MM + off : MAX_WIDTH_MM, snap));
    return { shape: { ...shape, a: clamp(snapTo(local.x, snap), lo, Math.max(lo, hi)) }, offset: none };
  }
  if (vertex === "b") {
    const hi = Math.min(MAX_SIDE_MM, floorTo(off >= 0 ? MAX_WIDTH_MM - off : MAX_WIDTH_MM, snap));
    return { shape: { ...shape, b: clamp(snapTo(local.x - off, snap), MIN_SIDE_MM, Math.max(MIN_SIDE_MM, hi)) }, offset: none };
  }
  if (vertex === "h") {
    return {
      shape: { ...shape, h: clamp(snapTo(-local.y, snap), MIN_SIDE_MM, MAX_SIDE_MM), off: clampOff(snapTo(local.x, snap), a, b) },
      offset: none,
    };
  }
  return { shape, offset: none };
}

/** Felter tjekkes; a, b og h klemmes til 1–15 cm, og forskydningen klemmes (se offRange). Ukendte felter smides væk. */
export function validateShape(raw: unknown): TrapezoidShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { a, b, h, off } = raw as Record<string, unknown>;
  for (const x of [a, b, h, off]) if (typeof x !== "number" || !Number.isFinite(x)) return null;
  const aa = clamp(a as number, MIN_SIDE_MM, MAX_SIDE_MM);
  const bb = clamp(b as number, MIN_SIDE_MM, MAX_SIDE_MM);
  return { a: aa, b: bb, h: clamp(h as number, MIN_SIDE_MM, MAX_SIDE_MM), off: clampOff(off as number, aa, bb) };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. c og d har ingen regler (kan ikke findes). */
const RULES: Record<string, Rule[]> = {
  A: [{ given: ["a", "b", "h"], rhs: "½ · {h} · ({a} + {b})", value: (v) => 0.5 * v.h * (v.a + v.b) }],
  O: [{ given: ["a", "b", "c", "d"], rhs: "{a} + {b} + {c} + {d}", value: (v) => v.a + v.b + v.c + v.d }],
  h: [{ given: ["A", "a", "b"], rhs: "2 · {A} / ({a} + {b})", value: (v) => (2 * v.A) / (v.a + v.b) }],
  a: [{ given: ["A", "b", "h"], rhs: "2 · {A} / {h} − {b}", value: (v) => (2 * v.A) / v.h - v.b }],
  b: [{ given: ["A", "a", "h"], rhs: "2 · {A} / {h} − {a}", value: (v) => (2 * v.A) / v.h - v.a }],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/trapezoid.tsx. */
export const trapezoidSpec: FigureSpec<TrapezoidShape> = {
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
