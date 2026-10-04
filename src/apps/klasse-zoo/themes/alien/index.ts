import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const alien: Theme = {
  id: "alien",
  name: "Alien planet",
  blurb: "PLADSHOLDER",
  creatures,
  zone: "ground",
  noun: "rumvæsner",
  nounDefinite: "rumvæsnerne",
  place: "på planeten",
  backdrop: "#2a1f4a",
  showcase: ["placeholder", "placeholder", "placeholder"],
  Background,
  Foreground,
};
