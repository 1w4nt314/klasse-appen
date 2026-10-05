import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige bondegårdsdyr: unger (kalv, pattegris, lam, kylling, føl,
 * gedekid, ælling) samt hane og gås. Samme regler som i creatures.tsx:
 * profil mod højre, fødderne på viewBox'ens bund, fjerne ben først.
 */

const calf: CreatureSpec = {
  name: "Kalv",
  height: 13,
  aspect: 156 / 120,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 156 120",
  art: (
    <>
      <path d="M24 46 C 12 52, 12 70, 16 82" stroke="#3b3532" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="16" cy="86" rx="4.5" ry="7" fill="#3b3532" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="86" y="66" width="13" height="52" rx="6" fill="#d9d3c8" />
        <rect x="86" y="109" width="13" height="9" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="28" y="66" width="13" height="52" rx="6" fill="#d9d3c8" />
        <rect x="28" y="109" width="13" height="9" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="66" cy="60" rx="46" ry="28" fill="#f7f4ee" />
        <ellipse cx="50" cy="46" rx="17" ry="11" fill="#3b3532" />
        <ellipse cx="88" cy="70" rx="12" ry="9" fill="#3b3532" />
        <ellipse cx="31" cy="62" rx="7" ry="6" fill="#3b3532" />
        <ellipse cx="76" cy="36" rx="9" ry="5" fill="#3b3532" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="100" y="66" width="14" height="52" rx="6" fill="#f7f4ee" />
        <rect x="100" y="109" width="14" height="9" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="42" y="66" width="14" height="52" rx="6" fill="#f7f4ee" />
        <rect x="42" y="109" width="14" height="9" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-head">
        <ellipse cx="100" cy="42" rx="13" ry="6" transform="rotate(-24 100 42)" fill="#3b3532" />
        <ellipse cx="102" cy="43" rx="6" ry="2.6" transform="rotate(-24 102 43)" fill="#e5a0aa" />
        <ellipse cx="120" cy="54" rx="25" ry="23" fill="#f7f4ee" />
        <ellipse cx="114" cy="44" rx="14" ry="12" fill="#3b3532" />
        <path d="M120 32 C 116 24, 126 22, 128 30 C 124 28, 122 30, 120 32 Z" fill="#d6c9a8" />
        <ellipse cx="138" cy="69" rx="15" ry="11" fill="#f3a9b4" />
        <ellipse cx="144" cy="67" rx="2.2" ry="3.2" fill="#d9808f" />
        <ellipse cx="135" cy="68" rx="2.2" ry="3.2" fill="#d9808f" />
        <circle cx="116" cy="66" r="5" fill="#f3a9b4" opacity="0.55" />
        {EYE(129, 52, 5.5)}
      </g>
    </>
  ),
};

const piglet: CreatureSpec = {
  name: "Pattegris",
  height: 7,
  aspect: 116 / 76,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 116 76",
  art: (
    <>
      <path d="M18 36 C 6 26, 0 42, 9 42 C 4 50, 18 52, 17 43" stroke="#ef9fae" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="64" y="54" width="12" height="22" rx="6" fill="#e594a3" />
        <rect x="64" y="70" width="12" height="6" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="22" y="54" width="12" height="22" rx="6" fill="#e594a3" />
        <rect x="22" y="70" width="12" height="6" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="54" cy="42" rx="38" ry="26" fill="#f9c4cd" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="76" y="38" width="13" height="38" rx="6" fill="#f9c4cd" />
        <rect x="76" y="70" width="13" height="6" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="34" y="38" width="13" height="38" rx="6" fill="#f9c4cd" />
        <rect x="34" y="70" width="13" height="6" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-head">
        <circle cx="84" cy="40" r="22" fill="#f9c4cd" />
        <path d="M66 28 C 62 12, 80 8, 90 18 C 84 26, 76 30, 66 28 Z" fill="#e594a3" />
        <ellipse cx="102" cy="48" rx="12" ry="10" fill="#f09db0" />
        <ellipse cx="106" cy="47" rx="2" ry="3.2" fill="#b8687a" />
        <ellipse cx="99" cy="48" rx="2" ry="3.2" fill="#b8687a" />
        <circle cx="78" cy="52" r="5" fill="#f09db0" opacity="0.6" />
        {EYE(91, 34, 4.6)}
      </g>
    </>
  ),
};

