import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const jungle: Theme = {
  id: "jungle",
  name: "Jungle",
  blurb: "Elefanter, aber, tigre og papegøjer",
  creatures,
  zone: "ground",
  openRange: [36, 70],
  noun: "dyr",
  nounDefinite: "dyrene",
  place: "i junglen",
  backdrop: "#cfe8b8",
  showcase: ["monkey", "toucan", "frog"],
  Background,
  Foreground,
};
