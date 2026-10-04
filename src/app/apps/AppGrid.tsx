"use client";

import Link from "next/link";
import { useEffect, useOptimistic, useState, useTransition, type ReactNode } from "react";
import type { AppManifest } from "@/apps/types";
import { setFavorite } from "./actions";

export type AppCardData = Omit<AppManifest, "Thumbnail"> & { thumbnail: ReactNode };

const LOCAL_KEY = "klasse-appen:favorites";

export function AppGrid({
  apps,
  initialFavorites,
  persist,
}: {
  apps: AppCardData[];
  initialFavorites: string[];
  /** false i demo-tilstand: favoritter gemmes kun i browseren. */
  persist: boolean;
}) {
  const [saved, setSaved] = useState(initialFavorites);
  const [favorites, setOptimistic] = useOptimistic(saved);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (persist) return;
    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage findes først i browseren
      if (Array.isArray(local)) setSaved(local);
    } catch {}
  }, [persist]);

  const toggle = (slug: string) => {
    const on = !favorites.includes(slug);
    const next = on ? [...favorites, slug] : favorites.filter((s) => s !== slug);
    startTransition(async () => {
      setOptimistic(next);
      if (persist) {
        const res = await setFavorite(slug, on);
        if (!res.ok) return; // Optimistisk tilstand rulles tilbage af sig selv.
      } else {
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
        } catch {}
      }
      setSaved(next);
    });
  };

  const favApps = favorites
    .map((slug) => apps.find((a) => a.slug === slug))
    .filter((a): a is AppCardData => Boolean(a));

  return (
    <div className="mt-8 space-y-10">
      {favApps.length > 0 && (
        <section aria-labelledby="fav-heading">
          <h2 id="fav-heading" className="mb-4 flex items-center gap-2 text-lg font-extrabold">
            <StarIcon filled className="size-5 text-star" /> Favoritter
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favApps.map((app) => (
              <li key={app.slug}>
                <AppCard app={app} favorite onToggle={() => toggle(app.slug)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-heading">
        <h2 id="all-heading" className="mb-4 text-lg font-extrabold">
          Alle apps
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <li key={app.slug}>
              <AppCard
                app={app}
                favorite={favorites.includes(app.slug)}
                onToggle={() => toggle(app.slug)}
              />
            </li>
          ))}
          <li>
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-line-strong p-6 text-center">
              <span className="text-3xl text-line-strong" aria-hidden="true">
                +
              </span>
              <p className="mt-2 font-bold">Flere apps på vej</p>
              <p className="mt-1 text-sm text-muted">
                Nye apps dukker automatisk op her, når de er klar.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}

function AppCard({
  app,
  favorite,
  onToggle,
}: {
  app: AppCardData;
  favorite: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-brand">
      <div className="aspect-[16/9] overflow-hidden border-b border-line">
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
          {app.thumbnail}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-extrabold">
            <Link
              href={`/apps/${app.slug}`}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {app.name}
            </Link>
          </h3>
          <span className="rounded-control bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand">
            {app.version}
          </span>
        </div>
        <p className="mt-1 text-muted">{app.tagline}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {app.tags.map((t) => (
            <li key={t} className="rounded-control bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">
              {t}
            </li>
          ))}
          {app.requires?.map((r) => (
            <li
              key={r}
              className="rounded-control border border-line px-2 py-0.5 text-xs font-bold text-muted"
            >
              Kræver {r}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={favorite}
        aria-label={favorite ? `Fjern ${app.name} fra favoritter` : `Tilføj ${app.name} til favoritter`}
        title={favorite ? "Fjern fra favoritter" : "Tilføj til favoritter"}
        className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-control border border-line bg-surface/95 text-muted shadow-float transition-colors hover:text-star aria-pressed:text-star"
      >
        <StarIcon filled={favorite} className="size-5" />
      </button>
    </article>
  );
}

function StarIcon({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
