import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Usædvanlige bondegårdsdyr (uncommon): rigtige husdyrracer som varianter af
 * ko, får, gris, høne, hest, kanin og ged i creatures.tsx. Samme konventioner:
 * profil mod højre, fødderne på viewBox' bund, ben i zoo-leg-a/b.
 */

/** En tilspidset hårtot der hænger nedad (højlandskoens pjuskede pels). */
function tot(x: number, y: number, w: number, l: number, hæld = 0): string {
  return `M${x - w / 2} ${y} Q${x - w / 2 + hæld * 0.3} ${y + l * 0.6} ${x + hæld} ${y + l} Q${x + w / 2 + hæld * 0.3} ${y + l * 0.6} ${x + w / 2} ${y} Z`;
}

const HÅR_FARVER = ["#8a3a18", "#b85a28", "#7e3416", "#a84e20"] as const;

/** Rækker af hårtotter langs en kant: x-liste, startY, længde. */
function totRække(xs: number[], y: number, l: number, w: number, forskyd = 0, toppen?: (x: number) => number) {
  return xs.map((x, i) => {
    const xx = x + forskyd;
    const yy = toppen ? Math.max(y, toppen(xx)) : y;
    return <path key={`${y}-${x}`} d={tot(xx, yy, w, l + ((i * 5) % 3) * 4, -3 - (i % 2) * 2)} fill={HÅR_FARVER[i % 4]} />;
  });
}

/** Y for toppen af højlandskoens krop ved et givet x (ellipsen cx100 cy72 rx72 ry42). */
const højlandToppen = (x: number) => 72 - 42 * Math.sqrt(Math.max(0, 1 - ((x - 100) / 72) ** 2)) + 3;

/** En krøllet, hængende lokke der ender i en lille krølle (d = +1/-1 for krøllens retning). */
function lokke(x: number, y: number, l: number, d = 1): string {
  return `M${x} ${y} C ${x + 6 * d} ${y + l * 0.25}, ${x - 6 * d} ${y + l * 0.5}, ${x} ${y + l * 0.72} a 5.5 5.5 0 1 ${d > 0 ? 1 : 0} ${-8 * d} ${-2}`;
}

/* ---------- Jerseyko: ensfarvet karamel, lys ring om mulen, store øjne ---------- */

const jerseyCow: CreatureSpec = {
  name: "Jerseyko",
  rarity: "uncommon",
  height: 20,
  aspect: 220 / 150,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 220 150",
  art: (
    <>
      <path d="M34 58 C 18 64, 18 88, 24 104" stroke="#8a5a34" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="108" rx="6" ry="9" fill="#4a2f1f" />
      <ellipse cx="80" cy="104" rx="13" ry="9" fill="#f3a9b4" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="128" y="88" width="18" height="60" rx="7" fill="#a8723f" />
        <rect x="128" y="138" width="18" height="10" rx="4" fill="#3d2a1f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="88" width="18" height="60" rx="7" fill="#a8723f" />
        <rect x="46" y="138" width="18" height="10" rx="4" fill="#3d2a1f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="70" rx="68" ry="38" fill="#c98e55" />
        <ellipse cx="100" cy="88" rx="50" ry="14" fill="#dba974" opacity="0.7" />
        <ellipse cx="72" cy="52" rx="22" ry="10" fill="#b87b45" opacity="0.55" />
        <path d="M128 44 C 142 40, 152 50, 154 66 C 146 72, 132 66, 128 44 Z" fill="#b07440" opacity="0.6" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="146" y="90" width="19" height="58" rx="7" fill="#c98e55" />
        <rect x="146" y="138" width="19" height="10" rx="4" fill="#3d2a1f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="90" width="19" height="58" rx="7" fill="#c98e55" />
        <rect x="62" y="138" width="19" height="10" rx="4" fill="#3d2a1f" />
      </g>
      <g className="zoo-head">
        <path d="M162 40 C 160 32, 162 28, 166 26 C 166 32, 168 36, 172 38 Z" fill="#f0e2c4" />
        <ellipse cx="156" cy="48" rx="15" ry="8" transform="rotate(-18 156 48)" fill="#b07440" />
        <ellipse cx="155" cy="48" rx="8" ry="4" transform="rotate(-18 155 48)" fill="#e9a99a" />
        <ellipse cx="178" cy="60" rx="24" ry="22" fill="#c28549" />
        <ellipse cx="173" cy="50" rx="14" ry="11" fill="#a56c3a" />
        <ellipse cx="193" cy="76" rx="19" ry="15" fill="#f5e6cc" />
        <ellipse cx="196" cy="77" rx="14" ry="10.5" fill="#6b4632" />
        <ellipse cx="203" cy="75" rx="2.4" ry="3.4" fill="#3d2a1f" />
        <ellipse cx="192" cy="77" rx="2.4" ry="3.4" fill="#3d2a1f" />
        <path d="M170 36 C 172 28, 178 26, 183 28 C 181 33, 177 36, 173 39 Z" fill="#f0e2c4" />
        <circle cx="184" cy="55" r="7.2" fill="#fff6e6" />
        {EYE(185, 55, 5.6)}
      </g>
    </>
  ),
};

