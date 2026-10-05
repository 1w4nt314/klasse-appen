import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Almindelige danske skovfugle. Profil mod højre, fødderne på bunden af viewBox.
 * Flyvende fugle har vingerne løftet bag kroppen: `.zoo-wing` skalerer lodret om
 * vingeroden (nederste højre hjørne), som ligger gemt inde i kroppen, så vingen
 * bliver siddende under hele flappet.
 */

/** Vingeslag: varighed pr. slag + omdrejningspunkt ved vingeroden. */
const slag = (varighed: string, oprindelse = "90% 100%") =>
  ({ "--flap": varighed, transformOrigin: oprindelse }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Natugle                                                              */
/* ------------------------------------------------------------------ */

const tawnyOwl: CreatureSpec = {
  name: "Natugle",
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
          fill="#7a4f31"
        />
        <path
          d="M62 76 C 44 70, 26 56, 20 34 C 30 40, 44 44, 52 36 C 54 50, 60 62, 66 74 Z"
          fill="#a57448"
        />
        <path d="M18 26 C 24 34, 30 38, 38 40 M34 20 C 38 30, 44 36, 50 38" stroke="#5d3a22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* kort hale */}
      <path d="M30 100 L 12 124 L 32 124 L 46 110 Z" fill="#6b4429" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M52 116 V 124 M46 127 H 58" stroke="#e0b258" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="84" rx="34" ry="38" fill="#94653d" />
        <ellipse cx="64" cy="94" rx="22" ry="26" fill="#ecd7b0" />
        <path
          d="M56 80 V 88 M64 76 V 86 M72 80 V 90 M52 96 V 104 M60 94 V 104 M68 96 V 106 M76 98 V 106"
          stroke="#94653d"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="38" cy="82" r="3" fill="#ecd7b0" />
        <circle cx="32" cy="94" r="2.6" fill="#ecd7b0" />
        <circle cx="42" cy="100" r="2.4" fill="#ecd7b0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M70 116 V 124 M64 127 H 76" stroke="#f0c46c" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="66" cy="46" r="30" fill="#94653d" />
        <path d="M44 28 C 50 20, 60 17, 68 18" stroke="#6b4429" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="26" r="2.6" fill="#ecd7b0" />
        <circle cx="62" cy="20" r="2.4" fill="#ecd7b0" />
        {/* lyst ansigtsslør */}
        <ellipse cx="70" cy="48" rx="25" ry="21" fill="#f2e2c0" />
        <ellipse cx="70" cy="48" rx="25" ry="21" fill="none" stroke="#c99a68" strokeWidth="2.4" />
        <path d="M52 36 C 55 30, 62 30, 66 33 M78 33 C 82 30, 89 30, 92 36" stroke="#6b4429" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {EYE(60, 47, 7.4)}
        {EYE(82, 47, 6.4)}
        <path d="M70 52 C 77 52, 82 57, 80 63 C 74 66, 68 62, 70 52 Z" fill="#e8b040" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Musvåge                                                              */
/* ------------------------------------------------------------------ */

const buzzard: CreatureSpec = {
  name: "Musvåge",
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
          fill="#6a4630"
        />
        <path
          d="M104 84 C 76 80, 50 66, 38 42 C 52 52, 66 52, 74 44 C 82 58, 94 70, 110 82 Z"
          fill="#9a6e47"
        />
        <path d="M30 34 C 38 48, 50 58, 66 64 M44 24 C 50 40, 60 52, 74 58" stroke="#4a2f20" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* halefjer med striber */}
      <path d="M44 88 L 6 80 C 2 92, 6 106, 14 114 L 48 104 Z" fill="#8c6038" />
      <path d="M26 86 L 22 108 M36 88 L 32 106" stroke="#4a2f20" strokeWidth="3" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M88 114 V 132 M80 136 H 98 M88 132 L 82 137 M88 132 L 96 137" stroke="#e8b83a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="82" cy="94" rx="48" ry="27" fill="#6a4630" />
        <ellipse cx="90" cy="104" rx="36" ry="18" fill="#f1e4c8" />
        <path d="M66 96 C 74 90, 86 90, 94 96 C 90 104, 74 106, 66 100 Z" fill="#a47850" />
        <circle cx="76" cy="108" r="3" fill="#a47850" />
        <circle cx="94" cy="110" r="2.8" fill="#a47850" />
        <circle cx="106" cy="104" r="3" fill="#a47850" />
        <circle cx="86" cy="115" r="2.4" fill="#a47850" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M106 114 V 132 M98 136 H 116 M106 132 L 100 137 M106 132 L 114 137" stroke="#f2c64c" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="128" cy="68" r="22" fill="#6a4630" />
        <ellipse cx="132" cy="80" rx="13" ry="8" fill="#f1e4c8" />
        <circle cx="136" cy="64" r="8.2" fill="#f4e7c3" />
        {EYE(137, 64, 4.6)}
        <path d="M122 54 C 128 50, 134 50, 139 53" stroke="#4a2f20" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M146 64 C 158 62, 166 70, 163 82 C 160 76, 154 74, 146 76 Z" fill="#4c4748" />
        <ellipse cx="148" cy="69" rx="5.4" ry="5" fill="#e8b83a" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Stor flagspætte                                                      */
/* ------------------------------------------------------------------ */

const woodpecker: CreatureSpec = {
  name: "Stor flagspætte",
  height: 6,
  aspect: 132 / 112,
  gait: "float",
  zone: "open",
  pace: 1.1,
  viewBox: "0 0 132 112",
  art: (
    <>
      <g className="zoo-wing" style={slag("0.2s")}>
        <path
          d="M64 66 C 42 64, 20 50, 12 22 C 16 14, 22 14, 25 20 C 28 12, 34 12, 37 18 C 41 12, 47 14, 49 22 C 54 38, 62 52, 72 64 Z"
          fill="#26252c"
        />
        <circle cx="30" cy="30" r="3.4" fill="#f6f1e6" />
        <circle cx="40" cy="30" r="3.4" fill="#f6f1e6" />
        <circle cx="36" cy="42" r="3.4" fill="#f6f1e6" />
        <circle cx="48" cy="44" r="3.4" fill="#f6f1e6" />
        <circle cx="52" cy="30" r="3.2" fill="#f6f1e6" />
      </g>
      {/* stiv hale */}
      <path d="M30 70 L 4 92 L 12 98 L 42 84 Z" fill="#26252c" />
      <path d="M32 80 L 14 96 L 26 96 L 42 88 Z" fill="#d93a2e" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M54 84 V 104 M47 108 H 61 M54 104 L 48 108 M54 104 L 60 108" stroke="#8c8c96" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="68" rx="37" ry="21" transform="rotate(-12 60 68)" fill="#26252c" />
        <ellipse cx="68" cy="75" rx="27" ry="12" transform="rotate(-12 68 75)" fill="#f6f1e6" />
        <ellipse cx="38" cy="80" rx="10" ry="7" transform="rotate(-12 38 80)" fill="#d93a2e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M72 84 V 104 M65 108 H 79 M72 104 L 66 108 M72 104 L 78 108" stroke="#a4a4ae" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="94" cy="44" r="18" fill="#f6f1e6" />
        <path d="M76 44 C 74 28, 88 22, 100 26 C 106 28, 110 32, 110 34 C 100 32, 88 36, 76 44 Z" fill="#26252c" />
        <ellipse cx="82" cy="38" rx="4.4" ry="6.4" transform="rotate(-18 82 38)" fill="#d93a2e" />
        <path d="M99 50 C 97 55, 93 58, 88 59" stroke="#26252c" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d="M108 40 L 130 44 L 108 49 Z" fill="#3b3a42" />
        {EYE(99, 41, 3.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Skovskade                                                            */
/* ------------------------------------------------------------------ */

const jayVinge =
  "M66 68 C 40 66, 18 48, 12 16 C 14 8, 22 8, 26 14 C 30 6, 38 6, 40 14 C 46 8, 54 10, 56 18 C 62 34, 68 50, 76 66 Z";

const jay: CreatureSpec = {
  name: "Skovskade",
  height: 7,
  aspect: 132 / 118,
  gait: "float",
  zone: "open",
  pace: 1.0,
  viewBox: "0 0 132 118",
  art: (
    <>
      <g className="zoo-wing" style={slag("0.3s")}>
        <path d={jayVinge} fill="#a8715c" />
        <Klip form={<path d={jayVinge} />}>
          <rect x="12" y="6" width="64" height="16" fill="#26242b" />
          <rect x="12" y="22" width="64" height="18" fill="#3d86c8" />
          <path d="M18 22 V 40 M25 22 V 40 M32 22 V 40 M39 22 V 40 M46 22 V 40 M53 22 V 40 M60 22 V 40 M67 22 V 40" stroke="#26242b" strokeWidth="2.2" />
          <rect x="12" y="40" width="64" height="7" fill="#f6f2ea" />
          <rect x="12" y="47" width="64" height="5" fill="#26242b" />
        </Klip>
      </g>
      {/* sort hale */}
      <path d="M36 76 C 22 76, 8 80, 4 88 C 4 96, 6 102, 10 106 C 22 104, 36 98, 44 90 Z" fill="#26242b" />
      <path d="M8 98 C 6 94, 5 92, 4 88 C 8 84, 12 82, 16 80 C 12 86, 10 92, 8 98 Z" fill="#3d86c8" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M52 94 V 108 M45 112 H 59 M52 108 L 46 112 M52 108 L 58 112" stroke="#8d6d62" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="76" rx="32" ry="24" fill="#c58f78" />
        <ellipse cx="66" cy="84" rx="22" ry="14" fill="#dfb8a2" />
        <ellipse cx="32" cy="72" rx="9" ry="8" fill="#f6f2ea" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M68 94 V 108 M61 112 H 75 M68 108 L 62 112 M68 108 L 74 112" stroke="#a88478" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="92" cy="46" r="19" fill="#c58f78" />
        <path d="M74 44 C 74 30, 86 24, 98 28 C 104 30, 108 34, 109 38 C 96 36, 84 38, 74 44 Z" fill="#efe1d6" />
        <path d="M82 31 L 80 40 M89 29 L 88 38 M96 29 L 95 37 M102 32 L 101 38" stroke="#26242b" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M100 54 C 98 60, 94 64, 90 66" stroke="#26242b" strokeWidth="5.4" fill="none" strokeLinecap="round" />
        <path d="M108 44 C 118 44, 124 48, 124 52 C 118 56, 112 56, 108 55 Z" fill="#4a4650" />
        {EYE(99, 46, 3.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Gøg                                                                  */
/* ------------------------------------------------------------------ */

const gogBug = "M48 64 C 62 56, 100 54, 124 62 C 124 76, 100 84, 80 84 C 62 84, 50 78, 48 64 Z";

const cuckoo: CreatureSpec = {
  name: "Gøg",
  height: 7,
  aspect: 172 / 106,
  gait: "float",
  zone: "open",
  pace: 1.0,
  viewBox: "0 0 172 106",
  art: (
    <>
      <g className="zoo-wing" style={slag("0.36s")}>
        <path d="M100 60 C 64 60, 34 42, 22 8 C 46 10, 74 26, 112 54 Z" fill="#8995a3" />
        <path d="M96 56 C 68 54, 46 40, 36 22 C 56 28, 80 38, 104 52 Z" fill="#67727f" />
      </g>
      {/* lang hale med hvide pletter */}
      <path d="M50 62 L 4 70 C 2 76, 2 82, 6 86 L 52 78 Z" fill="#5f6a77" />
      <circle cx="14" cy="74" r="2.6" fill="#f2efe8" />
      <circle cx="24" cy="76" r="2.4" fill="#f2efe8" />
      <circle cx="34" cy="76" r="2.4" fill="#f2efe8" />
      <circle cx="44" cy="74" r="2.2" fill="#f2efe8" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M84 80 V 94 M77 98 H 91 M84 94 L 78 98 M84 94 L 90 98" stroke="#e5b73a" strokeWidth="4.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="88" cy="66" rx="44" ry="18" transform="rotate(-6 88 66)" fill="#8995a3" />
        <path d={gogBug} fill="#f2efe8" />
        <Klip form={<path d={gogBug} />}>
          <path
            d="M54 56 L 58 90 M62 56 L 66 90 M70 56 L 74 90 M78 56 L 82 90 M86 56 L 90 90 M94 56 L 98 90 M102 56 L 106 90 M110 56 L 114 90 M118 56 L 122 90"
            stroke="#7a8696"
            strokeWidth="2.2"
          />
        </Klip>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M102 80 V 94 M95 98 H 109 M102 94 L 96 98 M102 94 L 108 98" stroke="#f2c64c" strokeWidth="4.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="130" cy="52" r="16" fill="#8995a3" />
        <ellipse cx="132" cy="62" rx="9" ry="6" fill="#d3d8de" />
        <path d="M142 48 C 152 48, 160 52, 162 58 C 154 56, 148 57, 142 57 Z" fill="#4c4b55" />
        <circle cx="136" cy="48" r="6.4" fill="#f2c13c" />
        {EYE(136, 48, 3.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Solsort                                                              */
/* ------------------------------------------------------------------ */

const blackbird: CreatureSpec = {
  name: "Solsort",
  height: 5,
  aspect: 124 / 120,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 124 120",
  art: (
    <>
      <path d="M34 62 L 4 82 L 10 92 L 44 78 Z" fill="#1f1d24" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M52 84 V 112 M44 116 H 60 M52 112 L 45 116 M52 112 L 59 116" stroke="#6e4c38" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="64" rx="33" ry="25" transform="rotate(-8 60 64)" fill="#26242b" />
        <ellipse cx="50" cy="64" rx="22" ry="12" transform="rotate(-14 50 64)" fill="#3a3743" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M70 84 V 112 M62 116 H 78 M70 112 L 63 116 M70 112 L 77 116" stroke="#8a634a" strokeWidth="4.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        <circle cx="88" cy="38" r="19" fill="#26242b" />
        <path d="M104 34 L 122 41 L 104 48 Z" fill="#f4a328" />
        <circle cx="94" cy="35" r="6.6" fill="#f4a328" />
        {EYE(94, 35, 3.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Rødhals                                                              */
/* ------------------------------------------------------------------ */

const robin: CreatureSpec = {
  name: "Rødhals",
  height: 3.5,
  aspect: 92 / 92,
  gait: "hop",
  pace: 1.3,
  viewBox: "0 0 92 92",
  art: (
    <>
      <path d="M22 50 L 4 40 L 6 56 L 26 60 Z" fill="#7a5a3e" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M40 74 V 88 M34 90 H 46" stroke="#7d5c4c" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <circle cx="46" cy="52" r="28" fill="#8c6a4a" />
        <ellipse cx="54" cy="64" rx="19" ry="15" fill="#f3ead8" />
        <ellipse cx="58" cy="52" rx="15" ry="18" fill="#e9622f" />
        <ellipse cx="38" cy="50" rx="17" ry="11" transform="rotate(-12 38 50)" fill="#76563a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M52 74 V 88 M46 90 H 58" stroke="#9a7664" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="56" cy="32" r="20" fill="#8c6a4a" />
        <ellipse cx="63" cy="36" rx="14" ry="14.5" fill="#e9622f" />
        <path d="M74 30 L 88 34 L 74 38 Z" fill="#3b2f2a" />
        {EYE(66, 29, 4.2)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Musvit                                                               */
/* ------------------------------------------------------------------ */

const greatTit: CreatureSpec = {
  name: "Musvit",
  height: 3.5,
  aspect: 92 / 92,
  gait: "hop",
  pace: 1.3,
  viewBox: "0 0 92 92",
  art: (
    <>
      <path d="M22 50 L 3 44 L 6 60 L 26 60 Z" fill="#6f8ea6" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M40 74 V 88 M34 90 H 46" stroke="#5f6a77" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <circle cx="46" cy="52" r="28" fill="#8da35b" />
        <ellipse cx="55" cy="62" rx="20" ry="17" fill="#f2d033" />
        <path d="M58 50 C 58 60, 56 68, 54 76" stroke="#26242b" strokeWidth="4.6" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="52" rx="17" ry="11" transform="rotate(-12 38 52)" fill="#6f8ea6" />
        <path d="M24 48 C 32 44, 42 44, 50 48" stroke="#f6f2ea" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M52 74 V 88 M46 90 H 58" stroke="#7b8795" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="56" cy="32" r="20" fill="#26242b" />
        <ellipse cx="63" cy="40" rx="12" ry="8.5" fill="#f6f2ea" />
        <path d="M74 31 L 86 35 L 74 39 Z" fill="#3a3743" />
        {EYE(65, 31, 4)}
      </g>
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  tawnyOwl,
  buzzard,
  woodpecker,
  jay,
  cuckoo,
  blackbird,
  robin,
  greatTit,
};
