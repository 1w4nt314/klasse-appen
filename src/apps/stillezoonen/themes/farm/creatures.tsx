import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Bondegårdsdyrene i Stillezoonen. Hvert dyr er tegnet i profil, vendt mod højre,
 * med fødderne på bunden af viewBox. Ben ligger i `zoo-leg-a`/`zoo-leg-b`
 * (diagonal gangart): fjerne ben tegnes før kroppen, nære ben efter.
 */

const cow: CreatureSpec = {
  name: "Ko",
  height: 20,
  aspect: 220 / 150,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 220 150",
  art: (
    <>
      <path d="M34 58 C 18 64, 18 88, 24 104" stroke="#3b3532" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="108" rx="6" ry="9" fill="#3b3532" />
      <ellipse cx="80" cy="104" rx="13" ry="9" fill="#f3a9b4" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="128" y="88" width="18" height="60" rx="7" fill="#d9d3c8" />
        <rect x="128" y="138" width="18" height="10" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="88" width="18" height="60" rx="7" fill="#d9d3c8" />
        <rect x="46" y="138" width="18" height="10" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="70" rx="68" ry="38" fill="#f7f4ee" />
        <ellipse cx="80" cy="54" rx="21" ry="14" fill="#3b3532" />
        <ellipse cx="128" cy="82" rx="16" ry="12" fill="#3b3532" />
        <ellipse cx="58" cy="84" rx="10" ry="8" fill="#3b3532" />
        <ellipse cx="116" cy="46" rx="9" ry="6" fill="#3b3532" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="146" y="90" width="19" height="58" rx="7" fill="#f7f4ee" />
        <rect x="146" y="138" width="19" height="10" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="90" width="19" height="58" rx="7" fill="#f7f4ee" />
        <rect x="62" y="138" width="19" height="10" rx="4" fill="#4a3f3a" />
      </g>
      <g className="zoo-head">
        <path d="M160 40 C 156 28, 160 22, 166 20 C 164 28, 168 34, 172 38 Z" fill="#efe3c4" />
        <ellipse cx="156" cy="48" rx="14" ry="7" transform="rotate(-18 156 48)" fill="#3b3532" />
        <ellipse cx="178" cy="60" rx="24" ry="22" fill="#f7f4ee" />
        <ellipse cx="172" cy="50" rx="13" ry="11" fill="#3b3532" />
        <ellipse cx="194" cy="76" rx="16" ry="12" fill="#f3a9b4" />
        <ellipse cx="200" cy="74" rx="2.4" ry="3.4" fill="#d9808f" />
        <ellipse cx="190" cy="76" rx="2.4" ry="3.4" fill="#d9808f" />
        <path d="M168 34 C 170 24, 176 22, 182 24 C 180 30, 176 34, 172 38 Z" fill="#efe3c4" />
        {EYE(184, 54, 4)}
      </g>
    </>
  ),
};

const pig: CreatureSpec = {
  name: "Gris",
  height: 13,
  aspect: 170 / 110,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 170 110",
  art: (
    <>
      <path d="M30 52 C 14 44, 12 62, 24 58 C 16 68, 32 70, 30 62" stroke="#ef9fae" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="78" width="18" height="32" rx="7" fill="#e594a3" />
        <rect x="104" y="103" width="18" height="7" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="78" width="18" height="32" rx="7" fill="#e594a3" />
        <rect x="38" y="103" width="18" height="7" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="82" cy="58" rx="58" ry="36" fill="#f7bcc6" />
        <ellipse cx="82" cy="78" rx="40" ry="12" fill="#fbd0d6" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="118" y="80" width="19" height="30" rx="7" fill="#f7bcc6" />
        <rect x="118" y="103" width="19" height="7" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="80" width="19" height="30" rx="7" fill="#f7bcc6" />
        <rect x="52" y="103" width="19" height="7" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-head">
        <circle cx="130" cy="54" r="26" fill="#f7bcc6" />
        <path d="M110 40 C 106 20, 124 14, 136 26 C 130 34, 120 40, 110 40 Z" fill="#e594a3" />
        <ellipse cx="152" cy="62" rx="15" ry="12" fill="#f09db0" />
        <ellipse cx="156" cy="61" rx="2.4" ry="3.6" fill="#b8687a" />
        <ellipse cx="148" cy="62" rx="2.4" ry="3.6" fill="#b8687a" />
        <circle cx="122" cy="66" r="6" fill="#f09db0" opacity="0.6" />
        {EYE(138, 46, 4)}
      </g>
    </>
  ),
};