/* ---------- Højlandsko: rødbrun, langt pjusket hår, pandelok og lange horn ---------- */

const highlandCow: CreatureSpec = {
  name: "Højlandsko",
  rarity: "uncommon",
  height: 20,
  aspect: 220 / 150,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 220 150",
  art: (
    <>
      <path d="M34 62 C 18 70, 20 92, 26 108" stroke="#7a3216" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M26 100 C 14 108, 14 124, 26 128 C 38 124, 38 108, 26 100 Z" fill="#3a1d10" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="128" y="96" width="19" height="52" rx="8" fill="#7e3416" />
        <rect x="128" y="139" width="19" height="9" rx="4" fill="#2b1d17" />
        {totRække([131, 138, 145], 102, 16, 9)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="96" width="19" height="52" rx="8" fill="#7e3416" />
        <rect x="46" y="139" width="19" height="9" rx="4" fill="#2b1d17" />
        {totRække([49, 56, 63], 102, 16, 9)}
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="72" rx="72" ry="42" fill="#a84e20" />
        <ellipse cx="124" cy="52" rx="34" ry="22" fill="#b85a28" />
        <path d="M60 40 C 80 34, 100 36, 120 40" stroke="#c8723a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {totRække([44, 58, 72, 86, 100, 114, 128, 142, 156], 36, 46, 15, 0, højlandToppen)}
        {totRække([44, 58, 72, 86, 100, 114, 128, 142, 156], 64, 40, 15, 7)}
        {Array.from({ length: 14 }, (_, i) => {
          const x = 40 + i * 9;
          const yb = 72 + 42 * Math.sqrt(1 - ((x - 100) / 72) ** 2);
          return <path key={`b${i}`} d={tot(x, yb - 12, 11, 20 + ((i * 5) % 3) * 4, -3)} fill={HÅR_FARVER[(i + 1) % 4]} />;
        })}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="146" y="98" width="20" height="50" rx="8" fill="#a84e20" />
        <rect x="146" y="139" width="20" height="9" rx="4" fill="#2b1d17" />
        {totRække([149, 156, 163], 104, 16, 9)}
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="98" width="20" height="50" rx="8" fill="#a84e20" />
        <rect x="62" y="139" width="20" height="9" rx="4" fill="#2b1d17" />
        {totRække([65, 72, 79], 104, 16, 9)}
      </g>
      <g className="zoo-head">
        <path d="M164 36 C 152 32, 142 20, 142 4" stroke="#e6d7b4" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M164 36 C 152 32, 142 20, 142 4" pathLength="100" stroke="#4a3a30" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="0 80 20" />
        <path d="M156 54 C 142 50, 134 58, 136 66 C 146 70, 154 66, 160 62 Z" fill="#7e3416" />
        <path d="M156 54 C 146 52, 140 56, 140 62" stroke="#c8723a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="178" cy="60" rx="26" ry="24" fill="#a84e20" />
        <ellipse cx="196" cy="76" rx="18" ry="14" fill="#3b2a26" />
        <ellipse cx="204" cy="74" rx="2.6" ry="3.6" fill="#7a5a52" />
        <ellipse cx="192" cy="76" rx="2.6" ry="3.6" fill="#7a5a52" />
        <path d="M168 78 L 172 94 L 177 80 L 182 96 L 186 82 L 190 90 L 190 80 Z" fill="#8a3a18" />
        <path d="M168 36 C 184 32, 204 28, 214 6" stroke="#f0e2c0" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M168 36 C 184 32, 204 28, 214 6" pathLength="100" stroke="#4a3a30" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="0 80 20" />
        <circle cx="186" cy="59" r="6" fill="#f3e0c0" />
        <path d="M158 38 C 166 28, 190 28, 200 38 L 196 44 L 160 44 Z" fill="#7e3416" />
        {[162, 170, 178, 190, 197].map((x, i) => (
          <path key={x} d={tot(x, 36, 9, [26, 30, 22, 28, 24][i], -2)} fill={HÅR_FARVER[i % 4]} />
        ))}
        {EYE(186, 59, 4)}
        <path d={tot(184, 40, 7, 17, 1)} fill="#8a3a18" />
        <path d={tot(190, 40, 6, 12, 1)} fill="#7e3416" />
        <path d="M162 36 C 172 31, 188 31, 196 38" stroke="#c8723a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Sort får: som får, men mørkegrå uld og sort ansigt ---------- */

const SORT_ULD: ReadonlyArray<readonly [number, number, number]> = [
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

const blackSheep: CreatureSpec = {
  name: "Sort får",
  rarity: "uncommon",
  height: 13,
  aspect: 170 / 120,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 170 120",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="84" width="10" height="36" rx="5" fill="#161314" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="84" width="10" height="36" rx="5" fill="#161314" />
      </g>
      <g className="zoo-torso">
        <circle cx="30" cy="62" r="11" fill="#45434b" />
        {SORT_ULD.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 1 ? "#55535d" : "#45434b"} />
        ))}
        <circle cx="96" cy="58" r="14" fill="#62606b" />
        <circle cx="58" cy="60" r="12" fill="#62606b" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="116" y="86" width="11" height="34" rx="5" fill="#26221f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="86" width="11" height="34" rx="5" fill="#26221f" />
      </g>
      <g className="zoo-head">
        <ellipse cx="124" cy="54" rx="12" ry="6" transform="rotate(24 124 54)" fill="#26221f" />
        <ellipse cx="142" cy="62" rx="17" ry="21" transform="rotate(-12 142 62)" fill="#1c1819" />
        <circle cx="134" cy="38" r="12" fill="#62606b" />
        <circle cx="146" cy="40" r="9" fill="#52505a" />
        <ellipse cx="152" cy="76" rx="7" ry="5" fill="#5a4a4c" />
        <circle cx="145" cy="55" r="6" fill="#f2e6b8" />
        {EYE(146, 55, 3.8)}
      </g>
    </>
  ),
};

