import type { CSSProperties, ReactNode } from "react";
import { EYE, Klip } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Legendariske rumvæsner med særlig opførsel. `art` er figuren, når den går
 * eller svæver; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Afrunder til 1 decimal. */
const r1 = (v: number) => +v.toFixed(1);

type Pkt = [number, number];
const bezier = (a: Pkt, b: Pkt, c: Pkt, d: Pkt) => (t: number): Pkt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [r1(k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0]), r1(k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1])];
};

/* ------------------------------------------------------------------------ */
/* Stjernedragen (legendarisk)                                              */
/* ------------------------------------------------------------------------ */

const DR_KROP = "#4b3fb8";
const DR_MOERK = "#352a8c";
const DR_SNUDE = "#5d51cc";
const DR_BUG = "#c3b4ff";
const DR_VINGE = "#7a5de0";
const DR_HUD = "#b9a5ff";
const DR_GULD = "#f6c343";
const DR_GULD_MOERK = "#d99a1c";
const DR_STJERNE = "#ffe27a";
const DR_SOELV = "#cfe6ff";

/** Lille gylden pig/horn med roden i (x, y), drejet `vinkel` grader. */
const dragePig = (x: number, y: number, vinkel: number, s = 1) => (
  <path
    d="M-4 2 Q -1.6 -8 0 -11 Q 1.6 -8 4 2 Z"
    transform={`translate(${x} ${y}) rotate(${vinkel}) scale(${s})`}
    fill={DR_GULD}
    stroke={DR_GULD_MOERK}
    strokeWidth="1"
    strokeLinejoin="round"
  />
);

/** Lille flagermusvinge med roden i (0, 0), der peger op og bagud. */
const drageVinge = (hud: string, ben: string) => (
  <>
    <path d="M3 2 C -1 -14, -10 -26, -22 -34 C -20 -26, -23 -21, -28 -17 C -21 -17, -17 -13, -16 -8 C -10 -9, -3 -5, 7 1 Z" fill={hud} />
    <path d="M3 1 C -1 -14, -10 -26, -22 -33 M2 -1 L -26 -17 M3 -1 L -15 -8" stroke={ben} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </>
);

/** Fjern vinge (bag kroppen) og nær vinge (oven på kroppen). */
const drageVingeBag = <g transform="translate(80 62) scale(1)">{drageVinge("#9a86e8", DR_MOERK)}</g>;
const drageVingeFor = <g transform="translate(64 68) scale(1.2)">{drageVinge(DR_HUD, DR_VINGE)}</g>;

/** Halen med en gylden stjerne i spidsen. */
const drageHale = (
  <>
    <path d="M40 80 C 26 82, 15 76, 10 64 C 8 80, 18 98, 42 102 Z" fill={DR_KROP} />
    <path d="M38 92 C 28 92, 20 86, 15 76" stroke={DR_SNUDE} strokeWidth="2" fill="none" strokeLinecap="round" />
    {STJERNE(10, 60, 7.5, DR_GULD)}
  </>
);

