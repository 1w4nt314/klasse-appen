import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Dino-dalens ni almindelige dinosaurer. Alle er tegnet i profil, vendt mod
 * højre, med fødderne på bunden af viewBox. Ben ligger i `zoo-leg-a`/`zoo-leg-b`
 * (firbenede: diagonal gangart, tobenede: a og b), krop i `zoo-torso` og hoved i
 * `zoo-head`. Fjerne ben tegnes først og er mørkere end de nære.
 */

/** Afrunder et beregnet tal til to decimaler (rene, korte koordinater). */
const r2 = (v: number) => +v.toFixed(2);

/** Punkt på en ellipse (vinkel i grader, y vender nedad). */
const paaEllipse = (cx: number, cy: number, rx: number, ry: number, grader: number) => {
  const v = (grader * Math.PI) / 180;
  return { x: r2(cx + rx * Math.cos(v)), y: r2(cy + ry * Math.sin(v)) };
};

/* ------------------------------------------------------------------ */
/* T. rex                                                               */
/* ------------------------------------------------------------------ */

const tRex: CreatureSpec = {
  name: "T. rex",
  height: 28,
  aspect: 262 / 184,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 12 262 184",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="112" cy="124" rx="22" ry="28" fill="#4b9a4a" />
        <path d="M108 138 C 106 156, 108 168, 108 176" stroke="#4b9a4a" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="189" rx="19" ry="7" fill="#4b9a4a" />
      </g>
      <g className="zoo-torso">
        {/* hale */}
        <path d="M78 82 C 52 86, 26 102, 4 134 C 26 136, 54 128, 84 122 Z" fill="#5fae5a" />
        <path d="M58 118 C 40 126, 24 132, 8 134" stroke="#e6f0b5" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="122" cy="98" rx="64" ry="44" fill="#5fae5a" />
        <path d="M66 112 C 82 146, 160 150, 184 112 C 160 130, 96 132, 66 112 Z" fill="#e6f0b5" />
        <g stroke="#4b9a4a" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M84 62 q 6 10 2 20" />
          <path d="M106 56 q 6 10 2 22" />
          <path d="M128 56 q 6 10 2 22" />
        </g>
        {/* små arme */}
        <path d="M176 108 C 186 110, 192 116, 192 124" stroke="#4b9a4a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M192 126 l 3 6 M192 126 l -3 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* nært ben */}
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="144" cy="122" rx="27" ry="31" fill="#5fae5a" />
        <path d="M144 138 C 142 156, 144 168, 144 176" stroke="#5fae5a" strokeWidth="26" fill="none" strokeLinecap="round" />
        <ellipse cx="156" cy="188" rx="21" ry="8" fill="#5fae5a" />
        <path d="M168 190 h 6 M162 193 h 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <ellipse cx="178" cy="74" rx="24" ry="26" fill="#5fae5a" />
        <path d="M164 52 C 164 24, 206 12, 236 24 C 256 30, 260 52, 254 64 C 248 82, 222 88, 196 86 C 174 84, 162 66, 166 40 Z" fill="#5fae5a" />
        {/* lys hage */}
        <path d="M200 84 C 220 90, 244 84, 254 66 C 250 78, 232 82, 214 76 Z" fill="#e6f0b5" />
        {/* venligt smil */}
        <path d="M250 62 C 240 76, 224 76, 212 66" stroke="#2f6d33" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="252" cy="42" r="2.6" fill="#2f6d33" />
        <circle cx="214" cy="62" r="7" fill="#ffc2b0" opacity="0.7" />
        {EYE(224, 40, 6)}
        <path d="M214 28 q 10 -4 20 2" stroke="#4b9a4a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Triceratops                                                          */
/* ------------------------------------------------------------------ */

/** Skjoldets runde kant: cirkler på en ellipse bag hovedet. */
const skjoldKant = Array.from({ length: 10 }, (_, i) => paaEllipse(158, 56, 32, 40, 140 + i * 20));

const triceratops: CreatureSpec = {
  name: "Triceratops",
  height: 18,
  aspect: 244 / 140,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 244 140",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="128" y="94" width="24" height="46" rx="10" fill="#c0692a" />
        <ellipse cx="140" cy="137" rx="11" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="94" width="24" height="46" rx="10" fill="#c0692a" />
        <ellipse cx="56" cy="137" rx="11" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-torso">
        <path d="M42 62 C 24 68, 12 84, 6 102 C 20 98, 34 96, 46 94 Z" fill="#e08a3c" />
        <ellipse cx="98" cy="80" rx="68" ry="38" fill="#e08a3c" />
        <path d="M40 94 C 66 120, 130 122, 158 96 C 134 108, 66 108, 40 94 Z" fill="#fbe3c4" />
        <g fill="#c0692a">
          <circle cx="70" cy="56" r="5" /><circle cx="92" cy="50" r="5" /><circle cx="114" cy="52" r="5" />
          <circle cx="82" cy="68" r="4" /><circle cx="104" cy="64" r="4" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="136" y="94" width="26" height="46" rx="10" fill="#e08a3c" />
        <ellipse cx="149" cy="137" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="94" width="26" height="46" rx="10" fill="#e08a3c" />
        <ellipse cx="65" cy="137" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-head">
        {/* nakkeskjold */}
        <g fill="#cf6a2e">
          {skjoldKant.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="7" />
          ))}
        </g>
        <ellipse cx="158" cy="56" rx="32" ry="40" fill="#cf6a2e" />
        <ellipse cx="158" cy="58" rx="21" ry="29" fill="#f2a65a" />
        <g fill="#fbe3c4">
          {skjoldKant.slice(1, 9).map((p, i) => (
            <circle key={i} cx={r2(p.x * 0.8 + 158 * 0.2)} cy={r2(p.y * 0.8 + 58 * 0.2)} r="2.6" />
          ))}
        </g>
        {/* de to bageste horn (fjerne) */}
        <path d="M200 56 L 240 36 L 214 68 Z" fill="#e5d6ae" stroke="#e5d6ae" strokeWidth="3" strokeLinejoin="round" />
        {/* hoved */}
        <path d="M164 68 C 172 52, 198 50, 216 60 C 230 68, 234 84, 226 94 C 216 106, 186 108, 172 98 C 162 90, 160 78, 164 68 Z" fill="#e08a3c" />
        <path d="M214 60 C 228 66, 236 80, 230 92 C 226 98, 218 98, 212 94 Z" fill="#f2c18a" />
        <path d="M198 98 Q 214 104 228 92" stroke="#8a4a1c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* næsehorn */}
        <path d="M218 68 L 234 54 L 230 78 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        {/* nære øjenbrynshorn */}
        <path d="M192 56 L 232 20 L 208 64 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        {EYE(196, 72, 5)}
        <circle cx="206" cy="88" r="5.5" fill="#ffc2b0" opacity="0.7" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Brachiosaurus                                                        */
