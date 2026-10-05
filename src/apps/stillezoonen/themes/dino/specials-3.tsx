import type { CSSProperties, ReactNode } from "react";
import { EYE, Klip } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Legendariske dinoer med særlig opførsel. `art` er figuren, når den går,
 * hopper eller flyver; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Afrunder til 2 decimaler. */
const r2 = (v: number) => +v.toFixed(2);

type Pkt = [number, number];

const REGNBUE = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"];

/** Punkt i afstanden `r` fra `p` i retningen `grader` (0 = højre, 90 = ned). */
const fra = ([x, y]: Pkt, grader: number, r: number): Pkt => {
  const v = (grader * Math.PI) / 180;
  return [r2(x + r * Math.cos(v)), r2(y + r * Math.sin(v))];
};

/** Drejepunkt (i procent af gruppens egen boks) for et punkt `p` blandt `alle` punkter. */
const drejepunkt = (p: Pkt, alle: Pkt[]) => {
  const xs = alle.map((q) => q[0]);
  const ys = alle.map((q) => q[1]);
  const px = (p[0] - Math.min(...xs)) / (Math.max(...xs) - Math.min(...xs) || 1);
  const py = (p[1] - Math.min(...ys)) / (Math.max(...ys) - Math.min(...ys) || 1);
  return `${Math.round(px * 100)}% ${Math.round(py * 100)}%`;
};

/**
 * Noget, der stiger op (zoo-fx-rise). zoo-fx-rise flytter 120 % af gruppens
 * egen højde, så en usynlig stang på `hoejde` over indholdet giver en længere tur.
 */
const stiger = (x: number, y: number, hoejde: number, d: string, indhold: ReactNode, key?: string | number, kant = "#7a4a12") => (
  <g key={key} className="zoo-fx-rise" style={fx(d)}>
    <rect x={x} y={y - hoejde} width="1" height={hoejde} fill="none" stroke="none" />
    <g stroke={kant} strokeWidth="0.8" strokeLinejoin="round">
      {indhold}
    </g>
  </g>
);

/* ------------------------------------------------------------------------ */
/* Krystal-triceratopsen (legendarisk)                                      */
/* ------------------------------------------------------------------------ */

const KT_KROP = "#9a80e6";
const KT_MOERK = "#7656cf";
const KT_SKJOLD = "#6f4fc8";
const KT_SKJOLD_INDRE = "#8fe6dc";
const KT_BUG = "#ece4ff";
const KT_SNUDE = "#c2b0f7";
const KT_KLOE = "#f3eeff";

type KrystalFarve = { mid: string; lys: string; kant: string };
const TURKIS: KrystalFarve = { mid: "#3fd6c6", lys: "#cffbf5", kant: "#0e8a84" };
const ROSA: KrystalFarve = { mid: "#e98cf5", lys: "#fbe0ff", kant: "#a33fbb" };
const LILLA: KrystalFarve = { mid: "#a99cff", lys: "#ecebff", kant: "#5b45c4" };
const KRYSTAL_FARVER = [TURKIS, ROSA, LILLA];

