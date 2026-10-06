// Opgavelab — datamodel. Kun typer og konstanter (ingen runtime-afhængigheder),
// så filen kan importeres fra core/* med `import type` og køres i Node med
// --experimental-strip-types.

export const SCHEMA_VERSION = 1 as const;

export type Subject = "matematik"; // flere fag senere

/** Millimeter på arket (1 SVG-enhed = 1 mm). */
export type Mm = number;
export type Point = { x: Mm; y: Mm };
export type Bounds = { minX: Mm; minY: Mm; maxX: Mm; maxY: Mm };

/** Synlighed og evt. alias for en parameter (alias vises i stedet for nøglen, fx C → "X"). */
export type ParamState = { visible: boolean; alias?: string };

export type TextObject = { id: string; type: "text"; x: Mm; y: Mm; width: Mm; text: string; sizePt: number };

/** Retvinklet trekant i dansk notation: C = 90°, a = BC, b = AC (kateter i mm). */
export type RightTriangleShape = {
  a: Mm;
  b: Mm;
  /** Grader, retning C→B (SVG-koordinater, y nedad). */
  rotation: number;
  /** true: A ligger på den modsatte side af CB. */
  mirror: boolean;
};

// Figurtyperne (FigureKind, FigureShape, FigureObject) afledes af registry'et i
// figures/registry.ts, så en ny figur kun kræver én ny fil + én linje dér.
import type { FigureObject } from "../figures/registry";
export type { FigureKind, FigureObject, FigureShape } from "../figures/registry";

/** En figur på arket med en bestemt nøgle K og form S (FigureObject er unionen pr. figur). */
export type FigureObjectOf<K extends string, S> = {
  id: string;
  type: "figure";
  figure: K;
  /** Anker på arket (for retvinklet trekant = hjørne C). */
  x: Mm;
  y: Mm;
  shape: S;
  /** Fx a, b, c, A, B, C for den retvinklede trekant. */
  params: Record<string, ParamState>;
};

export type CalcObject = { id: string; type: "calc"; x: Mm; y: Mm; figureId: string; param: string };

export type SheetObject = TextObject | FigureObject | CalcObject;

export type DocSettings = {
  /** "power" → tan⁻¹, "arc" → arctan. */
  inverseNotation: "power" | "arc";
  snapCm: 0 | 0.5;
  snapDeg: boolean;
};

export type Document = {
  schemaVersion: 1;
  subject: Subject;
  name: string;
  settings: DocSettings;
  objects: SheetObject[];
};

export const PAGE = { w: 210, h: 297, margin: 10 } as const;

/** 1 pt i mm. */
export const PT_MM = 25.4 / 72;

export const LIMITS = {
  objects: 200,
  textChars: 2000,
  nameChars: 60,
  jsonBytes: 200_000,
  sideMinCm: 1,
  sideMaxCm: 15,
} as const;

/** Højst så mange tegn (kodepunkter) i et alias. */
export const ALIAS_MAX = 6;

export const DEFAULT_SETTINGS: DocSettings = { inverseNotation: "power", snapCm: 0.5, snapDeg: true };

// ---- Figurgeometri (implementeres i core/*; den fulde FigureDef i figures/types.ts) ----

export type ParamKind = "length" | "angle" | "area";
export type ParamDef = { key: string; label: string; kind: ParamKind };

/** Formatering injiceres i solve, så core-filerne ikke har runtime-imports. */
export type Fmt = {
  /** Længde i cm med enhed, fx "5,0 cm". */
  len: (cm: number) => string;
  /** Vinkel i grader med gradtegn, fx "36,9°" / "90°". */
  ang: (deg: number) => string;
  /** Rent tal med decimalkomma og U+2212-minus, fx "8,0". */
  num: (n: number, decimals: number) => string;
};

export type Solution = {
  target: string;
  /** Med aktuelle navne, fx "X = 180° − A − B". */
  formula: string;
  /** Højresiden med indsatte (afrundede) tal, fx "180° − 53,1° − 36,9°". */
  substituted: string;
  /** Formateret resultat, fx "90°". */
  result: string;
  /** Værdi (cm eller grader) regnet på de viste, afrundede tal; uafrundet resultat. */
  value: number;
  /** true: resultatet er afrundet → vis "≈" før det; false: eksakt → "=". */
  approx: boolean;
  kind: ParamKind;
};

export type DragOpts = {
  /** Snap af længder i mm; 0 eller mindre = ingen snap. */
  snapMm: number;
  snapDeg: boolean;
  /** Vinkelsnap-trin i grader (standard 1; fx 15 med shift). */
  degStep?: number;
};

/** Resultat af et hjørnetræk. offset lægges til figurens anker (x, y). */
export type DragResult<S> = { shape: S; offset: Point };

/** Geometri og Find-regler for en figur: ren TS uden React/DOM, testbar i Node. */
export type FigureGeometry<S> = {
  params: ParamDef[];
  defaultShape(): S;
  /** Lokale mm-koordinater relativt til ankeret. */
  vertices(shape: S): Record<string, Point>;
  /** cm og grader, uafrundet. */
  compute(shape: S): Record<string, number>;
  solve(
    target: string,
    visible: ReadonlySet<string>,
    values: Record<string, number>,
    names: Record<string, string>,
    fmt: Fmt,
    settings: DocSettings,
  ): Solution | null;
  /** Mulige sæt af givne parametre for target (til advarselstekst). */
  solvableFrom(target: string): string[][];
  /** local = pointer relativt til ankeret ved trækkets start. */
  dragVertex(shape: S, vertex: string, local: Point, opts: DragOpts): DragResult<S>;
  validateShape(raw: unknown): S | null;
  /** Lokal bounding box relativt til ankeret. */
  bounds(shape: S): Bounds;
};