/* ---------- Sadelgris: sort med bredt hvidt bælte over skuldre og forben ---------- */

const saddlebackPig: CreatureSpec = {
  name: "Sadelgris",
  rarity: "uncommon",
  height: 13,
  aspect: 170 / 110,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 170 110",
  art: (
    <>
      <defs>
        <clipPath id="sadelgris-krop">
          <ellipse cx="82" cy="58" rx="58" ry="36" />
        </clipPath>
      </defs>
      <path d="M30 52 C 14 44, 12 62, 24 58 C 16 68, 32 70, 30 62" stroke="#2a272d" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="78" width="18" height="32" rx="7" fill="#e6e2da" />
        <rect x="104" y="103" width="18" height="7" rx="3" fill="#4a4048" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="78" width="18" height="32" rx="7" fill="#1f1d22" />
        <rect x="38" y="103" width="18" height="7" rx="3" fill="#3a3238" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="82" cy="58" rx="58" ry="36" fill="#2f2d34" />
        <ellipse cx="82" cy="78" rx="40" ry="12" fill="#45424b" opacity="0.7" />
        <g clipPath="url(#sadelgris-krop)">
          <path d="M82 16 L 112 16 L 134 100 L 100 100 Z" fill="#f8f5ee" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="118" y="80" width="19" height="30" rx="7" fill="#f8f5ee" />
        <rect x="118" y="103" width="19" height="7" rx="3" fill="#4a4048" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="80" width="19" height="30" rx="7" fill="#2f2d34" />
        <rect x="52" y="103" width="19" height="7" rx="3" fill="#463e45" />
      </g>
      <g className="zoo-head">
        <circle cx="130" cy="54" r="26" fill="#2f2d34" />
        <path d="M110 40 C 106 20, 124 14, 136 26 C 130 34, 120 40, 110 40 Z" fill="#1a181c" />
        <ellipse cx="152" cy="62" rx="15" ry="12" fill="#7d6168" />
        <ellipse cx="156" cy="61" rx="2.4" ry="3.6" fill="#3e2c32" />
        <ellipse cx="148" cy="62" rx="2.4" ry="3.6" fill="#3e2c32" />
        <circle cx="122" cy="66" r="6" fill="#403d46" opacity="0.7" />
        <circle cx="138" cy="46" r="6.4" fill="#e9dcc0" />
        {EYE(138, 46, 4)}
      </g>
    </>
  ),
};

