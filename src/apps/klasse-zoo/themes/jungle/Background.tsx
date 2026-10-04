/**
 * Junglescenen bag dyrene. Tegnet i 1600×900 og beskåret med `slice`, så den
 * altid fylder skærmen. Jorden (hvor dyrene går) ligger i den nederste tredjedel.
 */

type Props = { className?: string; animated?: boolean };

const palm = (x: number, y: number, s: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path d="M-6 0 C -4 -120, 4 -200, 10 -300 L 22 -300 C 16 -200, 10 -120, 10 0 Z" />
    <path d="M16 -300 C -40 -330, -110 -320, -150 -270 C -100 -290, -50 -296, 16 -290 Z" />
    <path d="M16 -300 C 70 -340, 140 -330, 180 -280 C 120 -300, 70 -302, 16 -292 Z" />
    <path d="M16 -300 C -10 -360, -70 -380, -110 -370 C -60 -350, -20 -330, 12 -296 Z" />
    <path d="M16 -300 C 50 -370, 110 -390, 150 -380 C 100 -360, 60 -340, 20 -296 Z" />
    <path d="M16 -300 C -50 -300, -100 -260, -120 -210 C -80 -250, -40 -280, 16 -292 Z" />
    <path d="M16 -300 C 80 -300, 130 -260, 150 -210 C 110 -250, 70 -280, 16 -292 Z" />
  </g>
);

const canopy = (x: number, y: number, s: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <rect x="-14" y="-40" width="28" height="340" rx="8" />
    <circle cx="0" cy="-60" r="90" />
    <circle cx="-80" cy="-20" r="70" />
    <circle cx="80" cy="-24" r="74" />
    <circle cx="-30" cy="-130" r="70" />
    <circle cx="50" cy="-120" r="66" />
  </g>
);

const fern = (x: number, y: number, s: number, flip: boolean, color: string, key: string) => (
  <g
    key={key}
    transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
    fill={color}
  >
    <path d="M0 0 C 20 -60, 70 -120, 150 -150 C 100 -110, 60 -60, 30 0 Z" />
    <path d="M10 0 C -10 -80, 10 -170, 60 -230 C 50 -160, 40 -80, 40 0 Z" />
    <path d="M20 0 C 60 -40, 130 -60, 210 -50 C 140 -30, 90 -10, 60 0 Z" />
    <path d="M0 0 C -30 -50, -90 -90, -150 -90 C -100 -60, -60 -30, -30 0 Z" />
  </g>
);

