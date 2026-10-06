// Opgavelab — validering af dokumenter (bruges på serveren ved gem og indlæs,
// og i klienten ved indlæsning). Intet bevares, som ikke er genkendt: dokumentet
// bygges op på ny af kendte felter. Ukendt type, ikke-endelige tal, forkert
// skemaversion eller for mange objekter giver null (afvist). Forældreløse
// regnestykker smides væk.
//
// Sider: `pageCount` (1–LIMITS.pages) og `page` pr. objekt (0–pageCount−1). Mangler de (dokumenter
// fra før sider), bliver det én side med alt på side 0; ugyldige værdier afviser dokumentet. Et
// regnestykkes `page` læses ikke — det sættes altid til figurens side.

import { aliasConflict, clipAlias, getFigureDef } from "./figures";
import { asFigure, type FigureDefFor, type FigureKind, type FigureObjectFor } from "../figures/registry";
import { DEFAULT_SETTINGS, LIMITS, SCHEMA_VERSION } from "./types";
import { DRILL_OPS } from "../core/drill";
import type {
  CalcObject,
  DocSettings,
  DrillConfig,
  DrillObject,
  DrillOp,
  Document as SheetDoc,
  FormulaObject,
  FigureObject,
  ParamDef,
  ParamState,
  SheetObject,
  Subject,
  TextObject,
} from "./types";

const SUBJECTS: readonly Subject[] = ["matematik"];

/** Rimeligt interval for koordinater på (og lidt uden for) arket, i mm. */
const COORD_MIN = -50;
const COORD_MAX = 350;
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

// Kontroltegn og usynlige formattegn (zero-width, retningsskift, BOM).
const INVISIBLE = /[\u0000-\u001f\u007f​-‏‪-‮⁠-⁩﻿]/g;

/** "  Test   1 " → "Test 1". Tom eller for lang → null (afvises, kappes ikke). */
export function cleanName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const n = name.replace(/\s+/g, " ").replace(INVISIBLE, "").replace(/ {2,}/g, " ").trim();
  return n && n.length <= LIMITS.nameChars ? n : null;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const has = (o: Record<string, unknown>, k: string) => Object.prototype.hasOwnProperty.call(o, k);

function num(v: unknown, min: number, max: number): number | null {
  return typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : null;
}

/** Tekst i opgaven: linjeskift bevares, øvrige kontroltegn fjernes, længden kappes. */
function cleanText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f​-‏‪-‮⁠-⁩﻿]/g, "");
  return t.slice(0, LIMITS.textChars);
}

function parseSettings(raw: unknown): DocSettings {
  const r = isObj(raw) ? raw : {};
  return {
    inverseNotation: r.inverseNotation === "arc" ? "arc" : DEFAULT_SETTINGS.inverseNotation,
    snapCm: r.snapCm === 0 ? 0 : r.snapCm === 0.5 ? 0.5 : DEFAULT_SETTINGS.snapCm,
    snapDeg: typeof r.snapDeg === "boolean" ? r.snapDeg : DEFAULT_SETTINGS.snapDeg,
  };
}

/** Objektet uden side (sættes af parseDocument). */
type NoPage<T> = Omit<T, "page">;

function parseText(r: Record<string, unknown>, id: string): NoPage<TextObject> | null {
  const x = num(r.x, COORD_MIN, COORD_MAX);
  const y = num(r.y, COORD_MIN, COORD_MAX);
  const width = num(r.width, 10, 210);
  const sizePt = num(r.sizePt, 6, 72);
  const text = cleanText(r.text);
  if (x === null || y === null || width === null || sizePt === null || text === null) return null;
  return { id, type: "text", x, y, width, text, sizePt };
}

/** Heltal i [min, max]. */
function int(v: unknown, min: number, max: number): number | null {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null;
}

/**
 * Regnearkets indstillinger. Alt skal være der og inden for grænserne — ellers null (et
 * manipuleret regneark, fx count 500 eller ops [], afviser hele dokumentet).
 */
