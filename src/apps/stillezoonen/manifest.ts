import type { AppManifest } from "../types";
import { Thumbnail } from "./Thumbnail";

export const manifest: AppManifest = {
  slug: "stillezoonen",
  name: "Stillezoonen",
  tagline: "Ro i klassen lokker dyrene frem.",
  description:
    "Mikrofonen måler lydniveauet i klassen. Så længe det er under den grænse du sætter, kommer dyrene langsomt frem – i junglen, på bondegården, i akvariet eller på en fremmed planet. Bliver det for larmende, løber de væk – og kommer først tilbage når der er ro igen.",
  tags: ["Ro i klassen", "Lydniveau"],
  requires: ["mikrofon"],
  Thumbnail,
  version: "V1",
};
