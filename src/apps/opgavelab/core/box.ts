// Opgavelab — geometri-kerne for kassen (retvinklet prisme) i kavalerperspektiv. Formen er
// { l, b, h } i mm: l vandret, h lodret og b i dybden, tegnet halv størrelse under 45°
// (projektionen P(x, y, z) = (x + k·z·cos45°, −y − k·z·sin45°), k = 0,5 — samme som project()
// i figures/shared.tsx). Ankeret er det forreste nederste venstre hjørne.
// Tre håndtag med én frihedsgrad hver: "l" forreste nederste højre hjørne (l = x), "h" forreste
// øverste venstre hjørne (h = −y) og "b" bagerste øverste højre hjørne (pointeren projiceret på
// 45°-retningen, divideret med k). Find-reglerne (RULES) køres af core/solveKit.ts (makeSolver).
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  BoxShape,
  DragOpts,
  DragResult,
  FigureSpec,
  ParamDef,
  ParamKind,
  Point,
  Rule,
} from "../model/types";

/** Min/max for l og h i mm (1–15 cm). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;
/** Max dybde b i mm (12 cm). */
export const MAX_DEPTH_MM = 120;
/** Den tegnede kasse (forside + skrå dybde) må højst fylde så meget (mm) i hver retning. */
export const MAX_DRAWN_MM = 180;

/** Kavalerperspektivets skala for dybden (halv størrelse). */
export const DEPTH_K = 0.5;
const C45 = Math.SQRT1_2;
/** Dybden b tegnes som en forskydning på (DEPTH_XY · b, −DEPTH_XY · b) mm (≈ 0,354 · b). */
export const DEPTH_XY = DEPTH_K * C45;

