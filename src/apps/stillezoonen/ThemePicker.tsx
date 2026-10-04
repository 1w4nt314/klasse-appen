"use client";

import { THEMES } from "./themes";
import { CreatureArt } from "./themes/shared";

export function ThemePicker({
  current,
  onChange,
  compact,
}: {
  current: string;
  onChange: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="zoo-themes" data-compact={compact || undefined}>
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
          <span className="zoo-theme-name">{t.name}</span>
          {!compact && <span className="zoo-theme-blurb">{t.blurb}</span>}
        </button>
      ))}
    </div>
  );
}
