import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige småkryb og fugle på bondegården. Samme stil som resten:
 * profil mod højre, bunden af viewBox = jorden, fjerne ben først, nære ben sidst.
 */

const mouse: CreatureSpec = {
  name: "Mus",
  height: 4.5,
  aspect: 100 / 56,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 100 56",
  art: (
    <>
      {/* lang tynd hale */}
      <path d="M24 42 C 10 44, 4 32, 10 20" stroke="#e3a9b0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="56" y="44" width="8" height="12" rx="4" fill="#868a93" />
        <ellipse cx="61" cy="54.5" rx="6.5" ry="2.5" fill="#e3a9b0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="28" cy="46" rx="9" ry="8" fill="#868a93" />
        <ellipse cx="29" cy="54.5" rx="8" ry="2.5" fill="#e3a9b0" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="46" cy="38" rx="28" ry="16" fill="#a9adb5" />
        <ellipse cx="50" cy="46" rx="20" ry="7" fill="#d6d8dd" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="44" width="8" height="12" rx="4" fill="#a9adb5" />
        <ellipse cx="69" cy="54.5" rx="6.5" ry="2.5" fill="#f0bcc2" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="38" cy="46" rx="10" ry="8.5" fill="#a9adb5" />
        <ellipse cx="39" cy="54.5" rx="8" ry="2.5" fill="#f0bcc2" />
      </g>
      <g className="zoo-head">
        <circle cx="78" cy="16" r="9" fill="#868a93" />
        <circle cx="78" cy="16" r="5.6" fill="#e3a9b0" />
        <path d="M66 42 C 66 28, 76 24, 88 32 C 92 35, 94 38, 94 40 C 90 46, 74 48, 66 42 Z" fill="#a9adb5" />
        <circle cx="68" cy="20" r="11" fill="#a9adb5" />
        <circle cx="68" cy="20" r="7" fill="#f0bcc2" />
        <circle cx="94.5" cy="38.5" r="3" fill="#e2808f" />
        <path d="M88 40 L 100 36 M88 42 L 100 43" stroke="#6f737b" strokeWidth="1" strokeLinecap="round" />
        {EYE(82, 33, 3)}
      </g>
    </>
  ),
};

/** Piggene lægges som tagrender af trekanter langs en halvcirkel. */
function piggeKurve(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  dybde: number,
  antal: number,
  fraGrader: number,
  tilGrader: number,
) {
  const punkter: string[] = [];
  for (let i = 0; i <= antal * 2; i++) {
    const t = i / (antal * 2);
    const v = ((fraGrader + (tilGrader - fraGrader) * t) * Math.PI) / 180;
    const k = i % 2 === 0 ? 1 : 1 - dybde;
    punkter.push(`${(cx + Math.cos(v) * rx * k).toFixed(1)},${(cy - Math.sin(v) * ry * k).toFixed(1)}`);
  }
  return punkter.join(" ");
}

const hedgehog: CreatureSpec = {
  name: "Pindsvin",
  height: 5,
  aspect: 124 / 76,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 124 76",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="72" cy="70" rx="9" ry="6.5" fill="#b89468" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="36" cy="70" rx="9" ry="6.5" fill="#b89468" />
      </g>
      <g className="zoo-torso">
        <polygon points={piggeKurve(54, 60, 46, 46, 0.16, 14, 188, -8)} fill="#5e3f28" />
        <polygon points={piggeKurve(54, 60, 40, 40, 0.18, 12, 182, -2)} fill="#7a5638" />
        <polygon points={piggeKurve(52, 60, 30, 30, 0.2, 9, 176, 6)} fill="#946b45" />
        <ellipse cx="54" cy="62" rx="42" ry="9" fill="#7a5638" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="82" cy="70" rx="9.5" ry="6.5" fill="#d9bb90" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="46" cy="70" rx="9.5" ry="6.5" fill="#d9bb90" />
      </g>
      <g className="zoo-head">
        <path d="M80 40 C 92 38, 104 46, 118 56 C 119 58, 118 60, 116 61 C 106 66, 90 68, 80 64 C 74 58, 74 46, 80 40 Z" fill="#ecd3ab" />
        <ellipse cx="88" cy="42" rx="7" ry="6" fill="#b89468" />
        <circle cx="118" cy="57.5" r="4" fill="#2b2420" />
        <circle cx="86" cy="60" r="5" fill="#f1a6b0" opacity="0.55" />
        {EYE(102, 53, 3.4)}
      </g>
    </>
  ),
};

