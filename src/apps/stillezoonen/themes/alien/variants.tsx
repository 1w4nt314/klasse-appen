import type { CSSProperties } from "react";
import { fx } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";
import { crystal } from "./Background";

/**
 * Usædvanlige rumvæsner: varianter af de otte første figurer i `creatures.tsx`
 * (samme form, viewBox, gang og bevægelige grupper — men andre farver og et
 * lille ekstra kendetegn). Alle er "uncommon".
 */

/** Lille hjerte med midten i (cx, cy). Bredde ca. 13 × s. */
const hjerte = (cx: number, cy: number, s: number, fill: string) => (
  <path
    transform={`translate(${cx} ${cy}) scale(${s})`}
    d="M0 5 C -9 -1, -6 -8, 0 -4 C 6 -8, 9 -1, 0 5 Z"
    fill={fill}
  />
);

/** Lille glimt-stjerne (fire spidser) med midten i (cx, cy). */
const glimt = (cx: number, cy: number, r: number, fill: string) => (
  <path
    d={`M${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`}
    fill={fill}
  />
);

// ---------------------------------------------------------------------------
// Lyserød alien — som grøn alien, men med hjerteformede antennespidser
// ---------------------------------------------------------------------------
const pinkAlien: CreatureSpec = {
  name: "Lyserød alien",
  rarity: "uncommon",
  height: 19,
  aspect: 120 / 150,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 120 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="48" y="114" width="12" height="34" rx="6" fill="#e0589f" />
        <ellipse cx="57" cy="147" rx="10" ry="4" fill="#e0589f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="62" cy="98" rx="27" ry="32" fill="#ff8cc6" />
        <ellipse cx="68" cy="104" rx="15" ry="21" fill="#ffd9ec" />
        <circle cx="50" cy="92" r="3.5" fill="#f26bb0" />
        <circle cx="46" cy="106" r="2.5" fill="#f26bb0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="68" y="116" width="13" height="32" rx="6" fill="#ff9ed0" />
        <ellipse cx="78" cy="147" rx="11" ry="4" fill="#ff9ed0" />
      </g>
      <g className="zoo-head">
        <path d="M54 24 C 50 14, 46 10, 42 8" stroke="#e0589f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M78 22 C 82 14, 87 10, 92 8" stroke="#e0589f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {hjerte(41, 4, 1.15, "#ff3d6e")}
        {hjerte(93, 4, 1.15, "#ffd84a")}
        <circle cx="64" cy="50" r="34" fill="#ffa6d4" />
        <circle cx="42" cy="58" r="4" fill="#f58cc2" />
        <circle cx="50" cy="38" r="3" fill="#f58cc2" />
        <circle cx="68" cy="52" r="8.5" fill="#fff" />
        <circle cx="88" cy="50" r="8.5" fill="#fff" />
        <circle cx="78" cy="33" r="8.5" fill="#fff" />
        {EYE(70, 52, 5)}
        {EYE(90, 50, 5)}
        {EYE(80, 33, 5)}
        <circle cx="76" cy="68" r="5" fill="#ff4f8a" opacity="0.45" />
        <path d="M82 66 q 8 8 18 -1" stroke="#b02a72" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

// ---------------------------------------------------------------------------
// Alien-baby — lille udgave med kæmpe øjne, sut og én lille antenne
// ---------------------------------------------------------------------------
const babyAlien: CreatureSpec = {
  name: "Alien-baby",
  rarity: "uncommon",
  height: 11,
  aspect: 100 / 114,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 100 114",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="35" y="98" width="11" height="13" rx="5.5" fill="#43a84b" />
        <ellipse cx="41" cy="110" rx="9" ry="3.6" fill="#43a84b" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="50" cy="92" rx="21" ry="18" fill="#6fd36b" />
        <ellipse cx="55" cy="96" rx="11" ry="12" fill="#e8ffc9" />
        <circle cx="38" cy="88" r="2.6" fill="#56bd57" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="54" y="99" width="11" height="12" rx="5.5" fill="#7fe07a" />
        <ellipse cx="60" cy="110" rx="9.5" ry="3.6" fill="#7fe07a" />
      </g>
      <g className="zoo-head">
        <path d="M54 16 C 54 10, 52 7, 49 5" stroke="#56bd57" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="49" cy="5" r="4.6" fill="#ff7ac8" />
        <circle cx="54" cy="50" r="36" fill="#8dea88" />
        <circle cx="30" cy="62" r="3.4" fill="#78d874" />
        <circle cx="38" cy="30" r="2.8" fill="#78d874" />
        {/* Kæmpe øjne */}
        <circle cx="52" cy="48" r="15" fill="#fff" />
        <circle cx="79" cy="50" r="12.5" fill="#fff" />
        {EYE(55, 49, 10)}
        {EYE(81, 51, 8.5)}
        <circle cx="68" cy="70" r="5.5" fill="#ffb3cf" />
        {/* Sut */}
        <ellipse cx="90" cy="75" rx="6" ry="4.4" fill="#ffd1dc" />
        <circle cx="81" cy="75" r="7.4" fill="#ff7ac8" />
        <circle cx="81" cy="75" r="3.4" fill="#ffd84a" />
        <circle cx="75" cy="80" r="3.8" fill="none" stroke="#ffd84a" strokeWidth="2.2" />
      </g>
    </>
  ),
};

