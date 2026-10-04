import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";
import { crystal } from "./Background";

/**
 * Rumvæsnerne i Klasse Zoo. Tegnet i profil, vendt mod højre, med fødderne
 * (eller bunden) på bunden af viewBox. Walk-figurer har ben i `zoo-leg-a`/`zoo-leg-b`.
 */

const greenAlien: CreatureSpec = {
  name: "Grøn alien",
  height: 19,
  aspect: 120 / 150,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 120 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="48" y="114" width="12" height="34" rx="6" fill="#43a84b" />
        <ellipse cx="57" cy="147" rx="10" ry="4" fill="#43a84b" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="62" cy="98" rx="27" ry="32" fill="#6fd36b" />
        <ellipse cx="68" cy="104" rx="15" ry="21" fill="#c9f5a3" />
        <circle cx="50" cy="92" r="3.5" fill="#56bd57" />
        <circle cx="46" cy="106" r="2.5" fill="#56bd57" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="68" y="116" width="13" height="32" rx="6" fill="#7fe07a" />
        <ellipse cx="78" cy="147" rx="11" ry="4" fill="#7fe07a" />
      </g>
      <g className="zoo-head">
        <path d="M54 24 C 50 14, 46 9, 41 5" stroke="#56bd57" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M78 22 C 82 14, 87 9, 93 5" stroke="#56bd57" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="41" cy="5" r="5.5" fill="#ff7ac8" />
        <circle cx="93" cy="5" r="5.5" fill="#ffd84a" />
        <circle cx="64" cy="50" r="34" fill="#7fe07a" />
        <circle cx="42" cy="58" r="4" fill="#6bd066" />
        <circle cx="50" cy="38" r="3" fill="#6bd066" />
        <circle cx="68" cy="52" r="8.5" fill="#fff" />
        <circle cx="88" cy="50" r="8.5" fill="#fff" />
        <circle cx="78" cy="33" r="8.5" fill="#fff" />
        {EYE(70, 52, 5)}
        {EYE(90, 50, 5)}
        {EYE(80, 33, 5)}
        <circle cx="76" cy="68" r="5" fill="#ff9fb8" opacity="0.55" />
        <path d="M82 66 q 8 8 18 -1" stroke="#2f8a3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const blob: CreatureSpec = {
  name: "Slim-klat",
  height: 11,
  aspect: 110 / 84,
  gait: "hop",
  pace: 1.15,
  viewBox: "0 0 110 84",
  art: (
    <>
      <g className="zoo-torso">
        <path d="M54 22 C 52 14, 56 8, 64 6" stroke="#e24ea6" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="6" r="4.5" fill="#ffe14d" />
        <path
          d="M4 84 C -2 58, 12 30, 40 22 C 64 14, 92 24, 102 50 C 108 66, 106 78, 108 84 Z"
          fill="#ff7cc8"
        />
        <ellipse cx="68" cy="82" rx="30" ry="2" fill="#ff7cc8" />
        <path d="M14 84 C 12 72, 22 70, 26 78 C 28 82, 28 84, 28 84 Z" fill="#ff7cc8" />
        <ellipse cx="34" cy="34" rx="12" ry="5.5" fill="#fff" opacity="0.4" transform="rotate(-28 34 34)" />
        <circle cx="26" cy="66" r="4" fill="#ff9ad8" />
        <circle cx="40" cy="74" r="3" fill="#ff9ad8" />
      </g>
      <g className="zoo-head">
        <circle cx="50" cy="52" r="9" fill="#fff" />
        {EYE(52, 52, 5)}
        <circle cx="76" cy="46" r="12" fill="#fff" />
        {EYE(79, 46, 6.6)}
        <circle cx="94" cy="62" r="5" fill="#ff5fb0" opacity="0.5" />
        <path d="M70 64 q 10 9 22 0" stroke="#b02a7c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const ufo: CreatureSpec = {
  name: "UFO",
  height: 14,
  aspect: 140 / 90,
  gait: "float",
  pace: 1,
  zone: "open",
  viewBox: "0 0 140 90",
  art: (
    <>
      {/* Lille alien i kuplen */}
      <path d="M72 30 C 70 24, 72 20, 76 17" stroke="#52b95a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="76" cy="17" r="3.4" fill="#ff7ac8" />
      <circle cx="73" cy="40" r="15" fill="#7fe07a" />
      {EYE(68, 39, 3.6)}
      {EYE(80, 39, 3.6)}
      <path d="M71 47 q 3 3 7 0" stroke="#2f8a3b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Glaskuppel */}
      <path d="M36 56 C 34 10, 108 8, 106 56 Z" fill="#c5f7ff" opacity="0.55" />
      <path d="M46 38 C 50 24, 62 18, 74 18" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Understel */}
      <rect x="42" y="76" width="7" height="12" rx="3.5" fill="#7a63c9" />
      <rect x="92" y="76" width="7" height="12" rx="3.5" fill="#7a63c9" />
      <circle cx="45.5" cy="87" r="3.4" fill="#7a63c9" />
      <circle cx="95.5" cy="87" r="3.4" fill="#7a63c9" />
      <path d="M16 62 C 26 84, 116 84, 126 62 Z" fill="#8f78e0" />
      <ellipse cx="71" cy="58" rx="67" ry="18" fill="#d8ccff" />
      <ellipse cx="71" cy="52" rx="52" ry="9" fill="#efe9ff" opacity="0.7" />
      <circle cx="71" cy="85" r="4.4" fill="#ffd84a" />
      <circle cx="24" cy="62" r="4.2" fill="#ff7ac8" />
      <circle cx="46" cy="68" r="4.2" fill="#ffd84a" />
      <circle cx="71" cy="70" r="4.2" fill="#5fe3d8" />
      <circle cx="96" cy="68" r="4.2" fill="#ffd84a" />
      <circle cx="118" cy="62" r="4.2" fill="#ff7ac8" />
    </>
  ),
};

