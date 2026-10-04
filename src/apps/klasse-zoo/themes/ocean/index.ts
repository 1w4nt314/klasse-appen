import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const ocean: Theme = {
  id: "ocean",
  name: "Akvarium",
  blurb: "PLADSHOLDER",
  creatures,
  zone: "ground",
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "i akvariet",
  backdrop: "#1d6f9a",
  showcase: ["placeholder", "placeholder", "placeholder"],
  Background,
  Foreground,
};
