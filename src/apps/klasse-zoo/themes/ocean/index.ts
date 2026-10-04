import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const ocean: Theme = {
  id: "ocean",
  name: "Akvarium",
  blurb: "Fisk, skildpadder og vandmænd",
  creatures,
  zone: "open",
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "i akvariet",
  backdrop: "#2a93c6",
  showcase: ["clownfish", "pufferfish", "crab"],
  Background,
  Foreground,
};
