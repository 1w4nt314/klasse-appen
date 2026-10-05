import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Dino-dalens otte usædvanlige varianter. Ingen ved præcis, hvilke farver
 * dinosaurerne havde, så her er farvevarianter af kendte figurer — hver med et
 * lille kendetegn (fjer, pletter, striber, lysende prikker, mos …).
 * Samme form, viewBox og bevægelige grupper som originalerne i creatures-1/-2.
 */

/** Afrunder et beregnet tal til to decimaler (rene, korte koordinater). */
const r2 = (v: number) => +v.toFixed(2);

/** Punkt på en ellipse (vinkel i grader, y vender nedad). */
const paaEllipse = (cx: number, cy: number, rx: number, ry: number, grader: number) => {
  const v = (grader * Math.PI) / 180;
  return { x: r2(cx + rx * Math.cos(v)), y: r2(cy + ry * Math.sin(v)) };
};

/** Lille fjer: smal dråbeform drejet om sin rod (som i velociraptoren). */
const fjer = (x: number, y: number, vinkel: number, laengde: number, farve: string, tyk = 5) => (
  <ellipse
    cx={r2(x + laengde / 2)}
    cy={y}
    rx={r2(laengde / 2)}
    ry={r2(laengde / tyk)}
    fill={farve}
    transform={`rotate(${vinkel} ${x} ${y})`}
  />
);

/** Vingefjer: lys fjer med en farvet spids. */
const vingeFjer = (x: number, y: number, vinkel: number, laengde: number, farve: string, spids: string) => (
  <g transform={`rotate(${vinkel} ${x} ${y})`}>
    <ellipse cx={r2(x + laengde / 2)} cy={y} rx={r2(laengde / 2)} ry={r2(laengde / 5)} fill={farve} />
    <ellipse cx={r2(x + laengde * 0.8)} cy={y} rx={r2(laengde * 0.2)} ry={r2(laengde / 7)} fill={spids} />
  </g>
);

/** Dun-fjer langs en ellipses kant, vendt udad (og let svinget med `sving` grader). */
const dunKant = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fra: number,
  til: number,
  antal: number,
  laengde: number,
  farver: string[],
  sving = 0,
) =>
  Array.from({ length: antal }, (_, i) => {
    const grader = fra + ((til - fra) * i) / (antal - 1);
    const v = (grader * Math.PI) / 180;
    const rod = paaEllipse(cx, cy, rx - 2, ry - 2, grader);
    const ud = (Math.atan2(Math.sin(v) / ry, Math.cos(v) / rx) * 180) / Math.PI;
    return <g key={i}>{fjer(rod.x, rod.y, r2(ud + sving), laengde, farver[i % farver.length], 2.8)}</g>;
  });

/** Uregelmæssig, afrundet plet (polygon med runde liniesamlinger). */
const plet = (cx: number, cy: number, r: number, drej = 0) => {
  const faktor = [1, 0.8, 1.1, 0.85, 1.05, 0.8];
  const punkter = faktor.map((f, i) => {
    const v = ((drej + i * 60) * Math.PI) / 180;
    return `${r2(cx + r * f * Math.cos(v))} ${r2(cy + r * f * Math.sin(v))}`;
  });
  return `M${punkter.join(" L ")} Z`;
};

/** Tigerstribe: tynd kile, bred foroven og spids forneden. */
const stribe = (x: number, top: number, bredde: number, hoejde: number, skaev = 6) =>
  `M${r2(x - bredde / 2)} ${top} Q ${r2(x + skaev)} ${r2(top + hoejde * 0.5)} ${r2(x + skaev / 2)} ${r2(top + hoejde)} Q ${r2(x - 1)} ${r2(top + hoejde * 0.5)} ${r2(x + bredde / 2)} ${top} Z`;

/* ------------------------------------------------------------------ */
/* Fjer-T. rex                                                          */
/* ------------------------------------------------------------------ */

const rexRyg = dunKant(122, 98, 64, 44, 196, 316, 13, 20, ["#eaa45a", "#d68640"], -18);
const rexHale = (
  <>
    {fjer(14, 132, 105, 24, "#f6dfb2", 3)}
    {fjer(12, 133, 135, 24, "#d68640", 3)}
    {fjer(12, 134, 165, 22, "#f6dfb2", 3)}
  </>
);

