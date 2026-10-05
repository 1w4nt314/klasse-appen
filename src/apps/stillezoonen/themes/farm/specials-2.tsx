import type { CSSProperties } from "react";
import { EYE } from "../shared";
import { fx, GLIMT, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Sjældne bondegårdsdyr med særlig opførsel (anden omgang). `art` er figuren,
 * når den går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Usynlig lodret boks: gør en fx-gruppe højere, så procent-animationer (bob/rise) flytter længere. */
const boks = (x: number, y: number, h: number) => <rect x={x} y={y} width="1" height={h} fill="none" />;

/* ------------------------------------------------------------------------ */
/* Strikkefåret                                                             */
/* ------------------------------------------------------------------------ */

const ULD_LYS = "#f7f2e6";
const ULD = "#efe8d8";
const HUE = "#3f7fd1";
const HUE_MOERK = "#2f64ad";
const TOERKLAEDE = "#e0453a";
const STRIBE = "#f4c430";
const PIND = "#e0a64e";
const PIND_MOERK = "#c98a3c";
const PIND_KNOP = "#9a5e24";

/** Fårets uld når det går (som Får i creatures.tsx). */
const ULD_GAAR: ReadonlyArray<readonly [number, number, number]> = [
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

/** Uldkroppen når fåret sidder på halen (bunden ved viewBox' bund). */
const ULD_SIDDER: ReadonlyArray<readonly [number, number, number]> = [
  [50, 96, 20],
  [52, 72, 22],
  [70, 54, 24],
  [96, 58, 22],
  [106, 80, 20],
  [86, 98, 20],
  [66, 100, 18],
  [78, 78, 28],
];

const uld = (liste: ReadonlyArray<readonly [number, number, number]>) =>
  liste.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 3 === 1 ? ULD_LYS : ULD} />);

/** Halstørklædet om halsen: stribet bånd + en flig, der hænger ned. */
const halstoerklaede = (
  <>
    <path d="M124 72 L 118 94" stroke={TOERKLAEDE} strokeWidth="8" strokeLinecap="round" />
    <path d="M124 72 L 118 94" stroke={STRIBE} strokeWidth="8" strokeDasharray="3 5" />
    <path d="M114 97 l 1 4 M118 98 l 0 4 M122 97 l -1 4" stroke={TOERKLAEDE} strokeWidth="2" strokeLinecap="round" />
    <path d="M118 62 Q 122 80 142 80" stroke={TOERKLAEDE} strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M118 62 Q 122 80 142 80" stroke={STRIBE} strokeWidth="10" fill="none" strokeDasharray="3 6" />
  </>
);

/** Fårets hoved med strikhue (koordinater som Får i creatures.tsx). */
const faareHoved = (
  <>
    <ellipse cx="124" cy="54" rx="12" ry="6" transform="rotate(24 124 54)" fill="#5a524c" />
    <ellipse cx="142" cy="62" rx="17" ry="21" transform="rotate(-12 142 62)" fill="#6b5e56" />
    <circle cx="134" cy="38" r="12" fill={ULD_LYS} />
    <circle cx="146" cy="40" r="9" fill={ULD} />
    <ellipse cx="152" cy="76" rx="7" ry="5" fill="#e8a5ae" />
    <circle cx="145" cy="55" r="6" fill="#fff" />
    {EYE(146, 55, 3.8)}
    {/* Huen med kvast. */}
    <path d="M123 36 C 120 20, 134 12, 146 15 C 155 18, 160 27, 157 38 Z" fill={HUE} />
    <path d="M131 20 C 136 26, 138 32, 138 37 M146 17 C 149 24, 150 31, 149 37" stroke={HUE_MOERK} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M121 36 Q 140 30 159 39" stroke={HUE_MOERK} strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="136" cy="13" r="6" fill={STRIBE} />
    <circle cx="134" cy="11" r="2" fill="#fbe08a" />
  </>
);

