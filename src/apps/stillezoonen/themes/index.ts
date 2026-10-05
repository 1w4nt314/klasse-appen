import { alien } from "./alien";
import { dino } from "./dino";
import { farm } from "./farm";
import { jungle } from "./jungle";
import { ocean } from "./ocean";
import type { Theme } from "./types";

/** Alle temaer i Stillezoonen, i den rækkefølge de vises i temavælgeren. */
export const THEMES: Theme[] = [jungle, farm, ocean, alien, dino];

export function getTheme(id: string | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
