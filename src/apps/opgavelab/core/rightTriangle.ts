// Opgavelab — geometri-kerne for den retvinklede trekant (dansk notation).
// C = 90°, c er hypotenusen, a = BC (modstående A), b = AC (modstående B).
// Formen gemmes som { a, b, rotation, mirror } med C som anker, så C altid er
// præcis 90°. Geometrien regnes uafrundet; Find-reglerne (RULES) køres af den generiske
// motor i core/solveKit.ts (makeSolver), der regner facit på de viste (afrundede) tal.
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
  RightTriangleShape,
  Rule,
} from "../model/types";

/** Min/max katetelængde i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;

const RAD = Math.PI / 180;
const EPS = 1e-9;

export const PARAMS: ParamDef[] = [
  { key: "a", label: "Side a", kind: "length" },
  { key: "b", label: "Side b", kind: "length" },
  { key: "c", label: "Side c", kind: "length" },
  { key: "A", label: "Vinkel A", kind: "angle" },
  { key: "B", label: "Vinkel B", kind: "angle" },
  { key: "C", label: "Vinkel C", kind: "angle" },
  // Afledte mål: skjult som standard (gamle dokumenter ser ens ud), tegnes under figuren når de vises.
  { key: "T", label: "Areal T", kind: "area", derived: true },
  { key: "O", label: "Omkreds O", kind: "length", derived: true },
];

const KIND: Record<string, ParamKind> = {
  a: "length",
  b: "length",
  c: "length",
  A: "angle",
  B: "angle",
  C: "angle",
  T: "area",
  O: "length",
};

// ---- små hjælpere (lokale kopier; core-filer må ikke importere runtime fra hinanden) ----

function clampSide(v: number): number {
  return v < MIN_SIDE_MM ? MIN_SIDE_MM : v > MAX_SIDE_MM ? MAX_SIDE_MM : v;
}

function snapTo(v: number, step: number): number {
  return step > 0 ? Math.round(v / step) * step : v;
}

/** Grader normaliseret til (−180, 180]. */
export function normDeg(deg: number): number {
  let r = (((deg + 180) % 360) + 360) % 360 - 180;
  if (r === -180) r = 180;
  return r === 0 ? 0 : r; // ingen −0
}

function sub(p: Point, q: Point): Point {
  return { x: p.x - q.x, y: p.y - q.y };
}

function len(p: Point): number {
  return Math.hypot(p.x, p.y);
}

/** Enhedsnormal til CB i den retning, A ligger når mirror = false. */
function normal(rotationDeg: number): Point {
  const r = rotationDeg * RAD;
  return { x: -Math.sin(r), y: Math.cos(r) };
}

// ---- form ----

export function defaultShape(): RightTriangleShape {
  // A lodret over C, B vandret til højre for C (klassisk tegning), 4 × 3 cm.
  return { a: 40, b: 30, rotation: 0, mirror: true };
}

export function vertices(shape: RightTriangleShape): Record<"A" | "B" | "C", Point> {
  const r = shape.rotation * RAD;
  const s = shape.mirror ? -1 : 1;
  return {
    C: { x: 0, y: 0 },
    B: { x: shape.a * Math.cos(r), y: shape.a * Math.sin(r) },
    A: { x: -shape.b * Math.sin(r) * s, y: shape.b * Math.cos(r) * s },
  };
}

