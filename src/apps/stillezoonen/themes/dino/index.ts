import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const dino: Theme = {
  id: "dino",
  name: "Dino-dalen",
  blurb: "Dinosaurer, flyveøgler og dino-unger",
  creatures,
  zone: "ground",
  openRange: [44, 72],
  noun: "dinoer",
  nounDefinite: "dinoerne",
  place: "i dalen",
  backdrop: "#f6c98a",
  showcase: ["triceratops", "tRex", "stegosaurus"],
  Background,
  Foreground,
};