/** Lille krystal med foden i (x, y) og spidsen i retningen `grader` (0 = højre, -90 = op). */
const krystal = (x: number, y: number, grader: number, l: number, b: number, f: KrystalFarve, key?: string | number) => {
  const skulder = r2(-l * 0.55);
  const form = `M${-b} 0 L ${-b} ${skulder} L 0 ${-l} L ${b} ${skulder} L ${b} 0 Z`;
  return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${r2(grader + 90)})`}>
      <path d={form} fill={f.mid} />
      <path d={`M0 0 L 0 ${-l} L ${b} ${skulder} L ${b} 0 Z`} fill={f.lys} />
      <path d={form} fill="none" stroke={f.kant} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  );
};

/** Krystalhorn: en trekant med en lys og en mørk facet. `a`, `c` er foden, `spids` spidsen. */
const krystalHorn = (a: Pkt, spids: Pkt, c: Pkt, f: KrystalFarve) => {
  const m: Pkt = [r2((a[0] + c[0]) / 2), r2((a[1] + c[1]) / 2)];
  return (
    <>
      <path d={`M${a[0]} ${a[1]} L ${spids[0]} ${spids[1]} L ${m[0]} ${m[1]} Z`} fill={f.lys} />
      <path d={`M${m[0]} ${m[1]} L ${spids[0]} ${spids[1]} L ${c[0]} ${c[1]} Z`} fill={f.mid} />
      <path d={`M${a[0]} ${a[1]} L ${spids[0]} ${spids[1]} L ${c[0]} ${c[1]} Z`} fill="none" stroke={f.kant} strokeWidth="2" strokeLinejoin="round" />
    </>
  );
};

/** Punkt på en ellipse (vinkel i grader, y vender nedad). */
const paaEllipse = (cx: number, cy: number, rx: number, ry: number, grader: number): Pkt => {
  const v = (grader * Math.PI) / 180;
  return [r2(cx + rx * Math.cos(v)), r2(cy + ry * Math.sin(v))];
};

/** Skjoldets kant af krystaller (samme vinkler som Triceratops' runde kant). */
const skjoldKrystaller = Array.from({ length: 10 }, (_, i) => {
  const g = 140 + i * 20;
  const [x, y] = paaEllipse(158, 56, 28, 36, g);
  return krystal(x, y, g, i % 2 ? 15 : 19, 5.5, KRYSTAL_FARVER[i % 3], i);
});

/** Små krystaller langs ryggen. */
const rygKrystaller = [216, 236, 256, 276, 296].map((g, i) => {
  const [x, y] = paaEllipse(98, 80, 64, 35, g);
  return krystal(x, y, g, i % 2 ? 11 : 14, 4, KRYSTAL_FARVER[(i + 1) % 3], g);
});

/** Hovedet med krystalskjold og krystalhorn (koordinater som Triceratops i creatures-1.tsx). */
const krystalHoved = (
  <>
    {skjoldKrystaller}
    <ellipse cx="158" cy="56" rx="32" ry="40" fill={KT_SKJOLD} />
    <ellipse cx="158" cy="58" rx="21" ry="29" fill={KT_SKJOLD_INDRE} />
    <path d="M146 40 C 150 34, 158 31, 165 33" stroke="#e6fffb" strokeWidth="3" fill="none" strokeLinecap="round" />
    <g fill="#ffffff" opacity="0.85">
      {[160, 180, 200, 220, 240, 260, 280, 300].map((g) => {
        const [x, y] = paaEllipse(158, 58, 26, 34, g);
        return <circle key={g} cx={x} cy={y} r="2.2" />;
      })}
    </g>
    {/* Bageste horn (fjernt). */}
    {krystalHorn([200, 56], [240, 36], [214, 68], LILLA)}
    {/* Hovedet. */}
    <path d="M164 68 C 172 52, 198 50, 216 60 C 230 68, 234 84, 226 94 C 216 106, 186 108, 172 98 C 162 90, 160 78, 164 68 Z" fill={KT_KROP} />
    <path d="M214 60 C 228 66, 236 80, 230 92 C 226 98, 218 98, 212 94 Z" fill={KT_SNUDE} />
    <path d="M198 98 Q 214 104 228 92" stroke="#4a2c9a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    {/* Næsehorn og det nære øjenbrynshorn. */}
    {krystalHorn([218, 68], [234, 54], [230, 78], ROSA)}
    {krystalHorn([192, 56], [232, 20], [208, 64], TURKIS)}
    {EYE(196, 72, 5)}
    <circle cx="206" cy="88" r="5.5" fill="#ff9fc0" opacity="0.6" />
  </>
);

/** Krop med krystalryg (uden ben og hoved). */
const krystalKrop = (
  <>
    <path d="M42 62 C 24 68, 12 84, 6 102 C 20 98, 34 96, 46 94 Z" fill={KT_KROP} />
    {rygKrystaller}
    <ellipse cx="98" cy="80" rx="68" ry="38" fill={KT_KROP} />
    <path d="M40 94 C 66 120, 130 122, 158 96 C 134 108, 66 108, 40 94 Z" fill={KT_BUG} />
    <path d="M52 60 C 70 48, 100 44, 124 48" stroke="#b7a3f2" strokeWidth="5" fill="none" strokeLinecap="round" />
    <g fill="#5fe0d0">
      <circle cx="74" cy="66" r="4" />
      <circle cx="98" cy="62" r="4.6" />
      <circle cx="120" cy="68" r="3.6" />
      <circle cx="86" cy="80" r="3" />
      <circle cx="110" cy="82" r="3" />
    </g>
  </>
);

/** Et ben med lyse klør (`x` er venstre kant). */
const krystalBen = (x: number, w: number, fill: string) => (
  <>
    <rect x={x} y="94" width={w} height="46" rx="10" fill={fill} />
    <ellipse cx={x + w / 2} cy="136.5" rx={w / 2 - 1} ry="3.5" fill={KT_KLOE} />
  </>
);

/** Hovedet løftes ved at dreje det om nakken. */
const KT_NAKKE: Pkt = [166, 84];
const KT_LOEFT = -14;
const drejNakke = ([x, y]: Pkt): Pkt => {
  const v = (KT_LOEFT * Math.PI) / 180;
  const [cx, cy] = KT_NAKKE;
  return [r2(cx + (x - cx) * Math.cos(v) - (y - cy) * Math.sin(v)), r2(cy + (x - cx) * Math.sin(v) + (y - cy) * Math.cos(v))];
};

/** En lysstråle ud fra en hornspids; vokser ud fra spidsen, når den blinker. */
const lysStraale = (spids: Pkt, grader: number, l: number, farve: string, d: string, key: number) => {
  const start = fra(spids, grader, 3);
  const a = fra(spids, grader - 7, l);
  const b = fra(spids, grader + 7, l);
  const ia = fra(spids, grader - 2.5, l * 0.82);
  const ib = fra(spids, grader + 2.5, l * 0.82);
  return (
    <g key={key} className="zoo-fx-sparkle" style={{ ...fx(d, drejepunkt(start, [start, a, b])), animationDuration: "1.5s" }}>
      <path d={`M${start[0]} ${start[1]} L ${a[0]} ${a[1]} L ${b[0]} ${b[1]} Z`} fill={farve} stroke={farve} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${start[0]} ${start[1]} L ${ia[0]} ${ia[1]} L ${ib[0]} ${ib[1]} Z`} fill="#ffffff" opacity="0.75" />
    </g>
  );
};