function parseDrillConfig(raw: unknown): DrillConfig | null {
  if (!isObj(raw)) return null;
  const N = LIMITS.drillNumberMax;
  const count = int(raw.count, 1, LIMITS.drillCount);
  const columns = int(raw.columns, 1, 4) as DrillConfig["columns"] | null;
  const aMin = int(raw.aMin, 0, N);
  const aMax = int(raw.aMax, 0, N);
  const bMin = int(raw.bMin, 0, N);
  const bMax = int(raw.bMax, 0, N);
  const decimals = int(raw.decimals, 0, 2) as DrillConfig["decimals"] | null;
  if (count === null || columns === null || aMin === null || aMax === null || bMin === null || bMax === null || decimals === null) return null;
  if (aMin > aMax || bMin > bMax) return null;
  if (raw.division !== "exact" && raw.division !== "remainder") return null;
  if (typeof raw.noNegative !== "boolean") return null;
  // Regningsarter: ikke-tom delmængde, gemmes i fast rækkefølge.
  if (!Array.isArray(raw.ops) || raw.ops.length === 0 || raw.ops.length > DRILL_OPS.length) return null;
  if (!raw.ops.every((o) => typeof o === "string" && (DRILL_OPS as readonly string[]).includes(o))) return null;
  const ops = DRILL_OPS.filter((o) => (raw.ops as unknown[]).includes(o)) as DrillOp[];
  // Tabeller: heltal 1–12, dedupleret og sorteret.
  if (!Array.isArray(raw.tables) || raw.tables.length > 12) return null;
  const tables: number[] = [];
  for (const t of raw.tables as unknown[]) {
    const n = int(t, 1, 12);
    if (n === null) return null;
    if (!tables.includes(n)) tables.push(n);
  }
  tables.sort((p, q) => p - q);
  const title = cleanText(raw.title);
  if (title === null) return null;
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  if (cleanTitle.length > LIMITS.drillTitle) return null;
  return { ops, count, columns, aMin, aMax, bMin, bMax, tables, division: raw.division, noNegative: raw.noNegative, decimals, title: cleanTitle };
}

function parseDrill(r: Record<string, unknown>, id: string): NoPage<DrillObject> | null {
  const x = num(r.x, COORD_MIN, COORD_MAX);
  const y = num(r.y, COORD_MIN, COORD_MAX);
  const width = num(r.width, LIMITS.drillWidthMin, LIMITS.drillWidthMax);
  const seed = int(r.seed, 0, 0xffffffff);
  const config = parseDrillConfig(r.config);
  if (x === null || y === null || width === null || seed === null || config === null) return null;
  return { id, type: "drill", x, y, width, seed, config };
}

/**
 * Formelblok. Linjerne gemmes som tekst (de regnes først ud ved visning, af core/formula.ts uden
 * eval); her tjekkes kun grænserne: 1–20 linjer à højst 80 tegn efter rensning, decimaler 0–4,
 * titel højst 60 tegn. Alt andet → null (dokumentet afvises).
 */
function parseFormula(r: Record<string, unknown>, id: string): NoPage<FormulaObject> | null {
  const x = num(r.x, COORD_MIN, COORD_MAX);
  const y = num(r.y, COORD_MIN, COORD_MAX);
  const width = num(r.width, LIMITS.drillWidthMin, LIMITS.drillWidthMax);
  const decimals = int(r.decimals, 0, 4) as FormulaObject["decimals"] | null;
  if (x === null || y === null || width === null || decimals === null) return null;
  if (!Array.isArray(r.lines) || r.lines.length < 1 || r.lines.length > LIMITS.formulaLines) return null;
  const lines: string[] = [];
  for (const l of r.lines as unknown[]) {
    if (typeof l !== "string") return null;
    // Én linje: ingen linjeskift, kontroltegn eller usynlige tegn.
    const clean = l.replace(INVISIBLE, "");
    if (clean.length > LIMITS.formulaLineChars) return null;
    lines.push(clean);
  }
  const title = cleanText(r.title);
  if (title === null) return null;
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  if (cleanTitle.length > LIMITS.formulaTitle) return null;
  return { id, type: "formula", x, y, width, lines, decimals, title: cleanTitle };
}

