// Opgavelab — fælles hjælpere til figurfilerne (figures/*): afledte mål under figuren,
// sideetiketter, stiplede skjulte kanter, retvinkelmærke og kavalerperspektiv (3D).
// Importerer kun render/primitives, model/format-typer og figures/types (type) — ikke registry'et.

import { formatByKind } from "../core/format";
import { displayName } from "../model/params";
import type { Bounds, ParamDef, ParamState, Point } from "../model/types";
import { BRAND, INK, LABEL_GAP, add, besides, labelBox, r2, sub, unit } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import type { Label, SheetMode } from "./types";

type HasParams = { params: Record<string, ParamState> };

// ---- afledte mål ("mål-boksen") ----

/** mm fra figurens nederste kant til første linje i mål-boksen (linjens midte). */
export const DERIVED_GAP = 6;
/** mm luft (mellem placeringsboksene) til en etiket lige over mål-boksen, fx l/s under en firkant. */
export const DERIVED_CLEARANCE = 2;
/** mm mellem linjerne i mål-boksen. */
export const DERIVED_LINE = 5.5;

/**
 * Etiketter for de SYNLIGE afledte mål (areal, omkreds, rumfang …): en venstrejusteret "mål-boks"
 * under figuren ("A = 40,0 cm²"), første linje DERIVED_GAP mm under `bounds.maxY`, DERIVED_LINE mm
 * pr. linje. Skjulte afledte mål tegnes aldrig (heller ikke på svararket: facit står i regnestykket).
 * `others` er figurens øvrige etiketter: rammer boksen en af dem (fx en sideetiket under figuren),
 * skubbes den ned under den (med `clearance` mm luft mellem placeringsboksene; en linjeboks er
 * højere end cifrene, så figurer med en etiket lige over mål-boksen bruger ca. 2). Resultatet
 * afhænger kun af figur og synlighed.
 */
export function derivedLabels(
  fig: HasParams,
  params: readonly ParamDef[],
  values: Record<string, number>,
  bounds: Bounds,
  measure: Measure,
  others: readonly Label[] = [],
  clearance = 0.4,
): Label[] {
  const items = params
    .filter((p) => p.derived && fig.params[p.key]?.visible && Number.isFinite(values[p.key]))
    .map((p) => {
      const text = `${displayName(fig, p.key)} = ${formatByKind(p.kind, values[p.key])}`;
      return { key: p.key, text, ...labelBox(text, measure) };
    });
  if (items.length === 0) return [];
  const width = Math.max(...items.map((i) => 2 * i.hw));
  const x0 = bounds.minX;
  const span = (items.length - 1) * DERIVED_LINE;
  const first = items[0];
  const last = items[items.length - 1];
  let y0 = bounds.maxY + DERIVED_GAP;
  for (let guard = 0; guard < 40; guard++) {
    const top = y0 - first.hh;
    const bottom = y0 + span + last.hh;
    const hit = others.find(
      (o) =>
        o.c.x - o.hw < x0 + width &&
        o.c.x + o.hw > x0 &&
        o.c.y - o.hh < bottom + clearance &&
        o.c.y + o.hh > top - clearance,
    );
    if (!hit) break;
    y0 = hit.c.y + hit.hh + clearance + first.hh;
  }
  return items.map((it, i) => ({
    key: `derived${it.key}`,
    text: it.text,
    c: { x: x0 + it.hw, y: y0 + i * DERIVED_LINE },
    hw: it.hw,
    hh: it.hh,
    fill: INK,
    data: { "data-ol-param": it.key },
  }));
}

// ---- synlighed og farve i opgave/svarark ----

/**
 * Hvad der vises for figurens parametre i den givne mode. Opgavearket: kun synlige (sort).
 * Svararket: alle ikke-afledte parametre — de skjulte i BRAND, med facit (`solved`) i stedet
 * for figurens egen værdi, så figur og regnestykke stemmer. Afledte mål (areal, omkreds …) vises
 * kun, når de er synlige (se derivedLabels), også på svararket.
 */