/* ---------- Silkehøne: hvid, ekstremt fluffy, lille mørk kam, blålig ansigt, fjerfødder ---------- */

/** Dunsky: en klynge cirkler langs kanten af en ellipse. */
function dunKant(cx: number, cy: number, rx: number, ry: number, antal: number, r: number, start = 0) {
  return Array.from({ length: antal }, (_, i) => {
    const v = start + (i / antal) * Math.PI * 2;
    return <circle key={i} cx={cx + rx * Math.cos(v)} cy={cy + ry * Math.sin(v)} r={r} fill={i % 2 ? "#ffffff" : "#f6f3fb"} stroke="#e1dbef" strokeWidth="1" />;
  });
}

const silkieHen: CreatureSpec = {
  name: "Silkehøne",
  rarity: "uncommon",
  height: 9,
  aspect: 120 / 120,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 120 120",
  art: (
    <>
      <circle cx="24" cy="50" r="13" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
      <circle cx="16" cy="40" r="11" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
      <circle cx="30" cy="38" r="11" fill="#f9f7fd" stroke="#e1dbef" strokeWidth="1" />
      <circle cx="12" cy="54" r="9" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M54 88 V 112" stroke="#52627c" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="54" cy="100" r="8" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="49" cy="108" r="7" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="59" cy="108" r="7" fill="#f9f7fd" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="44" cy="114" r="5.5" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="54" cy="115" r="5.5" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="64" cy="114" r="5.5" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M72 88 V 112" stroke="#46556f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="72" cy="100" r="8" fill="#ece8f4" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="67" cy="108" r="7" fill="#f6f3fb" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="77" cy="108" r="7" fill="#f1eef8" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="62" cy="114" r="5.5" fill="#f6f3fb" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="72" cy="115" r="5.5" fill="#ece8f4" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="82" cy="114" r="5.5" fill="#f6f3fb" stroke="#e1dbef" strokeWidth="1" />
      </g>
      <g className="zoo-torso">
        {dunKant(60, 70, 36, 28, 14, 12)}
        <ellipse cx="60" cy="70" rx="36" ry="28" fill="#fcfbff" />
        {dunKant(78, 62, 14, 18, 8, 9, 0.4)}
        <circle cx="44" cy="62" r="13" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="58" cy="82" r="14" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="38" cy="78" r="11" fill="#f9f7fd" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="76" cy="84" r="11" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <path d="M30 70 q 8 -8 18 -2 M46 80 q 8 -8 18 -2 M40 56 q 8 -8 18 -2" stroke="#dcd6ea" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="84" cy="40" r="18" fill="#fdfcff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="72" cy="40" r="11" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="70" cy="22" r="10" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="82" cy="16" r="11" fill="#f9f7fd" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="94" cy="20" r="9" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="78" cy="30" r="8" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <ellipse cx="92" cy="42" rx="11" ry="12" fill="#7fa3cc" />
        <circle cx="97" cy="30" r="3.4" fill="#5a2a48" />
        <circle cx="93" cy="28" r="3" fill="#6e3558" />
        <path d="M100 41 L 109 45 L 100 49 Z" fill="#6c7585" />
        <circle cx="80" cy="55" r="9" fill="#ffffff" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="90" cy="59" r="8" fill="#f4f1fa" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="72" cy="52" r="8" fill="#f9f7fd" stroke="#e1dbef" strokeWidth="1" />
        <circle cx="93" cy="38" r="5.4" fill="#cfe0f2" />
        {EYE(93, 38, 3.6)}
      </g>
    </>
  ),
};

/* ---------- Knabstrupper: hvid hest med mange sorte/brune pletter og lys man ---------- */

