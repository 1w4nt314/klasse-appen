import type { ComponentType, ReactNode } from "react";

/**
 * Bevægelsesformer. CSS i zoo.css animerer figurens grupper ud fra dem:
 *   walk    → `zoo-leg-a`/`zoo-leg-b` svinger i modfase, kroppen vipper
 *   hop     → hele kroppen hopper
 *   slither → `zoo-seg`-grupper (med `--i` = index) bølger i forskudt takt
 *   swim    → kroppen svajer let, `zoo-tail` vifter
 *   float   → kroppen svæver op og ned
 */
export type Gait = "walk" | "hop" | "slither" | "swim" | "float";

/** Hvor en figur opholder sig: på jorden (dybde-bånd) eller frit i vandet/luften. */
export type Zone = "ground" | "open";

export type CreatureSpec = {
  name: string;
  /** Højde i procent af scenens højde når figuren er forrest. */
  height: number;
  /** viewBox-bredde / -højde. */
  aspect: number;
  gait: Gait;
  /** Relativ hastighed (1 = normal). */
  pace: number;
  viewBox: string;
  /** Tegnet i profil, vendt mod højre, med fødderne/bunden på viewBox'ens bund. */
  art: ReactNode;
  /** Overstyrer temaets zone, fx en krabbe der går på havbunden. */
  zone?: Zone;
};

export type Theme = {
  id: string;
  /** Vises i temavælgeren. */
  name: string;
  /** Kort beskrivelse til temavælgeren. */
  blurb: string;
  creatures: Record<string, CreatureSpec>;
  /** Standardzone for temaets figurer. */
  zone: Zone;
  /** "dyr" / "rumvæsner" — bruges i tælleren. */
  noun: string;
  /** "dyrene" / "rumvæsnerne" — bruges i "Shhh"-beskeden. */
  nounDefinite: string;
  /** "i junglen" / "på gården" … */
  place: string;
  /** Baggrundsfarve bag scenen (vises kun et øjeblik mens SVG'en indlæses). */
  backdrop: string;
  /** Tre figur-nøgler til startskærmen og temavælgeren. */
  showcase: [string, string, string];
  Background: ComponentType<{ className?: string; animated?: boolean }>;
  Foreground: ComponentType<{ className?: string }>;
};