// ---------------------------------------------------------------------------
// Blå slim-klat — isblå med små iskrystaller på toppen
// ---------------------------------------------------------------------------
const blueBlob: CreatureSpec = {
  name: "Blå slim-klat",
  rarity: "uncommon",
  height: 11,
  aspect: 110 / 84,
  gait: "hop",
  pace: 1.15,
  viewBox: "0 0 110 84",
  art: (
    <>
      <g className="zoo-torso">
        {/* Iskrystaller (tegnet først, så klatten dækker deres fod) */}
        {crystal(48, 28, 9, 19, -18, "#bfeaff", "#ffffff", "is1")}
        {crystal(64, 22, 12, 27, 4, "#a4defa", "#f2fcff", "is2")}
        {crystal(80, 27, 8, 16, 22, "#bfeaff", "#ffffff", "is3")}
        {crystal(96, 43, 7, 12, 40, "#a4defa", "#f2fcff", "is4")}
        <path
          d="M4 84 C -2 58, 12 30, 40 22 C 64 14, 92 24, 102 50 C 108 66, 106 78, 108 84 Z"
          fill="#7fd0f7"
        />
        <ellipse cx="68" cy="82" rx="30" ry="2" fill="#7fd0f7" />
        <path d="M14 84 C 12 72, 22 70, 26 78 C 28 82, 28 84, 28 84 Z" fill="#7fd0f7" />
        <ellipse cx="34" cy="34" rx="12" ry="5.5" fill="#fff" opacity="0.5" transform="rotate(-28 34 34)" />
        <circle cx="26" cy="66" r="4" fill="#a9e3ff" />
        <circle cx="40" cy="74" r="3" fill="#a9e3ff" />
        {glimt(18, 52, 4, "#ffffff")}
      </g>
      <g className="zoo-head">
        <circle cx="50" cy="52" r="9" fill="#fff" />
        {EYE(52, 52, 5)}
        <circle cx="76" cy="46" r="12" fill="#fff" />
        {EYE(79, 46, 6.6)}
        <circle cx="94" cy="62" r="5" fill="#ff8fc0" opacity="0.5" />
        <path d="M70 64 q 10 9 22 0" stroke="#256f9c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

// ---------------------------------------------------------------------------
// Rød UFO — rød/orange med gule blinkende lys og antenne på kuplen
// ---------------------------------------------------------------------------

/**
 * Et lys, der blinker blidt: et svagt lys med et klart lys ovenpå, der tændes
 * og slukkes (zoo-fx-sparkle, som slås fra ved "reducer bevægelse").
 * `start` forskyder takten, så de ikke blinker i takt.
 */
const blinkLys = (cx: number, cy: number, r: number, start: string) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="#c9a62a" />
    <g className="zoo-fx-sparkle" style={{ ...fx(start), animationDuration: "1.6s" } as CSSProperties}>
      <circle cx={cx} cy={cy} r={r} fill="#ffe14d" />
    </g>
  </>
);

const redUfo: CreatureSpec = {
  name: "Rød UFO",
  rarity: "uncommon",
  height: 14,
  aspect: 140 / 90,
  gait: "float",
  pace: 1,
  zone: "open",
  viewBox: "0 0 140 90",
  art: (
    <>
      {/* Lille gul alien i kuplen */}
      <circle cx="73" cy="40" r="15" fill="#ffe27a" />
      <circle cx="64" cy="46" r="2.6" fill="#ffc94a" />
      {EYE(68, 39, 3.6)}
      {EYE(80, 39, 3.6)}
      <path d="M71 47 q 3 3 7 0" stroke="#b5651f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Glaskuppel */}
      <path d="M36 56 C 34 10, 108 8, 106 56 Z" fill="#ffe3cf" opacity="0.55" />
      <path d="M46 38 C 50 24, 62 18, 74 18" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Lille antenne på kuplen */}
      <path d="M71 21 C 70 15, 72 10, 74 7" stroke="#b22d22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="74" cy="5.5" r="4" fill="#ffe14d" />
      {/* Understel */}
      <rect x="42" y="76" width="7" height="12" rx="3.5" fill="#a02a22" />
      <rect x="92" y="76" width="7" height="12" rx="3.5" fill="#a02a22" />
      <circle cx="45.5" cy="87" r="3.4" fill="#a02a22" />
      <circle cx="95.5" cy="87" r="3.4" fill="#a02a22" />
      <path d="M16 62 C 26 84, 116 84, 126 62 Z" fill="#e0452f" />
      <ellipse cx="71" cy="58" rx="67" ry="18" fill="#ff7a4d" />
      <ellipse cx="71" cy="52" rx="52" ry="9" fill="#ffc29e" opacity="0.6" />
      {/* Gule blinkende lys */}
      {blinkLys(71, 85, 4.4, "0s")}
      {blinkLys(24, 62, 4.2, "0.3s")}
      {blinkLys(46, 68, 4.2, "0.9s")}
      {blinkLys(71, 70, 4.2, "0.5s")}
      {blinkLys(96, 68, 4.2, "1.2s")}
      {blinkLys(118, 62, 4.2, "0.7s")}
    </>
  ),
};