const WOOL: ReadonlyArray<readonly [number, number, number]> = [
  [46, 66, 22],
  [64, 46, 24],
  [90, 40, 26],
  [116, 48, 24],
  [124, 70, 22],
  [100, 84, 22],
  [70, 84, 22],
  [44, 82, 16],
  [84, 62, 28],
];

const sheep: CreatureSpec = {
  name: "Får",
  height: 13,
  aspect: 170 / 120,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 170 120",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="84" width="10" height="36" rx="5" fill="#3f3935" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="84" width="10" height="36" rx="5" fill="#3f3935" />
      </g>
      <g className="zoo-torso">
        <circle cx="30" cy="62" r="11" fill="#efe8d8" />
        {WOOL.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 1 ? "#f7f2e6" : "#efe8d8"} />
        ))}
        <circle cx="96" cy="58" r="14" fill="#f9f5ec" />
        <circle cx="58" cy="60" r="12" fill="#f9f5ec" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="116" y="86" width="11" height="34" rx="5" fill="#5a524c" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="86" width="11" height="34" rx="5" fill="#5a524c" />
      </g>
      <g className="zoo-head">
        <ellipse cx="124" cy="54" rx="12" ry="6" transform="rotate(24 124 54)" fill="#5a524c" />
        <ellipse cx="142" cy="62" rx="17" ry="21" transform="rotate(-12 142 62)" fill="#6b5e56" />
        <circle cx="134" cy="38" r="12" fill="#f7f2e6" />
        <circle cx="146" cy="40" r="9" fill="#efe8d8" />
        <ellipse cx="152" cy="76" rx="7" ry="5" fill="#e8a5ae" />
        <circle cx="145" cy="55" r="6" fill="#fff" />
        {EYE(146, 55, 3.8)}
      </g>
    </>
  ),
};

const hen: CreatureSpec = {
  name: "Høne",
  height: 9,
  aspect: 120 / 120,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 120 120",
  art: (
    <>
      <path d="M36 62 C 16 56, 8 40, 8 26 C 18 30, 28 38, 42 50 Z" fill="#e6d8b4" />
      <path d="M36 70 C 16 70, 4 60, 2 46 C 14 50, 26 56, 40 62 Z" fill="#f1e7cb" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M54 88 V 114 M46 116 H 62 M54 114 L 46 117 M54 114 L 62 117" stroke="#f0a02a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M70 88 V 114 M62 116 H 78 M70 114 L 62 117 M70 114 L 78 117" stroke="#d98a1c" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="70" rx="36" ry="28" fill="#fbf6e8" />
        <path d="M70 46 C 84 50, 92 60, 88 76 C 80 84, 70 80, 70 70 Z" fill="#fbf6e8" />
        <ellipse cx="54" cy="74" rx="22" ry="14" transform="rotate(-8 54 74)" fill="#ecdfbc" />
      </g>
      <g className="zoo-head">
        <circle cx="84" cy="40" r="18" fill="#fbf6e8" />
        <circle cx="76" cy="21" r="6.5" fill="#e0453a" />
        <circle cx="85" cy="18" r="7.5" fill="#e0453a" />
        <circle cx="94" cy="22" r="6" fill="#e0453a" />
        <path d="M98 38 L 114 44 L 98 49 Z" fill="#f5a524" />
        <ellipse cx="98" cy="55" rx="4.5" ry="6.5" fill="#e0453a" />
        {EYE(90, 36, 3.6)}
      </g>
    </>
  ),
};

