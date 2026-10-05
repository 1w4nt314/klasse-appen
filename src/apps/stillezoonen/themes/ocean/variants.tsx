import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Usædvanlige akvariedyr: varianter af havets dyr, som findes i virkeligheden.
 * Form, viewBox og bevægelige grupper er de samme som originalernes (se creatures.tsx).
 */

/* ---------- Sort klovnfisk ---------- */

const blackClownfish: CreatureSpec = {
  name: "Sort klovnfisk",
  rarity: "uncommon",
  height: 10,
  aspect: 120 / 76,
  gait: "swim",
  pace: 1.1,
  viewBox: "0 0 120 76",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M26 40 C 16 32, 8 22, 2 20 C 8 32, 8 48, 2 60 C 8 58, 18 48, 26 40 Z"
          fill="#2e1d16"
          stroke="#f58a2d"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </g>
      <path d="M44 16 C 52 -2, 84 -2, 96 16 Z" fill="#2e1d16" stroke="#f58a2d" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M58 62 C 62 72, 74 76, 80 66 Z" fill="#2e1d16" stroke="#f58a2d" strokeWidth="2.6" strokeLinejoin="round" />
      <ellipse cx="68" cy="40" rx="46" ry="29" fill="#3a251b" />
      {/* blød lysere bug */}
      <path d="M22.5 44 A46 29 0 0 0 113.5 44 C 96 56, 40 56, 22.5 44 Z" fill="#7a5340" opacity="0.5" />
      {/* hvide bånd bag gæl og ved halen */}
      <path d="M48 13.9 A46 29 0 0 1 60 11.4 L60 68.6 A46 29 0 0 1 48 66.1 Z" fill="#fff6ea" />
      <path d="M86 13.3 A46 29 0 0 1 96 17 L96 63 A46 29 0 0 1 86 66.7 Z" fill="#fff6ea" />
      {/* orange snude */}
      <path d="M104 21.95 A46 29 0 0 1 104 58.05 Q 98 40 104 21.95 Z" fill="#f58a2d" />
      <g className="zoo-head">
        <path
          d="M70 46 C 78 44, 82 54, 74 60 C 66 58, 64 50, 70 46 Z"
          fill="#2e1d16"
          stroke="#f58a2d"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {EYE(100, 34, 4.4)}
        <path d="M108 46 q 3 3 7 0" stroke="#7a2e10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="94" cy="47" r="4" fill="#ff9a8a" opacity="0.4" />
      </g>
    </>
  ),
};

/* ---------- Gul kirurgfisk ---------- */

