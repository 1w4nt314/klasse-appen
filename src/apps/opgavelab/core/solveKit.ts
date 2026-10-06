// Opgavelab — generisk Find-motor for alle figurer. En figur beskriver sine parametre
// (kinds), regler og evt. faste værdier i en SolveSpec; makeSolver laver solve() og
// solvableFrom() ud fra den. Facit regnes altid på de VISTE (afrundede) tal, så svararket
// kan eftergøres med lommeregner, og "≈" vises når resultatet er afrundet.
//
// Ingen runtime-imports (kun `import type`), ingen enums/parameter properties,
// så filen kan køres i Node med --experimental-strip-types.

import type { DocSettings, Fmt, ParamKind, Rule, Solution, SolveSpec } from "../model/types";

export type { Rule, SolveSpec } from "../model/types";

/** Hvor meget et facit må afvige fra figurens viste værdi, før det regnes som en afvigelse. */
export const DRIFT_CM = 0.1;
export const DRIFT_DEG = 1;
/** Relativ tolerance for arealer og rumfang (1 decimal på 141,4 cm³ er ellers for snævert). */
export const DRIFT_REL = 0.01;

/**
 * Tolerancen for et facit af typen `kind`, hvis figurens (viste) værdi er `truth`:
 * vinkler 1°, længder 0,1 cm, arealer/rumfang max(0,1; 1 % af |truth|).
 */
export function tolerance(kind: ParamKind, truth: number): number {
  if (kind === "angle") return DRIFT_DEG;
  if (kind === "length") return DRIFT_CM;
  return Number.isFinite(truth) ? Math.max(DRIFT_CM, DRIFT_REL * Math.abs(truth)) : DRIFT_CM;
}

/**
 * Tallet, som det står på arket: formateringen parses tilbage ("1.234,6 cm" → 1234.6,
 * "−2,5" → −2.5, "36,9°" → 36.9). NaN hvis der ikke er et tal.
 */
export function parseShown(text: string): number {
  const t = text.replace(/−/g, "-").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return t === "" || t === "-" ? NaN : Number(t);
}

/** Et indsat tal i regnestykket (uden enhed; vinkler med gradtegn som på figuren). */
export function shownText(kind: ParamKind, x: number, fmt: Fmt): string {
  return kind === "angle" ? fmt.ang(x) : fmt.num(x, 1);
}

/** Resultatet med enhed, som på arket. */
export function resultText(kind: ParamKind, x: number, fmt: Fmt): string {
  return kind === "angle" ? fmt.ang(x) : kind === "area" ? fmt.area(x) : kind === "volume" ? fmt.vol(x) : fmt.len(x);
}

/** Er `rounded` (det viste resultat) en afrunding af `value`? → "≈" i stedet for "=". */
export function isApprox(value: number, rounded: number): boolean {
  return !(Math.abs(rounded - value) <= 1e-9 * Math.max(1, Math.abs(value)));
}

function fill(rhs: string, param: (key: string) => string, inv: (fn: string) => string): string {
  return rhs.replace(/\{inv:(\w+)\}|\{(\w+)\}/g, (_m, fn: string | undefined, key: string | undefined) =>
    fn ? inv(fn) : param(key ?? ""),
  );
}

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

export type Solver = {
  solve(
    target: string,
    visible: ReadonlySet<string>,
    values: Record<string, number>,
    names: Record<string, string>,
    fmt: Fmt,
    settings: DocSettings,
  ): Solution | null;
  solvableFrom(target: string): string[][];
};

export function makeSolver(spec: SolveSpec): Solver {
  const { kinds, rules } = spec;
  const fixed = spec.fixed ?? {};
  /** Figurens værdi for key: den faste værdi (fx C = 90°), ellers compute()'s. */
  const raw = (key: string, values: Record<string, number>) => (own(fixed, key) ? fixed[key] : values[key]);

  /** Mulige sæt af givne parametre for target, i prioriteret rækkefølge. */
  function solvableFrom(target: string): string[][] {
    const list = own(rules, target) ? rules[target] : [];
    return list.map((r) => [...r.given]);
  }

  /**
   * Find target ud fra de SYNLIGE parametre (en fast værdi som C = 90° regnes kun som kendt,
   * når den er synlig). Returnerer null, hvis target selv er synlig, eller ingen regel kan bruges.
   *
   * Facit regnes på de VISTE tal (længder med 1 decimal, vinkler som fmt.ang viser dem), så
   * "indsat → resultat" altid kan eftergøres med lommeregner. `approx` er sand, når resultatet
   * er afrundet (vises som "≈"), og falsk når det er eksakt (fx 180° − A − B).
   */
  function solve(
    target: string,
    visible: ReadonlySet<string>,
    values: Record<string, number>,
    names: Record<string, string>,
    fmt: Fmt,
    settings: DocSettings,
  ): Solution | null {
    if (!own(rules, target) || visible.has(target)) return null;
    const kind = kinds[target];
    const shown = (key: string, x: number) => shownText(kinds[key], x, fmt);
    const result = (x: number) => resultText(kind, x, fmt);
    // Af de anvendelige regler (alle givne synlige) bruges den første i tabellens rækkefølge,
    // hvis facit — regnet på de viste tal og vist som på arket — ligger inden for tolerancen
    // af figurens egen (viste) værdi. Så står Pythagoras/vinkelsum stabilt på svararket og
    // skifter ikke formel ved små ryk. Holder ingen regel tolerancen, bruges den med mindst
    // afvigelse (ved uafgjort tabellens rækkefølge) — fx a = c · sin A frem for √(c² − b²),
    // når den sidste giver 0,0 cm for en side på 1 cm.
    const truthRaw = raw(target, values);
    const truth = Number.isFinite(truthRaw) ? parseShown(result(truthRaw)) : NaN;
    const tol = tolerance(kind, truth) + 1e-9;
    let best: { rule: Rule; v: Record<string, number>; value: number; dev: number } | null = null;
    for (const rule of rules[target]) {
      if (!rule.given.every((g) => visible.has(g))) continue;
      const v: Record<string, number> = { ...fixed };
      let okGiven = true;
      for (const g of rule.given) {
        const x = raw(g, values);
        v[g] = Number.isFinite(x) ? parseShown(shown(g, x)) : NaN;
        if (!Number.isFinite(v[g])) okGiven = false;
      }
      if (!okGiven) continue;
      const value = rule.value(v);
      if (!Number.isFinite(value)) continue;
      const dev = Number.isFinite(truth) ? Math.abs(parseShown(result(value)) - truth) : 0;
      if (dev <= tol) {
        best = { rule, v, value, dev };
        break;
      }
      if (!best || dev < best.dev - 1e-9) best = { rule, v, value, dev };
    }
    if (!best) return null;
    const { rule, v, value } = best;

    const name = (key: string) => {
      const n = names[key];
      return typeof n === "string" && n.trim() !== "" ? n.trim() : key;
    };
    const inv = (fn: string) => (settings.inverseNotation === "arc" ? `arc${fn}` : `${fn}⁻¹`);
    const text = result(value);

    return {
      target,
      formula: `${name(target)} = ${fill(rule.rhs, name, inv)}`,
      substituted: fill(rule.rhs, (key) => shown(key, v[key]), inv),
      result: text,
      value,
      approx: isApprox(value, parseShown(text)),
      kind,
    };
  }

  return { solve, solvableFrom };
}
