"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { depthScale, scare, spawn, step, type Animal, type SceneSize } from "./simulation";
import { getTheme, THEMES } from "./themes";
import { CreatureArt } from "./themes/shared";
import type { Theme } from "./themes/types";
import { useMicrophone, type MicStatus } from "./useMicrophone";
import "./zoo.css";

const TEMPOS = [
  { label: "Langsomt", seconds: 20 },
  { label: "Normalt", seconds: 10 },
  { label: "Hurtigt", seconds: 5 },
] as const;

type Settings = { threshold: number; tempo: number; maxAnimals: number; theme: string };
const DEFAULTS: Settings = { threshold: 55, tempo: 10, maxAnimals: 12, theme: "jungle" };
const STORAGE_KEY = "klasse-zoo:settings";

/** Hvor længe lyden skal være over grænsen før dyrene bliver bange. */
const LOUD_AFTER_MS = 250;
/** Hvor længe der skal være stille før dyrene begynder at komme igen. */
const CALM_AFTER_MS = 2000;
/** Første dyr efter start eller efter ro. */
const FIRST_SPAWN_MS = 1500;

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

export default function KlasseZoo() {
  const mic = useMicrophone();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoud, setIsLoud] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const sceneRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<SceneSize>({ width: 0, height: 0 });
  const simRef = useRef<Animal[]>([]);
  const elementsRef = useRef(new Map<number, HTMLDivElement>());
  const meterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef(settings);
  const theme = getTheme(settings.theme);
  const themeRef = useRef(theme);

  // Indstillinger huskes i browseren (pr. lærer-computer).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage findes først i browseren
    setSettings(loadSettings());
  }, []);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  useEffect(() => {
    settingsRef.current = settings;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      sizeRef.current = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const syncAnimals = useCallback(() => setAnimals([...simRef.current]), []);

  const reset = useCallback(() => {
    simRef.current = [];
    syncAnimals();
  }, [syncAnimals]);

  /** Skift tema: figurerne fra det gamle tema forsvinder med det samme. */
  const changeTheme = (id: string) => {
    if (id === settings.theme) return;
    simRef.current = [];
    themeRef.current = getTheme(id);
    syncAnimals();
    setSettings((s) => ({ ...s, theme: id }));
  };

  // Hovedløkken: mål lyd, opdatér stemning, flyt dyr.
  const running = mic.status === "running";
  const { readLevel } = mic;
  useEffect(() => {
    if (!running) return;

    let raf = 0;
    let last = performance.now();
    let loud = false;
    let loudSince: number | null = null;
    let calmSince: number | null = null;
    let lastSpawn = last - settingsRef.current.tempo * 1000 + FIRST_SPAWN_MS;

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { threshold, tempo, maxAnimals } = settingsRef.current;
      const level = readLevel(dt);

      if (meterRef.current) {
        meterRef.current.style.setProperty("--level", `${level}%`);
        meterRef.current.dataset.over = String(level > threshold);
      }

      if (level > threshold) {
        calmSince = null;
        loudSince ??= now;
        if (!loud && now - loudSince >= LOUD_AFTER_MS) {
          loud = true;
          setIsLoud(true);
          scare(simRef.current, now);
        }
      } else {
        loudSince = null;
        if (loud) {
          calmSince ??= now;
          if (now - calmSince >= CALM_AFTER_MS) {
            loud = false;
            setIsLoud(false);
            lastSpawn = now - tempo * 1000 + FIRST_SPAWN_MS;
          }
        }
      }

      const sim = simRef.current;
      const size = sizeRef.current;
      let changed = false;

      if (loud) {
        // Dyr der stadig er på vej ind, vender også om.
        scare(sim, now);
      } else if (
        now - lastSpawn >= tempo * 1000 &&
        sim.filter((a) => a.mode !== "flee").length < maxAnimals &&
        size.width > 0
      ) {
        sim.push(spawn(sim, size, themeRef.current));
        lastSpawn = now;
        changed = true;
      }

      const gone = step(sim, size, themeRef.current, now, dt);
      if (gone.length) {
        simRef.current = sim.filter((a) => !gone.includes(a.id));
        changed = true;
      }

      for (const a of simRef.current) {
        const el = elementsRef.current.get(a.id);
        if (!el) continue;
        el.style.transform = `translate3d(${a.x * size.width}px,0,0)`;
        if (el.dataset.mode !== a.mode) el.dataset.mode = a.mode;
        if (el.dataset.dir !== String(a.dir)) el.dataset.dir = String(a.dir);
      }

      if (changed) syncAnimals();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, readLevel, syncAnimals]);

  // Hold skærmen tændt mens zoo'en kører (projektor/smartboard).
  useEffect(() => {
    if (!running || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const acquire = () =>
      navigator.wakeLock
        .request("screen")
        .then((l) => (lock = l))
        .catch(() => {});
    acquire();
    const onVisible = () => document.visibilityState === "visible" && acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, [running]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const visibleCount = animals.filter((a) => a.mode !== "flee").length;

  return (
    <div
      className="zoo-root"
      data-theme={theme.id}
      data-loud={isLoud || undefined}
      style={{ background: theme.backdrop }}
    >
      <div ref={sceneRef} className="zoo-scene">
        <theme.Background className="zoo-layer" />

        {animals.map((a) => {
          const spec = theme.creatures[a.kind];
          if (!spec) return null;
          const h = spec.height * depthScale(a.depth);
          return (
            <div
              key={a.id}
              ref={(el) => {
                if (!el) {
                  elementsRef.current.delete(a.id);
                  return;
                }
                // Positionen ejes af animationsløkken, ikke af React.
                if (!elementsRef.current.has(a.id))
                  el.style.transform = `translate3d(${a.x * sizeRef.current.width}px,0,0)`;
                elementsRef.current.set(a.id, el);
              }}
              className="zoo-animal"
              data-mode={a.mode}
              data-dir={a.dir}
              data-gait={spec.gait}
              data-zone={spec.zone ?? theme.zone}
              style={
                {
                  bottom: `${a.bottom}%`,
                  height: `${h}%`,
                  aspectRatio: spec.aspect,
                  zIndex: 10 + Math.round(a.depth * 100),
                  "--step": `${0.62 / spec.pace}s`,
                } as React.CSSProperties
              }
            >
              <div className="zoo-shadow" />
              <div className="zoo-flip">
                <div className="zoo-body">
                  <CreatureArt spec={spec} className="zoo-art" />
                </div>
                <span className="zoo-alarm" aria-hidden="true">
                  !
                </span>
              </div>
            </div>
          );
        })}

        <theme.Foreground className="zoo-layer zoo-foreground" />
      </div>

      <Link href="/apps" className="zoo-chip zoo-back">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M12.5 4.5 7 10l5.5 5.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Alle apps
      </Link>

      {running && (
        <div className="zoo-chip zoo-count" aria-live="polite">
          <PawIcon />
          <span className="tabular-nums">{visibleCount}</span>
          {theme.noun} {theme.place}
        </div>
      )}

      {running && (
        <div className="zoo-banner" role="status" aria-live="assertive">
          {isLoud ? (
            <>
              <strong>Shhh …</strong> {theme.nounDefinite} blev bange. Når der er ro
              igen, kommer de tilbage.
            </>
          ) : null}
        </div>
      )}

      {running ? (
        <section
          className="zoo-panel"
          data-open={panelOpen || undefined}
          aria-label="Indstillinger for Klasse Zoo"
        >
          <div className="zoo-panel-head">
            <h2>Lydniveau</h2>
            <button
              type="button"
              className="zoo-icon-btn"
              onClick={() => setPanelOpen((o) => !o)}
              aria-expanded={panelOpen}
            >
              {panelOpen ? "Skjul" : "Indstillinger"}
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                  d={panelOpen ? "M5 12.5 10 7.5l5 5" : "M5 7.5l5 5 5-5"}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={meterRef}
            className="zoo-meter"
            style={{ "--threshold": `${settings.threshold}%` } as React.CSSProperties}
          >
            <div className="zoo-meter-fill" />
            <div className="zoo-meter-limit" />
            <input
              type="range"
              min={5}
              max={95}
              value={settings.threshold}
              onChange={(e) =>
                setSettings((s) => ({ ...s, threshold: Number(e.target.value) }))
              }
              aria-label="Grænse for lydniveau"
            />
          </div>
          <p className="zoo-hint">Træk i stregen for at flytte grænsen.</p>

          {panelOpen && (
            <div className="zoo-panel-body">
              <fieldset>
                <legend>Tema</legend>
                <ThemePicker current={theme.id} onChange={changeTheme} compact />
              </fieldset>

              <fieldset>
                <legend>Hvor ofte kommer et nyt dyr?</legend>
                <div className="zoo-segment">
                  {TEMPOS.map((t) => (
                    <button
                      key={t.seconds}
                      type="button"
                      aria-pressed={settings.tempo === t.seconds}
                      onClick={() =>
                        setSettings((s) => ({ ...s, tempo: t.seconds }))
                      }
                    >
                      {t.label}
                      <span>hvert {t.seconds}. sek.</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="zoo-field">
                <span>
                  Højst <strong className="tabular-nums">{settings.maxAnimals}</strong> dyr
                  ad gangen
                </span>
                <input
                  type="range"
                  min={3}
                  max={24}
                  value={settings.maxAnimals}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, maxAnimals: Number(e.target.value) }))
                  }
                />
              </label>

              <div className="zoo-actions">
                <button type="button" onClick={toggleFullscreen}>
                  Fuld skærm
                </button>
                <button type="button" onClick={reset}>
                  Start forfra
                </button>
                <button type="button" onClick={mic.stop}>
                  Stop
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <StartScreen
          status={mic.status}
          onStart={mic.start}
          theme={theme}
          onTheme={changeTheme}
        />
      )}
    </div>
  );
}

const MIC_MESSAGES: Partial<Record<MicStatus, string>> = {
  denied:
    "Browseren fik ikke lov til at bruge mikrofonen. Klik på hængelåsen i adresselinjen, tillad mikrofon, og prøv igen.",
  unavailable:
    "Vi kunne ikke finde en mikrofon. Tjek at der er en mikrofon tilsluttet computeren.",
  error: "Mikrofonen kunne ikke startes. Prøv at genindlæse siden.",
};

function StartScreen({
  status,
  onStart,
  theme,
  onTheme,
}: {
  status: MicStatus;
  onStart: () => void;
  theme: Theme;
  onTheme: (id: string) => void;
}) {
  const message = MIC_MESSAGES[status];
  return (
    <div className="zoo-start">
      <div className="zoo-start-card">
        <div className="zoo-start-animals" aria-hidden="true">
          {theme.showcase.map((k) => (
            <CreatureArt key={k} spec={theme.creatures[k]} className="zoo-start-animal" />
          ))}
        </div>
        <h1>Klasse Zoo</h1>
        <p>
          Når klassen arbejder roligt, kommer {theme.nounDefinite} langsomt frem på
          skærmen. Bliver der for larmende, stikker de hurtigt af – og kommer
          først tilbage når der er ro igen.
        </p>
        <div className="zoo-start-themes">
          <p className="zoo-start-label">Vælg tema</p>
          <ThemePicker current={theme.id} onChange={onTheme} />
        </div>
        <button
          type="button"
          className="zoo-start-btn"
          onClick={onStart}
          disabled={status === "requesting"}
        >
          {status === "requesting" ? "Venter på mikrofon …" : "Start Klasse Zoo"}
        </button>
        {message ? (
          <p className="zoo-start-error" role="alert">
            {message}
          </p>
        ) : (
          <p className="zoo-start-note">
            Kræver adgang til mikrofonen. Lyden måles kun her i browseren – intet
            bliver optaget eller sendt nogen steder.
          </p>
        )}
      </div>
    </div>
  );
}

function ThemePicker({
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

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <ellipse cx="6" cy="10.5" rx="2.2" ry="2.8" />
      <ellipse cx="18" cy="10.5" rx="2.2" ry="2.8" />
      <ellipse cx="9.3" cy="6.3" rx="2.1" ry="2.7" />
      <ellipse cx="14.7" cy="6.3" rx="2.1" ry="2.7" />
    </svg>
  );
}