const yellowTang: CreatureSpec = {
  name: "Gul kirurgfisk",
  rarity: "uncommon",
  height: 11,
  aspect: 132 / 90,
  gait: "swim",
  pace: 1,
  viewBox: "0 0 132 90",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M28 46 C 20 38, 12 24, 2 20 C 8 34, 8 58, 2 72 C 12 66, 20 54, 28 46 Z" fill="#ffe94a" />
      </g>
      <path d="M40 18 C 56 0, 100 0, 112 22 Z" fill="#f5cf14" />
      <path d="M52 70 C 62 86, 88 88, 96 72 Z" fill="#f5cf14" />
      <ellipse cx="74" cy="46" rx="50" ry="34" fill="#ffe21f" />
      <path d="M24.8 52 A50 34 0 0 0 123.2 52 C 104 64, 44 64, 24.8 52 Z" fill="#fff6a0" opacity="0.6" />
      <path d="M44 24 C 60 12, 86 14, 98 30 C 84 22, 62 22, 44 24 Z" fill="#fff59a" opacity="0.7" />
      {/* hvid "skalpel" ved halen */}
      <path d="M32 48 C 35 44, 41 43, 47 44.5 C 44 47, 44 50, 47 52.5 C 41 53.5, 35 52, 32 48 Z" fill="#ffffff" stroke="#f0c800" strokeWidth="1" strokeLinejoin="round" />
      <g className="zoo-head">
        <path d="M80 54 C 90 52, 92 64, 82 68 C 76 64, 74 58, 80 54 Z" fill="#ffd400" />
        {EYE(104, 38, 4.6)}
        <path d="M116 52 q 3 3 7 0" stroke="#a87c00" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Prikket kuglefisk ---------- */

const pigge = (vinkel: number, nøgle: string) => (
  <path key={nøgle} d="M-4 -40 L 0 -49 L 4 -40 Z" fill="#c4cfb4" transform={`translate(62 56) rotate(${vinkel})`} />
);

/** Hvide prikker på ryggen: [x, y, radius]. */
const kuglePrikker: [number, number, number][] = [
  [38, 40, 3],
  [47, 29, 3.2],
  [59, 22, 3],
  [71, 23, 3.4],
  [79, 23, 2.6],
  [51, 40, 2.6],
  [63, 35, 3.2],
  [72, 36, 2.4],
  [33, 53, 2.6],
  [42, 50, 2.4],
  [30, 62, 2.2],
  [53, 51, 2.2],
  [66, 47, 2.4],
  [92, 36, 2.2],
];

const spottedPuffer: CreatureSpec = {
  name: "Prikket kuglefisk",
  rarity: "uncommon",
  height: 11,
  aspect: 112 / 100,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 0 112 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M26 58 C 18 50, 10 44, 3 44 C 8 54, 8 66, 3 74 C 10 72, 18 66, 26 58 Z" fill="#6f8d66" />
      </g>
      {[-120, -95, -70, -45, -20, 5, 30, 55, 80, 105, 130, 155, 180, 205].map((a, i) => pigge(a, `sp-${i}`))}
      <circle cx="62" cy="56" r="40" fill="#8aa87c" />
      <path d="M26 66 C 36 96, 90 100, 100 68 C 90 80, 40 84, 26 66 Z" fill="#f6f3e4" />
      <path d="M30 40 C 40 22, 66 14, 88 22 C 70 22, 44 28, 30 40 Z" fill="#6f8d66" opacity="0.6" />
      {kuglePrikker.map(([x, y, r], i) => (
        <circle key={`pk-${i}`} cx={x} cy={y} r={r} fill="#fbfaf0" />
      ))}
      <path d="M52 62 C 64 58, 68 72, 56 76 C 48 74, 46 66, 52 62 Z" fill="#6f8d66" />
      <g className="zoo-head">
        <circle cx="86" cy="44" r="11" fill="#fff" />
        {EYE(88, 44, 6.4)}
        <ellipse cx="100" cy="62" rx="6.4" ry="5.2" fill="#d99a82" />
        <ellipse cx="102" cy="62" rx="2.4" ry="2" fill="#8a4a38" />
        <circle cx="86" cy="62" r="5" fill="#ff9a8a" opacity="0.5" />
      </g>
    </>
  ),
};

/* ---------- Grøn havskildpadde ---------- */

