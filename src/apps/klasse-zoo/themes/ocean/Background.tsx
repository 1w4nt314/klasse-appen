import type { CSSProperties } from "react";

/**
 * Akvariescenen bag dyrene. Tegnet i 1600×900 og beskåret med `slice`.
 * Vandet er åbent og roligt i midten (hvor fiskene svømmer); sandbunden når op til y≈620,
 * så krabben kan gå på den. Koraller og tang sidder i siderne.
 */

type Props = { className?: string; animated?: boolean };

const weedBlade = "M-8 0 C -28 -50, 14 -92, -4 -150 C 24 -92, -18 -50, 8 0 Z";

/** Tangtot af tre blade. Hvert blad svajer for sig (klassen animeres kun når scenen er animeret). */
const weed = (x: number, y: number, s: number, color: string, key: string, delay = 0) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path className="zoo-ocean-weed" style={{ animationDelay: `${-delay}s` }} d={weedBlade} />
    <path
      className="zoo-ocean-weed"
      style={{ animationDelay: `${-delay - 1.3}s` }}
      d={weedBlade}
      transform="translate(-22 0) rotate(-14) scale(0.8)"
    />
    <path
      className="zoo-ocean-weed"
      style={{ animationDelay: `${-delay - 2.4}s` }}
      d={weedBlade}
      transform="translate(24 0) rotate(16) scale(0.9)"
    />
  </g>
);

/** Grenkoral: tykke afrundede grene med lyse spidser. */
const branchCoral = (x: number, y: number, s: number, color: string, tip: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <g stroke={color} strokeWidth="15" strokeLinecap="round" fill="none">
      <path d="M0 0 V -70" />
      <path d="M0 -40 C -20 -52, -30 -70, -34 -96" />
      <path d="M0 -58 C 18 -72, 30 -90, 34 -118" />
      <path d="M-34 -96 C -40 -110, -40 -122, -38 -134" />
      <path d="M0 -70 C 2 -92, -2 -112, -4 -140" />
      <path d="M34 -118 C 38 -130, 42 -138, 44 -148" />
    </g>
    <g fill={tip}>
      <circle cx="-38" cy="-136" r="8" />
      <circle cx="-4" cy="-142" r="8" />
      <circle cx="44" cy="-150" r="8" />
      <circle cx="-34" cy="-96" r="5" opacity="0.7" />
    </g>
  </g>
);

/** Rørkoral: lodrette rør med mørke åbninger. */
const tubeCoral = (x: number, y: number, s: number, color: string, dark: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-26, 70],
      [0, 110],
      [26, 84],
    ].map(([dx, h], i) => (
      <g key={`${key}-${i}`}>
        <rect x={dx - 11} y={-h} width="22" height={h} rx="10" fill={color} />
        <ellipse cx={dx} cy={-h + 6} rx="8" ry="4.5" fill={dark} />
      </g>
    ))}
  </g>
);

/** Hjernekoral: lav kuppel med snoede riller. */
const brainCoral = (x: number, y: number, s: number, color: string, groove: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 0 C -70 -64, 70 -64, 70 0 Z" fill={color} />
    <g stroke={groove} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7">
      <path d="M-46 -12 C -40 -34, -22 -20, -14 -40" />
      <path d="M-10 -8 C -4 -30, 14 -16, 20 -44" />
      <path d="M24 -10 C 30 -30, 44 -20, 50 -34" />
      <path d="M-56 -26 C -48 -42, -38 -44, -30 -52" />
    </g>
  </g>
);

/** Vifte-/solfjederkoral. */
const fanCoral = (x: number, y: number, s: number, color: string, vein: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-5" y="-30" width="10" height="30" rx="4" fill={vein} />
    <path d="M0 -20 C -80 -40, -86 -120, -40 -160 C -14 -176, 14 -176, 40 -160 C 86 -120, 80 -40, 0 -20 Z" fill={color} />
    <g stroke={vein} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6">
      <path d="M0 -22 L -52 -130" />
      <path d="M0 -22 L -20 -160" />
      <path d="M0 -22 L 20 -160" />
      <path d="M0 -22 L 52 -130" />
    </g>
  </g>
);

const rock = (x: number, y: number, s: number, color: string, hi: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 0 C -86 -30, -60 -62, -24 -66 C 10 -76, 56 -58, 74 -28 C 84 -12, 82 -4, 80 0 Z" fill={color} />
    <path d="M-50 -30 C -40 -50, -20 -56, 0 -58 C -24 -50, -38 -40, -46 -22 Z" fill={hi} opacity="0.7" />
  </g>
);