const robot: CreatureSpec = {
  name: "Robot",
  height: 19,
  aspect: 110 / 150,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 110 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="42" y="108" width="14" height="36" rx="5" fill="#5f86d6" />
        <rect x="37" y="142" width="28" height="8" rx="4" fill="#4b6fbd" />
      </g>
      <g className="zoo-torso">
        <rect x="32" y="70" width="58" height="46" rx="12" fill="#8fb3ff" />
        <rect x="42" y="80" width="30" height="24" rx="7" fill="#dcebff" />
        <circle cx="50" cy="92" r="4.2" fill="#ff7ac8" />
        <circle cx="62" cy="92" r="4.2" fill="#ffd84a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="110" width="14" height="34" rx="5" fill="#8fb3ff" />
        <rect x="59" y="142" width="28" height="8" rx="4" fill="#6f95e8" />
      </g>
      <g className="zoo-head">
        <path d="M62 20 V 8" stroke="#5f86d6" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="62" cy="7" r="6" fill="#ff7ac8" />
        <rect x="28" y="18" width="68" height="54" rx="16" fill="#8fb3ff" />
        <rect x="22" y="34" width="9" height="20" rx="4" fill="#ffd84a" />
        <rect x="40" y="28" width="54" height="36" rx="12" fill="#1f2d5a" />
        <g className="zoo-eye"><circle cx="64" cy="43" r="6.4" fill="#7ff3ff" /><circle cx="66" cy="41" r="2.2" fill="#fff" /></g>
        <g className="zoo-eye"><circle cx="82" cy="43" r="6.4" fill="#7ff3ff" /><circle cx="84" cy="41" r="2.2" fill="#fff" /></g>
        <path d="M68 54 q 8 6 16 0" stroke="#7ff3ff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <path d="M78 80 C 86 84, 92 92, 94 104" stroke="#6f95e8" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="106" r="6" fill="#ffd84a" />
    </>
  ),
};