const mole: CreatureSpec = {
  name: "Muldvarp",
  height: 5,
  aspect: 112 / 60,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 112 60",
  art: (
    <>
      <circle cx="14" cy="38" r="5" fill="#2c2932" />
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="62" cy="54" rx="13" ry="7" fill="#d98e8c" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="30" cy="54" rx="11" ry="6" fill="#d98e8c" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="50" cy="36" rx="36" ry="22" fill="#3a3640" />
        <ellipse cx="46" cy="28" rx="22" ry="9" fill="#4c4755" opacity="0.8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="74" cy="52" rx="12" ry="8" fill="#f0b5b0" />
        <ellipse cx="42" cy="55" rx="12" ry="5" fill="#f0b5b0" />
      </g>
      <g className="zoo-head">
        <ellipse cx="82" cy="34" rx="17" ry="14" fill="#3a3640" />
        <path d="M92 30 C 100 28, 106 32, 110 36 C 106 42, 98 44, 92 42 Z" fill="#f0b5b0" />
        <circle cx="110" cy="36.5" r="3.4" fill="#e2808f" />
        {EYE(88, 28, 2.4)}
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="86" cy="51" rx="13" ry="8" transform="rotate(-8 86 51)" fill="#f7c4bf" />
        <path d="M95 46 L 105 47 M97 51 L 108 53 M95 56 L 105 58" stroke="#fff6e8" strokeWidth="3" strokeLinecap="round" />
        <path d="M76 52 C 82 56, 90 56, 94 53" stroke="#d98e8c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const stork: CreatureSpec = {
  name: "Stork",
  height: 22,
  aspect: 160 / 220,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 160 220",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="116" width="4.5" height="100" rx="2" fill="#c23a2e" />
        <path d="M66 217 L 86 217 L 90 220 L 66 220 Z" fill="#c23a2e" />
      </g>
      <g className="zoo-torso">
        <path d="M14 98 L 4 90 L 18 82 Z" fill="#2b2b30" />
        <ellipse cx="54" cy="98" rx="40" ry="25" fill="#fbfaf6" />
        <ellipse cx="62" cy="112" rx="26" ry="10" fill="#e9e6de" />
        <path d="M32 84 C 52 76, 80 82, 90 98 C 72 118, 40 122, 12 112 C 22 104, 28 96, 32 84 Z" fill="#eeebe3" />
        <path d="M12 112 C 40 122, 72 118, 90 98 C 78 108, 50 110, 24 104 Z" fill="#2b2b30" />
        <path d="M40 90 C 54 86, 68 90, 76 98" stroke="#d6d2c8" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="56" y="118" width="5" height="98" rx="2" fill="#e0483a" />
        <path d="M52 217 L 74 217 L 78 220 L 52 220 Z" fill="#e0483a" />
      </g>
      <g className="zoo-head">
        <path d="M84 92 C 100 90, 90 66, 98 46" stroke="#fbfaf6" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M84 92 C 100 90, 90 66, 98 46" stroke="#e9e6de" strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(-4 4)" opacity="0.7" />
        <circle cx="100" cy="36" r="11" fill="#fbfaf6" />
        <path d="M105 31 L 158 41 L 106 47 Z" fill="#e0483a" />
        <path d="M105 40 L 158 41 L 106 47 Z" fill="#c23a2e" />
        {EYE(101, 33, 3.2)}
      </g>
    </>
  ),
};

