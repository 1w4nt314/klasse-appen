// Opgavelab — den fulde figurdefinition: geometri (core/*) + tegning, etiketter,
// oprettelse, ikon og navn. Se udvidelses-guiden øverst i figures/registry.ts.

import type { ReactNode } from "react";
import type { FigureGeometry, FigureObjectOf, Point } from "../model/types";
import type { Measure } from "../render/textLayout";

export type SheetMode = "opgave" | "svarark";

/** Værktøjspanelets figurgrupper (rækkefølge og titler: GROUPS i figures/registry.ts). */
export type FigureGroup = "trekanter" | "firkanter" | "cirkler" | "rumfigurer";

/** En placeret etiket: tekstens centrum (c) og halve mål, i figurens lokale mm. */
export type Label = {
  key: string;
  text: string;
  c: Point;
  hw: number;
  hh: number;
  bold?: boolean;
  fill: string;
  data: Record<`data-${string}`, string>;
  /** Kun sideetiketter: sidens retning, så etiketten kan glide langs siden. */
  dir?: Point;
  /** Kun sideetiketter: enhedsnormal væk fra figuren. */
  n?: Point;
};

export type FigureDef<K extends string, S> = FigureGeometry<S> & {
  /** Registry-nøglen (gemmes i dokumentet som `figure`). */
  type: K;
  /** Visningsnavn: værktøjsknap, skærmlæser-etiketter. */
  name: string;
  /** Gruppen i værktøjspanelet (fx "trekanter"). */
  group: FigureGroup;
  /**
   * Skærmlæsernavn for et håndtag (aria-label), fx "Håndtag for l". Udeladt → "Hjørne {navn}"
   * (trekanter). `displayName` er parameterens viste navn (alias ?? nøgle).
   */
  handleName?(key: string, displayName: string): string;
  /** Værktøjsknappens ikon: indholdet af en 24×24-viewBox (brug stroke="currentColor"). */
  icon(): ReactNode;
  /** Formen, en ny figur lægges på arket med (defaultShape() er formen ved indlæsning/test). */
  newShape(): S;
  /**
   * Etiketter (navne og værdier) i lokale mm. Tegnes af SheetSvg med fælles typografi, og
   * bruges til figurens udstrækning (margen, markering, opgavenummer, regnestykkeplacering).
   * @param solved svararket: facit for skjulte parametre med et regnestykke (param → værdi).
   */
  labels(fig: FigureObjectOf<K, S>, mode: SheetMode, measure: Measure, solved?: Record<string, number>): Label[];
  /** Figurens streger (uden etiketter) i lokale mm. Kun SVG-elementer svg2pdf forstår, ingen <style>. */
  drawing(fig: FigureObjectOf<K, S>, mode: SheetMode): ReactNode;
};
