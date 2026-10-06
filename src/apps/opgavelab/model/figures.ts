// Opgavelab — figur-registry. En ny figur (fri trekant, rektangel, cirkel …)
// tilføjes som én ny FigureDef her. Denne fil må gerne importere runtime fra core.

import { FMT } from "../core/format";
import { parseShown, rightTriangle } from "../core/rightTriangle";
import { ALIAS_MAX } from "./types";
import type {
  Bounds,
  CalcObject,
  DocSettings,
  Document as SheetDoc,
  DragOpts,
  FigureDef,
  FigureKind,
  FigureObject,
  FigureShape,
  ParamState,
  Solution,
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

/** Alias klippet til ALIAS_MAX kodepunkter (ikke UTF-16-enheder: et emoji deles aldrig). */
export function clipAlias(alias: string): string {
  return Array.from(alias).slice(0, ALIAS_MAX).join("");
}

/**
 * Er `alias` for `param` allerede i brug på figuren? Sammenlignes trimmet og uden hensyn
 * til store/små bogstaver mod de andre parametres viste navne OG nøgler (A må fx ikke
 * hedde "b" eller "a"). Tomt alias og parameterens egen nøgle er altid tilladt.
 */
export function aliasConflict(fig: FigureObject, param: string, alias: string): boolean {
  const n = alias.trim();
  if (n === "" || n === param) return false;
  const low = n.toLowerCase();
  for (const k of Object.keys(fig.params)) {
    if (k === param) continue;
    if (k.toLowerCase() === low || displayName(fig, k).toLowerCase() === low) return true;
  }
  return false;
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

/** Løsning af "Find <param>" ud fra figurens synlige størrelser (null = kan ikke findes). */
export function solveParam(fig: FigureObject, param: string, settings: DocSettings): Solution | null {
  const def = getFigureDef(fig.figure);
  if (!def) return null;
  return def.solve(param, visibleParams(fig), def.compute(fig.shape), displayNames(fig), FMT, settings);
}

/**
 * Svararkets figur: skjulte parametre, der har et regnestykke, viser regnestykkets facit
 * (param → værdi), så figur og udregning stemmer overens. `params` = hvilke der har et
 * regnestykke; udeladt → alle skjulte, der kan findes (bruges til pladsberegning).
 */
export function solvedValues(fig: FigureObject, settings: DocSettings, params?: Iterable<string>): Record<string, number> {
  const out: Record<string, number> = {};
  const keys = params ?? Object.keys(fig.params).filter((k) => !fig.params[k].visible);
  for (const k of keys) {
    if (fig.params[k]?.visible !== false) continue;
    const sol = solveParam(fig, k, settings);
    if (sol) out[k] = sol.value;
  }
  return out;
}

/** solvedValues for de parametre, der har et regnestykke i dokumentet. */
export function docSolvedValues(doc: SheetDoc, fig: FigureObject): Record<string, number> {
  const params = doc.objects
    .filter((o): o is CalcObject => o.type === "calc" && o.figureId === fig.id)
    .map((c) => c.param);
  return solvedValues(fig, doc.settings, params);
}

export const DRIFT_CM = 0.1;
export const DRIFT_DEG = 1;

/**
 * Advarsel, hvis facit regnet på de viste (afrundede) tal afviger tydeligt fra figurens egen
 * (afrundede) værdi: længder mere end 0,1 cm, vinkler mere end DRIFT_DEG (fx a = √(c² − b²)
 * med næsten lige lange c og b, eller A = sin⁻¹(a/c) nær 90°). null = ingen advarsel.
 * Vinkelgrænsen er 1° (vinkelmålerens præcision): med c vist med 1 decimal afviger
 * sin⁻¹/cos⁻¹ mere end 0,1° i ca. 38 % af tilfældene, men mere end 1° i kun ca. 4 %.
 */
export function calcDrift(fig: FigureObject, param: string, settings: DocSettings): string | null {
  const def = getFigureDef(fig.figure);
  const sol = def ? solveParam(fig, param, settings) : null;
  if (!def || !sol) return null;
  const truth = def.compute(fig.shape)[param];
  const shownTruth = parseShown(sol.kind === "angle" ? FMT.ang(truth) : FMT.len(truth));
  if (Math.abs(parseShown(sol.result) - shownTruth) <= (sol.kind === "angle" ? DRIFT_DEG : DRIFT_CM) + 1e-9) return null;
  const name = displayName(fig, param);
  const fig1 = sol.kind === "angle" ? FMT.ang(truth) : FMT.len(truth);
  return `Afrunding: med de viste tal bliver ${name} ≈ ${sol.result}, men figuren måler ${fig1} — vis fx andre størrelser`;
}

/** "a og b" / "A, B og C". */
function joinNames(names: string[]): string {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} og ${names[names.length - 1]}`;
}

/**
 * Dansk forklaring, hvis et regnestykke ikke kan udregnes ud fra de synlige størrelser
 * (ellers null). Foreslår det givne-sæt, der kræver færrest nye synlige størrelser.
 */
export function calcProblem(fig: FigureObject, param: string, settings: DocSettings): string | null {
  const def = getFigureDef(fig.figure);
  if (!def || solveParam(fig, param, settings)) return null;
  const name = displayName(fig, param);
  if (fig.params[param]?.visible) return `${name} er synlig på figuren — skjul den for at kunne finde den`;
  const vis = visibleParams(fig);
  const sets = def.solvableFrom(param);
  let best: string[] | null = null;
  for (const s of sets) if (!best || s.filter((k) => !vis.has(k)).length < best.filter((k) => !vis.has(k)).length) best = s;
  const hint = best ? ` — vis fx ${joinNames(best.map((k) => displayName(fig, k)))}` : "";
  return `${name} kan ikke findes ud fra de synlige størrelser${hint}`;
}