const greenTurtle: CreatureSpec = {
  name: "Grøn havskildpadde",
  rarity: "uncommon",
  height: 19,
  aspect: 210 / 122,
  gait: "swim",
  pace: 0.6,
  viewBox: "0 0 210 122",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M44 84 C 34 86, 18 94, 4 108 C 22 112, 38 104, 50 96 Z" fill="#8a9a4a" />
      </g>
      <g className="zoo-tail">
        <path d="M128 78 C 100 80, 66 96, 46 114 C 42 120, 50 124, 58 122 C 90 118, 124 106, 136 92 Z" fill="#6f8238" />
      </g>
      <path d="M32 80 C 38 98, 160 100, 176 80 Z" fill="#ecd98e" />
      <path d="M34 82 C 34 36, 86 18, 124 24 C 160 30, 176 58, 172 82 Z" fill="#9a6628" />
      <path d="M60 50 L 86 36 L 116 40 L 128 62 L 104 76 L 70 72 Z" fill="#d8aa52" />
      <path d="M128 46 L 152 52 L 156 72 L 134 78 Z" fill="#d8aa52" opacity="0.9" />
      <path d="M46 62 L 60 56 L 66 76 L 42 80 Z" fill="#d8aa52" opacity="0.9" />
      {/* strålemønster på skjoldet */}
      <path
        d="M86 36 L 90 52 M116 40 L 104 54 M128 62 L 108 62 M104 76 L 98 62 M70 72 L 86 62 M60 50 L 78 54 M90 52 L 104 54 L 108 62 L 98 62 L 86 62 L 78 54 Z"
        stroke="#7a4a1a"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M38 70 C 60 78, 150 78, 172 70 L 172 82 L 34 82 Z" fill="#5a3a14" opacity="0.45" />
      <g className="zoo-head">
        <path d="M160 68 C 170 62, 182 60, 190 64 L 190 84 C 182 86, 168 86, 158 84 Z" fill="#8a9a4a" />
        <circle cx="190" cy="68" r="19" fill="#9fb057" />
        <ellipse cx="202" cy="76" rx="9" ry="6" fill="#b9c778" />
        {EYE(194, 62, 4.2)}
        <circle cx="187" cy="76" r="4" fill="#ff9a8a" opacity="0.5" />
        <path d="M200 80 q 4 3 8 -1" stroke="#5a6a28" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-tail">
        <path d="M158 76 C 130 74, 96 90, 76 110 C 72 117, 80 123, 90 121 C 124 114, 160 102, 168 88 Z" fill="#7d9040" />
      </g>
    </>
  ),
};

/* ---------- Kompasvandmand ---------- */

/** Brune V-striber, der stråler ud fra toppen som et kompas: [vinkel fra lodret, længde]. */
const kompasStriber: [number, number][] = [
  [-72, 26],
  [-54, 34],
  [-36, 34],
  [-18, 27],
  [18, 27],
  [36, 34],
  [54, 34],
  [72, 26],
];

/** En kileformet stribe fra klokkens top (50, 10) ud i retning `vinkel`. */
const kompasStribe = (vinkel: number, laengde: number) => {
  const v = (vinkel * Math.PI) / 180;
  const dx = Math.sin(v);
  const dy = Math.cos(v);
  const hx = laengde * dx;
  const hy = laengde * dy;
  const px = 3.4 * dy;
  const py = -3.4 * dx;
  const r = (n: number) => +n.toFixed(2);
  return `M50 10 L ${r(50 + hx + px)} ${r(10 + hy + py)} L ${r(50 + hx - px)} ${r(10 + hy - py)} Z`;
};

