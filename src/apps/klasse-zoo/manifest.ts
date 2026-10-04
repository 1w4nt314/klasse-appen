import type { AppManifest } from "../types";
import { Thumbnail } from "./Thumbnail";

export const manifest: AppManifest = {
  slug: "klasse-zoo",
  name: "Klasse Zoo",
  tagline: "Ro i klassen lokker junglens dyr frem.",
  description:
    "Mikrofonen måler lydniveauet i klassen. Så længe det er under den grænse du sætter, går dyrene langsomt ind i junglen. Bliver det for larmende, løber de væk – og kommer først tilbage når der er ro igen.",
  tags: ["Ro i klassen", "Lydniveau"],
  requires: ["mikrofon"],
  Thumbnail,
  version: "V1",
};