const LAMB_WOOL: ReadonlyArray<readonly [number, number, number]> = [
  [30, 52, 15],
  [44, 38, 16],
  [62, 33, 16],
  [78, 42, 14],
  [80, 56, 14],
  [62, 64, 14],
  [42, 64, 14],
  [56, 50, 20],
];

const lamb: CreatureSpec = {
  name: "Lam",
  height: 9,
  aspect: 118 / 100,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 118 100",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="74" y="66" width="7" height="34" rx="3.5" fill="#6b5e56" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="32" y="66" width="7" height="34" rx="3.5" fill="#6b5e56" />
      </g>
      <g className="zoo-torso">
        <circle cx="18" cy="52" r="9" fill="#f4eee0" />
        {LAMB_WOOL.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 1 ? "#fdfaf2" : "#f4eee0"} />
        ))}
        <circle cx="68" cy="52" r="12" fill="#fdfaf2" />
        <circle cx="46" cy="54" r="10" fill="#fdfaf2" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="84" y="68" width="8" height="32" rx="4" fill="#8a7a6e" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="42" y="68" width="8" height="32" rx="4" fill="#8a7a6e" />
      </g>
      <g className="zoo-head">
        <ellipse cx="84" cy="44" rx="10" ry="4.5" transform="rotate(28 84 44)" fill="#e7c9b8" />
        <ellipse cx="97" cy="54" rx="14" ry="16" transform="rotate(-10 97 54)" fill="#f4e2d2" />
        <circle cx="94" cy="36" r="10" fill="#fdfaf2" />
        <circle cx="104" cy="38" r="7" fill="#f4eee0" />
        <ellipse cx="106" cy="66" rx="5.5" ry="4" fill="#eba9b2" />
        <circle cx="94" cy="62" r="4" fill="#eba9b2" opacity="0.5" />
        {EYE(101, 52, 4.2)}
      </g>
    </>
  ),
};

const chick: CreatureSpec = {
  name: "Kylling",
  height: 4,
  aspect: 64 / 60,
  gait: "hop",
  pace: 1.3,
  viewBox: "0 0 64 60",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M22 50 V 57 M17 58.5 H 27 M22 57 L 17 59 M22 57 L 27 59" stroke="#f0a02a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M38 50 V 57 M33 58.5 H 43 M38 57 L 33 59 M38 57 L 43 59" stroke="#d98a1c" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <path d="M10 40 L 4 36 L 12 34 Z" fill="#f5c82c" />
        <circle cx="30" cy="34" r="21" fill="#ffe04a" />
        <ellipse cx="30" cy="42" rx="14" ry="8" fill="#fff0a0" opacity="0.7" />
        <ellipse cx="24" cy="36" rx="10" ry="7" transform="rotate(-10 24 36)" fill="#f5c82c" />
      </g>
      <g className="zoo-head">
        <circle cx="40" cy="22" r="15" fill="#ffe04a" />
        <path d="M34 8 C 34 3, 38 3, 38 8 M39 7 C 40 2, 44 3, 43 8" stroke="#f5c82c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M52 19 L 62 23 L 52 27 Z" fill="#f5821e" />
        <circle cx="42" cy="29" r="4" fill="#f8a090" opacity="0.6" />
        {EYE(45, 19, 3.4)}
      </g>
    </>
  ),
};

const rooster: CreatureSpec = {
  name: "Hane",
  height: 11,
  aspect: 150 / 150,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 150 150",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M46 88 C 20 88, 6 64, 10 38 C 12 28, 20 24, 22 30 C 20 50, 32 68, 56 80 Z" fill="#26302c" />
        <path d="M46 92 C 22 98, 4 84, 4 62 C 4 54, 10 52, 12 58 C 14 72, 28 82, 54 86 Z" fill="#3f7d5a" />
        <path d="M48 84 C 30 76, 26 54, 36 40 C 40 36, 44 38, 43 44 C 42 58, 50 68, 60 76 Z" fill="#b4491f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M70 112 V 143 M62 146 H 80 M70 143 L 62 147 M70 143 L 80 147 M70 128 L 76 126" stroke="#e9a21f" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M88 112 V 143 M80 146 H 98 M88 143 L 80 147 M88 143 L 98 147 M88 128 L 94 126" stroke="#c98616" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="72" cy="92" rx="40" ry="28" transform="rotate(-12 72 92)" fill="#c2561f" />
        <circle cx="98" cy="68" r="22" fill="#e49b2b" />
        <ellipse cx="62" cy="96" rx="26" ry="15" transform="rotate(-14 62 96)" fill="#8f3a1a" />
        <path d="M44 100 C 58 108, 76 106, 88 96" stroke="#26302c" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="106" cy="42" r="16" fill="#e49b2b" />
        <circle cx="97" cy="23" r="7" fill="#d83a2e" />
        <circle cx="107" cy="18" r="8.5" fill="#d83a2e" />
        <circle cx="117" cy="23" r="7" fill="#d83a2e" />
        <path d="M121 40 L 138 46 L 121 52 Z" fill="#f2b81f" />
        <ellipse cx="122" cy="62" rx="5.5" ry="9" fill="#d83a2e" />
        <circle cx="106" cy="52" r="5" fill="#f6f0e0" />
        {EYE(111, 37, 3.6)}
      </g>
    </>
  ),
};

