// Opgavelab — geometri-kerne for cylinderen. Formen er { r, h } i mm; ankeret er centrum af
// topellipsen. Cylinderen tegnes set lidt ovenfra: topellipsen (rx = r, ry = RY_FACTOR · r, mindst
// RY_MIN) er hel, siderne lodrette, og bunden er den forreste halvbue fuld og den bagerste stiplet.
// To håndtag med én frihedsgrad hver: "r" på toppens højre rimpunkt (r = x) og "h" i bundens
// centrum (h = y). Find-reglerne (RULES) køres af core/solveKit.ts (makeSolver). π står som "π" i rhs
// og er Math.PI i udregningen, så alle π-regler giver "≈".
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type {
  Bounds,
  CylinderShape,
  DragOpts,
  DragResult,
  FigureSpec,
  ParamDef,
  ParamKind,
  Point,
  Rule,
} from "../model/types";

/** Min/max radius i mm (0,5–6 cm). */
export const MIN_R_MM = 5;
export const MAX_R_MM = 60;
/** Min/max højde i mm (1–15 cm); den tegnede cylinder (h + 2 · ry) må højst fylde MAX_DRAWN_MM. */
export const MIN_H_MM = 10;
export const MAX_H_MM = 150;
export const MAX_DRAWN_MM = 180;

/** Ellipsens halve højde: ry = max(RY_MIN, RY_FACTOR · r) mm. */
export const RY_FACTOR = 0.3;
export const RY_MIN = 2;

/** Antal punkter pr. ellipsebue i klik-polygonen (2 × 8 = 16 hjørner). */
export const ARC_POINTS = 8;

export const PARAMS: ParamDef[] = [
  { key: "r", label: "Radius r", kind: "length" },
  // Afledte mål: skjult som standard; d tegnes som stiplet diameter gennem toppen, de øvrige i mål-boksen.
  { key: "d", label: "Diameter d", kind: "length", derived: true },
  { key: "h", label: "Højde h", kind: "length" },
  { key: "V", label: "Rumfang V", kind: "volume", derived: true },
  { key: "M", label: "Krum flade M", kind: "area", derived: true },
  { key: "O", label: "Overflade O", kind: "area", derived: true },
];

const KIND: Record<string, ParamKind> = { r: "length", d: "length", h: "length", V: "volume", M: "area", O: "area" };

const clamp = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x);

/** clamp(x, lo, max), men en værdi højst 5e-10 mm over max (flydende-tals-støj) bevares uændret. */
const clampMax = (x: number, lo: number, max: number) => (x < lo ? lo : x <= max + 5e-10 ? x : Math.max(lo, max));

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

function floorTo(v: number, step: number): number {
  return step > 0 ? Math.floor(v / step + 1e-9) * step : v;
}

/** Ellipsernes halve højde (mm) ved radius r. */
export function ellipseRy(r: number): number {
  return Math.max(RY_MIN, RY_FACTOR * r);
}

/** Største højde h (mm) ved radius r, så den tegnede cylinder holder sig inden for MAX_DRAWN_MM. */
export function maxHeight(r: number): number {
  return Math.min(MAX_H_MM, MAX_DRAWN_MM - 2 * ellipseRy(r));
}

/** Største radius r (mm) ved højde h. */
export function maxRadius(h: number): number {
  // ry = max(RY_MIN, RY_FACTOR · r): h + 2 · RY_FACTOR · r ≤ MAX_DRAWN_MM (RY_MIN gælder kun for små r).
  return Math.min(MAX_R_MM, (MAX_DRAWN_MM - h) / (2 * RY_FACTOR));
}

/** Snappet og klemt til [lo, max]: over max rundes ned til et helt trin (så snap-trinnet holdes). */
function snapClamp(v: number, step: number, lo: number, max: number): number {
  const s = snapTo(v, step);
  if (s < lo) return lo;
  if (s <= max + 1e-9) return Math.min(s, max);
  const f = floorTo(max, step);
  return f < lo ? lo : f;
}

export function defaultShape(): CylinderShape {
  return { r: 25, h: 60 };
}

/** Håndtagene (nøgle = parameter): r på toppens højre rimpunkt, h i bundens centrum. */
export function vertices(shape: CylinderShape): Record<string, Point> {
  return { r: { x: shape.r, y: 0 }, h: { x: 0, y: shape.h } };
}