const KNAB_PLETTER: ReadonlyArray<readonly [number, number, number]> = [
  [52, 96, 6], [64, 84, 5], [48, 114, 5], [70, 108, 7], [84, 94, 5], [92, 118, 6],
  [100, 80, 5], [112, 102, 7], [120, 122, 5], [128, 92, 6], [140, 110, 5], [150, 126, 4],
  [156, 98, 6], [166, 114, 5], [76, 126, 4], [60, 128, 4], [88, 106, 3.5], [104, 92, 3.5],
  [136, 78, 5], [148, 64, 5], [160, 52, 4], [172, 86, 5], [176, 70, 4], [168, 100, 4],
  [182, 56, 3.5], [144, 94, 3], [42, 80, 4], [118, 84, 3.5],
];

const knabstrupper: CreatureSpec = {
  name: "Knabstrupper",
  rarity: "uncommon",
  height: 26,
  aspect: 250 / 210,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 250 210",
  art: (
    <>
      <defs>
        <clipPath id="knab-krop">
          <ellipse cx="108" cy="104" rx="72" ry="34" />
          <path d="M138 84 C 148 54, 166 36, 190 28 L 218 50 C 200 62, 192 84, 184 114 Z" />
        </clipPath>
        <clipPath id="knab-hoved">
          <path d="M186 24 C 200 16, 216 22, 224 36 C 232 48, 246 64, 244 74 C 240 82, 228 80, 220 74 C 208 68, 198 60, 190 50 C 184 42, 182 32, 186 24 Z" />
        </clipPath>
      </defs>
      <path d="M44 96 C 22 98, 12 128, 18 162 C 28 144, 34 128, 50 112 Z" fill="#d8ccb2" />
      <path d="M40 104 C 26 112, 22 134, 24 152 C 30 138, 36 124, 46 112 Z" fill="#bcae92" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="142" y="112" width="15" height="98" rx="7" fill="#e4ddd0" />
        <circle cx="149.5" cy="150" r="4" fill="#4a352c" />
        <circle cx="149.5" cy="176" r="3" fill="#7a4a2c" />
        <rect x="142" y="198" width="15" height="12" rx="4" fill="#5a4a42" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="48" y="112" width="15" height="98" rx="7" fill="#e4ddd0" />
        <circle cx="55.5" cy="140" r="4.5" fill="#4a352c" />
        <circle cx="55.5" cy="170" r="3" fill="#7a4a2c" />
        <rect x="48" y="198" width="15" height="12" rx="4" fill="#5a4a42" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="108" cy="104" rx="72" ry="34" fill="#f6f2ea" />
        <path d="M138 84 C 148 54, 166 36, 190 28 L 218 50 C 200 62, 192 84, 184 114 Z" fill="#f6f2ea" />
        <ellipse cx="108" cy="124" rx="48" ry="10" fill="#ebe4d6" opacity="0.7" />
        <g clipPath="url(#knab-krop)">
          {KNAB_PLETTER.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 2 ? "#8a5a3a" : "#3a2b25"} />
          ))}
        </g>
        <path d="M130 86 C 138 54, 158 32, 190 22 L 192 36 C 172 44, 160 60, 152 92 Z" fill="#d8ccb2" />
        <path d="M136 84 C 144 58, 160 40, 186 28" stroke="#bcae92" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="158" y="114" width="16" height="96" rx="7" fill="#f6f2ea" />
        <circle cx="166" cy="146" r="4.5" fill="#3a2b25" />
        <circle cx="166" cy="172" r="3" fill="#8a5a3a" />
        <rect x="158" y="198" width="16" height="12" rx="4" fill="#5a4a42" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="114" width="16" height="96" rx="7" fill="#f6f2ea" />
        <circle cx="70" cy="144" r="4.5" fill="#3a2b25" />
        <circle cx="70" cy="176" r="3" fill="#8a5a3a" />
        <rect x="62" y="198" width="16" height="12" rx="4" fill="#5a4a42" />
      </g>
      <g className="zoo-head">
        <path d="M192 26 L 194 6 L 204 24 Z" fill="#f6f2ea" />
        <path d="M195 22 L 196 11 L 201 22 Z" fill="#e2a58a" />
        <path d="M186 24 C 200 16, 216 22, 224 36 C 232 48, 246 64, 244 74 C 240 82, 228 80, 220 74 C 208 68, 198 60, 190 50 C 184 42, 182 32, 186 24 Z" fill="#f6f2ea" />
        <g clipPath="url(#knab-hoved)">
          <circle cx="216" cy="34" r="4" fill="#3a2b25" />
          <circle cx="226" cy="50" r="3.5" fill="#8a5a3a" />
          <circle cx="212" cy="56" r="4" fill="#3a2b25" />
          <circle cx="234" cy="66" r="3" fill="#3a2b25" />
          <circle cx="196" cy="46" r="3.5" fill="#8a5a3a" />
          <circle cx="222" cy="68" r="2.6" fill="#3a2b25" />
        </g>
        <ellipse cx="238" cy="74" rx="8" ry="6" fill="#d9b3a0" />
        <circle cx="234" cy="72" r="1.4" fill="#6b4a36" />
        <circle cx="236" cy="78" r="1.2" fill="#6b4a36" />
        <ellipse cx="240" cy="73" rx="1.8" ry="2.4" fill="#6b4a36" />
        <path d="M188 22 C 200 18, 210 24, 208 38 C 200 34, 192 30, 188 22 Z" fill="#d8ccb2" />
        {EYE(208, 40, 4)}
      </g>
    </>
  ),
};

