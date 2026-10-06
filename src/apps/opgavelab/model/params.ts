// Opgavelab — viste navne og synlighed for en figurs parametre. Kun type-imports,
// så figurfilerne (figures/*) kan bruge dem uden at importere registry'et (ingen cyklus).

import type { ParamState } from "./types";

type HasParams = { params: Record<string, ParamState> };

/** Viste navn: alias ?? nøgle. Afledes live, så omdøbning slår igennem på regnestykker. */
export function displayName(fig: HasParams, param: string): string {
  const alias = fig.params[param]?.alias?.trim();
  return alias ? alias : param;
}

/** Mængden af synlige parametre (til solve). */
export function visibleParams(fig: HasParams): Set<string> {
  const out = new Set<string>();
  for (const [key, st] of Object.entries(fig.params)) if (st.visible) out.add(key);
  return out;
}