/** Klik-fladen (16 punkter): toppens bagerste halvbue, højre side, bundens forreste halvbue, venstre side. */
export function outline(shape: CylinderShape): Point[] {
  const { r, h } = shape;
  const ry = ellipseRy(r);
  const pts: Point[] = [];
  for (let i = 0; i < ARC_POINTS; i++) {
    const t = Math.PI * (1 - i / (ARC_POINTS - 1));
    pts.push({ x: r * Math.cos(t), y: -ry * Math.sin(t) });
  }
  for (let i = 0; i < ARC_POINTS; i++) {
    const t = (Math.PI * i) / (ARC_POINTS - 1);
    pts.push({ x: r * Math.cos(t), y: h + ry * Math.sin(t) });
  }
  return pts;
}

export function bounds(shape: CylinderShape): Bounds {
  const ry = ellipseRy(shape.r);
  return { minX: -shape.r, minY: -ry, maxX: shape.r, maxY: shape.h + ry };
}

/** cm, uafrundet: radius r, diameter d, højde h, rumfang V, krum flade M og overflade O. */
export function compute(shape: CylinderShape): Record<string, number> {
  const r = shape.r / 10;
  const h = shape.h / 10;
  return {
    r,
    d: 2 * r,
    h,
    V: Math.PI * r * r * h,
    M: 2 * Math.PI * r * h,
    O: 2 * Math.PI * r * r + 2 * Math.PI * r * h,
  };
}

/**
 * Træk i et håndtag (én frihedsgrad hver, snappet til snapMm, klemt så den tegnede cylinder er
 * højst MAX_DRAWN_MM høj): "r" = x, "h" = y. Det andet mål og ankeret ændres ikke.
 */
export function dragVertex(shape: CylinderShape, vertex: string, local: Point, opts: DragOpts): DragResult<CylinderShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  const step = opts.snapMm;
  if (vertex === "r") return { shape: { ...shape, r: snapClamp(local.x, step, MIN_R_MM, maxRadius(shape.h)) }, offset: none };
  if (vertex === "h") return { shape: { ...shape, h: snapClamp(local.y, step, MIN_H_MM, maxHeight(shape.r)) }, offset: none };
  return { shape, offset: none };
}

export function validateShape(raw: unknown): CylinderShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { r, h } = raw as Record<string, unknown>;
  if (typeof r !== "number" || !Number.isFinite(r)) return null;
  if (typeof h !== "number" || !Number.isFinite(h)) return null;
  const R = clamp(r, MIN_R_MM, MAX_R_MM);
  // Højden klemmes, så topellipse + sider + bundellipse højst fylder MAX_DRAWN_MM.
  const H = clampMax(h, MIN_H_MM, maxHeight(R));
  return { r: R, h: H };
}

// ---- Find X ----

/**
 * Fremadregler først, de omvendte (↺) sidst. Alle π-regler er irrationelle → "≈".
 * O er sat uden for parentes (2 · π · r · (r + h)), så regnestykket med indsatte tal står på én
 * linje inden for A4-margenerne; det er matematisk ækvivalent med 2 · π · r² + 2 · π · r · h.
 */
const RULES: Record<string, Rule[]> = {
  V: [
    { given: ["r", "h"], rhs: "π · {r}² · {h}", value: (v) => Math.PI * v.r * v.r * v.h },
    { given: ["d", "h"], rhs: "π · ({d} / 2)² · {h}", value: (v) => Math.PI * (v.d / 2) * (v.d / 2) * v.h },
  ],
  M: [{ given: ["r", "h"], rhs: "2 · π · {r} · {h}", value: (v) => 2 * Math.PI * v.r * v.h }],
  O: [{ given: ["r", "h"], rhs: "2 · π · {r} · ({r} + {h})", value: (v) => 2 * Math.PI * v.r * (v.r + v.h) }],
  d: [{ given: ["r"], rhs: "2 · {r}", value: (v) => 2 * v.r }],
  r: [
    { given: ["d"], rhs: "{d} / 2", value: (v) => v.d / 2 },
    { given: ["V", "h"], rhs: "√({V} / (π · {h}))", value: (v) => Math.sqrt(Math.max(0, v.V / (Math.PI * v.h))) },
  ],
  h: [{ given: ["V", "r"], rhs: "{V} / (π · {r}²)", value: (v) => v.V / (Math.PI * v.r * v.r) }],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/cylinder.tsx. */
export const cylinderSpec: FigureSpec<CylinderShape> = {
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
