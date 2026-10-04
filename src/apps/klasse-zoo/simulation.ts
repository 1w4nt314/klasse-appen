import { ANIMALS, ANIMAL_KINDS, type AnimalKind } from "./animals";

/**
 * Dyrenes adfærd. Ren logik uden DOM: KlasseZoo kalder `step` hver frame og
 * skriver positionerne ud på elementerne.
 *
 *   walk   → går mod sit mål (ind fra kanten, eller en lille tur rundt)
 *   idle   → står stille og kigger sig omkring
 *   startle→ et kort hop af forskrækkelse når det bliver for larmende
 *   flee   → løber hurtigt ud af den nærmeste kant og forsvinder
 */

export type Mode = "walk" | "idle" | "startle" | "flee";

export type Animal = {
  id: number;
  kind: AnimalKind;
  /** Midtpunkt, 0 = venstre kant, 1 = højre kant. */
  x: number;
  /** Dybde, 0 = bagerst, 1 = forrest. */
  depth: number;
  target: number;
  dir: 1 | -1;
  mode: Mode;
  /** Tidspunkt (ms) hvor nuværende tilstand slutter (idle/startle). */
  until: number;
  /** Lille personlig variation i tempo. */
  jitter: number;
};

export type SceneSize = { width: number; height: number };

/** Lodret placering og skala ud fra dybde. */
export const depthBottom = (d: number) => 24 - d * 20; // % fra bunden
export const depthScale = (d: number) => 0.62 + d * 0.38;

const WALK_SPEED = 0.11; // scenehøjder pr. sekund
const FLEE_SPEED = 1.0;
const STARTLE_MS = 260;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Dyrets bredde som andel af scenens bredde. */
export function widthFraction(a: Pick<Animal, "kind" | "depth">, s: SceneSize) {
  const spec = ANIMALS[a.kind];
  const h = (spec.height / 100) * s.height * depthScale(a.depth);
  return s.width > 0 ? (h * spec.aspect) / s.width : 0.1;
}

function pickKind(animals: Animal[]): AnimalKind {
  const counts = new Map<AnimalKind, number>();
  for (const a of animals) counts.set(a.kind, (counts.get(a.kind) ?? 0) + 1);
  const min = Math.min(...ANIMAL_KINDS.map((k) => counts.get(k) ?? 0));
  const pool = ANIMAL_KINDS.filter((k) => (counts.get(k) ?? 0) === min);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Find en ledig plads: det bedste af nogle tilfældige bud. */
function pickSpot(animals: Animal[], s: SceneSize) {
  const ratio = s.height > 0 ? s.width / s.height : 16 / 9;
  let best = { x: rand(0.1, 0.9), depth: Math.random(), score: -1 };
  for (let i = 0; i < 14; i++) {
    const x = rand(0.08, 0.92);
    const depth = Math.random();
    let score = Infinity;
    for (const a of animals) {
      if (a.mode === "flee") continue;
      const dx = (x - a.target) * ratio;
      const dd = (depth - a.depth) * 1.2;
      score = Math.min(score, Math.hypot(dx, dd));
    }
    if (score > best.score) best = { x, depth, score };
  }
  return best;
}

let nextId = 1;

export function spawn(animals: Animal[], s: SceneSize): Animal {
  const kind = pickKind(animals);
  const { x: target, depth } = pickSpot(animals, s);
  // Oftest ind fra den side der er tættest på målet.
  const fromLeft = Math.random() < (target < 0.5 ? 0.75 : 0.25);
  const half = widthFraction({ kind, depth }, s) / 2;
  return {
    id: nextId++,
    kind,
    x: fromLeft ? -half - 0.01 : 1 + half + 0.01,
    depth,
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
 * Flyt alle dyr ét tidsskridt. Returnerer id'er på dyr der er løbet helt ud
 * af scenen og kan fjernes.
 */
export function step(animals: Animal[], s: SceneSize, now: number, dt: number) {
  const gone: number[] = [];
  const pxPerFraction = s.width > 0 ? s.height / s.width : 0.5;

  for (const a of animals) {
    const pace = ANIMALS[a.kind].pace * a.jitter;
    const half = widthFraction(a, s) / 2;

    switch (a.mode) {
      case "walk": {
        const v = WALK_SPEED * pace * pxPerFraction * dt;
        const d = a.target - a.x;
        if (Math.abs(d) <= v) {
          a.x = a.target;
          a.mode = "idle";
          a.until = now + rand(4000, 12000);
        } else {
          a.dir = d > 0 ? 1 : -1;
          a.x += a.dir * v;
        }
        break;
      }
      case "idle": {
        if (now < a.until) break;
        if (Math.random() < 0.6) {
          const t = a.x + rand(-0.22, 0.22);
          a.target = Math.min(0.94 - half, Math.max(0.06 + half, t));
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