const horse: CreatureSpec = {
  name: "Hest",
  height: 26,
  aspect: 250 / 210,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 250 210",
  art: (
    <>
      <path d="M44 96 C 22 98, 12 128, 18 162 C 28 144, 34 128, 50 112 Z" fill="#4a2c1a" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="142" y="112" width="15" height="98" rx="7" fill="#965a30" />
        <rect x="142" y="198" width="15" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="48" y="112" width="15" height="98" rx="7" fill="#965a30" />
        <rect x="48" y="198" width="15" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="108" cy="104" rx="72" ry="34" fill="#b8703c" />
        <path d="M138 84 C 148 54, 166 36, 190 28 L 218 50 C 200 62, 192 84, 184 114 Z" fill="#b8703c" />
        <path d="M130 86 C 138 54, 158 32, 190 22 L 192 36 C 172 44, 160 60, 152 92 Z" fill="#4a2c1a" />
        <ellipse cx="108" cy="124" rx="48" ry="10" fill="#cd8a52" opacity="0.6" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="158" y="114" width="16" height="96" rx="7" fill="#b8703c" />
        <rect x="158" y="192" width="16" height="6" fill="#f6efe2" />
        <rect x="158" y="198" width="16" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="114" width="16" height="96" rx="7" fill="#b8703c" />
        <rect x="62" y="192" width="16" height="6" fill="#f6efe2" />
        <rect x="62" y="198" width="16" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-head">
        <path d="M192 26 L 194 6 L 204 24 Z" fill="#b8703c" />
        <path d="M195 22 L 196 11 L 201 22 Z" fill="#e2a58a" />
        <path d="M186 24 C 200 16, 216 22, 224 36 C 232 48, 246 64, 244 74 C 240 82, 228 80, 220 74 C 208 68, 198 60, 190 50 C 184 42, 182 32, 186 24 Z" fill="#b8703c" />
        <path d="M206 28 C 214 38, 226 54, 236 70 L 230 74 C 220 66, 210 54, 202 40 Z" fill="#f6efe2" />
        <ellipse cx="238" cy="74" rx="8" ry="6" fill="#e0b48c" />
        <ellipse cx="240" cy="73" rx="1.8" ry="2.4" fill="#6b4a36" />
        <path d="M188 22 C 200 18, 210 24, 208 38 C 200 34, 192 30, 188 22 Z" fill="#4a2c1a" />
        {EYE(208, 40, 4)}
      </g>
    </>
  ),
};

const goat: CreatureSpec = {
  name: "Ged",
  height: 15,
  aspect: 190 / 150,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 190 150",
  art: (
    <>
      <path d="M38 66 L 26 52 L 46 60 Z" fill="#d8c8ae" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="108" y="92" width="11" height="58" rx="5" fill="#bba98d" />
        <rect x="108" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="92" width="11" height="58" rx="5" fill="#bba98d" />
        <rect x="44" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="84" cy="78" rx="52" ry="28" fill="#efe6d4" />
        <path d="M110 66 C 122 48, 134 40, 144 40 L 158 68 C 144 72, 130 82, 122 98 Z" fill="#efe6d4" />
        <ellipse cx="70" cy="92" rx="34" ry="8" fill="#e0d4bc" opacity="0.7" />
        <path d="M56 56 C 70 48, 90 50, 100 60" stroke="#d8c8ae" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
        <rect x="120" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="58" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
        <rect x="58" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-head">
        <path d="M144 34 C 144 18, 134 8, 118 10" stroke="#8a7560" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <path d="M150 32 C 152 18, 144 10, 134 10" stroke="#a08a72" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="136" cy="50" rx="13" ry="5.5" transform="rotate(22 136 50)" fill="#d8c8ae" />
        <ellipse cx="150" cy="48" rx="17" ry="15" fill="#efe6d4" />
        <ellipse cx="166" cy="56" rx="13" ry="10" fill="#efe6d4" />
        <ellipse cx="175" cy="56" rx="4" ry="3.2" fill="#6b5a4c" />
        <path d="M160 64 C 164 70, 164 80, 160 88 C 156 80, 154 70, 156 64 Z" fill="#a08a72" />
        {EYE(154, 44, 3.8)}
      </g>
    </>
  ),
};