export function paramShow(
  fig: HasParams,
  mode: SheetMode,
  values: Record<string, number>,
  solved: Record<string, number> = {},
) {
  const answer = mode === "svarark";
  const has = (k: string) => Object.prototype.hasOwnProperty.call(solved, k);
  const vis = (k: string) => fig.params[k]?.visible === true;
  return {
    /** Skal parameteren skrives med værdi (ellers kun navnet)? */
    shown: (k: string) => answer || vis(k),
    /** Værdien på arket (facit på svararket for skjulte parametre). */
    value: (k: string) => (answer && has(k) ? solved[k] : values[k]),
    /** BRAND for skjulte parametre på svararket, ellers INK. */
    color: (k: string) => (answer && !vis(k) ? BRAND : INK),
  };
}

// ---- sideetiket ----

/**
 * Placering af en sideetiket midt på siden pq, på den side der vender væk fra punktet `away`
 * (hjørnet overfor). Returnerer centrum, halve mål, sidens retning (p→q) og normalen væk fra figuren.
 */
export function sideLabel(
  p: Point,
  q: Point,
  away: Point,
  text: string,
  measure: Measure,
): { c: Point; hw: number; hh: number; dir: Point; n: Point } {
  const mid: Point = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const dir = unit(sub(q, p));
  let n: Point = { x: -dir.y, y: dir.x };
  const out = sub(mid, away);
  if (n.x * out.x + n.y * out.y < 0) n = { x: -n.x, y: -n.y };
  const { hw, hh } = labelBox(text, measure);
  return { c: besides(mid, n, LABEL_GAP + 0.6, hw, hh), hw, hh, dir, n };
}

// ---- streger ----

/** Skjulte kanter (3D) tegnes stiplet; svg2pdf forstår stroke-dasharray. */
export const HIDDEN_EDGE = { strokeDasharray: "1.5 1", strokeWidth: 0.4 } as const;

/** Polygon-punkter til <polygon points>: "x,y x,y …" (2 decimaler). */
export function polyPoints(pts: readonly Point[]): string {
  return pts.map((p) => `${r2(p.x)},${r2(p.y)}`).join(" ");
}

/**
 * Retvinkelmærke (kvadrat-hjørne) i hjørnet v mellem retningerne mod p og q, `size` mm (std 3).
 * Returnerer path-data ("M … L … L …"), uden udfyldning.
 */
export function rightAngleMark(v: Point, p: Point, q: Point, size = 3): string {
  const u = unit(sub(p, v));
  const w = unit(sub(q, v));
  const p1 = add(v, u, size);
  const p2 = add(p1, w, size);
  const p3 = add(v, w, size);
  return `M ${r2(p1.x)} ${r2(p1.y)} L ${r2(p2.x)} ${r2(p2.y)} L ${r2(p3.x)} ${r2(p3.y)}`;
}

/**
 * Ellipsebue om c med radierne rx, ry (path-data). "front": nederste halvdel (forreste, fuld streg),
 * "back": øverste halvdel (bagerste, stiplet), "full": hele ellipsen.
 */
export function ellipsePath(c: Point, rx: number, ry: number, half: "front" | "back" | "full" = "full"): string {
  const l = { x: r2(c.x - rx), y: r2(c.y) };
  const r = { x: r2(c.x + rx), y: r2(c.y) };
  const a = `${r2(rx)} ${r2(ry)} 0 0`;
  // SVG: y nedad; sweep 0 går fra venstre til højre under centrum, sweep 1 over centrum.
  if (half === "front") return `M ${l.x} ${l.y} A ${a} 0 ${r.x} ${r.y}`;
  if (half === "back") return `M ${l.x} ${l.y} A ${a} 1 ${r.x} ${r.y}`;
  return `M ${l.x} ${l.y} A ${a} 0 ${r.x} ${r.y} A ${a} 0 ${l.x} ${l.y}`;
}

// ---- kavalerperspektiv (3D) ----

/** Dybdeaksens skala og vinkel: dybden tegnes halv størrelse under 45°. */
export const CAVALIER_K = 0.5;
const C45 = Math.SQRT1_2;

/** Punkt (x, y, z) i mm → ark-koordinater (y op, z dybde bagud): x + k·z·cos45°, −y − k·z·sin45°. */
export function project(x: number, y: number, z: number): Point {
  return { x: x + CAVALIER_K * z * C45, y: -y - CAVALIER_K * z * C45 };
}
