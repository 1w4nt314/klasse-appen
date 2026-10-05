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

/** Nøgler i FIGURES-registry. Udvides pr. ny figur. */
export type FigureKind = "rightTriangle";
/** Figur-specifik form. Bliver en union, når flere figurer kommer til. */
export type FigureShape = RightTriangleShape;

export type FigureObject = {
  id: string;
  type: "figure";
  figure: FigureKind;
  /** Anker på arket (for retvinklet trekant = hjørne C). */
  x: Mm;
  y: Mm;
  shape: FigureShape;
  /** a, b, c, A, B, C (senere O, T). */
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

export const LIMITS = {
  objects: 200,
  textChars: 2000,
  nameChars: 60,
  jsonBytes: 200_000,
  sideMinCm: 1,
  sideMaxCm: 15,
} as const;

export const DEFAULT_SETTINGS: DocSettings = { inverseNotation: "power", snapCm: 0.5, snapDeg: true };

// ---- Figur-registry-typer (implementeres i core/*, samles i model/figures.ts) ----

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
  /** Uafrundet værdi (cm eller grader). */
  value: number;
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

export type FigureDef<S> = {
  type: FigureKind;
  name: string;
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