const swallow: CreatureSpec = {
  name: "Svale",
  height: 5,
  aspect: 120 / 66,
  gait: "float",
  zone: "open",
  pace: 1.3,
  viewBox: "0 0 120 66",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.12s" } as CSSProperties}>
        <path d="M80 40 C 72 20, 48 6, 14 2 C 28 16, 36 32, 52 46 Z" fill="#1b2f5e" />
        <path d="M82 38 C 80 22, 66 8, 44 0 C 46 16, 54 30, 68 44 Z" fill="#2c4a8c" />
      </g>
      <path d="M40 44 L 4 36 L 22 46 L 6 62 L 42 52 Z" fill="#1f3668" />
      <g className="zoo-torso">
        <ellipse cx="64" cy="46" rx="30" ry="13" fill="#2c4a8c" transform="rotate(-6 64 46)" />
        <ellipse cx="68" cy="54" rx="24" ry="7" fill="#f8f4ea" transform="rotate(-6 68 54)" />
      </g>
      <g className="zoo-head">
        <circle cx="92" cy="40" r="12" fill="#2c4a8c" />
        <path d="M92 42 C 98 36, 108 38, 106 46 C 100 52, 92 52, 90 48 Z" fill="#c93f2f" />
        <path d="M103 41 L 114 45 L 103 47 Z" fill="#2b2420" />
        {EYE(93, 37, 2.8)}
      </g>
    </>
  ),
};

const honeyBee: CreatureSpec = {
  name: "Honningbi",
  height: 4,
  aspect: 72 / 54,
  gait: "float",
  zone: "open",
  pace: 1.2,
  viewBox: "0 0 72 54",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.08s" } as CSSProperties}>
        <ellipse cx="26" cy="14" rx="15" ry="9" transform="rotate(-24 26 14)" fill="#e4f4fb" fillOpacity="0.8" stroke="#a9d3e6" strokeWidth="1" />
        <ellipse cx="40" cy="12" rx="13" ry="8" transform="rotate(-8 40 12)" fill="#f3fbff" fillOpacity="0.85" stroke="#a9d3e6" strokeWidth="1" />
      </g>
      <path d="M26 48 L 24 53 M36 49 L 36 54 M46 47 L 48 52" stroke="#3a2a1c" strokeWidth="2.2" strokeLinecap="round" />
      <g className="zoo-torso">
        <ellipse cx="32" cy="32" rx="24" ry="18" fill="#f5c52e" />
        <ellipse cx="30" cy="22" rx="20" ry="6" fill="#fbe27a" opacity="0.6" />
        {/* Striber, der følger kroppens omrids. */}
        <path d="M16 18.6 A 24 18 0 0 1 23 15.3 L 23 48.7 A 24 18 0 0 1 16 45.4 Z" fill="#3a2a1c" />
        <path d="M30 14.1 A 24 18 0 0 1 37 14.4 L 37 49.6 A 24 18 0 0 1 30 49.9 Z" fill="#3a2a1c" />
        <path d="M8 31.5 A 24 18 0 0 1 7 32 L 7 32 A 24 18 0 0 1 8 32.5 Z" fill="#3a2a1c" />
        <circle cx="8.5" cy="33" r="2.4" fill="#3a2a1c" />
      </g>
      <g className="zoo-head">
        <path d="M58 20 C 58 12, 62 8, 66 7 M62 22 C 64 14, 68 12, 71 12" stroke="#3a2a1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="66" cy="7" r="1.8" fill="#3a2a1c" />
        <circle cx="71" cy="12" r="1.8" fill="#3a2a1c" />
        <circle cx="58" cy="32" r="12" fill="#4a3624" />
        <circle cx="54" cy="38" r="3.6" fill="#f09d8a" opacity="0.7" />
        <path d="M60 38 C 63 41, 67 40, 68 37" stroke="#fff3d6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="62" cy="29" r="4.6" fill="#fff" />
        {EYE(62.5, 29.5, 3)}
      </g>
    </>
  ),
};