export function bounds(shape: RightTriangleShape): Bounds {
  const v = vertices(shape);
  const xs = [v.A.x, v.B.x, v.C.x];
  const ys = [v.A.y, v.B.y, v.C.y];
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/** Sider i cm, vinkler i grader, areal T i cm² og omkreds O i cm, uafrundet. */
export function compute(shape: RightTriangleShape): Record<string, number> {
  const a = shape.a / 10;
  const b = shape.b / 10;
  const A = Math.atan2(a, b) / RAD;
  return { a, b, c: Math.hypot(a, b), A, B: 90 - A, C: 90, T: (a * b) / 2, O: a + b + Math.hypot(a, b) };
}

// ---- hjørnetræk ----

/**
 * Træk i et hjørne. `local` er pointeren relativt til ankeret (C) ved trækkets
 * start, og `shape` er formen ved trækkets start.
 * - B: a = |p| (snappet, clampet), rotation = retningen C→p (evt. vinkelsnap).
 * - A: b = |projektionen af p på normalen til CB|; skifter projektionen fortegn, spejles figuren.
 * - C: C projiceres på Thales-cirklen over AB (90° bevares). Kateterne holdes inden for
 *   min/max ved at standse C på cirklen. Med snap (snapMm > 0 og ikke `free`) rundes de til
 *   hele mm (c ændres ≤ ~0,7 mm; AB beholder midtpunkt og retning); fri: c bevares præcist.
 *   Ankeret flyttes (offset).
 */
export function dragVertex(
  shape: RightTriangleShape,
  vertex: string,
  local: Point,
  opts: DragOpts,
): DragResult<RightTriangleShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };

  if (vertex === "B") {
    const d = len(local);
    const a = clampSide(snapTo(d, opts.snapMm));
    let rotation = d > EPS ? Math.atan2(local.y, local.x) / RAD : shape.rotation;
    if (opts.snapDeg) rotation = snapTo(rotation, opts.degStep && opts.degStep > 0 ? opts.degStep : 1);
    return { shape: { ...shape, a, rotation: normDeg(rotation) }, offset: none };
  }

  if (vertex === "A") {
    const n = normal(shape.rotation);
    const t = local.x * n.x + local.y * n.y;
    const mirror = t < 0 ? true : t > 0 ? false : shape.mirror;
    const b = clampSide(snapTo(Math.abs(t), opts.snapMm));
    return { shape: { ...shape, b, mirror }, offset: none };
  }

  if (vertex === "C") {
    const v = vertices(shape);
    const ab = sub(v.B, v.A);
    const c = len(ab);
    const m = { x: (v.A.x + v.B.x) / 2, y: (v.A.y + v.B.y) / 2 };
    const d = sub(local, m);
    const dl = len(d);
    if (dl < EPS || c < EPS) return { shape, offset: none };
    // Projektion på Thales-cirklen giver de rå kateter.
    const proj = { x: m.x + (d.x * c) / 2 / dl, y: m.y + (d.y * c) / 2 / dl };
    let a = len(sub(v.B, proj));
    // Hold kateterne inden for grænserne (C standser på cirklen).
    if (a < MIN_SIDE_MM) a = MIN_SIDE_MM;
    else if (a > MAX_SIDE_MM) a = MAX_SIDE_MM;
    let b = Math.sqrt(Math.max(0, c * c - a * a));
    if (b < MIN_SIDE_MM) {
      b = MIN_SIDE_MM;
      a = Math.sqrt(Math.max(0, c * c - b * b));
    } else if (b > MAX_SIDE_MM) {
      b = MAX_SIDE_MM;
      a = Math.sqrt(Math.max(0, c * c - b * b));
    }
    if (a < MIN_SIDE_MM - EPS || a > MAX_SIDE_MM + EPS || b < MIN_SIDE_MM - EPS || b > MAX_SIDE_MM + EPS) {
      return { shape, offset: none }; // umuligt inden for grænserne: afvis trækket
    }
    // Med snap: hele mm, så de viste sidelængder er eksakte: af de (op til) fire kombinationer
    // af op-/nedrunding vælges den, hvis hypotenuse ligger tættest på c. c ændres derfor
    // højst ca. 0,7 mm, og A og B flytter sig højst det halve langs AB. Fri: ingen afrunding.
    const snapWhole = opts.snapMm > 0 && !opts.free;
    if (snapWhole) {
      let best: { a: number; b: number; dc: number } | null = null;
      for (const ra of [Math.floor(a + EPS), Math.ceil(a - EPS)]) {
        for (const rb of [Math.floor(b + EPS), Math.ceil(b - EPS)]) {
          if (ra < MIN_SIDE_MM || ra > MAX_SIDE_MM || rb < MIN_SIDE_MM || rb > MAX_SIDE_MM) continue;
          const dc = Math.abs(Math.hypot(ra, rb) - c);
          if (!best || dc < best.dc - EPS) best = { a: ra, b: rb, dc };
        }
      }
      if (best) {
        a = best.a;
        b = best.b;
      }
    }
    // AB beholder midtpunkt og retning; A' og B' ligger c'/2 fra midtpunktet.
    const c2 = Math.hypot(a, b);
    const u = { x: ab.x / c, y: ab.y / c };
    const w = { x: -u.y, y: u.x };
    const A2 = { x: m.x - (u.x * c2) / 2, y: m.y - (u.y * c2) / 2 };
    // Placér C' med |A'C'| = b og |B'C'| = a på den side af AB, hvor pointeren er.
    const side = (local.x - v.A.x) * w.x + (local.y - v.A.y) * w.y;
    const oldSide = (0 - v.A.x) * w.x + (0 - v.A.y) * w.y;
    const s = side > 0 ? 1 : side < 0 ? -1 : oldSide >= 0 ? 1 : -1;
    const along = (b * b) / c2;
    const perp = (a * b) / c2;
    const cNew = { x: A2.x + u.x * along + w.x * s * perp, y: A2.y + u.y * along + w.y * s * perp };
    const B2 = { x: m.x + (u.x * c2) / 2, y: m.y + (u.y * c2) / 2 };
    const toB = sub(B2, cNew);
    const rotation = normDeg(Math.atan2(toB.y, toB.x) / RAD);
    const toA = sub(A2, cNew);
    const n = normal(rotation);
    const mirror = toA.x * n.x + toA.y * n.y < 0;
    return { shape: { a, b, rotation, mirror }, offset: cNew };
  }

  return { shape, offset: none };
}

