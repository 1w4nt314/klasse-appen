import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige akvariefisk. Alle er tegnet i profil, vendt mod højre,
 * med halefinnen i `zoo-tail` yderst til venstre.
 */

/* Skalar: høj, flad krop, lange tråde-finner og sorte lodrette striber. */
const angelFormer = (
  <>
    <path d="M38 66 C 40 40, 62 32, 82 42 C 96 50, 102 60, 104 66 C 102 72, 96 82, 82 90 C 62 100, 40 92, 38 66 Z" />
    <path d="M48 44 C 44 22, 34 10, 24 3 C 44 4, 66 14, 82 40 Z" />
    <path d="M48 88 C 44 110, 34 122, 24 129 C 44 128, 66 118, 82 92 Z" />
  </>
);

const angelfish: CreatureSpec = {
  name: "Skalar",
  height: 13,
  aspect: 110 / 130,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 0 110 130",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M40 66 C 30 56, 16 50, 4 48 C 10 58, 10 74, 4 84 C 16 82, 30 76, 40 66 Z" fill="#c9d4e0" />
        <path d="M36 66 L 8 56 M36 66 L 8 76" stroke="#a9b8c9" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <path d="M76 94 C 74 106, 70 116, 66 126" stroke="#c9d4e0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M84 92 C 84 104, 82 114, 80 122" stroke="#c9d4e0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Klip form={angelFormer}>
        <rect x="0" y="0" width="110" height="130" fill="#dfe7f0" />
        <path d="M0 0 H110 V40 C 80 34, 40 38, 0 50 Z" fill="#f4f8fc" opacity="0.7" />
        <path d="M0 96 C 40 100, 80 96, 110 82 V130 H0 Z" fill="#b6c4d4" opacity="0.65" />
        <path d="M84 0 L 94 0 L 98 130 L 88 130 Z" fill="#2a2f3a" />
        <path d="M61 0 L 71 0 L 71 130 L 61 130 Z" fill="#2a2f3a" />
        <path d="M44 0 L 54 0 L 50 130 L 40 130 Z" fill="#2a2f3a" />
      </Klip>
      <g className="zoo-head">
        <circle cx="90" cy="58" r="8.4" fill="#fff" />
        {EYE(91, 58, 5.2)}
        <path d="M95 74 q 4 4 9 -1" stroke="#5a6a7e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="72" r="4.6" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
};

/* Guldfisk: rund, orange, med stor flydende slørhale. */
const goldfish: CreatureSpec = {
  name: "Guldfisk",
  height: 8,
  aspect: 120 / 92,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 0 120 92",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M48 46 C 38 30, 22 16, 4 10 C 12 24, 6 34, 12 46 C 6 58, 12 68, 4 84 C 24 78, 38 62, 48 46 Z"
          fill="#ff9a3c"
          opacity="0.92"
        />
        <path d="M46 46 C 34 38, 22 28, 12 22 M46 46 L 14 46 M46 46 C 34 54, 22 64, 12 70" stroke="#ffc27a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <path d="M62 22 C 62 6, 84 0, 100 14 C 90 16, 76 20, 70 28 Z" fill="#ff9a3c" />
      <path d="M62 66 C 60 80, 72 90, 86 82 C 80 78, 76 72, 74 64 Z" fill="#ff9a3c" />
      <ellipse cx="78" cy="46" rx="38" ry="30" fill="#f7821b" />
      <path d="M44 56 C 50 78, 100 82, 114 54 C 102 66, 56 70, 44 56 Z" fill="#ffc27a" opacity="0.75" />
      <path d="M52 30 C 60 18, 78 14, 92 18 C 76 20, 62 28, 56 40 Z" fill="#ffb35a" opacity="0.8" />
      <path d="M72 50 C 80 48, 82 58, 74 62 C 68 58, 66 54, 72 50 Z" fill="#ff9a3c" />
      <g className="zoo-head">
        {EYE(98, 38, 5.2)}
        <path d="M108 52 q 3 3 6 0" stroke="#a8431a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="96" cy="52" r="4.4" fill="#ff7a6a" opacity="0.5" />
      </g>
    </>
  ),
};

/* Guppy: lille krop med stor farverig vifte-hale. */
const guppyHale = (
  <path d="M50 28 L 8 2 C -2 14, -2 42, 8 54 Z" />
);

