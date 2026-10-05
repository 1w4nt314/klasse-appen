"use client";

import { useState } from "react";
import { RARITY } from "@/apps/stillezoonen/collection/rarity";
import { THEMES } from "@/apps/stillezoonen/themes";
import { CreatureArt } from "@/apps/stillezoonen/themes/shared";
import "@/apps/stillezoonen/zoo.css";

export function CreatureGallery() {
  const [tab, setTab] = useState(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === tab) ?? THEMES[0];
  const entries = Object.entries(theme.creatures);
  const counts = entries.reduce<Record<string, number>>((acc, [, c]) => {
    const r = c.rarity ?? "common";
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === tab}
            onClick={() => setTab(t.id)}
            className="rounded-full border border-line-strong px-3 py-1.5 text-sm font-bold aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white"
          >
            {t.name} ({Object.keys(t.creatures).length})
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">
        {entries.length} figurer ·{" "}
        {Object.entries(RARITY)
          .map(([k, r]) => `${r.label.toLowerCase()}: ${counts[k] ?? 0}`)
          .join(" · ")}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
        {entries.map(([key, spec]) => {
          const rarity = spec.rarity ?? "common";
          return (
            <li key={key} className="rounded-card border border-line bg-surface p-3">
              <div
                className="grid h-40 gap-2 overflow-hidden rounded-control p-2"
                style={{ background: theme.backdrop, gridTemplateColumns: spec.special ? "1fr 1fr" : "1fr" }}
              >
                <div className="min-h-0 min-w-0">
                  <CreatureArt spec={spec} className="h-full w-full" />
                </div>
                {spec.special && (
                  <div className="min-h-0 min-w-0">
                    <CreatureArt spec={spec} pose="special" className="h-full w-full" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <strong>{spec.name}</strong>
                <span className="text-xs font-bold text-muted">{RARITY[rarity].label}</span>
              </div>
              <div className="text-xs text-muted">
                {key} · {spec.gait}
                {spec.special ? " · særlig opførsel" : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