const KT_HORN_SPIDS = drejNakke([232, 20]);
const KT_BAGHORN_SPIDS = drejNakke([240, 36]);
const KT_NAESE_SPIDS = drejNakke([234, 54]);

/** Regnbuevifte fra det store horn (blinker i forskudt takt, som et fyrtårn). */
const regnbueStraaler = REGNBUE.map((farve, i) =>
  lysStraale(KT_HORN_SPIDS, -165 + i * 24, 46, farve, `${r2((REGNBUE.length - i) * 0.25)}s`, i),
);

/** Mindre stråler fra det bageste horn og næsehornet. */
const smaaStraaler = [
  lysStraale(KT_BAGHORN_SPIDS, -36, 22, "#f472b6", "0.4s", 10),
  lysStraale(KT_BAGHORN_SPIDS, -8, 20, "#22d3ee", "1.1s", 11),
  lysStraale(KT_NAESE_SPIDS, 14, 16, "#facc15", "0.75s", 12),
];

/** Lilla-turkis triceratops med krystalhorn — står den stille, løfter den hovedet, og hornene sender regnbuelys ud. */
const crystalTrice: CreatureSpec = {
  name: "Krystal-triceratopsen",
  rarity: "legendary",
  height: 24.2,
  aspect: 256 / 188,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 -48 256 188",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{krystalBen(128, 24, KT_MOERK)}</g>
      <g className="zoo-leg zoo-leg-b">{krystalBen(44, 24, KT_MOERK)}</g>
      <g className="zoo-torso">
        {krystalKrop}
        <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(98, 62, 4.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(78, 44, 3.4, "#cffbf5")}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">{krystalBen(136, 26, KT_KROP)}</g>
      <g className="zoo-leg zoo-leg-a">{krystalBen(52, 26, KT_KROP)}</g>
      <g className="zoo-head">
        {krystalHoved}
        {/* Krystallerne funkler. */}
        <g className="zoo-fx-sparkle">{GLIMT(228, 24, 4.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(130, 22, 3.6, "#fbe0ff")}</g>
        <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(236, 40, 3)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(158, 14, 3.2, "#cffbf5")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {krystalBen(128, 24, KT_MOERK)}
      {krystalBen(44, 24, KT_MOERK)}
      {krystalKrop}
      {krystalBen(136, 26, KT_KROP)}
      {krystalBen(52, 26, KT_KROP)}
      {/* Blødt lysskær bag hornspidsen, der pulserer. */}
      <g className="zoo-fx-sparkle" style={{ ...fx("0.2s"), animationDuration: "1.5s" }}>
        <circle cx={KT_HORN_SPIDS[0]} cy={KT_HORN_SPIDS[1]} r="18" fill="#fff7c2" opacity="0.7" />
      </g>
      {/* Hovedet løftet stolt. */}
      <g transform={`rotate(${KT_LOEFT} ${KT_NAKKE[0]} ${KT_NAKKE[1]})`}>{krystalHoved}</g>
      {regnbueStraaler}
      {smaaStraaler}
      {/* Hornspidsen funkler. */}
      <g className="zoo-fx-sparkle" style={fx("0.1s")}>{GLIMT(KT_HORN_SPIDS[0], KT_HORN_SPIDS[1], 6)}</g>
      {/* Glimt og stjerner omkring. */}
      <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(130, 8, 4.5, "#cffbf5")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(98, 62, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.45s")}>{STJERNE(70, 28, 5, "#fde047")}</g>
      {stiger(150, 8, 14, "0s", STJERNE(150, 8, 5.5, "#f9a8d4"), "s1")}
      {stiger(110, 30, 18, "0.8s", STJERNE(110, 30, 5, "#67e8f9"), "s2")}
      {stiger(184, -10, 10, "1.6s", HJERTE(184, -10, 5, "#f472b6"), "s3")}
      {stiger(40, 50, 18, "1.2s", STJERNE(40, 50, 4.5, "#c4b5fd"), "s4")}
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Komet-pteranodonen (legendarisk)                                         */
/* ------------------------------------------------------------------------ */

const KP_KROP = "#33449e";
const KP_MOERK = "#222d73";
const KP_VINGE = "#3e54bd";
const KP_RIBBE = "#5d72d8";
const KP_KANT = "#1b2462";
const KP_BUG = "#9fb0f5";
const KP_KAM = "#ffc93c";
const KP_NAEB = "#d6ddff";
const KP_STOEV = "#fff4b8";

/** Den glitrende komethale bag flyveøglen. */
const kometHale = (
  <>
    {/* Tre lysstriber, der spidser til langt bag den (som et stjerneskud). */}
    <path d="M88 76 C 50 70, 0 62, -40 58 C 0 70, 50 84, 88 86 Z" fill="#b9c8ff" />
    <path d="M88 84 C 60 104, 10 110, -26 112 C 14 100, 60 90, 88 92 Z" fill="#e2c8ff" />
    <path d="M88 79 C 50 78, 0 82, -46 86 C 0 90, 50 92, 88 90 Z" fill="#ffe08a" />
    <path d="M88 82 C 60 82, 30 84, 0 86 C 30 87, 60 88, 88 88 Z" fill="#fffbe6" />
    <g fill="#ffffff">
      <circle cx="-20" cy="66" r="1.8" />
      <circle cx="-34" cy="96" r="2" />
      <circle cx="10" cy="104" r="1.6" />
      <circle cx="30" cy="70" r="1.6" />
      <circle cx="-4" cy="76" r="1.4" />
    </g>
    <g stroke="#b45309" strokeWidth="0.8" strokeLinejoin="round">
      {STJERNE(-12, 86, 5, KP_STOEV)}
      {STJERNE(40, 98, 3.6, "#ffffff")}
      {STJERNE(18, 70, 3.2, "#ffffff")}
    </g>
  </>
);

/** Fjerne vinge (mørkere) med lidt stjernestøv. */
const kometVingeBag = (
  <>
    <path d="M110 64 C 108 38, 98 16, 74 4 C 70 20, 74 30, 80 34 C 82 46, 88 54, 96 66 Z" fill={KP_MOERK} />
    <path d="M110 64 C 106 38, 96 16, 74 4" stroke={KP_KANT} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="90" cy="30" r="1.5" fill={KP_STOEV} />
    <circle cx="98" cy="48" r="1.3" fill="#ffffff" />
  </>
);

/** Nære vinge med stjernestøv. */
const kometVingeFor = (
  <>
    <path
      d="M102 68 C 84 44, 50 22, 10 16 C 22 28, 28 36, 30 46 C 40 46, 46 52, 48 62 C 60 62, 68 70, 70 80 C 82 82, 92 82, 104 80 Z"
      fill={KP_VINGE}
    />
    <path d="M102 68 C 84 44, 50 22, 10 16" stroke={KP_KANT} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M102 70 L 30 46 M102 72 L 48 62 M102 74 L 70 80" stroke={KP_RIBBE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {STJERNE(56, 40, 4.2, KP_STOEV)}
    {STJERNE(84, 62, 3.2, "#ffffff")}
    <g fill="#ffffff">
      <circle cx="36" cy="30" r="1.5" />
      <circle cx="70" cy="50" r="1.4" />
      <circle cx="44" cy="52" r="1.2" />
      <circle cx="90" cy="74" r="1.3" />
    </g>
    <g fill="#a5f3fc">
      <circle cx="24" cy="24" r="1.3" />
      <circle cx="66" cy="72" r="1.2" />
    </g>
  </>
);

/** Lille hale og fødder. */
const kometFoedder = (
  <>
    <path d="M82 76 L 60 90 L 84 88 Z" fill={KP_MOERK} />
    <path d="M96 88 L 92 102 L 100 102 L 104 90 Z" fill={KP_MOERK} />
    <path d="M114 88 L 112 102 L 120 102 L 120 90 Z" fill={KP_MOERK} />
  </>
);

const kometKrop = (
  <>
    <ellipse cx="108" cy="76" rx="32" ry="16" fill={KP_KROP} transform="rotate(-8 108 76)" />
    <ellipse cx="112" cy="84" rx="22" ry="8" fill={KP_BUG} transform="rotate(-8 112 84)" />
  </>
);

/** Hoved med gylden stjernekam (koordinater som Pteranodon i creatures-2.tsx). */
const kometHoved = (
  <>
    <path d="M122 70 C 134 66, 140 60, 146 54" stroke={KP_KROP} strokeWidth="16" fill="none" strokeLinecap="round" />
    <path d="M146 40 C 130 28, 110 24, 84 32 C 106 44, 128 54, 148 56 Z" fill={KP_KAM} stroke="#d99a1c" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M136 40 C 124 34, 110 32, 96 34" stroke="#fff3c4" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="151" cy="50" rx="15" ry="11" fill={KP_KROP} />
    <path d="M158 43 C 172 46, 188 52, 199 57 L 196 61 C 180 62, 166 61, 156 58 Z" fill={KP_NAEB} />
    <path d="M156 58 C 168 62, 184 62, 196 61" stroke="#7f8fd6" strokeWidth="2" fill="none" strokeLinecap="round" />
    {EYE(152, 47, 3.8)}
    <circle cx="146" cy="56" r="3.4" fill="#f9a8d4" opacity="0.6" />
  </>
);

/** Punkter langs et hjerte (den klassiske hjertekurve), startende i spidsen forneden og rundt med uret. */
const HJ_MIDTE: Pkt = [262, 48];
const HJ_SKALA = 3;
const hjertePunkt = (t: number): Pkt => {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [r2(HJ_MIDTE[0] + HJ_SKALA * x), r2(HJ_MIDTE[1] - HJ_SKALA * y)];
};
const HJ_ANTAL = 16;
const HJ_TAKT = 0.2;
const HJ_FARVER = ["#ffd23f", "#ff6fae", "#ffffff", "#7dd3fc", "#c4b5fd"];

/** Den prikkede støvsti, så hjertet kan ses, også når stjernerne er slukket. */
const hjerteSti = `M${Array.from({ length: 64 }, (_, i) => hjertePunkt(Math.PI + (i * 2 * Math.PI) / 64).join(" ")).join(" L ")} Z`;

/** Stjernerne langs hjertet tændes én for én (forskudt --d), så hjertet tegnes rundt. */
const stjerneHjerte = Array.from({ length: HJ_ANTAL }, (_, i) => {
  const [x, y] = hjertePunkt(Math.PI + (i * 2 * Math.PI) / HJ_ANTAL);
  const farve = HJ_FARVER[i % HJ_FARVER.length];
  return (
    <g key={i} className="zoo-fx-sparkle" style={{ ...fx(`${r2((HJ_ANTAL - i) * HJ_TAKT)}s`), animationDuration: `${r2(HJ_ANTAL * HJ_TAKT)}s` }}>
      <g stroke="#b45309" strokeWidth="0.9" strokeLinejoin="round">
        {i % 2 ? GLIMT(x, y, 7, farve) : STJERNE(x, y, 7, farve)}
      </g>
    </g>
  );
});

/** Usynlig boks over hele højden, så zoo-fx-bob løfter flyveøglen et par streger. */
const KP_BOB_BOKS = <rect x="100" y="-10" width="1" height="140" fill="none" stroke="none" />;

/** Natblå flyveøgle med stjernestøv og komethale — står den stille, tegner den et hjerte af stjernestøv. */
const cometPteranodon: CreatureSpec = {
  name: "Komet-pteranodonen",
  rarity: "legendary",
  height: 12.9,
  aspect: 370 / 140,
  gait: "float",
  zone: "open",
  pace: 1.05,
  viewBox: "-50 -10 370 140",
  art: (
    <>
      {kometHale}
      <g className="zoo-fx-sparkle">{GLIMT(-26, 80, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(20, 92, 3.6, KP_STOEV)}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(-40, 106, 3.2)}</g>
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as CSSProperties}>{kometVingeBag}</g>
      {kometFoedder}
      <g className="zoo-torso">{kometKrop}</g>
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as CSSProperties}>
        {kometVingeFor}
        <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(40, 36, 4)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(78, 56, 3.4, KP_STOEV)}</g>
      </g>
      <g className="zoo-head">
        {kometHoved}
        <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(112, 30, 3.4, "#ffffff")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Flyveøglen svæver stille og vugger blødt. */}
      <g className="zoo-fx-bob" style={{ ...fx("0s"), animationDuration: "2s" }}>
        {KP_BOB_BOKS}
        {kometHale}
        {kometVingeBag}
        {kometFoedder}
        {kometKrop}
        {kometVingeFor}
        {kometHoved}
      </g>
      <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(-26, 80, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(40, 36, 4)}</g>
      {/* Stjernestøv drysser fra næbbet hen til hjertet. */}
      <g className="zoo-fx-sparkle" style={fx("0.2s")}>{GLIMT(205, 50, 3.4, KP_STOEV)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(209, 42, 2.6, "#ffffff")}</g>
      {/* Hjertet af stjernestøv foran den. */}
      <path d={hjerteSti} fill="#ff9ccb" opacity="0.3" />
      <path d={hjerteSti} stroke="#ec4899" strokeWidth="3" strokeDasharray="0.1 7" strokeLinecap="round" fill="none" />
      {stjerneHjerte}
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Det gyldne æg (legendarisk)                                              */
/* ------------------------------------------------------------------------ */

const AE_GULD = "#f6b92e";
const AE_SKYGGE = "#e39d14";
const AE_KANT = "#a86a0c";
const AE_GLANS = "#fff3c4";
const AE_LYS = "#ffe27a";
const UNGE_GULD = "#ffd94f";
const UNGE_BUG = "#fff2b3";

/** Æggets omrids (som Dinoæg i creatures-3.tsx). */
const AEG = "M30 2 C 46 2, 57 32, 57 50 C 57 63, 45 70, 30 70 C 15 70, 3 63, 3 50 C 3 32, 14 2, 30 2 Z";
const AEG_SKYGGE = "M42 8 C 52 22, 57 38, 57 50 C 57 63, 45 70, 30 70 C 40 62, 46 40, 42 8 Z";

/** Deler en kubisk bezier ved `t`: [første del, anden del]. */
const del = (p: [Pkt, Pkt, Pkt, Pkt], t: number): [[Pkt, Pkt, Pkt, Pkt], [Pkt, Pkt, Pkt, Pkt]] => {
  const mid = (a: Pkt, b: Pkt): Pkt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const [a, b, c, d] = p;
  const ab = mid(a, b), bc = mid(b, c), cd = mid(c, d);
  const abc = mid(ab, bc), bcd = mid(bc, cd);
  const m = mid(abc, bcd);
  return [
    [a, ab, abc, m],
    [m, bcd, cd, d],
  ];
};

/** Finder t, hvor kurven har højden `y` (kurven skal være monoton i y). */
const tVedY = (p: [Pkt, Pkt, Pkt, Pkt], y: number) => {
  let lo = 0, hi = 1;
  const yAt = (t: number) => del(p, t)[0][3][1];
  const opad = yAt(1) > yAt(0);
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (yAt(m) < y === opad) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
};

const rp = (p: Pkt) => `${r2(p[0])} ${r2(p[1])}`;

/** Revnen går tværs over ægget i højden 27; tænderne skiftevis op og ned. */
const REVNE_Y = 27;
const AEG_VENSTRE: [Pkt, Pkt, Pkt, Pkt] = [[3, 50], [3, 32], [14, 2], [30, 2]];
const AEG_HOEJRE: [Pkt, Pkt, Pkt, Pkt] = [[30, 2], [46, 2], [57, 32], [57, 50]];
const KAPPE_V = del(AEG_VENSTRE, tVedY(AEG_VENSTRE, REVNE_Y))[1];
const KAPPE_H = del(AEG_HOEJRE, tVedY(AEG_HOEJRE, REVNE_Y))[0];
const REVNE: Pkt[] = (() => {
  const xv = KAPPE_V[0][0];
  const xh = KAPPE_H[3][0];
  const n = 8;
  return Array.from({ length: n + 1 }, (_, i): Pkt => [r2(xv + ((xh - xv) * i) / n), i === 0 || i === n ? REVNE_Y : i % 2 ? 32 : 22]);
})();

/** Skallens top (kappen), der løftes af. */
const KAPPE = `M${rp(KAPPE_V[0])} C ${rp(KAPPE_V[1])}, ${rp(KAPPE_V[2])}, ${rp(KAPPE_V[3])} C ${rp(KAPPE_H[1])}, ${rp(KAPPE_H[2])}, ${rp(KAPPE_H[3])} ${[...REVNE]
  .reverse()
  .slice(1)
  .map((p) => `L ${rp(p)}`)
  .join(" ")} Z`;
/** Klip til skallens bund: alt under revnen. */
const UNDER_REVNEN = `M-10 ${REVNE_Y} ${REVNE.map((p) => `L ${rp(p)}`).join(" ")} L 70 ${REVNE_Y} L 70 80 L -10 80 Z`;
const REVNE_LINJE = `M${REVNE.map(rp).join(" L ")}`;

/** Det skinnende guldæg. `bund`: kun skallens bund vises, så glansen flyttes ned under revnen. */
const guldAeg = (bund = false) => (
  <>
    <path d={AEG} fill={AE_GULD} />
    <path d={AEG_SKYGGE} fill={AE_SKYGGE} />
    {bund ? (
      <ellipse cx="11" cy="48" rx="3.2" ry="7" transform="rotate(8 11 48)" fill={AE_GLANS} />
    ) : (
      <ellipse cx="18" cy="24" rx="4.6" ry="10" transform="rotate(20 18 24)" fill={AE_GLANS} />
    )}
    {!bund && <circle cx="14" cy="40" r="2.2" fill={AE_GLANS} />}
    {STJERNE(38, 22, 4, AE_LYS)}
    {STJERNE(22, 54, 4.6, AE_LYS)}
    {STJERNE(44, 50, 3.2, AE_LYS)}
    <circle cx="30" cy="38" r="2" fill={AE_LYS} />
    <circle cx="12" cy="58" r="1.6" fill={AE_LYS} />
    <path d={AEG} fill="none" stroke={AE_KANT} strokeWidth="2.2" />
  </>
);

/** Ungens krop og hoved som silhuet (farven arves), så kant og fyld kan tegnes hver for sig. */
const ungeForm = (
  <>
    <ellipse cx="29" cy="32" rx="15" ry="14" />
    <ellipse cx="29" cy="16" rx="10" ry="12" />
    <circle cx="30" cy="0" r="12.5" />
    <ellipse cx="42" cy="4" rx="10" ry="7.5" />
  </>
);

/** Regnbuekammen ned ad baghovedet og nakken. */
const ungeKam = (
  <g stroke={AE_KANT} strokeWidth="1.2">
    {(
      [
        [30, -13.5],
        [23.4, -11.6],
        [18.8, -7.2],
        [16.8, -1.4],
        [17.6, 5],
        [18.4, 12],
      ] as Pkt[]
    ).map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i === 0 || i === 5 ? 3.6 : 4.2} fill={REGNBUE[i]} />
    ))}
  </g>
);

