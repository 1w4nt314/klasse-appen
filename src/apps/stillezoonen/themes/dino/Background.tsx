/**
 * Dino-dalen bag figurerne. Tegnet i 1600×900 og beskåret med `slice`.
 * Jordens overkant ligger ved y≈606; figurerne går i båndet nedenunder.
 * En venlig, solrig forhistorisk dal: varm abrikoshimmel, en fredelig vulkan
 * med en blød røgsky, lilla bjerge, en lille sø, bregner, padderokker og palmer.
 */

type Props = { className?: string; animated?: boolean };

/** Afrunder til to decimaler, så server og klient altid skriver samme tal. */
const r2 = (n: number) => Math.round(n * 100) / 100;

const cloud = (x: number, y: number, s: number, key: string, cls?: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={cls} fill="#fff9f0">
      <ellipse cx="0" cy="0" rx="72" ry="24" />
      <circle cx="-36" cy="-16" r="28" />
      <circle cx="6" cy="-32" r="36" />
      <circle cx="44" cy="-12" r="26" />
    </g>
  </g>
);

/**
 * Ét bregneblad: en stilk op ad -y med småblade på begge sider, der bliver
 * mindre mod spidsen. Basen ligger i (0,0); `rot` drejer hele bladet.
 */
const frond = (len: number, rot: number, color: string, key: string, slank = 1) => {
  const n = Math.max(4, Math.round(len / 17));
  const blade = Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    const w = Math.max(4, Math.round(len * 0.16 * (1 - t * 0.65)));
    return { y: -Math.round(len * t), w, h: Math.max(2.5, r2(w * 0.38 * slank)) };
  });
  return (
    <g key={key} transform={`rotate(${rot})`} fill={color}>
      <path d={`M-3 0 L 0 ${-len - 4} L 3 0 Z`} />
      <ellipse cx="0" cy={-len - 4} rx="4" ry="9" />
      {blade.map(({ y, w, h }, i) => (
        <g key={`${key}-${i}`}>
          <ellipse cx={w} cy={y} rx={w} ry={h} transform={`rotate(-30 0 ${y})`} />
          <ellipse cx={-w} cy={y} rx={w} ry={h} transform={`rotate(30 0 ${y})`} />
        </g>
      ))}
    </g>
  );
};

/** Bregnebusk: en vifte af bregneblade fra samme rod. */
const FERN_FRONDS = [
  [-68, 104],
  [-42, 136],
  [-16, 158],
  [10, 150],
  [36, 132],
  [62, 108],
] as const;

const fern = (x: number, y: number, s: number, c1: string, c2: string, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {FERN_FRONDS.map(([rot, len], i) => frond(len, rot, i % 2 ? c1 : c2, `${key}-${i}`))}
  </g>
);

/** Kæmpe-padderokke: leddelt stængel med kranse af nåle og en lille kogle i toppen. */
const horsetail = (x: number, y: number, s: number, h: number, color: string, dark: string, key: string) => {
  const n = Math.floor(h / 30);
  const led = Array.from({ length: n }, (_, i) => ({
    y: -30 * (i + 1),
    l: Math.round(26 * (1 - (i / n) * 0.6)),
  }));
  return (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y={-h} width="12" height={h} rx="6" fill={color} />
      {led.map(({ y: ly, l }, i) => (
        <g key={`${key}-${i}`}>
          <path
            d={`M-5 ${ly} q ${-l * 0.5} 2 ${-l} ${Math.round(l * 0.6)} M5 ${ly} q ${l * 0.5} 2 ${l} ${Math.round(l * 0.6)} M-3 ${ly} q -5 6 -9 ${Math.round(l * 0.8)} M3 ${ly} q 5 6 9 ${Math.round(l * 0.8)}`}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="-7" y={ly - 2} width="14" height="4" rx="2" fill={dark} />
        </g>
      ))}
      <ellipse cx="0" cy={-h - 10} rx="7" ry="14" fill="#c99a5b" />
      <path d={`M-5 ${-h - 14} H 5 M-6 ${-h - 7} H 6`} stroke="#a87a43" strokeWidth="2" />
    </g>
  );
};