/* ------------------------------------------------------------------ */

const brachiosaurus: CreatureSpec = {
  name: "Brachiosaurus",
  height: 36,
  aspect: 226 / 300,
  gait: "walk",
  pace: 0.5,
  viewBox: "0 0 226 300",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="126" y="226" width="26" height="74" rx="12" fill="#3a9488" />
        <ellipse cx="139" cy="295" rx="16" ry="5" fill="#cdeee0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="236" width="26" height="64" rx="12" fill="#3a9488" />
        <ellipse cx="51" cy="295" rx="16" ry="5" fill="#cdeee0" />
      </g>
      <g className="zoo-torso">
        <path d="M30 208 C 16 212, 8 226, 4 244 C 18 240, 32 238, 42 238 Z" fill="#4fb3a5" />
        <ellipse cx="98" cy="220" rx="76" ry="42" fill="#4fb3a5" />
        <path d="M32 238 C 56 268, 130 270, 164 238 C 134 254, 62 254, 32 238 Z" fill="#cdeee0" />
        <g fill="#3a9488">
          <circle cx="58" cy="196" r="6" /><circle cx="82" cy="188" r="6" /><circle cx="106" cy="190" r="6" />
          <circle cx="70" cy="212" r="5" /><circle cx="94" cy="206" r="5" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="140" y="226" width="28" height="74" rx="12" fill="#4fb3a5" />
        <ellipse cx="154" cy="295" rx="17" ry="5" fill="#cdeee0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="236" width="28" height="64" rx="12" fill="#4fb3a5" />
        <ellipse cx="66" cy="295" rx="17" ry="5" fill="#cdeee0" />
      </g>
      <g className="zoo-head">
        {/* lang hals */}
        <path d="M112 208 C 130 164, 134 110, 142 62 C 148 46, 170 46, 176 62 C 182 112, 184 174, 172 246 Z" fill="#4fb3a5" />
        <path d="M166 76 C 170 116, 170 168, 162 222" stroke="#cdeee0" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* hoved */}
        <ellipse cx="184" cy="42" rx="26" ry="17" fill="#4fb3a5" />
        <circle cx="170" cy="28" r="10" fill="#4fb3a5" />
        <path d="M168 50 C 182 58, 200 58, 208 48" stroke="#cdeee0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M198 50 Q 204 56 210 46" stroke="#2c6d63" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="207" cy="36" r="2.4" fill="#2c6d63" />
        <circle cx="190" cy="50" r="4.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(190, 38, 4.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Stegosaurus                                                          */
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

