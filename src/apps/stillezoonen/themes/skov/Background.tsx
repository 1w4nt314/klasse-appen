/**
 * Den danske skov bag figurerne. Tegnet i 1600×900 og beskåret med `slice`.
 * Jordens overkant ligger ved y≈606; figurerne går i båndet nedenunder.
 * En lys bøgeskov en forårsdag: høje lysegrå bøgestammer, friskt lysegrønt løv,
 * lysstråler der falder skråt ind, en lille skovsø, en mosgroet væltet stamme,
 * svampe, bregner og hvide anemoner i skovbunden.
 *
 * Ydeevne: løvkroner, buske, anemoner og lyspletter er hver tegnet som ÉN samlet
 * sti med mange cirkler/ellipser som delstier (samme farve = ét element). Det holder
 * scenen under ~250 elementer, så animationerne kører glat på svage smartboards.
 */

type Props = { className?: string; animated?: boolean };

/** Afrunder til to decimaler, så server og klient altid skriver samme tal. */
const r2 = (n: number) => Math.round(n * 100) / 100;

type Cirkel = readonly [x: number, y: number, r: number];
type Ellipse = readonly [x: number, y: number, rx: number, ry: number];

/** Mange cirkler som delstier i én sti. Alle tal er heltal, så server og klient skriver det samme. */
const cirkler = (liste: readonly Cirkel[]) =>
  liste.map(([x, y, r]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`).join("");

const ellipser = (liste: readonly Ellipse[]) =>
  liste.map(([x, y, rx, ry]) => `M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`).join("");

/** Spejler en liste cirkler om scenens midte (x → 1600 − x) og varierer lidt, så siderne ikke er ens. */
const spejl = (liste: readonly Cirkel[], dy: number): Cirkel[] =>
  liste.map(([x, y, r], i) => [1600 - x + (i % 2 ? 14 : -10), y + dy, r + ((i % 3) - 1) * 6] as const);

const cloud = (x: number, y: number, s: number, key: string, cls?: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <g className={cls} fill="#fdfef8">
      <ellipse cx="0" cy="0" rx="72" ry="24" />
      <circle cx="-36" cy="-16" r="28" />
      <circle cx="6" cy="-32" r="36" />
      <circle cx="44" cy="-12" r="26" />
    </g>
  </g>
);

/**
 * Ét bregneblad tegnet som ÉN sti: stilken med småbladene som takker i omridset,
 * der bliver mindre mod spidsen. Basen ligger i (0,0); `rot` drejer hele bladet.
 */
const frond = (len: number, rot: number, color: string, key: string, slank = 1) => {
  const n = Math.max(4, Math.round(len / 17));
  const blade = Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    const w = Math.max(4, Math.round(len * 0.16 * (1 - t * 0.65)));
    const h = Math.max(2, Math.round(w * 0.38 * slank));
    return {
      y: -Math.round(len * t),
      h,
      tx: Math.round(w * 1.7) + 2, // spidsen af småbladet
      ty: -Math.round(len * t) - Math.round(w * 0.95),
      lx: Math.round(w * 1.1), // kontrolpunkt for underkanten
      ux: Math.round(w * 0.75), // kontrolpunkt for overkanten
      uy: -Math.round(len * t) - Math.round(w * 0.95) - Math.round(h * 0.9),
    };
  });
  const højre = blade
    .map((b) => `L 2 ${b.y + b.h} Q ${b.lx} ${b.y + b.h} ${b.tx} ${b.ty} Q ${b.ux} ${b.uy} 2 ${b.y - b.h}`)
    .join(" ");
  const venstre = [...blade]
    .reverse()
    .map((b) => `L -2 ${b.y - b.h} Q ${-b.ux} ${b.uy} ${-b.tx} ${b.ty} Q ${-b.lx} ${b.y + b.h} -2 ${b.y + b.h}`)
    .join(" ");
  const top = `L 2 ${-len} Q 6 ${-len - 8} 0 ${-len - 14} Q -6 ${-len - 8} -2 ${-len}`;
  return <path key={key} transform={`rotate(${rot})`} fill={color} d={`M-3 0 L 3 0 ${højre} ${top} ${venstre} L -3 0 Z`} />;
};

/** Bregnebusk: en vifte af bregneblade fra samme rod. */
const FERN_FRONDS = [
  [-70, 100],
  [-44, 132],
  [-18, 154],
  [8, 148],
  [34, 130],
  [60, 104],
] as const;

const fern = (x: number, y: number, s: number, c1: string, c2: string, key: string, flip = false) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {FERN_FRONDS.map(([rot, len], i) => frond(len, rot, i % 2 ? c1 : c2, `${key}-${i}`))}
  </g>
);

type Bark = { base: string; lys: string; skygge: string; mærke: string };

// Bøgens bark er glat og grå med et let grønligt skær (ikke hvid som birkens).
const BARK_NÆR: Bark = { base: "#b6bcb3", lys: "#cbd1c7", skygge: "#9da49b", mærke: "#a0a79d" };
const BARK_MIDT: Bark = { base: "#c3c9bf", lys: "#d5dacf", skygge: "#adb4aa", mærke: "#aeb5ab" };
const BARK_FJERN: Bark = { base: "#d0d7cb", lys: "#dde2d6", skygge: "#c1c9bc", mærke: "#c1c9bc" };

/**
 * Bøgestamme: glat og lysegrå, let udsvajet ved roden. Basen ligger ved (x, yb),
 * toppen ved yt (skjult i løvet). `øjne` er bøgens karakteristiske grenar.
 */
const stamme = (x: number, yb: number, yt: number, wb: number, bark: Bark, key: string, øjne: readonly number[] = []) => {
  const hb = Math.round(wb / 2);
  const ht = Math.round(wb * 0.36);
  const f = Math.round(wb * 0.32);
  const lb = Math.round(wb * 0.24);
  const lt = Math.round(wb * 0.18);
  const krop = `M${x - hb - f} ${yb} Q${x - hb} ${yb - 6} ${x - hb} ${yb - 50} L${x - ht} ${yt} L${x + ht} ${yt} L${x + hb} ${yb - 50} Q${x + hb} ${yb - 6} ${x + hb + f} ${yb} Z`;
  const lys = `M${x - hb + 4} ${yb - 24} L${x - ht + 3} ${yt} L${x - ht + 3 + lt} ${yt} L${x - hb + 4 + lb} ${yb - 24} Z`;
  const skygge = `M${x + hb + f} ${yb} Q${x + hb} ${yb - 6} ${x + hb} ${yb - 50} L${x + ht} ${yt} L${x + ht - lt} ${yt} L${x + hb - lb} ${yb - 50} Q${x + hb - lb} ${yb - 8} ${x + hb - lb + f} ${yb} Z`;
  const mærker = øjne
    .map((y, i) => {
      const cx = x + (i % 2 ? -Math.round(wb * 0.12) : Math.round(wb * 0.1));
      return `M${cx - 10} ${y} q 10 -5 20 0 q -10 3 -20 0`;
    })
    .join(" ");
  return (
    <g key={key}>
      <path d={krop} fill={bark.base} />
      <path d={lys} fill={bark.lys} />
      <path d={skygge} fill={bark.skygge} />
      {mærker && <path d={mærker} fill={bark.mærke} />}
    </g>
  );
};

/** To grene der deler sig fra en stor stamme og forsvinder op i løvet. */
const grene = (x: number, color: string, key: string) => (
  <path
    key={key}
    fill={color}
    d={`M${x - 16} 280 Q${x - 60} 180 ${x - 150} 80 L${x - 132} 68 Q${x - 40} 160 ${x + 4} 250 Z M${x + 8} 266 Q${x + 50} 170 ${x + 120} 56 L${x + 138} 66 Q${x + 72} 180 ${x + 24} 290 Z`}
  />
);

/** Rød fluesvamp med hvide prikker. Foden ligger i (0,0). */
const fluesvamp = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-7 0 C -9 -10, -7 -20, -5 -28 L 5 -28 C 7 -20, 9 -10, 7 0 Z" fill="#f7f1e6" />
    <path d="M-8 -17 Q 0 -12 8 -17 L 7 -13 Q 0 -9 -7 -13 Z" fill="#e6dccb" />
    <path d="M-26 -26 C -27 -46, -12 -54, 0 -54 C 12 -54, 27 -46, 26 -26 C 14 -22, -14 -22, -26 -26 Z" fill="#e4493c" />
    <path d={cirkler([[-13, -38, 4], [1, -47, 4], [13, -37, 3], [-2, -33, 3], [20, -30, 2], [-21, -30, 2]])} fill="#fffaf0" />
  </g>
);

/** Brun svamp med tyk fod. Foden ligger i (0,0). */
const brunSvamp = (x: number, y: number, s: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 0 C -11 -10, -9 -18, -6 -24 L 6 -24 C 9 -18, 11 -10, 8 0 Z" fill="#efe3cc" />
    <path d="M-22 -22 C -22 -38, -10 -44, 0 -44 C 10 -44, 22 -38, 22 -22 C 12 -18, -12 -18, -22 -22 Z" fill="#a8683c" />
    <path d="M-14 -32 C -11 -39, -3 -42, 4 -42 C -4 -38, -8 -34, -10 -28 Z" fill="#c4885a" />
  </g>
);

/** Hvide anemoner: [x, y, r] hvor r er kronbladenes radius. Hele tæppet bliver tre stier. */
const KRONBLADE = [
  [0, -1.2],
  [1.15, -0.4],
  [0.7, 1],
  [-0.7, 1],
  [-1.15, -0.4],
] as const;

const anemoner = (liste: readonly Cirkel[], key: string) => {
  const blade: Ellipse[] = [];
  const kronblade: Cirkel[] = [];
  const midter: Cirkel[] = [];
  for (const [x, y, r] of liste) {
    blade.push([x - Math.round(r * 1.6), y + Math.round(r * 2.2), Math.round(r * 1.3), Math.round(r * 0.6)]);
    blade.push([x + Math.round(r * 1.5), y + Math.round(r * 2.6), Math.round(r * 1.2), Math.round(r * 0.55)]);
    for (const [dx, dy] of KRONBLADE) kronblade.push([x + Math.round(dx * r), y + Math.round(dy * r), r]);
    midter.push([x, y, Math.max(2, Math.round(r * 0.55))]);
  }
  return (
    <g key={key}>
      <path d={ellipser(blade)} fill="#6fae4a" />
      <path d={cirkler(kronblade)} fill="#fffef6" />
      <path d={cirkler(midter)} fill="#f6cf45" />
    </g>
  );
};

/**
 * Skovmærke set fra siden: en kort stilk med to flade bladkranse og en lille
 * skærm af hvide blomster i toppen. Alle planter bliver tre stier.
 */
const skovmærke = (liste: readonly (readonly [x: number, y: number])[], s: number, key: string) => {
  const k = (n: number) => Math.round(n * s);
  return (
    <g key={key}>
      <path d={liste.map(([x, y]) => `M${x} ${y}V${y - k(18)}`).join("")} stroke="#5f9f43" strokeWidth={k(2)} strokeLinecap="round" />
      <path d={ellipser(liste.flatMap(([x, y]) => [[x, y - k(4), k(11), k(3)], [x, y - k(12), k(8), k(2)]] as const))} fill="#6fae4a" />
      <path d={cirkler(liste.flatMap(([x, y]) => [[x - k(3), y - k(19), k(2)], [x + k(3), y - k(19), k(2)], [x, y - k(22), k(2)]] as const))} fill="#ffffff" />
    </g>
  );
};

const tuft = (x: number, y: number, s: number, color: string, key: string) => (
  <path
    key={key}
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M-12 0 C -12 -16, -8 -26, -14 -36 C -4 -28, -2 -14, 0 -30 C 2 -14, 4 -28, 14 -36 C 8 -26, 12 -16, 12 0 Z"
    fill={color}
  />
);

/* ---------- Løvkroner (cirkler, samlet til få stier) ---------- */

const KRONE_V_MØRK: Cirkel[] = [
  [-30, 60, 130],
  [110, 20, 120],
  [250, 50, 130],
  [390, 0, 120],
  [520, -20, 110],
  [640, -40, 90],
  [40, 190, 80],
  [160, 210, 70],
  [270, 200, 80],
  [380, 150, 70],
  [480, 90, 60],
  [0, 290, 60],
  [90, 270, 44],
];
const KRONE_V_MELLEM: Cirkel[] = [
  [100, 10, 95],
  [240, 30, 100],
  [380, -10, 95],
  [510, -30, 80],
  [30, 150, 60],
  [160, 165, 52],
  [270, 155, 58],
  [380, 110, 50],
  [470, 62, 40],
];
const KRONE_V_LYS: Cirkel[] = [
  [90, -10, 60],
  [230, 0, 62],
  [370, -30, 60],
  [150, 120, 30],
  [262, 112, 34],
  [372, 76, 28],
  [26, 110, 30],
];
const KRONE_MIDT_MØRK: Cirkel[] = [
  [700, -30, 80],
  [800, -48, 76],
  [900, -36, 80],
  [1000, -20, 90],
];
const KRONE_MIDT_MELLEM: Cirkel[] = [
  [720, -46, 60],
  [880, -54, 60],
  [1010, -36, 60],
];
/** Det blegere løv længere inde i skoven, bag de mellemste stammer. */
const KRONE_BAG: Cirkel[] = [
  [470, 170, 80],
  [570, 120, 74],
  [610, 210, 54],
  [1060, 150, 84],
  [1150, 200, 70],
  [990, 110, 60],
];

/* ---------- Fjern skov, buske og skovbund ---------- */

const FJERN_KRONER: Cirkel[] = Array.from({ length: 22 }, (_, i) => [i * 76 - 10, 440 - ((i * 7) % 3) * 12, 46 + ((i * 5) % 3) * 10] as const);
const FJERN_STAMMER = Array.from({ length: 30 }, (_, i) => {
  const x = i * 54 + ((i * 29) % 23);
  const w = 6 + (i % 3) * 2;
  return `M${x} 606V450h${w}V606Z`;
}).join("");
const BUSKE_BAG: Cirkel[] = Array.from({ length: 28 }, (_, i) => [i * 60 - 20, 588 - ((i * 5) % 3) * 8, 30 + ((i * 7) % 3) * 8] as const);
const BUSKE_FOR: Cirkel[] = Array.from({ length: 30 }, (_, i) => [i * 56 + 6, 604 - ((i * 2) % 3) * 6, 22 + ((i * 11) % 3) * 6] as const);

/** Lyspletter i skovbunden, hvor solen falder ned mellem kronerne. */
const LYSPLETTER: Ellipse[] = [
  [1010, 640, 150, 16],
  [470, 700, 90, 12],
  [1250, 740, 110, 13],
  [300, 820, 120, 14],
  [1120, 850, 90, 11],
];

const ANEMONER_BAG: Cirkel[] = [
  [150, 628, 4],
  [176, 640, 5],
  [206, 626, 4],
  [330, 634, 4],
  [352, 646, 5],
  [96, 652, 5],
  [60, 700, 6],
  [124, 724, 6],
  [40, 790, 7],
  [196, 812, 6],
  [560, 640, 4],
  [596, 630, 4],
  [1150, 640, 4],
  [1184, 652, 5],
  [1400, 632, 4],
  [1430, 644, 5],
  [1462, 628, 4],
  [1520, 660, 5],
  [1490, 714, 6],
  [1556, 740, 6],
  [1420, 800, 7],
  [1570, 830, 6],
];
const SKOVMÆRKE_BAG = [
  [250, 660],
  [276, 672],
  [228, 680],
  [1360, 660],
  [1338, 674],
  [1384, 680],
  [596, 650],
  [1120, 650],
] as const;

// Få, langsomme animationer: tre skyer, to lysstråle-grupper, søens glimt og to blade der daler.
const CSS = `
@keyframes zoo-skov-drift { from { transform: translateX(-18px); } to { transform: translateX(18px); } }
@keyframes zoo-skov-ray { from { opacity: 0.55; } to { opacity: 1; } }
@keyframes zoo-skov-shimmer { from { opacity: 0.25; } to { opacity: 0.85; } }
@keyframes zoo-skov-leaf {
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
  12% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translate(70px, 250px) rotate(220deg); }
}
.zoo-skov-leaf { opacity: 0; }
[data-animated] .zoo-skov-cloud { animation: zoo-skov-drift 30s ease-in-out infinite alternate; }
[data-animated] .zoo-skov-cloud-2 { animation-duration: 38s; animation-direction: alternate-reverse; }
[data-animated] .zoo-skov-ray { animation: zoo-skov-ray 7s ease-in-out infinite alternate; }
[data-animated] .zoo-skov-ray-2 { animation-duration: 9s; animation-direction: alternate-reverse; }
[data-animated] .zoo-skov-shimmer { animation: zoo-skov-shimmer 3.5s ease-in-out infinite alternate; }
[data-animated] .zoo-skov-leaf { transform-box: fill-box; transform-origin: center; animation: zoo-skov-leaf 17s ease-in-out infinite; }
[data-animated] .zoo-skov-leaf-2 { animation-duration: 23s; animation-delay: -9s; }
@media (prefers-reduced-motion: reduce) {
  [data-animated] .zoo-skov-cloud, [data-animated] .zoo-skov-ray, [data-animated] .zoo-skov-shimmer,
  [data-animated] .zoo-skov-leaf { animation: none; }
}
`;

const BLAD = "M0 -9 C 7 -5, 7 5, 0 9 C -7 5, -7 -5, 0 -9 Z";

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
        <linearGradient id="skov-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#cfe8d2" />
          <stop offset="0.3" stopColor="#e3f1dc" />
          <stop offset="0.55" stopColor="#f7f5da" />
          <stop offset="1" stopColor="#f1f2d4" />
        </linearGradient>
        <radialGradient id="skov-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbe0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffbe0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skov-ray" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="620">
          <stop offset="0" stopColor="#fffbe3" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#fffbe3" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fffbe3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="skov-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c3e09a" />
          <stop offset="1" stopColor="#a6cf7a" />
        </linearGradient>
        <linearGradient id="skov-path" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#efe0b8" />
          <stop offset="1" stopColor="#e2c99a" />
        </linearGradient>
        <linearGradient id="skov-lake" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c4ebe6" />
          <stop offset="1" stopColor="#8fd0d4" />
        </linearGradient>
      </defs>
      <style>{CSS}</style>

      <rect width="1600" height="900" fill="url(#skov-sky)" />

      {/* Solens glød bag kronerne, hvor lyset kommer ind */}
      <circle cx="700" cy="40" r="300" fill="url(#skov-glow)" />

      {/* Skyer i hullet mellem trætoppene */}
      {cloud(770, 220, 0.9, "c1", "zoo-skov-cloud")}
      {cloud(990, 130, 0.7, "c2", "zoo-skov-cloud zoo-skov-cloud-2")}
      {cloud(620, 330, 0.55, "c3", "zoo-skov-cloud zoo-skov-cloud-2")}

      {/* Fjern, diset skov: stammer der forsvinder op i en blød løvvæg */}
      <rect x="0" y="440" width="1600" height="170" fill="#d5e8c4" />
      <path d={FJERN_STAMMER} fill="#c9dbbd" />
      <path d={cirkler(FJERN_KRONER)} fill="#d5e8c4" />

      {/* Blegt løv længere inde i skoven */}
      <path d={cirkler(KRONE_BAG)} fill="#c3e3a0" />

      {/* Mellemste bøgestammer */}
      {stamme(520, 598, 120, 24, BARK_FJERN, "s-m1")}
      {stamme(640, 598, 0, 16, BARK_FJERN, "s-m2")}
      {stamme(990, 598, 0, 18, BARK_FJERN, "s-m3")}
      {stamme(1100, 598, 120, 26, BARK_FJERN, "s-m4")}

      {/* Lysstråler der falder skråt ind mellem træerne */}
      <path className="zoo-skov-ray" fill="url(#skov-ray)" d="M520 0 L576 0 L860 610 L770 610 Z M640 0 L716 0 L1060 610 L930 610 Z" />
      <path className="zoo-skov-ray zoo-skov-ray-2" fill="url(#skov-ray)" d="M742 0 L784 0 L1160 600 L1090 600 Z" />

      {/* Buske og småplanter langs horisonten */}
      <path d={cirkler(BUSKE_BAG)} fill="#c0e09c" />
      <path d={cirkler(BUSKE_FOR)} fill="#acd585" />

      {/* Nære og store bøgestammer */}
      {stamme(80, 612, 0, 56, BARK_MIDT, "s-n1", [520, 400])}
      {stamme(400, 606, 120, 36, BARK_MIDT, "s-n2", [470])}
      {stamme(1210, 606, 120, 40, BARK_MIDT, "s-n3", [440])}
      {stamme(1530, 612, 0, 58, BARK_MIDT, "s-n4", [500, 380])}
      {grene(250, BARK_NÆR.base, "g-v")}
      {grene(1350, BARK_NÆR.base, "g-h")}
      {stamme(250, 616, 0, 86, BARK_NÆR, "s-v", [540, 430, 330])}
      {stamme(1350, 616, 0, 90, BARK_NÆR, "s-h", [520, 410, 310])}

      {/* Løvkronerne der rammer billedet ind foroven */}
      <path d={cirkler([...KRONE_V_MØRK, ...spejl(KRONE_V_MØRK, 14), ...KRONE_MIDT_MØRK])} fill="#8cc760" />
      <path d={cirkler([...KRONE_V_MELLEM, ...spejl(KRONE_V_MELLEM, 14), ...KRONE_MIDT_MELLEM])} fill="#a3d676" />
      <path d={cirkler([...KRONE_V_LYS, ...spejl(KRONE_V_LYS, 14)])} fill="#bde597" />

      {/* To blade der daler langsomt ned fra kronerne (kun når scenen er animeret) */}
      <g transform="translate(330 270)">
        <path className="zoo-skov-leaf" d={BLAD} fill="#9ccf68" />
      </g>
      <g transform="translate(1230 290)">
        <path className="zoo-skov-leaf zoo-skov-leaf-2" d={BLAD} fill="#b4dc80" />
      </g>

      {/* Skovsøen */}
      <path
        d="M400 600 C 410 584, 470 578, 530 578 C 600 578, 650 586, 656 600 C 650 614, 590 620, 528 620 C 466 620, 406 614, 400 600 Z"
        fill="#d9cfa6"
      />
      <path
        d="M410 600 C 420 588, 476 584, 530 584 C 594 584, 638 590, 644 600 C 638 610, 586 615, 528 615 C 470 615, 416 610, 410 600 Z"
        fill="url(#skov-lake)"
      />
      <path d={ellipser([[454, 604, 14, 4], [610, 596, 11, 3]])} fill="#86c05c" />
      <g className="zoo-skov-shimmer" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <path d="M480 594 H 520 M548 604 H 596 M500 608 H 530" />
      </g>

      {/* Mosgroet væltet træstamme */}
      <g>
        <path d="M1046 586 C 1110 576, 1190 578, 1250 588 L 1252 616 C 1190 622, 1110 622, 1048 616 Z" fill="#a98563" />
        <path d="M1080 604 C 1130 600, 1180 602, 1230 606 M1100 612 C 1140 610, 1180 612, 1210 614" stroke="#8c6b4c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M1150 584 L 1160 560 L 1172 562 L 1168 584 Z" fill="#a98563" />
        <path d="M1054 588 C 1080 570, 1120 570, 1146 580 C 1170 568, 1220 570, 1250 590 C 1210 594, 1100 594, 1054 588 Z" fill="#8cc35a" />
        <path d={ellipser([[1092, 580, 16, 5], [1196, 580, 20, 5]])} fill="#a9d777" />
        <ellipse cx="1048" cy="601" rx="12" ry="16" fill="#e8d3a8" />
        <ellipse cx="1048" cy="601" rx="6" ry="9" fill="none" stroke="#c9a978" strokeWidth="2.5" />
      </g>

      {/* Bregner ved stammerne */}
      {fern(170, 616, 0.8, "#5aa64e", "#6ab85a", "bregne-v1")}
      {fern(338, 612, 0.6, "#6ab85a", "#7cc366", "bregne-v2", true)}
      {fern(1290, 614, 0.7, "#6ab85a", "#7cc366", "bregne-h1")}
      {fern(1440, 616, 0.85, "#5aa64e", "#6ab85a", "bregne-h2", true)}
      {fern(700, 604, 0.4, "#7cc366", "#8ccf74", "bregne-m1")}
      {fern(940, 604, 0.36, "#7cc366", "#8ccf74", "bregne-m2", true)}

      {/* Skovbunden */}
      <path
        d="M0 612 C 260 600, 520 610, 800 606 C 1080 602, 1340 610, 1600 606 L 1600 900 L 0 900 Z"
        fill="url(#skov-ground)"
      />
      <path
        d="M0 614 C 260 602, 520 612, 800 608 C 1080 604, 1340 612, 1600 608"
        stroke="#dcedb2"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path d={ellipser(LYSPLETTER)} fill="#eef7c9" opacity="0.3" />

      {/* Skovstien der snor sig ind mellem træerne */}
      <path
        d="M808 608 C 800 660, 742 720, 704 790 C 680 836, 668 870, 664 900 L 1012 900 C 990 850, 960 800, 930 750 C 892 690, 866 650, 860 608 Z"
        fill="url(#skov-path)"
      />
      <path
        d="M800 660 C 760 720, 716 790, 700 880 M872 660 C 900 720, 960 800, 982 880"
        stroke="#d6bd8a"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Svampe ved roden af træerne og ved den væltede stamme */}
      {fluesvamp(1272, 636, 0.95, "fs-1")}
      {fluesvamp(1302, 638, 0.55, "fs-2")}
      {fluesvamp(372, 640, 0.6, "fs-3")}
      {brunSvamp(304, 638, 0.8, "bs-1")}
      {brunSvamp(322, 642, 0.55, "bs-2")}
      {brunSvamp(1030, 626, 0.6, "bs-3")}

      {/* Anemoner og skovmærke */}
      {anemoner(ANEMONER_BAG, "anemoner")}
      {skovmærke(SKOVMÆRKE_BAG, 1.2, "skovmærke")}

      {/* Græstotter i skovbunden */}
      <g opacity="0.7">
        {Array.from({ length: 30 }, (_, i) => {
          const x = (i * 211 + 40) % 1600;
          const y = 650 + ((i * 97) % 230);
          if (x > 640 && x < 1040) return null; // ikke på stien
          return tuft(x, y, r2(0.55 + (i % 3) * 0.15), i % 2 ? "#8cbd5c" : "#9fcc6a", `tuft-${i}`);
        })}
      </g>
    </svg>
  );
}

const ANEMONER_FOR: Cirkel[] = [
  [214, 862, 9],
  [262, 884, 8],
  [180, 890, 7],
  [1388, 866, 9],
  [1340, 886, 8],
  [1430, 892, 7],
];

/** Forgrundsplanter der ligger foran dyrene i de nederste hjørner. */
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
        {fern(-6, 918, 1.55, "#3f8a3a", "#4f9c44", "fg-bregne-v1")}
        {fern(150, 916, 0.95, "#4f9c44", "#5fae4e", "fg-bregne-v2", true)}
        {fluesvamp(252, 902, 1.3, "fg-fs")}
        {tuft(296, 906, 1.4, "#4f9c44", "fg-tuft-v")}
      </g>
      {/* højre hjørne */}
      <g>
        {fern(1606, 918, 1.55, "#3f8a3a", "#4f9c44", "fg-bregne-h1", true)}
        {fern(1450, 916, 0.95, "#4f9c44", "#5fae4e", "fg-bregne-h2")}
        {brunSvamp(1340, 902, 1.3, "fg-bs-1")}
        {brunSvamp(1374, 906, 0.85, "fg-bs-2")}
        {tuft(1300, 906, 1.4, "#4f9c44", "fg-tuft-h")}
      </g>
      {anemoner(ANEMONER_FOR, "fg-anemoner")}
    </svg>
  );
}