const foal: CreatureSpec = {
  name: "Føl",
  height: 17,
  aspect: 190 / 170,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 190 170",
  art: (
    <>
      <path d="M46 62 C 28 60, 18 84, 24 108 C 32 96, 38 86, 52 78 Z" fill="#5a3722" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="88" width="11" height="82" rx="5" fill="#8a5230" />
        <rect x="120" y="160" width="11" height="10" rx="3" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="50" y="88" width="11" height="82" rx="5" fill="#8a5230" />
        <rect x="50" y="160" width="11" height="10" rx="3" fill="#3a2a22" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="86" cy="78" rx="46" ry="25" fill="#a9693a" />
        <path d="M112 70 C 120 48, 130 34, 146 26 L 170 44 C 158 54, 152 70, 144 94 Z" fill="#a9693a" />
        <path d="M106 66 C 114 42, 126 26, 144 16 L 150 28 C 138 34, 130 48, 124 68 Z" fill="#5a3722" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="134" y="72" width="12" height="98" rx="5" fill="#a9693a" />
        <rect x="134" y="152" width="12" height="6" fill="#f6efe2" />
        <rect x="134" y="160" width="12" height="10" rx="3" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="64" y="68" width="12" height="102" rx="5" fill="#a9693a" />
        <rect x="64" y="152" width="12" height="6" fill="#f6efe2" />
        <rect x="64" y="160" width="12" height="10" rx="3" fill="#3a2a22" />
      </g>
      <g className="zoo-head">
        <path d="M147 20 L 147 2 L 158 16 Z" fill="#a9693a" />
        <path d="M150 17 L 150 8 L 155 16 Z" fill="#e2a58a" />
        <path d="M144 20 C 154 11, 168 14, 174 26 C 180 36, 187 45, 186 54 C 182 61, 174 59, 168 55 C 158 51, 150 44, 146 37 C 141 31, 140 25, 144 20 Z" fill="#a9693a" />
        <path d="M160 18 C 166 28, 174 40, 182 52 L 177 55 C 170 48, 162 38, 156 24 Z" fill="#f6efe2" />
        <ellipse cx="181" cy="54" rx="7" ry="5.5" fill="#e0b48c" />
        <ellipse cx="183" cy="53" rx="1.6" ry="2.2" fill="#6b4a36" />
        <path d="M143 20 C 150 10, 158 12, 158 22 C 152 20, 147 22, 143 20 Z" fill="#5a3722" />
        {EYE(158, 31, 4.2)}
      </g>
    </>
  ),
};

