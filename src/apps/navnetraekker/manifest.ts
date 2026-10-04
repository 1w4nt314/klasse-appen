import type { AppManifest } from "../types";
import { Thumbnail } from "./Thumbnail";

export const manifest: AppManifest = {
  slug: "navnetraekker",
  name: "Navnetrækker",
  tagline: "Træk et navn eller lav grupper – retfærdigt.",
  description:
    "Træk tilfældige elever på tavlen med en flot animation. Ingen trækkes igen, før alle har været oppe, og fraværende springes over. Lav også tilfældige grupper i den størrelse du vil. Klasselisterne gemmes kun i din browser.",
  tags: ["Fordeling", "Grupper"],
  Thumbnail,
  version: "V1",
};
