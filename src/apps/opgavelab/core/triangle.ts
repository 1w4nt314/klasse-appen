// Opgavelab — geometri-kerne for den frie trekant (dansk notation): a = BC (modstående A),
// b = AC (modstående B), c = AB (modstående C). Formen gemmes som de tre sider (SSS) i mm +
// rotation og spejling, med A som anker. Hjørnet C og vinklerne regnes internt ud fra siderne
// (cosinusrelationen), men Find-reglerne (RULES) er kun folkeskoleregler: vinkelsum,
// T = ½ · g · h, O = a + b + c og de enkle omvendte — ingen sinus/cosinus i nogen formel.
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
  TriangleShape,
} from "../model/types";

/** Min/max sidelængde i mm (= LIMITS.sideMinCm/sideMaxCm · 10). */
export const MIN_SIDE_MM = 10;
export const MAX_SIDE_MM = 150;
/** To sider skal tilsammen være mindst så meget længere end den tredje (mm), ellers er trekanten for flad. */
export const INEQ_SLACK_MM = 3;
/** Mindste tilladte vinkel i grader. */
export const MIN_ANGLE_DEG = 8;

const RAD = Math.PI / 180;
const EPS = 1e-9;

export const PARAMS: ParamDef[] = [
  { key: "a", label: "Side a", kind: "length" },
  { key: "b", label: "Side b", kind: "length" },
  { key: "c", label: "Side c", kind: "length" },
  { key: "A", label: "Vinkel A", kind: "angle" },
  { key: "B", label: "Vinkel B", kind: "angle" },
  { key: "C", label: "Vinkel C", kind: "angle" },
  // Afledte mål: skjult som standard. h tegnes stiplet fra C vinkelret på c, når den er synlig.
  { key: "h", label: "Højde h", kind: "length", derived: true },
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
  h: "length",
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

const sub = (p: Point, q: Point): Point => ({ x: p.x - q.x, y: p.y - q.y });
const len = (p: Point) => Math.hypot(p.x, p.y);
const cross = (p: Point, q: Point) => p.x * q.y - p.y * q.x;
const unitClamp = (x: number) => (x < -1 ? -1 : x > 1 ? 1 : x);

/** Vinklen (grader) over for siden `opp` i en trekant med siderne opp, s, t (cosinusrelationen, kun internt). */
function angleOpposite(opp: number, s: number, t: number): number {
  return Math.acos(unitClamp((s * s + t * t - opp * opp) / (2 * s * t))) / RAD;
}

/**
 * Kan siderne (mm) danne en gyldig trekant? Alle sider inden for grænserne, to sider tilsammen
 * mere end INEQ_SLACK_MM længere end den tredje, og ingen vinkel under MIN_ANGLE_DEG.
 */
export function isValidSides(a: number, b: number, c: number): boolean {
  for (const s of [a, b, c]) {
    if (!Number.isFinite(s) || s < MIN_SIDE_MM - EPS || s > MAX_SIDE_MM + EPS) return false;
  }
  if (a + b - c <= INEQ_SLACK_MM || a + c - b <= INEQ_SLACK_MM || b + c - a <= INEQ_SLACK_MM) return false;
  return Math.min(angleOpposite(a, b, c), angleOpposite(b, a, c), angleOpposite(c, a, b)) >= MIN_ANGLE_DEG - EPS;
}

// ---- form ----

export function defaultShape(): TriangleShape {
  // c vandret med A til venstre og C over AB: spids trekant, 9 × 6 × 7 cm.
  return { a: 70, b: 60, c: 90, rotation: 0, mirror: false };
}

/**
 * Punktet X med |XP| = dp og |XQ| = dq på den side af linjen PQ, som `side` angiver
 * (+1: venstre for P→Q i formlen cross(Q − P, X − P) > 0, −1: højre). null hvis cirklerne ikke skærer.
 */
function intersect(p: Point, q: Point, dp: number, dq: number, side: number): Point | null {
  const pq = sub(q, p);
  const d = len(pq);
  if (d < EPS) return null;
  const u = { x: pq.x / d, y: pq.y / d };
  const along = (dp * dp + d * d - dq * dq) / (2 * d);
  const h2 = dp * dp - along * along;
  if (!(h2 >= -EPS)) return null;
  const perp = Math.sqrt(Math.max(0, h2)) * (side < 0 ? -1 : 1);
  // cross(u, w) = 1 for w = (−u.y, u.x).
  return { x: p.x + u.x * along - u.y * perp, y: p.y + u.y * along + u.x * perp };
}

export function vertices(shape: TriangleShape): Record<"A" | "B" | "C", Point> {
  const r = shape.rotation * RAD;
  const A = { x: 0, y: 0 };
  const B = { x: shape.c * Math.cos(r), y: shape.c * Math.sin(r) };
  // mirror = false: C ligger til venstre for A→B, dvs. cross(B − A, C − A) < 0 i SVG (y nedad).
  const C = intersect(A, B, shape.b, shape.a, shape.mirror ? 1 : -1) ?? { x: B.x / 2, y: B.y / 2 };
  return { A, B, C };
}

/** Klik-fladen: de tre hjørner. */
export function outline(shape: TriangleShape): Point[] {
  const v = vertices(shape);
  return [v.A, v.B, v.C];
}

export function bounds(shape: TriangleShape): Bounds {
  const v = vertices(shape);
  const xs = [v.A.x, v.B.x, v.C.x];
  const ys = [v.A.y, v.B.y, v.C.y];
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/**
 * Højdens fodpunkt H (lokale mm): C projiceret vinkelret på linjen AB, og `t` = AH / AB
 * (0–1: fodpunktet ligger på c; udenfor: på forlængelsen).
 */
export function heightFoot(shape: TriangleShape): { H: Point; t: number } {
  const v = vertices(shape);
  const ab = sub(v.B, v.A);
  const t = (sub(v.C, v.A).x * ab.x + sub(v.C, v.A).y * ab.y) / (ab.x * ab.x + ab.y * ab.y);
  return { H: { x: v.A.x + ab.x * t, y: v.A.y + ab.y * t }, t };
}

/** Sider i cm, vinkler i grader, højden h (fra C på c) og omkreds O i cm, areal T i cm², uafrundet. */
export function compute(shape: TriangleShape): Record<string, number> {
  const a = shape.a / 10;
  const b = shape.b / 10;
  const c = shape.c / 10;
  const v = vertices(shape);
  const h = Math.abs(cross(sub(v.B, v.A), sub(v.C, v.A))) / shape.c / 10;
  return {
    a,
    b,
    c,
    A: angleOpposite(a, b, c),
    B: angleOpposite(b, a, c),
    C: angleOpposite(c, a, b),
    h,
    T: (c * h) / 2,
    O: a + b + c,
  };
}

// ---- hjørnetræk ----

type Corner = "A" | "B" | "C";

/** Formen, hvis hjørnet trækkes til `p` (begge tilstødende sider snappet), eller null hvis den er ugyldig. */
function attempt(shape: TriangleShape, v: Record<Corner, Point>, vertex: Corner, p: Point, opts: DragOpts): DragResult<TriangleShape> | null {
  const none = { x: 0, y: 0 };
  // Hjørnet trækkes; de to andre (P og Q) står fast. Den side, der IKKE rører hjørnet, er uændret.
  const [P, Q] = vertex === "A" ? (["B", "C"] as const) : vertex === "B" ? (["A", "C"] as const) : (["A", "B"] as const);
  const dP = snapTo(len(sub(p, v[P])), opts.snapMm);
  const dQ = snapTo(len(sub(p, v[Q])), opts.snapMm);
  const sides = { a: shape.a, b: shape.b, c: shape.c };
  // Siden mellem hjørnet og P / Q.
  const sideTo = (other: Corner): "a" | "b" | "c" =>
    vertex === "A" ? (other === "B" ? "c" : "b") : vertex === "B" ? (other === "A" ? "c" : "a") : other === "A" ? "b" : "a";
  sides[sideTo(P)] = dP;
  sides[sideTo(Q)] = dQ;
  if (!isValidSides(sides.a, sides.b, sides.c)) return null;
  // Samme side af PQ som pointeren (står den på linjen: som før).
  const pq = sub(v[Q], v[P]);
  const sp = cross(pq, sub(p, v[P]));
  const side = sp > EPS ? 1 : sp < -EPS ? -1 : cross(pq, sub(v[vertex], v[P])) >= 0 ? 1 : -1;
  const X = intersect(v[P], v[Q], dP, dQ, side);
  if (!X) return null;
  const pts = { ...v, [vertex]: X } as Record<Corner, Point>;
  const ab = sub(pts.B, pts.A);
  const rotation = vertex === "C" ? shape.rotation : normDeg(Math.atan2(ab.y, ab.x) / RAD);
  const mirror = cross(ab, sub(pts.C, pts.A)) > 0;
  return { shape: { ...sides, rotation, mirror }, offset: vertex === "A" ? X : none };
}

/**
 * Træk i et hjørne. `local` er pointeren relativt til ankeret (A) ved trækkets start, og `shape`
 * er formen ved trækkets start. Det trukne hjørnes to sider snappes til snapMm; de to andre
 * hjørner står fast:
 * - C: a = |BC| og b = |AC|; A og B faste (c og rotation uændrede). C kan trækkes over på den
 *   anden side af AB (spejling).
 * - B: c = |AB| og a = |BC|; A og C faste (rotationen følger).
 * - A: b = |AC| og c = |AB|; B og C faste, ankeret flyttes (offset).
 * Er formen ved pointeren ugyldig (side uden for 1–15 cm, for flad, vinkel under 8°), afvises
 * trækket pænt: hjørnet standser ved den sidste gyldige form på vejen fra hjørnets startpunkt
 * mod pointeren, så figuren aldrig hopper.
 */
export function dragVertex(shape: TriangleShape, vertex: string, local: Point, opts: DragOpts): DragResult<TriangleShape> {
  const none = { x: 0, y: 0 };
  if (!Number.isFinite(local.x) || !Number.isFinite(local.y)) return { shape, offset: none };
  if (vertex !== "A" && vertex !== "B" && vertex !== "C") return { shape, offset: none };
  const v = vertices(shape);
  const direct = attempt(shape, v, vertex, local, opts);
  if (direct) return direct;
  // Første grænse på vejen fra hjørnets startpunkt mod pointeren: grov skanning, så halvering.
  const start = v[vertex];
  const at = (t: number): Point => ({ x: start.x + (local.x - start.x) * t, y: start.y + (local.y - start.y) * t });
  const STEPS = 32;
  let lo = 0;
  let hi = 1;
  let best = attempt(shape, v, vertex, start, opts);
  if (!best) return { shape, offset: none };
  for (let i = 1; i < STEPS; i++) {
    const r = attempt(shape, v, vertex, at(i / STEPS), opts);
    if (!r) {
      hi = i / STEPS;
      break;
    }
    lo = i / STEPS;
    best = r;
  }
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const r = attempt(shape, v, vertex, at(mid), opts);
    if (r) {
      lo = mid;
      best = r;
    } else {
      hi = mid;
    }
  }
  return best;
}

/**
 * Gemt/indlæst form: felter tjekkes, sider klemmes til grænserne og rotationen normaliseres.
 * Kan siderne så ikke danne en gyldig trekant, afkortes den længste side (hele mm); hjælper det
 * ikke, bruges standardtrekanten med samme rotation og spejling.
 */
export function validateShape(raw: unknown): TriangleShape | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { a, b, c, rotation, mirror } = raw as Record<string, unknown>;
  for (const x of [a, b, c, rotation]) if (typeof x !== "number" || !Number.isFinite(x)) return null;
  if (typeof mirror !== "boolean") return null;
  const rot = normDeg(rotation as number);
  const s = { a: clampSide(a as number), b: clampSide(b as number), c: clampSide(c as number) };
  if (isValidSides(s.a, s.b, s.c)) return { ...s, rotation: rot, mirror };
  const keys = (["a", "b", "c"] as const).slice().sort((p, q) => s[p] - s[q]);
  const longest = keys[2];
  for (let L = Math.floor(s[longest]); L >= Math.ceil(s[keys[1]]); L--) {
    const t = { ...s, [longest]: L };
    if (isValidSides(t.a, t.b, t.c)) return { ...t, rotation: rot, mirror };
  }
  const d = defaultShape();
  return { a: d.a, b: d.b, c: d.c, rotation: rot, mirror };
}