const guppyKrop = (
  <path d="M46 28 C 52 20, 62 15, 80 13 C 98 12, 110 20, 110 28 C 110 36, 100 44, 84 44 C 64 45, 52 38, 46 28 Z" />
);

const guppy: CreatureSpec = {
  name: "Guppy",
  height: 5,
  aspect: 112 / 56,
  gait: "swim",
  pace: 1.3,
  viewBox: "0 0 112 56",
  art: (
    <>
      <g className="zoo-tail">
        <Klip form={guppyHale}>
          <rect x="-4" y="0" width="64" height="58" fill="#e8423c" />
          <path d="M-4 0 H60 V28 L -4 24 Z" fill="#3a78e6" />
          <path d="M-4 40 L 60 28 V58 H-4 Z" fill="#ffcf3a" />
          <circle cx="16" cy="28" r="4.4" fill="#ffd0c0" />
          <circle cx="26" cy="16" r="3.4" fill="#cfe0ff" />
          <circle cx="26" cy="42" r="3.4" fill="#fff0b0" />
        </Klip>
      </g>
      <path d="M70 18 C 70 8, 84 4, 92 10 C 84 12, 80 16, 80 20 Z" fill="#3a78e6" />
      <path d="M66 42 C 66 50, 76 54, 84 48 C 78 46, 76 44, 76 40 Z" fill="#e8423c" />
      <Klip form={guppyKrop}>
        <rect x="40" y="8" width="74" height="42" fill="#9ad0c8" />
        <path d="M40 32 C 60 44, 90 48, 114 36 V50 H40 Z" fill="#e6f5ef" opacity="0.85" />
        <path d="M40 8 H68 C 62 20, 64 34, 72 50 H40 Z" fill="#f59a3a" />
        <circle cx="56" cy="26" r="3.2" fill="#ffd08a" />
      </Klip>
      <g className="zoo-head">
        {EYE(98, 25, 4)}
        <path d="M103 33 q 3 2.6 6 -0.6" stroke="#3a5a60" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="34" r="3" fill="#ff8a8a" opacity="0.5" />
      </g>
    </>
  ),
};

/* Neontetra: slank, lysende blå stribe på langs og rød bagkrop. */
const neonKrop = (
  <path d="M24 20 C 34 6, 74 4, 92 14 C 98 18, 98 22, 92 26 C 74 36, 34 34, 24 20 Z" />
);