function parseFigure(r: Record<string, unknown>, id: string, page: number, withCalc: ReadonlySet<string>, notes?: string[]): FigureObject | null {
  const def = getFigureDef(r.figure);
  return def ? parseFigureOf(def, r, id, page, withCalc, notes) : null;
}

function parseFigureOf<K extends FigureKind>(
  def: FigureDefFor<K>,
  r: Record<string, unknown>,
  id: string,
  page: number,
  withCalc: ReadonlySet<string>,
  notes?: string[],
): FigureObject | null {
  const x = num(r.x, COORD_MIN, COORD_MAX);
  const y = num(r.y, COORD_MIN, COORD_MAX);
  if (x === null || y === null) return null;
  const shape = def.validateShape(r.shape);
  if (!shape) return null;
  const rawParams = isObj(r.params) ? r.params : {};
  const params: Record<string, ParamState> = {};
  const aliases: Record<string, string> = {};
  for (const p of def.params) {
    const st = has(rawParams, p.key) && isObj(rawParams[p.key]) ? (rawParams[p.key] as Record<string, unknown>) : {};
    // Manglende synlighed: alt vises, undtagen afledte mål (nye mål i gamle dokumenter forbliver skjulte).
    params[p.key] = { visible: typeof st.visible === "boolean" ? st.visible : !p.derived };
    if (typeof st.alias === "string") {
      const alias = clipAlias(st.alias.replace(INVISIBLE, "").trim()).trim();
      if (alias) aliases[p.key] = alias;
    }
  }
  const fig: FigureObjectFor<K> = { id, type: "figure", figure: def.type, x, y, shape, params, page };
  // Dublet-aliasser (gamle dokumenter fra før aliasConflict): parametre med et regnestykke
  // får aliaset først, derefter vinkler før sider, ellers parameterrækkefølgen. Et alias, der
  // allerede er i brug (som navn eller nøgle på en anden parameter), smides væk med en besked.
  const rank = (p: ParamDef) => (withCalc.has(`${id}:${p.key}`) ? 0 : 2) + (p.kind === "angle" ? 0 : 1);
  const ordered = def.params.map((p, i) => ({ p, i })).sort((x, y) => rank(x.p) - rank(y.p) || x.i - y.i);
  for (const { p } of ordered) {
    const alias = aliases[p.key];
    if (!alias) continue;
    if (!aliasConflict(fig, p.key, alias)) params[p.key] = { ...params[p.key], alias };
    else notes?.push(`Navnet ${alias} var brugt to gange — ${p.key} hedder igen ${p.key}`);
  }
  return asFigure(fig);
}

function parseCalc(r: Record<string, unknown>, id: string, figures: Map<string, FigureObject>): CalcObject | null {
  const x = num(r.x, COORD_MIN, COORD_MAX);
  const y = num(r.y, COORD_MIN, COORD_MAX);
  if (x === null || y === null || typeof r.figureId !== "string" || typeof r.param !== "string") return null;
  const fig = figures.get(r.figureId);
  if (!fig || !has(fig.params, r.param)) return null; // forældreløst regnestykke
  // Regnestykket står altid på figurens side (et gemt `page` ignoreres).
  return { id, type: "calc", x, y, figureId: fig.id, param: r.param, page: fig.page };
}

/** Skemamigrering: tilføj en case pr. ny version. Ukendt version → null. */
function migrateDocument(raw: Record<string, unknown>): Record<string, unknown> | null {
  switch (raw.schemaVersion) {
    case SCHEMA_VERSION:
      return raw;
    default:
      return null;
  }
}

