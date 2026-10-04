import type { ComponentType } from "react";

export type AppManifest = {
  /** URL-navn: /apps/<slug>. Skal matche mappenavnet i src/apps/. */
  slug: string;
  name: string;
  /** Én linje på kortet i app-oversigten. */
  tagline: string;
  description: string;
  /** Korte emner, fx "Ro i klassen". */
  tags: string[];
  /** Hvad appen kræver af computeren i klassen. */
  requires?: ("mikrofon" | "kamera" | "fuld skærm")[];
  /** Illustration til app-kortet. Skal fylde sin container. */
  Thumbnail: ComponentType;
  /** Version vist på kortet. */
  version: string;
};
