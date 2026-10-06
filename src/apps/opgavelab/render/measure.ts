// Opgavelab — tekstmåling i browseren med canvas og samme font som arket
// ("OpgavelabSans" = DejaVu Sans fra /fonts). Kun til brug i klientkode.

import { useEffect, useMemo, useState } from "react";
import { PT_MM, estimateMeasure, type Measure } from "./textLayout";

export const FONT_FAMILY = "OpgavelabSans";

let ctx: CanvasRenderingContext2D | null | undefined;

function context(): CanvasRenderingContext2D | null {
  if (ctx !== undefined) return ctx;
  try {
    ctx = document.createElement("canvas").getContext("2d");
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Måler i mm. Måles ved 100 px og skaleres, så afrunding af små størrelser ikke slår igennem. */
export const measureText: Measure = (text, sizePt, bold = false) => {
  const c = context();
  if (!c) return estimateMeasure(text, sizePt, bold);
  c.font = `${bold ? 700 : 400} 100px ${FONT_FAMILY}, sans-serif`;
  return (c.measureText(text).width / 100) * sizePt * PT_MM;
};

/** Henter begge snit af arkets font (bruges også af eksporten). */
export function loadSheetFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return Promise.all([
    document.fonts.load(`12px ${FONT_FAMILY}`),
    document.fonts.load(`700 12px ${FONT_FAMILY}`),
  ]).then(() => undefined);
}

/**
 * Giver en måler, der skifter identitet når fonten er hentet, så ark og
 * markering tegnes om med de rigtige mål.
 */
export function useSheetMeasure(): Measure {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    loadSheetFonts()
      .catch(() => undefined)
      .then(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);
  // ready indgår kun for at give en ny funktion-identitet efter fontindlæsning.
  return useMemo<Measure>(() => (ready ? measureText : estimateMeasure), [ready]);
}
