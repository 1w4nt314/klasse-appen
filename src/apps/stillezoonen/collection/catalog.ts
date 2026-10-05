import { creatures as alien } from "../themes/alien/creatures";
import { creatures as dino } from "../themes/dino/creatures";
import { creatures as farm } from "../themes/farm/creatures";
import { creatures as jungle } from "../themes/jungle/creatures";
import { creatures as ocean } from "../themes/ocean/creatures";

/**
 * Hvilke figurer der findes i hvert tema — så serveren kun gemmer
 * spottede figurer, der rent faktisk findes.
 */
const CATALOG: Record<string, ReadonlySet<string>> = {
  jungle: new Set(Object.keys(jungle)),
  farm: new Set(Object.keys(farm)),
  ocean: new Set(Object.keys(ocean)),
  alien: new Set(Object.keys(alien)),
  dino: new Set(Object.keys(dino)),
};

export const isKnownCreature = (theme: unknown, creature: unknown) =>
  typeof theme === "string" &&
  typeof creature === "string" &&
  Object.hasOwn(CATALOG, theme) &&
  CATALOG[theme].has(creature);
