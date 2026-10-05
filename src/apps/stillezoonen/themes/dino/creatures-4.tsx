import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Dino-dalens ottende gruppe: otte flere almindelige dinosaurer i samme stil som
 * creatures-1. Profil mod højre, fødderne på viewBox'ens bund. Ben ligger i
 * `zoo-leg-a`/`zoo-leg-b`, krop i `zoo-torso` og hoved i `zoo-head`. Fjerne ben
 * tegnes først og er mørkere end de nære.
 */

/** Afrunder et beregnet tal til to decimaler (rene, korte koordinater). */
const r2 = (v: number) => +v.toFixed(2);

/** Punkt på en ellipse (vinkel i grader, y vender nedad). */
const paaEllipse = (cx: number, cy: number, rx: number, ry: number, grader: number) => {
  const v = (grader * Math.PI) / 180;
  return { x: r2(cx + rx * Math.cos(v)), y: r2(cy + ry * Math.sin(v)) };
};

/** Punkt i en given retning (grader) og afstand fra (x, y). */
const frem = (x: number, y: number, grader: number, laengde: number) => {
  const v = (grader * Math.PI) / 180;
  return { x: r2(x + laengde * Math.cos(v)), y: r2(y + laengde * Math.sin(v)) };
};

/** Smal pig fra (x, y) i en retning: trekant med afrundede hjørner (via stroke). */
const pig = (x: number, y: number, grader: number, laengde: number, bredde: number) => {
  const spids = frem(x, y, grader, laengde);
  const a = frem(x, y, grader + 90, bredde / 2);
  const b = frem(x, y, grader - 90, bredde / 2);
  return `M${a.x} ${a.y} L ${spids.x} ${spids.y} L ${b.x} ${b.y} Z`;
};

/* ------------------------------------------------------------------ */
/* Allosaurus                                                           */
/* ------------------------------------------------------------------ */