const monstera = (x: number, y: number, s: number, r: number, color: string, vein: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path
      d="M0 0 C -90 -20, -130 -120, -90 -200 C -50 -270, 40 -280, 90 -220 C 140 -150, 110 -40, 0 0 Z"
      fill={color}
    />
    <path d="M0 0 C 0 -80, -10 -170, -10 -250" stroke={vein} strokeWidth="6" fill="none" />
    <g fill="var(--zoo-sky-low, #cfe8b8)">
      <ellipse cx="-62" cy="-120" rx="20" ry="9" transform="rotate(-20 -62 -120)" />
      <ellipse cx="54" cy="-110" rx="20" ry="9" transform="rotate(20 54 -110)" />
      <ellipse cx="-56" cy="-190" rx="18" ry="8" transform="rotate(-35 -56 -190)" />
      <ellipse cx="44" cy="-180" rx="18" ry="8" transform="rotate(35 44 -180)" />
    </g>
  </g>
);

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
        <linearGradient id="jungle-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#bfe3d0" />
          <stop offset="0.55" stopColor="#e8f2c8" />
          <stop offset="1" stopColor="#f5eebd" />
        </linearGradient>
        <linearGradient id="jungle-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8cbf5a" />
          <stop offset="1" stopColor="#5f9a3c" />
        </linearGradient>
        <radialGradient id="jungle-sun" cx="0.72" cy="0.18" r="0.35">
          <stop offset="0" stopColor="#fff7d1" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff7d1" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#jungle-sky)" />
      <rect width="1600" height="900" fill="url(#jungle-sun)" />

      {/* Fjerne bjerge og trækroner i dis */}
      <path
        d="M0 520 C 120 420, 220 400, 340 450 C 440 380, 560 360, 680 430 C 800 360, 940 340, 1060 420 C 1180 360, 1320 350, 1440 420 C 1520 400, 1570 410, 1600 430 L 1600 900 L 0 900 Z"
        fill="#a9d1a6"
      />
      <g opacity="0.9">
        {[
          [80, 600, 0.9],
          [300, 590, 1.1],
          [560, 610, 0.85],
          [820, 595, 1.05],
          [1080, 605, 0.95],
          [1340, 590, 1.1],
          [1560, 610, 0.9],
        ].map(([x, y, s], i) => canopy(x, y, s, "#8fc08a", `far-${i}`))}
      </g>

      {/* Mellemgrund */}
      <g>
        {[
          [-20, 640, 1.25],
          [420, 650, 1.05],
          [1180, 645, 1.2],
          [1640, 650, 1.15],
        ].map(([x, y, s], i) => canopy(x, y, s, "#5f9e5a", `mid-${i}`))}
        {palm(220, 640, 1.05, "#4f8b49", "palm-1")}
        {palm(900, 640, 1.2, "#4f8b49", "palm-2")}
        {palm(1420, 640, 0.95, "#4f8b49", "palm-3")}
      </g>

      {/* Jorden */}
      <path
        d="M0 610 C 260 590, 520 600, 800 596 C 1080 592, 1340 600, 1600 606 L 1600 900 L 0 900 Z"
        fill="url(#jungle-ground)"
      />
      <path
        d="M-40 760 C 300 720, 640 790, 980 750 C 1240 720, 1440 760, 1660 740 L 1660 800 C 1400 820, 1200 790, 960 810 C 640 840, 300 780, -40 820 Z"
        fill="#d9c58a"
        opacity="0.55"
      />
      <g fill="#4f8a35" opacity="0.7">
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 157) % 1600;
          const y = 640 + ((i * 89) % 240);
          return (
            <path
              key={`grass-${i}`}
              d={`M${x} ${y} l 6 -18 l 4 18 l 6 -14 l 3 14 z`}
            />
          );
        })}
      </g>

      {/* Lianer fra toppen */}
      <g
        className="zoo-sway"
        stroke="#3f7a39"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M140 -10 C 160 80, 120 160, 150 260" />
        <path d="M480 -10 C 470 60, 510 110, 490 170" />
        <path d="M1240 -10 C 1260 90, 1220 170, 1250 300" />
        <path d="M1500 -10 C 1490 70, 1530 120, 1510 200" />
      </g>
      <g className="zoo-sway" fill="#4c9444">
        {[
          [150, 100],
          [138, 180],
          [152, 250],
          [492, 80],
          [496, 160],
          [1250, 120],
          [1236, 210],
          [1252, 290],
          [1508, 110],
          [1512, 190],
        ].map(([x, y], i) => (
          <ellipse
            key={`vine-leaf-${i}`}
            cx={x + (i % 2 ? -14 : 14)}
            cy={y}
            rx="16"
            ry="8"
            transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`}
          />
        ))}
      </g>

      {/* Bregner i bunden af mellemgrunden */}
      {fern(40, 640, 0.9, false, "#3f7f3a", "fern-1")}
      {fern(700, 630, 0.6, true, "#3f7f3a", "fern-2")}
      {fern(1560, 640, 0.95, true, "#3f7f3a", "fern-3")}

      {/* Trækroner der hænger ind foroven */}
      <g fill="#2f6b34">
        <path d="M0 0 H 420 C 400 60, 330 90, 260 80 C 210 130, 120 140, 70 110 C 40 140, 10 140, 0 130 Z" />
        <path d="M1600 0 H 1120 C 1150 70, 1230 90, 1300 70 C 1350 130, 1460 140, 1510 100 C 1550 140, 1590 140, 1600 130 Z" />
      </g>
      <g fill="#3d7f3e">
        <path d="M0 0 H 300 C 280 40, 220 60, 160 52 C 120 80, 50 84, 0 70 Z" />
        <path d="M1600 0 H 1260 C 1290 44, 1350 60, 1410 50 C 1460 82, 1550 84, 1600 70 Z" />
      </g>

      {monstera(-10, 230, 0.8, 70, "#2f6b34", "#24552a", "monstera-l")}
      {monstera(1610, 250, 0.8, -70, "#2f6b34", "#24552a", "monstera-r")}
    </svg>
  );
}

/** Forgrundsblade der ligger foran dyrene i hjørnerne. */
export function Foreground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {monstera(-20, 930, 1.15, 28, "#2a6330", "#1f4d25", "fg-l1")}
      {fern(-40, 910, 1.1, false, "#357a37", "fg-l2")}
      {monstera(1620, 930, 1.1, -30, "#2a6330", "#1f4d25", "fg-r1")}
      {fern(1640, 910, 1.05, true, "#357a37", "fg-r2")}
    </svg>
  );
}
