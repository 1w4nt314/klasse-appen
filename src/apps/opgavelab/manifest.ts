import type { AppManifest } from "../types";
import { Thumbnail } from "./Thumbnail";

export const manifest: AppManifest = {
  slug: "opgavelab",
  name: "Opgavelab",
  tagline: "Opgaveark med figurer – og svarark med ét klik.",
  description:
    "Byg et opgaveark i matematik: læg tekst og figurer på et A4-ark, træk i hjørnerne og se sidelængder og vinkler ændre sig. Vælg hvad eleverne skal se, og lav regnestykker som 1a, 1b, 2a … – svararket med udregninger følger med.",
  tags: ["Matematik", "Opgaveark"],
  Thumbnail,
  version: "V1",
};