const starfish = (x: number, y: number, s: number, r: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={color}>
    <path d="M0 -26 L 7 -9 L 26 -8 L 12 4 L 16 24 L 0 13 L -16 24 L -12 4 L -26 -8 L -7 -9 Z" strokeLinejoin="round" />
    <circle cx="0" cy="-2" r="3" fill="#fff" opacity="0.5" />
  </g>
);

const shell = (x: number, y: number, s: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 0 C -18 -20, -6 -28, 0 -28 C 6 -28, 18 -20, 16 0 Z" fill={color} />
    <path d="M0 -26 V 0 M-8 -22 L -6 0 M8 -22 L 6 0" stroke="#fff" strokeWidth="1.8" opacity="0.55" />
  </g>
);

const bubbleSpecs: [number, number, number, number, number][] = [
  // x, startY, radius, duration, delay
  [150, 640, 6, 11, 0],
  [210, 600, 4, 14, 3],
  [330, 700, 5, 12, 6],
  [470, 560, 3.5, 15, 2],
  [1130, 620, 4, 13, 5],
  [1270, 700, 6, 11, 1],
  [1390, 580, 4.5, 16, 8],
  [1480, 660, 3.5, 12, 4],
  [1540, 720, 5, 14, 9],
  [60, 760, 4, 13, 7],
];

const css = `
.zoo-ocean-weed {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
svg[data-animated] .zoo-ocean-weed {
  animation: zoo-ocean-weed 5.5s ease-in-out infinite alternate;
}
svg[data-animated] .zoo-ocean-rays {
  animation: zoo-ocean-rays 9s ease-in-out infinite alternate;
}
.zoo-ocean-bubble {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  opacity: 0.55;
}
svg[data-animated] .zoo-ocean-bubble {
  animation: zoo-ocean-rise var(--dur, 12s) linear infinite;
  animation-delay: var(--delay, 0s);
}
@keyframes zoo-ocean-weed {
  from { transform: rotate(-5deg); }
  to { transform: rotate(5deg); }
}
@keyframes zoo-ocean-rays {
  from { opacity: 0.75; transform: translateX(-14px); }
  to { opacity: 1; transform: translateX(14px); }
}
@keyframes zoo-ocean-rise {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.55; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-560px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  svg[data-animated] .zoo-ocean-weed,
  svg[data-animated] .zoo-ocean-rays,
  svg[data-animated] .zoo-ocean-bubble {
    animation: none;
  }
}
`;

