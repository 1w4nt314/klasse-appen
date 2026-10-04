"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const Loading = () => (
  <div className="grid min-h-dvh place-items-center text-muted">Henter app …</div>
);

/** Appens selve kode hentes først når den åbnes. */
const components: Record<string, ComponentType> = {
  "klasse-zoo": dynamic(() => import("./klasse-zoo/KlasseZoo"), {
    ssr: false,
    loading: Loading,
  }),
};

export function AppRuntime({ slug }: { slug: string }) {
  const App = components[slug];
  return App ? <App /> : null;
}
