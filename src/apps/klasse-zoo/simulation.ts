import type { CreatureSpec, Theme } from "./themes/types";

/**
 * Figurernes adfærd. Ren logik uden DOM: KlasseZoo kalder `step` hver frame og
 * skriver positionerne ud på elementerne.
 *
 *   walk   → bevæger sig mod sit mål (ind fra kanten, eller en lille tur rundt)
 *   idle   → står stille / svæver på stedet og kigger sig omkring
 *   startle→ et kort hop af forskrækkelse når det bliver for larmende
 *   flee   → løber/svømmer hurtigt ud af den nærmeste kant og forsvinder
 */

export type Mode = "walk" | "idle" | "startle" | "flee";

export type Animal = {
  id: number;
  kind: string;
  /** Midtpunkt, 0 = venstre kant, 1 = højre kant. */
  x: number;
  /** Dybde, 0 = bagerst, 1 = forrest. Styrer skala og stablingsrækkefølge. */
  depth: number;
  /** Afstand fra bunden af scenen i procent. */
  bottom: number;
  /** Højde figuren driver mod (kun zone "open"; ellers lig `bottom`). */
  targetBottom: number;
  target: number;
  dir: 1 | -1;
  mode: Mode;
  /** Tidspunkt (ms) hvor nuværende tilstand slutter (idle/startle). */
  until: number;
  /** Lille personlig variation i tempo. */
  jitter: number;
};

export type SceneSize = { width: number; height: number };

/** Jorden: dybde 0 står bagerst (24 % oppe), dybde 1 forrest (4 %). */
const groundBottom = (d: number) => 24 - d * 20;
export const depthScale = (d: number) => 0.62 + d * 0.38;

const WALK_SPEED = 0.11; // scenehøjder pr. sekund
const FLEE_SPEED = 1.0;
const STARTLE_MS = 260;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const zoneOf = (spec: CreatureSpec, theme: Theme) => spec.zone ?? theme.zone;
/** Svømmende og svævende figurer står ikke stille ret længe. */
const isRestless = (spec: CreatureSpec) => spec.gait === "swim" || spec.gait === "float";

/** Figurens bredde som andel af scenens bredde. */
export function widthFraction(spec: CreatureSpec, depth: number, s: SceneSize) {
  const h = (spec.height / 100) * s.height * depthScale(depth);
  return s.width > 0 ? (h * spec.aspect) / s.width : 0.1;
}

function pickKind(animals: Animal[], theme: Theme) {
  const kinds = Object.keys(theme.creatures);
  const counts = new Map<string, number>();
  for (const a of animals) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
  const min = Math.min(...kinds.map((k) => counts.get(k) ?? 0));
  const pool = kinds.filter((k) => (counts.get(k) ?? 0) === min);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Find en ledig plads: det bedste af nogle tilfældige bud. */
function pickSpot(
  animals: Animal[],
  s: SceneSize,
  open: [number, number] | null,
) {
  const ratio = s.height > 0 ? s.width / s.height : 16 / 9;
  let best = { x: 0.5, depth: 0.5, bottom: 10, score: -1 };
  for (let i = 0; i < 14; i++) {
    const x = rand(0.08, 0.92);
    const depth = Math.random();
    const bottom = open ? rand(open[0], open[1]) : groundBottom(depth);
    let score = Infinity;
    for (const a of animals) {
      if (a.mode === "flee") continue;
      const dx = (x - a.target) * ratio;
      const dy = open ? (bottom - a.bottom) / 40 : (depth - a.depth) * 1.2;
      score = Math.min(score, Math.hypot(dx, dy));
    }
    if (score > best.score) best = { x, depth, bottom, score };
  }
  return best;
}

const clampX = (x: number, half: number) =>
  Math.min(0.94 - half, Math.max(0.06 + half, x));

let nextId = 1;

export function spawn(animals: Animal[], s: SceneSize, theme: Theme): Animal {
  const kind = pickKind(animals, theme);
  const spec = theme.creatures[kind];
  const open = zoneOf(spec, theme) === "open" ? theme.openRange : null;
  const spot = pickSpot(animals, s, open);
  const { depth, bottom } = spot;
  const half = widthFraction(spec, depth, s) / 2;
  // Store figurer må ikke stå delvist uden for skærmen.
  const target = clampX(spot.x, half);
  // Oftest ind fra den side der er tættest på målet.
  const fromLeft = Math.random() < (target < 0.5 ? 0.75 : 0.25);
  return {
    id: nextId++,
    kind,
    x: fromLeft ? -half - 0.01 : 1 + half + 0.01,
    depth,
    bottom,
    targetBottom: bottom,
    target,
    dir: fromLeft ? 1 : -1,
    mode: "walk",
    until: 0,
    jitter: rand(0.85, 1.15),
  };
}

export function scare(animals: Animal[], now: number) {
  for (const a of animals) {
    if (a.mode === "flee" || a.mode === "startle") continue;
    a.mode = "startle";
    // Lidt forskudt, så de ikke alle stikker af i præcis samme øjeblik.
    a.until = now + STARTLE_MS + rand(0, 450);
  }
}

/**
 * Flyt alle figurer ét tidsskridt. Returnerer id'er på figurer der er løbet
 * helt ud af scenen og kan fjernes.
 */
export function step(
  animals: Animal[],
  s: SceneSize,
  theme: Theme,
  now: number,
  dt: number,
) {
  const gone: number[] = [];
  const pxPerFraction = s.width > 0 ? s.height / s.width : 0.5;

  for (const a of animals) {
    const spec = theme.creatures[a.kind];
    if (!spec) {
      gone.push(a.id);
      continue;
    }
    const pace = spec.pace * a.jitter;
    const half = widthFraction(spec, a.depth, s) / 2;
    const restless = isRestless(spec);
    const open = zoneOf(spec, theme) === "open";

    // Svømmende/svævende figurer driver blødt mod deres nye højde.
    if (open && a.mode !== "flee" && a.bottom !== a.targetBottom) {
      a.bottom += (a.targetBottom - a.bottom) * Math.min(1, dt * 0.7);
      if (Math.abs(a.targetBottom - a.bottom) < 0.05) a.bottom = a.targetBottom;
    }

    switch (a.mode) {
      case "walk": {
        const v = WALK_SPEED * pace * pxPerFraction * dt;
        const d = a.target - a.x;
        if (Math.abs(d) <= v) {
          a.x = a.target;
          a.mode = "idle";
          a.until = now + (restless ? rand(1500, 4500) : rand(4000, 12000));
        } else {
          a.dir = d > 0 ? 1 : -1;
          a.x += a.dir * v;
        }
        break;
      }
      case "idle": {
        if (now < a.until) break;
        if (Math.random() < (restless ? 0.85 : 0.6)) {
          const range = restless ? 0.3 : 0.22;
          a.target = clampX(a.x + rand(-range, range), half);
          if (open) {
            const [lo, hi] = theme.openRange;
            a.targetBottom = Math.min(hi, Math.max(lo, a.bottom + rand(-12, 12)));
          }
          a.mode = "walk";
        } else {
          a.dir = a.dir === 1 ? -1 : 1;
          a.until = now + rand(3000, 8000);
        }
        break;
      }
      case "startle": {
        if (now < a.until) break;
        a.mode = "flee";
        a.dir = a.x < 0.5 ? -1 : 1;
        break;
      }
      case "flee": {
        a.x += a.dir * FLEE_SPEED * pace * pxPerFraction * dt;
        if (a.x < -half - 0.02 || a.x > 1 + half + 0.02) gone.push(a.id);
        break;
      }
    }
  }
  return gone;
}