/** Hals, hoved med horn-kam og ansigt. `pust` giver åben, pustende mund. */
const drageHoved = (pust: boolean) => (
  <>
    {/* Gylden horn-kam ned ad nakken (roden gemmer sig under halsen). */}
    {dragePig(87, 40, -52, 1)}
    {dragePig(81, 50, -58, 0.95)}
    {dragePig(75, 60, -64, 0.85)}
    {/* To små gyldne horn. */}
    {dragePig(100, 25, -22, 1.35)}
    {dragePig(112, 23, 8, 1.25)}
    {/* Hals og hoved. */}
    <path d="M70 68 C 76 54, 82 44, 90 36 L 114 56 C 104 66, 98 78, 94 92 Z" fill={DR_KROP} />
    <path d="M110 58 C 102 68, 98 80, 96 94 L 88 96 C 90 80, 96 66, 104 56 Z" fill={DR_BUG} />
    <circle cx="108" cy="42" r="22" fill={DR_KROP} />
    <ellipse cx="127" cy="50" rx="16" ry="12.5" fill={DR_KROP} />
    <ellipse cx="129" cy="55" rx="12" ry="6.5" fill={DR_SNUDE} />
    <ellipse cx="139" cy="45" rx="1.6" ry="2.3" fill={DR_MOERK} />
    <path d="M94 32 C 98 26, 104 23, 110 23" stroke={DR_SNUDE} strokeWidth="3" fill="none" strokeLinecap="round" />
    {STJERNE(97, 44, 4.5, DR_STJERNE)}
    <circle cx="103" cy="54" r="1.5" fill={DR_SOELV} />
    <circle cx="113" cy="38" r="8.5" fill="#fff" />
    {EYE(115, 38, 5.6)}
    <circle cx="120" cy="52" r="4.5" fill="#ff9fd0" opacity="0.55" />
    {pust ? (
      <>
        <ellipse cx="137" cy="57" rx="5" ry="4.4" fill="#2a1d6b" />
        <ellipse cx="136" cy="59" rx="3" ry="1.8" fill="#ff8fb8" />
      </>
    ) : (
      <path d="M123 58 q 8 5 16 -1" stroke={DR_MOERK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    )}
  </>
);

/** Kroppen med lys mave og stjerneformede pletter. */
const drageKrop = (
  <>
    <ellipse cx="62" cy="86" rx="34" ry="24" fill={DR_KROP} />
    <ellipse cx="68" cy="98" rx="24" ry="10" fill={DR_BUG} />
    <path d="M54 96 q 4 3 8 0 M66 98 q 4 3 8 0 M78 96 q 3 3 7 0" stroke={DR_HUD} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M38 74 C 46 66, 58 63, 70 64" stroke={DR_SNUDE} strokeWidth="3" fill="none" strokeLinecap="round" />
    {STJERNE(50, 80, 6.5, DR_STJERNE)}
    {STJERNE(78, 78, 4.5, DR_SOELV)}
    {STJERNE(36, 92, 4, DR_SOELV)}
    <circle cx="64" cy="86" r="1.6" fill={DR_STJERNE} />
    <circle cx="44" cy="70" r="1.4" fill={DR_SOELV} />
  </>
);

/** Kort, buttet ben med lys fod. */
const drageBen = (x: number, farve: string) => (
  <>
    <rect x={x} y="96" width="13" height="22" rx="6" fill={farve} />
    <ellipse cx={x + 7} cy="117" rx="8.5" ry="3" fill={farve} />
    <path d={`M${x + 8} 116 v 2 M${x + 12} 116 v 2`} stroke={DR_HUD} strokeWidth="1.4" strokeLinecap="round" />
  </>
);

/** Stjernestrømmen fra munden: en bue op og frem over hovedet. */
const pusteBue = bezier([143, 50], [172, 30], [168, -16], [122, -20]);
const PUST_FARVER = [DR_STJERNE, "#ffffff", "#bfe3ff", "#ffb3e6"];
const PUST_ANTAL = 8;
const pusteStjerner = Array.from({ length: PUST_ANTAL }, (_, i) => {
  const [x, y] = pusteBue(0.1 + (i * 0.9) / (PUST_ANTAL - 1));
  return { x, y, r: r1(3.4 + i * 0.45), farve: PUST_FARVER[i % PUST_FARVER.length] };
});

/** Sød baby-rumdrage — står den stille, sætter den sig og puster glitrende stjerner. */
const starDragon: CreatureSpec = {
  name: "Stjernedragen",
  rarity: "legendary",
  height: 20.5,
  aspect: 172 / 154,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 -34 172 154",
  art: (
    <>
      {drageHale}
      <g className="zoo-leg zoo-leg-a">{drageBen(82, DR_MOERK)}</g>
      <g className="zoo-leg zoo-leg-b">{drageBen(32, DR_MOERK)}</g>
      <g className="zoo-torso">
        {drageVingeBag}
        {drageKrop}
        {drageVingeFor}
        <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(56, 74, 4.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(30, 46, 3.4, "#fff6c2")}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">{drageBen(92, DR_KROP)}</g>
      <g className="zoo-leg zoo-leg-a">{drageBen(46, DR_KROP)}</g>
      <g className="zoo-head">
        {drageHoved(false)}
        <g className="zoo-fx-sparkle" style={fx("0.2s")}>{GLIMT(120, 12, 3.6, "#fff6c2")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Halen ligger på jorden og logrer. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.3s", "100% 100%"), animationDuration: "1.3s" }}>
        <path d="M40 98 C 28 104, 20 102, 17 92 C 14 106, 26 120, 46 116 Z" fill={DR_KROP} />
        {STJERNE(17, 88, 7, DR_GULD)}
      </g>
      {/* Fjerne vinge vipper. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.15s", "100% 100%"), animationDuration: "0.7s" }}>{drageVingeBag}</g>
      {/* Fjerne forben. */}
      <rect x="84" y="96" width="12" height="22" rx="6" fill={DR_MOERK} />
      <ellipse cx="91" cy="117" rx="8" ry="3" fill={DR_MOERK} />
      {/* Dragen sidder: kroppen vippet op, numsen på jorden. */}
      <g transform="rotate(-16 62 96)">
        <ellipse cx="62" cy="94" rx="33" ry="23" fill={DR_KROP} />
        <ellipse cx="70" cy="104" rx="22" ry="9" fill={DR_BUG} />
        {STJERNE(50, 88, 6.5, DR_STJERNE)}
        {STJERNE(76, 84, 4.5, DR_SOELV)}
        {STJERNE(38, 100, 4, DR_SOELV)}
      </g>
      {/* Nære baglår og fod. */}
      <ellipse cx="50" cy="104" rx="16" ry="13" fill={DR_KROP} />
      <path d="M40 96 C 44 92, 52 91, 58 94" stroke={DR_SNUDE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="62" cy="117" rx="12" ry="3" fill={DR_KROP} />
      <path d="M68 116 v 2 M72 116 v 2" stroke={DR_HUD} strokeWidth="1.4" strokeLinecap="round" />
      {/* Nære vinge vipper glad. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "100% 100%"), animationDuration: "0.7s" }}>{drageVingeFor}</g>
      {/* Hovedet løftet lidt, munden åben. */}
      <g transform="rotate(-12 108 50)">{drageHoved(true)}</g>
      {/* Nære forben foran. */}
      <rect x="94" y="96" width="13" height="22" rx="6" fill={DR_KROP} />
      <ellipse cx="101" cy="117" rx="8.5" ry="3" fill={DR_KROP} />
      <path d="M102 116 v 2 M106 116 v 2" stroke={DR_HUD} strokeWidth="1.4" strokeLinecap="round" />
      {/* Et lille glimt ved munden, hvor stjernerne kommer ud. */}
      <g className="zoo-fx-sparkle" style={{ ...fx("0.1s"), animationDuration: "0.7s" }}>{GLIMT(146, 50, 4, "#fff6c2")}</g>
      {/* Glimmerspor langs buen. */}
      <path d="M143 50 C 172 30, 168 -16, 122 -20" stroke="#fff3b0" strokeWidth="2.6" strokeDasharray="0.1 7" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Stjernerne strømmer ud i buen, den ene efter den anden. */}
      {pusteStjerner.map((s, i) => (
        <g key={i} className="zoo-fx-sparkle" style={fx(`${((PUST_ANTAL - i) * 0.17).toFixed(2)}s`)}>
          {STJERNE(s.x, s.y, s.r, s.farve)}
        </g>
      ))}
      {/* Små stjerner driver op fra buens ende. */}
      <g className="zoo-fx-rise" style={fx("0.4s")}>{STJERNE(112, -10, 3.4, DR_STJERNE)}</g>
      <g className="zoo-fx-rise" style={fx("1.3s")}>{STJERNE(100, -2, 3, "#ffb3e6")}</g>
      <g className="zoo-fx-rise" style={fx("2s")}>{STJERNE(134, -8, 2.8, "#bfe3ff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(56, 74, 4.5)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Galaksekatten (legendarisk)                                              */
/* ------------------------------------------------------------------------ */

const KAT_PELS = "#6c5ce0";
const KAT_MOERK = "#5545c2";
const KAT_SNUDE = "#978af5";
const KAT_TAAGE_ROSA = "#ff8fdc";
const KAT_TAAGE_BLAA = "#8fe9ff";
const KAT_STJERNE = "#fff3b0";
const KAT_OERE = "#ffa6dc";
/** Lys, glødende kant, så katten står tydeligt mod den mørke rumhimmel. */
const KAT_GLOED = "#bdeeff";

/**
 * Glødende kant bag en silhuet: `form(w)` tegner formen uden farve; flader
 * arver glødens fyld/streg, streger lægger selv `w` til deres bredde.
 * `halo` giver desuden et blødt, bredere skær.
 */
const katGloed = (form: (w: number) => ReactNode, halo = true) => (
  <>
    {halo && (
      <g fill={KAT_GLOED} stroke={KAT_GLOED} strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" opacity="0.3">
        {form(12)}
      </g>
    )}
    <g fill={KAT_GLOED} stroke={KAT_GLOED} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
      {form(6)}
    </g>
  </>
);

/** Galaksepels: mælkevej og tåge-swirl, klippet til formen `form`. */
const galaksePels = (form: ReactNode, dx = 0, dy = 0) => (
  <Klip form={form}>
    <g transform={`translate(${dx} ${dy})`}>
      <path d="M18 84 C 40 56, 74 72, 104 38" stroke={KAT_TAAGE_BLAA} strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M18 84 C 40 56, 74 72, 104 38" stroke="#e0f7ff" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.3" />
      <ellipse cx="61" cy="62" rx="11" ry="8" fill={KAT_TAAGE_ROSA} opacity="0.35" />
      <path d="M53 62 C 54 55, 64 53, 67 59 C 70 66, 60 70, 57 65 C 54 61, 59 58, 62 61" stroke="#ffb3ea" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="61.5" cy="61.5" r="1.8" fill="#fff" />
      <circle cx="38" cy="56" r="1.4" fill="#fff" />
      <circle cx="86" cy="70" r="1.3" fill="#fff" />
      <circle cx="80" cy="50" r="1.1" fill={KAT_STJERNE} />
      <circle cx="34" cy="72" r="1.2" fill={KAT_STJERNE} />
      {STJERNE(84, 58, 4, KAT_STJERNE)}
      {STJERNE(40, 64, 3.2, "#fff")}
    </g>
  </Klip>
);

/** Hovedets silhuet (ører, hoved og snude) til gløden. */
const katHovedForm = (
  <>
    <path d="M89 31 L 91 6 L 106 22 Z" />
    <path d="M106 22 L 119 4 L 123 30 Z" />
    <circle cx="106" cy="40" r="19" />
    <ellipse cx="118" cy="48" rx="9" ry="7" />
  </>
);

/** Kattens hoved med galakse-ører; `kig` sænker blikket (ser ned på planeten). */
const katHoved = (kig: boolean) => (
  <>
    <path d="M89 31 L 91 6 L 106 22 Z" fill={KAT_PELS} />
    <path d="M92 26 L 93 12 L 101 22 Z" fill={KAT_OERE} />
    <path d="M106 22 L 119 4 L 123 30 Z" fill={KAT_PELS} />
    <path d="M110 22 L 118 11 L 120 25 Z" fill={KAT_OERE} />
    <circle cx="106" cy="40" r="19" fill={KAT_PELS} />
    <path d="M92 30 C 96 25, 102 23, 108 23" stroke={KAT_SNUDE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    {STJERNE(96, 46, 3, KAT_STJERNE)}
    <circle cx="100" cy="30" r="1.2" fill="#fff" />
    <ellipse cx="118" cy="48" rx="9" ry="7" fill={KAT_SNUDE} />
    <path d="M123 43 l 5 0 l -2.5 3.4 Z" fill="#ff9fc8" />
    <path d="M125.5 46.4 v 2.6 q -2.4 3 -5 1 M125.5 49 q 2 3 4.4 1" stroke="#2a1d6b" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M118 48 L 137 45 M118 50 L 137 52" stroke="#efeaff" strokeWidth="1.1" strokeLinecap="round" />
    <circle cx="113" cy={kig ? 39 : 37} r="5.6" fill="#ffd84a" />
    {EYE(kig ? 115 : 114, kig ? 40 : 37, 3.8)}
    <circle cx="110" cy="49" r="3.6" fill="#ff8ad8" opacity="0.55" />
  </>
);

/** Benets silhuet fra `top` og ned (nære ben gløder kun under kroppen). */
const katBenForm = (x: number, top = 70) => (
  <>
    <rect x={x} y={top} width="10" height={98 - top} rx="5" />
    <ellipse cx={x + 6} cy="97.4" rx="7" ry="2.6" />
  </>
);

/** Ben med pote. */
const katBen = (x: number, farve: string) => (
  <>
    <rect x={x} y="70" width="10" height="28" rx="5" fill={farve} />
    <ellipse cx={x + 6} cy="97.4" rx="7" ry="2.6" fill={farve} />
  </>
);

const KAT_HALE_GAA = "M30 58 C 12 54, 6 36, 12 20 C 15 12, 24 12, 24 20";
const KAT_HALE_LEG = "M34 56 C 24 44, 22 28, 30 16 C 34 10, 42 11, 40 19";
const KAT_FJERN_POTE = "M90 88 L 122 94";
const KAT_NAER_POTE = "M94 84 C 104 82, 113 77, 122 72";

/** Ringplaneten (garnnøglet), centreret i (0, 0); tegnes forstørret. */
const ringPlanet = (
  <>
    <path d="M-12.5 0 A 12.5 4.2 0 0 1 12.5 0" stroke="#ffd84a" strokeWidth="2.4" fill="none" />
    <circle cx="0" cy="0" r="7.5" fill="#ff8a5c" />
    <path d="M-6.5 -3 C -2 -5, 3 -5, 6.8 -2.4 M-7.2 2 C -2 3.6, 3 3.6, 7.2 1.6" stroke="#ffc08a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="-3" cy="-3.4" r="1.4" fill="#ffe0c8" />
    <path d="M-12.5 0 A 12.5 4.2 0 0 0 12.5 0" stroke="#ffd84a" strokeWidth="2.4" fill="none" />
  </>
);

/** Kat med galaksepels — står den stille, leger den med en ringplanet. */
const galaxyCat: CreatureSpec = {
  name: "Galaksekatten",
  rarity: "legendary",
  height: 11.4,
  aspect: 172 / 104,
  gait: "walk",
  pace: 1.1,
  viewBox: "-6 -4 172 104",
  art: (
    <>
      {/* Glødende kant bag hale, krop og hoved. */}
      {katGloed((w) => (
        <>
          <path d={KAT_HALE_GAA} fill="none" strokeWidth={9 + w} />
          <ellipse cx="62" cy="62" rx="36" ry="20" />
          {katHovedForm}
        </>
      ))}
      <g>
        <path d={KAT_HALE_GAA} stroke={KAT_PELS} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="13" cy="30" r="1.4" fill="#fff" />
        {STJERNE(18, 16, 2.6, KAT_STJERNE)}
      </g>
      <g className="zoo-leg zoo-leg-a">
        {katGloed(() => katBenForm(78))}
        {katBen(78, KAT_MOERK)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        {katGloed(() => katBenForm(30))}
        {katBen(30, KAT_MOERK)}
      </g>
      <g className="zoo-torso">
        <ellipse cx="62" cy="62" rx="36" ry="20" fill={KAT_PELS} />
        {galaksePels(<ellipse cx="62" cy="62" rx="36" ry="20" />)}
        <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(70, 48, 3.6)}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        {katGloed(() => katBenForm(90, 76), false)}
        {katBen(90, KAT_PELS)}
      </g>
      <g className="zoo-leg zoo-leg-a">
        {katGloed(() => katBenForm(42, 84), false)}
        {katBen(42, KAT_PELS)}
      </g>
      <g className="zoo-head">
        {katHoved(false)}
        <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(128, 22, 3, "#fff6c2")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Glødende kant bag krop, hoved og ben. */}
      {katGloed((w) => (
        <>
          {katBenForm(30)}
          {katBenForm(42)}
          <path d={KAT_FJERN_POTE} fill="none" strokeWidth={10 + w} />
          <ellipse cx="64" cy="64" rx="36" ry="19" transform="rotate(16 66 66)" />
          <g transform="translate(-6 6) rotate(6 106 40)">{katHovedForm}</g>
        </>
      ))}
      {/* Halen står op og vifter. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.2s", "50% 100%"), animationDuration: "0.8s" }}>
        {katGloed((w) => <path d={KAT_HALE_LEG} fill="none" strokeWidth={9 + w} />)}
        <path d={KAT_HALE_LEG} stroke={KAT_PELS} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="26" cy="34" r="1.4" fill="#fff" />
        {STJERNE(34, 12, 2.6, KAT_STJERNE)}
      </g>
      {/* Bagbenene står, hvor de står, når den går. */}
      {katBen(30, KAT_MOERK)}
      {/* Fjerne forben ligger strakt frem på jorden. */}
      <path d={KAT_FJERN_POTE} stroke={KAT_MOERK} strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Legebuk: numsen oppe, brystet nede. */}
      <g transform="rotate(16 66 66)">
        <ellipse cx="64" cy="64" rx="36" ry="19" fill={KAT_PELS} />
        {galaksePels(<ellipse cx="64" cy="64" rx="36" ry="19" />, 2, 2)}
      </g>
      {katGloed(() => katBenForm(42, 84), false)}
      {katBen(42, KAT_PELS)}
      {/* Hovedet sænket mod planeten. */}
      <g transform="translate(-6 6) rotate(6 106 40)">{katHoved(true)}</g>
      {/* Nære forpote slår legende efter planeten. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "0% 100%"), animationDuration: "0.5s" }}>
        {katGloed((w) => <path d={KAT_NAER_POTE} fill="none" strokeWidth={10 + w} />, false)}
        <path d={KAT_NAER_POTE} stroke={KAT_PELS} strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="123" cy="72" r="2.2" fill={KAT_OERE} />
      </g>
      {/* Ringplaneten hopper og snurrer mellem poterne. */}
      <g className="zoo-fx-bob" style={{ ...fx("0.3s"), animationDuration: "0.5s" }}>
        <rect x="139" y="-150" width="0.1" height="246" fill="none" />
        <g className="zoo-fx-spin" style={{ animationDuration: "1.6s" } as CSSProperties}>
          <g transform="translate(139 74) rotate(-20) scale(1.9)">{ringPlanet}</g>
        </g>
      </g>
      {/* Stjerner funkler omkring legen. */}
      <g className="zoo-fx-sparkle">{STJERNE(156, 38, 4, KAT_STJERNE)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(128, 42, 3.4)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{STJERNE(160, 62, 2.8, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(62, 40, 4)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(14, 26, 3, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.7s")}>{HJERTE(134, 14, 4, KAT_TAAGE_ROSA)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Den gyldne UFO (legendarisk)                                             */
/* ------------------------------------------------------------------------ */

const UFO_GULD = "#f6c343";
const UFO_LYS = "#ffe48a";
const UFO_MOERK = "#d99a1c";
const UFO_DYB = "#b97a12";
const UFO_GLANS = "#fff6cf";
const KAPTAJN_GROEN = "#7fe07a";
const KAPTAJN_JAKKE = "#2b3a8f";
const KAPTAJN_HAT = "#1f2a72";

/** Regnbuelysene rundt om kanten, fra venstre mod højre. */
const UFO_LYSPRIKKER: [number, number, string][] = [
  [26, 64, "#ef4444"],
  [42, 70, "#f97316"],
  [58, 73, "#facc15"],
  [75, 74, "#22c55e"],
  [92, 73, "#38bdf8"],
  [108, 70, "#6366f1"],
  [124, 64, "#c084fc"],
];

/** Lysene: en mat fatning og et klart lys, der blinker med forsinkelsen `d(i)`. */
const ufoLys = (d: (i: number) => string, varighed?: string) =>
  UFO_LYSPRIKKER.map(([x, y, farve], i) => (
    <g key={farve}>
      <circle cx={x} cy={y} r="4.4" fill={UFO_DYB} />
      <g className="zoo-fx-sparkle" style={{ ...fx(d(i)), ...(varighed ? { animationDuration: varighed } : {}) }}>
        <circle cx={x} cy={y} r="7" fill={farve} opacity="0.35" />
        <circle cx={x} cy={y} r="4.4" fill={farve} />
        <circle cx={x - 1.4} cy={y - 1.4} r="1.4" fill="#fff" />
      </g>
    </g>
  ));

/** Kaptajnshat med skygge og guldstjerne; (x, y) er midt på hattens bund. */
const kaptajnHat = (x: number, y: number, s = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-13 0 C -13 -12, 13 -12, 13 0 Z" fill={KAPTAJN_HAT} />
    <path d="M-15 -12 C -10 -17, 10 -17, 15 -12 C 10 -9, -10 -9, -15 -12 Z" fill="#fff" />
    <rect x="-13" y="-4" width="26" height="4" rx="1.5" fill="#ffd84a" />
    <path d="M4 0 C 10 -1, 16 0, 19 3 C 13 4, 7 3, 2 2 Z" fill="#141c52" />
    {STJERNE(0, -11, 3.6, "#ffd84a")}
  </g>
);

/** Gyldent UFO-skrog (uden kuppel og lys). */
const ufoSkrog = (
  <>
    <rect x="46" y="76" width="7" height="12" rx="3.5" fill={UFO_MOERK} />
    <rect x="97" y="76" width="7" height="12" rx="3.5" fill={UFO_MOERK} />
    <circle cx="49.5" cy="87" r="3.4" fill={UFO_DYB} />
    <circle cx="100.5" cy="87" r="3.4" fill={UFO_DYB} />
    <path d="M20 62 C 30 84, 120 84, 130 62 Z" fill={UFO_MOERK} />
    <ellipse cx="75" cy="58" rx="67" ry="18" fill={UFO_GULD} />
    <ellipse cx="75" cy="52" rx="52" ry="9" fill={UFO_LYS} opacity="0.85" />
    <path d="M22 54 C 32 46, 48 42, 60 41" stroke={UFO_GLANS} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M38 56 C 60 62, 92 62, 114 56" stroke={UFO_MOERK} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />
  </>
);

/** Glaskuppel (tegnes over kaptajnen). */
const ufoKuppel = (
  <>
    <path d="M40 56 C 38 -2, 112 -4, 110 56 Z" fill="#c5f7ff" opacity="0.5" />
    <path d="M49 36 C 52 22, 64 14, 76 13" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
    <path d="M40 56 C 60 60, 90 60, 110 56" stroke={UFO_MOERK} strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

/** Usynlig høj boks, så zoo-fx-rise løfter konfettien et godt stykke op i strålen. */
const konfetti = (x: number, y: number, d: string, form: ReactNode) => (
  <g className="zoo-fx-rise" style={{ ...fx(d), animationDuration: "2.2s" }}>
    <rect x={x} y={y - 22} width="0.1" height="26" fill="none" />
    {form}
  </g>
);

const KONFETTI_FARVER = ["#ef4444", "#facc15", "#22c55e", "#38bdf8", "#c084fc", "#f97316"];

/** Gylden flyvende tallerken — står den stille, beamer kaptajnen ned og vinker. */
const goldenUfo: CreatureSpec = {
  name: "Den gyldne UFO",
  rarity: "legendary",
  height: 26.7,
  aspect: 150 / 150,
  gait: "float",
  pace: 0.95,
  zone: "open",
  viewBox: "0 0 150 150",
  art: (
    <>
      {/* Kaptajnen sidder i kuplen. */}
      <circle cx="77" cy="36" r="12" fill={KAPTAJN_GROEN} />
      {kaptajnHat(76, 29, 0.75)}
      {EYE(73, 35, 3)}
      {EYE(83, 35, 3)}
      <path d="M77 40 q 3.5 2.6 7 0" stroke="#2f8a3b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {ufoKuppel}
      {ufoSkrog}
      <circle cx="75" cy="83" r="4" fill={UFO_GLANS} />
      {ufoLys((i) => `${((i * 0.53) % 1.4).toFixed(2)}s`)}
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(40, 48, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(118, 50, 3.6, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.65s")}>{GLIMT(96, 16, 3.2)}</g>
    </>
  ),
  special: (
    <>
      {/* Lyskeglen fra lugen under tallerkenen. */}
      <path d="M66 82 L 84 82 L 114 146 L 36 146 Z" fill="#fff7c7" opacity="0.42" />
      <path d="M70 82 L 80 82 L 98 146 L 52 146 Z" fill="#fffbe8" opacity="0.5" />
      <ellipse cx="75" cy="145" rx="39" ry="4.5" fill="#fff7c7" opacity="0.9" />
      {ufoKuppel}
      {ufoSkrog}
      <ellipse cx="75" cy="82" rx="10" ry="3.2" fill={UFO_GLANS} />
      {/* Lysene løber rundt i forskudt takt. */}
      {ufoLys((i) => `${((UFO_LYSPRIKKER.length - i) * 0.14).toFixed(2)}s`, "1s")}
      {/* Konfetti og stjerner stiger op i strålen. */}
      {konfetti(60, 112, "0s", STJERNE(60, 112, 3.4, "#ffd84a"))}
      {konfetti(90, 120, "0.5s", <rect x="88" y="118" width="5" height="3" rx="1" transform="rotate(25 90 120)" fill={KONFETTI_FARVER[0]} />)}
      {konfetti(54, 132, "1.1s", <rect x="52" y="130" width="5" height="3" rx="1" transform="rotate(-30 54 132)" fill={KONFETTI_FARVER[3]} />)}
      {konfetti(96, 136, "1.6s", STJERNE(96, 136, 3, "#fff"))}
      {konfetti(68, 100, "0.8s", <rect x="66" y="98" width="5" height="3" rx="1" transform="rotate(40 68 100)" fill={KONFETTI_FARVER[2]} />)}
      {konfetti(84, 104, "1.9s", <rect x="82" y="102" width="5" height="3" rx="1" transform="rotate(-15 84 104)" fill={KONFETTI_FARVER[4]} />)}
      {konfetti(104, 126, "1.3s", <rect x="102" y="124" width="5" height="3" rx="1" transform="rotate(60 104 126)" fill={KONFETTI_FARVER[1]} />)}
      {/* Kaptajnen står i lyskeglen. */}
      <rect x="69" y="132" width="5" height="12" rx="2.5" fill="#56bd57" />
      <rect x="77" y="132" width="5" height="12" rx="2.5" fill={KAPTAJN_GROEN} />
      <ellipse cx="71" cy="144" rx="4.5" ry="2" fill="#1d1a17" />
      <ellipse cx="80" cy="144" rx="4.5" ry="2" fill="#1d1a17" />
      <path d="M68 124 C 64 128, 63 132, 64 135" stroke="#56bd57" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="75" cy="126" rx="10" ry="11" fill={KAPTAJN_JAKKE} />
      <path d="M75 116 V 136" stroke="#1a2466" strokeWidth="1.4" />
      <circle cx="78" cy="122" r="1.3" fill="#ffd84a" />
      <circle cx="78" cy="128" r="1.3" fill="#ffd84a" />
      <path d="M67 118 l 5 0 M78 118 l 5 0" stroke="#ffd84a" strokeWidth="2" strokeLinecap="round" />
      {/* Vinkende arm. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "0% 100%"), animationDuration: "0.5s" }}>
        <path d="M83 121 C 89 118, 94 112, 97 104" stroke={KAPTAJN_GROEN} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="97.5" cy="102" r="3.6" fill={KAPTAJN_GROEN} />
      </g>
      <circle cx="76" cy="105" r="11" fill={KAPTAJN_GROEN} />
      {kaptajnHat(75, 99, 0.75)}
      {EYE(73, 106, 2.8)}
      {EYE(82, 106, 2.8)}
      <path d="M75 111 q 4 4 9 0" stroke="#2f8a3b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="110" r="2.4" fill="#ff9fb8" opacity="0.6" />
      {/* Guldet glimter. */}
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(40, 48, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(118, 50, 3.6, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(112, 112, 4)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(38, 124, 3.4, "#fff6c2")}</g>
    </>
  ),
};

export const specialsThree: Record<string, CreatureSpec> = {
  starDragon,
  galaxyCat,
  goldenUfo,
};