const neonTetra: CreatureSpec = {
  name: "Neontetra",
  height: 4,
  aspect: 100 / 40,
  gait: "swim",
  pace: 1.4,
  viewBox: "0 0 100 40",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M28 20 C 20 14, 10 8, 2 4 C 6 14, 6 26, 2 36 C 10 32, 20 26, 28 20 Z" fill="#d6ecf4" opacity="0.9" />
        <path d="M24 22 C 16 26, 10 30, 4 34 C 8 28, 8 24, 8 22 Z" fill="#ff3b3b" opacity="0.85" />
      </g>
      <path d="M48 31 C 52 38, 62 38, 66 31 Z" fill="#ff6a5a" />
      <path d="M52 9 C 56 2, 66 2, 70 8 Z" fill="#6f86b0" />
      <Klip form={neonKrop}>
        <rect x="0" y="0" width="100" height="40" fill="#e3ecf5" />
        <rect x="0" y="0" width="100" height="14" fill="#3d4f86" />
        <path d="M0 22 L 56 22 C 54 28, 52 32, 48 40 H0 Z" fill="#ff3b3b" />
        <path d="M20 17 H 82" stroke="#24d4f8" strokeWidth="5.6" strokeLinecap="round" />
        <path d="M24 16.4 H 80" stroke="#b8f4ff" strokeWidth="2" strokeLinecap="round" />
      </Klip>
      <g className="zoo-head">
        <circle cx="86" cy="20" r="5.4" fill="#fff" />
        {EYE(87, 20, 3.8)}
        <path d="M93 25 q 2 1.6 4 -0.4" stroke="#3d4f86" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* Sommerfuglefisk: gul skive med sort øjenstribe og lille spids mund. */
const sommerfuglKrop = (
  <>
    <ellipse cx="54" cy="50" rx="38" ry="42" />
    <path d="M82 38 C 92 42, 102 48, 109 54 C 102 60, 94 62, 84 64 Z" />
  </>
);

const butterflyfish: CreatureSpec = {
  name: "Sommerfuglefisk",
  height: 9,
  aspect: 110 / 100,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 0 110 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M20 50 C 14 42, 8 36, 2 34 C 6 44, 6 56, 2 66 C 8 64, 14 58, 20 50 Z" fill="#ffe97a" />
        <path d="M10 38 C 12 46, 12 54, 10 62" stroke="#2a2a30" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <path d="M30 14 C 38 -2, 70 -2, 76 12 Z" fill="#ffd92e" />
      <path d="M32 86 C 40 100, 66 100, 74 88 Z" fill="#ffd92e" />
      <Klip form={sommerfuglKrop}>
        <rect x="0" y="0" width="110" height="100" fill="#ffd92e" />
        <path d="M0 78 C 30 90, 70 90, 110 70 V100 H0 Z" fill="#fff08a" opacity="0.8" />
        <path d="M0 0 H110 V20 C 70 12, 30 14, 0 30 Z" fill="#f0b400" opacity="0.5" />
        <path d="M28 20 L 46 50 L 28 80 M42 14 L 60 50 L 42 86" stroke="#f6b81a" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M62 0 C 72 30, 72 70, 62 100 L 77 100 C 87 70, 87 30, 76 0 Z" fill="#2a2a30" />
      </Klip>
      <g className="zoo-head">
        <circle cx="75" cy="42" r="8" fill="#fff" />
        {EYE(76, 42, 5.2)}
        <path d="M97 59 q 4 3 8 -1" stroke="#a87300" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* Dragefisk: rød/hvid stribet med store vifte-finner. Sød, ikke farlig. */
const dragefiskKrop = (
  <ellipse cx="80" cy="60" rx="42" ry="26" />
);

const lionfish: CreatureSpec = {
  name: "Dragefisk",
  height: 13,
  aspect: 150 / 108,
  gait: "swim",
  pace: 0.7,
  viewBox: "0 0 150 108",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M44 62 C 34 54, 18 46, 4 44 C 10 58, 10 70, 4 82 C 18 80, 34 72, 44 62 Z" fill="#f2a58e" />
        <path d="M40 62 L 8 50 M40 62 L 8 76 M40 62 L 6 63" stroke="#fff4ea" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M52 44 L 46 8 L 60 34 L 62 4 L 72 32 L 80 2 L 86 32 L 98 8 L 96 46 Z" fill="#d6362c" />
      <path d="M47 14 L 52 38 M62 10 L 65 34 M80 8 L 80 34 M97 14 L 91 38" stroke="#fff4ea" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M58 78 C 58 94, 70 100, 82 92 C 78 88, 76 84, 76 78 Z" fill="#e8564a" />
      <path d="M90 58 C 72 36, 46 34, 24 58 C 28 80, 44 98, 66 102 C 80 98, 90 86, 92 72 Z" fill="#f08a6a" />
      <path d="M90 64 L 32 58 M90 62 L 40 46 M90 62 L 54 40 M90 66 L 36 78 M90 68 L 50 92 M90 68 L 66 96" stroke="#fff4ea" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Klip form={dragefiskKrop}>
        <rect x="30" y="30" width="100" height="60" fill="#fff0e6" />
        <path d="M44 30 H 56 L 52 90 H 40 Z" fill="#d6362c" />
        <path d="M68 30 H 80 L 76 90 H 64 Z" fill="#d6362c" />
        <path d="M92 30 H 104 L 100 90 H 88 Z" fill="#d6362c" />
        <path d="M116 30 H 130 V 90 H 112 Z" fill="#d6362c" />
        <path d="M30 78 C 60 90, 100 88, 130 66 V90 H30 Z" fill="#f5c8b8" opacity="0.7" />
      </Klip>
      <path d="M106 40 C 106 30, 112 26, 116 28" stroke="#d6362c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="zoo-head">
        <circle cx="106" cy="52" r="8.6" fill="#fff" />
        {EYE(108, 52, 5.6)}
        <path d="M118 66 q 5 4 10 -1" stroke="#8a1f18" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="94" cy="66" r="4.4" fill="#ff7a7a" opacity="0.5" />
      </g>
    </>
  ),
};

/* Rødspætte: flad brun fladfisk med orange prikker, begge øjne foroven. */
const flounder: CreatureSpec = {
  name: "Rødspætte",
  height: 6,
  aspect: 130 / 66,
  gait: "swim",
  pace: 0.6,
  zone: "ground",
  viewBox: "0 0 130 66",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M24 34 C 18 28, 10 24, 2 22 C 6 30, 6 38, 2 46 C 10 44, 18 40, 24 34 Z" fill="#8a5a38" />
      </g>
      <ellipse cx="68" cy="34" rx="56" ry="29" fill="#7e5436" />
      <ellipse cx="68" cy="34" rx="56" ry="29" fill="none" stroke="#b98a5e" strokeWidth="3" strokeDasharray="2 2.6" strokeLinecap="round" />
      <ellipse cx="68" cy="34" rx="50" ry="23" fill="#a47248" />
      <path d="M24 28 C 34 14, 70 8, 108 14 C 80 14, 44 20, 28 36 Z" fill="#bd8c5c" opacity="0.7" />
      <path d="M40 44 C 60 54, 90 54, 112 44 C 92 58, 56 58, 40 44 Z" fill="#8a5a38" opacity="0.7" />
      <g fill="#ff8a2a">
        <circle cx="38" cy="30" r="4.4" />
        <circle cx="54" cy="24" r="3.6" />
        <circle cx="60" cy="40" r="4.8" />
        <circle cx="76" cy="30" r="4" />
        <circle cx="86" cy="44" r="3.6" />
        <circle cx="46" cy="42" r="3" />
        <circle cx="72" cy="46" r="2.8" />
      </g>
      <g fill="#ffc88a" opacity="0.8">
        <circle cx="37" cy="29" r="1.4" />
        <circle cx="59" cy="39" r="1.6" />
        <circle cx="75" cy="29" r="1.4" />
      </g>
      <g className="zoo-head">
        <circle cx="98" cy="19" r="8" fill="#fff" />
        <circle cx="113" cy="23" r="7.4" fill="#fff" />
        {EYE(100, 19, 5)}
        {EYE(114, 23, 4.6)}
        <path d="M108 40 q 5 4 11 0" stroke="#5a3a24" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="94" cy="38" r="4.2" fill="#ff9a8a" opacity="0.5" />
      </g>
    </>
  ),
};

