import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Den danske skov, usædvanlige varianter: sjældne farveformer, der findes i
 * virkeligheden (sort egern, hvidt dådyr, broget rådyr, albino-pindsvin,
 * sølvræv, lys grævling, lys musvåge og rødbrun natugle). Formen er hentet fra
 * de almindelige dyr i creatures-1/2/3; kun farver og mønstre er ændret.
 */

/** Vingeslag: varighed pr. slag + omdrejningspunkt ved vingeroden. */
const slag = (varighed: string, oprindelse = "90% 100%") =>
  ({ "--flap": varighed, transformOrigin: oprindelse }) as CSSProperties;

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

/* ------------------------------------------------------------------ */
/* Sort egern                                                          */
/* ------------------------------------------------------------------ */

/** Sort egern: næsten sort-brun pels, mørk hale og lysere grå-brun mave. */
const blackSquirrel: CreatureSpec = {
  name: "Sort egern",
  rarity: "uncommon",
  height: 6,
  aspect: 112 / 130,
  gait: "hop",
  pace: 1.3,
  viewBox: "0 0 112 130",
  art: (
    <>
      <path d="M52 118 C 12 118, 6 72, 16 44 C 24 22, 44 14, 54 28 C 60 38, 46 52, 48 68 C 50 82, 62 92, 62 106 Z" fill="#2b211d" />
      <path d="M22 52 C 26 36, 38 28, 46 34" stroke="#5a4a42" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M20 80 C 22 92, 30 102, 40 108" stroke="#3d302a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <ellipse cx="76" cy="124" rx="16" ry="6" fill="#1c1512" />
      <g className="zoo-torso">
        <ellipse cx="70" cy="96" rx="24" ry="30" fill="#33271f" />
        <ellipse cx="80" cy="100" rx="14" ry="22" fill="#6f5d50" />
        <path d="M54 80 C 58 70, 64 66, 70 66" stroke="#4d3d33" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M92 36 C 92 26, 96 18, 100 12 C 103 22, 106 30, 104 40 Z" fill="#1f1815" />
        <path d="M95 22 C 95 14, 97 8, 100 3 C 104 10, 105 16, 104 24 Z" fill="#0f0b09" />
        <circle cx="82" cy="52" r="19" fill="#33271f" />
        <path d="M68 42 C 66 28, 70 18, 74 10 C 78 20, 82 30, 82 38 Z" fill="#1f1815" />
        <path d="M70 24 C 70 16, 72 10, 74 3 C 78 11, 80 17, 80 26 Z" fill="#0f0b09" />
        <ellipse cx="98" cy="58" rx="9" ry="7" fill="#76645a" />
        <circle cx="105" cy="56" r="2.8" fill="#120d0b" />
        {/* lys øjenring, så øjet ses mod den sorte pels */}
        <circle cx="91" cy="49" r="5.8" fill="#e8dccb" />
        {EYE(91, 49, 3.6)}
        <ellipse cx="92" cy="84" rx="7" ry="5" fill="#33271f" />
        <ellipse cx="100" cy="80" rx="6" ry="7" fill="#8a5a30" />
        <path d="M96 76 C 98 72, 104 72, 106 76 Z" fill="#6b4220" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Hvidt dådyr                                                         */
/* ------------------------------------------------------------------ */

/** Hvidt dådyr: creme-hvid uden pletter, lyserøde indre ører og mørke øjne. */
const whiteFallowDeer: CreatureSpec = {
  name: "Hvidt dådyr",
  rarity: "uncommon",
  height: 20,
  aspect: 200 / 170,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 0 200 170",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="96" width="9" height="74" rx="4" fill="#d8ccb8" />
        <rect x="120" y="161" width="9" height="9" rx="3" fill="#a89888" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="96" width="9" height="74" rx="4" fill="#d8ccb8" />
        <rect x="46" y="161" width="9" height="9" rx="3" fill="#a89888" />
      </g>
      <g className="zoo-torso">
        <path d="M42 74 C 32 80, 32 98, 38 108" stroke="#d3c6b0" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="92" cy="88" rx="52" ry="25" fill="#f7f0e1" />
        <ellipse cx="96" cy="103" rx="38" ry="7" fill="#e6d9c2" />
        <path d="M60 70 C 78 62, 106 62, 126 72" stroke="#fffaf0" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="46" cy="86" rx="8" ry="13" fill="#fffdf6" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="132" y="98" width="10" height="72" rx="4" fill="#f7f0e1" />
        <rect x="132" y="161" width="10" height="9" rx="3" fill="#b8a898" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="98" width="10" height="72" rx="4" fill="#f7f0e1" />
        <rect x="60" y="161" width="10" height="9" rx="3" fill="#b8a898" />
      </g>
      <g className="zoo-head">
        {/* Skovlformet gevir */}
        <g transform="rotate(-20 154 46)">
          <path d="M150 48 L 148 32 C 142 26, 140 16, 142 8 L 147 14 L 149 6 L 154 14 L 158 7 L 160 16 L 165 11 C 166 22, 162 30, 158 34 L 157 48 Z" fill="#cdb98a" />
          <path d="M153 44 L 166 36" stroke="#cdb98a" strokeWidth="3.6" strokeLinecap="round" />
        </g>
        <path d="M120 76 C 126 58, 134 46, 144 40 L 160 54 C 152 66, 148 78, 142 88 Z" fill="#f7f0e1" />
        <ellipse cx="160" cy="52" rx="16" ry="10.5" transform="rotate(28 160 52)" fill="#f7f0e1" />
        <ellipse cx="172" cy="60" rx="7" ry="6" fill="#f2c9bf" />
        <circle cx="176" cy="62" r="3.2" fill="#7a5650" />
        <ellipse cx="143" cy="38" rx="5" ry="10" transform="rotate(-34 143 38)" fill="#f7f0e1" />
        <ellipse cx="143" cy="39" rx="2.6" ry="6.5" transform="rotate(-34 143 39)" fill="#f2a9a8" />
        {EYE(163, 50, 3.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Broget rådyr                                                        */
/* ------------------------------------------------------------------ */

const ROE_BRUN = "#b8683a";
const ROE_FJERN = "#8a4c2a";
const ROE_HVID = "#fbf5e8";

/** Broget rådyr: rødbrun pels med store hvide pletter, hvid blis og hvide sokker. */
const piebaldRoeDeer: CreatureSpec = {
  name: "Broget rådyr",
  rarity: "uncommon",
  height: 17,
  aspect: 180 / 150,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 180 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="84" width="8" height="66" rx="4" fill={ROE_FJERN} />
        <rect x="120" y="108" width="8" height="34" fill="#e2d4bf" />
        <rect x="120" y="142" width="8" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="50" y="84" width="8" height="66" rx="4" fill={ROE_FJERN} />
        <rect x="50" y="116" width="8" height="26" fill="#e2d4bf" />
        <rect x="50" y="142" width="8" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="74" rx="50" ry="25" fill={ROE_BRUN} />
        <Klip form={<ellipse cx="90" cy="74" rx="50" ry="25" />}>
          {/* store hvide pletter på ryg, side og bug */}
          <path d="M66 44 C 82 40, 98 46, 100 58 C 102 70, 90 78, 78 74 C 64 70, 56 52, 66 44 Z" fill={ROE_HVID} />
          <path d="M112 62 C 124 56, 138 62, 138 76 C 138 90, 122 92, 114 84 C 108 78, 106 68, 112 62 Z" fill={ROE_HVID} />
          <path d="M52 86 C 62 80, 74 86, 78 98 L 40 100 Z" fill={ROE_HVID} />
          <circle cx="104" cy="90" r="9" fill={ROE_HVID} />
        </Klip>
        <ellipse cx="94" cy="89" rx="36" ry="8" fill="#e8c49a" opacity="0.5" />
        <ellipse cx="46" cy="72" rx="8" ry="12" fill={ROE_HVID} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="132" y="86" width="9" height="64" rx="4" fill={ROE_BRUN} />
        <rect x="132" y="112" width="9" height="30" fill={ROE_HVID} />
        <rect x="132" y="142" width="9" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="86" width="9" height="64" rx="4" fill={ROE_BRUN} />
        <rect x="62" y="124" width="9" height="18" fill={ROE_HVID} />
        <rect x="62" y="142" width="9" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-head">
        {/* Bukkens små gevirer */}
        <path d="M150 32 L 148 10 M149 22 L 157 16 M148.5 14 L 140 8" stroke="#7b6a48" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M116 66 C 122 46, 130 34, 140 28 L 158 42 C 152 56, 146 70, 132 80 Z" fill={ROE_BRUN} />
        {/* hvid plet på halsen */}
        <ellipse cx="136" cy="60" rx="8" ry="15" transform="rotate(32 136 60)" fill={ROE_HVID} />
        <ellipse cx="158" cy="40" rx="19" ry="11" transform="rotate(26 158 40)" fill={ROE_BRUN} />
        <Klip form={<ellipse cx="158" cy="40" rx="19" ry="11" transform="rotate(26 158 40)" />}>
          <path d="M146 24 L 168 26 L 174 52 L 160 46 C 156 40, 150 34, 146 24 Z" fill={ROE_HVID} />
        </Klip>
        <ellipse cx="171" cy="48" rx="8" ry="5" transform="rotate(26 171 48)" fill="#f4e6d0" />
        <circle cx="176" cy="50.5" r="3.2" fill="#2b211c" />
        <ellipse cx="142" cy="24" rx="5" ry="11" transform="rotate(-32 142 24)" fill={ROE_BRUN} />
        <ellipse cx="142" cy="25" rx="2.6" ry="7" transform="rotate(-32 142 25)" fill="#f0c2a8" />
        {EYE(160, 38, 3.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Albino-pindsvin                                                     */
/* ------------------------------------------------------------------ */

/** Albino-pindsvin: creme-hvide pigge, lyserøde fødder, snude og røde øjne. */
const albinoHedgehog: CreatureSpec = {
  name: "Albino-pindsvin",
  rarity: "uncommon",
  height: 5,
  aspect: 124 / 76,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 124 76",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="72" cy="70" rx="9" ry="6.5" fill="#e9bfb2" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="36" cy="70" rx="9" ry="6.5" fill="#e9bfb2" />
      </g>
      <g className="zoo-torso">
        <polygon points={piggeKurve(54, 60, 46, 46, 0.16, 14, 188, -8)} fill="#c9b794" />
        <polygon points={piggeKurve(54, 60, 40, 40, 0.18, 12, 182, -2)} fill="#dccdac" />
        <polygon points={piggeKurve(52, 60, 31, 31, 0.2, 9, 176, 6)} fill="#ebdfc4" />
        <polygon points={piggeKurve(50, 60, 20, 18, 0.22, 6, 170, 12)} fill="#f8f1de" />
        <ellipse cx="54" cy="63" rx="40" ry="7.5" fill="#dccdac" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="82" cy="70" rx="9.5" ry="6.5" fill="#f8d9d0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="46" cy="70" rx="9.5" ry="6.5" fill="#f8d9d0" />
      </g>
      <g className="zoo-head">
        <path
          d="M80 40 C 92 38, 104 46, 118 56 C 119 58, 118 60, 116 61 C 106 66, 90 68, 80 64 C 74 58, 74 46, 80 40 Z"
          fill="#fdeee4"
        />
        <ellipse cx="90" cy="43" rx="6" ry="5.5" fill="#ecc6b8" />
        <ellipse cx="90" cy="43.5" rx="3.2" ry="3" fill="#f5a3b0" />
        <circle cx="118" cy="57.5" r="4" fill="#ee8a9c" />
        <circle cx="119.4" cy="56.2" r="1.1" fill="#fff" />
        <circle cx="94" cy="60" r="5" fill="#f7a3b4" opacity="0.6" />
        <path d="M104 62 C 108 65, 112 65, 114 63" stroke="#d99aa0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* lyserød iris omkring en lille pupil */}
        <circle cx="103" cy="52" r="5.4" fill="#e8647c" />
        {EYE(103, 52, 2.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Sølvræv                                                             */
/* ------------------------------------------------------------------ */

const SOLV_MORK = "#3a3d44";
const SOLV_MID = "#646973";
const SOLV_LYS = "#aab0b9";

/** Sølvræv: sort-sølvgrå pels med sølvrimmet ryg, lys bryst og hvid halespids. */
const silverFox: CreatureSpec = {
  name: "Sølvræv",
  rarity: "uncommon",
  height: 9,
  aspect: 200 / 110,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 200 110",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M58 62 C 40 36, 8 40, 4 70 C 6 92, 34 98, 60 80 Z" fill={SOLV_MID} />
        <path d="M44 48 C 30 46, 16 52, 10 62 M46 60 C 32 60, 20 66, 14 76" stroke={SOLV_LYS} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M18 47 C 9 54, 5 62, 4 70 C 5 82, 12 91, 24 94 C 17 82, 16 60, 18 47 Z" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="118" y="76" width="9" height="34" rx="4" fill="#202226" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="60" y="76" width="9" height="34" rx="4" fill="#202226" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="64" rx="44" ry="20" fill={SOLV_MID} />
        <path d="M62 54 C 80 42, 112 42, 138 56 C 118 52, 84 52, 62 54 Z" fill={SOLV_MORK} />
        {[[72, 54], [84, 50], [96, 49], [108, 50], [120, 54], [90, 58], [104, 59], [78, 60]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={SOLV_LYS} opacity="0.85" />
        ))}
        <ellipse cx="100" cy="76" rx="30" ry="7" fill={SOLV_MORK} opacity="0.9" />
        <ellipse cx="136" cy="70" rx="12" ry="12" fill={SOLV_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="130" y="78" width="10" height="32" rx="4" fill="#34373d" />
        <rect x="130" y="94" width="10" height="16" rx="4" fill="#16171a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="72" y="78" width="10" height="32" rx="4" fill="#34373d" />
        <rect x="72" y="94" width="10" height="16" rx="4" fill="#16171a" />
      </g>
      <g className="zoo-head">
        <path d="M136 38 L 134 10 L 152 32 Z" fill="#202226" />
        <path d="M150 32 L 158 8 L 167 36 Z" fill={SOLV_MORK} />
        <path d="M154 30 L 158 14 L 163 32 Z" fill="#101114" />
        <path d="M132 54 C 130 38, 146 30, 160 34 C 170 38, 176 50, 187 58 C 180 66, 164 70, 152 68 C 140 66, 132 62, 132 54 Z" fill={SOLV_MID} />
        <path d="M140 42 C 146 36, 156 34, 162 36 C 160 40, 148 42, 140 46 Z" fill={SOLV_MORK} />
        <path d="M142 62 C 152 62, 160 56, 171 53 C 178 55, 183 57, 187 58 C 180 66, 164 71, 152 69 C 146 68, 142 66, 142 62 Z" fill={SOLV_LYS} />
        <circle cx="187" cy="58" r="3.8" fill="#0e0f11" />
        {/* gul øjenring, så øjet ses mod den mørke pels */}
        <circle cx="157" cy="45" r="5.6" fill="#f0cf5c" />
        {EYE(157, 45, 3.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Lys grævling                                                        */
/* ------------------------------------------------------------------ */

const GRAEV_STRIBE = "#9c8564";

/** Lys grævling: sandfarvet/creme pels med bleg bug og svage ansigtsstriber. */
const blondBadger: CreatureSpec = {
  name: "Lys grævling",
  rarity: "uncommon",
  height: 8,
  aspect: 176 / 100,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 176 100",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="106" y="64" width="14" height="36" rx="6" fill="#9a8260" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="36" y="64" width="14" height="36" rx="6" fill="#9a8260" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="22" cy="54" rx="10" ry="7" fill="#c9b48c" />
        <ellipse cx="82" cy="56" rx="58" ry="30" fill="#d3bf96" />
        <ellipse cx="80" cy="45" rx="48" ry="16" fill="#eadcba" />
        <ellipse cx="86" cy="77" rx="44" ry="10" fill="#b39c76" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="66" width="15" height="34" rx="6" fill="#ad9570" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="50" y="66" width="15" height="34" rx="6" fill="#ad9570" />
      </g>
      <g className="zoo-head">
        <circle cx="127" cy="27" r="8" fill={GRAEV_STRIBE} />
        <Klip form={<path d="M122 38 C 128 24, 148 24, 158 38 C 164 46, 168 56, 168 66 C 156 74, 136 76, 126 72 C 120 64, 118 48, 122 38 Z" />}>
          <rect x="110" y="20" width="64" height="60" fill="#fbf6ea" />
          <path d="M172 52 L 126 24 L 116 40 L 170 70 Z" fill={GRAEV_STRIBE} opacity="0.55" />
        </Klip>
        <circle cx="167" cy="64" r="4" fill="#6b5640" />
        <circle cx="148" cy="47" r="5.8" fill="#fbf6ea" />
        {EYE(148, 47, 3.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Lys musvåge                                                         */
/* ------------------------------------------------------------------ */

const VAAGE_PLET = "#a67c55";

/** Lys musvåge: næsten hvid med lysebrune pletter på vinge, bryst og hoved. */
const paleBuzzard: CreatureSpec = {
  name: "Lys musvåge",
  rarity: "uncommon",
  height: 12,
  aspect: 172 / 142,
  gait: "float",
  zone: "open",
  pace: 0.7,
  viewBox: "0 0 172 142",
  art: (
    <>
      <g className="zoo-wing" style={slag("0.55s")}>
        <path
          d="M108 88 C 72 86, 38 70, 22 38 L 20 24 C 24 22, 28 24, 30 29 L 31 14 C 35 12, 39 15, 40 21 L 43 8 C 47 6, 51 9, 52 17 L 57 6 C 61 4, 65 8, 65 16 C 76 32, 94 54, 118 84 Z"
          fill="#e6d8c0"
        />
        <path
          d="M104 84 C 76 80, 50 66, 38 42 C 52 52, 66 52, 74 44 C 82 58, 94 70, 110 82 Z"
          fill="#f8f0de"
        />
        <circle cx="50" cy="40" r="5" fill={VAAGE_PLET} />
        <circle cx="68" cy="56" r="5.4" fill={VAAGE_PLET} />
        <circle cx="86" cy="68" r="5" fill={VAAGE_PLET} />
        <circle cx="34" cy="26" r="3.4" fill={VAAGE_PLET} />
        <circle cx="46" cy="22" r="3.2" fill={VAAGE_PLET} />
        <circle cx="100" cy="76" r="4" fill={VAAGE_PLET} />
      </g>
      {/* halefjer med lysebrune striber */}
      <path d="M44 88 L 6 80 C 2 92, 6 106, 14 114 L 48 104 Z" fill="#e2d2b6" />
      <path d="M26 86 L 22 108 M36 88 L 32 106" stroke={VAAGE_PLET} strokeWidth="3" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M88 114 V 132 M80 136 H 98 M88 132 L 82 137 M88 132 L 96 137" stroke="#e8b83a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="82" cy="94" rx="48" ry="27" fill="#eadcc2" />
        <ellipse cx="90" cy="104" rx="36" ry="18" fill="#fdf8ec" />
        <path d="M66 96 C 74 90, 86 90, 94 96 C 90 104, 74 106, 66 100 Z" fill="#c9a37a" />
        <circle cx="76" cy="108" r="3.4" fill={VAAGE_PLET} />
        <circle cx="94" cy="110" r="3.2" fill={VAAGE_PLET} />
        <circle cx="106" cy="104" r="3.4" fill={VAAGE_PLET} />
        <circle cx="86" cy="116" r="2.8" fill={VAAGE_PLET} />
        <circle cx="60" cy="86" r="3.2" fill={VAAGE_PLET} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M106 114 V 132 M98 136 H 116 M106 132 L 100 137 M106 132 L 114 137" stroke="#f2c64c" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="128" cy="68" r="22" fill="#f1e6d0" />
        <path d="M112 58 C 114 50, 120 47, 126 48 C 120 52, 118 58, 116 66 Z" fill={VAAGE_PLET} />
        <circle cx="120" cy="76" r="2.8" fill={VAAGE_PLET} />
        <ellipse cx="132" cy="80" rx="13" ry="8" fill="#fdf8ec" />
        <circle cx="136" cy="64" r="8.2" fill="#fffaf0" />
        {EYE(137, 64, 4.6)}
        <path d="M122 54 C 128 50, 134 50, 139 53" stroke={VAAGE_PLET} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M146 64 C 158 62, 166 70, 163 82 C 160 76, 154 74, 146 76 Z" fill="#5c5758" />
        <ellipse cx="148" cy="69" rx="5.4" ry="5" fill="#e8b83a" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Rødbrun natugle                                                     */
/* ------------------------------------------------------------------ */

/** Rødbrun natugle: varm kanel/rødbrun fjerdragt, lyst ansigtsslør og gule øjenringe. */
const rufousOwl: CreatureSpec = {
  name: "Rødbrun natugle",
  rarity: "uncommon",
  height: 9,
  aspect: 120 / 132,
  gait: "float",
  zone: "open",
  pace: 0.8,
  viewBox: "0 0 120 132",
  art: (
    <>
      <g className="zoo-wing" style={slag("0.42s")}>
        <path
          d="M64 80 C 40 76, 14 58, 6 24 C 8 16, 14 14, 18 20 C 20 12, 26 10, 30 16 C 33 10, 40 10, 42 18 C 46 14, 52 16, 54 24 C 58 42, 66 60, 72 78 Z"
          fill="#a04a1e"
        />
        <path
          d="M62 76 C 44 70, 26 56, 20 34 C 30 40, 44 44, 52 36 C 54 50, 60 62, 66 74 Z"
          fill="#d98a48"
        />
        <path d="M18 26 C 24 34, 30 38, 38 40 M34 20 C 38 30, 44 36, 50 38" stroke="#6e2c10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* kort hale */}
      <path d="M30 100 L 12 124 L 32 124 L 46 110 Z" fill="#8a3c18" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M52 116 V 124 M46 127 H 58" stroke="#e0b258" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="84" rx="34" ry="38" fill="#c0642c" />
        <ellipse cx="64" cy="94" rx="22" ry="26" fill="#f4d9ae" />
        <path
          d="M56 80 V 88 M64 76 V 86 M72 80 V 90 M52 96 V 104 M60 94 V 104 M68 96 V 106 M76 98 V 106"
          stroke="#b5561f"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="38" cy="82" r="3" fill="#f4d9ae" />
        <circle cx="32" cy="94" r="2.6" fill="#f4d9ae" />
        <circle cx="42" cy="100" r="2.4" fill="#f4d9ae" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M70 116 V 124 M64 127 H 76" stroke="#f0c46c" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="66" cy="46" r="30" fill="#c0642c" />
        <path d="M44 28 C 50 20, 60 17, 68 18" stroke="#8a3c18" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="26" r="2.6" fill="#f4d9ae" />
        <circle cx="62" cy="20" r="2.4" fill="#f4d9ae" />
        {/* lyst ansigtsslør */}
        <ellipse cx="70" cy="48" rx="25" ry="21" fill="#f8e6c4" />
        <ellipse cx="70" cy="48" rx="25" ry="21" fill="none" stroke="#d98a48" strokeWidth="2.4" />
        <path d="M52 36 C 55 30, 62 30, 66 33 M78 33 C 82 30, 89 30, 92 36" stroke="#8a3c18" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {EYE(60, 47, 7.4)}
        {EYE(82, 47, 6.4)}
        <path d="M70 52 C 77 52, 82 57, 80 63 C 74 66, 68 62, 70 52 Z" fill="#e8b040" />
      </g>
    </>
  ),
};

export const variants: Record<string, CreatureSpec> = {
  blackSquirrel,
  whiteFallowDeer,
  piebaldRoeDeer,
  albinoHedgehog,
  silverFox,
  blondBadger,
  paleBuzzard,
  rufousOwl,
};
