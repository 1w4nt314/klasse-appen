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

/**
 * Fri trekant (SSS) i dansk notation: a = BC, b = AC, c = AB i mm. Ankeret er hjørne A; B ligger
 * c mm fra A i retningen `rotation`, og C ligger på den side af AB, `mirror` angiver.
 */
export type TriangleShape = {
  a: Mm;
  b: Mm;
  c: Mm;
  /** Grader, retning A→B (SVG-koordinater, y nedad). */
  rotation: number;
  /** false: C ligger til venstre for A→B (over AB, når AB peger mod højre); true: til højre. */
  mirror: boolean;
};

/** Rektangel: længde l (vandret) og bredde b (lodret) i mm; ankeret er øverste venstre hjørne. */
export type RectangleShape = { l: Mm; b: Mm };

/** Kvadrat: side s i mm; ankeret er øverste venstre hjørne. */
export type SquareShape = { s: Mm };

/**
 * Parallelogram: grundlinje g (vandret) og skrå side b i mm, vinkel v (grader) ved nederste
 * venstre hjørne mellem g og b (20–90°; venstrehældende er den spejlede, samme figur).
 * Ankeret er nederste venstre hjørne.
 */
export type ParallelogramShape = { g: Mm; b: Mm; v: number };

/**
 * Trapez (parallelle sider vandrette): a nederst, b øverst, højde h og forskydning off (mm) af
 * øverste venstre hjørne i forhold til nederste venstre. Ankeret er nederste venstre hjørne.
 */
export type TrapezoidShape = { a: Mm; b: Mm; h: Mm; off: Mm };

/** Cirkel: radius r i mm; ankeret er centrum. */
export type CircleShape = { r: Mm };

/**
 * Kasse (retvinklet prisme) i kavalerperspektiv: længde l (vandret), bredde b (dybden, tegnes halv
 * størrelse under 45°) og højde h i mm. Ankeret er det forreste nederste venstre hjørne.
 */
export type BoxShape = { l: Mm; b: Mm; h: Mm };

/** Terning med side s i mm (tegnes som kassen med l = b = h = s); ankeret som kassen. */
export type CubeShape = { s: Mm };

// Figurtyperne (FigureKind, FigureShape, FigureObject) afledes af registry'et i
// figures/registry.ts, så en ny figur kun kræver én ny fil + én linje dér.
import type { FigureObject } from "../figures/registry";
export type { FigureKind, FigureObject, FigureShape } from "../figures/registry";

/** En figur på arket med en bestemt nøgle K og form S (FigureObject er unionen pr. figur). */
export type FigureObjectOf<K extends string, S> = {
  id: string;
  type: "figure";
  figure: K;
  /** Anker på arket: figurens naturlige punkt (retvinklet trekant: hjørne C; fri trekant: hjørne A; rektangel: øverste venstre; cirkel: centrum; kasse/terning: forreste nederste venstre hjørne …). */
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

export type ParamKind = "length" | "angle" | "area" | "volume";
export type ParamDef = {
  key: string;
  label: string;
  kind: ParamKind;
  /** Afledt mål (areal, omkreds, rumfang …): standard skjult og tegnes kun når synligt. */
  derived?: true;
  /**
   * Parameteren har ingen Find-regel (solvableFrom er tom): Find-knappen er slået fra, og panelet
   * viser denne forklaring (udeladt → en almindelig tekst).
   */
  noFind?: string;
};

/** Formatering injiceres i solve, så core-filerne ikke har runtime-imports. */
export type Fmt = {
  /** Længde i cm med enhed, fx "5,0 cm". */
  len: (cm: number) => string;
  /** Vinkel i grader med gradtegn, fx "36,9°" / "90°". */
  ang: (deg: number) => string;
  /** Areal i cm² med enhed, fx "14,4 cm²". */
  area: (cm2: number) => string;
  /** Rumfang i cm³ med enhed, fx "141,4 cm³". */
  vol: (cm3: number) => string;
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
  /**
   * Snap slået fra på arket (snapCm 0, "fri"): B og A tager stadig snapMm-trin, men et
   * C-træk bevarer c præcist i stedet for at runde kateterne til hele mm.
   */
  free?: boolean;
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
  /** Klik-flade (polygon i lokale mm); udeladt → hjørnerne fra vertices(). */
  outline?(shape: S): Point[];
};

/** En Find-regel: givne parametre, højreside og udregning (core/solveKit.ts). */
export type Rule = {
  given: string[];
  /** Højreside med {param} for parametre og {inv:fn} for inverse trig-funktioner; π skrives som "π". */
  rhs: string;
  /** Udregningen på de viste tal (π som Math.PI). */
  value: (v: Record<string, number>) => number;
};

/** Data til makeSolver i core/solveKit.ts. */
export type SolveSpec = {
  /** Parameter → størrelsestype (formatering og tolerance). */
  kinds: Record<string, ParamKind>;
  /** Target → regler i prioriteret rækkefølge (første inden for tolerancen vinder). */
  rules: Record<string, Rule[]>;
  /** Faste værdier (fx C = 90° i den retvinklede trekant), brugt i stedet for compute(). */
  fixed?: Record<string, number>;
};

/** Hvad en core-fil eksporterer: geometrien + regeldata; solve/solvableFrom laves af makeSolver. */
export type FigureSpec<S> = Omit<FigureGeometry<S>, "solve" | "solvableFrom"> & SolveSpec;
