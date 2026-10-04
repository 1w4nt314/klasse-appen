import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Jungledyrene i Klasse Zoo. Hvert dyr er tegnet i profil, vendt mod højre,
 * med fødderne på bunden af viewBox. Ben ligger i grupperne `zoo-leg-a`/`zoo-leg-b`
 * (diagonal gangart) så CSS kan svinge dem når dyret går.
 */

const elephant: CreatureSpec = {
  name: "Elefant",
  height: 30,
  aspect: 210 / 160,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 210 160",
  art: (
    <>
      <path d="M34 78 C 22 88, 20 100, 24 112" stroke="#7b8797" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M24 110 l -4 8 l 7 -3 z" fill="#5c6776" />
      <g className="zoo-leg zoo-leg-a"><rect x="130" y="96" width="24" height="62" rx="9" fill="#7b8797" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="44" y="96" width="24" height="62" rx="9" fill="#7b8797" /></g>
      <g className="zoo-torso">
        <ellipse cx="96" cy="86" rx="66" ry="48" fill="#97a3b3" />
        <path d="M44 104 C 70 126, 128 128, 156 104" stroke="#8592a3" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="146" y="98" width="25" height="60" rx="9" fill="#97a3b3" /><path d="M148 154 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="60" y="98" width="25" height="60" rx="9" fill="#97a3b3" /><path d="M62 154 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <path d="M178 84 C 196 98, 196 124, 186 142 C 182 150, 192 154, 196 146" stroke="#97a3b3" strokeWidth="15" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="68" r="36" fill="#97a3b3" />
        <path d="M184 92 q 12 6 16 -2" stroke="#f4efe3" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="140" cy="70" rx="24" ry="33" fill="#8592a3" />
        <ellipse cx="140" cy="72" rx="15" ry="22" fill="#d9a6a6" opacity="0.65" />
        {EYE(172, 58, 4.2)}
        <circle cx="182" cy="74" r="5" fill="#e6a4a4" opacity="0.45" />
      </g>
    </>
  ),
};

const tiger: CreatureSpec = {
  name: "Tiger",
  height: 18,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 210 124",
  art: (
    <>
      <path d="M42 62 C 24 58, 14 42, 20 24" stroke="#ef8a2b" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M20 30 C 18 24, 19 20, 21 17" stroke="#2b221c" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="70" width="15" height="52" rx="7" fill="#d9761d" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="70" width="15" height="52" rx="7" fill="#d9761d" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="66" rx="64" ry="27" fill="#f39233" />
        <path d="M54 80 C 80 94, 130 94, 152 82" fill="#fbe3c4" />
        <g stroke="#2b221c" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M70 42 q 6 12 0 24" />
          <path d="M88 39 q 7 14 0 28" />
          <path d="M106 39 q 7 14 0 28" />
          <path d="M124 41 q 6 12 0 24" />
          <path d="M52 50 q 5 9 0 18" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="150" y="72" width="16" height="50" rx="7" fill="#f39233" /><ellipse cx="160" cy="120" rx="10" ry="4" fill="#fbe3c4" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="64" y="72" width="16" height="50" rx="7" fill="#f39233" /><ellipse cx="74" cy="120" rx="10" ry="4" fill="#fbe3c4" /></g>
      <g className="zoo-head">
        <circle cx="160" cy="34" r="8" fill="#f39233" /><circle cx="160" cy="34" r="4" fill="#2b221c" />
        <circle cx="186" cy="34" r="8" fill="#f39233" /><circle cx="186" cy="34" r="4" fill="#2b221c" />
        <circle cx="174" cy="54" r="25" fill="#f39233" />
        <ellipse cx="184" cy="66" rx="16" ry="11" fill="#fbe3c4" />
        <path d="M188 58 l 8 0 l -4 5 z" fill="#2b221c" />
        <path d="M164 36 q 4 6 0 12 M178 32 q 3 5 0 10" stroke="#2b221c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {EYE(180, 49, 3.8)}
      </g>
    </>
  ),
};

