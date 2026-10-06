// Opgavelab — figur-registry: den ENESTE liste over figurtyper.
//
// Sådan tilføjer du en figur (fx et rektangel):
//  1. Opret figures/rectangle.tsx, der eksporterer
//       export const rectangle: FigureDef<"rectangle", RectangleShape> = { ... };
//     med geometri (params, defaultShape, vertices, compute, solve, solvableFrom,
//     dragVertex, validateShape, bounds — se FigureGeometry i model/types.ts), plus
//     type, name, icon, newShape, labels og drawing (se FigureDef i figures/types.ts).
//     Formtypen (RectangleShape) kan stå i samme fil. Vil du teste geometrien i Node
//     (--experimental-strip-types), så læg den i core/rectangle.ts med kun type-imports,
//     som core/rightTriangle.ts.
//     Figurfilen må kun importere fra core/*, model/types, model/params,
//     render/primitives og render/textLayout (type) — IKKE fra model/figures eller dette
//     registry (det giver en importcyklus).
//  2. Tilføj én linje i DEFS herunder: `rectangle,`.
// Det er alt: FigureKind, FigureShape og FigureObject (discriminated union på `figure`)
// afledes herfra; validering, editor (træk, håndtag, markering), værktøjsknap, tegning,
// svarark, nummerering, margen og PDF-eksport er generiske og slår op med defOf(fig).
// Bliver nøglen og `type` ikke ens, giver TypeScript en fejl på FIGURES.

import { rightTriangle } from "./rightTriangle";
import type { FigureObjectOf } from "../model/types";
import type { FigureDef } from "./types";

const DEFS = {
  rightTriangle,
};

type Defs = typeof DEFS;

/** Nøgler i registry'et (gemmes som `figure` i dokumentet). */
export type FigureKind = keyof Defs;

/** Figur-nøgle → formtype. */
export type ShapeMap = { [K in FigureKind]: Defs[K] extends FigureDef<K, infer S> ? S : never };

/** Formtypen for figuren K (uden K: unionen af alle figurers former). */
export type FigureShape<K extends FigureKind = FigureKind> = ShapeMap[K];

/** Definitionen for figuren K. */
export type FigureDefFor<K extends FigureKind> = FigureDef<K, ShapeMap[K]>;

/** En figur på arket med nøglen K. */
export type FigureObjectFor<K extends FigureKind> = FigureObjectOf<K, ShapeMap[K]>;

/** Alle figurer på arket: discriminated union på `figure`. */
export type FigureObject = { [K in FigureKind]: FigureObjectFor<K> }[FigureKind];

export const FIGURES: { readonly [K in FigureKind]: FigureDefFor<K> } = DEFS;

/** Figurerne i registry-rækkefølge (værktøjspanelets knapper). */
export const FIGURE_KINDS = Object.keys(FIGURES) as FigureKind[];

/**
 * En figur med (generisk) nøgle K er en FigureObject. TypeScript kan ikke selv se det for et
 * generisk K (korrelerede unioner), så det står her som den eneste typekonvertering.
 */
export function asFigure<K extends FigureKind>(fig: FigureObjectFor<K>): FigureObject {
  return fig as unknown as FigureObject;
}

/** Typesikkert opslag: definitionen, der hører til figurens `figure`-nøgle. */
export function defOf<K extends FigureKind>(fig: { figure: K }): FigureDefFor<K> {
  return FIGURES[fig.figure];
}

/** Opslag med en vilkårlig streng (fx fra indlæst JSON). */
export function getFigureDef(key: unknown): FigureDefFor<FigureKind> | null {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(FIGURES, key)
    ? FIGURES[key as FigureKind]
    : null;
}