/* ---------- Vædderkanin: lange hængende ører, grå og hvid ---------- */

const lopRabbit: CreatureSpec = {
  name: "Vædderkanin",
  rarity: "uncommon",
  height: 8,
  aspect: 130 / 110,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 130 110",
  art: (
    <>
      <circle cx="22" cy="74" r="10" fill="#ffffff" />
      <g className="zoo-leg zoo-leg-b">
        <rect x="78" y="82" width="12" height="26" rx="6" fill="#f4f1ec" />
        <ellipse cx="86" cy="106" rx="10" ry="4.5" fill="#f4f1ec" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="72" rx="38" ry="28" fill="#a3a8b0" />
        <ellipse cx="66" cy="84" rx="26" ry="14" fill="#f8f6f2" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="42" cy="84" rx="23" ry="20" fill="#979ca5" />
        <ellipse cx="52" cy="106" rx="20" ry="5" fill="#f4f1ec" />
        <ellipse cx="42" cy="104" rx="14" ry="6" fill="#f4f1ec" />
      </g>
      <g className="zoo-head">
        <path d="M74 32 C 82 28, 90 36, 88 50 C 86 66, 78 86, 68 92 C 60 94, 56 86, 58 76 C 60 56, 64 38, 74 32 Z" fill="#5f646d" />
        <circle cx="96" cy="52" r="21" fill="#a3a8b0" />
        <path d="M102 36 C 110 46, 114 54, 112 62 C 118 64, 120 70, 114 70 L 104 66 C 100 56, 100 46, 102 36 Z" fill="#f8f6f2" />
        <ellipse cx="110" cy="60" rx="12" ry="9" fill="#f8f6f2" />
        <ellipse cx="119" cy="56" rx="3.8" ry="3" fill="#e8808f" />
        <circle cx="94" cy="62" r="5" fill="#f1a6b0" opacity="0.5" />
        {EYE(101, 46, 4.2)}
        <path d="M82 32 C 91 28, 98 36, 96 50 C 94 66, 88 84, 78 90 C 70 92, 66 84, 68 74 C 70 54, 72 38, 82 32 Z" fill="#8a9099" />
        <path d="M83 42 C 89 42, 91 54, 89 66 C 87 76, 83 83, 78 84 C 74 84, 74 78, 75 72 C 77 58, 78 46, 83 42 Z" fill="#c9a4a8" opacity="0.65" />
      </g>
    </>
  ),
};

/* ---------- Angorged: hvid med lange, krøllede, skinnende lokker og spiralhorn ---------- */

/** [startY, længde, x-forskydning] for lokkernes rækker på angorgedens krop. */
const LOKKE_RÆKKER: ReadonlyArray<readonly [number, number, number]> = [
  [44, 30, 4],
  [58, 30, 0],
  [72, 30, 5],
  [86, 28, 1],
];