const stegosaurus: CreatureSpec = {
  name: "Stegosaurus",
  height: 18,
  aspect: 252 / 148,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 252 148",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="150" y="100" width="22" height="48" rx="10" fill="#4b9a4a" />
        <ellipse cx="161" cy="145" rx="11" ry="3.5" fill="#e6f0b5" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="58" y="96" width="26" height="52" rx="11" fill="#4b9a4a" />
        <ellipse cx="71" cy="145" rx="13" ry="3.5" fill="#e6f0b5" />
      </g>
      <g className="zoo-torso">
        {/* pigge på halen */}
        <g fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round">
          <path d="M16 90 L 6 56 L 34 80 Z" />
          <path d="M36 82 L 32 44 L 56 72 Z" />
          <path d="M18 98 L 4 124 L 36 102 Z" />
          <path d="M38 100 L 30 126 L 56 100 Z" />
        </g>
        {/* hale */}
        <path d="M54 64 C 36 66, 20 76, 10 92 C 24 100, 42 108, 62 108 Z" fill="#5fae5a" />
        {/* plader */}
        <g fill="#f08a2e" stroke="#f08a2e" strokeWidth="3" strokeLinejoin="round">
          {pladeSpec.map(([x, w, h]) => (
            <path key={x} d={plade(x, w, h)} />
          ))}
        </g>
        <g stroke="#f8b872" strokeWidth="4" strokeLinecap="round">
          {pladeSpec.map(([x, , h]) => (
            <path key={x} d={`M${x} ${r2(rygY(x) - h * 0.6)} V ${r2(rygY(x) - 2)}`} />
          ))}
        </g>
        <ellipse cx="112" cy="82" rx="80" ry="40" fill="#5fae5a" />
        <path d="M40 98 C 64 124, 150 126, 186 96 C 160 112, 66 112, 40 98 Z" fill="#e6f0b5" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="160" y="100" width="24" height="48" rx="10" fill="#5fae5a" />
        <ellipse cx="172" cy="145" rx="12" ry="3.5" fill="#e6f0b5" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="96" width="28" height="52" rx="11" fill="#5fae5a" />
        <ellipse cx="84" cy="145" rx="14" ry="3.5" fill="#e6f0b5" />
      </g>
      <g className="zoo-head">
        <path d="M172 78 C 190 82, 206 90, 218 104" stroke="#5fae5a" strokeWidth="32" fill="none" strokeLinecap="round" />
        <ellipse cx="228" cy="108" rx="23" ry="15" fill="#5fae5a" />
        <path d="M212 118 C 224 126, 240 126, 249 114" stroke="#e6f0b5" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M247 112 Q 238 120 226 117" stroke="#2f6d33" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="246" cy="102" r="2.2" fill="#2f6d33" />
        <circle cx="222" cy="116" r="4.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(233, 101, 4.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Ankylosaurus                                                         */
/* ------------------------------------------------------------------ */

/** Rygpansrets knopper: to rækker på kuplen. */
const panserYdre = Array.from({ length: 8 }, (_, i) => paaEllipse(120, 66, 72, 36, 200 + i * 20));
const panserInde = Array.from({ length: 5 }, (_, i) => paaEllipse(120, 70, 48, 20, 215 + i * 27.5));

const ankylosaurus: CreatureSpec = {
  name: "Ankylosaurus",
  height: 12,
  aspect: 244 / 114,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 244 114",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="158" y="82" width="26" height="32" rx="12" fill="#8a5a2a" />
        <ellipse cx="171" cy="111" rx="12" ry="3.2" fill="#efe0b8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="82" width="26" height="32" rx="12" fill="#8a5a2a" />
        <ellipse cx="77" cy="111" rx="12" ry="3.2" fill="#efe0b8" />
      </g>
      <g className="zoo-torso">
        {/* hale med kølle */}
        <path d="M50 62 C 40 64, 32 70, 26 74 C 32 82, 40 86, 52 90 Z" fill="#b88a55" />
        <ellipse cx="22" cy="74" rx="19" ry="17" fill="#8a5a2a" />
        <g fill="#f4ead0" stroke="#f4ead0" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M14 60 L 10 50 L 22 58 Z" />
          <path d="M8 66 L 3 62 L 6 76 Z" />
          <path d="M26 58 L 32 50 L 34 62 Z" />
        </g>
        {/* krop */}
        <path d="M38 76 C 36 40, 78 26, 122 26 C 166 26, 202 42, 202 76 C 202 92, 180 100, 120 100 C 62 100, 40 92, 38 76 Z" fill="#b88a55" />
        <path d="M44 86 C 70 106, 160 106, 196 86 C 170 98, 70 98, 44 86 Z" fill="#efe0b8" />
        <path d="M46 70 C 48 44, 82 32, 122 32 C 164 32, 196 46, 198 70 C 168 62, 76 62, 46 70 Z" fill="#d9b97c" />
        <g stroke="#a9763e" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M84 36 C 88 46, 88 56, 84 64" />
          <path d="M122 32 C 126 44, 126 54, 122 64" />
          <path d="M160 36 C 164 46, 164 56, 160 64" />
        </g>
        <g fill="#8a5a2a">
          {panserYdre.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6" />
          ))}
        </g>
        <g fill="#f4ead0">
          {panserInde.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.6" />
          ))}
        </g>
        {/* sidepigge */}
        <g fill="#f4ead0" stroke="#f4ead0" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M44 74 L 34 66 L 46 86 Z" />
          <path d="M196 74 L 206 66 L 194 86 Z" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="170" y="82" width="28" height="32" rx="12" fill="#b88a55" />
        <ellipse cx="184" cy="111" rx="13" ry="3.2" fill="#efe0b8" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="76" y="82" width="28" height="32" rx="12" fill="#b88a55" />
        <ellipse cx="90" cy="111" rx="13" ry="3.2" fill="#efe0b8" />
      </g>
      <g className="zoo-head">
        <path d="M188 60 L 182 44 L 202 56 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M188 62 C 196 52, 222 54, 232 66 C 240 76, 238 90, 226 94 C 210 98, 192 94, 188 84 Z" fill="#b88a55" />
        <path d="M226 68 C 236 74, 238 88, 228 94 C 222 96, 220 90, 220 84 Z" fill="#d9b97c" />
        <path d="M204 92 Q 218 98 232 88" stroke="#6b4420" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="206" cy="86" r="5" fill="#ffc2b0" opacity="0.7" />
        {EYE(210, 72, 4.2)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Velociraptor                                                         */
/* ------------------------------------------------------------------ */

/** Lille fjer: smal dråbeform drejet om sin rod. */
const fjer = (x: number, y: number, vinkel: number, laengde: number, farve: string) => (
  <ellipse
    cx={r2(x + laengde / 2)}
    cy={y}
    rx={r2(laengde / 2)}
    ry={r2(laengde / 5)}
    fill={farve}
    transform={`rotate(${vinkel} ${x} ${y})`}
  />
);

const velociraptor: CreatureSpec = {
  name: "Velociraptor",
  height: 11,
  aspect: 182 / 128,
  gait: "walk",
  pace: 1.4,
  viewBox: "-12 0 182 128",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M80 82 L 94 102" stroke="#7d5cb8" strokeWidth="16" strokeLinecap="round" />
        <path d="M94 102 L 80 116" stroke="#7d5cb8" strokeWidth="8" strokeLinecap="round" />
        <path d="M78 124 H 100" stroke="#7d5cb8" strokeWidth="8" strokeLinecap="round" />
        <path d="M99 121 q 7 -1 8 -9" stroke="#f4ead0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {/* hale med fjerdusk */}
        <path d="M54 70 C 38 64, 22 58, 8 52 C 10 66, 30 84, 58 88 Z" fill="#9a78d0" />
        {fjer(10, 52, 200, 18, "#3fc1b5")}
        {fjer(10, 54, 170, 20, "#f27aa8")}
        {fjer(12, 56, 140, 18, "#3fc1b5")}
        <g transform="rotate(-12 86 72)">
          <ellipse cx="86" cy="72" rx="38" ry="22" fill="#9a78d0" />
          <path d="M52 78 C 70 98, 108 98, 124 76 C 106 88, 70 88, 52 78 Z" fill="#e9ddf7" />
          <g stroke="#7d5cb8" strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M68 54 q 4 8 0 14" />
            <path d="M84 52 q 4 8 0 14" />
            <path d="M100 54 q 4 8 0 14" />
          </g>
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M94 84 L 110 104" stroke="#9a78d0" strokeWidth="17" strokeLinecap="round" />
        <path d="M110 104 L 96 117" stroke="#9a78d0" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M92 124 H 116" stroke="#9a78d0" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M114 121 q 8 -1 9 -10" stroke="#f4ead0" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
      {/* arm med fjer */}
      <g>
        {fjer(112, 72, 110, 20, "#f27aa8")}
        {fjer(112, 72, 80, 20, "#3fc1b5")}
        {fjer(112, 72, 50, 18, "#f27aa8")}
        <path d="M110 68 L 124 80" stroke="#7d5cb8" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M104 66 C 112 52, 120 44, 128 38 L 142 46 C 134 58, 126 68, 118 78 Z" fill="#9a78d0" />
        <path d="M120 30 C 124 18, 146 18, 158 28 C 166 34, 162 44, 152 46 C 140 50, 124 48, 120 38 Z" fill="#9a78d0" />
        <path d="M130 46 C 140 52, 154 52, 160 44 C 152 48, 140 46, 130 46 Z" fill="#e9ddf7" />
        {/* fjerkam på hovedet */}
        {fjer(124, 26, 250, 18, "#f27aa8")}
        {fjer(128, 24, 270, 18, "#3fc1b5")}
        {fjer(134, 23, 290, 16, "#f27aa8")}
        <path d="M160 40 Q 152 46 144 43" stroke="#5a3d92" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="32" r="1.8" fill="#5a3d92" />
        <circle cx="140" cy="42" r="3.6" fill="#ffc2b0" opacity="0.7" />
        {EYE(142, 33, 4.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Parasaurolophus                                                      */
/* ------------------------------------------------------------------ */

const parasaurolophus: CreatureSpec = {
  name: "Parasaurolophus",
  height: 20,
  aspect: 252 / 172,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 252 172",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="138" y="106" width="22" height="66" rx="10" fill="#c8922a" />
        <ellipse cx="149" cy="169" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="64" cy="112" rx="24" ry="24" fill="#c8922a" />
        <rect x="52" y="104" width="26" height="68" rx="11" fill="#c8922a" />
        <ellipse cx="65" cy="169" rx="14" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-torso">
        <path d="M58 78 C 36 82, 18 96, 4 114 C 22 114, 42 112, 60 116 Z" fill="#e8b43a" />
        <ellipse cx="112" cy="94" rx="66" ry="36" fill="#e8b43a" />
        <path d="M54 108 C 78 136, 146 138, 170 106 C 146 124, 80 124, 54 108 Z" fill="#fbe9b8" />
        <g stroke="#c8922a" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M70 66 q 5 9 1 18" />
          <path d="M92 60 q 5 9 1 20" />
          <path d="M114 58 q 5 9 1 20" />
          <path d="M136 62 q 5 9 1 18" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="150" y="106" width="24" height="66" rx="10" fill="#e8b43a" />
        <ellipse cx="162" cy="169" rx="13" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="80" cy="112" rx="26" ry="25" fill="#e8b43a" />
        <rect x="66" y="104" width="28" height="68" rx="11" fill="#e8b43a" />
        <ellipse cx="80" cy="169" rx="15" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-head">
        {/* hals */}
        <path d="M150 84 C 166 72, 178 62, 192 52" stroke="#e8b43a" strokeWidth="34" fill="none" strokeLinecap="round" />
        {/* lang rørformet kam bagud */}
        <path d="M194 30 C 172 4, 122 6, 98 52" stroke="#e0643c" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M192 27 C 172 9, 126 11, 104 48" stroke="#f4a07a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <g stroke="#b94a2a" strokeWidth="3" strokeLinecap="round">
          <path d="M176 12 l 3 12" />
          <path d="M156 10 l 1 12" />
          <path d="M134 14 l -2 11" />
          <path d="M116 26 l -5 9" />
        </g>
        {/* næbhoved */}
        <path d="M178 46 C 180 26, 204 22, 218 30 C 232 34, 244 40, 247 48 C 245 57, 232 59, 220 58 C 204 62, 184 62, 178 46 Z" fill="#e8b43a" />
        <path d="M222 56 C 232 58, 242 56, 247 49 C 240 53, 230 52, 222 50 Z" fill="#fbe9b8" />
        <path d="M244 52 Q 232 60 220 56" stroke="#8a5e12" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="238" cy="42" r="2" fill="#8a5e12" />
        <circle cx="208" cy="54" r="5" fill="#ffc2b0" opacity="0.7" />
        {EYE(206, 38, 4.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Spinosaurus                                                          */
/* ------------------------------------------------------------------ */

/** Sejlets knogler: stråler fra ryggen op mod kanten. */
const sejlStraaler = Array.from({ length: 7 }, (_, i) => {
  const rod = paaEllipse(126, 90, 46, 14, 190 + i * 26.7);
  const spids = paaEllipse(126, 62, 52, 48, 190 + i * 26.7);
  return { rod, spids };
});

const spinosaurus: CreatureSpec = {
  name: "Spinosaurus",
  height: 24,
  aspect: 270 / 172,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 270 172",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="112" cy="124" rx="20" ry="26" fill="#4a7fae" />
        <path d="M110 138 C 108 152, 110 160, 110 164" stroke="#4a7fae" strokeWidth="18" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="167" rx="17" ry="5.5" fill="#4a7fae" />
      </g>
      <g className="zoo-torso">
        {/* sejl */}
        <path d="M70 90 C 66 44, 98 12, 128 10 C 160 10, 186 44, 184 90 Z" fill="#ee6e5a" />
        <g stroke="#f8a690" strokeWidth="4.5" strokeLinecap="round">
          {sejlStraaler.map((s, i) => (
            <path key={i} d={`M${s.rod.x} ${s.rod.y} L ${s.spids.x} ${s.spids.y}`} />
          ))}
        </g>
        <path d="M70 90 C 66 44, 98 12, 128 10 C 160 10, 186 44, 184 90" stroke="#d9503c" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* hale */}
        <path d="M70 84 C 44 90, 22 106, 4 134 C 26 130, 52 126, 76 122 Z" fill="#5b93c4" />
        {/* krop */}
        <ellipse cx="126" cy="100" rx="64" ry="34" fill="#5b93c4" />
        <path d="M70 114 C 92 144, 156 146, 184 112 C 160 128, 96 128, 70 114 Z" fill="#dcebf7" />
        {/* små arme */}
        <path d="M168 108 C 178 110, 184 116, 184 124" stroke="#4a7fae" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="138" cy="122" rx="24" ry="28" fill="#5b93c4" />
        <path d="M138 138 C 136 152, 138 160, 138 164" stroke="#5b93c4" strokeWidth="21" fill="none" strokeLinecap="round" />
        <ellipse cx="148" cy="166" rx="19" ry="6" fill="#5b93c4" />
      </g>
      <g className="zoo-head">
        {/* hals */}
        <path d="M168 96 C 184 86, 196 76, 206 66" stroke="#5b93c4" strokeWidth="36" fill="none" strokeLinecap="round" />
        {/* lang krokodilleagtig snude */}
        <path d="M192 54 C 208 44, 236 50, 262 62 C 268 66, 266 76, 256 78 C 236 82, 214 86, 196 84 C 186 76, 184 62, 192 54 Z" fill="#5b93c4" />
        <path d="M200 82 C 222 88, 246 82, 260 72 C 248 78, 222 80, 200 74 Z" fill="#dcebf7" />
        <path d="M262 72 C 244 80, 226 80, 212 74" stroke="#2c5a86" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <circle cx="258" cy="62" r="2.4" fill="#2c5a86" />
        <circle cx="212" cy="72" r="5.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(210, 58, 5)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Pachycephalosaurus                                                   */
/* ------------------------------------------------------------------ */

const pachycephalosaurus: CreatureSpec = {
  name: "Pachycephalosaurus",
  height: 13,
  aspect: 152 / 126,
  gait: "walk",
  pace: 1,
  viewBox: "0 12.75 152 126",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M58 98 L 70 116" stroke="#b4604d" strokeWidth="20" strokeLinecap="round" />
        <path d="M70 116 L 58 128" stroke="#b4604d" strokeWidth="11" strokeLinecap="round" />
        <path d="M54 134 H 76" stroke="#b4604d" strokeWidth="9" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <path d="M36 70 C 20 72, 8 82, 2 94 C 16 98, 30 98, 42 100 Z" fill="#d27a6b" />
        <ellipse cx="68" cy="84" rx="40" ry="28" fill="#d27a6b" />
        <path d="M32 94 C 50 114, 88 114, 104 92 C 88 104, 52 104, 32 94 Z" fill="#f6dcc4" />
        <g stroke="#b4604d" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M52 62 q 4 7 0 14" />
          <path d="M68 60 q 4 7 0 14" />
          <path d="M84 62 q 4 7 0 14" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M74 100 L 88 118" stroke="#d27a6b" strokeWidth="21" strokeLinecap="round" />
        <path d="M88 118 L 76 128" stroke="#d27a6b" strokeWidth="12" strokeLinecap="round" />
        <path d="M72 134 H 96" stroke="#d27a6b" strokeWidth="9.5" strokeLinecap="round" />
      </g>
      <path d="M96 84 C 104 84, 108 90, 108 96" stroke="#b4604d" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g className="zoo-head">
        <path d="M92 78 C 100 70, 106 64, 112 58" stroke="#d27a6b" strokeWidth="26" fill="none" strokeLinecap="round" />
        {/* hoved og kort snude */}
        <ellipse cx="124" cy="58" rx="26" ry="16" fill="#d27a6b" />
        <path d="M104 66 C 116 76, 138 74, 148 62 C 138 68, 118 68, 104 66 Z" fill="#f6dcc4" />
        {/* tyk kuppel-pande */}
        <ellipse cx="112" cy="38" rx="23" ry="21" fill="#f3d4a8" />
        <path d="M96 30 C 102 21, 114 19, 124 24" stroke="#fff3da" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        <g fill="#e2b87e">
          <circle cx="94" cy="54" r="4.4" />
          <circle cx="90" cy="44" r="4" />
          <circle cx="134" cy="48" r="4" />
          <circle cx="145" cy="52" r="3.6" />
        </g>
        <path d="M146 64 Q 138 70 128 67" stroke="#7a3a2a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="148" cy="55" r="2" fill="#7a3a2a" />
        <circle cx="122" cy="66" r="4" fill="#ffc2b0" opacity="0.7" />
        {EYE(128, 58, 4.4)}
      </g>
    </>
  ),
};

export const base: Record<string, CreatureSpec> = {
  tRex,
  triceratops,
  brachiosaurus,
  stegosaurus,
  ankylosaurus,
  velociraptor,
  parasaurolophus,
  spinosaurus,
  pachycephalosaurus,
};