/* Torsk: grøngrå-spættet med lys sidelinje og skægtråd under hagen. */
const torskKrop = (
  <path d="M32 44 C 36 20, 76 12, 112 16 C 132 18, 144 30, 146 42 C 146 52, 140 62, 124 66 C 96 74, 46 70, 32 44 Z" />
);

const cod: CreatureSpec = {
  name: "Torsk",
  height: 12,
  aspect: 150 / 84,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 0 150 84",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M36 44 C 26 38, 14 26, 3 14 C 8 30, 8 58, 3 72 C 14 62, 26 52, 36 44 Z" fill="#6f8a6a" />
        <path d="M32 44 L 8 26 M32 44 L 6 44 M32 44 L 8 62" stroke="#a9bfa0" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <path d="M48 20 C 50 6, 64 2, 74 16 Z" fill="#6f8a6a" />
      <path d="M78 16 C 82 2, 96 2, 102 16 Z" fill="#6f8a6a" />
      <path d="M106 18 C 112 8, 122 8, 126 20 Z" fill="#6f8a6a" />
      <path d="M62 68 C 66 82, 80 82, 86 70 Z" fill="#6f8a6a" />
      <path d="M92 70 C 96 82, 108 82, 112 68 Z" fill="#6f8a6a" />
      <Klip form={torskKrop}>
        <rect x="0" y="0" width="150" height="84" fill="#8da586" />
        <path d="M0 0 H150 V30 C 110 24, 60 24, 0 46 Z" fill="#6f8a6a" />
        <path d="M0 58 C 50 70, 100 70, 150 52 V84 H0 Z" fill="#e2e8d4" />
        <g fill="#5a7456" opacity="0.8">
          <circle cx="52" cy="32" r="3.6" />
          <circle cx="70" cy="26" r="3" />
          <circle cx="86" cy="34" r="3.8" />
          <circle cx="62" cy="44" r="3" />
          <circle cx="100" cy="28" r="3" />
          <circle cx="78" cy="46" r="2.6" />
          <circle cx="44" cy="46" r="2.6" />
          <circle cx="96" cy="46" r="2.4" />
        </g>
        <path d="M112 30 C 90 34, 56 36, 34 46" stroke="#eef3df" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </Klip>
      <path d="M104 24 C 110 36, 110 52, 104 62" stroke="#5a7456" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 54 C 108 58, 114 60, 116 58 C 112 52, 106 50, 100 54 Z" fill="#7a9674" />
      <path d="M126 66 C 124 72, 126 76, 130 78" stroke="#8da586" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="130" cy="79" r="2.4" fill="#8da586" />
      <g className="zoo-head">
        <circle cx="124" cy="34" r="8" fill="#fff" />
        {EYE(126, 34, 5.4)}
        <path d="M144 50 C 138 54, 130 54, 124 52" stroke="#4a6046" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="114" cy="48" r="4" fill="#ff9a8a" opacity="0.5" />
      </g>
    </>
  ),
};