const monkey: CreatureSpec = {
  name: "Abe",
  height: 17,
  aspect: 130 / 150,
  gait: "walk",
  pace: 1.25,
  viewBox: "0 0 130 150",
  art: (
    <>
      <path d="M38 98 C 8 100, 6 64, 26 62 C 40 60, 40 80, 28 80" stroke="#7a4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><path d="M74 112 v 30" stroke="#6a3f23" strokeWidth="11" strokeLinecap="round" /><ellipse cx="78" cy="145" rx="9" ry="4" fill="#c49a70" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M76 74 l 18 24" stroke="#6a3f23" strokeWidth="9" strokeLinecap="round" /></g>
      <g className="zoo-torso"><ellipse cx="66" cy="94" rx="28" ry="30" fill="#8a5632" /><ellipse cx="72" cy="98" rx="16" ry="20" fill="#d9ab7f" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M58 112 v 32" stroke="#8a5632" strokeWidth="12" strokeLinecap="round" /><ellipse cx="62" cy="145" rx="9" ry="4" fill="#d9ab7f" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M62 76 l 22 26" stroke="#8a5632" strokeWidth="10" strokeLinecap="round" /><circle cx="86" cy="104" r="6" fill="#d9ab7f" /></g>
      <g className="zoo-head">
        <circle cx="54" cy="44" r="11" fill="#8a5632" /><circle cx="54" cy="44" r="6" fill="#d9ab7f" />
        <circle cx="76" cy="42" r="27" fill="#8a5632" />
        <path d="M66 40 C 66 28, 82 26, 86 36 C 96 34, 104 44, 98 54 C 96 66, 74 70, 68 58 C 62 54, 62 46, 66 40 Z" fill="#e2b98e" />
        {EYE(77, 40, 3.6)}
        {EYE(92, 40, 3.6)}
        <path d="M82 58 q 6 5 12 0" stroke="#5a341c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const gorilla: CreatureSpec = {
  name: "Gorilla",
  height: 24,
  aspect: 170 / 150,
  gait: "walk",
  pace: 0.75,
  viewBox: "0 0 170 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M50 108 v 36" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M112 70 C 124 92, 124 116, 122 142" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <path d="M24 106 C 18 68, 52 38, 98 40 C 132 42, 146 70, 136 98 C 126 124, 40 132, 24 106 Z" fill="#43474d" />
        <path d="M58 52 C 76 44, 104 46, 118 58" stroke="#8b9097" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M62 108 v 36" stroke="#43474d" strokeWidth="22" strokeLinecap="round" /><ellipse cx="66" cy="146" rx="14" ry="4" fill="#2a2c30" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M100 72 C 114 96, 114 118, 112 142" stroke="#43474d" strokeWidth="22" strokeLinecap="round" /><ellipse cx="114" cy="145" rx="13" ry="5" fill="#2a2c30" /></g>
      <g className="zoo-head">
        <circle cx="132" cy="50" r="24" fill="#43474d" />
        <path d="M122 36 C 136 30, 154 36, 156 48 C 158 64, 146 72, 134 70 C 124 68, 120 56, 122 36 Z" fill="#6d6560" />
        <path d="M124 40 h 30" stroke="#2f3236" strokeWidth="6" strokeLinecap="round" />
        {EYE(146, 46, 3.4)}
        <ellipse cx="150" cy="58" rx="5" ry="3" fill="#2f2b29" />
      </g>
    </>
  ),
};