const angoraGoat: CreatureSpec = {
  name: "Angorged",
  rarity: "uncommon",
  height: 15,
  aspect: 190 / 150,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 0 190 150",
  art: (
    <>
      <path d="M38 66 L 26 52 L 46 60 Z" fill="#f4eee0" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="108" y="100" width="11" height="50" rx="5" fill="#e4dac6" />
        <rect x="108" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="100" width="11" height="50" rx="5" fill="#e4dac6" />
        <rect x="44" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="84" cy="76" rx="56" ry="32" fill="#fbf8f1" />
        <path d="M110 66 C 122 48, 134 40, 144 40 L 158 68 C 144 72, 130 82, 122 98 Z" fill="#fbf8f1" />
        <path d="M44 100 q 4 -14 12 -10 M60 104 q 4 -16 14 -10 M82 106 q 4 -16 14 -10 M104 100 q 4 -14 12 -8" stroke="#e6ddca" strokeWidth="3" fill="none" strokeLinecap="round" />
        <g fill="none" strokeLinecap="round">
          {LOKKE_RÆKKER.map(([y, l, forskyd], r) =>
            Array.from({ length: 9 }, (_, i) => {
              const x = 32 + i * 11.5 + forskyd;
              const top = 76 - 32 * Math.sqrt(Math.max(0, 1 - ((x - 84) / 56) ** 2)) + 5;
              const yy = Math.max(y, top);
              const d = i % 2 ? 1 : -1;
              const ll = l + ((i * 5 + r) % 3) * 3;
              return (
                <g key={`${r}-${i}`}>
                  <path d={lokke(x, yy, ll, d)} stroke="#d6ccb4" strokeWidth="11" />
                  <path d={lokke(x, yy, ll, d)} stroke={(i + r) % 2 ? "#fbf8f1" : "#f3ecdd"} strokeWidth="8.5" />
                  <path d={lokke(x - 1.5 * d, yy + 2, ll * 0.8, d)} stroke="#e4eef8" strokeWidth="1.8" />
                </g>
              );
            }),
          )}
        </g>
        <path d="M28 70 q -6 8 0 18 q 2 -8 6 -12 z" fill="#f0e9da" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="102" width="12" height="48" rx="5" fill="#fbf8f1" />
        <rect x="120" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
        <path d={lokke(126, 104, 22, 1)} stroke="#d6ccb4" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d={lokke(126, 104, 22, 1)} stroke="#fbf8f1" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="58" y="102" width="12" height="48" rx="5" fill="#fbf8f1" />
        <rect x="58" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
        <path d={lokke(64, 104, 22, -1)} stroke="#d6ccb4" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d={lokke(64, 104, 22, -1)} stroke="#fbf8f1" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M146 34 C 152 14, 130 4, 126 20 C 124 32, 112 28, 112 16" stroke="#cdb98c" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M146 34 C 152 14, 130 4, 126 20 C 124 32, 112 28, 112 16" stroke="#7d6a44" strokeWidth="6.5" fill="none" strokeDasharray="1.6 3.6" />
        <path d="M152 32 C 160 14, 142 2, 138 16 C 136 28, 126 24, 126 12" stroke="#d8c698" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M152 32 C 160 14, 142 2, 138 16 C 136 28, 126 24, 126 12" stroke="#7d6a44" strokeWidth="5.5" fill="none" strokeDasharray="1.6 3.4" />
        <path d="M140 48 C 128 48, 120 58, 122 74 C 124 82, 130 80, 132 72 C 138 66, 144 58, 144 50 Z" fill="#ece2cc" />
        <path d="M130 52 C 126 60, 126 70, 128 78" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="150" cy="48" rx="17" ry="15" fill="#fbf8f1" />
        <ellipse cx="166" cy="56" rx="13" ry="10" fill="#fbf8f1" />
        <ellipse cx="175" cy="56" rx="4" ry="3.2" fill="#8a6a60" />
        <path d="M160 64 C 164 70, 164 80, 160 88 C 156 80, 154 70, 156 64 Z" fill="#e1d6bd" />
        <path d="M140 32 q 8 -8 18 -4 q -2 8 -8 8 q -6 0 -10 -4 z" fill="#f0e9da" />
        {EYE(154, 44, 3.8)}
        <path d={lokke(146, 28, 16, 1)} stroke="#d6ccb4" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={lokke(146, 28, 16, 1)} stroke="#fbf8f1" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const variants: Record<string, CreatureSpec> = {
  jerseyCow,
  highlandCow,
  blackSheep,
  saddlebackPig,
  silkieHen,
  knabstrupper,
  lopRabbit,
  angoraGoat,
};
