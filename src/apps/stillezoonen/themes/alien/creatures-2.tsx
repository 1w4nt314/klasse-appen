import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Ni almindelige rumvæsner til alien-temaet. Profil mod højre, fødderne på
 * bunden af viewBox. Walk-figurer har ben i `zoo-leg-a`/`zoo-leg-b`.
 */

/** Lille krystal med to flader: base i (x, y), spids opad, drejet `rot` grader. */
const kryst = (x: number, y: number, w: number, h: number, rot: number, lys: string, mork: string) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M${-w / 2} 0 L ${-w / 2} ${-h * 0.7} L 0 ${-h} L 0 0 Z`} fill={lys} />
    <path d={`M0 0 L 0 ${-h} L ${w / 2} ${-h * 0.7} L ${w / 2} 0 Z`} fill={mork} />
  </g>
);

/** Ben på robothunden: overben, bolt-led, underben og fod. */
const robotBen = (x: number, metal: string, mork: string, led: string) => (
  <>
    <rect x={x} y={62} width={10} height={20} rx={3} fill={metal} />
    <rect x={x + 1} y={80} width={8} height={14} rx={2.5} fill={mork} />
    <rect x={x - 2} y={92} width={14} height={8} rx={3} fill={metal} />
    <circle cx={x + 5} cy={80} r={5.6} fill={led} />
    <circle cx={x + 5} cy={80} r={2} fill="#fff4d0" />
  </>
);

/** Pelsbolden: små kugler rundt langs kanten giver en lodden silhuet. */
const FNUG_KANT = Array.from({ length: 16 }, (_, i) => {
  const v = (i / 16) * Math.PI * 2;
  return [+(50 + 31 * Math.cos(v)).toFixed(2), +(44 + 31 * Math.sin(v)).toFixed(2)] as const;
});

const greyAlien: CreatureSpec = {
  name: "Grå alien",
  height: 17,
  aspect: 100 / 160,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 100 160",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="45" y="122" width="8" height="35" rx="4" fill="#8f9aa6" />
        <ellipse cx="51" cy="156.5" rx="9" ry="3.5" fill="#8f9aa6" />
      </g>
      <path d="M48 98 C 40 108, 40 118, 44 126" stroke="#8f9aa6" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g className="zoo-torso">
        <rect x="51" y="76" width="13" height="22" rx="6" fill="#aab4bf" />
        <ellipse cx="56" cy="106" rx="17" ry="22" fill="#b9c2cc" />
        <ellipse cx="62" cy="110" rx="9" ry="14" fill="#dde3e9" />
        <circle cx="65" cy="104" r="2.6" fill="#7ff3ff" />
        <circle cx="62" cy="113" r="1.8" fill="#ff7ac8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="60" y="124" width="9" height="33" rx="4.5" fill="#c9d1d9" />
        <ellipse cx="66" cy="156.5" rx="10" ry="3.5" fill="#c9d1d9" />
      </g>
      <path d="M66 94 C 77 103, 80 114, 75 124" stroke="#c9d1d9" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <circle cx="75" cy="125" r="4" fill="#c9d1d9" />
      <g className="zoo-head">
        <path
          d="M56 4 C 84 2, 96 30, 90 52 C 86 68, 72 80, 58 80 C 44 80, 32 68, 28 52 C 22 28, 34 6, 56 4 Z"
          fill="#b9c2cc"
        />
        <ellipse cx="44" cy="22" rx="9" ry="5" fill="#dde3e9" transform="rotate(-35 44 22)" />
        <ellipse cx="48" cy="52" rx="9" ry="7" fill="#1d1a17" transform="rotate(-25 48 52)" />
        {EYE(50, 49, 4.6)}
        <ellipse cx="75" cy="53" rx="12" ry="9" fill="#1d1a17" transform="rotate(25 75 53)" />
        {EYE(77, 49, 6.4)}
        <circle cx="71" cy="57" r="1.7" fill="#fff" />
        <circle cx="82" cy="65" r="3.8" fill="#ff9fb8" opacity="0.55" />
        <path d="M60 69 q 6 5 13 -1" stroke="#6b7581" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const threeEye: CreatureSpec = {
  name: "Treøje",
  height: 15,
  aspect: 110 / 120,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 110 120",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="37" y="92" width="12" height="25" rx="6" fill="#e0741f" />
        <ellipse cx="44" cy="116.5" rx="10" ry="3.5" fill="#e0741f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="52" cy="68" rx="40" ry="38" fill="#ff9640" />
        <ellipse cx="62" cy="77" rx="24" ry="24" fill="#ffc684" />
        <circle cx="29" cy="58" r="4.4" fill="#e0741f" />
        <circle cx="22" cy="78" r="3.2" fill="#e0741f" />
        <circle cx="38" cy="44" r="3" fill="#e0741f" />
        <ellipse cx="30" cy="42" rx="8" ry="4" fill="#fff" opacity="0.3" transform="rotate(-35 30 42)" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="58" y="94" width="13" height="23" rx="6.5" fill="#ff9640" />
        <ellipse cx="66" cy="116.5" rx="11" ry="3.5" fill="#ff9640" />
      </g>
      <g className="zoo-head">
        <path d="M38 38 C 34 26, 30 19, 28 13" stroke="#e0741f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M54 31 C 54 21, 56 16, 58 11" stroke="#e0741f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M70 35 C 76 26, 82 21, 87 17" stroke="#e0741f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="27" cy="12" r="9.5" fill="#fff" />
        {EYE(29, 12, 5.4)}
        <circle cx="58" cy="10" r="9.5" fill="#fff" />
        {EYE(60, 10, 5.4)}
        <circle cx="88" cy="16" r="9.5" fill="#fff" />
        {EYE(90, 16, 5.4)}
        <circle cx="82" cy="64" r="4.6" fill="#ff6f7f" opacity="0.5" />
        <path d="M64 71 q 10 10 22 -1" stroke="#8a3a0e" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const spaceDog: CreatureSpec = {
  name: "Rumhund",
  height: 11,
  aspect: 130 / 100,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 130 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M24 54 C 9 52, 6 38, 12 28" stroke="#a86a35" strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="28" r="4.6" fill="#e3b27a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="24" y="64" width="12" height="26" rx="5" fill="#a69adf" />
        <rect x="22" y="87" width="16" height="13" rx="5.5" fill="#6a55b8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="66" y="64" width="12" height="26" rx="5" fill="#a69adf" />
        <rect x="64" y="87" width="16" height="13" rx="5.5" fill="#6a55b8" />
      </g>
      <g className="zoo-torso">
        <rect x="16" y="36" width="24" height="28" rx="7" fill="#8f78e0" />
        <circle cx="24" cy="46" r="3" fill="#ff9d1f" />
        <circle cx="32" cy="46" r="3" fill="#5fe3d8" />
        <ellipse cx="54" cy="58" rx="36" ry="21" fill="#e6e0ff" />
        <path d="M30 72 C 44 80, 68 80, 84 70 C 80 76, 40 82, 30 72 Z" fill="#bdb2ec" />
        <rect x="56" y="54" width="18" height="13" rx="3.5" fill="#bdb2ec" />
        <circle cx="62" cy="60.5" r="2.6" fill="#ff7ac8" />
        <circle cx="69" cy="60.5" r="2.6" fill="#ffd84a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="40" y="64" width="12" height="26" rx="5" fill="#d9d1fa" />
        <rect x="38" y="87" width="16" height="13" rx="5.5" fill="#8f78e0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="80" y="64" width="12" height="26" rx="5" fill="#d9d1fa" />
        <rect x="78" y="87" width="16" height="13" rx="5.5" fill="#8f78e0" />
      </g>
      <g className="zoo-head">
        <path d="M100 11 V 4" stroke="#8f78e0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="3.6" r="3.6" fill="#ffd84a" />
        <circle cx="100" cy="38" r="19" fill="#c98b4f" />
        <ellipse cx="85" cy="40" rx="6" ry="12" fill="#8c5a2b" transform="rotate(10 85 40)" />
        <ellipse cx="113" cy="45" rx="12" ry="9" fill="#f0cfa0" />
        <circle cx="106" cy="33" r="7" fill="#8c5a2b" />
        {EYE(106, 33, 3.8)}
        <ellipse cx="123" cy="41" rx="4.2" ry="3.2" fill="#2a1a2a" />
        <path d="M112 49 q 5 4 10 0" stroke="#8c5a2b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M115 51 q 2 5 5 1" fill="#ff7a8a" />
        <ellipse cx="98" cy="63" rx="20" ry="6" fill="#8f78e0" />
        <circle cx="100" cy="38" r="27" fill="#c5f7ff" opacity="0.14" />
        <circle cx="100" cy="38" r="27" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
        <path d="M82 28 C 86 20, 94 15, 102 14" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.85" />
      </g>
    </>
  ),
};

const moonCat: CreatureSpec = {
  name: "Månekat",
  height: 9,
  aspect: 100 / 90,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 100 90",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M16 54 C 1 52, 2 32, 10 25" stroke="#b9d9f5" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="10" cy="25" r="4.8" fill="#e6f2ff" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="18" y="62" width="9" height="24" rx="4.5" fill="#8fb3d9" />
        <ellipse cx="22.5" cy="86.5" rx="7.5" ry="3.5" fill="#8fb3d9" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="54" y="62" width="9" height="24" rx="4.5" fill="#8fb3d9" />
        <ellipse cx="58.5" cy="86.5" rx="7.5" ry="3.5" fill="#8fb3d9" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="40" cy="56" rx="29" ry="17" fill="#b9d9f5" />
        <ellipse cx="46" cy="66" rx="18" ry="8" fill="#e6f2ff" />
        <path d="M26 42 q 2 6 0 10 M36 40 q 2 6 0 11 M46 40 q 2 6 0 10" stroke="#8fb3d9" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="30" y="62" width="10" height="24" rx="5" fill="#b9d9f5" />
        <ellipse cx="35" cy="86.5" rx="8" ry="3.5" fill="#e6f2ff" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="64" y="62" width="10" height="24" rx="5" fill="#b9d9f5" />
        <ellipse cx="69" cy="86.5" rx="8" ry="3.5" fill="#e6f2ff" />
      </g>
      <g className="zoo-head">
        <path d="M82 24 L 90 9 L 95 29 Z" fill="#8fb3d9" />
        <path d="M88 14 C 88 8, 90 3, 93 0 C 96 5, 96 10, 94 15 Z" fill="#8fb3d9" />
        <circle cx="78" cy="38" r="18" fill="#b9d9f5" />
        <path d="M65 29 L 64 11 L 79 22 Z" fill="#b9d9f5" />
        <path d="M67 26 L 66.5 15 L 75 22 Z" fill="#ffb0c8" />
        <path d="M63 16 C 61 9, 59 4, 57 0 C 62 3, 67 8, 69 17 Z" fill="#b9d9f5" />
        <circle cx="79" cy="31" r="5.6" fill="#ffd84a" />
        <circle cx="81.4" cy="29.6" r="4.6" fill="#b9d9f5" />
        {EYE(70, 40, 3.4)}
        {EYE(85, 40, 3.8)}
        <ellipse cx="89" cy="48" rx="8" ry="6" fill="#e6f2ff" />
        <ellipse cx="94" cy="45" rx="2.6" ry="2" fill="#ff8fb0" />
        <path d="M87 50 q 3 3 6 0" stroke="#6f93b8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M92 48 L 99 46 M92 50 L 99 52" stroke="#6f93b8" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="73" cy="49" r="3.6" fill="#ff9fb8" opacity="0.55" />
      </g>
    </>
  ),
};

const antennaBeetle: CreatureSpec = {
  name: "Antennebille",
  height: 7,
  aspect: 110 / 70,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 110 70",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M30 52 L 26 68 M58 52 L 62 68" stroke="#5b37a8" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M44 52 L 48 68 M72 52 L 68 68" stroke="#5b37a8" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <path d="M8 54 C 8 28, 30 14, 50 14 C 72 14, 90 30, 87 54 Z" fill="#8a4fe0" />
        <path d="M9 46 C 30 52, 66 52, 87 44 L 87 54 L 8 54 Z" fill="#6b3fc4" />
        <path d="M50 14 C 53 28, 53 40, 50 52" stroke="#4a2a8a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="27" rx="12" ry="4.6" fill="#fff" opacity="0.42" transform="rotate(-28 32 27)" />
        <circle cx="30" cy="40" r="3.6" fill="#7ff3ff" />
        <circle cx="68" cy="37" r="3.6" fill="#ff7ac8" />
        <circle cx="40" cy="30" r="2.2" fill="#ffd84a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M38 52 L 34 68 M66 52 L 70 68" stroke="#6b3fc4" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M52 52 L 56 68 M79 51 L 76 68" stroke="#6b3fc4" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M96 35 C 100 24, 102 16, 100 9" stroke="#a47bf2" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M88 35 C 86 24, 77 15, 67 11" stroke="#a47bf2" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="8" r="7" fill="#7ff3ff" opacity="0.35" />
        <circle cx="100" cy="8" r="4.4" fill="#7ff3ff" />
        <circle cx="66" cy="11" r="7" fill="#ff7ac8" opacity="0.35" />
        <circle cx="66" cy="11" r="4.4" fill="#ff7ac8" />
        <circle cx="92" cy="47" r="13" fill="#6b3fc4" />
        <circle cx="96" cy="44" r="6.6" fill="#fff" />
        {EYE(97.5, 44, 4.2)}
        <path d="M90 55 q 6 4 12 -1" stroke="#2a1a55" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const robotDog: CreatureSpec = {
  name: "Robothund",
  height: 10,
  aspect: 130 / 100,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 130 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M26 46 L 17 36 L 21 24 L 12 15" stroke="#7a8ba0" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="12" r="8" fill="#ff7ac8" opacity="0.35" />
        <circle cx="11" cy="12" r="4.8" fill="#ff7ac8" />
      </g>
      <g className="zoo-leg zoo-leg-a">{robotBen(27, "#7a8ba0", "#5d6d82", "#ff9d1f")}</g>
      <g className="zoo-leg zoo-leg-b">{robotBen(72, "#7a8ba0", "#5d6d82", "#ff9d1f")}</g>
      <g className="zoo-torso">
        <rect x="22" y="38" width="70" height="32" rx="8" fill="#aab8c8" />
        <rect x="25" y="62" width="64" height="8" rx="4" fill="#7a8ba0" />
        <rect x="34" y="46" width="26" height="14" rx="4" fill="#dbe6f0" />
        <circle cx="39" cy="53" r="2" fill="#7a8ba0" />
        <circle cx="55" cy="53" r="2" fill="#7a8ba0" />
        <circle cx="47" cy="53" r="3.4" fill="#5ff0e6" />
        <circle cx="72" cy="50" r="3" fill="#ff9d1f" />
        <circle cx="82" cy="50" r="3" fill="#5ff0e6" />
      </g>
      <g className="zoo-leg zoo-leg-b">{robotBen(40, "#aab8c8", "#8a9bb0", "#ff9d1f")}</g>
      <g className="zoo-leg zoo-leg-a">{robotBen(85, "#aab8c8", "#8a9bb0", "#ff9d1f")}</g>
      <g className="zoo-head">
        <rect x="84" y="34" width="14" height="18" rx="4" fill="#7a8ba0" />
        <rect x="86" y="46" width="18" height="6" rx="3" fill="#ff9d1f" />
        <rect x="87" y="2" width="8" height="18" rx="3" fill="#7a8ba0" transform="rotate(-14 91 11)" />
        <rect x="88" y="14" width="38" height="34" rx="8" fill="#aab8c8" />
        <rect x="92" y="18" width="26" height="22" rx="6" fill="#1d2b3a" />
        <g className="zoo-eye">
          <circle cx="100" cy="27" r="4.2" fill="#5ff0e6" />
          <circle cx="101.4" cy="25.6" r="1.4" fill="#fff" />
        </g>
        <g className="zoo-eye">
          <circle cx="111" cy="27" r="4.2" fill="#5ff0e6" />
          <circle cx="112.4" cy="25.6" r="1.4" fill="#fff" />
        </g>
        <path d="M101 34 q 5 4 10 0" stroke="#5ff0e6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="118" y="26" width="10" height="18" rx="4" fill="#dbe6f0" />
        <circle cx="125" cy="31" r="2.8" fill="#1d2b3a" />
      </g>
    </>
  ),
};

const rockTroll: CreatureSpec = {
  name: "Stentrold",
  height: 16,
  aspect: 120 / 130,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 120 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="26" y="92" width="20" height="36" rx="7" fill="#6f7587" />
        <rect x="24" y="120" width="24" height="10" rx="5" fill="#6f7587" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="92" width="20" height="36" rx="7" fill="#6f7587" />
        <rect x="60" y="120" width="24" height="10" rx="5" fill="#6f7587" />
      </g>
      <g className="zoo-torso">
        {kryst(30, 52, 14, 28, -32, "#4fd8d8", "#2fb4b4")}
        {kryst(46, 40, 16, 34, -8, "#b97bff", "#8f55d9")}
        {kryst(64, 38, 12, 26, 16, "#ff7ac8", "#d956a6")}
        <path
          d="M14 90 C 6 64, 14 40, 36 32 C 52 26, 74 28, 88 40 C 100 52, 98 76, 94 98 C 80 104, 30 104, 14 90 Z"
          fill="#9aa0b0"
        />
        <ellipse cx="62" cy="76" rx="22" ry="18" fill="#b2b8c7" />
        <path d="M24 78 l 8 5 l -2 8 M50 92 l 6 -5 l 8 3" stroke="#6f7587" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M22 56 C 24 44, 38 34, 56 31 C 70 29, 84 37, 88 46 C 80 45, 76 51, 68 45 C 60 41, 54 47, 46 43 C 38 41, 32 53, 22 56 Z"
          fill="#6fcf6a"
        />
        <circle cx="36" cy="46" r="2.2" fill="#4fb04f" />
        <circle cx="60" cy="38" r="2.6" fill="#4fb04f" />
        <circle cx="78" cy="42" r="2" fill="#4fb04f" />
        <circle cx="26" cy="86" r="4" fill="#6fcf6a" />
        <circle cx="32" cy="92" r="2.6" fill="#6fcf6a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="40" y="94" width="20" height="34" rx="7" fill="#8d93a5" />
        <rect x="38" y="120" width="24" height="10" rx="5" fill="#8d93a5" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="76" y="94" width="20" height="34" rx="7" fill="#8d93a5" />
        <rect x="74" y="120" width="24" height="10" rx="5" fill="#8d93a5" />
      </g>
      <g className="zoo-head">
        <path
          d="M72 60 C 70 40, 86 32, 100 36 C 114 40, 118 58, 114 72 C 108 82, 84 82, 76 74 C 72 70, 72 64, 72 60 Z"
          fill="#b2b8c7"
        />
        <path d="M82 38 C 88 30, 102 30, 106 38 C 98 40, 92 36, 82 38 Z" fill="#6fcf6a" />
        <circle cx="94" cy="35" r="2" fill="#4fb04f" />
        <path d="M80 48 q 8 -5 16 0 M100 49 q 7 -4 13 1" stroke="#6f7587" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="89" cy="57" r="7" fill="#fff" />
        {EYE(90.5, 57, 4.4)}
        <circle cx="106" cy="59" r="6" fill="#fff" />
        {EYE(107.5, 59, 3.8)}
        <circle cx="87" cy="68" r="4" fill="#ff9fb8" opacity="0.55" />
        <path d="M95 70 q 8 7 18 -1" stroke="#4a4f60" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
      <path d="M70 66 C 80 76, 79 86, 74 94" stroke="#8d93a5" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="74" cy="96" r="7.5" fill="#a3a9b9" />
    </>
  ),
};

const mushroomAlien: CreatureSpec = {
  name: "Svampevæsen",
  height: 12,
  aspect: 100 / 130,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 100 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="37" y="96" width="10" height="31" rx="5" fill="#d9c9a8" />
        <ellipse cx="41" cy="126" rx="8.5" ry="4" fill="#d9c9a8" />
      </g>
      <path d="M38 80 C 28 84, 26 92, 28 99" stroke="#d9c9a8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g className="zoo-torso">
        <path d="M36 52 C 34 80, 30 92, 28 104 C 40 112, 62 112, 72 104 C 68 92, 66 78, 64 52 Z" fill="#f6ecd8" />
        <path d="M64 56 C 66 78, 68 92, 72 104 C 68 108, 62 110, 56 111 C 62 96, 62 78, 58 56 Z" fill="#e8dcc0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="55" y="98" width="11" height="29" rx="5.5" fill="#f6ecd8" />
        <ellipse cx="60.5" cy="126" rx="9.5" ry="4" fill="#f6ecd8" />
      </g>
      <path d="M62 80 C 72 82, 76 90, 74 97" stroke="#f6ecd8" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <g className="zoo-head">
        <ellipse cx="50" cy="59" rx="41" ry="5" fill="#1f8f87" />
        <path d="M4 56 C 4 22, 28 6, 52 6 C 78 6, 98 26, 96 56 C 80 62, 20 62, 4 56 Z" fill="#3fd0c4" />
        <path d="M6 50 C 24 58, 76 58, 94 50 C 95 53, 96 55, 96 56 C 80 62, 20 62, 4 56 C 4 54, 5 52, 6 50 Z" fill="#25a39a" />
        <ellipse cx="30" cy="19" rx="11" ry="4" fill="#fff" opacity="0.35" transform="rotate(-28 30 19)" />
        <circle cx="24" cy="36" r="9" fill="#fff6a8" opacity="0.35" />
        <circle cx="24" cy="36" r="6" fill="#fff6a8" />
        <circle cx="52" cy="23" r="8" fill="#fff6a8" opacity="0.35" />
        <circle cx="52" cy="23" r="5" fill="#fff6a8" />
        <circle cx="75" cy="34" r="10" fill="#ff9fe0" opacity="0.35" />
        <circle cx="75" cy="34" r="7" fill="#ff9fe0" />
        <circle cx="42" cy="44" r="3.5" fill="#fff6a8" />
        <circle cx="86" cy="49" r="3.4" fill="#fff6a8" />
        <circle cx="62" cy="44" r="3" fill="#ff9fe0" />
        {EYE(50, 72, 4)}
        {EYE(61, 72, 3.6)}
        <circle cx="62" cy="81" r="3" fill="#ff9fb8" opacity="0.6" />
        <path d="M47 82 q 5 5 10 0" stroke="#a8754a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const fuzzball: CreatureSpec = {
  name: "Fnugbold",
  height: 8,
  aspect: 100 / 90,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 100 90",
  art: (
    <>
      <g className="zoo-torso">
        <circle cx="50" cy="44" r="33" fill="#ff9ec5" />
        {FNUG_KANT.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill="#ff9ec5" />
        ))}
        <ellipse cx="36" cy="26" rx="11" ry="5" fill="#ffc8de" transform="rotate(-30 36 26)" />
        <path d="M24 54 l -5 -3 M22 40 l -5 1 M34 66 l -3 -5 M48 70 l 0 -5 M30 18 l -1 -5" stroke="#f06fa3" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="86" rx="9" ry="4" fill="#f06fa3" />
        <ellipse cx="62" cy="86" rx="9" ry="4" fill="#f06fa3" />
      </g>
      <g className="zoo-head">
        <circle cx="61" cy="40" r="12" fill="#fff" />
        {EYE(64, 40, 7)}
        <circle cx="80" cy="44" r="9" fill="#fff" />
        {EYE(82, 44, 5.4)}
        <circle cx="58" cy="57" r="4.4" fill="#ff5fa0" opacity="0.5" />
        <path d="M64 58 q 8 7 16 0" stroke="#b03a73" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  greyAlien,
  threeEye,
  spaceDog,
  moonCat,
  antennaBeetle,
  robotDog,
  rockTroll,
  mushroomAlien,
  fuzzball,
};