const duck: CreatureSpec = {
  name: "And",
  height: 9,
  aspect: 118 / 110,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 118 110",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="44" y="90" width="5" height="16" fill="#f08a1c" />
        <path d="M34 109 Q 46 100 58 109 Z" fill="#f59a2a" stroke="#f59a2a" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="90" width="5" height="16" fill="#dc7a14" />
        <path d="M52 109 Q 64 100 76 109 Z" fill="#e88a1e" stroke="#e88a1e" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <path d="M18 62 C 16 56, 20 50, 26 46 C 28 54, 34 58, 38 62 Z" fill="#ffd84a" />
        <ellipse cx="54" cy="72" rx="36" ry="24" fill="#ffd84a" />
        <path d="M64 50 C 76 54, 84 62, 80 76 C 70 80, 62 74, 62 64 Z" fill="#ffd84a" />
        <ellipse cx="50" cy="76" rx="20" ry="12" transform="rotate(-8 50 76)" fill="#f5bf2c" />
      </g>
      <g className="zoo-head">
        <circle cx="80" cy="36" r="19" fill="#ffd84a" />
        <path d="M94 32 C 106 30, 116 34, 116 40 C 114 46, 104 47, 94 45 Z" fill="#f5821e" />
        <circle cx="80" cy="46" r="7" fill="#ffe98a" opacity="0.55" />
        {EYE(86, 31, 3.8)}
      </g>
    </>
  ),
};

const rabbit: CreatureSpec = {
  name: "Kanin",
  height: 8,
  aspect: 130 / 110,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 130 110",
  art: (
    <>
      <circle cx="22" cy="74" r="10" fill="#fbf7ee" />
      <g className="zoo-leg zoo-leg-b">
        <rect x="78" y="82" width="12" height="26" rx="6" fill="#bfa079" />
        <ellipse cx="86" cy="106" rx="10" ry="4.5" fill="#bfa079" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="72" rx="38" ry="28" fill="#d4b894" />
        <ellipse cx="66" cy="84" rx="26" ry="14" fill="#f3e8d6" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="42" cy="84" rx="23" ry="20" fill="#c8a982" />
        <ellipse cx="52" cy="106" rx="20" ry="5" fill="#c8a982" />
        <ellipse cx="42" cy="104" rx="14" ry="6" fill="#c8a982" />
      </g>
      <g className="zoo-head">
        <ellipse cx="84" cy="22" rx="7" ry="22" transform="rotate(-16 84 22)" fill="#c8a982" />
        <ellipse cx="84" cy="24" rx="3.6" ry="16" transform="rotate(-16 84 24)" fill="#f1a6b0" />
        <ellipse cx="100" cy="20" rx="7" ry="22" transform="rotate(8 100 20)" fill="#d4b894" />
        <ellipse cx="100" cy="22" rx="3.6" ry="16" transform="rotate(8 100 22)" fill="#f1a6b0" />
        <circle cx="96" cy="52" r="21" fill="#d4b894" />
        <ellipse cx="110" cy="60" rx="12" ry="9" fill="#f3e8d6" />
        <ellipse cx="119" cy="56" rx="3.8" ry="3" fill="#e8808f" />
        <circle cx="94" cy="62" r="5" fill="#f1a6b0" opacity="0.6" />
        {EYE(101, 46, 4)}
      </g>
    </>
  ),
};

export const creatures: Record<string, CreatureSpec> = {
  cow,
  pig,
  sheep,
  hen,
  horse,
  goat,
  duck,
  rabbit,
};
