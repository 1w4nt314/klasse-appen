import type { Rarity } from "../themes/types";

/**
 * Sjældenhed: navn og hvor ofte figuren vælges, når der kommer en ny
 * (relativ vægt — almindelig = 1).
 */
export const RARITY: Record<Rarity, { label: string; weight: number }> = {
  common: { label: "Almindelig", weight: 1 },
  uncommon: { label: "Usædvanlig", weight: 0.5 },
  rare: { label: "Sjælden", weight: 0.2 },
  legendary: { label: "Legendarisk", weight: 0.06 },
};

/** Figurer man allerede har spottet, kommer en anelse oftere igen. */
export const SPOTTED_BONUS = 1.15;

/** Så længe skal en figur have været helt fremme på skærmen, før den tæller som spottet. */
export const SPOT_MS = 5000;

/** Lærerens egen samling — bruges, når der ikke er valgt en klasse. */
export const MY_COLLECTION = "mine";
