"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
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

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/**
 * Skriftstørrelse så selv lange navne (op til 40 tegn) står helt på tavlen.
 * `cqw` = procent af kortets bredde; et tegn i display-fonten er ca. 0,62 em bredt.
 */
const nameSize = (longest: number) =>
  `min(clamp(3rem, 11vw, 9.5rem), ${(150 / Math.max(longest, 6)).toFixed(2)}cqw)`;

export function DrawView({
  cls,
  onChange,
  onSpinningChange,
}: {
  cls: ClassList;
  onChange: (c: ClassList) => void;
  /** Lader forælderen låse klassevælger og faner mens rullen kører. */
  onSpinningChange?: (spinning: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reel, setReel] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [drawn, setDrawn] = useState<Student | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAbsent, setShowAbsent] = useState(false);
  const timer = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const present = useMemo(() => presentStudents(cls), [cls]);
  const absent = useMemo(() => absentToday(cls), [cls]);
  const remaining = remainingInRound(cls);
  const spinning = phase === "spinning";

  // Seneste værdier til oprydning ved unmount.
  const latest = useRef({ cls, onChange, phase, drawn, onSpinningChange });
  useEffect(() => {
    latest.current = { cls, onChange, phase, drawn, onSpinningChange };
  });

  useEffect(() => {
    onSpinningChange?.(spinning);
  }, [spinning, onSpinningChange]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
      // Forlades visningen midt i rullen, har ingen set navnet: læg eleven tilbage.
      const l = latest.current;
      if (l.phase === "spinning" && l.drawn) l.onChange(putBack(l.cls, l.drawn.id));
      l.onSpinningChange?.(false);
    },
    [],
  );

  const stopSpin = () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    timer.current = raf.current = null;
  };

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

    // Næste frame: start rullen fra toppen og lad den køre ned til navnet.
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setOffset(sequence.length - 1));
    });
    timer.current = window.setTimeout(() => setPhase("done"), (reduceMotion ? 0 : SPIN_MS) + 60);
  }, [cls, onChange, phase, present, reduceMotion]);

  // Mellemrum eller Enter trækker — men ikke i felter, links eller på knapper
  // (der aktiverer tasten knappen selv, fx "Træk næste").
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== " " && e.key !== "Enter") return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("a, button, input, textarea, select, summary, [contenteditable], [role=button]")) return;
      e.preventDefault();
      draw();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draw]);

  /** Sekundære knapper giver fokus fra sig, så mellemrum bagefter trækker igen. */
  const release = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.detail > 0) e.currentTarget.blur();
  };

  if (cls.students.length === 0) {
    return (
      <p className="text-center text-muted">
        Klassen har ingen elever endnu. Tilføj dem under “Klasseliste”.
      </p>
    );
  }

  const longest = Math.max(...(phase === "idle" ? [1] : reel.map((n) => n.length)));

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-card border border-line bg-surface px-6 py-10 text-center [container-type:inline-size]">
        {phase === "done" && !reduceMotion && <Confetti key={`${drawn?.id}-${remaining}`} />}

        {/* Kun det endelige navn læses op — ikke rullens fyldnavne. */}
        <p className="sr-only" aria-live="polite">
          {phase === "done" && drawn ? `Det blev ${drawn.name}` : ""}
        </p>

        <p className="relative z-10 text-sm font-bold uppercase tracking-wider text-accent" aria-hidden="true">
          {phase === "idle" ? cls.name : spinning ? "Trækker …" : "Det blev"}
        </p>

        <div
          className="relative z-10 mt-2 w-full font-display font-semibold tracking-tight text-brand-strong"
          style={{ fontSize: nameSize(longest) }}
          aria-hidden="true"
        >
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
          <p className="relative z-10 mt-3 rounded-control bg-accent-soft px-3 py-1.5 text-sm font-bold text-accent">
            {notice}
          </p>
        )}

        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={draw}
            disabled={spinning || present.length === 0}
            className="rounded-control bg-brand px-8 py-4 text-xl font-extrabold text-white hover:bg-brand-strong disabled:opacity-60"
          >
            {phase === "idle" ? "Træk et navn" : "Træk næste"}
          </button>
          {phase === "done" && drawn && (
            <button
              type="button"
              onClick={(e) => {
                release(e);
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
        <p className="relative z-10 mt-3 text-xs text-muted">Tip: tryk mellemrum for at trække.</p>
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
            onClick={(e) => {
              release(e);
              setShowAbsent((s) => !s);
            }}
            aria-expanded={showAbsent}
            className="rounded-control border border-line-strong px-3 py-1.5 font-bold hover:border-brand hover:text-brand"
          >
            Hvem er her i dag?
          </button>
          <button
            type="button"
            disabled={spinning}
            onClick={(e) => {
              release(e);
              stopSpin();
              onChange(resetRound(cls));
              setPhase("idle");
              setDrawn(null);
              setNotice(null);
            }}
            className="rounded-control border border-line-strong px-3 py-1.5 font-bold hover:border-brand hover:text-brand disabled:opacity-50"
          >
            Start ny runde
          </button>
        </div>
      </section>

      {showAbsent && (
        <section className="rounded-card border border-line bg-surface p-4">
          <p className="mb-3 text-sm text-muted">
            Tryk på dem der ikke er her i dag. De bliver ikke trukket, men beholder deres plads til
            de er tilbage. Markeringen nulstilles i morgen. ✓ = har været oppe i denne runde.
          </p>
          <ul className="flex flex-wrap gap-2">
            {cls.students.map((s) => {
              const isAbsent = absent.has(s.id);
              const done = !cls.pool.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={isAbsent}
                    disabled={spinning}
                    onClick={(e) => {
                      release(e);
                      onChange(toggleAbsent(cls, s.id));
                    }}
                    className={`rounded-control border border-line-strong px-3 py-1.5 text-sm font-bold disabled:opacity-60 aria-pressed:border-danger aria-pressed:bg-danger-soft aria-pressed:text-danger aria-pressed:line-through ${done && !isAbsent ? "text-muted" : ""}`}
                  >
                    {done && !isAbsent && <span aria-label="har været oppe">✓ </span>}
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