export function validateShape(raw: unknown): RightTriangleShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const { a, b, rotation, mirror } = r;
  if (typeof a !== "number" || !Number.isFinite(a)) return null;
  if (typeof b !== "number" || !Number.isFinite(b)) return null;
  if (typeof rotation !== "number" || !Number.isFinite(rotation)) return null;
  if (typeof mirror !== "boolean") return null;
  return { a: clampSide(a), b: clampSide(b), rotation: normDeg(rotation), mirror };
}

// ---- Find X ----

const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);
const tan = (deg: number) => Math.tan(deg * RAD);
const unit = (x: number) => (x < -1 ? -1 : x > 1 ? 1 : x);
const deg = (rad: number) => rad / RAD;

/**
 * Regeltabel i prioriteret rækkefølge (første inden for tolerancen vinder; ellers den tætteste, ved uafgjort den første).
 * De omvendte regler (a/b ud fra T, c ud fra O) står sidst, så de aldrig fortrænger en regel, der gjaldt før T og O fandtes.
 */
const RULES: Record<string, Rule[]> = {
  c: [
    { given: ["a", "b"], rhs: "√({a}² + {b}²)", value: (v) => Math.hypot(v.a, v.b) },
    { given: ["A", "a"], rhs: "{a} / sin {A}", value: (v) => v.a / sin(v.A) },
    { given: ["A", "b"], rhs: "{b} / cos {A}", value: (v) => v.b / cos(v.A) },
    { given: ["B", "b"], rhs: "{b} / sin {B}", value: (v) => v.b / sin(v.B) },
    { given: ["B", "a"], rhs: "{a} / cos {B}", value: (v) => v.a / cos(v.B) },
    // Omvendt (sidst): c ud fra omkredsen.
    { given: ["O", "a", "b"], rhs: "{O} − {a} − {b}", value: (v) => v.O - v.a - v.b },
  ],
  a: [
    { given: ["b", "c"], rhs: "√({c}² − {b}²)", value: (v) => Math.sqrt(Math.max(0, v.c * v.c - v.b * v.b)) },
    { given: ["A", "c"], rhs: "{c} · sin {A}", value: (v) => v.c * sin(v.A) },
    { given: ["A", "b"], rhs: "{b} · tan {A}", value: (v) => v.b * tan(v.A) },
    { given: ["B", "c"], rhs: "{c} · cos {B}", value: (v) => v.c * cos(v.B) },
    { given: ["B", "b"], rhs: "{b} / tan {B}", value: (v) => v.b / tan(v.B) },
    // Omvendt (sidst): a ud fra arealet.
    { given: ["T", "b"], rhs: "2 · {T} / {b}", value: (v) => (2 * v.T) / v.b },
  ],
  b: [
    { given: ["a", "c"], rhs: "√({c}² − {a}²)", value: (v) => Math.sqrt(Math.max(0, v.c * v.c - v.a * v.a)) },
    { given: ["A", "c"], rhs: "{c} · cos {A}", value: (v) => v.c * cos(v.A) },
    { given: ["A", "a"], rhs: "{a} / tan {A}", value: (v) => v.a / tan(v.A) },
    { given: ["B", "c"], rhs: "{c} · sin {B}", value: (v) => v.c * sin(v.B) },
    { given: ["B", "a"], rhs: "{a} · tan {B}", value: (v) => v.a * tan(v.B) },
    // Omvendt (sidst): b ud fra arealet.
    { given: ["T", "a"], rhs: "2 · {T} / {a}", value: (v) => (2 * v.T) / v.a },
  ],
  A: [
    { given: ["B", "C"], rhs: "180° − {B} − {C}", value: (v) => 180 - v.B - v.C },
    { given: ["a", "b"], rhs: "{inv:tan}({a}/{b})", value: (v) => deg(Math.atan2(v.a, v.b)) },
    { given: ["a", "c"], rhs: "{inv:sin}({a}/{c})", value: (v) => deg(Math.asin(unit(v.a / v.c))) },
    { given: ["b", "c"], rhs: "{inv:cos}({b}/{c})", value: (v) => deg(Math.acos(unit(v.b / v.c))) },
  ],
  B: [
    { given: ["A", "C"], rhs: "180° − {A} − {C}", value: (v) => 180 - v.A - v.C },
    { given: ["b", "a"], rhs: "{inv:tan}({b}/{a})", value: (v) => deg(Math.atan2(v.b, v.a)) },
    { given: ["b", "c"], rhs: "{inv:sin}({b}/{c})", value: (v) => deg(Math.asin(unit(v.b / v.c))) },
    { given: ["a", "c"], rhs: "{inv:cos}({a}/{c})", value: (v) => deg(Math.acos(unit(v.a / v.c))) },
  ],
  C: [{ given: ["A", "B"], rhs: "180° − {A} − {B}", value: (v) => 180 - v.A - v.B }],
  T: [{ given: ["a", "b"], rhs: "½ · {a} · {b}", value: (v) => 0.5 * v.a * v.b }],
  O: [{ given: ["a", "b", "c"], rhs: "{a} + {b} + {c}", value: (v) => v.a + v.b + v.c }],
};

/**
 * Geometri + regeldata for figurens FigureDef. solve/solvableFrom laves af makeSolver
 * (core/solveKit.ts) i figures/rightTriangle.tsx; tegning, etiketter og ikon står også dér.
 * C er fast 90° (kendt i en regel kun når C er synlig — retvinkelmarkeringen tegnes kun da).
 */
export const rightTriangleSpec: FigureSpec<RightTriangleShape> = {
  params: PARAMS,
  defaultShape,
  vertices,
  compute,
  dragVertex,
  validateShape,
  bounds,
  kinds: KIND,
  rules: RULES,
  fixed: { C: 90 },
};
