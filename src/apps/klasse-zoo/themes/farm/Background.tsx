/**
 * Bondegårdsscenen bag dyrene. Tegnet i 1600×900 og beskåret med `slice`.
 * Jordens overkant ligger ved y≈606; dyrene går i båndet nedenunder.
 */

type Props = { className?: string; animated?: boolean };

const cloud = (x: number, y: number, s: number, key: string, cls?: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={cls} fill="#fff">
      <ellipse cx="0" cy="0" rx="70" ry="26" />
      <circle cx="-34" cy="-18" r="30" />
      <circle cx="8" cy="-34" r="38" />
      <circle cx="46" cy="-14" r="28" />
    </g>
  </g>
);

const tree = (x: number, y: number, s: number, leaf: string, leaf2: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-9" y="-70" width="18" height="74" rx="6" fill="#8a5a38" />
    <circle cx="0" cy="-110" r="56" fill={leaf} />
    <circle cx="-42" cy="-84" r="38" fill={leaf} />
    <circle cx="42" cy="-86" r="40" fill={leaf} />
    <circle cx="12" cy="-136" r="34" fill={leaf2} />
    <circle cx="-22" cy="-100" r="16" fill={leaf2} opacity="0.7" />
  </g>
);

const bale = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-34" y="-48" width="68" height="48" rx="12" fill="#e8c35a" />
    <ellipse cx="22" cy="-24" rx="14" ry="24" fill="#f3d676" />
    <ellipse cx="22" cy="-24" rx="8" ry="14" fill="#e8c35a" />
    <ellipse cx="22" cy="-24" rx="3" ry="6" fill="#d4a93c" />
    <path d="M-20 -48 V 0 M-4 -48 V 0" stroke="#cfa23a" strokeWidth="3" />
  </g>
);

const flower = (x: number, y: number, s: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0 V -18" stroke="#3f8f3a" strokeWidth="3" strokeLinecap="round" />
    <g fill={color}>
      <circle cx="0" cy="-26" r="5" />
      <circle cx="-6" cy="-20" r="5" />
      <circle cx="6" cy="-20" r="5" />
      <circle cx="-4" cy="-30" r="5" />
      <circle cx="4" cy="-30" r="5" />
    </g>
    <circle cx="0" cy="-25" r="3.4" fill="#ffd84a" />
  </g>
);

const tuft = (x: number, y: number, s: number, color: string, key: string) => (
  <path
    key={key}
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M-12 0 C -12 -16, -8 -26, -14 -36 C -4 -28, -2 -14, 0 -30 C 2 -14, 4 -28, 14 -36 C 8 -26, 12 -16, 12 0 Z"
    fill={color}
  />
);

const FENCE_POSTS = Array.from({ length: 24 }, (_, i) => -20 + i * 72);