const allosaurus: CreatureSpec = {
  name: "Allosaurus",
  height: 24,
  aspect: 250 / 164,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 250 164",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="104" cy="116" rx="20" ry="26" fill="#a04c2a" />
        <path d="M102 134 C 100 146, 102 152, 102 154" stroke="#a04c2a" strokeWidth="18" fill="none" strokeLinecap="round" />
        <ellipse cx="112" cy="158" rx="18" ry="6" fill="#a04c2a" />
      </g>
      <g className="zoo-torso">
        {/* hale */}
        <path d="M74 66 C 46 66, 22 80, 4 104 C 28 110, 56 110, 82 112 Z" fill="#c4663c" />
        <path d="M58 100 C 42 104, 24 104, 10 104" stroke="#f3d9b8" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="118" cy="92" rx="60" ry="38" fill="#c4663c" />
        <path d="M62 104 C 78 138, 150 140, 172 104 C 150 124, 90 124, 62 104 Z" fill="#f3d9b8" />
        <g stroke="#a04c2a" strokeWidth="5.5" fill="none" strokeLinecap="round">
          <path d="M82 60 q 5 9 1 18" />
          <path d="M104 55 q 5 9 1 20" />
          <path d="M126 55 q 5 9 1 20" />
          <path d="M148 60 q 5 9 1 18" />
        </g>
        {/* arm med tre små fingre */}
        <path d="M164 98 C 176 102, 184 108, 186 116" stroke="#a04c2a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M186 118 l 4 6 M186 118 l 0 7 M186 118 l -4 6" stroke="#f3d9b8" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      {/* nært ben */}
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="134" cy="114" rx="24" ry="28" fill="#c4663c" />
        <path d="M134 132 C 132 146, 134 152, 134 154" stroke="#c4663c" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="146" cy="158" rx="20" ry="6" fill="#c4663c" />
        <path d="M160 160 h 6 M154 162 h 6" stroke="#f3d9b8" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M150 90 C 160 84, 170 76, 178 66" stroke="#c4663c" strokeWidth="34" fill="none" strokeLinecap="round" />
        <path d="M160 56 C 160 28, 190 20, 214 26 C 234 30, 248 42, 248 54 C 248 68, 226 74, 200 74 C 176 74, 160 70, 160 56 Z" fill="#c4663c" />
        {/* lys hage */}
        <path d="M200 74 C 224 78, 244 70, 248 56 C 242 66, 220 68, 206 64 Z" fill="#f3d9b8" />
        {/* venligt smil */}
        <path d="M245 56 C 236 68, 218 68, 208 60" stroke="#6e2f18" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="241" cy="42" r="2.4" fill="#6e2f18" />
        <circle cx="200" cy="60" r="6.5" fill="#ffc2b0" opacity="0.7" />
        {/* små horn over øjnene */}
        <path d="M207 31 L 213 15 L 223 31 Z" fill="#f3d9b8" stroke="#f3d9b8" strokeWidth="3" strokeLinejoin="round" />
        <path d="M191 34 L 195 21 L 203 34 Z" fill="#f3d9b8" stroke="#f3d9b8" strokeWidth="3" strokeLinejoin="round" />
        {EYE(216, 44, 5.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Diplodocus                                                           */
/* ------------------------------------------------------------------ */

const diplodocus: CreatureSpec = {
  name: "Diplodocus",
  height: 17,
  aspect: 390 / 124,
  gait: "walk",
  pace: 0.55,
  viewBox: "0 0 390 124",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="206" y="82" width="22" height="42" rx="10" fill="#6a86a2" />
        <ellipse cx="217" cy="121" rx="12" ry="3.2" fill="#dbe6ef" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="136" y="82" width="22" height="42" rx="10" fill="#6a86a2" />
        <ellipse cx="147" cy="121" rx="12" ry="3.2" fill="#dbe6ef" />
      </g>
      <g className="zoo-torso">
        {/* meget lang pisk-hale */}
        <path d="M140 54 C 102 56, 64 76, 36 82 C 22 84, 10 80, 4 68 C 8 88, 26 96, 46 94 C 80 92, 112 94, 142 92 Z" fill="#8aa6c0" />
        <path d="M130 84 C 100 86, 70 88, 40 88" stroke="#dbe6ef" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="192" cy="68" rx="64" ry="38" fill="#8aa6c0" />
        <path d="M132 82 C 150 116, 234 116, 254 82 C 232 102, 154 102, 132 82 Z" fill="#dbe6ef" />
        <g fill="#6a86a2">
          <circle cx="160" cy="46" r="5" /><circle cx="184" cy="40" r="5" /><circle cx="208" cy="42" r="5" />
          <circle cx="172" cy="58" r="4" /><circle cx="196" cy="54" r="4" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="222" y="82" width="24" height="42" rx="10" fill="#8aa6c0" />
        <ellipse cx="234" cy="121" rx="13" ry="3.2" fill="#dbe6ef" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="150" y="82" width="24" height="42" rx="10" fill="#8aa6c0" />
        <ellipse cx="162" cy="121" rx="13" ry="3.2" fill="#dbe6ef" />
      </g>
      <g className="zoo-head">
        {/* meget lang vandret hals */}
        <path d="M226 34 C 270 32, 312 28, 350 28 L 350 54 C 312 58, 274 70, 236 96 Z" fill="#8aa6c0" />
        <path d="M248 70 C 282 58, 316 52, 348 50" stroke="#dbe6ef" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* lille hoved */}
        <ellipse cx="363" cy="40" rx="18" ry="14" fill="#8aa6c0" />
        <ellipse cx="376" cy="46" rx="9" ry="8" fill="#8aa6c0" />
        <path d="M352 50 C 360 56, 374 56, 384 49" stroke="#dbe6ef" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M383 48 Q 376 55 366 51" stroke="#3f5a75" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="382" cy="40" r="1.8" fill="#3f5a75" />
        <circle cx="359" cy="49" r="3.6" fill="#ffc2b0" opacity="0.7" />
        {EYE(366, 36, 4.4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Styracosaurus                                                        */
/* ------------------------------------------------------------------ */

/** Skjoldets pigge: en krans af lange pigge rundt om skjoldets øvre kant. */
const skjoldPigge = Array.from({ length: 9 }, (_, i) => {
  const vinkel = 130 + i * 21.25;
  const rod = paaEllipse(158, 66, 24, 32, vinkel);
  const spids = paaEllipse(158, 66, 56, 58, vinkel);
  return pig(rod.x, rod.y, (Math.atan2(spids.y - rod.y, spids.x - rod.x) * 180) / Math.PI, Math.hypot(spids.x - rod.x, spids.y - rod.y), 11);
});

const styracosaurus: CreatureSpec = {
  name: "Styracosaurus",
  height: 17,
  aspect: 244 / 148,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 -6 244 148",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="124" y="94" width="24" height="46" rx="10" fill="#74a03a" />
        <ellipse cx="136" cy="137" rx="11" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="42" y="94" width="24" height="46" rx="10" fill="#74a03a" />
        <ellipse cx="54" cy="137" rx="11" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-torso">
        <path d="M40 62 C 22 68, 10 84, 4 102 C 18 98, 32 96, 44 94 Z" fill="#8fb94b" />
        <ellipse cx="96" cy="80" rx="66" ry="38" fill="#8fb94b" />
        <path d="M38 94 C 64 120, 128 122, 154 96 C 130 108, 64 108, 38 94 Z" fill="#eef3c8" />
        <g fill="#74a03a">
          <circle cx="68" cy="56" r="5" /><circle cx="90" cy="50" r="5" /><circle cx="112" cy="52" r="5" />
          <circle cx="80" cy="68" r="4" /><circle cx="102" cy="64" r="4" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="134" y="94" width="26" height="46" rx="10" fill="#8fb94b" />
        <ellipse cx="147" cy="137" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="50" y="94" width="26" height="46" rx="10" fill="#8fb94b" />
        <ellipse cx="63" cy="137" rx="12" ry="3.5" fill="#f4ead0" />
      </g>
      <g className="zoo-head">
        {/* krans af lange pigge */}
        <g fill="#f6dc84" stroke="#f6dc84" strokeWidth="3" strokeLinejoin="round">
          {skjoldPigge.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* nakkeskjold */}
        <ellipse cx="158" cy="66" rx="30" ry="38" fill="#e3b036" />
        <ellipse cx="158" cy="68" rx="20" ry="28" fill="#f4cf5c" />
        <g fill="#fbeab0">
          <circle cx="146" cy="52" r="3" /><circle cx="162" cy="46" r="3" /><circle cx="172" cy="62" r="3" />
          <circle cx="150" cy="72" r="3" /><circle cx="164" cy="82" r="3" />
        </g>
        {/* hoved */}
        <path d="M164 74 C 172 58, 198 56, 216 66 C 230 74, 234 90, 226 98 C 216 110, 186 112, 172 102 C 162 94, 160 84, 164 74 Z" fill="#8fb94b" />
        <path d="M214 66 C 228 72, 236 86, 230 96 C 226 102, 218 102, 212 98 Z" fill="#c4dc84" />
        <path d="M198 102 Q 214 108 228 96" stroke="#4d6e22" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* ét stort næsehorn */}
        <path d="M216 72 C 224 54, 232 36, 242 22 C 244 40, 240 62, 232 78 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="205" cy="92" r="5.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(195, 76, 5)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Corythosaurus                                                        */
/* ------------------------------------------------------------------ */

const corythosaurus: CreatureSpec = {
  name: "Corythosaurus",
  height: 19,
  aspect: 250 / 172,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 250 172",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="66" cy="116" rx="22" ry="22" fill="#2a96a0" />
        <rect x="56" y="108" width="24" height="64" rx="11" fill="#2a96a0" />
        <ellipse cx="69" cy="169" rx="14" ry="3.5" fill="#d6f3f0" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="150" y="116" width="18" height="56" rx="9" fill="#2a96a0" />
        <ellipse cx="159" cy="169" rx="10" ry="3.2" fill="#d6f3f0" />
      </g>
      <g className="zoo-torso">
        <path d="M62 78 C 38 84, 20 100, 4 118 C 24 120, 44 116, 62 118 Z" fill="#3cb8c4" />
        <ellipse cx="110" cy="98" rx="62" ry="38" fill="#3cb8c4" />
        <path d="M52 110 C 76 142, 142 144, 166 110 C 142 128, 78 128, 52 110 Z" fill="#d6f3f0" />
        <g stroke="#2a96a0" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M70 68 q 5 9 1 18" />
          <path d="M92 63 q 5 9 1 20" />
          <path d="M114 62 q 5 9 1 20" />
          <path d="M136 66 q 5 9 1 18" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="82" cy="114" rx="24" ry="23" fill="#3cb8c4" />
        <rect x="70" y="106" width="28" height="66" rx="11" fill="#3cb8c4" />
        <ellipse cx="84" cy="169" rx="15" ry="3.5" fill="#d6f3f0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="160" y="116" width="20" height="56" rx="10" fill="#3cb8c4" />
        <ellipse cx="170" cy="169" rx="11" ry="3.2" fill="#d6f3f0" />
      </g>
      <g className="zoo-head">
        <path d="M146 90 C 160 80, 172 70, 186 58" stroke="#3cb8c4" strokeWidth="32" fill="none" strokeLinecap="round" />
        {/* halvrund hjelm-kam som en tallerken */}
        <g transform="rotate(-8 196 42)">
          <path d="M168 44 A 28 28 0 0 1 224 44 Z" fill="#e0a92c" stroke="#e0a92c" strokeWidth="3" strokeLinejoin="round" />
          <path d="M176 44 A 20 20 0 0 1 216 44 Z" fill="#f6d170" />
          <path d="M196 44 V 26 M186 44 L 182 30 M206 44 L 210 30" stroke="#e0a92c" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        {/* hoved med andenæb */}
        <ellipse cx="204" cy="54" rx="24" ry="17" fill="#3cb8c4" />
        <path d="M222 48 C 236 46, 248 52, 248 60 C 248 66, 236 68, 222 66 Z" fill="#6fd0d6" />
        <path d="M242 64 Q 232 70 220 65" stroke="#1d6c75" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="241" cy="55" r="1.8" fill="#1d6c75" />
        <circle cx="198" cy="62" r="5" fill="#ffc2b0" opacity="0.7" />
        {EYE(210, 50, 4.8)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Maiasaura                                                            */
/* ------------------------------------------------------------------ */

const maiasaura: CreatureSpec = {
  name: "Maiasaura",
  height: 18,
  aspect: 240 / 140,
  gait: "walk",
  pace: 0.75,
  viewBox: "0 0 240 140",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="58" y="88" width="24" height="52" rx="11" fill="#a87470" />
        <ellipse cx="70" cy="137" rx="13" ry="3.4" fill="#f5e3dc" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="130" y="92" width="20" height="48" rx="10" fill="#a87470" />
        <ellipse cx="140" cy="137" rx="11" ry="3.4" fill="#f5e3dc" />
      </g>
      <g className="zoo-torso">
        <path d="M46 52 C 26 54, 12 68, 4 90 C 20 92, 38 92, 54 94 Z" fill="#c9928e" />
        <ellipse cx="100" cy="68" rx="64" ry="38" fill="#c9928e" />
        <path d="M44 82 C 66 112, 134 114, 156 82 C 134 98, 68 98, 44 82 Z" fill="#f5e3dc" />
        <g stroke="#a87470" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M70 40 q 5 9 1 18" />
          <path d="M92 36 q 5 9 1 20" />
          <path d="M114 38 q 5 9 1 20" />
        </g>
        {/* kraftigt lår */}
        <ellipse cx="80" cy="90" rx="24" ry="22" fill="#c9928e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="68" y="92" width="26" height="48" rx="12" fill="#c9928e" />
        <ellipse cx="81" cy="137" rx="14" ry="3.4" fill="#f5e3dc" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="142" y="92" width="22" height="48" rx="11" fill="#c9928e" />
        <ellipse cx="153" cy="137" rx="12" ry="3.4" fill="#f5e3dc" />
      </g>
      <g className="zoo-head">
        <path d="M136 66 C 154 62, 168 52, 180 40" stroke="#c9928e" strokeWidth="30" fill="none" strokeLinecap="round" />
        {/* hoved med andenæb */}
        <ellipse cx="196" cy="40" rx="22" ry="19" fill="#c9928e" />
        <path d="M208 34 C 224 32, 236 38, 236 46 C 236 54, 224 56, 208 54 Z" fill="#e6bdb6" />
        <path d="M232 50 Q 222 58 210 53" stroke="#7a4640" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="231" cy="40" r="1.8" fill="#7a4640" />
        {EYE(204, 32, 4.6)}
        {/* lille hjerte på kinden */}
        <path d="M190 56 C 180 49, 183 41, 188 42 C 190 42.5, 190 44, 190 45 C 190 44, 191.5 42.5, 193 42 C 198 41, 200 49, 190 56 Z" fill="#e0405f" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Kentrosaurus                                                         */
/* ------------------------------------------------------------------ */

/** Ryggens højde (y) ved en given x på kroppens ellipse (cx 112, cy 70, rx 58, ry 28). */
const kentroRygY = (x: number) => r2(70 - 28 * Math.sqrt(Math.max(0, 1 - ((x - 112) / 58) ** 2)));

/** Smalle plader forrest på ryggen: [x, højde]. */
const smaaPlader: [number, number][] = [
  [98, 20],
  [112, 26],
  [126, 26],
  [140, 22],
  [153, 16],
];

/** Lange pigge bagud: [x, vinkel, længde] fra ryggen over hofter og hale. */
const rygPigge: [number, number, number][] = [
  [92, -128, 34],
  [78, -136, 36],
  [66, -146, 36],
];

const kentrosaurus: CreatureSpec = {
  name: "Kentrosaurus",
  height: 13,
  aspect: 240 / 120,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 0 240 120",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="132" y="80" width="18" height="40" rx="9" fill="#d98a1c" />
        <ellipse cx="141" cy="117" rx="10" ry="3" fill="#fbe7b8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="72" width="22" height="48" rx="10" fill="#d98a1c" />
        <ellipse cx="75" cy="117" rx="12" ry="3" fill="#fbe7b8" />
      </g>
      <g className="zoo-torso">
        {/* lange pigge bagud på halen */}
        <g fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round">
          <path d={pig(44, 66, -160, 30, 8)} />
          <path d={pig(44, 90, 160, 30, 8)} />
          <path d={pig(26, 78, -168, 24, 7)} />
          <path d={pig(26, 94, 168, 24, 7)} />
        </g>
        {/* hale */}
        <path d="M58 58 C 40 62, 22 74, 6 92 C 24 98, 44 98, 62 96 Z" fill="#f2a93b" />
        {/* lange rygpigge bagud */}
        <g fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round">
          {rygPigge.map(([x, v, l]) => (
            <path key={x} d={pig(x, kentroRygY(x) + 4, v, l, 11)} />
          ))}
        </g>
        {/* smalle plader foran */}
        <g fill="#cf6a1c" stroke="#cf6a1c" strokeWidth="3" strokeLinejoin="round">
          {smaaPlader.map(([x, h]) => (
            <path key={x} d={`M${x - 4.5} ${r2(kentroRygY(x) + 6)} L ${x} ${r2(kentroRygY(x) - h)} L ${x + 4.5} ${r2(kentroRygY(x) + 6)} Z`} />
          ))}
        </g>
        <ellipse cx="112" cy="70" rx="58" ry="28" fill="#f2a93b" />
        <path d="M60 82 C 80 106, 142 108, 166 82 C 142 96, 82 96, 60 82 Z" fill="#fbe7b8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="144" y="80" width="20" height="40" rx="9" fill="#f2a93b" />
        <ellipse cx="154" cy="117" rx="11" ry="3" fill="#fbe7b8" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="76" y="72" width="24" height="48" rx="10" fill="#f2a93b" />
        <ellipse cx="88" cy="117" rx="13" ry="3" fill="#fbe7b8" />
      </g>
      <g className="zoo-head">
        <path d="M160 70 C 172 72, 182 78, 190 84" stroke="#f2a93b" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="206" cy="88" rx="20" ry="13" fill="#f2a93b" />
        <path d="M192 96 C 202 102, 216 102, 224 94" stroke="#fbe7b8" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M223 92 Q 216 99 206 97" stroke="#8a4a10" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="222" cy="84" r="1.8" fill="#8a4a10" />
        <circle cx="200" cy="96" r="3.8" fill="#ffc2b0" opacity="0.7" />
        {EYE(209, 84, 4)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Psittacosaurus                                                       */
/* ------------------------------------------------------------------ */

/** Børste af strå på halespidsen: tynde strå i en vifte. */
const straa = [150, 165, 180, 195, 210].map((v) => {
  const fra = { x: 14, y: 72 };
  const til = frem(fra.x, fra.y, v, 22);
  return `M${fra.x} ${fra.y} L ${til.x} ${til.y}`;
});

const psittacosaurus: CreatureSpec = {
  name: "Psittacosaurus",
  height: 8,
  aspect: 158 / 112,
  gait: "walk",
  pace: 1.3,
  viewBox: "-10 0 158 112",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M50 72 L 58 90" stroke="#b08848" strokeWidth="14" strokeLinecap="round" />
        <path d="M58 90 L 48 102" stroke="#b08848" strokeWidth="8" strokeLinecap="round" />
        <path d="M42 108.5 H 60" stroke="#b08848" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {/* hale med strå-børste */}
        <path d="M46 56 C 32 56, 22 62, 12 72 C 24 80, 36 80, 50 78 Z" fill="#cfa56a" />
        <g stroke="#7fa83c" strokeWidth="3" fill="none" strokeLinecap="round">
          {straa.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g transform="rotate(-8 68 66)">
          <ellipse cx="68" cy="66" rx="32" ry="22" fill="#cfa56a" />
          <path d="M40 72 C 52 90, 84 90, 96 72 C 84 82, 52 82, 40 72 Z" fill="#f6e6c6" />
          <g stroke="#b08848" strokeWidth="3.6" fill="none" strokeLinecap="round">
            <path d="M54 50 q 3 6 0 12" />
            <path d="M68 48 q 3 6 0 12" />
            <path d="M82 50 q 3 6 0 12" />
          </g>
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M74 74 L 86 92" stroke="#cfa56a" strokeWidth="15" strokeLinecap="round" />
        <path d="M86 92 L 76 102" stroke="#cfa56a" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M74 108.5 H 94" stroke="#cfa56a" strokeWidth="7.5" strokeLinecap="round" />
      </g>
      <path d="M92 70 C 98 72, 100 76, 100 82" stroke="#b08848" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g className="zoo-head">
        <path d="M88 60 C 94 54, 98 48, 102 42" stroke="#cfa56a" strokeWidth="16" strokeLinecap="round" fill="none" />
        <ellipse cx="112" cy="36" rx="19" ry="17" fill="#cfa56a" />
        {/* høj papegøjenæb */}
        <path d="M120 27 C 130 24, 139 29, 139 37 C 139 42, 137 45, 135 42 C 133 38, 128 38, 124 40 C 119 40, 118 33, 120 27 Z" fill="#f08a3a" />
        <path d="M126 40 C 129 39, 132 40, 134 42 C 131 44, 128 43, 126 40 Z" fill="#f8c27a" />
        <path d="M118 46 Q 112 50 104 46" stroke="#7a5a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="106" cy="43" r="4" fill="#ffc2b0" opacity="0.7" />
        {EYE(113, 32, 4.6)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Carnotaurus                                                          */
/* ------------------------------------------------------------------ */

const carnotaurus: CreatureSpec = {
  name: "Carnotaurus",
  height: 22,
  aspect: 250 / 166,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 250 166",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="106" cy="112" rx="18" ry="26" fill="#86262d" />
        <path d="M104 128 C 102 142, 104 150, 104 154" stroke="#86262d" strokeWidth="16" fill="none" strokeLinecap="round" />
        <ellipse cx="114" cy="160" rx="17" ry="6" fill="#86262d" />
      </g>
      <g className="zoo-torso">
        {/* hale */}
        <path d="M72 62 C 44 64, 22 80, 4 108 C 28 112, 56 108, 80 108 Z" fill="#a8333a" />
        <path d="M58 98 C 42 102, 24 106, 10 107" stroke="#f0cfc4" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="118" cy="86" rx="58" ry="34" fill="#a8333a" />
        <path d="M64 98 C 80 128, 150 130, 172 98 C 150 114, 90 114, 64 98 Z" fill="#f0cfc4" />
        <g stroke="#86262d" strokeWidth="5.5" fill="none" strokeLinecap="round">
          <path d="M84 56 q 5 9 1 18" />
          <path d="M106 52 q 5 9 1 20" />
          <path d="M128 52 q 5 9 1 20" />
          <path d="M150 58 q 5 9 1 16" />
        </g>
        {/* bittesmå arme */}
        <path d="M166 94 C 172 96, 176 100, 176 106" stroke="#86262d" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M176 108 l 2 4 M176 108 l -2 4" stroke="#f0cfc4" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="136" cy="110" rx="21" ry="28" fill="#a8333a" />
        <path d="M136 128 C 134 142, 136 150, 136 154" stroke="#a8333a" strokeWidth="19" fill="none" strokeLinecap="round" />
        <ellipse cx="147" cy="160" rx="19" ry="6" fill="#a8333a" />
        <path d="M160 161 h 6 M154 163 h 5" stroke="#f0cfc4" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M152 84 C 162 78, 172 70, 180 60" stroke="#a8333a" strokeWidth="32" fill="none" strokeLinecap="round" />
        {/* tyrehorn: det fjerne og det nære */}
        <path d="M190 34 C 184 22, 188 10, 200 6 C 196 14, 198 24, 202 34 Z" fill="#e8d3b4" stroke="#e8d3b4" strokeWidth="3" strokeLinejoin="round" />
        <path d="M206 32 C 200 18, 206 6, 220 2 C 214 12, 216 24, 220 32 Z" fill="#f4ead0" stroke="#f4ead0" strokeWidth="3" strokeLinejoin="round" />
        {/* kort, dyb snude */}
        <path d="M176 52 C 176 30, 198 24, 218 28 C 234 32, 242 44, 240 58 C 238 72, 222 78, 202 76 C 186 74, 176 66, 176 52 Z" fill="#a8333a" />
        <path d="M202 76 C 222 80, 238 74, 240 60 C 234 70, 218 70, 208 66 Z" fill="#f0cfc4" />
        <path d="M237 60 C 229 72, 216 72, 208 64" stroke="#5e1a20" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="235" cy="45" r="2.4" fill="#5e1a20" />
        <circle cx="203" cy="64" r="6.5" fill="#ffc2b0" opacity="0.7" />
        {EYE(214, 44, 5.6)}
      </g>
    </>
  ),
};

export const yetMore: Record<string, CreatureSpec> = {
  allosaurus,
  diplodocus,
  styracosaurus,
  corythosaurus,
  maiasaura,
  kentrosaurus,
  psittacosaurus,
  carnotaurus,
};