/** Cykas: kort, skællet stamme med en krone af stive blade. */
const CYCAD_FRONDS = [-84, -60, -36, -12, 12, 36, 60, 84] as const;

const cycad = (x: number, y: number, s: number, leaf: string, leaf2: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-24 0 C -28 -36, -22 -68, -16 -92 L 16 -92 C 22 -68, 28 -36, 24 0 Z" fill="#a8744a" />
    <path
      d="M-18 -16 l 9 -8 l 9 8 l 9 -8 l 9 8 M-20 -38 l 10 -8 l 10 8 l 10 -8 l 10 8 M-17 -60 l 8 -8 l 9 8 l 8 -8 l 9 8 M-14 -80 l 7 -7 l 7 7 l 7 -7 l 7 7"
      stroke="#8a5b36"
      strokeWidth="3"
      fill="none"
      strokeLinejoin="round"
    />
    <g transform="translate(0 -92)">
      {CYCAD_FRONDS.map((rot, i) => frond(Math.abs(rot) > 70 ? 96 : 120, rot, i % 2 ? leaf : leaf2, `${key}-${i}`, 0.7))}
    </g>
  </g>
);

/** Palme med ringet stamme og hængende blade. Basen ligger i (0,0). */
const palm = (x: number, y: number, s: number, trunk: string, leaf: string, leaf2: string, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-14 0 C -10 -120, 6 -220, 24 -320 L 40 -318 C 24 -220, 12 -120, 14 0 Z" fill={trunk} />
    <path
      d="M-12 -30 h 26 M-10 -70 h 25 M-7 -110 h 24 M-3 -150 h 23 M2 -190 h 22 M8 -230 h 21 M14 -270 h 20"
      stroke="#8a5b36"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.55"
    />
    <g fill={leaf}>
      <path d="M32 -320 C -24 -350, -96 -340, -140 -284 C -90 -306, -40 -312, 32 -308 Z" />
      <path d="M32 -320 C 86 -356, 156 -346, 196 -292 C 136 -316, 86 -318, 32 -310 Z" />
      <path d="M32 -320 C -10 -300, -60 -256, -76 -200 C -44 -246, -8 -282, 32 -310 Z" />
      <path d="M32 -320 C 76 -300, 120 -256, 136 -198 C 104 -246, 70 -282, 32 -310 Z" />
    </g>
    <g fill={leaf2}>
      <path d="M32 -320 C 6 -376, -54 -396, -94 -386 C -44 -366, -4 -346, 28 -312 Z" />
      <path d="M32 -320 C 66 -386, 126 -406, 166 -396 C 116 -376, 76 -356, 36 -312 Z" />
    </g>
    <circle cx="26" cy="-318" r="9" fill="#8a5b36" />
    <circle cx="40" cy="-314" r="8" fill="#8a5b36" />
  </g>
);

/** Rund sten med lys side og lidt mos. Bunden ligger i (0,0). */
const rock = (x: number, y: number, s: number, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-76 0 C -84 -40, -56 -76, -12 -80 C 34 -84, 74 -58, 78 -20 C 80 -8, 78 0, 76 0 Z" fill="#b8aa9c" />
    <path d="M-54 -18 C -56 -50, -34 -68, -6 -70 C -30 -58, -40 -42, -40 -16 Z" fill="#d6cbbd" />
    <path d="M-76 0 C -40 -12, 36 -10, 76 0 Z" fill="#9d8f81" />
    <path d="M-12 -80 C 20 -84, 52 -70, 66 -48 C 44 -60, 20 -64, -6 -66 C -22 -68, -26 -78, -12 -80 Z" fill="#9fbf5e" />
  </g>
);

