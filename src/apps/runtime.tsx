"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const Loading = () => (
  <div className="grid min-h-dvh place-items-center text-muted">Henter app …</div>
);

/**
 * Props alle apps får. `userKey` er den indloggede lærers id — bruges fx til at
 * holde data i browseren adskilt pr. lærer på en fælles computer.
 */
export type AppProps = { userKey: string };

/** Appens selve kode hentes først når den åbnes. */
const components: Record<string, ComponentType<AppProps>> = {
  "klasse-zoo": dynamic(() => import("./klasse-zoo/KlasseZoo"), {
    ssr: false,
    loading: Loading,
  }),
  navnetraekker: dynamic(() => import("./navnetraekker/Navnetraekker"), {
    ssr: false,
    loading: Loading,
  }),
};

export function AppRuntime({ slug, userKey }: { slug: string; userKey: string }) {
  const App = components[slug];
  return App ? <App userKey={userKey} /> : null;
}
