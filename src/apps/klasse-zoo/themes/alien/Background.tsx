import type { CSSProperties } from "react";

/**
 * Alien-planetens scene bag rumvæsnerne. Tegnet i 1600×900 og beskåret med `slice`.
 * Jorden (hvor rumvæsnerne går) ligger i den nederste tredjedel; himlen er dyb lilla
 * der glider over i blågrøn ved horisonten.
 */

type Props = { className?: string; animated?: boolean };

/** Krystal med lys venstre facet. Bunden ligger i (0,0). */
export const crystal = (
  x: number,
  y: number,
  w: number,
  h: number,
  rot: number,
  base: string,
  light: string,
  key: string,
) => (
  <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`}>
    <polygon points={`${-w / 2},0 ${-w / 2},${-h * 0.72} 0,${-h} ${w / 2},${-h * 0.72} ${w / 2},0`} fill={base} />
    <polygon points={`${-w / 2},0 ${-w / 2},${-h * 0.72} 0,${-h} 0,0`} fill={light} />
  </g>
);

type Cluster = readonly [dx: number, w: number, h: number, rot: number, color: 0 | 1 | 2 | 3];

const PALETTE = [
  ["#b56bff", "#d9aeff"], // violet
  ["#3fd6d2", "#8ff0ec"], // turkis
  ["#ff6fbd", "#ffa8d8"], // pink
  ["#ffd34a", "#fff0a0"], // gul
] as const;

const crystalCluster = (x: number, y: number, s: number, items: readonly Cluster[], key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {items.map(([dx, w, h, rot, c], i) => crystal(dx, 0, w, h, rot, PALETTE[c][0], PALETTE[c][1], `${key}-${i}`))}
  </g>
);

const CLUSTER_A: readonly Cluster[] = [
  [-46, 34, 90, -22, 1],
  [40, 38, 110, 18, 2],
  [-6, 52, 170, -4, 0],
  [-24, 28, 70, -38, 3],
  [20, 26, 64, 34, 1],
];
const CLUSTER_B: readonly Cluster[] = [
  [-30, 40, 120, -12, 2],
  [26, 44, 150, 10, 1],
  [-2, 30, 80, 2, 3],
];
const CLUSTER_C: readonly Cluster[] = [
  [-36, 30, 70, -26, 0],
  [8, 46, 130, 4, 1],
  [44, 30, 76, 28, 2],
];

/** Alien-planter. `sway` får dem til at vugge (kun når animationer er slået til). */
const bulbPlant = (x: number, y: number, s: number, stem: string, orb: string, glow: string, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <g className="zoo-alien-sway">
      <path d="M0 0 C -26 -60, 26 -120, 2 -190" stroke={stem} strokeWidth="11" fill="none" strokeLinecap="round" />
      <ellipse cx="-20" cy="-70" rx="28" ry="9" transform="rotate(-28 -20 -70)" fill={stem} />
      <ellipse cx="24" cy="-108" rx="26" ry="8" transform="rotate(26 24 -108)" fill={stem} />
      <circle cx="2" cy="-204" r="36" fill={glow} opacity="0.35" />
      <circle cx="2" cy="-204" r="24" fill={orb} />
      <circle cx="-5" cy="-211" r="8" fill="#fff" opacity="0.6" />
    </g>
  </g>
);

const tentaclePlant = (x: number, y: number, s: number, stem: string, tip: string, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <g className="zoo-alien-sway">
      <path d="M-14 0 C -50 -60, -10 -100, -44 -150" stroke={stem} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M0 0 C 10 -70, -16 -120, 12 -190" stroke={stem} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M14 0 C 50 -50, 30 -90, 66 -126" stroke={stem} strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="-44" cy="-154" r="12" fill={tip} />
      <circle cx="12" cy="-194" r="14" fill={tip} />
      <circle cx="66" cy="-130" r="11" fill={tip} />
    </g>
  </g>
);

const mushroom = (x: number, y: number, s: number, cap: string, dots: string, stalk: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0 C -8 -30, -8 -50, -12 -70 L 14 -70 C 10 -50, 10 -30, 12 0 Z" fill={stalk} />
    <path d="M-70 -62 C -70 -130, 70 -130, 70 -62 C 40 -52, -40 -52, -70 -62 Z" fill={cap} />
    <circle cx="-30" cy="-92" r="10" fill={dots} />
    <circle cx="14" cy="-104" r="13" fill={dots} />
    <circle cx="42" cy="-80" r="8" fill={dots} />
  </g>
);

/** Lille krater: mørk bund med lys kant. */
const crater = (cx: number, cy: number, rx: number, ry: number, key: string) => (
  <g key={key}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#4a3a9a" opacity="0.55" />
    <ellipse cx={cx} cy={cy + ry * 0.2} rx={rx * 0.86} ry={ry * 0.7} fill="#3b2d85" opacity="0.55" />
    <path
      d={`M${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
      stroke="#b9a2ff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
  </g>
);

export function Background({ className, animated = true }: Props) {
  // Faste, deterministiske stjerner (ingen tilfældighed → ingen hydrerings-forskelle).
  const stars = Array.from({ length: 90 }, (_, i) => {
    const x = (i * 263 + i * i * 31) % 1600;
    const y = (i * 149 + i * i * 17) % 520;
    const r = [1.2, 1.8, 1.4, 2.4, 1.6][i % 5];
    return { x, y, r, twinkle: i % 4 === 0, delay: (i % 7) * 0.55, dur: 2 + (i % 5) * 0.6 };
  });

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      data-animated={animated || undefined}
    >
      <style>{`
        [data-animated] .zoo-alien-twinkle { animation: zoo-alien-twinkle var(--d, 3s) ease-in-out infinite alternate; animation-delay: var(--delay, 0s); }
        [data-animated] .zoo-alien-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: zoo-alien-sway 6s ease-in-out infinite alternate; }
        @keyframes zoo-alien-twinkle { from { opacity: 0.25; } to { opacity: 1; } }
        @keyframes zoo-alien-sway { from { transform: rotate(-2deg); } to { transform: rotate(2deg); } }
        @media (prefers-reduced-motion: reduce) { [data-animated] .zoo-alien-twinkle, [data-animated] .zoo-alien-sway { animation: none; } }
      `}</style>
      <defs>
        <linearGradient id="alien-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a1b62" />
          <stop offset="0.38" stopColor="#47359b" />
          <stop offset="0.62" stopColor="#3a77ae" />
          <stop offset="0.72" stopColor="#35b0b4" />
          <stop offset="1" stopColor="#35b0b4" />
        </linearGradient>
        <linearGradient id="alien-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8d74e6" />
          <stop offset="0.5" stopColor="#7358cf" />
          <stop offset="1" stopColor="#5a42b3" />
        </linearGradient>
        <radialGradient id="alien-nebula-a" cx="0.22" cy="0.3" r="0.4">
          <stop offset="0" stopColor="#ff7ac8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff7ac8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="alien-nebula-b" cx="0.62" cy="0.22" r="0.34">
          <stop offset="0" stopColor="#5fe3d8" stopOpacity="0.32" />
          <stop offset="1" stopColor="#5fe3d8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="alien-moon" cx="0.38" cy="0.36" r="0.7">
          <stop offset="0" stopColor="#fff3d8" />
          <stop offset="1" stopColor="#e1c8f5" />
        </radialGradient>
        <radialGradient id="alien-moon-b" cx="0.38" cy="0.36" r="0.7">
          <stop offset="0" stopColor="#d4fff2" />
          <stop offset="1" stopColor="#8fe3d4" />
        </radialGradient>
        <linearGradient id="alien-planet" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb36b" />
          <stop offset="0.5" stopColor="#ff8aa8" />
          <stop offset="1" stopColor="#d06ad8" />
        </linearGradient>
        <radialGradient id="alien-horizon" cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor="#9ff5df" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9ff5df" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#alien-sky)" />
      <rect width="1600" height="900" fill="url(#alien-nebula-a)" />
      <rect width="1600" height="900" fill="url(#alien-nebula-b)" />

      {/* Stjerner */}
      <g fill="#fff">
        {stars.map((s, i) => (
          <circle
            key={`star-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            opacity={s.twinkle ? undefined : 0.75}
            className={s.twinkle ? "zoo-alien-twinkle" : undefined}
            style={s.twinkle ? ({ "--d": `${s.dur}s`, "--delay": `${s.delay}s` } as CSSProperties) : undefined}
          />
        ))}
        {/* Enkelte store funklende stjerner */}
        {[
          [520, 90],
          [880, 200],
          [1480, 90],
          [140, 330],
        ].map(([x, y], i) => (
          <path
            key={`spark-${i}`}
            className="zoo-alien-twinkle"
            style={{ "--d": `${2.4 + i * 0.5}s`, "--delay": `${i * 0.4}s` } as CSSProperties}
            d={`M${x} ${y - 11} Q ${x} ${y} ${x + 11} ${y} Q ${x} ${y} ${x} ${y + 11} Q ${x} ${y} ${x - 11} ${y} Q ${x} ${y} ${x} ${y - 11} Z`}
          />
        ))}
      </g>

      {/* Ringplanet */}
      <g transform="translate(1260 250) rotate(-16)">
        <ellipse cx="0" cy="0" rx="150" ry="34" stroke="#ffe19a" strokeWidth="14" fill="none" opacity="0.85" />
        <circle cx="0" cy="0" r="82" fill="url(#alien-planet)" />
        <path d="M-80 -18 C -30 -8, 30 -28, 80 -14" stroke="#ffd0a0" strokeWidth="10" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M-70 28 C -20 40, 30 22, 76 34" stroke="#b64fc9" strokeWidth="9" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M-150 0 A 150 34 0 0 0 150 0" stroke="#ffe19a" strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>

      {/* To måner */}
      <g>
        <circle cx="300" cy="170" r="64" fill="url(#alien-moon)" />
        <circle cx="278" cy="150" r="14" fill="#cdb3e8" opacity="0.7" />
        <circle cx="330" cy="196" r="10" fill="#cdb3e8" opacity="0.7" />
        <circle cx="322" cy="140" r="7" fill="#cdb3e8" opacity="0.7" />
        <circle cx="720" cy="100" r="30" fill="url(#alien-moon-b)" />
        <circle cx="710" cy="94" r="6" fill="#6fcbbb" opacity="0.6" />
        <circle cx="730" cy="112" r="4.5" fill="#6fcbbb" opacity="0.6" />
      </g>

      {/* Fjerne bjerge i dis */}
      <path
        d="M0 540 C 90 480, 170 470, 250 510 C 330 440, 430 430, 520 500 C 620 450, 720 470, 800 520 C 900 450, 1030 440, 1120 500 C 1220 450, 1340 450, 1420 510 C 1500 480, 1560 490, 1600 520 L 1600 640 L 0 640 Z"
        fill="#4d63b8"
        opacity="0.75"
      />
      <path
        d="M0 580 C 130 530, 260 540, 380 570 C 520 520, 640 530, 760 575 C 900 530, 1060 535, 1180 575 C 1300 540, 1460 540, 1600 580 L 1600 650 L 0 650 Z"
        fill="#3f8fb5"
        opacity="0.85"
      />
      <rect y="470" width="1600" height="200" fill="url(#alien-horizon)" />

      {/* Små krystaller langt væk i horisonten */}
      <g opacity="0.8">
        {crystalCluster(600, 596, 0.34, CLUSTER_C, "far-1")}
        {crystalCluster(980, 598, 0.3, CLUSTER_B, "far-2")}
        {crystalCluster(1120, 594, 0.26, CLUSTER_C, "far-3")}
        {crystalCluster(430, 598, 0.26, CLUSTER_B, "far-4")}
      </g>

      {/* Jorden */}
      <path
        d="M0 612 C 260 596, 520 608, 800 602 C 1080 596, 1340 608, 1600 604 L 1600 900 L 0 900 Z"
        fill="url(#alien-ground)"
      />
      <path
        d="M-40 750 C 300 710, 640 780, 980 740 C 1240 710, 1440 750, 1660 730 L 1660 790 C 1400 810, 1200 780, 960 800 C 640 830, 300 770, -40 810 Z"
        fill="#5fe3d8"
        opacity="0.16"
      />
      <path
        d="M0 618 C 260 604, 520 614, 800 608 C 1080 602, 1340 614, 1600 610"
        stroke="#b6f5e8"
        strokeWidth="5"
        fill="none"
        opacity="0.45"
        strokeLinecap="round"
      />

      {/* Kratere */}
      {crater(250, 720, 96, 20, "cr-1")}
      {crater(640, 800, 120, 24, "cr-2")}
      {crater(1010, 690, 84, 17, "cr-3")}
      {crater(1330, 790, 110, 22, "cr-4")}
      {crater(840, 862, 70, 13, "cr-5")}

      {/* Små lysende sten og knopper på jorden */}
      <g>
        {[
          [90, 700, 0],
          [470, 660, 1],
          [760, 730, 2],
          [1180, 660, 3],
          [1500, 740, 1],
          [560, 850, 0],
          [1120, 840, 2],
          [180, 840, 3],
          [1430, 860, 0],
          [940, 640, 1],
        ].map(([x, y, c], i) => (
          <g key={`gem-${i}`} transform={`translate(${x} ${y})`}>
            {crystal(0, 0, 11, 22, (i % 3 - 1) * 14, PALETTE[c][0], PALETTE[c][1], `gem-${i}`)}
          </g>
        ))}
      </g>

      {/* Krystalformationer og alien-planter i siderne */}
      <g>
        {crystalCluster(120, 640, 1.05, CLUSTER_A, "side-l1")}
        {crystalCluster(1480, 648, 1.1, CLUSTER_B, "side-r1")}
        {crystalCluster(330, 618, 0.55, CLUSTER_C, "side-l2")}
        {crystalCluster(1290, 622, 0.6, CLUSTER_C, "side-r2")}
      </g>
      {bulbPlant(230, 636, 0.95, "#2fae8f", "#ff7ac8", "#ffb0de", "plant-l1")}
      {bulbPlant(1370, 640, 0.9, "#2fae8f", "#ffd84a", "#fff0a0", "plant-r1", true)}
      {tentaclePlant(30, 652, 0.9, "#22a58c", "#ffd84a", "plant-l2")}
      {tentaclePlant(1568, 650, 0.85, "#22a58c", "#ff7ac8", "plant-r2", true)}
      {mushroom(430, 628, 0.5, "#ff7ac8", "#ffd1ea", "#fff0e6", "mush-l")}
      {mushroom(1180, 630, 0.55, "#5fe3d8", "#c9fff6", "#fff0e6", "mush-r")}
    </svg>
  );
}

/** Forgrund: krystaller og planter i bunden af hjørnerne, foran rumvæsnerne. */
export function Foreground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {crystalCluster(70, 940, 1.1, CLUSTER_A, "fg-l1")}
      {bulbPlant(120, 930, 0.7, "#1f9a86", "#ff7ac8", "#ffb0de", "fg-l2")}
      {crystalCluster(1530, 945, 1.15, CLUSTER_B, "fg-r1")}
      {tentaclePlant(1380, 930, 0.7, "#1f9a86", "#ffd84a", "fg-r2", true)}
    </svg>
  );
}