const compassJelly: CreatureSpec = {
  name: "Kompasvandmand",
  rarity: "uncommon",
  height: 16,
  aspect: 100 / 130,
  gait: "float",
  pace: 0.7,
  viewBox: "0 0 100 130",
  art: (
    <>
      {/* lange, tynde fangarme */}
      <g fill="none" strokeLinecap="round">
        <path d="M22 66 C 14 88, 30 100, 20 128" stroke="#d7a64a" strokeWidth="1.8" />
        <path d="M32 68 C 24 90, 40 104, 32 126" stroke="#e8c070" strokeWidth="1.8" />
        <path d="M42 70 C 36 92, 50 106, 42 128" stroke="#d7a64a" strokeWidth="1.8" />
        <path d="M58 70 C 64 92, 50 106, 58 128" stroke="#e8c070" strokeWidth="1.8" />
        <path d="M68 68 C 76 90, 60 104, 68 126" stroke="#d7a64a" strokeWidth="1.8" />
        <path d="M78 66 C 86 88, 70 100, 80 128" stroke="#e8c070" strokeWidth="1.8" />
        <path d="M38 62 C 34 78, 46 84, 42 100" stroke="#fbe9b0" strokeWidth="6" />
        <path d="M54 62 C 58 78, 46 86, 52 104" stroke="#fbe9b0" strokeWidth="6" />
      </g>
      <g className="zoo-torso">
        <path
          d="M10 64 C 8 22, 28 4, 50 4 C 72 4, 92 22, 90 64 C 82 72, 74 72, 70 64 C 64 72, 56 72, 50 64 C 44 72, 36 72, 30 64 C 26 72, 18 72, 10 64 Z"
          fill="#fff4d2"
        />
        <path d="M14 58 C 13 48, 15 42, 20 38 C 18 46, 20 52, 22 58 Z" fill="#ffffff" opacity="0.7" />
        <path d="M10 64 C 18 72, 22 70, 30 64 C 36 72, 44 72, 50 64 C 56 72, 64 72, 70 64 C 74 72, 82 72, 90 64 C 90 58, 88 56, 86 54 C 80 62, 74 62, 70 58 C 64 64, 56 64, 50 60 C 44 64, 36 64, 30 58 C 26 62, 20 62, 14 54 C 12 56, 10 60, 10 64 Z" fill="#f2cf79" opacity="0.8" />
        {kompasStriber.map(([v, l], i) => (
          <path key={`ks-${i}`} d={kompasStribe(v, l)} fill="#a8672a" />
        ))}
        <circle cx="50" cy="10" r="4" fill="#a8672a" />
        <path d="M16 54 C 15 32, 28 16, 44 12 C 34 22, 28 38, 30 54 Z" fill="#ffffff" opacity="0.55" />
      </g>
      <g className="zoo-head">
        {EYE(52, 48, 4.4)}
        {EYE(72, 48, 4.4)}
        <path d="M58 57 q 4 4 8 0" stroke="#8a5a24" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="46" cy="56" r="3.4" fill="#ff8aa0" opacity="0.45" />
        <circle cx="80" cy="56" r="3.4" fill="#ff8aa0" opacity="0.45" />
      </g>
    </>
  ),
};

/* ---------- Gul søhest ---------- */

const søhestPrikker: [number, number][] = [
  [30, 46],
  [40, 52],
  [30, 60],
  [41, 66],
  [29, 76],
  [38, 82],
  [24, 114],
  [30, 122],
];

const yellowSeahorse: CreatureSpec = {
  name: "Gul søhest",
  rarity: "uncommon",
  height: 15,
  aspect: 76 / 130,
  gait: "float",
  pace: 0.7,
  viewBox: "0 0 76 130",
  art: (
    <>
      <path d="M18 56 C 8 52, 6 70, 16 78 C 20 70, 22 62, 22 58 Z" fill="#fff0a8" />
      <path d="M17 60 l -7 3 M17 66 l -8 3 M18 72 l -6 4" stroke="#e8c020" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M30 84 C 28 106, 14 108, 18 122 C 21 130, 36 130, 38 120 C 40 112, 30 112, 32 108 C 36 100, 42 96, 40 86 Z"
        fill="#f5c722"
      />
      <path d="M24 36 C 18 52, 14 70, 22 86 C 28 96, 44 96, 48 84 C 52 70, 50 50, 44 38 Z" fill="#ffd93a" />
      <path d="M34 38 C 44 40, 54 52, 52 68 C 50 80, 44 88, 38 90 C 44 78, 44 56, 34 38 Z" fill="#fff0a0" />
      <path d="M26 52 h 20 M25 62 h 22 M26 72 h 20 M28 82 h 16" stroke="#e6b418" strokeWidth="2.4" strokeLinecap="round" />
      {søhestPrikker.map(([x, y], i) => (
        <circle key={`sp-${i}`} cx={x} cy={y} r="1.9" fill="#c98512" />
      ))}
      <path d="M22 28 l -6 -10 l 8 4 l 2 -10 l 6 8 l 6 -8 z" fill="#e8b020" />
      <g className="zoo-head">
        <circle cx="36" cy="30" r="15" fill="#ffd93a" />
        <path d="M44 28 C 54 26, 62 28, 70 30 C 72 33, 70 36, 66 36 C 58 38, 50 40, 44 42 Z" fill="#ffe97a" />
        <path d="M70 31 q 3 1 0 4" stroke="#b5780f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="22" r="1.8" fill="#c98512" />
        <circle cx="49" cy="33" r="1.5" fill="#c98512" />
        <circle cx="58" cy="32" r="1.5" fill="#c98512" />
        {EYE(40, 26, 4)}
        <circle cx="40" cy="38" r="3.2" fill="#ff8aa0" opacity="0.5" />
      </g>
    </>
  ),
};