/** Den lille gyldne unge, der kigger op af skallen. */
const guldUnge = (
  <>
    {ungeKam}
    <g fill={AE_KANT} stroke={AE_KANT} strokeWidth="3">
      {ungeForm}
    </g>
    <g fill={UNGE_GULD}>{ungeForm}</g>
    <ellipse cx="35" cy="20" rx="5" ry="9" fill={UNGE_BUG} />
    <path d="M22 -6 C 24 -9, 28 -10, 31 -9" stroke="#fff8d6" strokeWidth="2" fill="none" strokeLinecap="round" />
    {EYE(34, -2, 3.6)}
    <circle cx="48" cy="1" r="1" fill={AE_KANT} />
    <path d="M40 7.5 Q 45.5 12 51 7" stroke="#8a4f08" strokeWidth="1.8" fill="#e8584f" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="36" cy="7" r="2.8" fill="#ff8a9a" opacity="0.6" />
  </>
);

/** Armen, der vinker (skulderen sidder nederst til venstre i armens boks). */
const ungeArm = (
  <>
    <path d="M38 24 Q 50 24 56 14" stroke={AE_KANT} strokeWidth="6.4" fill="none" strokeLinecap="round" />
    <path d="M38 24 Q 50 24 56 14" stroke={UNGE_GULD} strokeWidth="3.6" fill="none" strokeLinecap="round" />
    <circle cx="57" cy="11.5" r="3.6" fill={UNGE_GULD} stroke={AE_KANT} strokeWidth="1.4" />
  </>
);

