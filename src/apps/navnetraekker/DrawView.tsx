"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  absentToday,
  drawStudent,
  presentStudents,
  putBack,
  randomInt,
  remainingInRound,
  resetRound,
  toggleAbsent,
  type ClassList,
  type Student,
} from "./store";

const SPIN_MS = 2600;
const REEL_LENGTH = 28;
const CONFETTI_COLORS = ["#1a4f8b", "#0f6b7a", "#e3a008", "#e0352b", "#5bb54f", "#a35bd6"];

type Phase = "idle" | "spinning" | "done";

export function DrawView({ cls, onChange }: { cls: ClassList; onChange: (c: ClassList) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reel, setReel] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [drawn, setDrawn] = useState<Student | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAbsent, setShowAbsent] = useState(false);
  const timer = useRef<number | null>(null);

  const present = presentStudents(cls);
  const absent = absentToday(cls);
  const remaining = remainingInRound(cls);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const draw = useCallback(() => {
    if (phase === "spinning") return;
    const result = drawStudent(cls);
    if (!result.student) return;
    // Gem med det samme, så trækningen tæller, selv hvis siden lukkes midt i animationen.
    onChange(result.cls);
    setDrawn(result.student);
    setNotice(result.newRound ? "Alle har været oppe – en ny runde er startet." : null);

    const names = present.map((s) => s.name);
    const filler = Array.from({ length: REEL_LENGTH }, () => names[randomInt(names.length)]);
    const sequence = [...filler, result.student.name];
    setReel(sequence);
    setOffset(0);
    setPhase("spinning");

    const duration = reduceMotion ? 0 : SPIN_MS;
    // Næste frame: start rullen fra toppen og lad den køre ned til navnet.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setOffset(sequence.length - 1)),
    );
    timer.current = window.setTimeout(() => setPhase("done"), duration + 60);
  }, [cls, onChange, phase, present, reduceMotion]);

  // Mellemrum eller Enter trækker, når man ikke skriver i et felt.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName))) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        draw();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draw]);

  if (cls.students.length === 0) {
    return <p className="text-center text-muted">Klassen har ingen elever endnu. Tilføj dem under “Klasseliste”.</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-card border border-line bg-surface px-6 py-10 text-center"
        aria-live="polite"
      >
        {phase === "done" && !reduceMotion && <Confetti key={drawn?.id + String(remaining)} />}

        <p className="text-sm font-bold uppercase tracking-wider text-accent">
          {phase === "idle" ? cls.name : phase === "spinning" ? "Trækker …" : "Det blev"}
        </p>

        <div className="mt-2 w-full font-display text-[clamp(3rem,11vw,9.5rem)] font-semibold tracking-tight text-brand-strong">
          {phase === "idle" ? (
            <div className="nt-reel-window text-line-strong">?</div>
          ) : (
            <div className={`nt-reel-window ${phase === "done" ? "nt-reveal" : ""}`}>
              <div
                className="nt-reel"
                style={
                  {
                    transform: `translateY(calc(${-offset} * var(--item)))`,
                    transition:
                      offset === 0 || reduceMotion
                        ? "none"
                        : `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.72, 0.18, 1)`,
                  } as CSSProperties
                }
              >
                {reel.map((n, i) => (
                  <div key={i}>{n}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {notice && phase === "done" && (
          <p className="mt-3 rounded-control bg-accent-soft px-3 py-1.5 text-sm font-bold text-accent">{notice}</p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={draw}
            disabled={phase === "spinning" || present.length === 0}
            className="rounded-control bg-brand px-8 py-4 text-xl font-extrabold text-white hover:bg-brand-strong disabled:opacity-60"
          >
            {phase === "idle" ? "Træk et navn" : "Træk næste"}
          </button>
          {phase === "done" && drawn && (
            <button
              type="button"
              onClick={() => {
                onChange(putBack(cls, drawn.id));
                setPhase("idle");
                setDrawn(null);
              }}
              className="rounded-control border border-line-strong px-5 py-4 font-bold hover:border-brand hover:text-brand"
            >
              Læg {drawn.name} tilbage
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">Tip: tryk mellemrum for at trække.</p>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          <strong className="tabular-nums text-ink">{remaining}</strong> af{" "}
          <span className="tabular-nums">{present.length}</span> mangler at komme op i denne runde
          {absent.size > 0 && <> · {absent.size} fraværende i dag</>}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAbsent((s) => !s)}
            aria-expanded={showAbsent}
            className="rounded-control border border-line-strong px-3 py-1.5 font-bold hover:border-brand hover:text-brand"
          >
            Hvem er her i dag?
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(resetRound(cls));
              setPhase("idle");
              setNotice(null);
            }}
            className="rounded-control border border-line-strong px-3 py-1.5 font-bold hover:border-brand hover:text-brand"
          >
            Start ny runde
          </button>
        </div>
      </section>

      {showAbsent && (
        <section className="rounded-card border border-line bg-surface p-4">
          <p className="mb-3 text-sm text-muted">
            Tryk på dem der ikke er her i dag. De bliver ikke trukket, men beholder deres plads til
            de er tilbage. Markeringen nulstilles i morgen.
          </p>
          <ul className="flex flex-wrap gap-2">
            {cls.students.map((s) => {
              const isAbsent = absent.has(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={isAbsent}
                    onClick={() => onChange(toggleAbsent(cls, s.id))}
                    className="rounded-control border border-line-strong px-3 py-1.5 text-sm font-bold aria-pressed:border-danger aria-pressed:bg-danger-soft aria-pressed:text-danger aria-pressed:line-through"
                  >
                    {s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      left: `${(i * 37) % 100}%`,
      delay: `${(i % 9) * 40}ms`,
      dx: `${((i * 53) % 160) - 80}px`,
      rot: `${((i * 97) % 720) - 360}deg`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    })),
  );
  return (
    <div className="nt-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              left: p.left,
              background: p.color,
              animationDelay: p.delay,
              "--dx": p.dx,
              "--rot": p.rot,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
