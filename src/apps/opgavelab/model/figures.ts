// Opgavelab — figur-hjælpere oven på registry'et (figures/registry.ts): navne, Find,
// advarsler, svararkets facit. Generiske — intet her kender en bestemt figur.

import { FMT, formatByKind } from "../core/format";
import { DRIFT_CM, DRIFT_DEG, parseShown, tolerance } from "../core/solveKit";
import { defOf } from "../figures/registry";
import { displayName, visibleParams } from "./params";
import { ALIAS_MAX } from "./types";
import type {
  Bounds,
  CalcObject,
  DocSettings,
  Document as SheetDoc,
  DragOpts,
  FigureObject,
  ParamDef,
  ParamState,
  Solution,
} from "./types";

export type {
  DragOpts,
  DragResult,
  Fmt,
  ParamDef,
  ParamKind,
  Solution,
} from "./types";
export type { FigureDef } from "../figures/types";
export { FIGURES, FIGURE_KINDS, GROUPS, defOf, figuresInGroup, getFigureDef } from "../figures/registry";
export { displayName, visibleParams } from "./params";

/** Alle parametre synlige og uden alias — undtagen afledte mål (areal, omkreds …), der er skjulte. */
export function defaultParams(def: { params: ParamDef[] }): Record<string, ParamState> {
  const out: Record<string, ParamState> = {};
  for (const p of def.params) out[p.key] = { visible: !p.derived };
  return out;
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
export function aliasConflict(fig: { params: Record<string, ParamState> }, param: string, alias: string): boolean {
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
  const out: Record<string, string> = {};
  for (const p of defOf(fig).params) out[p.key] = displayName(fig, p.key);
  return out;
}

/** Figurens bounding box i ARK-koordinater (til nummerering m.m.). */
export function figureBoundsOnSheet(fig: FigureObject): Bounds {
  const b = defOf(fig).bounds(fig.shape);
  return { minX: fig.x + b.minX, minY: fig.y + b.minY, maxX: fig.x + b.maxX, maxY: fig.y + b.maxY };
}

/**
 * Trækindstillinger fra arket. snapCm = 0 betyder "fri" = 1 mm-trin;
 * `coarse` (fx shift) giver 15°-vinkelsnap.
 */
export function dragOpts(settings: DocSettings, coarse = false): DragOpts {
  return {
    snapMm: settings.snapCm > 0 ? settings.snapCm * 10 : 1,
    free: !(settings.snapCm > 0),
    snapDeg: settings.snapDeg || coarse,
    degStep: coarse ? 15 : 1,
  };
}

/** Løsning af "Find <param>" ud fra figurens synlige størrelser (null = kan ikke findes). */
export function solveParam(fig: FigureObject, param: string, settings: DocSettings): Solution | null {
  const def = defOf(fig);
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

export { DRIFT_CM, DRIFT_DEG };

/**
 * Advarsel, hvis facit regnet på de viste (afrundede) tal afviger tydeligt fra figurens egen
 * (afrundede) værdi: længder mere end 0,1 cm, vinkler mere end DRIFT_DEG (fx a = √(c² − b²)
 * med næsten lige lange c og b, eller A = sin⁻¹(a/c) nær 90°). null = ingen advarsel.
 * Vinkelgrænsen er 1° (vinkelmålerens præcision): med c vist med 1 decimal afviger
 * sin⁻¹/cos⁻¹ mere end 0,1° i ca. 38 % af tilfældene, men mere end 1° i kun ca. 4 %.
 */
export function calcDrift(fig: FigureObject, param: string, settings: DocSettings): string | null {
  const d = calcDriftInfo(fig, param, settings);
  return d ? `Afrunding: med de viste tal bliver ${d.name} ${d.approx ? "≈" : "="} ${d.result}, men figuren måler ${d.drawn} — vis fx andre størrelser` : null;
}

/** Afvigelsen bag calcDrift som data (til eksport-dialogen). null = ingen advarsel. */
export function calcDriftInfo(
  fig: FigureObject,
  param: string,
  settings: DocSettings,
): { name: string; result: string; drawn: string; approx: boolean; kind: Solution["kind"] } | null {
  const def = defOf(fig);
  const sol = solveParam(fig, param, settings);
  if (!sol) return null;
  const truth = def.compute(fig.shape)[param];
  const drawn = formatByKind(sol.kind, truth);
  const shownTruth = parseShown(drawn);
  if (Math.abs(parseShown(sol.result) - shownTruth) <= tolerance(sol.kind, shownTruth) + 1e-9) return null;
  return { name: displayName(fig, param), result: sol.result, drawn, approx: sol.approx, kind: sol.kind };
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
  const def = defOf(fig);
  if (solveParam(fig, param, settings)) return null;
  const name = displayName(fig, param);
  if (fig.params[param]?.visible) return `${name} er synlig på figuren — skjul den for at kunne finde den`;
  const vis = visibleParams(fig);
  const sets = def.solvableFrom(param);
  let best: string[] | null = null;
  for (const s of sets) if (!best || s.filter((k) => !vis.has(k)).length < best.filter((k) => !vis.has(k)).length) best = s;
  const hint = best ? ` — vis fx ${joinNames(best.map((k) => displayName(fig, k)))}` : "";
  return `${name} kan ikke findes ud fra de synlige størrelser${hint}`;
}
