"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { TEMPOS, type Settings } from "./settings";
import { ThemePicker } from "./ThemePicker";
import { MUTE_MS } from "./useMicrophone";
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

const subscribeSeconds = (cb: () => void) => {
  const id = window.setInterval(cb, 250);
  return () => window.clearInterval(id);
};
const noSubscribe = () => () => {};
const nowSeconds = () => Math.floor(Date.now() / 1000);

/** "2:41" til automatisk genaktivering. */
function useCountdown(until: number | null) {
  // Tikker kun mens der er en nedtælling (ellers ingen gen-rendering hvert sekund).
  const now =
    useSyncExternalStore(until === null ? noSubscribe : subscribeSeconds, nowSeconds, () => 0) * 1000;
  if (until === null) return "";
  // Uret er rundet ned til hele sekunder, så værdien kappes ved mute-varigheden.
  const s = Math.max(0, Math.min(MUTE_MS / 1000, Math.ceil((until - now) / 1000)));
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
  // Luk først kort efter, musen er gået — så en skrå eller hurtig bevægelse ned
  // mod kortet ikke lukker det undervejs.
  const leaveTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  const enter = () => {
    window.clearTimeout(leaveTimer.current);
    setHover(true);
  };
  const leave = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHover(false), 250);
  };
  // Klik udenfor / Escape lukker med det samme — også hover-delen.
  const closePinned = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    setPinned(false);
    setHover(false);
  }, []);
  useDismiss(pinned, closePinned, meterRef);

  const countdown = useCountdown(muted ? mutedUntil : null);

  return (
    <div
      ref={meterRef}
      className="zoo-meterbox"
      data-open={open || undefined}
      data-muted={muted || undefined}
      style={{ "--threshold": `${threshold}%` } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && enter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
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
          <span>
            <span className="zoo-muted-long">Mikrofonen er slået fra · tændes om </span>
            {countdown}
          </span>
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

/**
 * Rund knap øverst til højre, der åbner et panel. Lukker ved klik udenfor,
 * Escape (fokus tilbage på knappen) og når fokus forlader panelet.
 */
function Popover({
  id,
  label,
  icon,
  panelLabel,
  className,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  panelLabel: string;
  className?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const refocus = useCallback(() => button.current?.focus(), []);
  useDismiss(open, close, ref, refocus);
  // Flyt fokus ind i panelet, når det åbnes — til det første synlige felt
  // (dele af menuen er kun synlige på smalle skærme).
  useEffect(() => {
    if (!open) return;
    const first = [...(panel.current?.querySelectorAll<HTMLElement>("button, input") ?? [])].find(
      (el) => el.offsetParent !== null,
    );
    first?.focus({ preventScroll: true });
  }, [open]);
  // Luk og giv fokus tilbage til knappen (fx efter et valg i panelet).
  const [focusRequest, setFocusRequest] = useState(0);
  useEffect(() => {
    if (focusRequest) button.current?.focus({ preventScroll: true });
  }, [focusRequest]);
  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    setFocusRequest((n) => n + 1);
  }, []);

  return (
    <div
      ref={ref}
      className={`zoo-menu-wrap ${className ?? ""}`}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null) && e.relatedTarget)
          setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className="zoo-chip zoo-round"
        aria-haspopup="dialog"
        aria-controls={id}
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen((o) => !o)}
      >
        {icon}
      </button>
      {open && (
        <section ref={panel} id={id} role="dialog" className="zoo-menu" aria-label={panelLabel}>
          {children(closeAndRefocus)}
        </section>
      )}
    </div>
  );
}

/** Rund tænd/sluk-knap (timer, beskedtavle). */
export function ToggleButton({
  label,
  pressed,
  onToggle,
  children,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="zoo-chip zoo-round zoo-wide-only"
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={onToggle}
    >
      {children}
    </button>
  );
}

/** Tema-knappen: alle temaer, ét pr. række med billede og beskrivelse. */
export function ThemeMenu({ theme, onTheme }: { theme: Theme; onTheme: (id: string) => void }) {
  return (
    <Popover
      id="zoo-themes"
      label="Skift tema"
      icon={<SceneIcon />}
      panelLabel="Vælg tema"
      className="zoo-wide-only zoo-theme-menu"
    >
      {(close) => (
        <>
          <p className="zoo-menu-title">Tema</p>
          <ThemePicker
            current={theme.id}
            layout="list"
            onChange={(id) => {
              onTheme(id);
              close();
            }}
          />
        </>
      )}
    </Popover>
  );
}

/** Tandhjul øverst til højre. På smalle skærme også tema, timer og besked. */
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
  return (
    <Popover id="zoo-settings" label="Indstillinger" icon={<GearIcon />} panelLabel="Indstillinger for Stillezoonen">
      {() => (
        <>
          {/* Knapperne i topbjælken er der ikke plads til på en lille skærm. */}
          <div className="zoo-narrow-only">
            <fieldset>
              <legend>Tema</legend>
              <ThemePicker current={theme.id} onChange={onTheme} layout="compact" />
            </fieldset>
            <Switch
              checked={settings.timer}
              onChange={(timer) => onChange({ timer })}
              title="Vis timer"
              hint="Et lille vindue du kan flytte og trække større"
            />
            <Switch
              checked={settings.board}
              onChange={(board) => onChange({ board })}
              title="Vis beskedtavle"
              hint="Skriv en besked til klassen"
            />
          </div>

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
        </>
      )}
    </Popover>
  );
}

function Switch({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  hint: string;
}) {
  return (
    <label className="zoo-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="zoo-switch-track" aria-hidden="true" />
      <span>
        <strong>{title}</strong>
        <small>{hint}</small>
      </span>
    </label>
  );
}

export function TimerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4l2.5 2M10 2.5h4M18.5 6l1.5-1.5" />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

function SceneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="m3.5 17 5-5.5 4 4 2.5-2.5 5.5 5" />
      <circle cx="16" cy="9" r="1.6" />
    </svg>
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
