// Opgavelab — piletaster på et håndtag (ren TS). SheetEditor.keyVertex bruger den; Node-testene også.
//
// Ét tryk flytter håndtaget ét trin i pilens retning. Giver det ingen ændring (snap: fx kvadratets
// s = (x + y) / 2 flytter kun et halvt trin), prøves 2, 3 … KEY_TRIES trin. Ændres formen stadig
// ikke, forklares hvorfor, så tasten aldrig er "død":
//  - "limit": et mål har nået sin grænse (fx "Maks. g nået") — målet, der ændres ved den modsatte
//    pil, og om det ville blive større eller mindre;
//  - "sheet": figuren ville gå ud over arket;
//  - "axis": håndtaget kan kun flyttes på den anden led (fx kassens l: venstre/højre).
//
// Ingen runtime-imports (kun `import type`), så filen kan køres i Node med --experimental-strip-types.

import type { DragOpts, DragResult, ParamDef, Point } from "../model/types";

/** Højst så mange trin pr. tryk, før tasten regnes som uden virkning. */
export const KEY_TRIES = 4;

export type KeyGeometry<S> = {
  params: ParamDef[];
  vertices(shape: S): Record<string, Point>;
  compute(shape: S): Record<string, number>;
  dragVertex(shape: S, vertex: string, local: Point, opts: DragOpts): DragResult<S>;
};

export type KeyStepResult<S> =
  | { ok: true; result: DragResult<S> }
  | {
      ok: false;
      reason: "limit" | "sheet";
      /** Målet (param-nøgle), der står ved grænsen, og om pilen ville gøre det større. */
      param: string | null;
      bigger: boolean;
    }
  | {
      ok: false;
      reason: "axis";
      /** Den led, håndtaget kan flyttes på; null når det slet ikke kan flyttes. */
      axis: "horizontal" | "vertical" | null;
    };

const sameShape = <S>(a: S, b: S) => JSON.stringify(a) === JSON.stringify(b);
const changed = <S>(shape: S, r: DragResult<S>) => !sameShape(shape, r.shape) || r.offset.x !== 0 || r.offset.y !== 0;

/**
 * Første ændring ved 1, 2 … KEY_TRIES trin i retningen `dir` (uden hensyn til arket). Et længere trin
 * (k > 1) bruges kun, når den modsatte pil ikke ændrer det samme mål i samme retning: på tværs af et
 * radius-håndtag gør både op og ned cirklen større — dén led bruges ikke (reason "axis").
 */
function firstChange<S>(geo: KeyGeometry<S>, shape: S, vertex: string, p: Point, dir: Point, step: number, opts: DragOpts): DragResult<S> | null {
  const at = (sign: number, k: number) =>
    geo.dragVertex(shape, vertex, { x: p.x + sign * dir.x * step * k, y: p.y + sign * dir.y * step * k }, opts);
  for (let k = 1; k <= KEY_TRIES; k++) {
    const r = at(1, k);
    if (!changed(shape, r)) continue;
    if (k > 1) {
      const o = at(-1, k);
      if (changed(shape, o)) {
        const m = mainChange(geo, shape, r.shape);
        const n = mainChange(geo, shape, o.shape);
        if (m.param === n.param && m.grows === n.grows) return null;
      }
    }
    return r;
  }
  return null;
}

/**
 * Det mål, der ændres mest (relativt) fra `shape` til `to`, og om det bliver større. Grundmålene
 * (ikke-afledte) først; ændres ingen af dem (fx trapezets forskydning), et afledt mål (benene c, d).
 */
function mainChange<S>(geo: KeyGeometry<S>, shape: S, to: S): { param: string | null; grows: boolean } {
  const base = changeAmong(geo, shape, to, false);
  return base.param !== null ? base : changeAmong(geo, shape, to, true);
}

function changeAmong<S>(geo: KeyGeometry<S>, shape: S, to: S, derived: boolean): { param: string | null; grows: boolean } {
  const a = geo.compute(shape);
  const b = geo.compute(to);
  let best: string | null = null;
  let bestRel = 1e-9;
  let grows = false;
  for (const p of geo.params) {
    if (!!p.derived !== derived) continue;
    const x = a[p.key];
    const y = b[p.key];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const rel = Math.abs(y - x) / Math.max(Math.abs(x), 1e-9);
    if (rel > bestRel) {
      best = p.key;
      bestRel = rel;
      grows = y > x;
    }
  }
  return { param: best, grows };
}

/**
 * Ét tastetryk på håndtaget `vertex`.
 * @param step trinnet i mm (snap-trin, ellers 2 mm; Shift: 5 gange så meget)
 * @param fits om resultatet kan være på arket (editoren: figurens udstrækning inden for margenen)
 */
export function keyStep<S>(
  geo: KeyGeometry<S>,
  shape: S,
  vertex: string,
  dir: Point,
  step: number,
  opts: DragOpts,
  fits: (r: DragResult<S>) => boolean = () => true,
): KeyStepResult<S> {
  const p = geo.vertices(shape)[vertex];
  if (!p) return { ok: false, reason: "axis", axis: null };
  const r = firstChange(geo, shape, vertex, p, dir, step, opts);
  if (r && fits(r)) return { ok: true, result: r };
  if (r) {
    // Formen ville ændre sig, men figuren går ud over arket.
    const m = mainChange(geo, shape, r.shape);
    return { ok: false, reason: "sheet", param: m.param, bigger: m.grows };
  }
  // Ingen ændring i denne retning: står et mål ved sin grænse? (Den modsatte pil ændrer formen.)
  const back = firstChange(geo, shape, vertex, p, { x: -dir.x, y: -dir.y }, step, opts);
  if (back) {
    const m = mainChange(geo, shape, back.shape);
    return { ok: false, reason: "limit", param: m.param, bigger: !m.grows };
  }
  // Heller ikke modsat: håndtaget bruger kun den anden led (eller kan slet ikke flyttes).
  const other = dir.x !== 0 ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const moves =
    firstChange(geo, shape, vertex, p, other, step, opts) !== null ||
    firstChange(geo, shape, vertex, p, { x: -other.x, y: -other.y }, step, opts) !== null;
  return { ok: false, reason: "axis", axis: moves ? (other.x !== 0 ? "horizontal" : "vertical") : null };
}
