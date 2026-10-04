"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { TEMPOS, type Settings } from "./settings";
import { ThemePicker } from "./ThemePicker";
import type { Theme } from "./themes/types";

/** Luk når der klikkes udenfor eller trykkes Escape (så får `onEscape` lov at flytte fokus). */
function useDismiss(
  open: boolean,
  close: () => void,
  ref: RefObject<HTMLElement | null>,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      onEscape?.();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref, onEscape]);
}

/** "2:41" til automatisk genaktivering. Tikker hvert sekund mens den vises. */
function useCountdown(until: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (until === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [until]);
  if (until === null) return "";
  const s = Math.max(0, Math.ceil((until - now) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Tynd lydmåler øverst i midten. Hover (mus) eller klik folder den ud med
 * grænse-streg man kan trække i, og en knap til at slå mikrofonen fra.
 * Animationsløkken skriver `--level` og `data-over` direkte på roden (meterRef).
 */
export function SoundMeter({
  meterRef,
  threshold,
  onThreshold,
  muted,
  mutedUntil,
  onMute,
}: {
  meterRef: RefObject<HTMLDivElement | null>;
  threshold: number;
  onThreshold: (value: number) => void;
  muted: boolean;
  mutedUntil: number | null;
  onMute: (muted: boolean) => void;
}) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hover || pinned;
  const closePinned = useCallback(() => setPinned(false), []);
  useDismiss(pinned, closePinned, meterRef);
  const countdown = useCountdown(muted ? mutedUntil : null);

  return (
    <div
      ref={meterRef}
      className="zoo-meterbox"
      data-open={open || undefined}
      data-muted={muted || undefined}
      style={{ "--threshold": `${threshold}%` } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
    >
      <button
        type="button"
        className="zoo-meter-thin"
        onClick={() => setPinned((p) => !p)}
        aria-expanded={open}
        aria-label={muted ? "Lydniveau – mikrofonen er slået fra" : "Lydniveau – vis detaljer"}
      >
        <span className="zoo-meter-fill" />
        <span className="zoo-meter-limit" />
      </button>
      {muted && !open && (
        <button type="button" className="zoo-muted-tag" onClick={() => onMute(false)}>
          <MicIcon off />
          Mikrofonen er slået fra · tændes om {countdown}
          <span className="zoo-muted-action">Slå til</span>
        </button>
      )}

      {open && (
        <div className="zoo-meter-card">
          <div className="zoo-meter-card-head">
            <span>Lydniveau</span>
            {muted && <span className="zoo-muted-pill">Slået fra · tændes om {countdown}</span>}
          </div>
          <div className="zoo-meter">
            <div className="zoo-meter-fill" />
            <div className="zoo-meter-limit" />
            <input
              type="range"
              min={5}
              max={95}
              value={threshold}
              onChange={(e) => onThreshold(Number(e.target.value))}
              aria-label="Grænse for lydniveau"
            />
          </div>
          <p className="zoo-hint">Træk i stregen for at flytte grænsen.</p>
          <button
            type="button"
            className="zoo-mute-btn"
            aria-pressed={muted}
            onClick={() => onMute(!muted)}
          >
            <MicIcon off={!muted} />
            {muted ? "Slå mikrofonen til igen" : "Slå mikrofonen fra i 3 min (mens jeg taler)"}
          </button>
        </div>
      )}
    </div>
  );
}

/** Tandhjul øverst til højre med alle indstillinger. */
export function SettingsMenu({
  settings,
  theme,
  onTheme,
  onChange,
  onFullscreen,
  onReset,
  onStop,
}: {
  settings: Settings;
  theme: Theme;
  onTheme: (id: string) => void;
  onChange: (patch: Partial<Settings>) => void;
  onFullscreen: () => void;
  onReset: () => void;
  onStop: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const refocus = useCallback(() => button.current?.focus(), []);
  useDismiss(open, close, ref, refocus);
  // Flyt fokus ind i menuen, når den åbnes med tastaturet.
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>("button, input")?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div ref={ref} className="zoo-menu-wrap">
      <button
        ref={button}
        type="button"
        className="zoo-chip zoo-gear"
        aria-haspopup="dialog"
        aria-controls="zoo-settings"
        aria-expanded={open}
        aria-label="Indstillinger"
        onClick={() => setOpen((o) => !o)}
      >
        <GearIcon />
      </button>

      {open && (
        <section
          ref={panel}
          id="zoo-settings"
          role="dialog"
          className="zoo-menu"
          aria-label="Indstillinger for Stillezoonen"
        >
          <fieldset>
            <legend>Tema</legend>
            <ThemePicker current={theme.id} onChange={onTheme} compact />
          </fieldset>

          <fieldset>
            <legend>Hvor ofte kommer der nye {theme.noun}?</legend>
            <div className="zoo-segment">
              {TEMPOS.map((t) => (
                <button
                  key={t.seconds}
                  type="button"
                  aria-pressed={settings.tempo === t.seconds}
                  onClick={() => onChange({ tempo: t.seconds })}
                >
                  {t.label}
                  <span>hvert {t.seconds}. sek.</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="zoo-field">
            <span>
              Højst <strong className="tabular-nums">{settings.maxAnimals}</strong> {theme.noun} ad
              gangen
            </span>
            <input
              type="range"
              min={3}
              max={24}
              value={settings.maxAnimals}
              onChange={(e) => onChange({ maxAnimals: Number(e.target.value) })}
            />
          </label>

          <label className="zoo-switch">
            <input
              type="checkbox"
              checked={settings.timer}
              onChange={(e) => onChange({ timer: e.target.checked })}
            />
            <span className="zoo-switch-track" aria-hidden="true" />
            <span>
              <strong>Vis timer</strong>
              <small>Et lille vindue du kan flytte og trække større</small>
            </span>
          </label>

          <div className="zoo-actions">
            <button type="button" onClick={onFullscreen}>
              Fuld skærm
            </button>
            <button type="button" onClick={onReset}>
              Start forfra
            </button>
            <button type="button" onClick={onStop}>
              Stop
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

function MicIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}
