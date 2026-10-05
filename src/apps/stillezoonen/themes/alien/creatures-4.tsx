import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige rumvæsner: lavasnegl, pigkugle, langhals, rumbille,
 * Mars-rover, krystalkrabbe, rumkanin og glimtorm. Profil mod højre (krabben
 * set forfra), bunden på bunden af viewBox.
 */

/** Indeks til `zoo-seg`-bølgen i CSS. */
const seg = (i: number) => ({ "--i": i }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Lavasnegl                                                           */
/* ------------------------------------------------------------------ */

const LAVA_SEGMENTS = [
  [10, 5],
  [22, 8],
  [34, 11],
  [46, 13.5],
  [58, 15],
  [70, 16],
  [82, 16],
  [94, 16],
  [106, 15],
] as const;

const lavaSlug: CreatureSpec = {
  name: "Lavasnegl",
  height: 6,
  aspect: 150 / 60,
  gait: "slither",
  pace: 0.4,
  viewBox: "0 0 150 60",
  art: (
    <>
      {LAVA_SEGMENTS.map(([x, r], i) => (
        <g key={i} className="zoo-seg" style={seg(i)}>
          <circle cx={x} cy={60 - r} r={r} fill="#ff7a2a" />
          <ellipse cx={x} cy={60 - r * 0.4} rx={r * 0.85} ry={r * 0.4} fill="#ffb35a" />
          {i >= 3 && (
            <>
              {/* Mørk skorpe-plade med glødende kant */}
              <ellipse cx={x} cy={60 - 2 * r + 4} rx={r * 0.86} ry="5.5" fill="#5a2d3c" stroke="#ffc83d" strokeWidth="1.6" />
              <ellipse cx={x - 3} cy={60 - 2 * r + 2.5} rx={r * 0.35} ry="1.6" fill="#8a4a5a" />
            </>
          )}
          {i === 4 && <circle cx={x + 2} cy={60 - 2 * r - 6} r="2.2" fill="#ffe14d" />}
          {i === 6 && (
            <>
              <circle cx={x - 4} cy={60 - 2 * r - 8} r="2.6" fill="#ffd84a" />
              <circle cx={x + 7} cy={60 - 2 * r - 3} r="1.6" fill="#fff2a0" />
            </>
          )}
          {i === 8 && <circle cx={x + 1} cy={60 - 2 * r - 7} r="2.2" fill="#ffe14d" />}
        </g>
      ))}
      <g className="zoo-seg zoo-head" style={seg(9)}>
        <path d="M118 34 L 117 17 M137 34 L 140 18" stroke="#ff7a2a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="128" cy="42" rx="21" ry="18" fill="#ff6a2a" />
        <ellipse cx="132" cy="54" rx="14" ry="5" fill="#ffb35a" />
        <circle cx="117" cy="14" r="7.4" fill="#fff" />
        {EYE(119, 14, 4.2)}
        <circle cx="140" cy="15" r="7.4" fill="#fff" />
        {EYE(142, 15, 4.2)}
        <circle cx="140" cy="44" r="4" fill="#ffd84a" opacity="0.65" />
        <path d="M122 46 q 7 6 14 0" stroke="#7a2a1a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="105" cy="14" r="2" fill="#ffe14d" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Pigkugle                                                            */
/* ------------------------------------------------------------------ */

const SPIKE_ANGLES = Array.from({ length: 12 }, (_, k) => 15 + k * 30);

const spikeBall: CreatureSpec = {
  name: "Pigkugle",
  height: 8,
  aspect: 84 / 80,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 84 80",
  art: (
    <>
      <g className="zoo-torso">
        {/* Bløde gummi-pigge: afrundede trekanter, drejet rundt om kuglen */}
        {SPIKE_ANGLES.map((deg) => (
          <g key={deg} transform={`rotate(${deg} 42 41)`}>
            <path d="M60 35 L 60 47 L 77 41 Z" fill="#27b8b0" stroke="#27b8b0" strokeWidth="6" strokeLinejoin="round" />
            <circle cx="75" cy="41" r="2.4" fill="#ff8ac8" />
          </g>
        ))}
        <circle cx="42" cy="41" r="31" fill="#3fd8cf" />
        <ellipse cx="42" cy="57" rx="22" ry="12" fill="#8af0e6" opacity="0.55" />
        <ellipse cx="28" cy="25" rx="10" ry="4.6" fill="#fff" opacity="0.4" transform="rotate(-35 28 25)" />
      </g>
      <g className="zoo-head">
        <circle cx="40" cy="37" r="11.5" fill="#fff" />
        {EYE(42, 37, 7)}
        <circle cx="64" cy="41" r="9.5" fill="#fff" />
        {EYE(66, 41, 5.6)}
        <circle cx="30" cy="54" r="4.2" fill="#ff9ad0" opacity="0.9" />
        <path d="M40 52 q 9 8 18 0" stroke="#127a76" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Langhals                                                            */
/* ------------------------------------------------------------------ */

const longNeck: CreatureSpec = {
  name: "Langhals",
  height: 24,
  aspect: 124 / 190,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 124 190",
  art: (
    <>
      {/* Bagerste ben */}
      <g className="zoo-leg zoo-leg-a">
        <rect x="23" y="124" width="7" height="62" rx="3.5" fill="#d86bb0" />
        <rect x="21.5" y="183" width="10" height="7" rx="3" fill="#6a3fb0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="124" width="7" height="62" rx="3.5" fill="#d86bb0" />
        <rect x="62.5" y="183" width="10" height="7" rx="3" fill="#6a3fb0" />
      </g>
      <g className="zoo-torso">
        <path d="M14 112 C 4 116, 2 128, 6 138" stroke="#ff8fc8" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="6" cy="139" r="4.4" fill="#b07cff" />
        <ellipse cx="46" cy="116" rx="36" ry="21" fill="#ff8fc8" />
        <ellipse cx="50" cy="126" rx="26" ry="9" fill="#ffc6e4" opacity="0.7" />
        <circle cx="30" cy="108" r="5" fill="#b07cff" />
        <circle cx="46" cy="102" r="4" fill="#b07cff" />
        <circle cx="38" cy="122" r="3.4" fill="#b07cff" />
        <circle cx="22" cy="122" r="2.8" fill="#b07cff" />
        {/* Halsen */}
        <path d="M66 112 C 78 92, 82 64, 94 36" stroke="#ff8fc8" strokeWidth="17" fill="none" strokeLinecap="round" />
        <path d="M71 108 C 82 90, 86 66, 97 40" stroke="#ffc6e4" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
        <circle cx="76" cy="92" r="4" fill="#b07cff" />
        <circle cx="84" cy="72" r="3.6" fill="#b07cff" />
        <circle cx="79" cy="56" r="3" fill="#b07cff" />
        <circle cx="90" cy="48" r="3.4" fill="#b07cff" />
      </g>
      {/* Forreste ben */}
      <g className="zoo-leg zoo-leg-b">
        <rect x="33" y="126" width="7" height="60" rx="3.5" fill="#ff8fc8" />
        <rect x="31.5" y="183" width="10" height="7" rx="3" fill="#8f5bf0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="74" y="126" width="7" height="60" rx="3.5" fill="#ff8fc8" />
        <rect x="72.5" y="183" width="10" height="7" rx="3" fill="#8f5bf0" />
      </g>
      <g className="zoo-head">
        <path d="M88 20 C 84 14, 82 10, 80 7 M102 18 C 104 12, 108 9, 112 7" stroke="#8f5bf0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="6" r="4.4" fill="#ffd84a" />
        <circle cx="112" cy="6" r="4.4" fill="#7ff3ff" />
        <ellipse cx="98" cy="30" rx="19" ry="14" fill="#ff8fc8" transform="rotate(8 98 30)" />
        <ellipse cx="108" cy="36" rx="13" ry="8.5" fill="#ffc6e4" transform="rotate(8 108 36)" />
        <circle cx="92" cy="20" r="3" fill="#b07cff" />
        <circle cx="86" cy="30" r="2.6" fill="#b07cff" />
        <circle cx="97" cy="27" r="7" fill="#fff" />
        {EYE(99, 27, 4.4)}
        <circle cx="106" cy="32" r="1.4" fill="#8f3a78" />
        <circle cx="112" cy="33" r="1.4" fill="#8f3a78" />
        <path d="M102 40 q 6 4 12 0" stroke="#8f3a78" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="37" r="3.4" fill="#ff7a9a" opacity="0.5" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Rumbille                                                            */
/* ------------------------------------------------------------------ */

const BEETLE_LEG = (d: string, color: string) => (
  <path d={d} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

const spaceBeetle: CreatureSpec = {
  name: "Rumbille",
  height: 7,
  aspect: 112 / 66,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 112 66",
  art: (
    <>
      {/* Fjerneste ben (mørkere) */}
      <g className="zoo-leg zoo-leg-b">
        {BEETLE_LEG("M30 48 L 22 56 L 18 64", "#1f7a4f")}
        {BEETLE_LEG("M62 49 L 70 57 L 74 64", "#1f7a4f")}
        {BEETLE_LEG("M46 50 L 44 58 L 40 64", "#2a8f5e")}
      </g>
      <g className="zoo-torso">
        <path d="M12 52 C 8 16, 70 6, 82 52 Z" fill="#35b878" />
        <path d="M12 52 C 11 44, 12 42, 14 38 C 30 52, 60 52, 82 52 Z" fill="#2a9a63" opacity="0.7" />
        {/* Skjoldets midtersøm */}
        <path d="M48 14 C 52 26, 52 40, 48 52" stroke="#1f7a4f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* Metalskær */}
        <path d="M22 36 C 24 26, 32 18, 42 16" stroke="#c8ffe0" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        <circle cx="30" cy="42" r="4" fill="#7ff3ff" />
        <circle cx="62" cy="36" r="4.4" fill="#7ff3ff" />
        <circle cx="68" cy="22" r="2.6" fill="#ffd84a" />
        <rect x="8" y="50" width="78" height="6" rx="3" fill="#1f7a4f" />
      </g>
      {/* Nærmeste ben */}
      <g className="zoo-leg zoo-leg-a">
        {BEETLE_LEG("M24 52 L 14 58 L 10 64", "#2a8f5e")}
        {BEETLE_LEG("M54 54 L 60 59 L 62 64", "#2a8f5e")}
        {BEETLE_LEG("M72 53 L 82 58 L 88 64", "#2a8f5e")}
      </g>
      <g className="zoo-head">
        <path d="M92 32 C 94 22, 98 16, 104 13 M100 34 C 104 26, 108 22, 111 21" stroke="#1f7a4f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="104" cy="12" r="3.6" fill="#ffd84a" />
        <circle cx="111" cy="20" r="3" fill="#ff7ac8" />
        <circle cx="90" cy="46" r="15" fill="#2a8f5e" />
        <ellipse cx="86" cy="40" rx="6" ry="3" fill="#7fe0b0" opacity="0.55" transform="rotate(-30 86 40)" />
        <circle cx="94" cy="42" r="8" fill="#fff" />
        {EYE(96, 42, 5)}
        <path d="M96 54 q 5 3 9 -2" stroke="#145a38" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="52" r="3" fill="#ffb8cf" opacity="0.85" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Mars-rover                                                          */
/* ------------------------------------------------------------------ */

const ROVER_WHEEL = (cx: number, color: string, hub: string) => (
  <g>
    <path d={`M${cx} 62 L ${cx} 78`} stroke="#6a5ab0" strokeWidth="4" strokeLinecap="round" />
    <circle cx={cx} cy="82" r="8" fill={color} />
    <circle cx={cx} cy="82" r="3.6" fill={hub} />
    <path d={`M${cx - 5.6} 82 H ${cx + 5.6} M${cx} 76.4 V 87.6`} stroke="#2e2466" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </g>
);

const rover: CreatureSpec = {
  name: "Mars-rover",
  height: 11,
  aspect: 124 / 90,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 124 90",
  art: (
    <>
      <g className="zoo-leg zoo-leg-b">
        {ROVER_WHEEL(36, "#4a3c96", "#ffb36a")}
        {ROVER_WHEEL(60, "#4a3c96", "#ffb36a")}
        {ROVER_WHEEL(84, "#4a3c96", "#ffb36a")}
      </g>
      <g className="zoo-torso">
        {/* Solpanel */}
        <path d="M4 38 L 40 26 L 46 40 L 10 52 Z" fill="#4a5fd0" />
        <path d="M13 35 L 18 49 M23 32 L 28 46 M33 29 L 38 43 M7 45 L 43 33" stroke="#9fb4ff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M30 46 L 34 52" stroke="#6a5ab0" strokeWidth="3.4" strokeLinecap="round" />
        {/* Krop */}
        <rect x="14" y="46" width="82" height="20" rx="8" fill="#ece6fb" />
        <rect x="22" y="52" width="26" height="8" rx="4" fill="#c9b8ff" />
        <circle cx="58" cy="56" r="3.4" fill="#ff9d4a" />
        <circle cx="68" cy="56" r="3.4" fill="#ffd84a" />
        <rect x="76" y="50" width="14" height="10" rx="4" fill="#ff9d4a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        {ROVER_WHEEL(24, "#5b49b0", "#ff9d4a")}
        {ROVER_WHEEL(48, "#5b49b0", "#ff9d4a")}
        {ROVER_WHEEL(72, "#5b49b0", "#ff9d4a")}
      </g>
      <g className="zoo-head">
        <path d="M92 48 L 98 34" stroke="#6a5ab0" strokeWidth="5" strokeLinecap="round" />
        <path d="M104 10 L 107 4" stroke="#6a5ab0" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="107" cy="3.4" r="3.4" fill="#7ff3ff" />
        <rect x="80" y="10" width="42" height="26" rx="11" fill="#ece6fb" />
        <circle cx="93" cy="22" r="9.4" fill="#6a5ab0" />
        <circle cx="93" cy="22" r="7" fill="#fff" />
        {EYE(95, 22, 4.6)}
        <circle cx="111" cy="22" r="9.4" fill="#6a5ab0" />
        <circle cx="111" cy="22" r="7" fill="#fff" />
        {EYE(113, 22, 4.6)}
        <path d="M97 32 q 5 3.4 10 0" stroke="#6a5ab0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="31" r="2.6" fill="#ff9fb8" opacity="0.7" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Krystalkrabbe (set forfra)                                          */
/* ------------------------------------------------------------------ */

/** Én krystal: sekskantet spids med lys facet. */
const KRABBE_KRYSTAL = (x: number, base: number, w: number, h: number, tilt: number, mørk: string, lys: string) => (
  <g transform={`rotate(${tilt} ${x} ${base})`}>
    <path
      d={`M${x - w / 2} ${base} L ${x - w / 2} ${base - h * 0.7} L ${x} ${base - h} L ${x + w / 2} ${base - h * 0.7} L ${x + w / 2} ${base} Z`}
      fill={mørk}
    />
    <path d={`M${x - w / 2} ${base - h * 0.7} L ${x} ${base - h} L ${x} ${base} L ${x - w / 2} ${base} Z`} fill={lys} opacity="0.75" />
  </g>
);

const CRAB_LEG = (d: string) => (
  <path d={d} stroke="#5a50d0" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

const crystalCrab: CreatureSpec = {
  name: "Krystalkrabbe",
  height: 8,
  aspect: 130 / 80,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 130 80",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        {CRAB_LEG("M38 60 L 22 62 L 18 78")}
        {CRAB_LEG("M50 70 L 41 74 L 39 78")}
        {CRAB_LEG("M92 64 L 108 66 L 112 78")}
      </g>
      <g className="zoo-leg zoo-leg-b">
        {CRAB_LEG("M40 66 L 26 70 L 24 78")}
        {CRAB_LEG("M90 60 L 106 58 L 110 70")}
        {CRAB_LEG("M80 70 L 89 74 L 91 78")}
      </g>
      <g className="zoo-torso">
        {/* Krystalskjold bag øjnene */}
        {KRABBE_KRYSTAL(32, 50, 13, 30, -32, "#8f5bf0", "#c9a8ff")}
        {KRABBE_KRYSTAL(98, 50, 13, 30, 32, "#8f5bf0", "#c9a8ff")}
        {KRABBE_KRYSTAL(44, 48, 14, 38, -14, "#3fa8ee", "#9fdcff")}
        {KRABBE_KRYSTAL(86, 48, 14, 38, 14, "#3fa8ee", "#9fdcff")}
        {KRABBE_KRYSTAL(65, 46, 16, 42, 0, "#b97bff", "#e6d0ff")}
        {/* Klør */}
        <path d="M32 54 C 26 46, 22 42, 20 38" stroke="#5a50d0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M98 54 C 104 46, 108 42, 110 38" stroke="#5a50d0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M20 40 C 4 38, 2 22, 10 14 C 14 22, 18 26, 20 28 C 24 24, 28 22, 32 24 C 34 34, 30 42, 20 40 Z" fill="#7a6af0" />
        <path d="M110 40 C 126 38, 128 22, 120 14 C 116 22, 112 26, 110 28 C 106 24, 102 22, 98 24 C 96 34, 100 42, 110 40 Z" fill="#7a6af0" />
        <path d="M10 14 L 14 26 M120 14 L 116 26" stroke="#b9b2ff" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="65" cy="58" rx="38" ry="19" fill="#6f7be8" />
        <ellipse cx="65" cy="66" rx="30" ry="9" fill="#a7b0ff" opacity="0.6" />
        <path d="M44 48 C 52 42, 78 42, 86 48" stroke="#b9c2ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
      <g className="zoo-head">
        <path d="M55 46 V 38 M75 46 V 38" stroke="#5a50d0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="55" cy="32" r="8" fill="#fff" />
        <circle cx="75" cy="32" r="8" fill="#fff" />
        {EYE(55.5, 32, 4.6)}
        {EYE(75.5, 32, 4.6)}
        <path d="M58 58 q 7 6 14 0" stroke="#3a2f9a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="56" r="4.2" fill="#ff9fe0" opacity="0.55" />
        <circle cx="86" cy="56" r="4.2" fill="#ff9fe0" opacity="0.55" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Rumkanin                                                            */
/* ------------------------------------------------------------------ */

const spaceBunny: CreatureSpec = {
  name: "Rumkanin",
  height: 9,
  aspect: 100 / 130,
  gait: "hop",
  pace: 1.15,
  viewBox: "0 0 100 130",
  art: (
    <>
      <g className="zoo-torso">
        {/* Hale */}
        <circle cx="14" cy="102" r="10" fill="#ffb8e4" />
        <circle cx="12" cy="99" r="4" fill="#fff" opacity="0.7" />
        {/* Krop og fødder */}
        <ellipse cx="46" cy="100" rx="31" ry="26" fill="#f7f3ff" />
        <ellipse cx="52" cy="108" rx="18" ry="16" fill="#e3d9ff" />
        <ellipse cx="36" cy="126" rx="19" ry="4.6" fill="#b38cf0" />
        <ellipse cx="68" cy="126" rx="13" ry="4.6" fill="#b38cf0" />
        <ellipse cx="34" cy="90" rx="14" ry="8" fill="#e3d9ff" transform="rotate(-20 34 90)" />
      </g>
      <g className="zoo-head">
        {/* Antenne-ører */}
        <path d="M54 44 C 38 32, 36 16, 43 7 C 53 16, 60 30, 62 44 Z" fill="#b38cf0" />
        <path d="M70 44 C 72 30, 80 18, 90 9 C 95 22, 90 36, 81 46 Z" fill="#b38cf0" />
        <path d="M52 40 C 44 30, 43 20, 44 14" stroke="#e3d0ff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="7" r="9" fill="#7ff3ff" opacity="0.3" />
        <circle cx="43" cy="7" r="5.4" fill="#7ff3ff" />
        <circle cx="41.5" cy="5.4" r="1.8" fill="#fff" />
        <circle cx="90" cy="9" r="9" fill="#ffd84a" opacity="0.3" />
        <circle cx="90" cy="9" r="5.4" fill="#ffd84a" />
        <circle cx="88.5" cy="7.4" r="1.8" fill="#fff" />
        {/* Hoved */}
        <circle cx="66" cy="62" r="24" fill="#f7f3ff" />
        <circle cx="74" cy="58" r="7.5" fill="#fff" />
        {EYE(76, 58, 5)}
        <circle cx="62" cy="72" r="4.4" fill="#ff9fcf" opacity="0.6" />
        <ellipse cx="88" cy="66" rx="4.2" ry="3.2" fill="#ff7ac8" />
        <path d="M82 72 q 5 5 10 0" stroke="#8f5bf0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Glimtorm                                                            */
/* ------------------------------------------------------------------ */

const GLOW_SEGMENTS = [
  [8, 4.5],
  [18, 6],
  [28, 7.5],
  [38, 9],
  [48, 10.5],
  [58, 11.5],
  [68, 12],
  [78, 12],
  [88, 12],
  [98, 12],
  [108, 12],
  [118, 12],
] as const;

const glowWorm: CreatureSpec = {
  name: "Glimtorm",
  height: 4,
  aspect: 160 / 32,
  gait: "slither",
  pace: 0.4,
  viewBox: "0 0 160 32",
  art: (
    <>
      {GLOW_SEGMENTS.map(([x, r], i) => (
        <g key={i} className="zoo-seg" style={seg(i)}>
          <circle cx={x} cy={32 - r} r={r} fill={i % 2 ? "#a6f09a" : "#8fe38a"} />
          {i % 2 === 1 && (
            <>
              <circle cx={x} cy={32 - r * 1.05} r={r * 0.9} fill="#e9ff7a" opacity="0.5" />
              <circle cx={x} cy={32 - r * 1.05} r={r * 0.42} fill="#f6ffb8" />
            </>
          )}
        </g>
      ))}
      <g className="zoo-seg zoo-head" style={seg(12)}>
        <path d="M134 16 L 132 5 M146 16 L 150 6" stroke="#6fd36b" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="132" cy="4.6" r="3" fill="#ffd84a" />
        <circle cx="150" cy="5.4" r="3" fill="#ff7ac8" />
        <ellipse cx="138" cy="18" rx="17" ry="14" fill="#b4f7a4" />
        <ellipse cx="142" cy="27" rx="11" ry="4.4" fill="#d8ffc4" />
        <circle cx="136" cy="16" r="6" fill="#fff" />
        {EYE(137.4, 16, 3.8)}
        <circle cx="149" cy="19" r="4.6" fill="#fff" />
        {EYE(150, 19, 2.8)}
        <path d="M138 24 q 4 3.4 8 0" stroke="#2f8a3b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const yetMore: Record<string, CreatureSpec> = {
  lavaSlug,
  spikeBall,
  longNeck,
  spaceBeetle,
  rover,
  crystalCrab,
  spaceBunny,
  glowWorm,
};
