import type { CSSProperties, ReactNode } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Usædvanlige jungledyr (uncommon): farvevarianter af frøen, tigeren,
 * krokodillen og slangen i creatures.tsx, plus en helt ny tarantel.
 * Samme konventioner: profil mod højre, fødderne på viewBox' bund.
 */

/* ---------- Frøer: samme form som "frog", forskellig farve og mønster ---------- */

type FrøFarver = {
  krop: string;
  bug: string;
  lårBag: string;
  fodFor: string;
  mund: string;
  /** Øjets hvide (eller gyldne) del. */
  øjeHvid: string;
  /** Mønster oven på kroppen (pletter, striber, organer). */
  mønsterKrop?: ReactNode;
  /** Mønster på hovedet. */
  mønsterHoved?: ReactNode;
  /** Mønster på det bageste lår. */
  mønsterLår?: ReactNode;
};

function frøArt(f: FrøFarver): ReactNode {
  return (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M24 54 C 6 60, 6 72, 26 74 L 42 74" stroke={f.lårBag} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {f.mønsterLår}
      </g>
      <g className="zoo-torso">
        <ellipse cx="56" cy="50" rx="36" ry="24" fill={f.krop} />
        <ellipse cx="62" cy="58" rx="24" ry="13" fill={f.bug} />
        {f.mønsterKrop}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M74 62 l 8 12 M76 74 h 12" stroke={f.fodFor} strokeWidth="7" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="68" cy="26" r="13" fill={f.krop} />
        <circle cx="88" cy="28" r="12" fill={f.krop} />
        {f.mønsterHoved}
        <circle cx="70" cy="25" r="8" fill={f.øjeHvid} />
        <circle cx="89" cy="27" r="7.5" fill={f.øjeHvid} />
        {EYE(72, 26, 4)}
        {EYE(91, 28, 4)}
        <path d="M78 50 q 10 6 18 -4" stroke={f.mund} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

const FRØ_BOX = {
  height: 8,
  aspect: 110 / 76,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 110 76",
} as const;

const blueDartFrog: CreatureSpec = {
  name: "Blå pilegiftfrø",
  rarity: "uncommon",
  ...FRØ_BOX,
  art: frøArt({
    krop: "#1f5fd6",
    bug: "#5d9bf2",
    lårBag: "#1849ad",
    fodFor: "#1c52c0",
    mund: "#0f2f75",
    øjeHvid: "#f3f7ff",
    // Sorte pletter: forskellige størrelser over ryg, hoved og lår
    mønsterKrop: (
      <g fill="#14161f">
        <circle cx="34" cy="42" r="4.2" />
        <circle cx="46" cy="34" r="3" />
        <circle cx="58" cy="38" r="4.6" />
        <circle cx="72" cy="36" r="3.4" />
        <circle cx="84" cy="44" r="2.8" />
        <circle cx="48" cy="50" r="3.2" />
        <circle cx="68" cy="50" r="2.6" />
        <circle cx="36" cy="54" r="2.4" />
      </g>
    ),
    mønsterHoved: (
      <g fill="#14161f">
        <circle cx="62" cy="30" r="2.4" />
        <circle cx="80" cy="21" r="2.2" />
        <circle cx="97" cy="31" r="2" />
      </g>
    ),
    mønsterLår: (
      <g fill="#14161f">
        <circle cx="13" cy="62" r="2.6" />
        <circle cx="30" cy="74" r="2.4" />
      </g>
    ),
  }),
};

const yellowDartFrog: CreatureSpec = {
  name: "Gul pilegiftfrø",
  rarity: "uncommon",
  ...FRØ_BOX,
  art: frøArt({
    krop: "#f6c723",
    bug: "#fdeb9a",
    lårBag: "#d9a20c",
    fodFor: "#e4b114",
    mund: "#8a5a05",
    øjeHvid: "#fffbe8",
    // Sorte striber på tværs af ryggen
    mønsterKrop: (
      <g stroke="#1b1712" strokeWidth="4.2" strokeLinecap="round" fill="none">
        <path d="M30 42 C 34 34, 38 32, 42 30" />
        <path d="M42 56 C 44 44, 48 36, 54 28" />
        <path d="M56 60 C 58 48, 62 40, 68 28" />
        <path d="M70 58 C 72 48, 76 42, 82 34" />
        <path d="M84 52 C 86 48, 88 46, 90 44" />
      </g>
    ),
    mønsterHoved: (
      <g stroke="#1b1712" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M60 20 C 63 26, 63 31, 61 36" />
        <path d="M76 18 q 2 -3 5 -3" />
      </g>
    ),
    mønsterLår: (
      <g stroke="#1b1712" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M10 58 l 6 4" />
        <path d="M18 72 l 4 -6" />
      </g>
    ),
  }),
};

const strawberryFrog: CreatureSpec = {
  name: "Jordbærfrø",
  rarity: "uncommon",
  ...FRØ_BOX,
  art: frøArt({
    krop: "#e8322f",
    bug: "#f7a08b",
    // Blå ben: både lår og fod
    lårBag: "#2f6fd0",
    fodFor: "#3a7fe0",
    mund: "#8c1414",
    øjeHvid: "#fff5f3",
    // Små sorte jordbærfrø-prikker
    mønsterKrop: (
      <g fill="#241214">
        <circle cx="38" cy="40" r="1.7" />
        <circle cx="48" cy="34" r="1.5" />
        <circle cx="58" cy="40" r="1.8" />
        <circle cx="68" cy="34" r="1.5" />
        <circle cx="78" cy="42" r="1.6" />
        <circle cx="44" cy="48" r="1.5" />
        <circle cx="64" cy="48" r="1.6" />
        <circle cx="52" cy="56" r="1.4" />
      </g>
    ),
    mønsterHoved: (
      <g fill="#241214">
        <circle cx="62" cy="28" r="1.5" />
        <circle cx="79" cy="20" r="1.4" />
      </g>
    ),
    mønsterLår: (
      <g fill="#ffffff" opacity="0.5">
        <circle cx="12" cy="60" r="1.8" />
        <circle cx="26" cy="73" r="1.6" />
      </g>
    ),
  }),
};

const glassFrog: CreatureSpec = {
  name: "Glasfrø",
  rarity: "uncommon",
  ...FRØ_BOX,
  art: frøArt({
    krop: "#98dc9c",
    bug: "#eaf7fc",
    lårBag: "#7cca87",
    fodFor: "#88d391",
    mund: "#5aa86a",
    // Guldøjne i stedet for hvide
    øjeHvid: "#f2c43a",
    // Gennemsigtig mave: lyseblå "organer" og et lille rødt hjerte
    mønsterKrop: (
      <>
        <ellipse cx="62" cy="55" rx="21" ry="10" fill="#d4ecf7" />
        <circle cx="54" cy="55" r="5" fill="#bfe0f0" />
        <circle cx="68" cy="56" r="6" fill="#c8e6f3" />
        <circle cx="76" cy="52" r="3.2" fill="#e9b8c4" />
        <circle cx="61" cy="47" r="3.2" fill="#e8798d" />
        <g fill="#f4ffe9" opacity="0.9">
          <circle cx="36" cy="40" r="1.6" />
          <circle cx="46" cy="34" r="1.4" />
          <circle cx="58" cy="36" r="1.6" />
          <circle cx="70" cy="33" r="1.4" />
          <circle cx="80" cy="40" r="1.5" />
        </g>
      </>
    ),
    mønsterHoved: (
      <g fill="#f4ffe9" opacity="0.9">
        <circle cx="62" cy="28" r="1.4" />
        <circle cx="98" cy="30" r="1.3" />
      </g>
    ),
  }),
};

/* ---------- Hvid tiger: samme form som "tiger" ---------- */

const whiteTiger: CreatureSpec = {
  name: "Hvid tiger",
  rarity: "uncommon",
  height: 18,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 210 124",
  art: (
    <>
      <path d="M42 62 C 24 58, 14 42, 20 24" stroke="#f3eee2" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M20 30 C 18 24, 19 20, 21 17" stroke="#5b3d2c" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M32 61 q 4 -2 8 0 M22 48 q 2 -4 6 -4" stroke="#5b3d2c" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="70" width="15" height="52" rx="7" fill="#d9d3c4" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="70" width="15" height="52" rx="7" fill="#d9d3c4" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="66" rx="64" ry="27" fill="#f7f2e6" />
        <path d="M54 80 C 80 94, 130 94, 152 82" fill="#ffffff" />
        <g stroke="#5b3d2c" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M70 42 q 6 12 0 24" />
          <path d="M88 39 q 7 14 0 28" />
          <path d="M106 39 q 7 14 0 28" />
          <path d="M124 41 q 6 12 0 24" />
          <path d="M52 50 q 5 9 0 18" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="150" y="72" width="16" height="50" rx="7" fill="#f7f2e6" />
        <path d="M151 84 h14 M151 94 h14" stroke="#5b3d2c" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="160" cy="120" rx="10" ry="4" fill="#ffffff" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="64" y="72" width="16" height="50" rx="7" fill="#f7f2e6" />
        <path d="M65 84 h14 M65 94 h14" stroke="#5b3d2c" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="74" cy="120" rx="10" ry="4" fill="#ffffff" />
      </g>
      <g className="zoo-head">
        <circle cx="160" cy="34" r="8" fill="#f7f2e6" /><circle cx="160" cy="34" r="4" fill="#e9b9b0" />
        <circle cx="186" cy="34" r="8" fill="#f7f2e6" /><circle cx="186" cy="34" r="4" fill="#e9b9b0" />
        <circle cx="174" cy="54" r="25" fill="#f7f2e6" />
        <ellipse cx="184" cy="66" rx="16" ry="11" fill="#ffffff" />
        <path d="M188 58 l 8 0 l -4 5 z" fill="#e59aa0" />
        <path d="M164 36 q 4 6 0 12 M178 32 q 3 5 0 10" stroke="#5b3d2c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="180" cy="49" r="6" fill="#7cc4ee" />
        {EYE(180, 49, 3.4)}
      </g>
    </>
  ),
};

/* ---------- Albino-krokodille: samme form som "crocodile" ---------- */

const albinoCroc: CreatureSpec = {
  name: "Albino-krokodille",
  rarity: "uncommon",
  height: 10,
  aspect: 260 / 80,
  gait: "walk",
  pace: 0.65,
  viewBox: "0 0 260 80",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M150 52 l 8 24 h 10" stroke="#e5bcb8" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M74 52 l 8 24 h 10" stroke="#e5bcb8" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-torso">
        <path d="M4 48 C 30 46, 50 34, 90 32 C 130 30, 170 32, 196 40 L 196 62 C 160 66, 110 66, 70 62 C 40 60, 20 56, 4 48 Z" fill="#f8e6e1" />
        <path d="M60 60 C 100 66, 150 66, 194 60" stroke="#fff8f4" strokeWidth="6" fill="none" strokeLinecap="round" />
        <g fill="#eac4c0">
          <path d="M60 36 l 6 -8 l 6 8 z" /><path d="M84 33 l 6 -8 l 6 8 z" /><path d="M108 32 l 6 -8 l 6 8 z" />
          <path d="M132 32 l 6 -8 l 6 8 z" /><path d="M156 34 l 6 -8 l 6 8 z" /><path d="M38 41 l 5 -7 l 5 7 z" />
        </g>
        <g fill="#f1cfcb">
          <circle cx="100" cy="46" r="3" /><circle cx="130" cy="48" r="2.6" /><circle cx="70" cy="48" r="2.4" /><circle cx="158" cy="50" r="2.6" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M164 56 l 6 20 h 10" stroke="#f8e6e1" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M90 56 l 6 20 h 10" stroke="#f8e6e1" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-head">
        <path d="M190 38 C 210 30, 222 34, 230 40 C 244 42, 256 44, 258 50 C 256 56, 236 58, 214 60 L 192 62 Z" fill="#f8e6e1" />
        <path d="M206 52 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5" stroke="#d98f98" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <circle cx="212" cy="34" r="8" fill="#f8e6e1" />
        <circle cx="214" cy="33" r="5.6" fill="#f58aa5" />
        {EYE(214, 33, 3)}
        <circle cx="252" cy="45" r="1.8" fill="#c27a82" />
      </g>
    </>
  ),
};

/* ---------- Regnbueboa: samme form som "snake", kobber med regnbueskær ---------- */

const BOA_SEGMENTER = [
  [18, 44, 5],
  [32, 42, 7],
  [48, 40, 9],
  [66, 40, 10],
  [86, 42, 11],
  [106, 44, 11],
  [126, 42, 11],
  [146, 40, 11],
  [166, 40, 10.5],
] as const;

/** Skærfarver fra hale til hoved; glider som olie på kobber. */
const BOA_SKÆR = ["#6a7bff", "#35c6d8", "#43d49a", "#b6e04a", "#f2c63a", "#f58b3c", "#ee5f8a", "#b06cf0", "#4fa9ff"];

const rainbowBoa: CreatureSpec = {
  name: "Regnbueboa",
  rarity: "uncommon",
  height: 8,
  aspect: 220 / 56,
  gait: "slither",
  pace: 0.9,
  viewBox: "0 0 220 56",
  art: (
    <>
      {BOA_SEGMENTER.map(([x, y, r], i) => (
        <g key={i} className="zoo-seg" style={{ "--i": i } as CSSProperties}>
          <circle cx={x} cy={y} r={r} fill="#a4551f" />
          <ellipse cx={x} cy={y + r * 0.5} rx={r * 0.8} ry={r * 0.4} fill="#d99a5e" />
          {/* regnbueskær: to farvede buer over ryggen, som olie på kobber */}
          <path
            d={`M${x - r * 0.75} ${y - r * 0.1} A ${r * 0.8} ${r * 0.8} 0 0 1 ${x + r * 0.75} ${y - r * 0.1}`}
            stroke={BOA_SKÆR[i]} strokeWidth={Math.max(1.6, r * 0.26)} fill="none" strokeLinecap="round" opacity="0.9"
          />
          <path
            d={`M${x - r * 0.45} ${y - r * 0.05} A ${r * 0.5} ${r * 0.5} 0 0 1 ${x + r * 0.45} ${y - r * 0.05}`}
            stroke={BOA_SKÆR[(i + 4) % 9]} strokeWidth={Math.max(1.2, r * 0.2)} fill="none" strokeLinecap="round" opacity="0.8"
          />
        </g>
      ))}
      <g className="zoo-seg zoo-head" style={{ "--i": 9 } as CSSProperties}>
        <path d="M200 46 l 12 -2 l 4 -4 M212 44 l 5 2" stroke="#d6453a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="186" cy="38" rx="17" ry="12" fill="#a4551f" />
        <ellipse cx="190" cy="43" rx="12" ry="5" fill="#d99a5e" />
        <path d="M172 34 C 178 24, 190 24, 198 28" stroke={BOA_SKÆR[8]} strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M174 38 C 180 31, 186 30, 190 32" stroke={BOA_SKÆR[6]} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
        <circle cx="192" cy="32" r="6" fill="#fff" />
        {EYE(193, 32, 3.4)}
      </g>
    </>
  ),
};

/* ---------- Tarantel: tegnet fra bunden, sød og lodden ---------- */

const FAR = "#5a4030";
const NÆR = "#7a5a42";

/** Ét ben med højt knæ. */
function ben(d: string, farve: string) {
  return <path d={d} stroke={farve} strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

/** Ring af små lodne totter rundt om en cirkel. */
function totter(cx: number, cy: number, r: number, antal: number, tr: number, farve: string) {
  return (
    <g fill={farve}>
      {Array.from({ length: antal }, (_, i) => {
        const v = (i / antal) * Math.PI * 2;
        // Afrundet, så server og browser giver samme tal (ellers hydreringsfejl).
        return <circle key={i} cx={+(cx + Math.cos(v) * r).toFixed(2)} cy={+(cy + Math.sin(v) * r).toFixed(2)} r={tr} />;
      })}
    </g>
  );
}

const tarantula: CreatureSpec = {
  name: "Tarantel",
  rarity: "uncommon",
  height: 7,
  aspect: 170 / 80,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 170 80",
  art: (
    <>
      {/* ben bag kroppen: 4 bagud + 1 fremad (mørke) */}
      <g className="zoo-leg zoo-leg-a">
        {ben("M84 56 C 70 14, 6 16, 10 78", FAR)}
        {ben("M80 60 C 60 44, 34 54, 40 78", FAR)}
        {ben("M96 52 C 106 6, 142 10, 146 78", FAR)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        {ben("M82 58 C 64 26, 18 34, 24 78", FAR)}
        {ben("M78 62 C 64 56, 50 64, 58 78", FAR)}
      </g>
      <g className="zoo-torso">
        {/* rund, lodden bagkrop */}
        <circle cx="54" cy="46" r="25" fill="#6a4a36" />
        {totter(54, 46, 24, 18, 3.6, "#6a4a36")}
        <circle cx="54" cy="46" r="21" fill="#7c5942" />
        {totter(54, 46, 14, 9, 3.2, "#8d6a50")}
        <g fill="#a98363" opacity="0.8">
          <circle cx="44" cy="40" r="2.6" /><circle cx="58" cy="36" r="3" /><circle cx="66" cy="50" r="2.4" />
          <circle cx="48" cy="54" r="2.4" /><circle cx="38" cy="50" r="2" />
        </g>
      </g>
      {/* forreste ben foran kroppen (lyse) */}
      <g className="zoo-leg zoo-leg-a">
        {ben("M100 54 C 114 12, 152 20, 156 78", NÆR)}
        {ben("M94 60 C 98 36, 120 44, 120 78", NÆR)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        {ben("M98 56 C 108 20, 138 28, 138 78", NÆR)}
      </g>
      <g className="zoo-head">
        {/* hoved/brystskjold med to store, søde øjne */}
        <circle cx="98" cy="52" r="18" fill="#7c5942" />
        {totter(98, 52, 17, 12, 3, "#7c5942")}
        <ellipse cx="102" cy="50" rx="14" ry="11" fill="#8d6a50" />
        <circle cx="102" cy="43" r="8" fill="#fff" />
        <circle cx="115" cy="48" r="6" fill="#fff" />
        {EYE(104, 44, 4.6)}
        {EYE(116, 49, 3.6)}
        <circle cx="108" cy="57" r="3" fill="#e9a0a0" opacity="0.55" />
        {/* små kæbeklør */}
        <ellipse cx="116" cy="62" rx="3.2" ry="5" fill="#5a4030" />
        <ellipse cx="108" cy="64" rx="3" ry="4.6" fill="#6a4a36" />
      </g>
    </>
  ),
};

/** Usædvanlige jungledyr (uncommon). */
export const variants: Record<string, CreatureSpec> = {
  blueDartFrog,
  yellowDartFrog,
  strawberryFrog,
  glassFrog,
  whiteTiger,
  albinoCroc,
  rainbowBoa,
  tarantula,
};