const goatKid: CreatureSpec = {
  name: "Gedekid",
  height: 9,
  aspect: 124 / 100,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 124 100",
  art: (
    <>
      <path d="M24 46 L 14 34 L 30 40 Z" fill="#d8c8ae" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="72" y="62" width="8" height="38" rx="4" fill="#bba98d" />
        <rect x="72" y="93" width="8" height="7" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="30" y="62" width="8" height="38" rx="4" fill="#bba98d" />
        <rect x="30" y="93" width="8" height="7" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="56" cy="52" rx="34" ry="20" fill="#efe6d4" />
        <path d="M72 44 C 80 32, 86 28, 92 28 L 100 54 C 92 56, 86 64, 82 74 Z" fill="#efe6d4" />
        <path d="M36 38 C 46 32, 60 34, 70 42" stroke="#d8c8ae" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="82" y="46" width="9" height="54" rx="4" fill="#efe6d4" />
        <rect x="82" y="93" width="9" height="7" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="40" y="44" width="9" height="56" rx="4" fill="#efe6d4" />
        <rect x="40" y="93" width="9" height="7" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-head">
        <path d="M90 28 C 89 24, 91 21, 94 20 C 96 23, 96 26, 96 28 Z" fill="#a08a72" />
        <path d="M98 27 C 98 23, 101 20, 105 20 C 105 23, 105 26, 104 28 Z" fill="#8a7560" />
        <ellipse cx="82" cy="40" rx="11" ry="5" transform="rotate(28 82 40)" fill="#d8c8ae" />
        <ellipse cx="98" cy="38" rx="16" ry="14" fill="#efe6d4" />
        <ellipse cx="111" cy="46" rx="11" ry="9" fill="#efe6d4" />
        <ellipse cx="118" cy="45" rx="3.4" ry="2.8" fill="#6b5a4c" />
        <path d="M107 53 C 110 58, 110 64, 107 68 C 104 62, 102 57, 103 53 Z" fill="#a08a72" />
        <circle cx="96" cy="50" r="4" fill="#f1b9b9" opacity="0.5" />
        {EYE(102, 35, 4.4)}
      </g>
    </>
  ),
};

const duckling: CreatureSpec = {
  name: "Ælling",
  height: 4,
  aspect: 68 / 56,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 68 56",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="24" y="44" width="3.4" height="8" fill="#f08a1c" />
        <path d="M17 54.5 Q 26 47 34 54.5 Z" fill="#f59a2a" stroke="#f59a2a" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="35" y="44" width="3.4" height="8" fill="#dc7a14" />
        <path d="M28 54.5 Q 37 47 45 54.5 Z" fill="#e88a1e" stroke="#e88a1e" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <path d="M6 32 C 4 28, 6 24, 10 22 C 12 28, 16 30, 20 32 Z" fill="#ffe04a" />
        <ellipse cx="30" cy="36" rx="22" ry="14" fill="#ffe04a" />
        <ellipse cx="28" cy="40" rx="13" ry="7" fill="#fff0a0" opacity="0.7" />
        <ellipse cx="26" cy="35" rx="11" ry="7" transform="rotate(-8 26 35)" fill="#f5c82c" />
      </g>
      <g className="zoo-head">
        <circle cx="46" cy="21" r="12" fill="#ffe04a" />
        <path d="M54 20 C 61 18, 67 21, 66 25 C 63 28, 57 28, 53 26 Z" fill="#f5821e" />
        <circle cx="45" cy="28" r="3.6" fill="#f8a090" opacity="0.55" />
        {EYE(49, 17, 3.2)}
      </g>
    </>
  ),
};

const goose: CreatureSpec = {
  name: "Gås",
  height: 12,
  aspect: 150 / 140,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 150 140",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="55" y="104" width="6" height="30" fill="#f08a1c" />
        <path d="M42 138 Q 58 126 74 138 Z" fill="#f59a2a" stroke="#f59a2a" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="76" y="104" width="6" height="30" fill="#dc7a14" />
        <path d="M63 138 Q 79 126 95 138 Z" fill="#e88a1e" stroke="#e88a1e" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <path d="M26 74 L 6 62 C 8 76, 12 90, 28 96 Z" fill="#f2f2ee" />
        <ellipse cx="66" cy="82" rx="44" ry="28" fill="#fbfbf8" />
        <path d="M92 68 C 100 76, 100 90, 92 98 C 84 94, 82 78, 88 66 Z" fill="#fbfbf8" />
        <ellipse cx="62" cy="86" rx="28" ry="14" transform="rotate(-6 62 86)" fill="#e3e6e8" />
        <ellipse cx="58" cy="100" rx="26" ry="6" fill="#eceeef" opacity="0.7" />
      </g>
      <g className="zoo-head">
        <path d="M92 74 C 110 66, 104 40, 112 24" stroke="#fbfbf8" strokeWidth="15" fill="none" strokeLinecap="round" />
        <ellipse cx="117" cy="18" rx="13" ry="11" fill="#fbfbf8" />
        <path d="M126 14 C 135 13, 144 17, 144 21 C 142 26, 133 27, 126 25 Z" fill="#f5821e" />
        <circle cx="128" cy="14" r="2.4" fill="#d96e12" />
        {EYE(120, 14, 3.4)}
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  calf,
  piglet,
  lamb,
  chick,
  rooster,
  foal,
  goatKid,
  duckling,
  goose,
};