export function Background({ className, animated = true }: Props) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      data-animated={animated || undefined}
    >
      <defs>
        <linearGradient id="ocean-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8fe8de" />
          <stop offset="0.3" stopColor="#4cc3d6" />
          <stop offset="0.62" stopColor="#2a93c6" />
          <stop offset="1" stopColor="#1d68a8" />
        </linearGradient>
        <radialGradient id="ocean-glow" cx="0.5" cy="0" r="0.75">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ocean-ray" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ocean-sand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6e4ae" />
          <stop offset="1" stopColor="#dcbf82" />
        </linearGradient>
        <linearGradient id="ocean-haze" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1d68a8" stopOpacity="0" />
          <stop offset="1" stopColor="#1d68a8" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <style>{css}</style>

      <rect width="1600" height="900" fill="url(#ocean-water)" />
      <rect width="1600" height="560" fill="url(#ocean-glow)" />

      {/* Lysstråler fra overfladen */}
      <g className="zoo-ocean-rays" fill="url(#ocean-ray)">
        <path d="M120 -20 L 260 -20 L 520 640 L 300 640 Z" />
        <path d="M470 -20 L 560 -20 L 860 640 L 700 640 Z" />
        <path d="M800 -20 L 930 -20 L 1060 640 L 860 640 Z" />
        <path d="M1130 -20 L 1220 -20 L 1500 640 L 1320 640 Z" />
      </g>

      {/* Bølget overflade foroven */}
      <path
        d="M0 0 H 1600 V 22 C 1500 34, 1420 12, 1320 24 C 1220 36, 1140 12, 1040 24 C 940 36, 860 12, 760 24 C 660 36, 580 12, 480 24 C 380 36, 300 12, 200 24 C 120 34, 60 14, 0 24 Z"
        fill="#d6fbf4"
        opacity="0.55"
      />

      {/* Fjerne klipper og rev i dis */}
      <path
        d="M0 560 C 80 500, 170 470, 260 500 C 330 520, 360 560, 440 540 C 520 520, 540 570, 640 590 L 640 640 L 0 640 Z"
        fill="#3fa6c9"
        opacity="0.7"
      />
      <path
        d="M1600 540 C 1520 480, 1430 450, 1340 490 C 1270 520, 1240 560, 1160 548 C 1080 536, 1050 580, 980 596 L 980 640 L 1600 640 Z"
        fill="#3fa6c9"
        opacity="0.7"
      />
      <g opacity="0.6" fill="#58b6d0">
        {fanCoral(110, 560, 0.6, "#58b6d0", "#3fa6c9", "far-fan-l")}
        {fanCoral(1500, 556, 0.55, "#58b6d0", "#3fa6c9", "far-fan-r")}
        {weed(380, 590, 0.8, "#3d9fb4", "far-weed-l")}
        {weed(1230, 590, 0.85, "#3d9fb4", "far-weed-r", 2)}
      </g>
      <rect y="440" width="1600" height="200" fill="url(#ocean-haze)" />

      {/* Sandbunden: overkanten ligger ved y≈620 */}
      <path
        d="M0 626 C 130 604, 260 606, 400 620 C 560 636, 700 624, 860 614 C 1020 604, 1160 612, 1300 624 C 1420 634, 1520 622, 1600 608 L 1600 900 L 0 900 Z"
        fill="url(#ocean-sand)"
      />
      <g fill="none" stroke="#c9a96a" strokeWidth="5" strokeLinecap="round" opacity="0.45">
        <path d="M120 690 C 220 676, 300 702, 400 688" />
        <path d="M520 740 C 640 724, 740 752, 860 736" />
        <path d="M980 700 C 1080 686, 1180 712, 1290 696" />
        <path d="M1260 790 C 1360 776, 1450 800, 1560 784" />
        <path d="M60 820 C 160 806, 260 832, 380 816" />
        <path d="M700 850 C 800 836, 900 860, 1010 846" />
      </g>
      <g fill="#c9a96a" opacity="0.5">
        {[
          [230, 660], [470, 700], [680, 668], [790, 780], [1010, 660], [1180, 760],
          [1420, 700], [90, 770], [570, 830], [1330, 840], [920, 820], [330, 800],
        ].map(([x, y], i) => (
          <ellipse key={`pebble-${i}`} cx={x} cy={y} rx={6 + (i % 3) * 2} ry={3 + (i % 2)} />
        ))}
      </g>

      {/* Venstre side: klipper, koraller og tang */}
      {rock(250, 664, 1.1, "#8b8f9e", "#b4b9c8", "rock-l1")}
      {weed(40, 700, 1.15, "#2f9a5a", "weed-l1", 0)}
      {weed(170, 690, 0.95, "#3dae66", "weed-l2", 1.7)}
      {branchCoral(332, 690, 0.95, "#ff8f6b", "#ffc8a8", "coral-l1")}
      {tubeCoral(112, 706, 0.9, "#b27ae0", "#6d3fa6", "tube-l")}
      {brainCoral(420, 650, 0.6, "#f4a3c0", "#c9638f", "brain-l")}
      {starfish(480, 712, 0.7, -12, "#ff9a5c", "star-l")}

      {/* Højre side */}
      {rock(1380, 668, 1.2, "#8b8f9e", "#b4b9c8", "rock-r1")}
      {fanCoral(1510, 712, 1.0, "#f38ab0", "#c9568a", "fan-r")}
      {weed(1330, 700, 1.05, "#2f9a5a", "weed-r1", 0.9)}
      {weed(1583, 690, 1.2, "#3dae66", "weed-r2", 2.6)}
      {branchCoral(1240, 680, 0.8, "#ffb04a", "#ffe0a0", "coral-r1")}
      {brainCoral(1170, 646, 0.55, "#7ad6b8", "#35967c", "brain-r")}
      {starfish(1285, 716, 0.6, 20, "#f2698a", "star-r")}
      {shell(1100, 700, 0.9, "#f7c5b0", "shell-r")}
      {shell(560, 676, 0.8, "#f7d6c0", "shell-l")}

      {/* Bobler */}
      <g fill="#ffffff">
        {bubbleSpecs.map(([x, y, r, dur, delay], i) => (
          <circle
            key={`bubble-${i}`}
            className="zoo-ocean-bubble"
            cx={x}
            cy={y}
            r={r}
            style={{ "--dur": `${dur}s`, "--delay": `${-delay}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/** Forgrund: tang og koraller i bunden af hjørnerne, foran dyrene. */
export function Foreground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <style>{css}</style>
      {weed(-10, 930, 1.9, "#1f7f4a", "fg-weed-l1", 0.5)}
      {weed(130, 940, 1.5, "#2a9558", "fg-weed-l2", 2.2)}
      {tubeCoral(60, 940, 1.5, "#9a62d0", "#5a2f90", "fg-tube-l")}
      {branchCoral(1520, 945, 1.45, "#ff7f5e", "#ffbe9c", "fg-coral-r")}
      {weed(1620, 930, 1.9, "#1f7f4a", "fg-weed-r1", 1.4)}
      {weed(1430, 940, 1.4, "#2a9558", "fg-weed-r2", 3.1)}
    </svg>
  );
}
