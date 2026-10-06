// Opgavelab — generisk layout for figurer: etiketternes udstrækning, opgavenummerets
// placering og hele figurens udstrækning på arket (ren TS, ingen React/DOM). Kender
// ingen bestemt figur: alt slås op i registry'et med defOf(fig).

import { defOf } from "../figures/registry";
import type { Label } from "../figures/types";
import { solvedValues } from "../model/figures";
import { DEFAULT_SETTINGS, PT_MM } from "../model/types";
import type { Bounds, FigureObject } from "../model/types";
import { FONT_ASCENT, FONT_DESCENT, LABEL_MM, NUMBER_MM, labelBaseline } from "./primitives";
import type { Measure } from "./textLayout";

/** Foreningen af etiketternes PLACERINGSbokse og `base`. */
function labelsBounds(labels: Label[], base: Bounds): Bounds {
  const b = { ...base };
  for (const l of labels) {
    b.minX = Math.min(b.minX, l.c.x - l.hw);
    b.maxX = Math.max(b.maxX, l.c.x + l.hw);
    b.minY = Math.min(b.minY, l.c.y - l.hh);
    b.maxY = Math.max(b.maxY, l.c.y + l.hh);
  }
  return b;
}

/** Foreningen af etiketternes TEGNEDE tekst (fontens linjeboks, som getBBox) og `base`. */
function labelsInk(labels: Label[], base: Bounds): Bounds {
  const b = { ...base };
  for (const l of labels) {
    const baseline = labelBaseline(l.c.y);
    b.minX = Math.min(b.minX, l.c.x - l.hw);
    b.maxX = Math.max(b.maxX, l.c.x + l.hw);
    b.minY = Math.min(b.minY, baseline - FONT_ASCENT * LABEL_MM);
    b.maxY = Math.max(b.maxY, baseline + FONT_DESCENT * LABEL_MM);
  }
  return b;
}

/**
 * Svararkets etiketter fylder mest; facit kan have en anden bredde end figurens egen værdi
 * (fx 9,9 → 10,0 cm). Pladsen regnes derfor som foreningen af begge varianter, så den kun
 * afhænger af figuren (ikke af dokumentets regnestykker) og er ens overalt.
 */
function svararkBounds(
  fig: FigureObject,
  measure: Measure,
  union: (labels: Label[], base: Bounds) => Bounds,
): Bounds {
  const def = defOf(fig);
  const base = union(def.labels(fig, "svarark", measure), def.bounds(fig.shape));
  const solved = solvedValues(fig, DEFAULT_SETTINGS);
  return Object.keys(solved).length === 0 ? base : union(def.labels(fig, "svarark", measure, solved), base);
}

export type NumberBox = { x: number; baseline: number; box: Bounds };

/** Opgavenummerets placering (lokale mm): til venstre for etiketterne, øverst. Ens i begge modes. */
export function numberBox(fig: FigureObject, number: string, measure: Measure): NumberBox {
  // Svararket viser alle værdier, så dets etiketter er de bredeste: placér ud fra dem.
  const ext = svararkBounds(fig, measure, labelsBounds);
  const w = measure(number, NUMBER_MM / PT_MM, true);
  const x = ext.minX - 3.5 - w;
  const baseline = ext.minY + NUMBER_MM * 0.73;
  // box = den tegnede tekst (fontens linjeboks), til udstrækning og markering.
  return {
    x,
    baseline,
    box: { minX: x, minY: baseline - FONT_ASCENT * NUMBER_MM, maxX: x + w, maxY: baseline + FONT_DESCENT * NUMBER_MM },
  };
}

/**
 * Hele figurens udstrækning på ARKET inkl. etiketter (som på svararket) og opgavenummer —
 * som tegnet (fontens linjeboks), så intet rager ud over margenen eller markeringsrammen.
 * Editoren holder denne boks inden for arkets margen.
 */
export function figureExtent(fig: FigureObject, number: string, measure: Measure): Bounds {
  let b = svararkBounds(fig, measure, labelsInk);
  if (number) {
    const nb = numberBox(fig, number, measure).box;
    b = {
      minX: Math.min(b.minX, nb.minX),
      minY: Math.min(b.minY, nb.minY),
      maxX: Math.max(b.maxX, nb.maxX),
      maxY: Math.max(b.maxY, nb.maxY),
    };
  }
  return { minX: fig.x + b.minX, minY: fig.y + b.minY, maxX: fig.x + b.maxX, maxY: fig.y + b.maxY };
}
