import type { Theme } from "../types";
import { Background, Foreground } from "./Background";
import { creatures } from "./creatures";

export const alien: Theme = {
  id: "alien",
  name: "Alien planet",
  blurb: "Søde rumvæsner og UFO'er",
  creatures,
  zone: "ground",
  noun: "rumvæsner",
  nounDefinite: "rumvæsnerne",
  place: "på planeten",
  backdrop: "#3a2a7a",
  showcase: ["greenAlien", "blob", "robot"],
  Background,
  Foreground,
};