/** Kontrolleret oversættelse af ukendt JSON til et Document — eller null. */
/**
 * `notes` (valgfri) får en dansk besked pr. dublet-alias, der blev smidt væk ved indlæsning,
 * fx "Navnet X var brugt to gange — a hedder igen a".
 */
export function parseDocument(input: unknown, notes?: string[]): SheetDoc | null {
  if (!isObj(input)) return null;
  const raw = migrateDocument(input);
  if (!raw) return null;
  if (typeof raw.subject !== "string" || !SUBJECTS.includes(raw.subject as Subject)) return null;
  if (typeof raw.name !== "string") return null;
  if (!Array.isArray(raw.objects) || raw.objects.length > LIMITS.objects) return null;

  // Navnet kan være tomt i et ikke-gemt ark; ellers renses det.
  const name = raw.name.trim() === "" ? "" : cleanName(raw.name);
  if (name === null) return null;

  // Sider: mangler feltet (dokument fra før sider) → én side; ellers heltal 1–LIMITS.pages.
  const pageCount = has(raw, "pageCount") ? int(raw.pageCount, 1, LIMITS.pages) : 1;
  if (pageCount === null) return null;

  // Hvilke (figur, parameter) har et regnestykke — afgør, hvem der beholder et dublet-alias.
  const withCalc = new Set<string>();
  for (const o of raw.objects as unknown[]) {
    if (isObj(o) && o.type === "calc" && typeof o.figureId === "string" && typeof o.param === "string") withCalc.add(`${o.figureId}:${o.param}`);
  }
  // Første gennemløb: alle objekter undtagen regnestykker (som afhænger af figurerne).
  const figNotes: string[] = [];
  const seen = new Set<string>();
  const parsed = new Map<number, SheetObject>();
  const figures = new Map<string, FigureObject>();
  for (let i = 0; i < raw.objects.length; i++) {
    const o: unknown = raw.objects[i];
    if (!isObj(o) || typeof o.id !== "string" || !ID_RE.test(o.id) || seen.has(o.id)) return null;
    seen.add(o.id);
    if (o.type === "calc") continue; // andet gennemløb (siden følger figuren)
    // Siden: mangler → 0; ellers heltal 0–pageCount−1.
    const page = has(o, "page") ? int(o.page, 0, pageCount - 1) : 0;
    if (page === null) return null;
    if (o.type === "text") {
      const t = parseText(o, o.id);
      if (!t) return null;
      parsed.set(i, { ...t, page });
    } else if (o.type === "figure") {
      const f = parseFigure(o, o.id, page, withCalc, figNotes);
      if (!f) return null;
      parsed.set(i, f);
      figures.set(f.id, f);
    } else if (o.type === "drill") {
      const dr = parseDrill(o, o.id);
      if (!dr) return null;
      parsed.set(i, { ...dr, page });
    } else if (o.type === "formula") {
      const fo = parseFormula(o, o.id);
      if (!fo) return null;
      parsed.set(i, { ...fo, page });
    } else {
      return null; // ukendt type
    }
  }
  // Andet gennemløb: regnestykker. Forældreløse og dubletter smides væk;
  // et regnestykke med ugyldige tal er manipuleret data og afvises.
  const calcKeys = new Set<string>();
  for (let i = 0; i < raw.objects.length; i++) {
    const o = raw.objects[i] as Record<string, unknown>;
    if (o.type !== "calc") continue;
    if (num(o.x, COORD_MIN, COORD_MAX) === null || num(o.y, COORD_MIN, COORD_MAX) === null) return null;
    const c = parseCalc(o, o.id as string, figures);
    if (!c) continue;
    const key = `${c.figureId}:${c.param}`;
    if (calcKeys.has(key)) continue;
    calcKeys.add(key);
    parsed.set(i, c);
  }
  const objects = [...parsed.entries()].sort((a, b) => a[0] - b[0]).map(([, o]) => o);
  notes?.push(...figNotes);

  return { schemaVersion: SCHEMA_VERSION, subject: raw.subject as Subject, name, settings: parseSettings(raw.settings), pageCount, objects };
}