/** Får med hue og halstørklæde — står det stille, sætter det sig og strikker. */
const knittingSheep: CreatureSpec = {
  name: "Strikkefåret",
  rarity: "rare",
  height: 13,
  aspect: 170 / 120,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 170 120",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="84" width="10" height="36" rx="5" fill="#3f3935" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="84" width="10" height="36" rx="5" fill="#3f3935" />
      </g>
      <g className="zoo-torso">
        <circle cx="30" cy="62" r="11" fill={ULD} />
        {uld(ULD_GAAR)}
        <circle cx="96" cy="58" r="14" fill="#f9f5ec" />
        <circle cx="58" cy="60" r="12" fill="#f9f5ec" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="116" y="86" width="11" height="34" rx="5" fill="#5a524c" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="86" width="11" height="34" rx="5" fill="#5a524c" />
      </g>
      <g className="zoo-head">
        {halstoerklaede}
        {faareHoved}
      </g>
    </>
  ),
  special: (
    <>
      {/* Fjerne forben bag kroppen; kun hoven med strikkepinden ses. */}
      <g className="zoo-fx-shake" style={{ ...fx("0.2s", "0% 50%"), animationDuration: "0.5s" } as CSSProperties}>
        <path d="M100 80 L 158 92" stroke="#3f3935" strokeWidth="9" strokeLinecap="round" />
        <path d="M162 95 L 130 69" stroke={PIND_MOERK} strokeWidth="3" strokeLinecap="round" />
        <circle cx="163" cy="96" r="3" fill={PIND_KNOP} />
      </g>
      {/* Fjerne bagben bøjet frem; hoven står, hvor forbenene står, når det går. */}
      <path d="M80 110 L 110 113" stroke="#3f3935" strokeWidth="10" strokeLinecap="round" />
      <rect x="108" y="104" width="9" height="14" rx="4" fill="#2b2622" />
      {/* Kroppen sidder på halen. */}
      <circle cx="34" cy="104" r="10" fill={ULD} />
      {uld(ULD_SIDDER)}
      <circle cx="84" cy="74" r="14" fill="#f9f5ec" />
      <circle cx="60" cy="80" r="12" fill="#f9f5ec" />
      {/* Nære bagben. */}
      <path d="M86 113 L 118 114.5" stroke="#5a524c" strokeWidth="11" strokeLinecap="round" />
      <rect x="117" y="104" width="10" height="16" rx="4" fill="#3f3935" />
      {/* Garnet løber fra strikketøjet ned til nøglet. */}
      <path d="M140 104 C 138 110, 134 112, 138 112" stroke={TOERKLAEDE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Uldnøglet ved fødderne vipper og ruller lidt. */}
      <g className="zoo-fx-bob" style={{ animationDuration: "1.2s" }}>
        {boks(138, 40, 80)}
        <g className="zoo-fx-shake" style={{ ...fx("0.1s", "50% 100%"), animationDuration: "1.2s" } as CSSProperties}>
          <circle cx="138" cy="113" r="7" fill={TOERKLAEDE} />
          <path d="M132 110 C 136 113, 141 113, 144 110 M132 115 C 136 118, 141 118, 144 115 M135 107 C 133 112, 135 116, 139 118.5" stroke="#b8302a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* Det halvfærdige stribede halstørklæde hænger ned fra pindene. */}
      <g className="zoo-fx-shake" style={{ ...fx("0s", "50% 0%"), animationDuration: "0.8s" } as CSSProperties}>
        <path d="M136 80 L 158 80 L 157 104 L 137 104 Z" fill={TOERKLAEDE} />
        <path d="M136.3 87 H 157.7 M136.6 96 H 157.4" stroke={STRIBE} strokeWidth="4" />
        <path d="M139 104 l -1 4 M144 104 v 4 M150 104 v 4 M155 104 l 1 4" stroke={TOERKLAEDE} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M136 81 H 158" stroke="#f08a80" strokeWidth="2.2" strokeDasharray="2.2 2.2" />
      </g>
      {/* Nære forben med den anden strikkepind. */}
      <g className="zoo-fx-shake" style={{ ...fx("0s", "0% 0%"), animationDuration: "0.5s" } as CSSProperties}>
        <path d="M110 84 L 130 96" stroke="#5a524c" strokeWidth="10" strokeLinecap="round" />
        <path d="M130 99 L 164 66" stroke={PIND} strokeWidth="3" strokeLinecap="round" />
        <circle cx="129" cy="100" r="3" fill={PIND_KNOP} />
        <rect x="126" y="92" width="9" height="9" rx="3.5" fill="#3f3935" />
      </g>
      {/* Hovedet bøjet over strikketøjet, nikker roligt. */}
      <g className="zoo-fx-nod" style={{ animationDuration: "1.6s" }}>
        <g transform="translate(-24 -4) rotate(8 142 62)">
          {halstoerklaede}
          {faareHoved}
        </g>
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Spa-grisen                                                               */
/* ------------------------------------------------------------------------ */

const GRIS = "#f7bcc6";
const GRIS_MOERK = "#e594a3";
const MUDDER = "#8b5a3c";
const MUDDER_LYS = "#a8714c";

/** Håndklæde viklet om hovedet som en turban (sidder på grisens hoved). */
const haandklaede = (
  <>
    <path d="M106 42 C 100 22, 118 8, 138 12 C 154 16, 160 30, 154 40 C 138 34, 120 36, 106 42 Z" fill="#fdfdfb" />
    <path d="M108 36 C 120 28, 140 26, 156 34" stroke="#7cc4e4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M114 22 C 124 26, 134 28, 146 24" stroke="#dfe7ea" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M104 42 C 120 34, 140 33, 156 40" stroke="#e6ecef" strokeWidth="5" fill="none" strokeLinecap="round" />
    <ellipse cx="128" cy="12" rx="9" ry="6" transform="rotate(-14 128 12)" fill="#fdfdfb" />
    <path d="M122 12 q 6 -4 12 -1" stroke="#7cc4e4" strokeWidth="2" fill="none" strokeLinecap="round" />
  </>
);

/** Grisens hoved med håndklæde (koordinater som Gris i creatures.tsx); `afslappet` giver agurker og smil. */
const griseHoved = (afslappet: boolean) => (
  <>
    <circle cx="130" cy="54" r="26" fill={GRIS} />
    <path d="M110 40 C 106 20, 124 14, 136 26 C 130 34, 120 40, 110 40 Z" fill={GRIS_MOERK} />
    {haandklaede}
    <ellipse cx="152" cy="62" rx="15" ry="12" fill="#f09db0" />
    <ellipse cx="156" cy="61" rx="2.4" ry="3.6" fill="#b8687a" />
    <ellipse cx="148" cy="62" rx="2.4" ry="3.6" fill="#b8687a" />
    <circle cx="122" cy="66" r="6" fill="#f09db0" opacity="0.6" />
    {afslappet ? (
      <>
        <path d="M136 70 q 5 5 11 1" stroke="#b8687a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Agurkeskiven over øjet. */}
        <circle cx="138" cy="47" r="7.5" fill="#4f9a3a" />
        <circle cx="138" cy="47" r="6" fill="#bfe39a" />
        <g fill="#8cc46a">
          <circle cx="136" cy="45" r="1" />
          <circle cx="140.5" cy="45.5" r="1" />
          <circle cx="137" cy="49.5" r="1" />
          <circle cx="140" cy="49" r="1" />
        </g>
      </>
    ) : (
      EYE(138, 46, 4)
    )}
  </>
);

/** Boble af mudder eller sæbe, der stiger op. */
const boble = (x: number, y: number, r: number, d: string, saebe: boolean) => (
  <g className="zoo-fx-rise" style={fx(d)}>
    {boks(x, y, 22)}
    {saebe ? (
      <>
        <circle cx={x} cy={y} r={r} fill="#fff" fillOpacity="0.3" stroke="#fff" strokeWidth="1.6" />
        <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" />
      </>
    ) : (
      <circle cx={x} cy={y} r={r} fill={MUDDER_LYS} />
    )}
  </g>
);

/** Gris med håndklæde om hovedet — står den stille, slapper den af i et mudderbad med agurker på øjnene. */
const spaPig: CreatureSpec = {
  name: "Spa-grisen",
  rarity: "rare",
  height: 13,
  aspect: 170 / 110,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 170 110",
  art: (
    <>
      <path d="M30 52 C 14 44, 12 62, 24 58 C 16 68, 32 70, 30 62" stroke="#ef9fae" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="104" y="78" width="18" height="32" rx="7" fill={GRIS_MOERK} />
        <rect x="104" y="103" width="18" height="7" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="78" width="18" height="32" rx="7" fill={GRIS_MOERK} />
        <rect x="38" y="103" width="18" height="7" rx="3" fill="#b8687a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="82" cy="58" rx="58" ry="36" fill={GRIS} />
        <ellipse cx="82" cy="78" rx="40" ry="12" fill="#fbd0d6" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="118" y="80" width="19" height="30" rx="7" fill={GRIS} />
        <rect x="118" y="103" width="19" height="7" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="80" width="19" height="30" rx="7" fill={GRIS} />
        <rect x="52" y="103" width="19" height="7" rx="3" fill="#c9788a" />
      </g>
      <g className="zoo-head">{griseHoved(false)}</g>
    </>
  ),
  special: (
    <>
      {/* Karret og mudderet sidder 4 enheder lavere end grisens gå-figur; fødderne står på bunden. */}
      <g transform="translate(0 4)">
      {/* Mudderet bag i karret. */}
      <path d="M18 62 C 24 50, 40 52, 48 54 C 60 46, 74 50, 82 52 C 96 46, 112 50, 120 54 L 152 62 Z" fill={MUDDER} />
      {/* Bagbenet hviler over kanten, med krydsede ben. */}
      <path d="M50 60 C 42 48, 36 40, 30 32" stroke={GRIS_MOERK} strokeWidth="12" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="29" rx="7" ry="5" transform="rotate(-50 28 29)" fill="#b8687a" />
      <path d="M58 60 C 52 46, 44 38, 40 30" stroke={GRIS} strokeWidth="12" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="27" rx="7" ry="5" transform="rotate(-60 38 27)" fill="#c9788a" />
      {/* Maven stikker op af mudderet. */}
      <ellipse cx="84" cy="54" rx="34" ry="13" fill={GRIS} />
      <ellipse cx="80" cy="49" rx="18" ry="5" fill="#fbd0d6" opacity="0.7" />
      <circle cx="94" cy="46" r="3" fill={MUDDER} />
      <circle cx="70" cy="47" r="2" fill={MUDDER} />
      </g>
      {/* Hovedet læner sig tilbage mod karrets kant. */}
      <g transform="translate(-2 -9) rotate(-22 130 54)">{griseHoved(true)}</g>
      <g transform="translate(0 4)">
      {/* Mudderoverfladen foran grisen. */}
      <path d="M16 60 C 24 50, 36 54, 44 52 C 54 48, 62 54, 72 52 C 84 48, 96 54, 104 52 C 112 50, 118 54, 124 58 L 124 62 H 16 Z" fill={MUDDER} />
      <path d="M28 56 q 6 -3 12 0 M80 54 q 6 -3 12 0" stroke={MUDDER_LYS} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      {/* Badekarret på små gyldne fødder. */}
      <ellipse cx="40" cy="105" rx="7" ry="5" fill="#d9a441" />
      <ellipse cx="132" cy="105" rx="7" ry="5" fill="#d9a441" />
      <g transform="translate(0 4)">
      <path d="M16 62 H 156 C 156 88, 144 102, 122 102 H 50 C 28 102, 16 88, 16 62 Z" fill="#f4f6f9" />
      <path d="M22 80 C 30 96, 44 100, 60 100 H 116 C 132 100, 144 94, 150 82" stroke="#dbe2ea" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="12" y="58" width="148" height="8" rx="4" fill="#ffffff" stroke="#d3dae3" strokeWidth="1.5" />
      <path d="M40 66 q 2 6 0 10 M104 66 q 3 5 1 8" stroke={MUDDER} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Forbenet hviler afslappet på kanten. */}
      <path d="M100 56 C 106 58, 110 60, 112 64" stroke={GRIS} strokeWidth="11" fill="none" strokeLinecap="round" />
      <rect x="106" y="62" width="11" height="8" rx="3" fill="#c9788a" />
      {/* Badeand vugger på mudderet. */}
      <g className="zoo-fx-bob" style={{ animationDuration: "1.3s" }}>
        <ellipse cx="62" cy="50" rx="8" ry="5" fill="#ffd84a" />
        <circle cx="67" cy="44" r="4" fill="#ffd84a" />
        <path d="M70 44 l 4 1 l -4 1.6 z" fill="#f5821e" />
        <circle cx="68" cy="43" r="0.9" fill="#1d1a17" />
      </g>
      {/* Bobler stiger op. */}
      {boble(48, 48, 4.5, "0s", true)}
      {boble(98, 50, 3.5, "0.8s", false)}
      {boble(112, 44, 5, "1.5s", true)}
      {boble(84, 46, 3, "1.9s", true)}
      {boble(26, 50, 3, "1.1s", false)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Vækkeur-hanen                                                            */
/* ------------------------------------------------------------------------ */

const HANE_KAM = "#d83a2e";
const HANE_NAEB = "#f2b81f";

/** Gammeldags vækkeur med to klokker; midten i (x, y), radius r. */
const vaekkeur = (x: number, y: number, r: number) => (
  <>
    <path d={`M${x - r * 0.55} ${y + r * 0.7} l ${-r * 0.35} ${r * 0.55} M${x + r * 0.55} ${y + r * 0.7} l ${r * 0.35} ${r * 0.55}`} stroke="#2a3f73" strokeWidth={r * 0.22} strokeLinecap="round" />
    <path d={`M${x - r * 0.7} ${y - r * 1.25} Q ${x} ${y - r * 1.75} ${x + r * 0.7} ${y - r * 1.25}`} stroke="#2a3f73" strokeWidth={r * 0.16} fill="none" strokeLinecap="round" />
    <circle cx={x - r * 0.68} cy={y - r * 0.9} r={r * 0.46} fill="#f2b632" />
    <circle cx={x + r * 0.68} cy={y - r * 0.9} r={r * 0.46} fill="#f2b632" />
    <circle cx={x} cy={y} r={r} fill="#3f7fd1" />
    <circle cx={x} cy={y} r={r * 0.74} fill="#fffaf0" />
    <path d={`M${x} ${y} V ${y - r * 0.55} M${x} ${y} L ${x + r * 0.4} ${y + r * 0.15}`} stroke="#2b2420" strokeWidth={r * 0.13} strokeLinecap="round" />
    <circle cx={x} cy={y} r={r * 0.1} fill="#e0453a" />
  </>
);

const haneHale = (
  <>
    <path d="M46 88 C 20 88, 6 64, 10 38 C 12 28, 20 24, 22 30 C 20 50, 32 68, 56 80 Z" fill="#26302c" />
    <path d="M46 92 C 22 98, 4 84, 4 62 C 4 54, 10 52, 12 58 C 14 72, 28 82, 54 86 Z" fill="#3f7d5a" />
    <path d="M48 84 C 30 76, 26 54, 36 40 C 40 36, 44 38, 43 44 C 42 58, 50 68, 60 76 Z" fill="#b4491f" />
  </>
);

const haneKrop = (
  <>
    <ellipse cx="72" cy="92" rx="40" ry="28" transform="rotate(-12 72 92)" fill="#c2561f" />
    <circle cx="98" cy="68" r="22" fill="#e49b2b" />
  </>
);

const haneVinge = (
  <>
    <ellipse cx="62" cy="96" rx="26" ry="15" transform="rotate(-14 62 96)" fill="#8f3a1a" />
    <path d="M44 100 C 58 108, 76 106, 88 96" stroke="#26302c" strokeWidth="5" fill="none" strokeLinecap="round" />
  </>
);

/** Hanens hoved (uden næb). */
const haneHoved = (
  <>
    <circle cx="106" cy="42" r="16" fill="#e49b2b" />
    <circle cx="97" cy="23" r="7" fill={HANE_KAM} />
    <circle cx="107" cy="18" r="8.5" fill={HANE_KAM} />
    <circle cx="117" cy="23" r="7" fill={HANE_KAM} />
    <ellipse cx="122" cy="62" rx="5.5" ry="9" fill={HANE_KAM} />
    <ellipse cx="116" cy="60" rx="4" ry="7" fill="#b92e24" />
    <circle cx="106" cy="52" r="5" fill="#f6f0e0" />
  </>
);

const HANE_BEN_A = "M70 112 V 143 M62 146 H 80 M70 143 L 62 147 M70 143 L 80 147 M70 128 L 76 126";
const HANE_BEN_B = "M88 112 V 143 M80 146 H 98 M88 143 L 80 147 M88 143 L 98 147 M88 128 L 94 126";

/** Hane med et vækkeur under vingen — står den stille, ringer uret, og hanen galer. */
const alarmRooster: CreatureSpec = {
  name: "Vækkeur-hanen",
  rarity: "rare",
  height: 11,
  aspect: 150 / 150,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 150 150",
  art: (
    <>
      <g className="zoo-tail">{haneHale}</g>
      <g className="zoo-leg zoo-leg-a">
        <path d={HANE_BEN_A} stroke="#e9a21f" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d={HANE_BEN_B} stroke="#c98616" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        {haneKrop}
        {haneVinge}
        {/* Vækkeuret klemt ind under vingespidsen. */}
        {vaekkeur(92, 104, 11)}
        <path d="M74 96 C 84 94, 88 100, 86 110 C 80 112, 74 106, 74 96 Z" fill="#8f3a1a" />
      </g>
      <g className="zoo-head">
        {haneHoved}
        <path d="M121 40 L 138 46 L 121 52 Z" fill={HANE_NAEB} />
        {EYE(111, 37, 3.6)}
      </g>
    </>
  ),
  special: (
    <>
      {haneHale}
      <path d={HANE_BEN_A} stroke="#e9a21f" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={HANE_BEN_B} stroke="#c98616" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {haneKrop}
      {/* Vingen løftet lidt ud fra kroppen. */}
      <g transform="rotate(-16 50 96)">{haneVinge}</g>
      {/* Hovedet kastet bagover; næbbet står åbent, og hanen galer. */}
      <g className="zoo-fx-shake" style={{ ...fx("0s", "30% 100%"), animationDuration: "0.6s" } as CSSProperties}>
        <g transform="rotate(-24 100 58)">
          {haneHoved}
          <path d="M121 40 L 128 46 L 121 50 Z" fill="#8a2a22" />
          <path d="M121 39 L 140 41 L 122 45 Z" fill={HANE_NAEB} />
          <g className="zoo-fx-talk" style={{ animationDuration: "0.25s" }}>
            <path d="M122 47 L 137 54 L 121 52 Z" fill="#e0a018" />
          </g>
          {/* Lukkede, glade øjne: den giver den hele armen. */}
          <path d="M107 38 q 4 -4 8 0" stroke="#1d1a17" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* Lydstreger fra næbbet. */}
      <g className="zoo-fx-sparkle" style={{ animationDuration: "0.9s" }}><path d="M138 30 q 5 -5 2 -12" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-fx-sparkle" style={{ ...fx("0.3s"), animationDuration: "0.9s" } as CSSProperties}><path d="M142 34 q 8 -8 4 -20" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-fx-sparkle" style={{ ...fx("0.6s"), animationDuration: "0.9s" } as CSSProperties}><path d="M126 18 l 4 -8 M134 20 l 6 -6" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" /></g>
      {/* Vækkeuret står på jorden og ringer. */}
      <g className="zoo-fx-shake" style={{ ...fx("0s", "50% 100%"), animationDuration: "0.18s" } as CSSProperties}>
        {vaekkeur(124, 130, 12)}
      </g>
      <g className="zoo-fx-sparkle" style={{ animationDuration: "0.5s" }}>
        <path d="M106 112 l -5 -4 M104 120 l -6 0 M142 112 l 4 -3.5 M143 120 l 4.5 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Fodboldgeden                                                             */
/* ------------------------------------------------------------------------ */

const TROEJE = "#d6402f";
const TROEJE_KANT = "#fff";

/** Trøjen med nummer 10 hen over gedens krop. */
const troeje = (
  <>
    <path d="M62 53 C 80 47, 102 48, 118 56 C 122 52, 125 50, 127 49 L 150 70 C 140 76, 130 84, 124 96 C 112 102, 90 104, 63 101 C 59 88, 59 66, 62 53 Z" fill={TROEJE} />
    <path d="M127 49 L 150 70" stroke={TROEJE_KANT} strokeWidth="4" strokeLinecap="round" />
    <path d="M64 101 C 90 104, 112 102, 124 96" stroke={TROEJE_KANT} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <text x="91" y="88" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" fill={TROEJE_KANT}>
      10
    </text>
  </>
);

/** Gedens hoved (koordinater som Ged i creatures.tsx). */
const gedeHoved = (
  <>
    <path d="M144 34 C 144 18, 134 8, 118 10" stroke="#8a7560" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M150 32 C 152 18, 144 10, 134 10" stroke="#a08a72" strokeWidth="5" fill="none" strokeLinecap="round" />
    <ellipse cx="136" cy="50" rx="13" ry="5.5" transform="rotate(22 136 50)" fill="#d8c8ae" />
    <ellipse cx="150" cy="48" rx="17" ry="15" fill="#efe6d4" />
    <ellipse cx="166" cy="56" rx="13" ry="10" fill="#efe6d4" />
    <ellipse cx="175" cy="56" rx="4" ry="3.2" fill="#6b5a4c" />
    <path d="M160 64 C 164 70, 164 80, 160 88 C 156 80, 154 70, 156 64 Z" fill="#a08a72" />
  </>
);

/** Klassisk fodbold med sorte felter; midten i (x, y). */
const fodbold = (x: number, y: number, r: number) => (
  <>
    <circle cx={x} cy={y} r={r} fill="#fff" stroke="#2b2b2b" strokeWidth="1.4" />
    <polygon
      fill="#2b2b2b"
      points={Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return `${(x + r * 0.38 * Math.cos(a)).toFixed(1)},${(y + r * 0.38 * Math.sin(a)).toFixed(1)}`;
      }).join(" ")}
    />
    {Array.from({ length: 5 }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const x1 = x + r * 0.38 * Math.cos(a);
      const y1 = y + r * 0.38 * Math.sin(a);
      const x2 = x + r * 0.95 * Math.cos(a);
      const y2 = y + r * 0.95 * Math.sin(a);
      return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke="#2b2b2b" strokeWidth="1.3" />;
    })}
  </>
);

/** Ged i fodboldtrøje — står den stille, jonglerer den med en bold på hovedet. */
const footballGoat: CreatureSpec = {
  name: "Fodboldgeden",
  rarity: "rare",
  height: 15,
  aspect: 190 / 150,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 190 150",
  art: (
    <>
      <path d="M38 66 L 26 52 L 46 60 Z" fill="#d8c8ae" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="108" y="92" width="11" height="58" rx="5" fill="#bba98d" />
        <rect x="108" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="92" width="11" height="58" rx="5" fill="#bba98d" />
        <rect x="44" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="84" cy="78" rx="52" ry="28" fill="#efe6d4" />
        <path d="M110 66 C 122 48, 134 40, 144 40 L 158 68 C 144 72, 130 82, 122 98 Z" fill="#efe6d4" />
        <ellipse cx="70" cy="92" rx="34" ry="8" fill="#e0d4bc" opacity="0.7" />
        {troeje}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
        <rect x="120" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="58" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
        <rect x="58" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      </g>
      <g className="zoo-head">
        {gedeHoved}
        {EYE(154, 44, 3.8)}
      </g>
    </>
  ),
  special: (
    <>
      <path d="M38 66 L 26 52 L 46 60 Z" fill="#d8c8ae" />
      <rect x="108" y="92" width="11" height="58" rx="5" fill="#bba98d" />
      <rect x="108" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      <rect x="44" y="92" width="11" height="58" rx="5" fill="#bba98d" />
      <rect x="44" y="142" width="11" height="8" rx="3" fill="#4a3f3a" />
      <ellipse cx="84" cy="78" rx="52" ry="28" fill="#efe6d4" />
      <path d="M110 66 C 122 48, 134 40, 144 40 L 158 68 C 144 72, 130 82, 122 98 Z" fill="#efe6d4" />
      <ellipse cx="70" cy="92" rx="34" ry="8" fill="#e0d4bc" opacity="0.7" />
      {troeje}
      <rect x="120" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
      <rect x="120" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      <rect x="58" y="94" width="12" height="56" rx="5" fill="#efe6d4" />
      <rect x="58" y="142" width="12" height="8" rx="3" fill="#4a3f3a" />
      {/* Hovedet løftet; det nikker bolden op i takt med hoppet. */}
      <g className="zoo-fx-nod" style={{ ...fx("0s", "10% 90%"), animationDuration: "0.55s" } as CSSProperties}>
        <g transform="rotate(-6 140 60)">
          {gedeHoved}
          {/* Øjet kigger op efter bolden. */}
          <circle cx="155" cy="44" r="4.6" fill="#fff" />
          <circle cx="156.5" cy="42" r="2.6" fill="#1d1a17" />
        </g>
      </g>
      {/* Bolden hopper på panden (to indlejrede bob-grupper giver et højere hop). */}
      <g className="zoo-fx-bob" style={{ animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.2, 0.7, 0.4, 1)" }}>
        {boks(160, 0, 140)}
        <g className="zoo-fx-bob" style={{ animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.2, 0.7, 0.4, 1)" }}>
          {boks(161, 12, 88)}
          {fodbold(158, 23, 12)}
        </g>
      </g>
      {/* Små stjerner, når bolden rammer. */}
      <g className="zoo-fx-sparkle" style={{ ...fx("0.55s"), animationDuration: "1.1s" } as CSSProperties}>
        {STJERNE(142, 28, 5, "#ffd84a")}
        {STJERNE(176, 26, 4.5, "#ffd84a")}
        {GLIMT(180, 38, 3.5, "#fff")}
        {GLIMT(138, 40, 3, "#fff")}
      </g>
    </>
  ),
};

export const specialsTwo: Record<string, CreatureSpec> = {
  knittingSheep,
  spaPig,
  alarmRooster,
  footballGoat,
};