/** Treklø-fodspor set skråt fra oven (klemt sammen lodret). Midten ligger i (0,0). */
const footprint = (x: number, y: number, s: number, rot: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s} ${r2(s * 0.48)}) rotate(${rot})`} fill={color}>
    <ellipse cx="0" cy="0" rx="17" ry="19" />
    <ellipse cx="0" cy="-34" rx="7" ry="18" />
    <ellipse cx="-20" cy="-25" rx="7" ry="17" transform="rotate(-34 -20 -25)" />
    <ellipse cx="20" cy="-25" rx="7" ry="17" transform="rotate(34 20 -25)" />
  </g>
);

/** Lille guldsmed. Den yderste gruppe placerer, den inderste flyver (animation). */
const dragonfly = (x: number, y: number, s: number, body: string, key: string, delay: number, cls = "zoo-dino-fly") => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={cls} style={{ animationDelay: `${delay}s` }}>
      <g fill="#f4fbff" opacity="0.9">
        <ellipse cx="-4" cy="-10" rx="5" ry="15" transform="rotate(-62 -4 -10)" />
        <ellipse cx="-4" cy="10" rx="5" ry="15" transform="rotate(62 -4 10)" />
        <ellipse cx="6" cy="-9" rx="4.5" ry="13" transform="rotate(-50 6 -9)" />
        <ellipse cx="6" cy="9" rx="4.5" ry="13" transform="rotate(50 6 9)" />
      </g>
      <rect x="-30" y="-2.5" width="34" height="5" rx="2.5" fill={body} />
      <circle cx="8" cy="0" r="5.5" fill={body} />
      <circle cx="10" cy="-2" r="1.6" fill="#fff" />
    </g>
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

/** Lille sammenrullet bregnespire. */
const sprout = (x: number, y: number, s: number, color: string, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round">
    <path d="M0 0 C 0 -14, -2 -24, 6 -30 C 13 -34, 16 -24, 9 -22" />
    <path d="M-8 0 C -10 -10, -16 -16, -20 -18 C -24 -21, -26 -14, -21 -13" />
  </g>
);

/** Røgpuffer over vulkanen: [x, y, radius, forsinkelse]. */
const SMOKE = [
  [1086, 282, 24, 0],
  [1104, 248, 32, 1.2],
  [1076, 236, 22, 2.6],
  [1130, 206, 40, 0.6],
  [1168, 168, 44, 2],
  [1214, 140, 40, 3.2],
  [1124, 170, 28, 1.6],
] as const;

const CSS = `
@keyframes zoo-dino-drift { from { transform: translateX(-20px); } to { transform: translateX(20px); } }
@keyframes zoo-dino-glow { from { opacity: 0.8; } to { opacity: 1; } }
@keyframes zoo-dino-puff { from { transform: translate(0, 6px) scale(0.93); } to { transform: translate(4px, -8px) scale(1.06); } }
@keyframes zoo-dino-shimmer { from { opacity: 0.25; } to { opacity: 0.85; } }
@keyframes zoo-dino-fly {
  0% { transform: translate(0, 0); }
  25% { transform: translate(38px, -14px); }
  50% { transform: translate(74px, 2px); }
  75% { transform: translate(36px, 12px); }
  100% { transform: translate(0, 0); }
}
[data-animated] .zoo-dino-cloud { animation: zoo-dino-drift 28s ease-in-out infinite alternate; }
[data-animated] .zoo-dino-cloud-2 { animation-duration: 36s; animation-direction: alternate-reverse; }
[data-animated] .zoo-dino-glow { animation: zoo-dino-glow 5s ease-in-out infinite alternate; }
[data-animated] .zoo-dino-smoke { animation: zoo-dino-drift 18s ease-in-out infinite alternate; }
[data-animated] .zoo-dino-puff { transform-box: fill-box; transform-origin: 50% 50%; animation: zoo-dino-puff 6s ease-in-out infinite alternate; }
[data-animated] .zoo-dino-shimmer { animation: zoo-dino-shimmer 3.5s ease-in-out infinite alternate; }
[data-animated] .zoo-dino-fly { animation: zoo-dino-fly 12s ease-in-out infinite; }
[data-animated] .zoo-dino-fly-2 { animation: zoo-dino-fly 15s ease-in-out infinite reverse; }
@media (prefers-reduced-motion: reduce) {
  [data-animated] .zoo-dino-cloud, [data-animated] .zoo-dino-glow, [data-animated] .zoo-dino-smoke,
  [data-animated] .zoo-dino-puff, [data-animated] .zoo-dino-shimmer, [data-animated] .zoo-dino-fly,
  [data-animated] .zoo-dino-fly-2 { animation: none; }
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
        <linearGradient id="dino-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6c98a" />
          <stop offset="0.32" stopColor="#fbdcae" />
          <stop offset="0.52" stopColor="#fdebd0" />
          <stop offset="0.68" stopColor="#dcedf0" />
          <stop offset="1" stopColor="#d2ebf0" />
        </linearGradient>
        <radialGradient id="dino-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff7d6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dino-crater-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb986" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffb986" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dino-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b9d277" />
          <stop offset="1" stopColor="#97b553" />
        </linearGradient>
        <linearGradient id="dino-path" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f0dca6" />
          <stop offset="1" stopColor="#e3c68a" />
        </linearGradient>
        <linearGradient id="dino-lake" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8e3e6" />
          <stop offset="1" stopColor="#6fc4d2" />
        </linearGradient>
      </defs>
      <style>{CSS}</style>

      <rect width="1600" height="900" fill="url(#dino-sky)" />

      {/* Sol */}
      <circle className="zoo-dino-glow" cx="250" cy="150" r="200" fill="url(#dino-sun)" />
      <circle cx="250" cy="150" r="64" fill="#ffe08a" />
      <circle cx="250" cy="150" r="50" fill="#fff1b8" />

      {/* Skyer */}
      {cloud(600, 170, 1.05, "c1", "zoo-dino-cloud")}
      {cloud(880, 92, 0.75, "c2", "zoo-dino-cloud zoo-dino-cloud-2")}
      {cloud(1450, 230, 0.85, "c3", "zoo-dino-cloud")}
      {cloud(470, 330, 0.6, "c4", "zoo-dino-cloud zoo-dino-cloud-2")}
      {cloud(60, 340, 0.6, "c5", "zoo-dino-cloud")}

      {/* Fjerne lilla bjerge */}
      <path
        d="M0 470 C 70 430, 130 400, 200 420 C 260 380, 330 360, 400 400 C 470 440, 560 420, 640 446 C 720 470, 780 470, 840 480 C 1000 500, 1200 480, 1320 460 C 1380 420, 1440 392, 1500 410 C 1550 396, 1580 400, 1600 408 L 1600 660 L 0 660 Z"
        fill="#d3c2e4"
      />
      <path d="M330 368 C 360 372, 380 384, 400 400 C 380 396, 362 392, 344 396 Z" fill="#e6dcf0" />
      <path d="M1440 394 C 1462 392, 1484 400, 1500 410 C 1484 408, 1468 410, 1454 416 Z" fill="#e6dcf0" />

      {/* Vulkan med blød røgsky */}
      <g>
        <circle cx="1085" cy="300" r="70" fill="url(#dino-crater-glow)" />
        <path
          d="M770 572 C 880 520, 990 404, 1040 320 C 1046 310, 1056 304, 1066 305 L 1104 305 C 1114 304, 1124 310, 1130 320 C 1180 404, 1290 520, 1410 572 Z"
          fill="#bba2cb"
        />
        <path d="M770 572 C 880 520, 990 404, 1040 320 C 1046 310, 1056 304, 1066 305 C 1044 360, 1006 460, 990 572 Z" fill="#cbb6da" />
        <path
          d="M1072 312 C 1066 360, 1050 400, 1046 440 M1100 312 C 1112 360, 1140 410, 1160 450 M1118 316 C 1150 360, 1196 420, 1230 460"
          stroke="#aa91bd"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="1085" cy="306" rx="26" ry="6" fill="#9d84b2" />
        <ellipse cx="1085" cy="305" rx="16" ry="3" fill="#ffc79a" opacity="0.8" />
        <g className="zoo-dino-smoke" fill="#fffaf2">
          {SMOKE.map(([x, y, rad, d], i) => (
            <circle
              key={`smoke-${i}`}
              className="zoo-dino-puff"
              cx={x}
              cy={y}
              r={rad}
              opacity={i < 2 ? 0.95 : 0.85}
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </g>
      </g>

      {/* Blålige bakker foran bjergene */}
      <path
        d="M0 530 C 120 490, 220 480, 330 510 C 440 540, 560 520, 680 540 C 800 558, 900 560, 1000 556 C 1120 552, 1220 530, 1320 506 C 1420 484, 1520 486, 1600 498 L 1600 660 L 0 660 Z"
        fill="#b5c8e6"
      />

      {/* Grønne bakker */}
      <path
        d="M0 566 C 160 536, 300 540, 460 560 C 620 580, 760 556, 900 560 C 1060 566, 1200 548, 1360 556 C 1460 560, 1540 552, 1600 556 L 1600 700 L 0 700 Z"
        fill="#cadd98"
      />

      {/* Knogle-bue: et stort, venligt skelet der ligger i bakken */}
      <g strokeLinecap="round" fill="none">
        <g stroke="#e8dbc0" strokeWidth="11" transform="translate(4 4)">
          <path d="M236 588 C 270 520, 340 478, 420 476 C 500 474, 556 520, 592 584" />
          <path d="M320 500 C 296 530, 300 566, 318 592 M360 484 C 330 520, 334 566, 356 596 M400 477 C 370 516, 374 566, 398 598 M440 477 C 414 516, 418 566, 440 598 M480 484 C 458 520, 462 566, 480 596 M520 498 C 502 528, 506 566, 520 594" />
        </g>
        <path d="M236 588 C 270 520, 340 478, 420 476 C 500 474, 556 520, 592 584" stroke="#fffaf0" strokeWidth="14" />
        <path
          d="M320 500 C 296 530, 300 566, 318 592 M360 484 C 330 520, 334 566, 356 596 M400 477 C 370 516, 374 566, 398 598 M440 477 C 414 516, 418 566, 440 598 M480 484 C 458 520, 462 566, 480 596 M520 498 C 502 528, 506 566, 520 594"
          stroke="#fffaf0"
          strokeWidth="9"
        />
      </g>
      <g fill="#fffaf0">
        {[
          [282, 526],
          [320, 494],
          [360, 478],
          [400, 470],
          [440, 470],
          [480, 478],
          [520, 492],
          [556, 520],
        ].map(([x, y], i) => (
          <circle key={`hvirvel-${i}`} cx={x} cy={y} r="9" />
        ))}
      </g>

      {/* Nære olivengrønne bakker */}
      <path
        d="M0 592 C 200 578, 400 586, 600 592 C 800 598, 1000 584, 1200 588 C 1400 592, 1500 586, 1600 590 L 1600 700 L 0 700 Z"
        fill="#bcd385"
      />

      {/* Lille sø med siv og padderokker */}
      <path
        d="M586 594 C 598 572, 676 562, 760 564 C 846 566, 912 576, 920 592 C 912 608, 834 612, 752 612 C 672 612, 592 608, 586 594 Z"
        fill="#ead9a8"
      />
      <path
        d="M598 594 C 608 578, 680 570, 760 572 C 840 574, 900 582, 906 594 C 900 606, 826 610, 752 609 C 676 609, 604 606, 598 594 Z"
        fill="url(#dino-lake)"
      />
      <g className="zoo-dino-shimmer" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7">
        <path d="M650 584 H 700 M760 580 H 830 M700 596 H 744 M800 594 H 860" />
      </g>
      {horsetail(616, 590, 0.4, 150, "#7fae4c", "#5f8d36", "ht-sø-1")}
      {horsetail(636, 594, 0.32, 140, "#86b552", "#5f8d36", "ht-sø-2")}
      {horsetail(892, 592, 0.36, 150, "#7fae4c", "#5f8d36", "ht-sø-3")}
      {palm(960, 592, 0.32, "#b98f63", "#8dbb62", "#9cc96e", "palme-fjern-1")}
      {palm(560, 590, 0.26, "#b98f63", "#8dbb62", "#9cc96e", "palme-fjern-2", true)}

      {/* Store sten og en rede med æg ved horisonten */}
      {rock(1210, 614, 0.95, "sten-1")}
      {rock(1290, 618, 0.55, "sten-2", true)}
      <g transform="translate(1110 612)">
        <ellipse cx="0" cy="0" rx="40" ry="11" fill="#b88a55" />
        <ellipse cx="-14" cy="-10" rx="11" ry="14" fill="#fdf6e4" />
        <ellipse cx="10" cy="-12" rx="12" ry="15" fill="#e9f4d8" />
        <ellipse cx="-2" cy="-6" rx="10" ry="12" fill="#fde7d0" />
        <circle cx="12" cy="-16" r="2.5" fill="#a9c97a" />
        <circle cx="6" cy="-8" r="2" fill="#a9c97a" />
        <circle cx="-17" cy="-14" r="2" fill="#f1c48e" />
        <path d="M-40 0 C -30 6, 30 6, 40 0 C 30 -4, -30 -4, -40 0 Z" fill="#9c7243" />
        <path d="M-34 -2 l 10 4 M-14 2 l 10 -4 M6 2 l 10 -4 M24 -2 l 8 4" stroke="#d6aa6f" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Planter i siderne: palmer, cykas, padderokker og bregner */}
      {palm(110, 650, 1.0, "#c49a6c", "#5fa64a", "#73b858", "palme-v")}
      {cycad(262, 640, 0.95, "#4f9a45", "#62ad52", "cykas-v")}
      {horsetail(340, 628, 0.95, 200, "#78a947", "#5a8a34", "ht-v1")}
      {horsetail(372, 632, 0.75, 170, "#86b552", "#5a8a34", "ht-v2")}
      {fern(30, 652, 1.05, "#4a9443", "#5aa64e", "bregne-v")}
      {fern(196, 646, 0.6, "#5aa64e", "#6ab85a", "bregne-v2", true)}

      {palm(1500, 652, 1.05, "#c49a6c", "#5fa64a", "#73b858", "palme-h", true)}
      {cycad(1366, 640, 0.85, "#4f9a45", "#62ad52", "cykas-h")}
      {horsetail(1270, 628, 0.85, 190, "#78a947", "#5a8a34", "ht-h1")}
      {horsetail(1240, 632, 0.62, 160, "#86b552", "#5a8a34", "ht-h2")}
      {fern(1580, 654, 1.05, "#4a9443", "#5aa64e", "bregne-h", true)}
      {fern(1440, 646, 0.6, "#5aa64e", "#6ab85a", "bregne-h2")}

      {/* Guldsmede over søen */}
      {dragonfly(650, 540, 0.9, "#2f9fc4", "gs-1", 0)}
      {dragonfly(830, 512, 0.8, "#e0785a", "gs-2", 3, "zoo-dino-fly-2")}
      {dragonfly(420, 600, 0.75, "#7b6bd0", "gs-3", 6)}

      {/* Jorden */}
      <path
        d="M0 612 C 260 600, 520 610, 800 606 C 1080 602, 1340 610, 1600 606 L 1600 900 L 0 900 Z"
        fill="url(#dino-ground)"
      />
      <path
        d="M0 614 C 260 602, 520 612, 800 608 C 1080 604, 1340 612, 1600 608"
        stroke="#d4e39c"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Sandet tværsti */}
      <path
        d="M-40 770 C 200 740, 420 790, 700 760 C 760 754, 800 752, 820 752 L 812 800 C 780 802, 740 806, 690 812 C 420 840, 200 790, -40 822 Z"
        fill="#ecd9a2"
        opacity="0.6"
      />
      <path
        d="M1000 744 C 1180 724, 1400 760, 1640 736 L 1640 790 C 1400 812, 1180 778, 980 796 Z"
        fill="#ecd9a2"
        opacity="0.6"
      />
      {/* Sandet sti op mod søen */}
      <path
        d="M990 608 C 994 650, 880 680, 790 730 C 710 776, 690 840, 700 900 L 990 900 C 966 840, 966 790, 1006 740 C 1052 680, 1074 640, 1066 608 Z"
        fill="url(#dino-path)"
      />
      <path d="M800 742 C 740 790, 724 840, 730 890" stroke="#d8bb80" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M990 752 C 950 800, 946 850, 960 890" stroke="#d8bb80" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Store dino-fodspor op ad stien */}
      {footprint(810, 862, 1.35, -6, "#d0b078", "fs-1")}
      {footprint(880, 800, 1.15, 10, "#d0b078", "fs-2")}
      {footprint(870, 738, 0.95, 18, "#d0b078", "fs-3")}
      {footprint(948, 694, 0.78, 26, "#d0b078", "fs-4")}
      {footprint(986, 654, 0.62, 30, "#d0b078", "fs-5")}
      {/* og et par små spor i græsset */}
      {footprint(300, 690, 0.7, -60, "#8eac4e", "fs-6")}
      {footprint(236, 712, 0.7, -70, "#8eac4e", "fs-7")}
      {footprint(1330, 862, 0.9, 70, "#8eac4e", "fs-8")}
      {footprint(1408, 846, 0.9, 80, "#8eac4e", "fs-9")}

      {/* Græstotter, spirer og småsten */}
      <g opacity="0.7">
        {Array.from({ length: 34 }, (_, i) => {
          const x = (i * 211 + 40) % 1600;
          const y = 640 + ((i * 97) % 240);
          if (x > 680 && x < 1060 && y > 620) return null; // ikke på stien
          return tuft(x, y, r2(0.55 + (i % 3) * 0.15), i % 2 ? "#87a948" : "#9fbf5a", `tuft-${i}`);
        })}
      </g>
      {sprout(150, 760, 1.1, "#6fa046", "sp-1")}
      {sprout(560, 690, 0.9, "#6fa046", "sp-2")}
      {sprout(1180, 690, 0.9, "#6fa046", "sp-3")}
      {sprout(1470, 790, 1.1, "#6fa046", "sp-4")}
      <g fill="#cfc2b0">
        <ellipse cx="460" cy="742" rx="12" ry="6" />
        <ellipse cx="478" cy="748" rx="7" ry="4" />
        <ellipse cx="1120" cy="826" rx="13" ry="6" />
        <ellipse cx="1104" cy="832" rx="7" ry="4" />
        <ellipse cx="640" cy="652" rx="9" ry="4" />
        <ellipse cx="1240" cy="660" rx="10" ry="4" />
      </g>
    </svg>
  );
}

/** Forgrundsplanter der ligger foran dinoerne i de nederste hjørner. */
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
        {horsetail(176, 912, 0.8, 150, "#5f9a3c", "#467a2b", "fg-ht-v")}
        {fern(-6, 918, 1.5, "#3f8a3a", "#4f9c44", "fg-bregne-v1")}
        {fern(130, 916, 0.95, "#4f9c44", "#5fae4e", "fg-bregne-v2", true)}
        {tuft(250, 908, 1.6, "#4f9c44", "fg-tuft-v")}
        {sprout(232, 900, 1.6, "#4f9c44", "fg-sp-v")}
      </g>
      {/* højre hjørne */}
      <g>
        {horsetail(1424, 912, 0.8, 150, "#5f9a3c", "#467a2b", "fg-ht-h")}
        {fern(1606, 918, 1.5, "#3f8a3a", "#4f9c44", "fg-bregne-h1", true)}
        {fern(1470, 916, 0.95, "#4f9c44", "#5fae4e", "fg-bregne-h2")}
        {tuft(1350, 908, 1.6, "#4f9c44", "fg-tuft-h")}
        {sprout(1368, 900, 1.6, "#4f9c44", "fg-sp-h")}
      </g>
    </svg>
  );
}