/** Skallens top med glans. */
const kappe = (
  <>
    <path d={KAPPE} fill={AE_GULD} stroke={AE_KANT} strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="19" cy="17" rx="3.4" ry="6.5" transform="rotate(24 19 17)" fill={AE_GLANS} />
    {STJERNE(38, 16, 3.6, AE_LYS)}
  </>
);

/** Konfetti-stykke (lille drejet firkant). */
const konfetti = (x: number, y: number, farve: string, vinkel: number) => (
  <rect x={x - 2.5} y={y - 1.5} width="5" height="3" rx="0.8" fill={farve} transform={`rotate(${vinkel} ${x} ${y})`} />
);

/** Skinnende guldæg — står det stille, klækker det, og en gylden unge med regnbuekam vinker. */
const goldenEgg: CreatureSpec = {
  name: "Det gyldne æg",
  rarity: "legendary",
  height: 10.8,
  aspect: 112 / 130,
  gait: "hop",
  pace: 1.15,
  viewBox: "-26 -58 112 130",
  art: (
    <>
      {guldAeg()}
      <g className="zoo-fx-sparkle">{GLIMT(20, 16, 5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(47, 58, 3.6)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(56, 14, 3.6, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(2, 30, 3, "#fff6c2")}</g>
    </>
  ),
  special: (
    <>
      {/* Skalstykker på jorden. */}
      <path d="M-12 70 L -8 63 L -4 67 L -1 62 L 1 70 Z" fill={AE_GULD} stroke={AE_KANT} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M62 70 L 65 64 L 68 68 L 72 63 L 74 70 Z" fill={AE_GULD} stroke={AE_KANT} strokeWidth="1.4" strokeLinejoin="round" />
      {/* Ungen kigger op (bag skallens bund). */}
      {guldUnge}
      {/* Skallens bund med takket revne. */}
      <Klip form={<path d={UNDER_REVNEN} />}>
        {guldAeg(true)}
        <Klip form={<path d={AEG} />}>
          <path d={REVNE_LINJE} stroke={AE_KANT} strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </Klip>
      </Klip>
      {/* Ungen vinker hen over kanten. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "0% 100%"), animationDuration: "0.6s" }}>{ungeArm}</g>
      {/* Skallens top løftes og vipper som en lille hat. */}
      <g className="zoo-fx-bob" style={{ ...fx("0.3s"), animationDuration: "1.1s" }}>
        <rect x="28" y="-58" width="1" height="100" fill="none" stroke="none" />
        <g className="zoo-fx-wave" style={{ ...fx("0.2s", "50% 100%"), animationDuration: "1.1s" }}>
          <g transform="translate(-3 -50)">{kappe}</g>
        </g>
      </g>
      {/* Glimt omkring ungen. */}
      <g className="zoo-fx-sparkle" style={fx("0.2s")}>{GLIMT(52, -12, 4)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.8s")}>{GLIMT(8, -6, 3.4, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(58, 40, 3.6)}</g>
      {/* Konfetti og stjerner stiger op. */}
      {stiger(-14, 40, 28, "0s", konfetti(-14, 40, "#ef4444", 30), "k1")}
      {stiger(-6, 20, 24, "0.5s", STJERNE(-6, 20, 4.4, "#facc15"), "k2")}
      {stiger(-20, 14, 22, "1.1s", konfetti(-20, 14, "#3b82f6", -20), "k3")}
      {stiger(-10, 54, 26, "1.7s", HJERTE(-10, 54, 4, "#f472b6"), "k4")}
      {stiger(68, 38, 28, "0.3s", konfetti(68, 38, "#22c55e", -35), "k5")}
      {stiger(76, 18, 24, "0.9s", STJERNE(76, 18, 4.4, "#f472b6"), "k6")}
      {stiger(80, 48, 26, "1.4s", konfetti(80, 48, "#8b5cf6", 15), "k7")}
      {stiger(64, 6, 20, "2s", STJERNE(64, 6, 3.6, "#38bdf8"), "k8")}
    </>
  ),
};

export const specialsThree: Record<string, CreatureSpec> = {
  crystalTrice,
  cometPteranodon,
  goldenEgg,
};