// ---- Find X (kun folkeskoleregler: ingen sinus-/cosinusrelationer) ----

/** Regeltabel i prioriteret rækkefølge; fremadregler først, de omvendte (↺) sidst. */
const RULES: Record<string, Rule[]> = {
  A: [{ given: ["B", "C"], rhs: "180° − {B} − {C}", value: (v) => 180 - v.B - v.C }],
  B: [{ given: ["A", "C"], rhs: "180° − {A} − {C}", value: (v) => 180 - v.A - v.C }],
  C: [{ given: ["A", "B"], rhs: "180° − {A} − {B}", value: (v) => 180 - v.A - v.B }],
  T: [{ given: ["c", "h"], rhs: "½ · {c} · {h}", value: (v) => 0.5 * v.c * v.h }],
  O: [{ given: ["a", "b", "c"], rhs: "{a} + {b} + {c}", value: (v) => v.a + v.b + v.c }],
  // Omvendte: en side ud fra omkredsen, c og h ud fra arealet.
  a: [{ given: ["O", "b", "c"], rhs: "{O} − {b} − {c}", value: (v) => v.O - v.b - v.c }],
  b: [{ given: ["O", "a", "c"], rhs: "{O} − {a} − {c}", value: (v) => v.O - v.a - v.c }],
  c: [
    { given: ["O", "a", "b"], rhs: "{O} − {a} − {b}", value: (v) => v.O - v.a - v.b },
    { given: ["T", "h"], rhs: "2 · {T} / {h}", value: (v) => (2 * v.T) / v.h },
  ],
  h: [{ given: ["T", "c"], rhs: "2 · {T} / {c}", value: (v) => (2 * v.T) / v.c }],
};

/** Geometri + regeldata; solve/solvableFrom laves af makeSolver i figures/triangle.tsx. */
export const triangleSpec: FigureSpec<TriangleShape> = {
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