// ---------------------------------------------------------------------------
// Kobberrobot — gammel kobber med grøn irr, nitter og skruenøgle-plaster
// ---------------------------------------------------------------------------
const nitte = (cx: number, cy: number, r = 2) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#8a4f28" />
    <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.4} fill="#f2b583" />
  </g>
);

const copperRobot: CreatureSpec = {
  name: "Kobberrobot",
  rarity: "uncommon",
  height: 19,
  aspect: 110 / 150,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 110 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="42" y="108" width="14" height="36" rx="5" fill="#a8602f" />
        <rect x="37" y="142" width="28" height="8" rx="4" fill="#8a4f28" />
        {nitte(49, 118)}
      </g>
      <g className="zoo-torso">
        <rect x="32" y="70" width="58" height="46" rx="12" fill="#d68a52" />
        {/* Grøn irr */}
        <ellipse cx="82" cy="108" rx="9" ry="6" fill="#5fb8a0" opacity="0.85" />
        <ellipse cx="38" cy="76" rx="5" ry="3.4" fill="#5fb8a0" opacity="0.85" />
        <circle cx="76" cy="112" r="2.4" fill="#3f9c86" />
        {/* Plaster med skruenøgle */}
        <rect x="41" y="79" width="32" height="26" rx="6" fill="#f3dfb2" />
        <rect x="43.5" y="81.5" width="27" height="21" rx="4" fill="none" stroke="#b58a4a" strokeWidth="1.4" strokeDasharray="3 2.4" />
        <g transform="translate(57 92) rotate(-42)">
          <rect x="-10" y="-2.4" width="17" height="4.8" rx="2.4" fill="#6b6f78" />
          <circle cx="8" cy="0" r="5.4" fill="#6b6f78" />
          <rect x="8" y="-2.2" width="6" height="4.4" fill="#f3dfb2" />
        </g>
        {nitte(36, 112)}
        {nitte(86, 76)}
        {nitte(36, 90, 1.8)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="110" width="14" height="34" rx="5" fill="#d68a52" />
        <rect x="59" y="142" width="28" height="8" rx="4" fill="#b8693a" />
        <ellipse cx="72" cy="132" rx="5" ry="3.4" fill="#5fb8a0" opacity="0.85" />
        {nitte(71, 118)}
      </g>
      <g className="zoo-head">
        <path d="M62 20 V 8" stroke="#a8602f" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="62" cy="7" r="6" fill="#5fb8a0" />
        <circle cx="60.4" cy="5.4" r="1.8" fill="#bff0e0" />
        <rect x="28" y="18" width="68" height="54" rx="16" fill="#d68a52" />
        <ellipse cx="38" cy="25" rx="7" ry="4" fill="#5fb8a0" opacity="0.85" transform="rotate(-24 38 25)" />
        <ellipse cx="88" cy="66" rx="5" ry="3" fill="#5fb8a0" opacity="0.85" />
        <rect x="22" y="34" width="9" height="20" rx="4" fill="#7fc8b0" />
        <rect x="40" y="28" width="54" height="36" rx="12" fill="#26403c" />
        <g className="zoo-eye"><circle cx="64" cy="43" r="6.4" fill="#ffe27a" /><circle cx="66" cy="41" r="2.2" fill="#fff" /></g>
        <g className="zoo-eye"><circle cx="82" cy="43" r="6.4" fill="#ffe27a" /><circle cx="84" cy="41" r="2.2" fill="#fff" /></g>
        <path d="M68 54 q 8 6 16 0" stroke="#ffe27a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {nitte(34, 66)}
        {nitte(90, 24)}
        {nitte(34, 24, 1.8)}
      </g>
      <path d="M78 80 C 86 84, 92 92, 94 104" stroke="#b8693a" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="106" r="6" fill="#5fb8a0" />
      <circle cx="92.4" cy="104.4" r="1.8" fill="#bff0e0" />
    </>
  ),
};