/* Papegøjefisk: turkis/grøn/lyserød med næblignende mund. */
const papegojeKrop = (
  <path d="M32 46 C 36 22, 66 10, 98 12 C 124 14, 136 30, 136 48 C 136 66, 120 76, 98 78 C 66 80, 36 70, 32 46 Z" />
);

const parrotfish: CreatureSpec = {
  name: "Papegøjefisk",
  height: 12,
  aspect: 150 / 90,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 0 150 90",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M36 46 C 26 36, 14 22, 3 14 C 8 26, 5 36, 9 46 C 5 56, 8 66, 3 78 C 14 70, 26 58, 36 46 Z" fill="#ff8fb8" />
        <path d="M3 14 C 8 26, 5 36, 9 46 L 16 46 C 14 36, 12 26, 10 22 Z" fill="#2ec4b6" />
        <path d="M3 78 C 8 66, 5 56, 9 46 L 16 46 C 14 56, 12 66, 10 70 Z" fill="#2ec4b6" />
      </g>
      <path d="M44 22 C 48 6, 64 8, 70 4 C 80 10, 92 4, 100 12 C 84 12, 62 16, 50 30 Z" fill="#ff8fb8" />
      <path d="M44 22 C 48 8, 64 10, 70 6" stroke="#2ec4b6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M50 68 C 56 80, 70 84, 82 86 C 90 82, 96 80, 100 78 Z" fill="#ff8fb8" />
      <path d="M50 68 C 56 80, 70 84, 82 86" stroke="#2ec4b6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Klip form={papegojeKrop}>
        <rect x="0" y="0" width="150" height="90" fill="#2ec4b6" />
        <path d="M0 0 H150 V34 C 110 22, 60 26, 0 50 Z" fill="#5fcf7d" />
        <path d="M0 62 C 50 72, 100 72, 150 54 V90 H0 Z" fill="#ff9ec0" />
        <g stroke="#1fa093" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M44 36 q 5 4 0 8 M56 30 q 5 4 0 8 M56 46 q 5 4 0 8 M68 40 q 5 4 0 8 M68 24 q 5 4 0 8 M80 34 q 5 4 0 8 M80 50 q 5 4 0 8" />
        </g>
        <path d="M104 56 C 116 64, 130 64, 140 56 V 74 C 124 82, 108 78, 100 70 Z" fill="#ff8fb8" />
      </Klip>
      <path d="M90 52 C 80 54, 74 62, 78 68 C 90 68, 98 62, 100 56 Z" fill="#ffb3cd" />
      <g className="zoo-head">
        <path d="M126 40 C 138 34, 150 38, 150 48 L 128 50 Z" fill="#fff6dc" />
        <path d="M128 51 L 150 49 C 150 58, 142 64, 128 60 Z" fill="#f3e3b4" />
        <path d="M138 41 V 49.6 M144 40.4 V 49" stroke="#d8c48a" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M128 50.5 L 150 48.5" stroke="#d8c48a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M112 62 q 5 5 12 1" stroke="#1f7a70" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="112" cy="38" r="8.2" fill="#fff" />
        {EYE(114, 38, 5.4)}
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  angelfish,
  goldfish,
  guppy,
  neonTetra,
  butterflyfish,
  lionfish,
  flounder,
  cod,
  parrotfish,
};
