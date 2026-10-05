// Opgavelab — figur-registry. En ny figur (fri trekant, rektangel, cirkel …)
// tilføjes som én ny FigureDef her. Denne fil må gerne importere runtime fra core.

import { rightTriangle } from "../core/rightTriangle";
import type {
  Bounds,
  DocSettings,
  DragOpts,
  FigureDef,
  FigureKind,
  FigureObject,
  FigureShape,
  ParamState,
} from "./types";

export type {
  DragOpts,
  DragResult,
  FigureDef,
  Fmt,
  ParamDef,
  ParamKind,
  Solution,
} from "./types";

export const FIGURES: Record<FigureKind, FigureDef<FigureShape>> = { rightTriangle };

/** Opslag med en vilkårlig streng (fx fra indlæst JSON). */
export function getFigureDef(key: unknown): FigureDef<FigureShape> | null {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(FIGURES, key)
    ? FIGURES[key as FigureKind]
    : null;
}

/** Alle parametre synlige og uden alias. */
export function defaultParams(def: FigureDef<FigureShape>): Record<string, ParamState> {
  const out: Record<string, ParamState> = {};
  for (const p of def.params) out[p.key] = { visible: true };
  return out;
}

/** Viste navn: alias ?? nøgle. Afledes live, så omdøbning slår igennem på regnestykker. */
export function displayName(fig: FigureObject, param: string): string {
  const alias = fig.params[param]?.alias?.trim();
  return alias ? alias : param;
}

/** Navne for alle figurens parametre (til solve). */
export function displayNames(fig: FigureObject): Record<string, string> {
  const def = getFigureDef(fig.figure);
  const out: Record<string, string> = {};
  for (const p of def?.params ?? []) out[p.key] = displayName(fig, p.key);
  return out;
}

/** Mængden af synlige parametre (til solve). */
export function visibleParams(fig: FigureObject): Set<string> {
  const out = new Set<string>();
  for (const [key, st] of Object.entries(fig.params)) if (st.visible) out.add(key);
  return out;
}

/** Figurens bounding box i ARK-koordinater (til nummerering m.m.). */
export function figureBoundsOnSheet(fig: FigureObject): Bounds {
  const def = getFigureDef(fig.figure);
  const b = def ? def.bounds(fig.shape) : { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  return { minX: fig.x + b.minX, minY: fig.y + b.minY, maxX: fig.x + b.maxX, maxY: fig.y + b.maxY };
}

/**
 * Trækindstillinger fra arket. snapCm = 0 betyder "fri" = 1 mm-trin;
 * `coarse` (fx shift) giver 15°-vinkelsnap.
 */
export function dragOpts(settings: DocSettings, coarse = false): DragOpts {
  return {
    snapMm: settings.snapCm > 0 ? settings.snapCm * 10 : 1,
    snapDeg: settings.snapDeg || coarse,
    degStep: coarse ? 15 : 1,
  };
}
