import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne og legendariske jungledyr med særlig opførsel. `art` er figuren,
 * når den går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Forsinkelse (og evt. drejepunkt) til en zoo-fx-gruppe. */
const fx = (d: string, origin?: string) =>
  ({ "--d": d, ...(origin ? { transformOrigin: origin } : {}) }) as React.CSSProperties;

/** Lille node (♪). Nodehovedet sidder i (x, y); `s` skalerer. */
const NODE = (x: number, y: number, farve: string, s = 1) => (
  <>
    <ellipse cx={x} cy={y} rx={3.4 * s} ry={2.6 * s} transform={`rotate(-20 ${x} ${y})`} fill={farve} />
    <path d={`M${x + 3 * s} ${y - s} v ${-11 * s} q ${4 * s} ${2 * s} ${6 * s} ${6 * s}`} stroke={farve} strokeWidth={1.8 * s} fill="none" strokeLinecap="round" />
  </>
);

/** Firtakket glimt med buede sider (gnist). */
const GLIMT = (x: number, y: number, r: number, farve = "#fff") => (
  <path d={`M${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill={farve} />
);

/** Femtakket stjerne. */
const STJERNE = (x: number, y: number, r: number, farve: string) => (
  <polygon
    fill={farve}
    points={Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
    }).join(" ")}
  />
);

/** Lille hjerte med midten i (x, y). */
const HJERTE = (x: number, y: number, r: number, farve: string) => (
  <path d={`M${x} ${y + r * 0.9} C ${x - r * 1.6} ${y - r * 0.2}, ${x - r * 0.6} ${y - r * 1.4}, ${x} ${y - r * 0.4} C ${x + r * 0.6} ${y - r * 1.4}, ${x + r * 1.6} ${y - r * 0.2}, ${x} ${y + r * 0.9} Z`} fill={farve} />
);

/** Abe med slips og mappe — står den stille, ringer bananmobilen. */
const businessMonkey: CreatureSpec = {
  name: "Forretningsaben",
  rarity: "rare",
  height: 17,
  aspect: 130 / 150,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 130 150",
  art: (
    <>
      <path d="M38 98 C 8 100, 6 64, 26 62 C 40 60, 40 80, 28 80" stroke="#7a4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><path d="M74 112 v 30" stroke="#6a3f23" strokeWidth="11" strokeLinecap="round" /><ellipse cx="78" cy="145" rx="9" ry="4" fill="#c49a70" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M76 74 l 18 24" stroke="#6a3f23" strokeWidth="9" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="66" cy="94" rx="28" ry="30" fill="#8a5632" />
        <ellipse cx="72" cy="98" rx="16" ry="20" fill="#d9ab7f" />
        <path d="M66 68 h 12 l -3 6 h -6 z" fill="#a8261f" />
        <path d="M69 74 h 6 l 4 22 l -7 8 l -7 -8 z" fill="#c8382f" />
        <path d="M70 80 l 7 4 M68 88 l 9 5" stroke="#e8726a" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M58 112 v 32" stroke="#8a5632" strokeWidth="12" strokeLinecap="round" /><ellipse cx="62" cy="145" rx="9" ry="4" fill="#d9ab7f" /></g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M62 76 l 22 26" stroke="#8a5632" strokeWidth="10" strokeLinecap="round" />
        <path d="M82 104 q 4 -6 8 0" stroke="#2a1d16" strokeWidth="3" fill="none" />
        <rect x="76" y="104" width="22" height="16" rx="3" fill="#3b2a20" />
        <path d="M76 110 h 22" stroke="#5a4232" strokeWidth="1.5" />
        <rect x="85" y="108" width="4" height="4" rx="1" fill="#e2b13c" />
        <circle cx="86" cy="104" r="6" fill="#d9ab7f" />
      </g>
      <g className="zoo-head">
        <circle cx="54" cy="44" r="11" fill="#8a5632" /><circle cx="54" cy="44" r="6" fill="#d9ab7f" />
        <circle cx="76" cy="42" r="27" fill="#8a5632" />
        <path d="M66 40 C 66 28, 82 26, 86 36 C 96 34, 104 44, 98 54 C 96 66, 74 70, 68 58 C 62 54, 62 46, 66 40 Z" fill="#e2b98e" />
        {EYE(77, 40, 3.6)}
        {EYE(92, 40, 3.6)}
        <path d="M82 58 q 6 5 12 0" stroke="#5a341c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      <path d="M38 98 C 8 100, 6 64, 26 62 C 40 60, 40 80, 28 80" stroke="#7a4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M74 112 v 30" stroke="#6a3f23" strokeWidth="11" strokeLinecap="round" /><ellipse cx="78" cy="145" rx="9" ry="4" fill="#c49a70" />
      {/* Fri arm der gestikulerer ivrigt. */}
      <g className="zoo-fx-wave" style={{ transformOrigin: "0% 0%" }}>
        <path d="M80 78 l 22 6" stroke="#6a3f23" strokeWidth="9" strokeLinecap="round" />
        <circle cx="104" cy="85" r="6" fill="#c49a70" />
      </g>
      <ellipse cx="66" cy="94" rx="28" ry="30" fill="#8a5632" />
      <ellipse cx="72" cy="98" rx="16" ry="20" fill="#d9ab7f" />
      <path d="M66 68 h 12 l -3 6 h -6 z" fill="#a8261f" />
      <path d="M69 74 h 6 l 4 22 l -7 8 l -7 -8 z" fill="#c8382f" />
      <path d="M70 80 l 7 4 M68 88 l 9 5" stroke="#e8726a" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 112 v 32" stroke="#8a5632" strokeWidth="12" strokeLinecap="round" /><ellipse cx="62" cy="145" rx="9" ry="4" fill="#d9ab7f" />
      {/* Mappen står ved fødderne. */}
      <rect x="86" y="128" width="24" height="17" rx="3" fill="#3b2a20" />
      <path d="M93 128 q 5 -6 10 0" stroke="#2a1d16" strokeWidth="3" fill="none" />
      <path d="M86 134 h 24" stroke="#5a4232" strokeWidth="1.5" />
      <rect x="96" y="132" width="4" height="4" rx="1" fill="#e2b13c" />
      <g className="zoo-fx-nod" style={{ transformOrigin: "50% 100%" }}>
        <circle cx="54" cy="44" r="11" fill="#8a5632" /><circle cx="54" cy="44" r="6" fill="#d9ab7f" />
        <circle cx="76" cy="42" r="27" fill="#8a5632" />
        <path d="M66 40 C 66 28, 82 26, 86 36 C 96 34, 104 44, 98 54 C 96 66, 74 70, 68 58 C 62 54, 62 46, 66 40 Z" fill="#e2b98e" />
        {EYE(77, 40, 3.6)}
        {EYE(92, 40, 3.6)}
        <ellipse className="zoo-fx-talk" cx="89" cy="58" rx="5" ry="4.5" fill="#5a341c" />
      </g>
      {/* Bananmobilen holdt op til øret. */}
      <path d="M60 80 C 46 74, 40 62, 44 52" stroke="#8a5632" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M42 26 C 30 40, 34 60, 52 66 C 44 58, 40 44, 48 28 Z" fill="#f4d23c" stroke="#c9a21f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M42 26 l 4 -4" stroke="#6b4a1e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="45" cy="52" r="6" fill="#d9ab7f" />
      {/* "Bla bla" der stiger op. */}
      <g className="zoo-fx-rise"><path d="M104 40 q 4 -5 8 0 q 4 5 8 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-fx-rise" style={{ "--d": "1.2s" } as React.CSSProperties}><path d="M108 28 q 3 -4 6 0 q 3 4 6 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Læse-dovendyret                                                          */
/* ------------------------------------------------------------------------ */

/** Dovendyrets hoved med runde briller (koordinater som Dovendyr i creatures.tsx). */
const dovenHoved = (
  <>
    <circle cx="132" cy="42" r="22" fill="#a8845f" />
    <ellipse cx="136" cy="44" rx="16" ry="13" fill="#e9d6b4" />
    <path d="M124 40 C 126 34, 134 36, 134 42 C 132 48, 124 46, 124 40 Z" fill="#4a3424" />
    <path d="M138 40 C 140 34, 148 36, 148 42 C 146 48, 138 46, 138 40 Z" fill="#4a3424" />
    {EYE(130, 41, 2.6)}
    {EYE(143, 41, 2.6)}
    <ellipse cx="137" cy="49" rx="3" ry="2" fill="#3a2a1d" />
    <path d="M131 53 q 6 5 12 0" stroke="#4a3424" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Brillerne. */}
    <path d="M123.8 40 L 113 36" stroke="#2b2420" strokeWidth="1.8" strokeLinecap="round" />
    <g fill="#fff" fillOpacity="0.2" stroke="#2b2420" strokeWidth="1.8">
      <circle cx="130" cy="41" r="6.2" />
      <circle cx="143" cy="41" r="6.2" />
    </g>
  </>
);

/** Dovendyr med runde briller — står det stille, sætter det sig og læser i en bog. */
const readingSloth: CreatureSpec = {
  name: "Læse-dovendyret",
  rarity: "rare",
  height: 14,
  aspect: 160 / 110,
  gait: "walk",
  pace: 0.4,
  viewBox: "0 0 160 110",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M112 62 C 118 80, 120 94, 118 106 M112 106 l 4 -6 M118 106 l 3 -6" stroke="#8a6a4c" strokeWidth="9" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M46 64 C 42 80, 42 94, 44 106" stroke="#8a6a4c" strokeWidth="10" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="80" cy="60" rx="52" ry="30" fill="#a8845f" />
        <path d="M40 50 C 58 40, 98 38, 120 48" stroke="#bf9c75" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M44 74 q 4 4 8 0 q 4 4 8 0 M96 76 q 4 4 8 0 q 4 4 8 0" stroke="#8f6e50" strokeWidth="2.5" fill="none" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M120 64 C 128 80, 130 94, 128 106 M122 107 l 5 -7 M128 107 l 4 -7 M134 106 l 2 -6" stroke="#a8845f" strokeWidth="10" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M56 66 C 52 82, 52 94, 54 106 M50 107 l 4 -6 M56 107 l 3 -6" stroke="#a8845f" strokeWidth="11" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-head">{dovenHoved}</g>
    </>
  ),
  special: (
    <>
      {/* Fjerne arm bag bogen. */}
      <path d="M92 60 C 110 70, 132 80, 148 86" stroke="#8a6a4c" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Fjerne ben strakt frem; foden står, hvor forbenet står, når det går. */}
      <path d="M62 94 C 82 100, 100 104, 114 106 M112 106 l 4 -6 M118 106 l 3 -6" stroke="#8a6a4c" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Kroppen sidder op. */}
      <ellipse cx="72" cy="72" rx="30" ry="34" transform="rotate(14 72 72)" fill="#a8845f" />
      <path d="M48 58 C 52 46, 64 38, 78 38" stroke="#bf9c75" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M48 88 q 4 4 8 0 q 4 4 8 0" stroke="#8f6e50" strokeWidth="2.5" fill="none" />
      {/* Nære ben. */}
      <path d="M72 98 C 92 102, 108 104, 122 106 M122 107 l 5 -7 M128 107 l 4 -7 M134 106 l 2 -6" stroke="#a8845f" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Den åbne bog. */}
      <path d="M132 89 L 113 84.5 L 113 57.5 L 132 62 L 151 57.5 L 151 84.5 Z" fill="#c0392b" />
      <path d="M132 64 L 115 60 L 115 82 L 132 86 Z" fill="#fffaf0" />
      <path d="M132 64 L 149 60 L 149 82 L 132 86 Z" fill="#fffaf0" />
      <path d="M118 65 l 11 2.6 M118 70 l 11 2.6 M118 75 l 8 1.9 M135 67.6 l 11 -2.6 M135 72.6 l 11 -2.6 M135 77.6 l 8 -1.9" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
      {/* Siden, der langsomt vendes. */}
      <g className="zoo-fx-flip" style={{ animationDuration: "4s" }}>
        <path d="M132 64 L 149 60 L 149 82 L 132 86 Z" fill="#f3ead6" stroke="#e2d6bd" strokeWidth="0.8" />
        <path d="M135 67.6 l 11 -2.6 M135 72.6 l 11 -2.6" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <path d="M132 63 v 24" stroke="#a52f23" strokeWidth="1.5" />
      {/* Nære arm holder bogen. */}
      <path d="M84 62 C 92 78, 104 88, 116 87" stroke="#a8845f" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M114 84 l 3 -5 M118 85 l 3 -5" stroke="#8f6e50" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hovedet bøjet over bogen; nikker stille og roligt. */}
      <g className="zoo-fx-nod" style={{ animationDuration: "2s" }}>
        <g transform="translate(-28 -4) rotate(10 132 42)">{dovenHoved}</g>
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Yoga-elefanten                                                           */
/* ------------------------------------------------------------------------ */

/** Svedbånd hen over panden; den bageste del og knuden gemmer sig bag øret. */
const elefantPandebaand = (
  <>
    <path d="M116 44 q -8 -4 -12 -12 M117 46 q -9 2 -14 -2" stroke="#e8507a" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M124 44 C 146 36, 176 36, 192 48" stroke="#e8507a" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M140 38.5 C 158 35, 176 36, 188 43" stroke="#f9b3c8" strokeWidth="2" fill="none" strokeLinecap="round" />
  </>
);

/** Usynlig boks, så to zoo-fx-bob-grupper får samme højde og vugger ens. */
const BOB_BOKS = <rect x="100" y="0" width="1" height="160" fill="none" />;

/** Elefant med pandebånd — står den stille, laver den yoga på ét ben. */
const yogaElephant: CreatureSpec = {
  name: "Yoga-elefanten",
  rarity: "rare",
  height: 30,
  aspect: 210 / 160,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 210 160",
  art: (
    <>
      <path d="M34 78 C 22 88, 20 100, 24 112" stroke="#7b8797" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M24 110 l -4 8 l 7 -3 z" fill="#5c6776" />
      <g className="zoo-leg zoo-leg-a"><rect x="130" y="96" width="24" height="62" rx="9" fill="#7b8797" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="44" y="96" width="24" height="62" rx="9" fill="#7b8797" /></g>
      <g className="zoo-torso">
        <ellipse cx="96" cy="86" rx="66" ry="48" fill="#97a3b3" />
        <path d="M44 104 C 70 126, 128 128, 156 104" stroke="#8592a3" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="146" y="98" width="25" height="60" rx="9" fill="#97a3b3" /><path d="M148 154 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="60" y="98" width="25" height="60" rx="9" fill="#97a3b3" /><path d="M62 154 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <path d="M178 84 C 196 98, 196 124, 186 142 C 182 150, 192 154, 196 146" stroke="#97a3b3" strokeWidth="15" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="68" r="36" fill="#97a3b3" />
        <path d="M184 92 q 12 6 16 -2" stroke="#f4efe3" strokeWidth="6" fill="none" strokeLinecap="round" />
        {elefantPandebaand}
        <ellipse cx="140" cy="70" rx="24" ry="33" fill="#8592a3" />
        <ellipse cx="140" cy="72" rx="15" ry="22" fill="#d9a6a6" opacity="0.65" />
        {EYE(172, 58, 4.2)}
        <circle cx="182" cy="74" r="5" fill="#e6a4a4" opacity="0.45" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Yogamåtten. */}
      <rect x="116" y="155" width="88" height="5" rx="2.5" fill="#9b7be0" />
      {/* Krop og løftede ben vugger let; standbenet bliver på måtten. */}
      <g className="zoo-fx-bob">
        {BOB_BOKS}
        <path d="M34 78 C 22 88, 20 100, 24 112" stroke="#7b8797" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M24 110 l -4 8 l 7 -3 z" fill="#5c6776" />
        {/* Fjerne forben løftet med knæet frem og foden mod standbenet (træ-stillingen). */}
        <path d="M146 100 L 184 116 L 164 134" stroke="#7b8797" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bagbenene løftet bagud. */}
        <rect x="44" y="96" width="24" height="46" rx="9" fill="#7b8797" transform="rotate(30 56 100)" />
        <ellipse cx="96" cy="86" rx="66" ry="48" fill="#97a3b3" />
        <path d="M44 104 C 70 126, 128 128, 156 104" stroke="#8592a3" strokeWidth="6" fill="none" strokeLinecap="round" />
        <g transform="rotate(42 72 102)">
          <rect x="60" y="98" width="25" height="44" rx="9" fill="#97a3b3" />
          <path d="M62 138 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      {/* Standbenet: nære forben, samme sted som når den går. */}
      <rect x="146" y="98" width="25" height="60" rx="9" fill="#97a3b3" />
      <path d="M148 154 h21" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" />
      <g className="zoo-fx-bob">
        {BOB_BOKS}
        {/* Snablen løftet mod himlen. */}
        <path d="M180 84 C 200 74, 204 46, 192 34 C 186 28, 180 32, 184 38" stroke="#97a3b3" strokeWidth="15" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="68" r="36" fill="#97a3b3" />
        <path d="M184 92 q 12 6 16 -2" stroke="#f4efe3" strokeWidth="6" fill="none" strokeLinecap="round" />
        {elefantPandebaand}
        <ellipse cx="140" cy="70" rx="24" ry="33" fill="#8592a3" />
        <ellipse cx="140" cy="72" rx="15" ry="22" fill="#d9a6a6" opacity="0.65" />
        {/* Lukkede øjne: helt zen. */}
        <path d="M166 58 q 6 5 12 0" stroke="#3a4250" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="182" cy="74" r="5" fill="#e6a4a4" opacity="0.6" />
      </g>
      {/* Hjerter og bobler stiger op. */}
      <g className="zoo-fx-rise">{HJERTE(66, 32, 6, "#f37aa2")}</g>
      <g className="zoo-fx-rise" style={fx("0.8s")}><circle cx="96" cy="26" r="3.5" fill="none" stroke="#fff" strokeWidth="2" /></g>
      <g className="zoo-fx-rise" style={fx("1.6s")}>{HJERTE(118, 24, 5, "#f9a8c4")}</g>
      <g className="zoo-fx-rise" style={fx("1.2s")}><circle cx="44" cy="40" r="2.5" fill="none" stroke="#fff" strokeWidth="1.8" /></g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Kunstner-papegøjen                                                       */
/* ------------------------------------------------------------------------ */

const baret = (
  <>
    <ellipse cx="68" cy="28" rx="19" ry="6.5" transform="rotate(-12 68 28)" fill="#2b3a67" />
    <path d="M64 23 q 0 -5 3 -7" stroke="#2b3a67" strokeWidth="3" strokeLinecap="round" fill="none" />
  </>
);

const papegoejeHale = (
  <>
    <path d="M44 100 L 14 136 L 24 138 L 52 108 Z" fill="#2f6fd6" />
    <path d="M46 102 L 22 138 L 30 138 L 54 110 Z" fill="#e0352b" />
  </>
);

const papegoejeKrop = (
  <>
    <ellipse cx="60" cy="90" rx="24" ry="33" fill="#e0352b" />
    <path d="M40 74 C 54 70, 64 82, 62 102 C 58 116, 44 118, 36 108 C 32 96, 32 82, 40 74 Z" fill="#2f6fd6" />
    <path d="M40 76 C 52 74, 58 82, 58 90 C 50 88, 42 86, 37 84 Z" fill="#f4c430" />
    <path d="M40 96 h 18 M40 104 h 16" stroke="#2559ad" strokeWidth="3" strokeLinecap="round" />
  </>
);

/** Papegøje med baret — står den stille, maler den ved sit staffeli. */
const artistParrot: CreatureSpec = {
  name: "Kunstner-papegøjen",
  rarity: "rare",
  height: 13,
  aspect: 120 / 140,
  gait: "hop",
  pace: 1.05,
  viewBox: "0 0 120 140",
  art: (
    <>
      {papegoejeHale}
      <g className="zoo-leg zoo-leg-a"><path d="M56 118 v 16 M51 136 h 10" stroke="#6b6b6b" strokeWidth="4.5" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M67 118 v 16 M62 136 h 10" stroke="#7d7d7d" strokeWidth="4.5" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        {papegoejeKrop}
        {/* Penslen stukket ind under vingen. */}
        <path d="M34 100 L 58 82" stroke="#b07a45" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M58 82 l 4 -3" stroke="#f4c430" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <circle cx="72" cy="46" r="21" fill="#e0352b" />
        <ellipse cx="81" cy="47" rx="10" ry="12" fill="#fff" />
        <path d="M76 52 q 4 1 8 0 M77 56 q 4 1 7 0" stroke="#e6b3a8" strokeWidth="1.5" fill="none" />
        <path d="M88 40 C 102 38, 108 50, 102 62 C 98 56, 94 54, 89 54 Z" fill="#2b2b2b" />
        <path d="M88 52 C 94 54, 98 58, 100 64 C 94 64, 90 60, 88 56 Z" fill="#efe6d2" />
        {EYE(81, 43, 3.4)}
        {baret}
      </g>
    </>
  ),
  special: (
    <>
      {papegoejeHale}
      <path d="M56 118 v 16 M51 136 h 10" stroke="#6b6b6b" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M67 118 v 16 M62 136 h 10" stroke="#7d7d7d" strokeWidth="4.5" strokeLinecap="round" />
      {papegoejeKrop}
      {/* Paletten under vingen. */}
      <path d="M48 108 C 46 98, 64 94, 76 100 C 84 104, 80 114, 70 113 C 64 112, 62 116, 56 116 C 50 116, 48 112, 48 108 Z" fill="#d9a86c" />
      <circle cx="69" cy="108" r="2.2" fill="#b98b52" />
      <circle cx="54" cy="106" r="2.6" fill="#e0352b" />
      <circle cx="60" cy="101" r="2.6" fill="#2f6fd6" />
      <circle cx="68" cy="100" r="2.6" fill="#f4c430" />
      <circle cx="75" cy="104" r="2.4" fill="#3fae5a" />
      {/* Staffeliet. */}
      <path d="M106 56 L 108 138" stroke="#8a5a2e" strokeWidth="3" strokeLinecap="round" />
      <rect x="93" y="60" width="25" height="32" rx="1.5" fill="#fffaf0" stroke="#8a5a2e" strokeWidth="2" />
      <circle cx="100" cy="70" r="4" fill="#e0352b" />
      <circle cx="110" cy="67" r="3.4" fill="#f4c430" />
      <circle cx="104" cy="82" r="4.6" fill="#2f6fd6" />
      <circle cx="113" cy="80" r="3" fill="#3fae5a" />
      <path d="M97 88 q 4 -4 8 0 q 4 4 9 -1" stroke="#c46bd6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="91" y="92" width="28" height="3.5" rx="1.5" fill="#a86f3c" />
      <path d="M97 95 L 91 138 M114 95 L 118 138" stroke="#a86f3c" strokeWidth="3" strokeLinecap="round" />
      {/* Hovedet nikker med, mens penslen i næbbet maler. */}
      <g className="zoo-fx-nod" style={{ animationDuration: "1.8s" }}>
        <circle cx="72" cy="46" r="21" fill="#e0352b" />
        <ellipse cx="81" cy="47" rx="10" ry="12" fill="#fff" />
        <path d="M76 52 q 4 1 8 0 M77 56 q 4 1 7 0" stroke="#e6b3a8" strokeWidth="1.5" fill="none" />
        <g className="zoo-fx-wave" style={{ transformOrigin: "0% 0%" }}>
          <path d="M88 55 L 105 65" stroke="#b07a45" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M104 64.4 l 3 1.8" stroke="#9aa0a8" strokeWidth="3" strokeLinecap="round" />
          <path d="M107 66.2 l 4 2.6" stroke="#2f6fd6" strokeWidth="3.4" strokeLinecap="round" />
        </g>
        <path d="M88 40 C 102 38, 108 50, 102 62 C 98 56, 94 54, 89 54 Z" fill="#2b2b2b" />
        <path d="M88 52 C 94 54, 98 58, 100 64 C 94 64, 90 60, 88 56 Z" fill="#efe6d2" />
        {EYE(81, 43, 3.4)}
        {baret}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* DJ-gorillaen                                                             */
/* ------------------------------------------------------------------------ */

const gorillaHoved = (
  <>
    <circle cx="132" cy="50" r="24" fill="#43474d" />
    <path d="M122 36 C 136 30, 154 36, 156 48 C 158 64, 146 72, 134 70 C 124 68, 120 56, 122 36 Z" fill="#6d6560" />
    <path d="M124 40 h 30" stroke="#2f3236" strokeWidth="6" strokeLinecap="round" />
    {EYE(146, 46, 3.4)}
    <ellipse cx="150" cy="58" rx="5" ry="3" fill="#2f2b29" />
  </>
);

/** Gorilla med høretelefoner om halsen — står den stille, spiller den plader. */
const djGorilla: CreatureSpec = {
  name: "DJ-gorillaen",
  rarity: "rare",
  height: 24,
  aspect: 170 / 150,
  gait: "walk",
  pace: 0.75,
  viewBox: "0 0 170 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M50 108 v 36" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M112 70 C 124 92, 124 116, 122 142" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <path d="M24 106 C 18 68, 52 38, 98 40 C 132 42, 146 70, 136 98 C 126 124, 40 132, 24 106 Z" fill="#43474d" />
        <path d="M58 52 C 76 44, 104 46, 118 58" stroke="#8b9097" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M62 108 v 36" stroke="#43474d" strokeWidth="22" strokeLinecap="round" /><ellipse cx="66" cy="146" rx="14" ry="4" fill="#2a2c30" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M100 72 C 114 96, 114 118, 112 142" stroke="#43474d" strokeWidth="22" strokeLinecap="round" /><ellipse cx="114" cy="145" rx="13" ry="5" fill="#2a2c30" /></g>
      <g className="zoo-head">
        {gorillaHoved}
        {/* Høretelefonerne hænger om halsen. */}
        <ellipse cx="141" cy="81" rx="5.5" ry="7" fill="#b8302a" />
        <path d="M123 74 C 124 62, 140 62, 141 75" stroke="#1d1e22" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="124" cy="81" rx="7" ry="8" fill="#e8453c" />
        <ellipse cx="124" cy="81" rx="3.4" ry="4.4" fill="#a92a24" />
      </g>
    </>
  ),
  special: (
    <>
      <path d="M50 108 v 36" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" />
      <path d="M112 70 C 124 92, 124 116, 122 142" stroke="#2f3236" strokeWidth="20" strokeLinecap="round" />
      <path d="M24 106 C 18 68, 52 38, 98 40 C 132 42, 146 70, 136 98 C 126 124, 40 132, 24 106 Z" fill="#43474d" />
      <path d="M58 52 C 76 44, 104 46, 118 58" stroke="#8b9097" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M62 108 v 36" stroke="#43474d" strokeWidth="22" strokeLinecap="round" /><ellipse cx="66" cy="146" rx="14" ry="4" fill="#2a2c30" />
      {/* Pladespilleren på et lille bord. */}
      <path d="M128 116 L 125 146 M162 116 L 165 146 M126 134 h 38" stroke="#7a5634" strokeWidth="4" strokeLinecap="round" />
      <rect x="120" y="102" width="48" height="15" rx="3" fill="#2b2d33" />
      <rect x="120" y="102" width="48" height="4" rx="2" fill="#4a4e57" />
      <circle cx="161" cy="111.5" r="2" fill="#8be9a8" />
      <circle cx="154" cy="111.5" r="2" fill="#f5d36b" />
      <path d="M126 111.5 h 14" stroke="#5d626d" strokeWidth="2" strokeLinecap="round" />
      {/* Pladen ses lidt fra oven: den indre gruppe snurrer, den ydre klemmer den flad. */}
      <g transform="translate(146 101) scale(1 0.42)">
        <g className="zoo-fx-spin">
          <circle cx="0" cy="0" r="18" fill="#151518" />
          <circle cx="0" cy="0" r="12.5" fill="none" stroke="#33353b" strokeWidth="1.6" />
          <circle cx="0" cy="0" r="6" fill="#e8453c" />
          <path d="M-15.5 -4 A 16 16 0 0 1 -4 -15.5" stroke="#8a8f9a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="2.5" cy="-2.5" r="1.8" fill="#fff" />
        </g>
      </g>
      <path d="M166 96 L 157 101" stroke="#c9ccd2" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="166" cy="96" r="2.4" fill="#c9ccd2" />
      {/* Armen scratcher på pladen. */}
      <path d="M100 72 C 110 84, 118 94, 126 98" stroke="#43474d" strokeWidth="20" strokeLinecap="round" />
      <ellipse cx="130" cy="99" rx="7" ry="4.5" fill="#2a2c30" />
      {/* Hovedet med høretelefonerne på nikker i takt. */}
      <g className="zoo-fx-nod" style={{ animationDuration: "0.45s" }}>
        {gorillaHoved}
        <path d="M114 46 C 110 22, 140 16, 150 32" stroke="#1d1e22" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="116" cy="52" rx="8" ry="10" fill="#e8453c" />
        <ellipse cx="116" cy="52" rx="4" ry="5.5" fill="#a92a24" />
      </g>
      {/* Noder stiger op. */}
      <g className="zoo-fx-rise">{NODE(96, 32, "#ffd84a", 0.8)}</g>
      <g className="zoo-fx-rise" style={fx("0.8s")}>{NODE(154, 28, "#7fe0ff", 0.8)}</g>
      <g className="zoo-fx-rise" style={fx("1.6s")}>{NODE(80, 40, "#ff8fc8", 0.8)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Tryllefrøen (legendarisk)                                                */
/* ------------------------------------------------------------------------ */

const FROE_LILLA = "#9b6bdb";
const FROE_MOERK = "#7a4cc0";

const trylleHat = (
  <>
    <path d="M66 14 C 66 8, 60 5, 52 4 C 64 0, 84 2, 90 14 Z" fill="#2f3c96" />
    <ellipse cx="78" cy="14.5" rx="16" ry="3.5" fill="#26307a" />
    {STJERNE(76, 8, 2.6, "#ffd84a")}
    {STJERNE(65, 6.5, 1.7, "#ffd84a")}
    {STJERNE(85, 10.5, 1.5, "#fff3b0")}
    {/* Hattespidsen funkler. */}
    <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(52, 4, 3, "#ffe98a")}</g>
  </>
);

const froeOejne = (
  <>
    <circle cx="68" cy="26" r="13" fill={FROE_LILLA} />
    <circle cx="88" cy="28" r="12" fill={FROE_LILLA} />
    <circle cx="70" cy="25" r="8" fill="#fff" /><circle cx="89" cy="27" r="7.5" fill="#fff" />
    {EYE(72, 26, 4)}
    {EYE(91, 28, 4)}
  </>
);

/** Lilla frø med troldmandshat — står den stille, svinger den sin tryllestav. */
const wizardFrog: CreatureSpec = {
  name: "Tryllefrøen",
  rarity: "legendary",
  height: 8,
  aspect: 110 / 76,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 110 76",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M24 54 C 6 60, 6 72, 26 74 L 42 74" stroke={FROE_MOERK} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="56" cy="50" rx="36" ry="24" fill={FROE_LILLA} />
        <ellipse cx="62" cy="58" rx="24" ry="13" fill="#ecdcff" />
        <circle cx="38" cy="40" r="4" fill={FROE_MOERK} /><circle cx="48" cy="50" r="3" fill={FROE_MOERK} />
        <circle cx="30" cy="52" r="2" fill="#ffd84a" /><circle cx="44" cy="34" r="1.6" fill="#ffd84a" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M74 62 l 8 12 M76 74 h 12" stroke="#8a5bd0" strokeWidth="7" strokeLinecap="round" /></g>
      <g className="zoo-head">
        {froeOejne}
        <path d="M78 50 q 10 6 18 -4" stroke="#4b2a7a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {trylleHat}
      </g>
    </>
  ),
  special: (
    <>
      <path d="M24 54 C 6 60, 6 72, 26 74 L 42 74" stroke={FROE_MOERK} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Fjerne forben står, hvor det nære står, når frøen hopper. */}
      <path d="M74 62 l 8 12 M76 74 h 12" stroke={FROE_MOERK} strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="56" cy="50" rx="36" ry="24" fill={FROE_LILLA} />
      <ellipse cx="62" cy="58" rx="24" ry="13" fill="#ecdcff" />
      <circle cx="38" cy="40" r="4" fill={FROE_MOERK} /><circle cx="48" cy="50" r="3" fill={FROE_MOERK} />
      <circle cx="30" cy="52" r="2" fill="#ffd84a" /><circle cx="44" cy="34" r="1.6" fill="#ffd84a" />
      {froeOejne}
      <path d="M78 48 q 9 8 18 -2" stroke="#4b2a7a" strokeWidth="2.5" fill="#c2306e" strokeLinecap="round" strokeLinejoin="round" />
      {trylleHat}
      {/* Tryllestaven svinges fra håndleddet. */}
      <g className="zoo-fx-wave" style={{ transformOrigin: "0% 100%" }}>
        <path d="M95 56 L 98 29" stroke="#3a2a20" strokeWidth="3" strokeLinecap="round" />
        <path d="M97.7 31.5 L 98 29" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        {STJERNE(98, 27, 4, "#ffd84a")}
      </g>
      {/* Nære arm løftet med staven. */}
      <path d="M66 62 C 76 62, 86 60, 93 57" stroke="#8a5bd0" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="95" cy="57" r="4.5" fill={FROE_LILLA} />
      {/* Gnister og stjerner i forskudt takt. */}
      <g className="zoo-fx-sparkle">{GLIMT(105, 15, 3.2, "#ffe98a")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(92, 6, 2.4, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(106, 34, 2.6, "#ff9ee6")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.25s")}>{STJERNE(102, 44, 2.2, "#8ff3ff")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.15s")}>{STJERNE(103, 3.5, 2, "#ffd84a")}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Den gyldne tiger (legendarisk)                                           */
/* ------------------------------------------------------------------------ */

const GULD = "#f5b82e";
const GULD_MOERK = "#d8921a";
const GULD_LYS = "#fff4d2";
const GULD_STRIBE = "#fff0b0";

/** Tigerens hoved i guld (koordinater som Tiger i creatures.tsx). */
const tigerHoved = (
  <>
    <circle cx="160" cy="34" r="8" fill={GULD} /><circle cx="160" cy="34" r="4" fill="#c9851a" />
    <circle cx="186" cy="34" r="8" fill={GULD} /><circle cx="186" cy="34" r="4" fill="#c9851a" />
    <circle cx="174" cy="54" r="25" fill={GULD} />
    <ellipse cx="184" cy="66" rx="16" ry="11" fill={GULD_LYS} />
    <path d="M188 58 l 8 0 l -4 5 z" fill="#a8641a" />
    <path d="M164 36 q 4 6 0 12 M178 32 q 3 5 0 10" stroke={GULD_STRIBE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {EYE(180, 49, 3.8)}
  </>
);

/** Skinnende gylden tiger — står den stille, sætter den sig stolt med krone på. */
const goldenTiger: CreatureSpec = {
  name: "Den gyldne tiger",
  rarity: "legendary",
  height: 18,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 210 124",
  art: (
    <>
      <path d="M42 62 C 24 58, 14 42, 20 24" stroke={GULD_MOERK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M20 30 C 18 24, 19 20, 21 17" stroke={GULD_STRIBE} strokeWidth="9" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="70" width="15" height="52" rx="7" fill={GULD_MOERK} /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="70" width="15" height="52" rx="7" fill={GULD_MOERK} /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="66" rx="64" ry="27" fill={GULD} />
        <path d="M54 80 C 80 94, 130 94, 152 82" fill={GULD_LYS} />
        <path d="M62 48 C 86 40, 122 40, 146 50" stroke="#ffe17a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <g stroke={GULD_STRIBE} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M70 42 q 6 12 0 24" />
          <path d="M88 39 q 7 14 0 28" />
          <path d="M106 39 q 7 14 0 28" />
          <path d="M124 41 q 6 12 0 24" />
          <path d="M52 50 q 5 9 0 18" />
        </g>
        {/* Gnistrende skær i pelsen. */}
        <g className="zoo-fx-sparkle">{GLIMT(97, 56, 5.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(134, 70, 4)}</g>
        <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(64, 70, 4)}</g>
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="150" y="72" width="16" height="50" rx="7" fill={GULD} /><ellipse cx="160" cy="120" rx="10" ry="4" fill={GULD_LYS} /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="64" y="72" width="16" height="50" rx="7" fill={GULD} /><ellipse cx="74" cy="120" rx="10" ry="4" fill={GULD_LYS} /></g>
      <g className="zoo-head">
        {tigerHoved}
        <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(164, 64, 3.2)}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Halen ligger på jorden bag den. */}
      <path d="M48 112 C 26 116, 14 104, 20 90" stroke={GULD_MOERK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M20 96 C 18 92, 19 88, 21 85" stroke={GULD_STRIBE} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Forbenene står, hvor de står, når den går. */}
      <rect x="138" y="62" width="15" height="60" rx="7" fill={GULD_MOERK} />
      <ellipse cx="158" cy="54" rx="15" ry="20" fill={GULD} />
      {/* Kroppen rejser sig stejlt op mod den stolte brystkasse. */}
      <ellipse cx="114" cy="78" rx="50" ry="26" transform="rotate(-38 114 78)" fill={GULD} />
      <ellipse cx="150" cy="72" rx="10" ry="22" transform="rotate(-10 150 72)" fill={GULD_LYS} />
      <path d="M96 60 C 106 48, 120 40, 134 38" stroke="#ffe17a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g stroke={GULD_STRIBE} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M98 66 q 8 2 10 11" />
        <path d="M110 54 q 8 2 10 11" />
        <path d="M123 45 q 8 2 9 10" />
      </g>
      {/* Baglåret og bagpoten. */}
      <ellipse cx="80" cy="97" rx="30" ry="23" fill={GULD} />
      <path d="M58 84 C 70 76, 90 76, 100 84" stroke="#ffe17a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g stroke={GULD_STRIBE} strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M64 86 q 8 6 6 16" />
        <path d="M78 82 q 8 6 6 16" />
      </g>
      <ellipse cx="98" cy="119" rx="15" ry="4.5" fill={GULD_LYS} />
      <rect x="150" y="64" width="16" height="58" rx="7" fill={GULD} />
      <ellipse cx="160" cy="120" rx="10" ry="4" fill={GULD_LYS} />
      {/* Hovedet løftet højt med en lille krone. */}
      <g transform="translate(-4 -16) rotate(-6 174 54)">
        {tigerHoved}
        <path d="M186 64 q -2 4 -6 3 M186 64 q 2 4 6 3" stroke="#a8641a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M164 33 L 162 21 L 169 27 L 174 18 L 179 27 L 186 21 L 184 33 Z" fill="#ffd23f" stroke="#c98a12" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="174" cy="28" r="1.8" fill="#e8453c" />
        <circle cx="166.5" cy="29.5" r="1.2" fill="#3b82f6" />
        <circle cx="181.5" cy="29.5" r="1.2" fill="#3b82f6" />
      </g>
      {/* Gnisterne funkler. */}
      <g className="zoo-fx-sparkle">{GLIMT(126, 22, 5.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(200, 24, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(116, 66, 5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(70, 104, 5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.8s")}>{GLIMT(144, 96, 4.2)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(154, 7, 3.4, "#fff6c2")}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Regnbuetukanen (legendarisk)                                             */
/* ------------------------------------------------------------------------ */

type Pkt = [number, number];
const bezier = (a: Pkt, b: Pkt, c: Pkt, d: Pkt) => (t: number): Pkt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};

const REGNBUE = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"];
// Næbbets kanter (fra Tukan i creatures.tsx), alle fra roden (t=0) til spidsen (t=1).
const naebTop = bezier([88, 26], [116, 18], [144, 26], [148, 40]);
const naebMidte = bezier([92, 40], [112, 42], [134, 44], [148, 40]);
const naebBund = bezier([92, 48], [112, 52], [140, 52], [148, 40]);

/** Regnbuebånd mellem to næbkanter: én flade pr. farve, fra roden mod spidsen. */
const regnbuebaand = (over: (t: number) => Pkt, under: (t: number) => Pkt) =>
  REGNBUE.map((farve, i) => {
    const ts = [0, 1, 2, 3, 4].map((k) => (i + k / 4) / REGNBUE.length);
    const pkt = [...ts.map(over), ...[...ts].reverse().map(under)];
    const d = "M" + pkt.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    return <path key={farve} d={d} fill={farve} stroke={farve} strokeWidth="0.6" strokeLinejoin="round" />;
  });

const tukanHale = (
  <>
    <path d="M24 66 L 6 98 L 30 86 Z" fill="#b9a8ff" />
    <path d="M18 76 L 10 92 M24 78 L 18 90" stroke="#ffd1f0" strokeWidth="2.5" strokeLinecap="round" />
  </>
);

const tukanKrop = (
  <>
    <ellipse cx="56" cy="66" rx="36" ry="30" fill="#eceaff" />
    <path d="M70 40 C 90 46, 92 72, 80 88 C 72 74, 70 56, 70 40 Z" fill="#fff3b0" />
    <path d="M76 84 C 70 92, 58 96, 50 94" stroke="#ff7aa8" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M30 62 C 40 54, 56 58, 60 70 C 50 76, 36 74, 30 62 Z" fill="#c9cdfa" />
    <path d="M36 64 q 10 6 20 4" stroke="#a5f3fc" strokeWidth="2" fill="none" strokeLinecap="round" />
  </>
);

/** Tukan med regnbuenæb og lyse fjer — står den stille, synger den. */
const rainbowToucan: CreatureSpec = {
  name: "Regnbuetukanen",
  rarity: "legendary",
  height: 12,
  aspect: 150 / 120,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 150 120",
  art: (
    <>
      {tukanHale}
      <g className="zoo-leg zoo-leg-a"><path d="M52 94 v 22 M48 116 h 10" stroke="#8a7cf0" strokeWidth="5" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M64 94 v 22 M60 116 h 10" stroke="#8a7cf0" strokeWidth="5" strokeLinecap="round" /></g>
      <g className="zoo-torso">{tukanKrop}</g>
      <g className="zoo-head">
        <circle cx="80" cy="38" r="18" fill="#eceaff" />
        {regnbuebaand(naebTop, naebBund)}
        <circle cx="84" cy="34" r="8" fill="#ff9ad5" />
        {EYE(85, 34, 3.6)}
        <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(118, 30, 3)}</g>
      </g>
    </>
  ),
  special: (
    <>
      {tukanHale}
      <path d="M52 94 v 22 M48 116 h 10" stroke="#8a7cf0" strokeWidth="5" strokeLinecap="round" />
      <path d="M64 94 v 22 M60 116 h 10" stroke="#8a7cf0" strokeWidth="5" strokeLinecap="round" />
      {tukanKrop}
      <circle cx="80" cy="38" r="18" fill="#eceaff" />
      {/* Underkæben går op og ned, mens den synger. */}
      <g className="zoo-fx-talk">
        <path d="M92 40 C 112 42, 134 44, 148 40 L 147.3 53.7 C 132.7 54.2, 111.9 46.9, 93 40.1 Z" fill="#6b1730" />
        <ellipse cx="108" cy="45" rx="9" ry="2.4" transform="rotate(12 108 45)" fill="#f472b6" />
        <g transform="rotate(14 92 44)">{regnbuebaand(naebMidte, naebBund)}</g>
      </g>
      {regnbuebaand(naebTop, naebMidte)}
      <circle cx="84" cy="34" r="8" fill="#ff9ad5" />
      {EYE(85, 34, 3.6)}
      {/* Farvede noder stiger op. */}
      <g className="zoo-fx-rise">{NODE(106, 18, REGNBUE[0], 0.6)}</g>
      <g className="zoo-fx-rise" style={fx("0.6s")}>{NODE(126, 19, REGNBUE[4], 0.6)}</g>
      <g className="zoo-fx-rise" style={fx("1.2s")}>{NODE(52, 28, REGNBUE[3], 0.85)}</g>
      <g className="zoo-fx-rise" style={fx("1.8s")}>{NODE(34, 34, REGNBUE[5], 0.85)}</g>
      <g className="zoo-fx-rise" style={fx("0.9s")}>{NODE(140, 24, REGNBUE[1], 0.55)}</g>
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  businessMonkey,
  readingSloth,
  yogaElephant,
  artistParrot,
  djGorilla,
  wizardFrog,
  goldenTiger,
  rainbowToucan,
};