// ---------------------------------------------------------------------------
// Natøje — mørkelilla svævende øje med stjernestrøet låg og gul pupil
// ---------------------------------------------------------------------------
const nightEye: CreatureSpec = {
  name: "Natøje",
  rarity: "uncommon",
  height: 11,
  aspect: 120 / 96,
  gait: "float",
  pace: 0.9,
  zone: "open",
  viewBox: "0 0 120 96",
  art: (
    <>
      {/* Stjernestrøet låg (og nedre låg) */}
      <path d="M44 40 C 26 6, 0 6, 2 28 C 4 44, 26 52, 44 54 Z" fill="#3a2b8c" stroke="#8e72f0" strokeWidth="2" />
      {glimt(16, 22, 4.4, "#ffe27a")}
      {glimt(30, 34, 3, "#ffffff")}
      {glimt(10, 38, 2.6, "#ffffff")}
      {glimt(26, 14, 2.4, "#c9b6ff")}
      <path d="M46 56 C 24 54, 4 66, 12 80 C 24 88, 40 78, 48 68 Z" fill="#4a3aa8" stroke="#8e72f0" strokeWidth="2" />
      {glimt(24, 72, 3.6, "#ffe27a")}
      {glimt(38, 68, 2.4, "#ffffff")}
      <circle cx="66" cy="56" r="40" fill="#6a50c8" />
      <path d="M30 70 C 40 90, 78 98, 100 74 C 90 96, 40 100, 30 70 Z" fill="#5440a8" />
      <ellipse cx="50" cy="32" rx="9" ry="4.4" fill="#fff" opacity="0.22" transform="rotate(-30 50 32)" />
      <path d="M86 18 l 6 -10 M74 16 l 2 -11 M96 24 l 9 -8" stroke="#c9b6ff" strokeWidth="3.4" strokeLinecap="round" />
      {glimt(55, 82, 2.4, "#ffe27a")}
      {glimt(98, 84, 2.2, "#ffffff")}
      <g className="zoo-head">
        <circle cx="80" cy="54" r="23" fill="#2c2068" />
        <circle cx="80" cy="54" r="17" fill="#8e72f0" />
        <circle cx="83" cy="54" r="10.5" fill="#ffd84a" />
        <circle cx="83" cy="54" r="5" fill="#ffb92e" />
        {/* Stjernestrøet låg over øjet */}
        <path d="M57 54 A 23 23 0 0 1 103 54 C 92 44, 68 44, 57 54 Z" fill="#4a3aa8" stroke="#2c2068" strokeWidth="1.6" strokeLinejoin="round" />
        {glimt(70, 44, 2.6, "#ffe27a")}
        {glimt(84, 38, 2.2, "#ffffff")}
        {glimt(95, 46, 2, "#c9b6ff")}
        <circle cx="88" cy="50" r="3.6" fill="#fff" />
        <circle cx="77" cy="61" r="2" fill="#fff" opacity="0.8" />
        <circle cx="52" cy="72" r="5.6" fill="#ff9fb8" opacity="0.55" />
        <path d="M70 83 q 7 5 14 0" stroke="#c9b6ff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

// ---------------------------------------------------------------------------
// Issnegl — isblå/hvide krystaller og en lille frostsky
// ---------------------------------------------------------------------------
const SNEGL_LED = [
  [10, 4],
  [20, 5.5],
  [30, 7],
  [40, 8.5],
  [50, 10],
  [60, 11],
  [70, 11],
  [80, 11],
  [90, 11],
  [100, 11],
  [110, 11],
] as const;

const iceSnail: CreatureSpec = {
  name: "Issnegl",
  rarity: "uncommon",
  height: 10,
  aspect: 170 / 90,
  gait: "slither",
  pace: 0.5,
  viewBox: "0 0 170 90",
  art: (
    <>
      {SNEGL_LED.map(([x, r], i) => (
        <g key={i} className="zoo-seg" style={{ "--i": i } as CSSProperties}>
          <circle cx={x} cy={90 - r} r={r} fill="#bfe3fb" />
          <ellipse cx={x} cy={90 - r * 0.4} rx={r * 0.85} ry={r * 0.4} fill="#eefaff" />
        </g>
      ))}
      <g className="zoo-seg" style={{ "--i": 5 } as CSSProperties}>
        <ellipse cx="78" cy="68" rx="42" ry="20" fill="#6f9fe0" />
        <ellipse cx="70" cy="62" rx="26" ry="8" fill="#8fb8f0" />
        {crystal(52, 62, 18, 36, -26, "#6fcdf5", "#c9f1ff", "c1")}
        {crystal(102, 64, 20, 40, 22, "#e6f6ff", "#ffffff", "c2")}
        {crystal(78, 62, 28, 52, -4, "#9ad8fa", "#e4f7ff", "c3")}
        {crystal(64, 62, 13, 28, -44, "#4fb8f0", "#a9e2ff", "c4")}
      </g>
      <g className="zoo-seg zoo-head" style={{ "--i": 11 } as CSSProperties}>
        {/* Lille frostsky */}
        <circle cx="124" cy="12" r="6" fill="#e6f4ff" />
        <circle cx="133" cy="8" r="8" fill="#f3faff" />
        <circle cx="142" cy="13" r="6" fill="#e6f4ff" />
        <ellipse cx="133" cy="15" rx="14" ry="4.4" fill="#e6f4ff" />
        <circle cx="127" cy="24" r="1.6" fill="#8fd0f8" />
        <circle cx="135" cy="23" r="1.6" fill="#ffffff" />
        <circle cx="140" cy="26" r="1.4" fill="#8fd0f8" />
        <path d="M124 62 L 118 38 M140 62 L 146 40" stroke="#bfe3fb" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="130" cy="72" rx="23" ry="17" fill="#bfe3fb" />
        <ellipse cx="136" cy="82" rx="16" ry="6" fill="#eefaff" />
        <circle cx="118" cy="36" r="7.6" fill="#fff" />
        {EYE(120, 36, 4.2)}
        <circle cx="146" cy="38" r="7.6" fill="#fff" />
        {EYE(148, 38, 4.2)}
        <circle cx="146" cy="70" r="4" fill="#ff9fb8" opacity="0.6" />
        <path d="M134 74 q 7 6 14 0" stroke="#3f7fb8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

// ---------------------------------------------------------------------------
// Lilla tentakelven — lilla med prikker og en lille sløjfe
// ---------------------------------------------------------------------------
const purpleTentacle: CreatureSpec = {
  name: "Lilla tentakelven",
  rarity: "uncommon",
  height: 16,
  aspect: 140 / 130,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 140 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M94 78 C 102 92, 86 102, 94 114 C 97 119, 100 121, 102 125" stroke="#7a4cb8" strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="96" cy="100" r="2.4" fill="#c9a8f5" />
        <circle cx="97" cy="116" r="2.2" fill="#c9a8f5" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M54 78 C 62 92, 46 102, 54 114 C 57 119, 60 121, 62 125" stroke="#7a4cb8" strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="56" cy="100" r="2.4" fill="#c9a8f5" />
        <circle cx="57" cy="116" r="2.2" fill="#c9a8f5" />
      </g>
      <g className="zoo-torso">
        <path
          d="M26 80 C 20 30, 54 10, 76 10 C 110 10, 130 44, 122 80 C 112 98, 38 98, 26 80 Z"
          fill="#a577e6"
        />
        {/* Prikker */}
        <circle cx="46" cy="40" r="6" fill="#cfb2f7" />
        <circle cx="64" cy="26" r="4.2" fill="#cfb2f7" />
        <circle cx="38" cy="64" r="5" fill="#cfb2f7" />
        <circle cx="58" cy="58" r="4.6" fill="#cfb2f7" />
        <circle cx="76" cy="80" r="5.4" fill="#cfb2f7" />
        <circle cx="50" cy="82" r="3.4" fill="#cfb2f7" />
        <circle cx="100" cy="24" r="3.6" fill="#cfb2f7" />
        <circle cx="116" cy="70" r="3.6" fill="#cfb2f7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M108 82 C 116 96, 100 104, 108 116 C 111 120, 114 122, 116 125" stroke="#a577e6" strokeWidth="11" fill="none" strokeLinecap="round" />
        <circle cx="109" cy="102" r="2.6" fill="#cfb2f7" />
        <circle cx="111" cy="117" r="2.4" fill="#cfb2f7" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M68 84 C 76 96, 60 104, 68 116 C 71 120, 74 122, 76 125" stroke="#a577e6" strokeWidth="11" fill="none" strokeLinecap="round" />
        <circle cx="69" cy="104" r="2.6" fill="#cfb2f7" />
        <circle cx="71" cy="118" r="2.4" fill="#cfb2f7" />
      </g>
      <g className="zoo-head">
        {/* Sløjfe */}
        <path d="M68 10 C 60 -3, 48 -1, 50 7 C 51 15, 62 15, 68 10 Z" fill="#ff7ac8" />
        <path d="M68 10 C 76 -3, 88 -1, 86 7 C 85 15, 74 15, 68 10 Z" fill="#ff7ac8" />
        <circle cx="68" cy="10" r="4.2" fill="#e24ea6" />
        <circle cx="88" cy="44" r="10.5" fill="#fff" />
        {EYE(91, 44, 5.8)}
        <circle cx="110" cy="50" r="8.5" fill="#fff" />
        {EYE(112, 50, 4.8)}
        <circle cx="104" cy="68" r="5" fill="#ff9fb8" opacity="0.6" />
        <path d="M90 66 q 10 9 20 -1" stroke="#4a2a80" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const variants: Record<string, CreatureSpec> = {
  pinkAlien,
  babyAlien,
  blueBlob,
  redUfo,
  copperRobot,
  nightEye,
  iceSnail,
  purpleTentacle,
};