export const PARAMS: ParamDef[] = [
  { key: "l", label: "Længde l", kind: "length" },
  { key: "b", label: "Bredde b", kind: "length" },
  { key: "h", label: "Højde h", kind: "length" },
  // Afledte mål: skjult som standard og står i mål-boksen under figuren, når de er synlige.
  { key: "V", label: "Rumfang V", kind: "volume", derived: true },
  { key: "O", label: "Overflade O", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { l: "length", b: "length", h: "length", V: "volume", O: "area" };

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

/** Største l eller h (mm) ved dybden b, så den tegnede kasse holder sig inden for MAX_DRAWN_MM. */
export function maxSide(b: number): number {
  return Math.min(MAX_SIDE_MM, MAX_DRAWN_MM - DEPTH_XY * b);
}

/** Største dybde b (mm) ved den største af l og h. */
export function maxDepth(lh: number): number {
  return Math.min(MAX_DEPTH_MM, (MAX_DRAWN_MM - lh) / DEPTH_XY);
}

/** Snappet og klemt til [lo, max]: over max rundes ned til et helt trin (så snap-trinnet holdes). */
function snapClamp(v: number, step: number, lo: number, max: number): number {
  const s = snapTo(v, step);
  if (s < lo) return lo;
  if (s <= max + 1e-9) return Math.min(s, max);
  const f = floorTo(max, step);
  return f < lo ? lo : f;
}

export function defaultShape(): BoxShape {
  return { l: 70, b: 40, h: 50 };
}

/** Kassens 8 hjørner i lokale mm (y nedad): f = forreste, k = bagerste; b/t = bund/top; l/r = venstre/højre. */
export function corners(shape: BoxShape) {
  const d = DEPTH_XY * shape.b;
  const { l, h } = shape;
  return {
    fbl: { x: 0, y: 0 },
    fbr: { x: l, y: 0 },
    ftr: { x: l, y: -h },
    ftl: { x: 0, y: -h },
    kbl: { x: d, y: -d },
    kbr: { x: l + d, y: -d },
    ktr: { x: l + d, y: -h - d },
    ktl: { x: d, y: -h - d },
  };
}

/** Håndtagene (nøgle = parameter): l, h og b. */
export function vertices(shape: BoxShape): Record<string, Point> {
  const c = corners(shape);
  return { l: c.fbr, h: c.ftl, b: c.ktr };
}

/** De 6 yderhjørner (klik-fladen dækker forside, top og højre side). */
export function outline(shape: BoxShape): Point[] {
  const c = corners(shape);
  return [c.fbl, c.fbr, c.kbr, c.ktr, c.ktl, c.ftl];
}

export function bounds(shape: BoxShape): Bounds {
  const d = DEPTH_XY * shape.b;
  return { minX: 0, minY: -shape.h - d, maxX: shape.l + d, maxY: 0 };
}

/** cm, uafrundet: l, b, h, rumfang V og overflade O. */
export function compute(shape: BoxShape): Record<string, number> {
  const l = shape.l / 10;
  const b = shape.b / 10;
  const h = shape.h / 10;
  return { l, b, h, V: l * b * h, O: 2 * l * b + 2 * l * h + 2 * b * h };
}

/**
 * Træk i et håndtag (én frihedsgrad hver, snappet til snapMm, klemt så den tegnede kasse er højst
 * MAX_DRAWN_MM): "l" = x, "h" = −y, "b" = pointerens afstand langs 45°-retningen fra det forreste
 * øverste højre hjørne, divideret med k. De andre mål og ankeret ændres ikke.
 */
export function dragVertex(shape: BoxShape, vertex: string, local: Point, opts: DragOpts): DragResult<BoxShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  const step = opts.snapMm;
  if (vertex === "l") return { shape: { ...shape, l: snapClamp(local.x, step, MIN_SIDE_MM, maxSide(shape.b)) }, offset: none };
  if (vertex === "h") return { shape: { ...shape, h: snapClamp(-local.y, step, MIN_SIDE_MM, maxSide(shape.b)) }, offset: none };
  if (vertex === "b") {
    const along = (local.x - shape.l) * C45 - (local.y + shape.h) * C45;
    const b = snapClamp(along / DEPTH_K, step, MIN_SIDE_MM, maxDepth(Math.max(shape.l, shape.h)));
    return { shape: { ...shape, b }, offset: none };
  }
  return { shape, offset: none };
}

export function validateShape(raw: unknown): BoxShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { l, b, h } = raw as Record<string, unknown>;
  if (typeof l !== "number" || !Number.isFinite(l)) return null;
  if (typeof b !== "number" || !Number.isFinite(b)) return null;
  if (typeof h !== "number" || !Number.isFinite(h)) return null;
  const L = clamp(l, MIN_SIDE_MM, MAX_SIDE_MM);
  const H = clamp(h, MIN_SIDE_MM, MAX_SIDE_MM);
  // Dybden klemmes, så forside + skrå dybde højst fylder MAX_DRAWN_MM.
  const B = clampMax(b, MIN_SIDE_MM, maxDepth(Math.max(L, H)));
  return { l: L, b: B, h: H };
}

// ---- Find X ----

/** Fremadregler først, de omvendte (↺) sidst. */
const RULES: Record<string, Rule[]> = {
  V: [{ given: ["l", "b", "h"], rhs: "{l} · {b} · {h}", value: (v) => v.l * v.b * v.h }],
  // Sat uden for parentes (ikke "2 · l · b + 2 · l · h + 2 · b · h"), så regnestykket med indsatte tal
  // står på én linje inden for A4-margenerne (ca. 150 mm i stedet for ca. 190 mm).
  O: [{ given: ["l", "b", "h"], rhs: "2 · ({l} · {b} + {l} · {h} + {b} · {h})", value: (v) => 2 * (v.l * v.b + v.l * v.h + v.b * v.h) }],
  h: [{ given: ["V", "l", "b"], rhs: "{V} / ({l} · {b})", value: (v) => v.V / (v.l * v.b) }],
  l: [{ given: ["V", "b", "h"], rhs: "{V} / ({b} · {h})", value: (v) => v.V / (v.b * v.h) }],
  b: [{ given: ["V", "l", "h"], rhs: "{V} / ({l} · {h})", value: (v) => v.V / (v.l * v.h) }],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/box.tsx. */
export const boxSpec: FigureSpec<BoxShape> = {
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