/* ---------- Blåringet blæksprutte ---------- */

/** Lysende blå ring: sandfarvet midte med blå kant. */
const blåRing = (x: number, y: number, r: number, nøgle: string) => (
  <g key={nøgle}>
    <circle cx={x} cy={y} r={r} fill="#c9922f" stroke="#2fb0ff" strokeWidth={Math.max(1.6, r * 0.38)} />
    <circle cx={x} cy={y} r={r * 0.35} fill="#8a5a1a" />
  </g>
);

const mantelRinge: [number, number, number][] = [
  [52, 46, 6],
  [64, 24, 5],
  [80, 18, 6.4],
  [99, 22, 5],
  [66, 38, 5],
  [88, 32, 5.6],
  [112, 32, 4.4],
  [56, 62, 4],
];

const armRinge: [number, number, number][] = [
  [24, 96, 3.2],
  [48, 106, 3.2],
  [84, 106, 3.2],
  [114, 106, 3.2],
  [38, 119, 2.8],
  [122, 121, 2.8],
];

const blueRingedOctopus: CreatureSpec = {
  name: "Blåringet blæksprutte",
  rarity: "uncommon",
  height: 12,
  aspect: 150 / 130,
  gait: "float",
  pace: 0.8,
  viewBox: "0 0 150 130",
  art: (
    <>
      <g fill="none" strokeLinecap="round">
        <path d="M52 80 C 34 92, 50 108, 30 114 C 22 116, 16 112, 14 106" stroke="#c29236" strokeWidth="11" />
        <path d="M70 84 C 56 100, 72 116, 54 124" stroke="#c29236" strokeWidth="11" />
        <path d="M96 84 C 108 100, 92 114, 106 124" stroke="#c29236" strokeWidth="11" />
        <path d="M112 78 C 128 90, 116 106, 134 112 C 140 114, 144 110, 144 104" stroke="#c29236" strokeWidth="11" />
      </g>
      <g className="zoo-torso">
        <g fill="none" strokeLinecap="round">
          <path d="M44 76 C 22 80, 26 102, 8 100" stroke="#e0b256" strokeWidth="12" />
          <path d="M62 82 C 48 96, 56 114, 40 122" stroke="#e0b256" strokeWidth="12" />
          <path d="M84 84 C 82 100, 76 112, 84 124" stroke="#e0b256" strokeWidth="12" />
          <path d="M106 82 C 118 96, 108 112, 122 122" stroke="#e0b256" strokeWidth="12" />
        </g>
        <g fill="#fbebb8">
          <circle cx="12" cy="99" r="2.2" />
          <circle cx="42" cy="119" r="2.2" />
          <circle cx="83" cy="119" r="2.2" />
          <circle cx="118" cy="118" r="2.2" />
          <circle cx="112" cy="98" r="2.2" />
          <circle cx="60" cy="104" r="2.2" />
        </g>
        {armRinge.map(([x, y, r], i) => blåRing(x, y, r, `ar-${i}`))}
        <ellipse cx="82" cy="44" rx="44" ry="40" fill="#edc668" transform="rotate(8 82 44)" />
        <path d="M46 50 C 46 28, 58 14, 76 12 C 62 22, 56 36, 58 54 Z" fill="#fbe7a6" opacity="0.7" />
        {mantelRinge.map(([x, y, r], i) => blåRing(x, y, r, `mr-${i}`))}
      </g>
      <g className="zoo-head">
        <circle cx="86" cy="52" r="9.5" fill="#fff" />
        <circle cx="112" cy="52" r="9.5" fill="#fff" />
        {EYE(89, 52, 6)}
        {EYE(115, 52, 6)}
        <path d="M94 70 q 8 6 16 0" stroke="#7a4a14" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="76" cy="68" r="4.4" fill="#ff8aa0" opacity="0.5" />
      </g>
    </>
  ),
};