const toucan: CreatureSpec = {
  name: "Tukan",
  height: 12,
  aspect: 150 / 120,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 150 120",
  art: (
    <>
      <path d="M24 66 L 6 98 L 30 86 Z" fill="#1f2328" />
      <g className="zoo-leg zoo-leg-a"><path d="M52 94 v 22 M48 116 h 10" stroke="#3c7fd1" strokeWidth="5" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M64 94 v 22 M60 116 h 10" stroke="#3c7fd1" strokeWidth="5" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="56" cy="66" rx="36" ry="30" fill="#1f2328" />
        <path d="M70 40 C 90 46, 92 72, 80 88 C 72 74, 70 56, 70 40 Z" fill="#fff4d6" />
        <path d="M76 84 C 70 92, 58 96, 50 94" stroke="#e5452e" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M30 62 C 40 54, 56 58, 60 70 C 50 76, 36 74, 30 62 Z" fill="#2c3238" />
      </g>
      <g className="zoo-head">
        <circle cx="80" cy="38" r="18" fill="#1f2328" />
        <path d="M88 26 C 116 18, 144 26, 148 40 C 140 52, 112 52, 92 48 Z" fill="#f5a524" />
        <path d="M92 40 C 112 42, 134 44, 148 40 C 140 52, 112 52, 92 48 Z" fill="#e5452e" />
        <path d="M134 30 C 142 32, 147 36, 148 40 L 140 40 Z" fill="#1f2328" opacity="0.8" />
        <circle cx="84" cy="34" r="8" fill="#5fc0e8" />
        {EYE(85, 34, 3.6)}
      </g>
    </>
  ),
};

const frog: CreatureSpec = {
  name: "Frø",
  height: 8,
  aspect: 110 / 76,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 110 76",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M24 54 C 6 60, 6 72, 26 74 L 42 74" stroke="#3f8f3a" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="56" cy="50" rx="36" ry="24" fill="#5bb54f" />
        <ellipse cx="62" cy="58" rx="24" ry="13" fill="#d8efb4" />
        <circle cx="38" cy="40" r="4" fill="#3f8f3a" /><circle cx="48" cy="50" r="3" fill="#3f8f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M74 62 l 8 12 M76 74 h 12" stroke="#4aa33f" strokeWidth="7" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <circle cx="68" cy="26" r="13" fill="#5bb54f" />
        <circle cx="88" cy="28" r="12" fill="#5bb54f" />
        <circle cx="70" cy="25" r="8" fill="#fff" /><circle cx="89" cy="27" r="7.5" fill="#fff" />
        {EYE(72, 26, 4)}
        {EYE(91, 28, 4)}
        <path d="M78 50 q 10 6 18 -4" stroke="#2d6b29" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const crocodile: CreatureSpec = {
  name: "Krokodille",
  height: 10,
  aspect: 260 / 80,
  gait: "walk",
  pace: 0.65,
  viewBox: "0 0 260 80",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M150 52 l 8 24 h 10" stroke="#3a6b3c" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M74 52 l 8 24 h 10" stroke="#3a6b3c" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-torso">
        <path d="M4 48 C 30 46, 50 34, 90 32 C 130 30, 170 32, 196 40 L 196 62 C 160 66, 110 66, 70 62 C 40 60, 20 56, 4 48 Z" fill="#4f8a4c" />
        <path d="M60 60 C 100 66, 150 66, 194 60" stroke="#c9d98f" strokeWidth="6" fill="none" strokeLinecap="round" />
        <g fill="#3a6b3c">
          <path d="M60 36 l 6 -8 l 6 8 z" /><path d="M84 33 l 6 -8 l 6 8 z" /><path d="M108 32 l 6 -8 l 6 8 z" />
          <path d="M132 32 l 6 -8 l 6 8 z" /><path d="M156 34 l 6 -8 l 6 8 z" /><path d="M38 41 l 5 -7 l 5 7 z" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M164 56 l 6 20 h 10" stroke="#4f8a4c" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M90 56 l 6 20 h 10" stroke="#4f8a4c" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-head">
        <path d="M190 38 C 210 30, 222 34, 230 40 C 244 42, 256 44, 258 50 C 256 56, 236 58, 214 60 L 192 62 Z" fill="#4f8a4c" />
        <path d="M206 52 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5 l 4 5 l 4 -5" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <circle cx="212" cy="34" r="8" fill="#4f8a4c" />
        {EYE(214, 33, 3.4)}
        <circle cx="252" cy="45" r="1.8" fill="#2a4a2a" />
      </g>
    </>
  ),
};

