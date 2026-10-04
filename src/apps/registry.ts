import { manifest as klasseZoo } from "./klasse-zoo/manifest";
import { manifest as navnetraekker } from "./navnetraekker/manifest";
import type { AppManifest } from "./types";

/**
 * Alle apps på Klasse-appen. Ny app:
 *   1. Opret mappen src/apps/<slug>/ med manifest.ts og en default-eksporteret
 *      klientkomponent.
 *   2. Tilføj manifestet her og komponenten i runtime.tsx.
 */
export const apps: AppManifest[] = [klasseZoo, navnetraekker];

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}
