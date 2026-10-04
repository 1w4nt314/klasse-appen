import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const farm: Theme = {
  id: "farm",
  name: "Bondegård",
  blurb: "Køer, grise, får og høns",
  creatures,
  zone: "ground",
  openRange: [36, 70],
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "på gården",
  backdrop: "#bfe5f8",
  showcase: ["pig", "hen", "rabbit"],
  Background,
  Foreground,
};
