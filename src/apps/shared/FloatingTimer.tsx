"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import "./floating-timer.css";

/**
 * Nedtællings-timer i et lille vindue, der kan flyttes og ændres i størrelse.
 * Position og størrelse huskes i browseren under `storageKey`.
 */

type Rect = { x: number; y: number; w: number; h: number };
type Phase = "setup" | "running" | "paused" | "done";

const MIN_W = 220;
const MIN_H = 150;
const PRESETS = [1, 3, 5, 10];

const clampRect = (r: Rect): Rect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(Math.max(r.w, MIN_W), vw - 16);
  const h = Math.min(Math.max(r.h, MIN_H), vh - 16);
  return {
    w,
    h,
    x: Math.min(Math.max(r.x, 8), vw - w - 8),
    y: Math.min(Math.max(r.y, 8), vh - h - 8),
  };
};

function loadRect(key: string): Rect {
  const fallback = { x: window.innerWidth - 340, y: 80, w: 300, h: 200 };
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const r = JSON.parse(raw);
      if ([r.x, r.y, r.w, r.h].every((n) => typeof n === "number" && Number.isFinite(n)))
        return clampRect(r);
    }
  } catch {}
  return clampRect(fallback);
}

const fmt = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export function FloatingTimer({
  storageKey,
  onClose,
  hidden = false,
  zIndex = 350,
}: {
  storageKey: string;
  onClose: () => void;
  /** Skjult tæller stadig ned — så kan læreren gemme timeren væk uden at stoppe den. */
  hidden?: boolean;
  zIndex?: number;
}) {
  const [rect, setRect] = useState<Rect>(() => loadRect(storageKey));
  const [phase, setPhase] = useState<Phase>("setup");
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  /** Resterende tid i ms, når timeren er sat på pause (eller før start). */
  const [remaining, setRemaining] = useState(5 * 60_000);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const drag = useRef<{ mode: "move" | "resize"; sx: number; sy: number; start: Rect } | null>(null);

  // Gem placering.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rect));
    } catch {}
  }, [rect, storageKey]);

  // Hold vinduet inden for skærmen, når den ændrer størrelse (fx fuld skærm).
  useEffect(() => {
    const onResize = () => setRect((r) => clampRect(r));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Tik mens den kører.
  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (endAt !== null && t >= endAt) {
        setPhase("done");
        setEndAt(null);
        setRemaining(0);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, endAt]);

  const left = phase === "running" && endAt !== null ? Math.max(0, endAt - now) : remaining;

  const setDuration = (m: number, s: number) => {
    const mm = Math.min(99, Math.max(0, Math.floor(m) || 0));
    const ss = Math.min(59, Math.max(0, Math.floor(s) || 0));
    setMinutes(mm);
    setSeconds(ss);
    setRemaining((mm * 60 + ss) * 1000);
  };

  const start = () => {
    if (left <= 0) return;
    const t = Date.now();
    setNow(t);
    setEndAt(t + left);
    setPhase("running");
  };
  const pause = () => {
    setRemaining(left);
    setEndAt(null);
    setPhase("paused");
  };
  const reset = () => {
    setEndAt(null);
    setRemaining((minutes * 60 + seconds) * 1000);
    setPhase("setup");
  };

  const onPointerDown = useCallback(
    (mode: "move" | "resize") => (e: ReactPointerEvent<HTMLElement>) => {
      if (mode === "move" && (e.target as HTMLElement).closest("button, input")) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { mode, sx: e.clientX, sy: e.clientY, start: rect };
    },
    [rect],
  );
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    setRect(
      clampRect(
        d.mode === "move"
          ? { ...d.start, x: d.start.x + dx, y: d.start.y + dy }
          : { ...d.start, w: d.start.w + dx, h: d.start.h + dy },
      ),
    );
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <section
      className="ft-window"
      data-phase={phase}
      hidden={hidden}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex }}
      aria-label="Timer"
    >
      <header
        className="ft-bar"
        onPointerDown={onPointerDown("move")}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="ft-grip" aria-hidden="true">⠿</span>
        <span className="ft-title">Timer</span>
        <button type="button" className="ft-icon" onClick={onClose} aria-label="Skjul timer">
          ✕
        </button>
      </header>

      <div className="ft-body">
        {phase === "setup" ? (
          <div className="ft-setup">
            <div className="ft-inputs">
              <label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={99}
                  value={minutes}
                  onChange={(e) => setDuration(Number(e.target.value), seconds)}
                  aria-label="Minutter"
                />
                <span>min</span>
              </label>
              <span className="ft-colon">:</span>
              <label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setDuration(minutes, Number(e.target.value))}
                  aria-label="Sekunder"
                />
                <span>sek</span>
              </label>
            </div>
            <div className="ft-presets">
              {PRESETS.map((m) => (
                <button key={m} type="button" onClick={() => setDuration(m, 0)}>
                  {m} min
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ft-time" role="timer" aria-live="off">
            {phase === "done" ? "Tiden er gået!" : fmt(left)}
          </div>
        )}
      </div>

      <footer className="ft-actions">
        {phase === "setup" && (
          <button type="button" className="ft-primary" onClick={start} disabled={left <= 0}>
            Start
          </button>
        )}
        {phase === "running" && (
          <button type="button" className="ft-primary" onClick={pause}>
            Pause
          </button>
        )}
        {phase === "paused" && (
          <button type="button" className="ft-primary" onClick={start}>
            Fortsæt
          </button>
        )}
        {phase !== "setup" && (
          <button type="button" onClick={reset}>
            {phase === "done" ? "Ny timer" : "Nulstil"}
          </button>
        )}
      </footer>

      <span className="sr-only" aria-live="assertive">
        {phase === "done" ? "Tiden er gået" : ""}
      </span>

      <div
        className="ft-resize"
        onPointerDown={onPointerDown("resize")}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-hidden="true"
      />
    </section>
  );
}
