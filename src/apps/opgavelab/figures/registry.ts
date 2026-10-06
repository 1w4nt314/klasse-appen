// Opgavelab — figur-registry: den ENESTE liste over figurtyper.
//
// Sådan tilføjer du en figur (fx et rektangel):
//  1. Geometri og regler i core/rectangle.ts (kun `import type`, så den kan testes i Node med
//     --experimental-strip-types). Filen eksporterer en spec:
//       export const rectangleSpec: FigureSpec<RectangleShape> = {
//         params,        // ParamDef[]: key, label, kind ("length" | "angle" | "area" | "volume"),
//                        //   derived: true for afledte mål (areal, omkreds …: skjult som standard)
//         kinds, rules,  // Find-reglerne (SolveSpec i model/types.ts): target → Rule[] i prioriteret
//                        //   rækkefølge, fremadregler først og omvendte (a ← T,b) sidst; fixed for faste værdier
//         defaultShape, vertices, compute, dragVertex, validateShape, bounds, outline?
//       };
//     Formtypen (RectangleShape) lægges i model/types.ts eller i core-filen. Find-motoren
//     (solve/solvableFrom) skrives IKKE selv: den laves af makeSolver (core/solveKit.ts) ud fra
//     kinds + rules og regner facit på de viste tal ("≈" ved afrunding).
//  2. figures/rectangle.tsx komponerer figuren:
//       export const rectangle: FigureDef<"rectangle", RectangleShape> = {
//         ...rectangleSpec, ...makeSolver(rectangleSpec),
//         type: "rectangle", name: "Rektangel", group: "firkanter", icon, newShape, labels, drawing,
//         handleName?   // aria-label for håndtag (standard "Hjørne {navn}")
//       };
//     labels/drawing kan bruge figures/shared.tsx: derivedLabels (mål-boksen med synlige
//     afledte mål under figuren), sideLabel, rightAngleMark, HIDDEN_EDGE, project og ellipsePath.
//     Figurfilen må kun importere fra core/*, model/types, model/params, figures/shared,
//     render/primitives og render/textLayout (type) — IKKE fra model/figures eller dette
//     registry (det giver en importcyklus).
//  3. Tilføj én linje i DEFS herunder: `rectangle,`. Gruppen (def.group) afgør, under hvilken
//     overskrift værktøjsknappen står (GROUPS herunder).
// Det er alt: FigureKind, FigureShape og FigureObject (discriminated union på `figure`)
// afledes herfra; validering, editor (træk, håndtag, markering), værktøjsknap, tegning,
// svarark, nummerering, margen og PDF-eksport er generiske og slår op med defOf(fig).
// Bliver nøglen og `type` ikke ens, giver TypeScript en fejl på FIGURES.

import { circle } from "./circle";
import { rectangle } from "./rectangle";
import { rightTriangle } from "./rightTriangle";
import { square } from "./square";
import { triangle } from "./triangle";
import type { FigureObjectOf } from "../model/types";
import type { FigureDef, FigureGroup } from "./types";

const DEFS = {
  rightTriangle,
  triangle,
  rectangle,
  square,
  circle,
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

/** Værktøjspanelets figurgrupper i visningsrækkefølge (Tekst står før dem, Regning efter). */
export const GROUPS: readonly { key: FigureGroup; title: string }[] = [
  { key: "trekanter", title: "Trekanter" },
  { key: "firkanter", title: "Firkanter" },
  { key: "cirkler", title: "Cirkler" },
  { key: "rumfigurer", title: "Rumfigurer" },
];

/** Figurerne i gruppen, i registry-rækkefølge. */
export function figuresInGroup(group: FigureGroup): FigureKind[] {
  return FIGURE_KINDS.filter((k) => FIGURES[k].group === group);
}

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