const parrot: CreatureSpec = {
  name: "Papegøje",
  height: 13,
  aspect: 120 / 140,
  gait: "hop",
  pace: 1.05,
  viewBox: "0 0 120 140",
  art: (
    <>
      <path d="M44 100 L 14 136 L 24 138 L 52 108 Z" fill="#2f6fd6" />
      <path d="M46 102 L 22 138 L 30 138 L 54 110 Z" fill="#e0352b" />
      <g className="zoo-leg zoo-leg-a"><path d="M56 118 v 16 M51 136 h 10" stroke="#6b6b6b" strokeWidth="4.5" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M67 118 v 16 M62 136 h 10" stroke="#7d7d7d" strokeWidth="4.5" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="90" rx="24" ry="33" fill="#e0352b" />
        <path d="M40 74 C 54 70, 64 82, 62 102 C 58 116, 44 118, 36 108 C 32 96, 32 82, 40 74 Z" fill="#2f6fd6" />
        <path d="M40 76 C 52 74, 58 82, 58 90 C 50 88, 42 86, 37 84 Z" fill="#f4c430" />
        <path d="M40 96 h 18 M40 104 h 16" stroke="#2559ad" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="72" cy="46" r="21" fill="#e0352b" />
        <ellipse cx="81" cy="47" rx="10" ry="12" fill="#fff" />
        <path d="M76 52 q 4 1 8 0 M77 56 q 4 1 7 0" stroke="#e6b3a8" strokeWidth="1.5" fill="none" />
        <path d="M88 40 C 102 38, 108 50, 102 62 C 98 56, 94 54, 89 54 Z" fill="#2b2b2b" />
        <path d="M88 52 C 94 54, 98 58, 100 64 C 94 64, 90 60, 88 56 Z" fill="#efe6d2" />
        {EYE(81, 43, 3.4)}
      </g>
    </>
  ),
};

const panther: CreatureSpec = {
  name: "Sort panter",
  height: 17,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 210 124",
  art: (
    <>
      <path d="M42 64 C 22 66, 10 52, 14 30" stroke="#2a2b31" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="70" width="15" height="52" rx="7" fill="#1f2025" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="70" width="15" height="52" rx="7" fill="#1f2025" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="68" rx="64" ry="25" fill="#2f3138" />
        <path d="M58 52 C 86 42, 126 42, 150 54" stroke="#4a4d57" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="150" y="72" width="16" height="50" rx="7" fill="#2f3138" /><ellipse cx="160" cy="120" rx="10" ry="4" fill="#3b3e46" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="64" y="72" width="16" height="50" rx="7" fill="#2f3138" /><ellipse cx="74" cy="120" rx="10" ry="4" fill="#3b3e46" /></g>
      <g className="zoo-head">
        <circle cx="160" cy="36" r="7" fill="#2f3138" />
        <circle cx="184" cy="36" r="7" fill="#2f3138" />
        <circle cx="172" cy="54" r="23" fill="#2f3138" />
        <ellipse cx="184" cy="64" rx="14" ry="10" fill="#3d4049" />
        <path d="M188 57 l 7 0 l -3.5 4.5 z" fill="#15161a" />
        <circle cx="179" cy="48" r="5" fill="#d9c34a" />
        {EYE(180, 48, 2.8)}
      </g>
    </>
  ),
};