/* ---------- Blå krabbe ---------- */

const benFarve = "#3f7c8a";
const krabbeBen = (d: string) => (
  <path d={d} stroke={benFarve} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

const blueCrab: CreatureSpec = {
  name: "Blå krabbe",
  rarity: "uncommon",
  height: 8,
  aspect: 130 / 72,
  gait: "walk",
  pace: 1,
  zone: "ground",
  viewBox: "0 0 130 72",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M38 50 L 22 50 L 18 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M40 57 L 26 61 L 24 68")}</g>
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M50 62 L 41 66 L 39 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M92 50 L 108 50 L 112 68")}</g>
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M90 57 L 104 61 L 106 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M80 62 L 89 66 L 91 68")}</g>
      <g className="zoo-torso">
        <path d="M30 24 C 24 8, 10 6, 6 16 C 4 26, 14 32, 22 32 Z" fill="#6a9f80" />
        <path d="M100 24 C 106 8, 120 6, 124 16 C 126 26, 116 32, 108 32 Z" fill="#6a9f80" />
        {/* knallert-blå kloespidser */}
        <path d="M15 16 L 4 1 L 25 7 Z" fill="#1f6fe6" />
        <path d="M115 16 L 126 1 L 105 7 Z" fill="#1f6fe6" />
        <path d="M26 36 C 26 30, 32 28, 38 30 M104 36 C 104 30, 98 28, 92 30" stroke={benFarve} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* sidespidser på rygskjoldet */}
        <path d="M30 40 L 20 44 L 31 50 Z" fill="#3f7480" />
        <path d="M100 40 L 110 44 L 99 50 Z" fill="#3f7480" />
        <ellipse cx="65" cy="46" rx="38" ry="22" fill="#70aa86" />
        <ellipse cx="65" cy="56" rx="30" ry="10" fill="#b4d6c4" opacity="0.55" />
        <circle cx="48" cy="38" r="2.6" fill="#8fb8a0" />
        <circle cx="82" cy="38" r="2.6" fill="#8fb8a0" />
        <circle cx="65" cy="36" r="2.2" fill="#8fb8a0" />
      </g>
      <g className="zoo-head">
        <path d="M54 30 V 20 M76 30 V 20" stroke={benFarve} strokeWidth="4" strokeLinecap="round" />
        <circle cx="54" cy="16" r="8" fill="#fff" />
        <circle cx="76" cy="16" r="8" fill="#fff" />
        {EYE(55, 16, 4.6)}
        {EYE(77, 16, 4.6)}
        <path d="M58 48 q 7 6 14 0" stroke="#2f5a64" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="46" r="4.2" fill="#ffa89a" opacity="0.5" />
        <circle cx="86" cy="46" r="4.2" fill="#ffa89a" opacity="0.5" />
      </g>
    </>
  ),
};

export const variants: Record<string, CreatureSpec> = {
  blackClownfish,
  yellowTang,
  spottedPuffer,
  greenTurtle,
  compassJelly,
  yellowSeahorse,
  blueRingedOctopus,
  blueCrab,
};
