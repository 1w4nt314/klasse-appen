import type { CreatureSpec } from "../types";
import { base } from "./creatures-1";
import { more } from "./creatures-2";
import { evenMore } from "./creatures-3";
import { yetMore } from "./creatures-4";
import { specials } from "./specials";
import { specialsTwo } from "./specials-2";
import { specialsThree } from "./specials-3";
import { variants } from "./variants";

/** Alle figurer i Dino-dalen. */
export const creatures: Record<string, CreatureSpec> = {
  ...base,
  ...more,
  ...evenMore,
  ...yetMore,
  ...variants,
  ...specials,
  ...specialsTwo,
  ...specialsThree,
};