const CSS = `
@keyframes zoo-farm-drift { from { transform: translateX(-18px); } to { transform: translateX(18px); } }
@keyframes zoo-farm-glow { from { opacity: 0.85; } to { opacity: 1; } }
[data-animated] .zoo-farm-cloud { animation: zoo-farm-drift 26s ease-in-out infinite alternate; }
[data-animated] .zoo-farm-cloud-2 { animation-duration: 34s; animation-direction: alternate-reverse; }
[data-animated] .zoo-farm-glow { animation: zoo-farm-glow 5s ease-in-out infinite alternate; }
@media (prefers-reduced-motion: reduce) {
  [data-animated] .zoo-farm-cloud, [data-animated] .zoo-farm-glow { animation: none; }
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
        <linearGradient id="farm-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7ec8f2" />
          <stop offset="0.6" stopColor="#bfe5f8" />
          <stop offset="1" stopColor="#e6f5fb" />
        </linearGradient>
        <radialGradient id="farm-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6c4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff6c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="farm-grass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#86cb5c" />
          <stop offset="1" stopColor="#5aa545" />
        </linearGradient>
        <linearGradient id="farm-road" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e6cf9a" />
          <stop offset="1" stopColor="#d4b57a" />
        </linearGradient>
      </defs>
      <style>{CSS}</style>

      <rect width="1600" height="900" fill="url(#farm-sky)" />

      {/* Sol */}
      <circle className="zoo-farm-glow" cx="1270" cy="140" r="190" fill="url(#farm-sun)" />
      <circle cx="1270" cy="140" r="62" fill="#ffe36b" />
      <circle cx="1270" cy="140" r="48" fill="#fff0a0" />

      {/* Skyer */}
      {cloud(250, 150, 1.2, "c1", "zoo-farm-cloud")}
      {cloud(700, 90, 0.9, "c2", "zoo-farm-cloud zoo-farm-cloud-2")}
      {cloud(980, 230, 0.8, "c3", "zoo-farm-cloud")}
      {cloud(1500, 300, 0.7, "c4", "zoo-farm-cloud zoo-farm-cloud-2")}
      {cloud(80, 330, 0.65, "c5", "zoo-farm-cloud")}

      {/* Fjerne bakker */}
      <path
        d="M0 470 C 160 410, 320 420, 480 470 C 640 520, 800 440, 980 440 C 1160 440, 1300 500, 1440 460 C 1520 440, 1570 440, 1600 450 L 1600 700 L 0 700 Z"
        fill="#b5e08f"
      />
      {/* Nære bakker */}
      <path
        d="M0 540 C 200 480, 380 500, 560 540 C 760 580, 940 500, 1140 510 C 1320 520, 1460 560, 1600 520 L 1600 700 L 0 700 Z"
        fill="#9bd36f"
      />
      {/* Marker i bakken */}
      <path d="M0 560 C 200 520, 380 540, 560 570 L 560 700 L 0 700 Z" fill="#a9d97a" opacity="0.7" />
      <path d="M1100 540 C 1280 540, 1460 580, 1600 550 L 1600 700 L 1100 700 Z" fill="#e4d57a" opacity="0.55" />

      {/* Træer i siderne */}
      {tree(60, 596, 1.2, "#4fa24a", "#66b85a", "t1")}
      {tree(520, 592, 0.75, "#58ab50", "#6dc060", "t2")}
      {tree(1130, 590, 0.8, "#58ab50", "#6dc060", "t3")}
      {tree(1540, 596, 1.15, "#4fa24a", "#66b85a", "t4")}

      {/* Lade */}
      <g>
        {/* silo */}
        <rect x="372" y="440" width="48" height="140" fill="#cfd6dc" />
        <path d="M372 440 C 372 414, 420 414, 420 440 Z" fill="#aeb8c0" />
        <path d="M372 470 H 420 M372 500 H 420 M372 530 H 420" stroke="#b9c2c9" strokeWidth="3" />
        {/* lade-krop */}
        <path d="M190 584 V 478 L 214 438 H 326 L 350 478 V 584 Z" fill="#c9423a" />
        <path d="M184 482 L 212 432 H 328 L 356 482 L 340 482 L 320 446 H 220 L 200 482 Z" fill="#fff" />
        <path d="M200 482 L 220 446 H 320 L 340 482 Z" fill="#a8332e" />
        {/* hølofts-lem */}
        <rect x="248" y="456" width="44" height="40" rx="3" fill="#fff" />
        <rect x="254" y="462" width="32" height="28" rx="2" fill="#7a2a26" />
        <path d="M254 476 H 286 M270 462 V 490" stroke="#fff" strokeWidth="3" />
        {/* port */}
        <rect x="232" y="516" width="76" height="68" fill="#fff" />
        <rect x="238" y="522" width="64" height="62" fill="#9c332f" />
        <path d="M238 522 L 302 584 M302 522 L 238 584 M270 522 V 584" stroke="#fff" strokeWidth="5" />
        <path d="M190 584 V 478 M350 584 V 478" stroke="#fff" strokeWidth="6" />
      </g>

      {/* Høballer på horisonten */}
      {bale(1396, 606, 0.9, "b1")}
      {bale(1470, 608, 0.8, "b2")}
      {bale(1432, 566, 0.7, "b3")}
      {bale(684, 596, 0.6, "b4")}

      {/* Hvidt trægærde langs horisonten */}
      <g>
        {FENCE_POSTS.map((x, i) => (
          <g key={`post-${i}`}>
            <rect x={x} y="566" width="12" height="44" rx="4" fill="#fbfaf4" />
            <rect x={x + 8} y="568" width="4" height="40" rx="2" fill="#e3dfd2" />
          </g>
        ))}
        <rect x="-10" y="576" width="1620" height="8" rx="3" fill="#fbfaf4" />
        <rect x="-10" y="595" width="1620" height="8" rx="3" fill="#fbfaf4" />
        <rect x="-10" y="582" width="1620" height="2.5" fill="#e3dfd2" />
        <rect x="-10" y="601" width="1620" height="2.5" fill="#e3dfd2" />
      </g>

      {/* Jord: græsmark */}
      <path
        d="M0 612 C 260 600, 520 610, 800 606 C 1080 602, 1340 610, 1600 606 L 1600 900 L 0 900 Z"
        fill="url(#farm-grass)"
      />
      {/* Markvej */}
      <path
        d="M690 610 C 740 608, 840 608, 900 610 C 960 680, 1080 760, 1280 900 L 560 900 C 640 780, 670 700, 690 610 Z"
        fill="url(#farm-road)"
        opacity="0.85"
      />
      <path d="M740 640 C 700 720, 650 800, 600 880" stroke="#c9a96a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M860 640 C 930 730, 1010 810, 1090 880" stroke="#c9a96a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Græstotter og blomster på marken */}
      <g opacity="0.75">
        {Array.from({ length: 36 }, (_, i) => {
          const x = (i * 211) % 1600;
          const y = 640 + ((i * 97) % 240);
          return tuft(x, y, 0.6 + (i % 3) * 0.15, i % 2 ? "#4c9a3c" : "#6ab552", `tuft-${i}`);
        })}
      </g>
      {flower(120, 700, 0.9, "#fff", "f1")}
      {flower(470, 760, 0.8, "#ff7a8a", "f2")}
      {flower(1050, 690, 0.8, "#fff", "f3")}
      {flower(1330, 740, 0.9, "#ffd84a", "f4")}
      {flower(1520, 820, 0.9, "#ff7a8a", "f5")}
    </svg>
  );
}

/** Forgrundsplanter der ligger foran dyrene i hjørnerne. */
export function Foreground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {/* venstre hjørne */}
      <g>
        {tuft(30, 910, 2.6, "#3f8f3a", "fl1")}
        {tuft(120, 915, 2.1, "#56a548", "fl2")}
        {tuft(210, 912, 1.7, "#3f8f3a", "fl3")}
        <path d="M70 900 C 66 850, 72 820, 62 790 M96 900 C 100 856, 94 826, 108 796 M140 900 C 138 860, 148 836, 160 812" stroke="#e8c35a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="62" cy="786" rx="5" ry="11" fill="#e8c35a" />
        <ellipse cx="108" cy="792" rx="5" ry="11" fill="#e8c35a" />
        <ellipse cx="162" cy="808" rx="5" ry="11" fill="#e8c35a" />
        {flower(54, 880, 2.2, "#ff7a8a", "ff1")}
        {flower(176, 888, 1.8, "#fff", "ff2")}
        {flower(250, 890, 1.5, "#ffd84a", "ff3")}
      </g>
      {/* højre hjørne */}
      <g>
        {tuft(1570, 910, 2.6, "#3f8f3a", "fr1")}
        {tuft(1480, 915, 2.1, "#56a548", "fr2")}
        {tuft(1390, 912, 1.7, "#3f8f3a", "fr3")}
        <path d="M1530 900 C 1534 850, 1528 820, 1538 790 M1504 900 C 1500 856, 1506 826, 1492 796 M1460 900 C 1462 860, 1452 836, 1440 812" stroke="#e8c35a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="1538" cy="786" rx="5" ry="11" fill="#e8c35a" />
        <ellipse cx="1492" cy="792" rx="5" ry="11" fill="#e8c35a" />
        <ellipse cx="1438" cy="808" rx="5" ry="11" fill="#e8c35a" />
        {flower(1546, 880, 2.2, "#ffd84a", "fg1")}
        {flower(1424, 888, 1.8, "#ff7a8a", "fg2")}
        {flower(1350, 890, 1.5, "#fff", "fg3")}
      </g>
    </svg>
  );
}
