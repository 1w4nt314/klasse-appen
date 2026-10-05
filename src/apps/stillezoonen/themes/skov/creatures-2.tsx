import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Almindelige små skovdyr i Den danske skov: pindsvin, mus, tudse, firben,
 * eghjort og vinbjergsnegl. Profil mod højre, bunden af viewBox = jorden,
 * fjerne ben først, nære ben sidst.
 */

/** Pigge lægges som trekanter langs en halvcirkel (spids/dal skiftevis). */
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

/** Rygkam: en række bløde pukler langs en vandret grundlinje. */
function rygKam(x0: number, x1: number, grundY: number, antal: number, hoejde: number) {
  const b = (x1 - x0) / antal;
  let d = `M${x0} ${grundY}`;
  for (let i = 0; i < antal; i++) {
    const xa = x0 + i * b;
    d += ` Q ${+(xa + b * 0.5).toFixed(2)} ${+(grundY - hoejde * 2).toFixed(2)} ${+(xa + b).toFixed(2)} ${grundY}`;
  }
  return d + " Z";
}

/* ------------------------------------------------------------------ */
/* Pindsvin                                                            */
/* ------------------------------------------------------------------ */

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
        <ellipse cx="72" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="36" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g className="zoo-torso">
        {/* tre lag pigge, mørkest bagerst, med lyse spidser i øverste lag */}
        <polygon points={piggeKurve(54, 60, 46, 46, 0.16, 14, 188, -8)} fill="#553923" />
        <polygon points={piggeKurve(54, 60, 40, 40, 0.18, 12, 182, -2)} fill="#74502f" />
        <polygon points={piggeKurve(52, 60, 31, 31, 0.2, 9, 176, 6)} fill="#946a42" />
        <polygon points={piggeKurve(50, 60, 20, 18, 0.22, 6, 170, 12)} fill="#b08555" />
        <ellipse cx="54" cy="62" rx="42" ry="9" fill="#74502f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="82" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="46" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g className="zoo-head">
        {/* panden dækket af små pigge */}
        <path
          d="M80 40 C 92 38, 104 46, 118 56 C 119 58, 118 60, 116 61 C 106 66, 90 68, 80 64 C 74 58, 74 46, 80 40 Z"
          fill="#f0dab5"
        />
        <polygon points={piggeKurve(86, 50, 14, 12, 0.3, 4, 150, 40)} fill="#74502f" />
        <ellipse cx="90" cy="43" rx="6" ry="5.5" fill="#b08a5e" />
        <ellipse cx="90" cy="43.5" rx="3.2" ry="3" fill="#e9a9a6" />
        <circle cx="118" cy="57.5" r="4" fill="#2b2420" />
        <circle cx="119.4" cy="56.2" r="1.1" fill="#fff" />
        <circle cx="94" cy="60" r="5" fill="#f1a6b0" opacity="0.55" />
        <path d="M104 62 C 108 65, 112 65, 114 63" stroke="#a88a62" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {EYE(103, 52, 3.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Skovmus: gyldenbrun, store ører og øjne, lang hale                  */
/* ------------------------------------------------------------------ */

const woodMouse: CreatureSpec = {
  name: "Skovmus",
  height: 3.5,
  aspect: 122 / 56,
  gait: "walk",
  pace: 1.3,
  viewBox: "-22 0 122 56",
  art: (
    <>
      {/* lang hale */}
      <path
        d="M26 44 C 8 52, -6 46, -12 34 C -17 24, -15 14, -8 10"
        stroke="#d9a98c"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <g className="zoo-leg zoo-leg-a">
        <rect x="56" y="44" width="8" height="12" rx="4" fill="#a8742f" />
        <ellipse cx="61" cy="54.5" rx="6.5" ry="2.5" fill="#e8bfa2" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="28" cy="46" rx="9" ry="8" fill="#a8742f" />
        <ellipse cx="29" cy="54.5" rx="8" ry="2.5" fill="#e8bfa2" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="46" cy="38" rx="28" ry="16" fill="#d29a4f" />
        <ellipse cx="44" cy="30" rx="20" ry="6" fill="#e2b46c" opacity="0.7" />
        <ellipse cx="50" cy="46" rx="20" ry="7" fill="#f8ecd2" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="44" width="8" height="12" rx="4" fill="#d29a4f" />
        <ellipse cx="69" cy="54.5" rx="6.5" ry="2.5" fill="#f2cdb4" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="38" cy="46" rx="10" ry="8.5" fill="#d29a4f" />
        <ellipse cx="39" cy="54.5" rx="8" ry="2.5" fill="#f2cdb4" />
      </g>
      <g className="zoo-head">
        {/* store ører */}
        <circle cx="80" cy="14" r="10.5" fill="#a8742f" />
        <circle cx="80" cy="14" r="6.8" fill="#eeb6a4" />
        <path d="M66 42 C 66 28, 76 24, 88 32 C 92 35, 94 38, 94 40 C 90 46, 74 48, 66 42 Z" fill="#d29a4f" />
        <circle cx="67" cy="18" r="12.5" fill="#d29a4f" />
        <circle cx="67" cy="18" r="8.2" fill="#f2bfae" />
        <circle cx="94.5" cy="38.5" r="3" fill="#d97a82" />
        <path d="M88 40 L 100 36 M88 42 L 100 43" stroke="#8a5d24" strokeWidth="1" strokeLinecap="round" />
        {/* store øjne */}
        {EYE(82, 33, 4.3)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Hasselmus: orange-gylden, stor busket hale, sort øje                */
/* ------------------------------------------------------------------ */

const dormouse: CreatureSpec = {
  name: "Hasselmus",
  height: 3.5,
  aspect: 100 / 58,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 100 58",
  art: (
    <>
      {/* stor busket hale, buet op over ryggen */}
      <path
        d="M34 46 C 12 52, -2 38, 2 22 C 5 10, 16 4, 26 8 C 17 14, 17 26, 26 31 C 32 34, 38 36, 38 41 Z"
        fill="#dd8a2e"
      />
      <path d="M32 42 C 14 46, 7 32, 9 22 C 11 14, 16 10, 22 9" stroke="#f4c470" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M3 24 l 4 1 M5 14 l 4 3 M13 6 l 2 4" stroke="#c97620" strokeWidth="1.8" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="56" y="48" width="8" height="10" rx="4" fill="#cf8a34" />
        <ellipse cx="61" cy="56.6" rx="6" ry="2.2" fill="#f6dba4" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="38" cy="50" rx="8" ry="7" fill="#cf8a34" />
        <ellipse cx="39" cy="56.6" rx="7" ry="2.2" fill="#f6dba4" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="52" cy="40" rx="25" ry="17" fill="#e9a343" />
        <ellipse cx="50" cy="31" rx="17" ry="5.5" fill="#f2bb62" opacity="0.7" />
        <ellipse cx="57" cy="49" rx="16" ry="7" fill="#fbe8c0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="48" width="8" height="10" rx="4" fill="#e9a343" />
        <ellipse cx="69" cy="56.6" rx="6" ry="2.2" fill="#fbe8c0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="46" cy="50" rx="9" ry="7.5" fill="#e9a343" />
        <ellipse cx="47" cy="56.6" rx="7.5" ry="2.2" fill="#fbe8c0" />
      </g>
      <g className="zoo-head">
        {/* små runde ører */}
        <circle cx="70" cy="22" r="6.5" fill="#cf8a34" />
        <circle cx="70.5" cy="22.5" r="3.7" fill="#f1b9a0" />
        <circle cx="76" cy="36" r="14.5" fill="#eeab4a" />
        <ellipse cx="86" cy="40" rx="8.5" ry="6.4" fill="#fbe8c0" />
        <circle cx="93" cy="38.5" r="2.7" fill="#d97a82" />
        <circle cx="72" cy="42" r="3.6" fill="#f1a08a" opacity="0.55" />
        <path d="M86 43 C 88 45, 91 45, 92 43" stroke="#a8742f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M88 39 L 99 35 M88 41 L 99 42" stroke="#a8742f" strokeWidth="0.9" strokeLinecap="round" />
        {EYE(81, 32, 4.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Spidsmus: grå-brun, meget spids snude, bitte øjne                   */
/* ------------------------------------------------------------------ */

const shrew: CreatureSpec = {
  name: "Spidsmus",
  height: 3,
  aspect: 120 / 48,
  gait: "walk",
  pace: 1.4,
  viewBox: "0 0 120 48",
  art: (
    <>
      {/* kort, tyk hale */}
      <path d="M24 32 C 14 32, 8 28, 3 20" stroke="#a89886" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="34" width="6" height="13" rx="3" fill="#6f655a" />
        <ellipse cx="55.5" cy="46.2" rx="5" ry="1.8" fill="#e3a9a4" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="28" cy="36" rx="7" ry="7" fill="#6f655a" />
        <ellipse cx="29" cy="46.2" rx="6.5" ry="1.8" fill="#e3a9a4" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="46" cy="29" rx="28" ry="13" fill="#8f8274" />
        <ellipse cx="46" cy="22" rx="19" ry="4.6" fill="#a39686" opacity="0.8" />
        <ellipse cx="50" cy="36" rx="19" ry="5" fill="#c9bfb0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="34" width="6" height="13" rx="3" fill="#8f8274" />
        <ellipse cx="65.5" cy="46.2" rx="5" ry="1.8" fill="#eeb8b2" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="38" cy="36" rx="7.5" ry="7.5" fill="#8f8274" />
        <ellipse cx="39" cy="46.2" rx="6.5" ry="1.8" fill="#eeb8b2" />
      </g>
      <g className="zoo-head">
        {/* lille øre næsten gemt i pelsen */}
        <circle cx="66" cy="19" r="4.4" fill="#6f655a" />
        <circle cx="66" cy="19.2" r="2.4" fill="#e3a9a4" />
        {/* hoved med meget lang, spids snude */}
        <path
          d="M62 36 C 60 22, 72 18, 84 24 C 96 29, 106 32, 115 35 C 117 36, 116 38, 113 38.6 C 100 40, 84 42, 72 42 C 66 42, 63 40, 62 36 Z"
          fill="#8f8274"
        />
        <path d="M84 36 C 94 38, 104 38, 112 38" stroke="#c9bfb0" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="115.5" cy="36" r="2.6" fill="#e0868f" />
        <path d="M106 34 L 118 29 M106 36 L 119 34" stroke="#5f564c" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="68" cy="37" r="3.4" fill="#e9a9a4" opacity="0.5" />
        {/* bitte øje */}
        {EYE(88, 29, 2)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Skrubtudse: brun-oliven med vorter og gyldne øjne                    */
/* ------------------------------------------------------------------ */

const toad: CreatureSpec = {
  name: "Skrubtudse",
  height: 4,
  aspect: 104 / 62,
  gait: "hop",
  pace: 0.9,
  viewBox: "0 0 104 62",
  art: (
    <>
      {/* fjern forfod */}
      <ellipse cx="62" cy="59.4" rx="8" ry="2.6" fill="#6e5e36" />
      <g className="zoo-torso">
        <ellipse cx="46" cy="38" rx="36" ry="22" fill="#8e7a48" />
        <ellipse cx="46" cy="27" rx="28" ry="10" fill="#7f6d3d" />
        <ellipse cx="58" cy="52" rx="26" ry="7" fill="#d9ca9a" />
        {/* vorter */}
        <circle cx="26" cy="26" r="3.2" fill="#665528" />
        <circle cx="38" cy="20" r="2.6" fill="#665528" />
        <circle cx="50" cy="24" r="3.4" fill="#665528" />
        <circle cx="62" cy="19" r="2.4" fill="#665528" />
        <circle cx="44" cy="33" r="2.2" fill="#665528" />
        <circle cx="20" cy="38" r="2.4" fill="#665528" />
        <circle cx="56" cy="34" r="2.6" fill="#665528" />
        <circle cx="25.4" cy="25" r="1" fill="#b3a06a" />
        <circle cx="49.4" cy="23" r="1.1" fill="#b3a06a" />
        <circle cx="37.6" cy="19.2" r="0.9" fill="#b3a06a" />
        <circle cx="55.5" cy="33" r="0.9" fill="#b3a06a" />
        {/* bagben */}
        <ellipse cx="30" cy="46" rx="18" ry="13" fill="#8e7a48" />
        <path d="M16 44 C 18 34, 32 32, 42 40" stroke="#665528" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="42" r="2.4" fill="#665528" />
        <ellipse cx="22" cy="58.6" rx="15" ry="3.4" fill="#7d6a3b" />
      </g>
      {/* nær forfod */}
      <rect x="68" y="48" width="9" height="12" rx="4.5" fill="#8e7a48" />
      <ellipse cx="74" cy="59.4" rx="9" ry="2.6" fill="#7d6a3b" />
      <g className="zoo-head">
        <path
          d="M64 36 C 64 24, 80 20, 92 28 C 99 33, 101 40, 98 46 C 92 52, 74 53, 66 48 C 63 45, 64 40, 64 36 Z"
          fill="#8e7a48"
        />
        {/* øjenvulst med guldøje */}
        <circle cx="78" cy="22" r="10" fill="#7f6d3d" />
        <circle cx="79" cy="21" r="7" fill="#f0bd2c" />
        <ellipse cx="79.6" cy="21.4" rx="4.4" ry="2.9" fill="#1d1a17" />
        <circle cx="81.4" cy="19.4" r="1.7" fill="#fff" />
        <ellipse cx="72" cy="31" rx="6" ry="3.4" fill="#665528" opacity="0.7" />
        <path d="M99 42 C 90 46, 78 46, 70 43" stroke="#5a4a24" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="94" cy="32" r="1.3" fill="#4d3f1d" />
        <circle cx="84" cy="43" r="4" fill="#e6a090" opacity="0.5" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Lille vandsalamander: brun, orange plettet mave, bølget rygkam      */
/* ------------------------------------------------------------------ */

const newtKrop =
  "M4 33 C 18 30, 34 25, 52 24 L 100 24 C 110 21, 120 24, 126 30 C 128 33, 127 36, 122 38 C 112 42, 104 41, 98 41 L 52 41 C 34 40, 18 37, 4 33 Z";

const newt: CreatureSpec = {
  name: "Lille vandsalamander",
  height: 3,
  aspect: 130 / 46,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 130 46",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M86 38 L 82 43 L 76 45" stroke="#7a5a32" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M30 38 L 34 43 L 28 45" stroke="#7a5a32" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        {/* bølget rygkam bag kroppen */}
        <path d={rygKam(38, 98, 25, 8, 7)} fill="#a98456" />
        <path d={rygKam(8, 38, 31, 3, 4)} fill="#a98456" transform="translate(0 -1)" />
        <path d={newtKrop} fill="#8a6a3c" />
        <Klip form={<path d={newtKrop} />}>
          {/* orange mave med mørke pletter */}
          <path d="M0 35 C 30 32, 60 34, 90 33 C 106 32, 120 33, 130 32 L 130 46 L 0 46 Z" fill="#f08a2a" />
          <circle cx="22" cy="37" r="1.5" fill="#5a3a1c" />
          <circle cx="38" cy="38" r="1.7" fill="#5a3a1c" />
          <circle cx="54" cy="37.5" r="1.6" fill="#5a3a1c" />
          <circle cx="70" cy="38.5" r="1.8" fill="#5a3a1c" />
          <circle cx="86" cy="38" r="1.6" fill="#5a3a1c" />
          <circle cx="102" cy="37" r="1.5" fill="#5a3a1c" />
          <circle cx="116" cy="36" r="1.3" fill="#5a3a1c" />
          {/* mørke pletter på ryggen */}
          <circle cx="46" cy="29" r="1.5" fill="#5e4524" />
          <circle cx="64" cy="28" r="1.7" fill="#5e4524" />
          <circle cx="80" cy="28.6" r="1.5" fill="#5e4524" />
          <circle cx="94" cy="28" r="1.4" fill="#5e4524" />
        </Klip>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M92 38 L 98 43 L 92 45" stroke="#8a6a3c" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M40 38 L 44 43 L 38 45" stroke="#8a6a3c" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <path d="M112 37 C 118 40, 123 38, 125 35" stroke="#5a3a1c" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <circle cx="113" cy="35.5" r="2.6" fill="#f1a08a" opacity="0.55" />
        {EYE(116, 29, 3)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Skovfirben: brun-grøn med mørke prikker, lang hale                  */
/* ------------------------------------------------------------------ */

const lizard: CreatureSpec = {
  name: "Skovfirben",
  height: 3,
  aspect: 150 / 46,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 150 46",
  art: (
    <>
      {/* lang hale */}
      <path d="M54 22 C 36 22, 18 28, 2 38 C 20 42, 40 38, 56 34 Z" fill="#857640" />
      <path d="M52 26 C 36 27, 20 31, 6 37" stroke="#a89b5a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="32" r="1.6" fill="#4a3d22" />
      <circle cx="16" cy="37" r="1.3" fill="#4a3d22" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M92 32 L 84 38 L 90 43" stroke="#6b5e30" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="92" cy="43.5" r="2.8" fill="#6b5e30" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M60 32 L 54 38 L 60 43" stroke="#6b5e30" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="62" cy="43.5" r="2.8" fill="#6b5e30" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="84" cy="27" rx="34" ry="12" fill="#8c7c44" />
        <path d="M54 20 C 70 14, 100 14, 114 20" stroke="#b3a562" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M54 32 C 70 38, 98 38, 114 32 C 100 34, 70 34, 54 32 Z" fill="#d8d8a0" />
        <circle cx="66" cy="23" r="2.3" fill="#4a3d22" />
        <circle cx="78" cy="24.5" r="2.5" fill="#4a3d22" />
        <circle cx="90" cy="23.5" r="2.4" fill="#4a3d22" />
        <circle cx="102" cy="24.5" r="2.2" fill="#4a3d22" />
        <circle cx="72" cy="30" r="1.6" fill="#5f5230" />
        <circle cx="86" cy="30.5" r="1.7" fill="#5f5230" />
        <circle cx="98" cy="30" r="1.5" fill="#5f5230" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M100 32 L 108 38 L 116 42" stroke="#8c7c44" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="118" cy="43.5" r="3" fill="#8c7c44" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M68 32 L 74 38 L 80 42" stroke="#8c7c44" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="82" cy="43.5" r="3" fill="#8c7c44" />
      </g>
      <g className="zoo-head">
        <path
          d="M108 20 C 118 16, 134 20, 145 28 C 147 30, 146 32, 143 33 C 130 37, 118 37, 108 33 C 104 29, 104 23, 108 20 Z"
          fill="#9a8a4e"
        />
        <path d="M110 34 C 120 37, 132 36, 142 32" stroke="#d8d8a0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M128 30 C 133 31, 138 30, 141 28" stroke="#4a3d22" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="118" cy="22" r="1.5" fill="#4a3d22" />
        {EYE(126, 24, 3)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Eghjort: stor mørkebrun bille med røde gevir-kæber                  */
/* ------------------------------------------------------------------ */

const stagBeetle: CreatureSpec = {
  name: "Eghjort",
  height: 4,
  aspect: 124 / 66,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 124 66",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-b">
        <path d="M32 46 L 24 56 L 28 65" stroke="#2c180e" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 48 L 58 58 L 62 65" stroke="#2c180e" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M82 46 L 90 55 L 96 64" stroke="#2c180e" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        {/* dækvinger */}
        <path d="M14 50 C 10 24, 36 10, 62 14 C 78 16, 88 28, 88 50 Z" fill="#4b2a1a" />
        <path d="M24 28 C 34 18, 52 16, 66 20" stroke="#74462d" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M50 15 C 56 26, 58 38, 56 50" stroke="#2f180d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M14 50 L 88 50" stroke="#33190d" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* nære ben */}
      <g className="zoo-leg zoo-leg-a">
        <path d="M24 48 L 14 57 L 18 65" stroke="#3a2012" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 50 L 46 58 L 50 65" stroke="#3a2012" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M74 48 L 80 57 L 86 65" stroke="#3a2012" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        {/* forbryst */}
        <path d="M80 22 C 92 18, 100 24, 100 36 L 98 50 L 82 50 C 78 40, 76 30, 80 22 Z" fill="#3b2113" />
        <path d="M82 26 C 88 22, 94 24, 96 28" stroke="#5c3a24" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* hoved */}
        <ellipse cx="102" cy="38" rx="13" ry="12" fill="#4b2a1a" />
        <circle cx="96" cy="46" r="3.6" fill="#e6808a" opacity="0.45" />
        {/* følehorn */}
        <path d="M108 28 C 110 22, 108 16, 104 12" stroke="#2c180e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M104 12 l -3 -2 M104 12 l -1 -4 M104 12 l 2 -4" stroke="#2c180e" strokeWidth="2" strokeLinecap="round" />
        {/* røde gevir-kæber */}
        <path d="M110 40 C 118 44, 122 34, 120 22" stroke="#9c2c1c" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M112 46 C 122 48, 124 38, 123 28" stroke="#d24a30" strokeWidth="5.4" fill="none" strokeLinecap="round" />
        <path d="M121 40 L 115 36 M123 30 L 117 26" stroke="#d24a30" strokeWidth="3.4" strokeLinecap="round" />
        {EYE(104, 33, 3.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Vinbjergsnegl: cremebrunt spiralhus, lysegrå krop med følehorn      */
/* ------------------------------------------------------------------ */

const romanSnail: CreatureSpec = {
  name: "Vinbjergsnegl",
  height: 4,
  aspect: 124 / 78,
  gait: "slither",
  pace: 0.4,
  viewBox: "0 0 124 78",
  art: (
    <>
      <g className="zoo-seg" style={{ "--i": 0 } as CSSProperties}>
        <path d="M2 78 C 10 70, 22 68, 36 68 L 36 78 Z" fill="#c9c9c0" />
      </g>
      <g className="zoo-seg" style={{ "--i": 1 } as CSSProperties}>
        <path d="M32 78 L 32 67 C 54 65, 74 65, 90 65 L 94 78 Z" fill="#d9d9d0" />
        <path d="M32 74 L 92 74 L 94 78 L 32 78 Z" fill="#bdbdb2" />
        {/* hus: stor cremebrun spiral */}
        <circle cx="52" cy="38" r="32" fill="#dcc596" />
        <circle cx="52" cy="38" r="32" fill="none" stroke="#b8935f" strokeWidth="3" />
        <path
          d="M52 38 C 52 33, 59 33, 59 39 C 59 48, 45 49, 43 39 C 41 27, 59 22, 66 31 C 73 44, 61 57, 45 54 C 31 50, 24 33, 33 21 C 42 9, 63 9, 72 21"
          stroke="#c39f68"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M52 38 C 52 33, 59 33, 59 39 C 59 48, 45 49, 43 39 C 41 27, 59 22, 66 31 C 73 44, 61 57, 45 54 C 31 50, 24 33, 33 21 C 42 9, 63 9, 72 21"
          stroke="#a9824f"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          transform="translate(1 2)"
          opacity="0.7"
        />
        <path d="M32 58 C 42 66, 58 68, 70 62" stroke="#a9824f" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M30 18 C 38 10, 48 7, 58 8" stroke="#f1e2bd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
      <g className="zoo-seg zoo-head" style={{ "--i": 2 } as CSSProperties}>
        <path d="M84 78 C 87 62, 87 54, 89 46 L 106 46 C 108 56, 108 68, 114 74 C 114 77, 111 78, 106 78 Z" fill="#d9d9d0" />
        {/* følehorn */}
        <path d="M94 46 C 93 34, 90 24, 88 16 M102 46 C 103 34, 106 24, 108 16" stroke="#b3b3a8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="88" cy="15" r="3.2" fill="#b3b3a8" />
        <circle cx="108" cy="15" r="3.2" fill="#b3b3a8" />
        <circle cx="99" cy="50" r="9" fill="#d9d9d0" />
        <circle cx="95" cy="57" r="3" fill="#f2b0a0" opacity="0.6" />
        {EYE(102, 47, 3)}
        <path d="M102 55 C 105 58, 108 57, 109 54" stroke="#948f80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  hedgehog,
  woodMouse,
  dormouse,
  shrew,
  toad,
  newt,
  lizard,
  stagBeetle,
  romanSnail,
};
