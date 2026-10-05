import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const skov: Theme = {
  id: "skov",
  name: "Den danske skov",
  blurb: "Egern, rådyr, pindsvin og ugler",
  creatures,
  zone: "ground",
  openRange: [44, 72],
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "i skoven",
  backdrop: "#cfe8d2",
  showcase: ["squirrel", "hedgehog", "roeDeer"],
  Background,
  Foreground,
};
