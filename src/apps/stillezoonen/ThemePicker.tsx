"use client";

import { THEMES } from "./themes";
import { CreatureArt } from "./themes/shared";

/**
 * Temavælger. `grid` (startskærmen): kort med billede. `list` (tema-knappen):
 * ét tema pr. række med billede og beskrivelse. `compact`: kun navne.
 */
export function ThemePicker({
  current,
  onChange,
  layout = "grid",
}: {
  current: string;
  onChange: (id: string) => void;
  layout?: "grid" | "list" | "compact";
}) {
  const compact = layout === "compact";
  return (
    <div className="zoo-themes" data-layout={layout}>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={t.id === current}
          onClick={() => onChange(t.id)}
          className="zoo-theme"
        >
          {!compact && (
            <span className="zoo-theme-preview" aria-hidden="true">
              <t.Background className="zoo-theme-bg" animated={false} />
              <CreatureArt spec={t.creatures[t.showcase[0]]} className="zoo-theme-creature" />
            </span>
          )}
          <span className="zoo-theme-text">
            <span className="zoo-theme-name">{t.name}</span>
            {!compact && <span className="zoo-theme-blurb">{t.blurb}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