const sloth: CreatureSpec = {
  name: "Dovendyr",
  height: 14,
  aspect: 160 / 110,
  gait: "walk",
  pace: 0.4,
  viewBox: "0 0 160 110",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M112 62 C 118 80, 120 94, 118 106 M112 106 l 4 -6 M118 106 l 3 -6" stroke="#8a6a4c" strokeWidth="9" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M46 64 C 42 80, 42 94, 44 106" stroke="#8a6a4c" strokeWidth="10" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="80" cy="60" rx="52" ry="30" fill="#a8845f" />
        <path d="M40 50 C 58 40, 98 38, 120 48" stroke="#bf9c75" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M44 74 q 4 4 8 0 q 4 4 8 0 M96 76 q 4 4 8 0 q 4 4 8 0" stroke="#8f6e50" strokeWidth="2.5" fill="none" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M120 64 C 128 80, 130 94, 128 106 M122 107 l 5 -7 M128 107 l 4 -7 M134 106 l 2 -6" stroke="#a8845f" strokeWidth="10" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M56 66 C 52 82, 52 94, 54 106 M50 107 l 4 -6 M56 107 l 3 -6" stroke="#a8845f" strokeWidth="11" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <circle cx="132" cy="42" r="22" fill="#a8845f" />
        <ellipse cx="136" cy="44" rx="16" ry="13" fill="#e9d6b4" />
        <path d="M124 40 C 126 34, 134 36, 134 42 C 132 48, 124 46, 124 40 Z" fill="#4a3424" />
        <path d="M138 40 C 140 34, 148 36, 148 42 C 146 48, 138 46, 138 40 Z" fill="#4a3424" />
        {EYE(130, 41, 2.6)}
        {EYE(143, 41, 2.6)}
        <ellipse cx="137" cy="49" rx="3" ry="2" fill="#3a2a1d" />
        <path d="M131 53 q 6 5 12 0" stroke="#4a3424" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const tapir: CreatureSpec = {
  name: "Tapir",
  height: 17,
  aspect: 210 / 130,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 210 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><rect x="140" y="80" width="17" height="48" rx="7" fill="#1e2024" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="50" y="80" width="17" height="48" rx="7" fill="#1e2024" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="70" rx="66" ry="36" fill="#2b2d33" />
        <path d="M62 38 C 80 32, 116 32, 132 40 C 136 60, 134 86, 128 102 C 110 106, 84 106, 66 102 C 58 84, 56 58, 62 38 Z" fill="#eceae4" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="152" y="82" width="18" height="46" rx="7" fill="#2b2d33" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="64" y="82" width="18" height="46" rx="7" fill="#2b2d33" /></g>
      <g className="zoo-head">
        <circle cx="158" cy="38" r="8" fill="#2b2d33" />
        <circle cx="158" cy="38" r="4" fill="#eceae4" />
        <ellipse cx="170" cy="60" rx="28" ry="24" fill="#2b2d33" />
        <path d="M190 54 C 202 56, 208 64, 206 76 C 204 80, 198 78, 198 74 C 196 68, 192 66, 186 66 Z" fill="#2b2d33" />
        {EYE(180, 52, 3.2)}
      </g>
    </>
  ),
};

const SNAKE_SEGMENTS = [
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

const snake: CreatureSpec = {
  name: "Slange",
  height: 8,
  aspect: 220 / 56,
  gait: "slither",
  pace: 0.9,
  viewBox: "0 0 220 56",
  art: (
    <>
      {SNAKE_SEGMENTS.map(([x, y, r], i) => (
        <g
          key={i}
          className="zoo-seg"
          style={{ "--i": i } as CSSProperties}
        >
          <circle cx={x} cy={y} r={r} fill="#3e9b4f" />
          <ellipse cx={x} cy={y + r * 0.45} rx={r * 0.85} ry={r * 0.45} fill="#e8d36a" />
          {i % 2 === 1 && <circle cx={x} cy={y - r * 0.4} r={r * 0.35} fill="#2c7a3b" />}
        </g>
      ))}
      <g className="zoo-seg zoo-head" style={{ "--i": 9 } as CSSProperties}>
        <path d="M200 46 l 12 -2 l 4 -4 M212 44 l 5 2" stroke="#d6453a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="186" cy="38" rx="17" ry="12" fill="#3e9b4f" />
        <ellipse cx="190" cy="43" rx="12" ry="5" fill="#e8d36a" />
        <circle cx="192" cy="32" r="6" fill="#fff" />
        {EYE(193, 32, 3.4)}
      </g>
    </>
  ),
};

export const creatures: Record<string, CreatureSpec> = {
  elephant,
  tiger,
  monkey,
  gorilla,
  toucan,
  frog,
  crocodile,
  parrot,
  panther,
  sloth,
  tapir,
  snake,
};