const bouncer: CreatureSpec = {
  name: "Hoppefjeder",
  height: 13,
  aspect: 100 / 130,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 100 130",
  art: (
    <>
      <ellipse cx="50" cy="127" rx="19" ry="3.4" fill="#7a63c9" />
      <path
        d="M50 86 L 32 93 L 68 100 L 32 108 L 68 116 L 50 124"
        stroke="#9a83e8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="zoo-torso">
        <circle cx="32" cy="22" r="9" fill="#ff9d1f" />
        <circle cx="32" cy="22" r="4.6" fill="#ffd1d9" />
        <circle cx="64" cy="17" r="9" fill="#ff9d1f" />
        <circle cx="64" cy="17" r="4.6" fill="#ffd1d9" />
        <circle cx="50" cy="52" r="38" fill="#ffb22e" />
        <ellipse cx="58" cy="64" rx="22" ry="20" fill="#ffe08a" />
        <circle cx="30" cy="40" r="4" fill="#ff9d1f" />
        <circle cx="24" cy="56" r="3" fill="#ff9d1f" />
        <ellipse cx="32" cy="32" rx="9" ry="4.5" fill="#fff" opacity="0.4" transform="rotate(-35 32 32)" />
      </g>
      <g className="zoo-head">
        <circle cx="62" cy="44" r="9" fill="#fff" />
        {EYE(64, 44, 5)}
        <circle cx="80" cy="48" r="7.5" fill="#fff" />
        {EYE(82, 48, 4.2)}
        <circle cx="76" cy="62" r="4.4" fill="#ff7a8a" opacity="0.5" />
        <path d="M62 60 q 10 10 22 0 Z" fill="#c4452f" />
        <path d="M66 65 q 5 4 11 0" stroke="#ff8a8a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const floatingEye: CreatureSpec = {
  name: "Svævende øje",
  height: 11,
  aspect: 120 / 96,
  gait: "float",
  pace: 0.9,
  zone: "open",
  viewBox: "0 0 120 96",
  art: (
    <>
      <path d="M44 40 C 26 6, 0 6, 2 28 C 4 44, 26 52, 44 54 Z" fill="#ffc2e6" />
      <path d="M32 38 C 24 26, 14 22, 8 24 M34 46 C 24 40, 14 38, 6 38" stroke="#f79ccf" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M46 56 C 24 54, 4 66, 12 80 C 24 88, 40 78, 48 68 Z" fill="#d2b8ff" />
      <circle cx="66" cy="56" r="40" fill="#fffaf5" />
      <path d="M30 70 C 40 90, 78 98, 100 74 C 90 96, 40 100, 30 70 Z" fill="#efe3f5" />
      <path d="M86 18 l 6 -10 M74 16 l 2 -11 M96 24 l 9 -8" stroke="#8f5bf0" strokeWidth="3.4" strokeLinecap="round" />
      <g className="zoo-head">
        <circle cx="80" cy="54" r="23" fill="#8f5bf0" />
        <circle cx="80" cy="54" r="17" fill="#b07cff" />
        <circle cx="83" cy="54" r="10.5" fill="#2a1a55" />
        <circle cx="88" cy="48" r="4.4" fill="#fff" />
        <circle cx="77" cy="61" r="2" fill="#fff" opacity="0.8" />
        <circle cx="52" cy="72" r="5.6" fill="#ff9fb8" opacity="0.55" />
        <path d="M70 83 q 7 5 14 0" stroke="#8f5bf0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const SNAIL_SEGMENTS = [
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

const crystalSnail: CreatureSpec = {
  name: "Krystalsnegl",
  height: 10,
  aspect: 170 / 90,
  gait: "slither",
  pace: 0.5,
  viewBox: "0 0 170 90",
  art: (
    <>
      {SNAIL_SEGMENTS.map(([x, r], i) => (
        <g key={i} className="zoo-seg" style={{ "--i": i } as CSSProperties}>
          <circle cx={x} cy={90 - r} r={r} fill="#ffb77a" />
          <ellipse cx={x} cy={90 - r * 0.4} rx={r * 0.85} ry={r * 0.4} fill="#ffdcb0" />
        </g>
      ))}
      <g className="zoo-seg" style={{ "--i": 5 } as CSSProperties}>
        <ellipse cx="78" cy="68" rx="42" ry="20" fill="#8a54d9" />
        <ellipse cx="70" cy="62" rx="26" ry="8" fill="#a06ae8" />
        {crystal(52, 62, 18, 36, -26, "#4fd8d8", "#8ff0ee", "c1")}
        {crystal(102, 64, 20, 40, 22, "#ff7ac8", "#ffb0de", "c2")}
        {crystal(78, 62, 28, 52, -4, "#b97bff", "#dbb8ff", "c3")}
        {crystal(64, 62, 13, 28, -44, "#ffd84a", "#fff0a0", "c4")}
      </g>
      <g className="zoo-seg zoo-head" style={{ "--i": 11 } as CSSProperties}>
        <path d="M124 62 L 118 38 M140 62 L 146 40" stroke="#ffb77a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="130" cy="72" rx="23" ry="17" fill="#ffb77a" />
        <ellipse cx="136" cy="82" rx="16" ry="6" fill="#ffdcb0" />
        <circle cx="118" cy="36" r="7.6" fill="#fff" />
        {EYE(120, 36, 4.2)}
        <circle cx="146" cy="38" r="7.6" fill="#fff" />
        {EYE(148, 38, 4.2)}
        <circle cx="146" cy="70" r="4" fill="#ff9fb8" opacity="0.6" />
        <path d="M134 74 q 7 6 14 0" stroke="#c46a2e" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const tentacleBuddy: CreatureSpec = {
  name: "Tentakelven",
  height: 16,
  aspect: 140 / 130,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 140 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M94 78 C 102 92, 86 102, 94 114 C 97 119, 100 121, 102 125" stroke="#1fa3b8" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M54 78 C 62 92, 46 102, 54 114 C 57 119, 60 121, 62 125" stroke="#1fa3b8" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <path
          d="M26 80 C 20 30, 54 10, 76 10 C 110 10, 130 44, 122 80 C 112 98, 38 98, 26 80 Z"
          fill="#35c5d6"
        />
        <circle cx="46" cy="40" r="5" fill="#6fe0ec" />
        <circle cx="62" cy="26" r="3.4" fill="#6fe0ec" />
        <circle cx="40" cy="62" r="4" fill="#6fe0ec" />
        <path d="M58 14 C 56 6, 60 1, 67 0" stroke="#1fa3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M108 82 C 116 96, 100 104, 108 116 C 111 120, 114 122, 116 125" stroke="#35c5d6" strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M68 84 C 76 96, 60 104, 68 116 C 71 120, 74 122, 76 125" stroke="#35c5d6" strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="67" cy="0" r="5" fill="#ffd84a" />
        <circle cx="88" cy="44" r="10.5" fill="#fff" />
        {EYE(91, 44, 5.8)}
        <circle cx="110" cy="50" r="8.5" fill="#fff" />
        {EYE(112, 50, 4.8)}
        <circle cx="104" cy="68" r="5" fill="#ff9fb8" opacity="0.55" />
        <path d="M90 66 q 10 9 20 -1" stroke="#16788a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const creatures: Record<string, CreatureSpec> = {
  greenAlien,
  blob,
  ufo,
  robot,
  bouncer,
  floatingEye,
  crystalSnail,
  tentacleBuddy,
};