const featherRex: CreatureSpec = {
  name: "Fjer-T. rex",
  rarity: "uncommon",
  height: 29.1,
  aspect: 275 / 191,
  gait: "walk",
  pace: 0.85,
  viewBox: "-13 5 275 191",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="112" cy="124" rx="22" ry="28" fill="#8f4a22" />
        <path d="M108 138 C 106 156, 108 168, 108 176" stroke="#8f4a22" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="189" rx="19" ry="7" fill="#8f4a22" />
      </g>
      <g className="zoo-torso">
        {/* hale med lys fjerspids */}
        <path d="M78 82 C 52 86, 26 102, 4 134 C 26 136, 54 128, 84 122 Z" fill="#b8672e" />
        <path d="M58 118 C 40 126, 24 132, 8 134" stroke="#f6dfb2" strokeWidth="7" fill="none" strokeLinecap="round" />
        {rexHale}
        {/* krop */}
        <ellipse cx="122" cy="98" rx="64" ry="44" fill="#b8672e" />
        <path d="M66 112 C 82 146, 160 150, 184 112 C 160 130, 96 132, 66 112 Z" fill="#f6dfb2" />
        {/* bløde dun-fjer langs ryggen */}
        {rexRyg}
        <g stroke="#8f4a22" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M92 74 q 5 8 1 16" />
          <path d="M116 70 q 5 8 1 18" />
          <path d="M140 74 q 5 8 1 16" />
        </g>
        {/* små arme med dun */}
        <path d="M176 108 C 186 110, 192 116, 192 124" stroke="#8f4a22" strokeWidth="9" fill="none" strokeLinecap="round" />
        {fjer(182, 110, 40, 22, "#eaa45a", 3)}
        {fjer(184, 112, 72, 22, "#d68640", 3)}
        {fjer(186, 114, 104, 20, "#eaa45a", 3)}
      </g>
      {/* nært ben */}
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="144" cy="122" rx="27" ry="31" fill="#b8672e" />
        <path d="M144 138 C 142 156, 144 168, 144 176" stroke="#b8672e" strokeWidth="26" fill="none" strokeLinecap="round" />
        <ellipse cx="156" cy="188" rx="21" ry="8" fill="#b8672e" />
        <path d="M168 190 h 6 M162 193 h 6" stroke="#f6dfb2" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        {/* dun i nakken og en lille fjerpust på issen */}
        {fjer(172, 50, 205, 22, "#d68640", 3)}
        {fjer(172, 56, 190, 22, "#eaa45a", 3)}
        {fjer(174, 44, 225, 20, "#eaa45a", 3)}
        {fjer(210, 24, 255, 16, "#d68640", 3)}
        {fjer(218, 22, 275, 16, "#eaa45a", 3)}
        {fjer(226, 23, 295, 14, "#d68640", 3)}
        <ellipse cx="178" cy="74" rx="24" ry="26" fill="#b8672e" />
        <path d="M164 52 C 164 24, 206 12, 236 24 C 256 30, 260 52, 254 64 C 248 82, 222 88, 196 86 C 174 84, 162 66, 166 40 Z" fill="#b8672e" />
        {/* lys hage */}
        <path d="M200 84 C 220 90, 244 84, 254 66 C 250 78, 232 82, 214 76 Z" fill="#f6dfb2" />
        {/* venligt smil */}
        <path d="M250 62 C 240 76, 224 76, 212 66" stroke="#6b3a18" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="252" cy="42" r="2.6" fill="#6b3a18" />
        <circle cx="214" cy="62" r="7" fill="#ffc2b0" opacity="0.7" />
        {EYE(224, 40, 6)}
        <path d="M214 28 q 10 -4 20 2" stroke="#8f4a22" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Fjer-velociraptor                                                    */
/* ------------------------------------------------------------------ */

const raptorKrop = dunKant(86, 72, 38, 22, 190, 350, 10, 14, ["#9ab4d3", "#cbd9ea"], -12);

const featherRaptor: CreatureSpec = {
  name: "Fjer-velociraptor",
  rarity: "uncommon",
  height: 11,
  aspect: 186 / 128,
  gait: "walk",
  pace: 1.4,
  viewBox: "-16 0 186 128",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M80 82 L 94 102" stroke="#4d6e96" strokeWidth="16" strokeLinecap="round" />
        <path d="M94 102 L 80 116" stroke="#4d6e96" strokeWidth="8" strokeLinecap="round" />
        <path d="M78 124 H 100" stroke="#4d6e96" strokeWidth="8" strokeLinecap="round" />
        <path d="M99 121 q 7 -1 8 -9" stroke="#f4ead0" strokeWidth="3" fill="none" strokeLinecap="round" />
        {fjer(84, 90, 100, 14, "#aab8cb", 3)}
        {fjer(90, 92, 70, 14, "#cbd9ea", 3)}
      </g>
      <g className="zoo-torso">
        {/* hale med stor hvid fjerhale */}
        <path d="M54 70 C 38 64, 22 58, 8 52 C 10 66, 30 84, 58 88 Z" fill="#6d8fb8" />
        {vingeFjer(14, 54, 205, 26, "#f7f9fc", "#6d8fb8")}
        {vingeFjer(14, 56, 180, 28, "#f7f9fc", "#4d6e96")}
        {vingeFjer(16, 58, 155, 26, "#f7f9fc", "#6d8fb8")}
        <g transform="rotate(-12 86 72)">
          <ellipse cx="86" cy="72" rx="38" ry="22" fill="#6d8fb8" />
          {raptorKrop}
          <path d="M52 78 C 70 98, 108 98, 124 76 C 106 88, 70 88, 52 78 Z" fill="#e6eef6" />
          {/* fjerskæl */}
          <g stroke="#9ab4d3" strokeWidth="2.4" fill="none" strokeLinecap="round">
            <path d="M62 62 q 4 5 8 0 M74 58 q 4 5 8 0 M86 56 q 4 5 8 0 M98 58 q 4 5 8 0" />
            <path d="M68 70 q 4 5 8 0 M80 67 q 4 5 8 0 M92 66 q 4 5 8 0 M104 68 q 4 5 8 0" />
          </g>
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M94 84 L 110 104" stroke="#6d8fb8" strokeWidth="17" strokeLinecap="round" />
        <path d="M110 104 L 96 117" stroke="#6d8fb8" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M92 124 H 116" stroke="#6d8fb8" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M114 121 q 8 -1 9 -10" stroke="#f4ead0" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* fjerbukser på låret */}
        {fjer(98, 90, 95, 16, "#f7f9fc", 3)}
        {fjer(104, 92, 70, 16, "#cbd9ea", 3)}
        {fjer(94, 92, 120, 15, "#cbd9ea", 3)}
      </g>
      {/* vinge: arm med hvide vingefjer */}
      <g>
        <path d="M110 68 L 124 80" stroke="#4d6e96" strokeWidth="6" strokeLinecap="round" />
        {vingeFjer(112, 72, 128, 28, "#f7f9fc", "#4d6e96")}
        {vingeFjer(112, 72, 108, 32, "#f7f9fc", "#6d8fb8")}
        {vingeFjer(112, 72, 88, 32, "#f7f9fc", "#4d6e96")}
        {vingeFjer(112, 72, 68, 30, "#f7f9fc", "#6d8fb8")}
        {vingeFjer(112, 72, 48, 26, "#f7f9fc", "#4d6e96")}
      </g>
      <g className="zoo-head">
        <path d="M104 66 C 112 52, 120 44, 128 38 L 142 46 C 134 58, 126 68, 118 78 Z" fill="#6d8fb8" />
        {fjer(112, 58, 150, 12, "#cbd9ea", 3)}
        {fjer(116, 66, 130, 12, "#9ab4d3", 3)}
        <path d="M120 30 C 124 18, 146 18, 158 28 C 166 34, 162 44, 152 46 C 140 50, 124 48, 120 38 Z" fill="#6d8fb8" />
        <path d="M130 46 C 140 52, 154 52, 160 44 C 152 48, 140 46, 130 46 Z" fill="#e6eef6" />
        {/* fjerkam på hovedet */}
        {vingeFjer(124, 26, 250, 20, "#f7f9fc", "#4d6e96")}
        {vingeFjer(128, 24, 270, 20, "#f7f9fc", "#6d8fb8")}
        {vingeFjer(134, 23, 290, 18, "#f7f9fc", "#4d6e96")}
        <path d="M160 40 Q 152 46 144 43" stroke="#2f4a6e" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="32" r="1.8" fill="#2f4a6e" />
        <circle cx="140" cy="42" r="3.6" fill="#ffc2b0" opacity="0.7" />
        {EYE(142, 33, 4.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Plettet brachiosaurus                                                */
/* ------------------------------------------------------------------ */

const KARAMEL = "#c98a45";

const brachioKrop: [number, number, number, number][] = [
  [44, 222, 8, 10],
  [62, 200, 11, 40],
  [84, 212, 10, 80],
  [100, 192, 11, 20],
  [122, 206, 12, 60],
  [140, 224, 10, 30],
  [118, 236, 8, 0],
  [74, 234, 8, 50],
  [152, 204, 8, 70],
  [24, 228, 6, 20],
];
const brachioHals: [number, number, number, number][] = [
  [148, 196, 10, 20],
  [160, 168, 10, 50],
  [148, 150, 8, 0],
  [160, 124, 10, 30],
  [148, 104, 8, 60],
  [158, 82, 8, 10],
  [166, 206, 8, 40],
];

const spottedBrachio: CreatureSpec = {
  name: "Plettet brachiosaurus",
  rarity: "uncommon",
  height: 36,
  aspect: 226 / 300,
  gait: "walk",
  pace: 0.5,
  viewBox: "0 0 226 300",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="126" y="226" width="26" height="74" rx="12" fill="#dcc58e" />
        <circle cx="139" cy="252" r="5" fill="#b57a3a" />
        <circle cx="140" cy="276" r="4.5" fill="#b57a3a" />
        <ellipse cx="139" cy="295" rx="16" ry="5" fill="#8a5a2a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="236" width="26" height="64" rx="12" fill="#dcc58e" />
        <circle cx="50" cy="258" r="5" fill="#b57a3a" />
        <circle cx="52" cy="280" r="4.5" fill="#b57a3a" />
        <ellipse cx="51" cy="295" rx="16" ry="5" fill="#8a5a2a" />
      </g>
      <g className="zoo-torso">
        <path d="M30 208 C 16 212, 8 226, 4 244 C 18 240, 32 238, 42 238 Z" fill="#f3e0ae" />
        <ellipse cx="98" cy="220" rx="76" ry="42" fill="#f3e0ae" />
        {/* giraf-pletter, klippet til kroppen og halen */}
        <Klip
          form={
            <>
              <ellipse cx="98" cy="220" rx="76" ry="42" />
              <path d="M30 208 C 16 212, 8 226, 4 244 C 18 240, 32 238, 42 238 Z" />
            </>
          }
        >
          <g fill={KARAMEL} stroke={KARAMEL} strokeWidth="4" strokeLinejoin="round">
            {brachioKrop.map(([x, y, r, d]) => (
              <path key={`${x}-${y}`} d={plet(x, y, r, d)} />
            ))}
          </g>
        </Klip>
        <path d="M32 238 C 56 268, 130 270, 164 238 C 134 254, 62 254, 32 238 Z" fill="#fff6dc" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="140" y="226" width="28" height="74" rx="12" fill="#f3e0ae" />
        <circle cx="153" cy="250" r="5.5" fill={KARAMEL} />
        <circle cx="156" cy="274" r="5" fill={KARAMEL} />
        <ellipse cx="154" cy="295" rx="17" ry="5" fill="#8a5a2a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="236" width="28" height="64" rx="12" fill="#f3e0ae" />
        <circle cx="64" cy="256" r="5.5" fill={KARAMEL} />
        <circle cx="68" cy="279" r="5" fill={KARAMEL} />
        <ellipse cx="66" cy="295" rx="17" ry="5" fill="#8a5a2a" />
      </g>
      <g className="zoo-head">
        {/* lang hals med pletter */}
        <path d="M112 208 C 130 164, 134 110, 142 62 C 148 46, 170 46, 176 62 C 182 112, 184 174, 172 246 Z" fill="#f3e0ae" />
        <Klip form={<path d="M112 208 C 130 164, 134 110, 142 62 C 148 46, 170 46, 176 62 C 182 112, 184 174, 172 246 Z" />}>
          <g fill={KARAMEL} stroke={KARAMEL} strokeWidth="4" strokeLinejoin="round">
            {brachioHals.map(([x, y, r, d]) => (
              <path key={`${x}-${y}`} d={plet(x, y, r, d)} />
            ))}
          </g>
        </Klip>
        {/* hoved */}
        <ellipse cx="184" cy="42" rx="26" ry="17" fill="#f3e0ae" />
        <circle cx="170" cy="28" r="10" fill="#f3e0ae" />
        {/* giraf-knopper på issen */}
        <path d="M180 27 L 178 14 M191 27 L 194 15" stroke="#b57a3a" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="178" cy="12" r="4" fill="#8a5a2a" />
        <circle cx="194" cy="13" r="4" fill="#8a5a2a" />
        <path d="M168 50 C 182 58, 200 58, 208 48" stroke="#fff6dc" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M198 50 Q 204 56 210 46" stroke="#8a5a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="207" cy="36" r="2.4" fill="#8a5a2a" />
        <circle cx="190" cy="50" r="4.5" fill="#ffb59e" opacity="0.7" />
        {EYE(190, 38, 4.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Stribet stegosaurus                                                  */
/* ------------------------------------------------------------------ */

/** Ryggens højde (y) ved en given x på kroppens ellipse (cx 112, cy 82, rx 80, ry 40). */
const rygY = (x: number) => r2(82 - 40 * Math.sqrt(Math.max(0, 1 - ((x - 112) / 80) ** 2)));

/** Rygplade: spids rude (bløde hjørner via runde liniesamlinger) med fod ned i ryggen. */
const plade = (x: number, w: number, h: number) => {
  const y = rygY(x);
  return `M${r2(x - w / 2)} ${r2(y + 8)} L ${x} ${r2(y - h)} L ${r2(x + w / 2)} ${r2(y + 8)} Z`;
};

const pladeSpec: [number, number, number][] = [
  [64, 30, 26],
  [88, 36, 38],
  [112, 38, 44],
  [136, 36, 40],
  [158, 32, 30],
  [178, 26, 20],
];

/** Tigerstriber hen over kroppen: [x, bredde, højde]. */
const kropStriber: [number, number, number][] = [
  [48, 10, 56],
  [66, 12, 70],
  [86, 12, 60],
  [106, 13, 74],
  [126, 12, 62],
  [146, 12, 72],
  [166, 11, 58],
  [182, 9, 46],
];
const haleStriber: [number, number, number][] = [
  [22, 9, 36],
  [34, 10, 48],
  [48, 10, 52],
];

const stripedStego: CreatureSpec = {
  name: "Stribet stegosaurus",
  rarity: "uncommon",
  height: 18,
  aspect: 252 / 148,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 252 148",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="150" y="100" width="22" height="48" rx="10" fill="#d9852a" />
        <path d="M153 116 h 16 M153 128 h 16" stroke="#3b2a20" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="161" cy="145" rx="11" ry="3.5" fill="#fbe8c0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="58" y="96" width="26" height="52" rx="11" fill="#d9852a" />
        <path d="M62 114 h 18 M62 127 h 18" stroke="#3b2a20" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="71" cy="145" rx="13" ry="3.5" fill="#fbe8c0" />
      </g>
      <g className="zoo-torso">
        {/* pigge på halen */}
        <g fill="#e4f0fb" stroke="#e4f0fb" strokeWidth="3" strokeLinejoin="round">
          <path d="M16 90 L 6 56 L 34 80 Z" />
          <path d="M36 82 L 32 44 L 56 72 Z" />
          <path d="M18 98 L 4 124 L 36 102 Z" />
          <path d="M38 100 L 30 126 L 56 100 Z" />
        </g>
        {/* hale */}
        <path d="M54 64 C 36 66, 20 76, 10 92 C 24 100, 42 108, 62 108 Z" fill="#f2a23e" />
        {/* blå plader */}
        <g fill="#4f8fe0" stroke="#4f8fe0" strokeWidth="3" strokeLinejoin="round">
          {pladeSpec.map(([x, w, h]) => (
            <path key={x} d={plade(x, w, h)} />
          ))}
        </g>
        <g stroke="#a6cdf7" strokeWidth="4" strokeLinecap="round">
          {pladeSpec.map(([x, , h]) => (
            <path key={x} d={`M${x} ${r2(rygY(x) - h * 0.6)} V ${r2(rygY(x) - 2)}`} />
          ))}
        </g>
        <ellipse cx="112" cy="82" rx="80" ry="40" fill="#f2a23e" />
        {/* tigerstriber, klippet til krop og hale */}
        <Klip
          form={
            <>
              <ellipse cx="112" cy="82" rx="80" ry="40" />
              <path d="M54 64 C 36 66, 20 76, 10 92 C 24 100, 42 108, 62 108 Z" />
            </>
          }
        >
          <g fill="#3b2a20">
            {kropStriber.map(([x, b, h]) => (
              <path key={x} d={stribe(x, 36, b, h)} />
            ))}
            {haleStriber.map(([x, b, h]) => (
              <path key={x} d={stribe(x, 62, b, h, -4)} />
            ))}
          </g>
        </Klip>
        <path d="M40 98 C 64 124, 150 126, 186 96 C 160 112, 66 112, 40 98 Z" fill="#fbe8c0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="160" y="100" width="24" height="48" rx="10" fill="#f2a23e" />
        <path d="M164 116 h 16 M164 128 h 16" stroke="#3b2a20" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="172" cy="145" rx="12" ry="3.5" fill="#fbe8c0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="96" width="28" height="52" rx="11" fill="#f2a23e" />
        <path d="M75 114 h 18 M75 127 h 18" stroke="#3b2a20" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="84" cy="145" rx="14" ry="3.5" fill="#fbe8c0" />
      </g>
      <g className="zoo-head">
        <path d="M172 78 C 190 82, 206 90, 218 104" stroke="#f2a23e" strokeWidth="32" fill="none" strokeLinecap="round" />
        <path d="M190 72 l 5 20 M204 82 l 5 20" stroke="#3b2a20" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="228" cy="108" rx="23" ry="15" fill="#f2a23e" />
        <path d="M212 118 C 224 126, 240 126, 249 114" stroke="#fbe8c0" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M247 112 Q 238 120 226 117" stroke="#6b3a18" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="246" cy="102" r="2.2" fill="#6b3a18" />
        <circle cx="222" cy="116" r="4.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(233, 101, 4.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Ørken-triceratops                                                    */
/* ------------------------------------------------------------------ */

/** Skjoldets runde kant: cirkler på en ellipse bag hovedet. */
const oerkenKant = Array.from({ length: 10 }, (_, i) => paaEllipse(158, 56, 32, 40, 140 + i * 20));

/** Striber, der stråler ud fra skjoldets midte. */
const skjoldStriber = Array.from({ length: 12 }, (_, i) => ({
  ind: paaEllipse(158, 58, 6, 9, i * 30 + 15),
  ud: paaEllipse(158, 58, 20, 28, i * 30 + 15),
}));

const desertTrice: CreatureSpec = {
  name: "Ørken-triceratops",
  rarity: "uncommon",
  height: 18,
  aspect: 244 / 140,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 244 140",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="128" y="94" width="24" height="46" rx="10" fill="#c09550" />
        <path d="M131 122 h 18" stroke="#a8512f" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="140" cy="137" rx="11" ry="3.5" fill="#f7ecd0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="94" width="24" height="46" rx="10" fill="#c09550" />
        <path d="M47 122 h 18" stroke="#a8512f" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="56" cy="137" rx="11" ry="3.5" fill="#f7ecd0" />
      </g>
      <g className="zoo-torso">
        <path d="M42 62 C 24 68, 12 84, 6 102 C 20 98, 34 96, 46 94 Z" fill="#dcb26a" />
        <path d="M18 92 l 4 -10 M28 88 l 3 -10" stroke="#a8512f" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="98" cy="80" rx="68" ry="38" fill="#dcb26a" />
        <path d="M40 94 C 66 120, 130 122, 158 96 C 134 108, 66 108, 40 94 Z" fill="#f8ebcf" />
        {/* rødbrune ryg-striber */}
        <g stroke="#a8512f" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M62 50 q 6 10 2 22" />
          <path d="M80 44 q 6 10 2 24" />
          <path d="M98 42 q 6 10 2 24" />
          <path d="M116 46 q 6 10 2 22" />
          <path d="M134 54 q 5 8 1 18" />
        </g>
        <g fill="#c09550">
          <circle cx="72" cy="84" r="2.6" /><circle cx="90" cy="88" r="2.6" /><circle cx="110" cy="86" r="2.6" />
          <circle cx="128" cy="82" r="2.6" /><circle cx="82" cy="76" r="2.2" /><circle cx="104" cy="76" r="2.2" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="136" y="94" width="26" height="46" rx="10" fill="#dcb26a" />
        <path d="M140 122 h 18" stroke="#a8512f" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="149" cy="137" rx="12" ry="3.5" fill="#f7ecd0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="94" width="26" height="46" rx="10" fill="#dcb26a" />
        <path d="M56 122 h 18" stroke="#a8512f" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="65" cy="137" rx="12" ry="3.5" fill="#f7ecd0" />
      </g>
      <g className="zoo-head">
        {/* nakkeskjold med rødbrune striber */}
        <g fill="#b5673a">
          {oerkenKant.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="7" />
          ))}
        </g>
        <ellipse cx="158" cy="56" rx="32" ry="40" fill="#b5673a" />
        <ellipse cx="158" cy="58" rx="21" ry="29" fill="#efd6a0" />
        <g stroke="#a8512f" strokeWidth="4" strokeLinecap="round">
          {skjoldStriber.map((s, i) => (
            <path key={i} d={`M${s.ind.x} ${s.ind.y} L ${s.ud.x} ${s.ud.y}`} />
          ))}
        </g>
        <g fill="#f8ebcf">
          {oerkenKant.slice(1, 9).map((p, i) => (
            <circle key={i} cx={r2(p.x * 0.8 + 158 * 0.2)} cy={r2(p.y * 0.8 + 58 * 0.2)} r="2.6" />
          ))}
        </g>
        {/* de to bageste horn (fjerne) */}
        <path d="M200 56 L 240 36 L 214 68 Z" fill="#e5d6ae" stroke="#e5d6ae" strokeWidth="3" strokeLinejoin="round" />
        {/* hoved */}
        <path d="M164 68 C 172 52, 198 50, 216 60 C 230 68, 234 84, 226 94 C 216 106, 186 108, 172 98 C 162 90, 160 78, 164 68 Z" fill="#dcb26a" />
        <path d="M214 60 C 228 66, 236 80, 230 92 C 226 98, 218 98, 212 94 Z" fill="#f0d9a4" />
        <path d="M198 98 Q 214 104 228 92" stroke="#7a4a22" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* næsehorn */}
        <path d="M218 68 L 234 54 L 230 78 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        {/* nære øjenbrynshorn */}
        <path d="M192 56 L 232 20 L 208 64 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        <path d="M222 30 L 232 20 L 228 38 Z" fill="#b5673a" stroke="#b5673a" strokeWidth="2" strokeLinejoin="round" />
        {EYE(196, 72, 5)}
        <circle cx="206" cy="88" r="5.5" fill="#ffb59e" opacity="0.7" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Nat-pteranodon                                                       */
/* ------------------------------------------------------------------ */

const GLOD = "#ffe27a";

/** Lysende prik: lille kerne med blød glød. */
const glodPrik = (x: number, y: number, r = 2.4) => (
  <g key={`${x}-${y}`}>
    <circle cx={x} cy={y} r={r * 2} fill={GLOD} opacity="0.28" />
    <circle cx={x} cy={y} r={r} fill={GLOD} />
  </g>
);

const nightPteranodon: CreatureSpec = {
  name: "Nat-pteranodon",
  rarity: "uncommon",
  height: 12,
  aspect: 200 / 130,
  gait: "float",
  zone: "open",
  pace: 1,
  viewBox: "0 0 200 130",
  art: (
    <>
      {/* fjern vinge (mørkere) */}
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as React.CSSProperties}>
        <path
          d="M110 64 C 108 38, 98 16, 74 4 C 70 20, 74 30, 80 34 C 82 46, 88 54, 96 66 Z"
          fill="#16224a"
        />
        <path d="M110 64 C 106 38, 96 16, 74 4" stroke="#0d1535" strokeWidth="3" fill="none" strokeLinecap="round" />
        {glodPrik(94, 44, 1.8)}
        {glodPrik(86, 26, 1.8)}
        {glodPrik(100, 56, 1.6)}
      </g>
      {/* lille hale og fødder */}
      <path d="M82 76 L 60 90 L 84 88 Z" fill="#1d2d63" />
      <path d="M96 88 L 92 102 L 100 102 L 104 90 Z" fill="#1d2d63" />
      <path d="M114 88 L 112 102 L 120 102 L 120 90 Z" fill="#1d2d63" />
      <g className="zoo-torso">
        <ellipse cx="108" cy="76" rx="32" ry="16" fill="#24397a" transform="rotate(-8 108 76)" />
        <ellipse cx="112" cy="84" rx="22" ry="8" fill="#5671bd" transform="rotate(-8 112 84)" />
      </g>
      {/* nær vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as React.CSSProperties}>
        <path
          d="M102 68 C 84 44, 50 22, 10 16 C 22 28, 28 36, 30 46 C 40 46, 46 52, 48 62 C 60 62, 68 70, 70 80 C 82 82, 92 82, 104 80 Z"
          fill="#2e4a96"
        />
        <path d="M102 68 C 84 44, 50 22, 10 16" stroke="#16224a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M102 70 L 30 46 M102 72 L 48 62 M102 74 L 70 80" stroke="#1d2d63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {glodPrik(86, 62)}
        {glodPrik(70, 56)}
        {glodPrik(56, 46)}
        {glodPrik(42, 38, 2.2)}
        {glodPrik(28, 30, 2)}
        {glodPrik(78, 72, 2)}
        {glodPrik(60, 66, 2)}
        {glodPrik(94, 74, 2)}
      </g>
      <g className="zoo-head">
        <path d="M122 70 C 134 66, 140 60, 146 54" stroke="#24397a" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* lang lysegul kam bagud */}
        <path d="M146 40 C 130 28, 110 24, 84 32 C 106 44, 128 54, 148 56 Z" fill={GLOD} />
        <path d="M142 42 C 128 34, 112 31, 96 35" stroke="#fff4bf" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="151" cy="50" rx="15" ry="11" fill="#24397a" />
        {/* næb */}
        <path d="M158 43 C 172 46, 188 52, 199 57 L 196 61 C 180 62, 166 61, 156 58 Z" fill="#4a68b8" />
        <path d="M156 58 C 168 62, 184 62, 196 61" stroke="#16224a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(152, 47, 3.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Trompet-parasaurolophus                                              */
/* ------------------------------------------------------------------ */

const kamSti = "M194 30 C 172 4, 122 6, 98 52";

const crestParasaur: CreatureSpec = {
  name: "Trompet-parasaurolophus",
  rarity: "uncommon",
  height: 20,
  aspect: 252 / 172,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 252 172",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="138" y="106" width="22" height="66" rx="10" fill="#6a3fa3" />
        <ellipse cx="149" cy="169" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="64" cy="112" rx="24" ry="24" fill="#6a3fa3" />
        <rect x="52" y="104" width="26" height="68" rx="11" fill="#6a3fa3" />
        <ellipse cx="65" cy="169" rx="14" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-torso">
        <path d="M58 78 C 36 82, 18 96, 4 114 C 22 114, 42 112, 60 116 Z" fill="#8456c0" />
        <ellipse cx="112" cy="94" rx="66" ry="36" fill="#8456c0" />
        <path d="M54 108 C 78 136, 146 138, 170 106 C 146 124, 80 124, 54 108 Z" fill="#efe0fa" />
        <g stroke="#6a3fa3" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M70 66 q 5 9 1 18" />
          <path d="M92 60 q 5 9 1 20" />
          <path d="M114 58 q 5 9 1 20" />
          <path d="M136 62 q 5 9 1 18" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="150" y="106" width="24" height="66" rx="10" fill="#8456c0" />
        <ellipse cx="162" cy="169" rx="13" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="80" cy="112" rx="26" ry="25" fill="#8456c0" />
        <rect x="66" y="104" width="28" height="68" rx="11" fill="#8456c0" />
        <ellipse cx="80" cy="169" rx="15" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-head">
        {/* hals */}
        <path d="M150 84 C 166 72, 178 62, 192 52" stroke="#8456c0" strokeWidth="34" fill="none" strokeLinecap="round" />
        {/* lang rørformet kam bagud med lilla og lyse striber */}
        <path d={kamSti} stroke="#e0c0f4" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d={kamSti} stroke="#5a2f94" strokeWidth="15" fill="none" strokeDasharray="8 9" strokeDashoffset="4" />
        <path d="M192 27 C 172 9, 126 11, 104 48" stroke="#fbf3ff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* næbhoved */}
        <path d="M178 46 C 180 26, 204 22, 218 30 C 232 34, 244 40, 247 48 C 245 57, 232 59, 220 58 C 204 62, 184 62, 178 46 Z" fill="#8456c0" />
        <path d="M222 56 C 232 58, 242 56, 247 49 C 240 53, 230 52, 222 50 Z" fill="#efe0fa" />
        <path d="M244 52 Q 232 60 220 56" stroke="#4a2478" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="238" cy="42" r="2" fill="#4a2478" />
        <circle cx="208" cy="54" r="5" fill="#ffc2b0" opacity="0.7" />
        {EYE(206, 38, 4.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Klippe-ankylosaurus                                                  */
/* ------------------------------------------------------------------ */

const STEN = "#8c939a";
const MOS = "#78a05a";

/** Rygpansrets knopper: to rækker på kuplen. */
const klippeYdre = Array.from({ length: 8 }, (_, i) => paaEllipse(120, 66, 72, 36, 200 + i * 20));
const klippeInde = Array.from({ length: 5 }, (_, i) => paaEllipse(120, 70, 48, 20, 215 + i * 27.5));

/** Små sten-knopper på siden: [x, y]. */
const stenKnopper: [number, number][] = [
  [62, 80],
  [84, 83],
  [106, 84],
  [128, 84],
  [150, 83],
  [172, 80],
];

/** Mos-pletter på ryggen: [x, y, radius, drejning]. */
const mosPletter: [number, number, number, number][] = [
  [62, 54, 9, 10],
  [86, 38, 10, 40],
  [118, 32, 9, 0],
  [148, 38, 11, 20],
  [178, 54, 9, 50],
  [104, 52, 7, 30],
  [136, 54, 6, 10],
  [78, 70, 6, 60],
];

const rockAnkylo: CreatureSpec = {
  name: "Klippe-ankylosaurus",
  rarity: "uncommon",
  height: 12,
  aspect: 244 / 114,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 244 114",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="158" y="82" width="26" height="32" rx="12" fill="#6b727a" />
        <ellipse cx="171" cy="111" rx="12" ry="3.2" fill="#e3e5e8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="82" width="26" height="32" rx="12" fill="#6b727a" />
        <ellipse cx="77" cy="111" rx="12" ry="3.2" fill="#e3e5e8" />
      </g>
      <g className="zoo-torso">
        {/* hale med stenkølle */}
        <path d="M50 62 C 40 64, 32 70, 26 74 C 32 82, 40 86, 52 90 Z" fill={STEN} />
        <ellipse cx="22" cy="74" rx="19" ry="17" fill="#6b727a" />
        <circle cx="14" cy="80" r="4" fill="#aab1b8" />
        <circle cx="26" cy="84" r="3.2" fill="#aab1b8" />
        <path d={plet(22, 66, 6, 20)} fill={MOS} stroke={MOS} strokeWidth="3" strokeLinejoin="round" />
        <g fill="#dcdfe2" stroke="#dcdfe2" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M14 60 L 10 50 L 22 58 Z" />
          <path d="M8 66 L 3 62 L 6 76 Z" />
          <path d="M26 58 L 32 50 L 34 62 Z" />
        </g>
        {/* krop */}
        <path d="M38 76 C 36 40, 78 26, 122 26 C 166 26, 202 42, 202 76 C 202 92, 180 100, 120 100 C 62 100, 40 92, 38 76 Z" fill={STEN} />
        <path d="M44 86 C 70 106, 160 106, 196 86 C 170 98, 70 98, 44 86 Z" fill="#d6dade" />
        <path d="M46 70 C 48 44, 82 32, 122 32 C 164 32, 196 46, 198 70 C 168 62, 76 62, 46 70 Z" fill="#aab1b8" />
        <g stroke="#707880" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M84 36 C 88 46, 88 56, 84 64" />
          <path d="M122 32 C 126 44, 126 54, 122 64" />
          <path d="M160 36 C 164 46, 164 56, 160 64" />
        </g>
        <g fill="#6b727a">
          {klippeYdre.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6" />
          ))}
        </g>
        <g fill="#cfd3d7">
          {klippeInde.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.6" />
          ))}
        </g>
        {/* små sten-knopper på siden */}
        {stenKnopper.map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="4.4" fill="#6b727a" />
            <circle cx={x - 1.2} cy={y - 1.4} r="1.6" fill="#cfd3d7" />
          </g>
        ))}
        {/* mos-grønne pletter, klippet til kroppen */}
        <Klip form={<path d="M38 76 C 36 40, 78 26, 122 26 C 166 26, 202 42, 202 76 C 202 92, 180 100, 120 100 C 62 100, 40 92, 38 76 Z" />}>
          <g fill={MOS} stroke={MOS} strokeWidth="3" strokeLinejoin="round">
            {mosPletter.map(([x, y, r, d]) => (
              <path key={`${x}-${y}`} d={plet(x, y, r, d)} />
            ))}
          </g>
          <g fill="#58803f">
            <circle cx="64" cy="52" r="2.4" /><circle cx="88" cy="36" r="2.6" /><circle cx="150" cy="38" r="2.8" />
            <circle cx="120" cy="30" r="2.2" /><circle cx="176" cy="54" r="2.2" />
          </g>
        </Klip>
        {/* sidepigge */}
        <g fill="#dcdfe2" stroke="#dcdfe2" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M44 74 L 34 66 L 46 86 Z" />
          <path d="M196 74 L 206 66 L 194 86 Z" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="170" y="82" width="28" height="32" rx="12" fill={STEN} />
        <ellipse cx="184" cy="111" rx="13" ry="3.2" fill="#e3e5e8" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="76" y="82" width="28" height="32" rx="12" fill={STEN} />
        <ellipse cx="90" cy="111" rx="13" ry="3.2" fill="#e3e5e8" />
      </g>
      <g className="zoo-head">
        <path d="M188 60 L 182 44 L 202 56 Z" fill="#dcdfe2" stroke="#dcdfe2" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M188 62 C 196 52, 222 54, 232 66 C 240 76, 238 90, 226 94 C 210 98, 192 94, 188 84 Z" fill={STEN} />
        <path d="M226 68 C 236 74, 238 88, 228 94 C 222 96, 220 90, 220 84 Z" fill="#aab1b8" />
        <circle cx="200" cy="62" r="3" fill="#6b727a" />
        <circle cx="214" cy="59" r="3" fill="#6b727a" />
        <path d="M204 92 Q 218 98 232 88" stroke="#4a5058" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="206" cy="86" r="5" fill="#ffb59e" opacity="0.7" />
        {EYE(210, 72, 4.2)}
      </g>
    </>
  ),
};

export const variants: Record<string, CreatureSpec> = {
  featherRex,
  featherRaptor,
  spottedBrachio,
  stripedStego,
  desertTrice,
  nightPteranodon,
  crestParasaur,
  rockAnkylo,
};