const snail: CreatureSpec = {
  name: "Snegl",
  height: 5,
  aspect: 110 / 66,
  gait: "slither",
  pace: 0.4,
  viewBox: "0 0 110 66",
  art: (
    <>
      <g className="zoo-seg" style={{ "--i": 0 } as CSSProperties}>
        <path d="M2 66 C 10 58, 22 56, 34 56 L 34 66 Z" fill="#e8d9ba" />
      </g>
      <g className="zoo-seg" style={{ "--i": 1 } as CSSProperties}>
        <path d="M30 66 L 30 56 C 50 54, 70 54, 86 54 L 90 66 Z" fill="#efe3c8" />
        <path d="M30 62 L 90 62 L 90 66 L 30 66 Z" fill="#dccaa3" />
        <circle cx="46" cy="32" r="28" fill="#c9743a" />
        <circle cx="46" cy="32" r="28" fill="none" stroke="#a85a28" strokeWidth="3" />
        <path d="M46 32 C 46 28, 52 28, 52 33 C 52 41, 40 42, 38 33 C 36 22, 52 17, 58 26 C 64 38, 54 50, 40 47 C 28 44, 22 28, 30 18 C 38 8, 56 8, 64 18" stroke="#f0a95e" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M30 50 C 38 56, 52 58, 62 54" stroke="#a85a28" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
      <g className="zoo-seg zoo-head" style={{ "--i": 2 } as CSSProperties}>
        <path d="M80 66 C 82 50, 82 42, 84 34 L 100 34 C 102 44, 102 54, 106 62 C 106 65, 104 66, 100 66 Z" fill="#efe3c8" />
        <path d="M89 34 C 88 22, 86 14, 84 8 M97 34 C 98 22, 100 14, 102 8" stroke="#d8c7a0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="7" r="3" fill="#d8c7a0" />
        <circle cx="102" cy="7" r="3" fill="#d8c7a0" />
        <circle cx="94" cy="38" r="9" fill="#efe3c8" />
        <circle cx="90" cy="45" r="3" fill="#f2b0a0" opacity="0.6" />
        {EYE(97, 35, 3)}
        <path d="M97 43 C 100 46, 103 45, 104 42" stroke="#a88f68" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/** Kålsommerfuglens ene vingehalvdel (den anden er spejlet om kroppen). */
const kaalVinger = (
  <>
    <path d="M46 40 C 40 22, 48 4, 68 4 C 80 6, 76 24, 58 40 Z" fill="#fbfbf6" />
    <path d="M48 41 C 30 38, 14 24, 20 16 C 30 12, 46 24, 54 40 Z" fill="#f2f2e4" />
    <path d="M52 8 C 58 2, 74 2, 77 10 C 72 14, 58 13, 52 8 Z" fill="#33323a" />
    <circle cx="60" cy="25" r="3.2" fill="#33323a" />
    <path d="M46 40 C 44 34, 44 30, 46 26" stroke="#d9d7b8" strokeWidth="1.5" fill="none" />
  </>
);

const cabbageWhite: CreatureSpec = {
  name: "Kålsommerfugl",
  height: 5,
  aspect: 90 / 80,
  gait: "float",
  zone: "open",
  pace: 0.9,
  viewBox: "0 0 90 80",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.4s" } as CSSProperties}>
        {kaalVinger}
        <g transform="matrix(1 0 0 -1 0 80)">{kaalVinger}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="50" cy="40" rx="22" ry="3.4" fill="#4a4a52" />
      </g>
      <g className="zoo-head">
        <circle cx="74" cy="40" r="5.4" fill="#4a4a52" />
        <path d="M76 36 C 80 30, 84 28, 88 24 M76 44 C 80 50, 84 52, 88 56" stroke="#4a4a52" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="88" cy="24" r="2" fill="#4a4a52" />
        <circle cx="88" cy="56" r="2" fill="#4a4a52" />
        {EYE(76, 39, 2.2)}
      </g>
    </>
  ),
};

export const yetMore: Record<string, CreatureSpec> = {
  mouse,
  hedgehog,
  mole,
  stork,
  swallow,
  honeyBee,
  snail,
  cabbageWhite,
};
