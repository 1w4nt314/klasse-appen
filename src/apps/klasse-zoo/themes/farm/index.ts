import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const farm: Theme = {
  id: "farm",
  name: "Bondegård",
  blurb: "PLADSHOLDER",
  creatures,
  zone: "ground",
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "på gården",
  backdrop: "#cfe6f5",
  showcase: ["placeholder", "placeholder", "placeholder"],
  Background,
  Foreground,
};
