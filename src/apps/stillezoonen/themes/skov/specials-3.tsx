import type { CSSProperties, ReactNode } from "react";
import { fx, GLIMT, NODE } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Legendariske skovvæsner fra danske folkeeventyr. `art` er figuren, når den
 * går/svæver; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Afrunder til 2 decimaler. */
const r2 = (v: number) => +v.toFixed(2);

/**
 * Noget, der stiger op (zoo-fx-rise) fra `top`/`bund` og når helt op til `loft`.
 * En usynlig streg over indholdet gør gruppens boks højere, så turen bliver
 * længere (rise flytter 120 % af boksens højde).
 */
const stiger = (x: number, top: number, bund: number, loft: number, d: string, varighed: string, indhold: ReactNode) => {
  const h = r2((top - loft) / 1.2 - (bund - top));
  return (
    <g className="zoo-fx-rise" style={{ ...fx(d, "50% 100%"), animationDuration: varighed } as CSSProperties}>
      <rect x={x} y={r2(top - h)} width="0.1" height={h} fill="none" stroke="none" />
      {indhold}
    </g>
  );
};

/** Lille femblads-blomst med gul midte. */
const blomst = (x: number, y: number, r: number, farve: string) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => {
      const v = ((-90 + i * 72) * Math.PI) / 180;
      return <circle key={i} cx={r2(x + Math.cos(v) * r * 0.85)} cy={r2(y + Math.sin(v) * r * 0.85)} r={r2(r * 0.62)} fill={farve} />;
    })}
    <circle cx={x} cy={y} r={r2(r * 0.48)} fill="#ffcf3a" />
  </>
);

/** Lille grønt blad. */
const blad = (x: number, y: number, vinkel: number) => (
  <ellipse cx={x} cy={y} rx="5" ry="2.4" transform={`rotate(${vinkel} ${x} ${y})`} fill="#5fb24a" />
);

/** Lille sommerfugl set forfra med kroppen i (x, y); `s` skalerer. */
const sommerfugl = (x: number, y: number, farve: string, prik: string, s = 1) => {
  const p = (dx: number, dy: number) => [r2(x + dx * s), r2(y + dy * s)] as const;
  const [vx, vy] = p(-4.4, -2.8);
  const [hx, hy] = p(4.4, -2.8);
  return (
    <>
      <ellipse cx={vx} cy={vy} rx={r2(4.6 * s)} ry={r2(3.6 * s)} transform={`rotate(-25 ${vx} ${vy})`} fill={farve} />
      <ellipse cx={hx} cy={hy} rx={r2(4.6 * s)} ry={r2(3.6 * s)} transform={`rotate(25 ${hx} ${hy})`} fill={farve} />
      <circle cx={p(-3, 2.8)[0]} cy={p(-3, 2.8)[1]} r={r2(2.7 * s)} fill={farve} />
      <circle cx={p(3, 2.8)[0]} cy={p(3, 2.8)[1]} r={r2(2.7 * s)} fill={farve} />
      <circle cx={p(-4.8, -3.2)[0]} cy={p(-4.8, -3.2)[1]} r={r2(1.3 * s)} fill={prik} />
      <circle cx={p(4.8, -3.2)[0]} cy={p(4.8, -3.2)[1]} r={r2(1.3 * s)} fill={prik} />
      <ellipse cx={x} cy={y} rx={r2(1.1 * s)} ry={r2(4.4 * s)} fill="#4a3a2a" />
    </>
  );
};

/** Lysprik med blødt skær. */
const lysprik = (x: number, y: number, r: number) => (
  <>
    <circle cx={x} cy={y} r={r2(r * 2.2)} fill="#fff4a8" opacity="0.5" />
    <circle cx={x} cy={y} r={r} fill="#fffbe0" />
  </>
);

/** Ildflue: gulgrønt lys med en lille mørk krop. */
const ildflue = (x: number, y: number) => (
  <>
    <circle cx={x} cy={y} r="6.5" fill="#f2ff7e" opacity="0.55" />
    <circle cx={x} cy={y} r="3" fill="#eeff5c" stroke="#8fae1c" strokeWidth="1" />
    <ellipse cx={x - 3} cy={y - 2.4} rx="2" ry="1.4" fill="#4a3a2a" />
  </>
);

/* ------------------------------------------------------------------------ */
/* Den gyldne hjort (legendarisk)                                           */
/* ------------------------------------------------------------------------ */

const HJ_GULD = "#e9b130";
const HJ_MOERK = "#c48a1c";
const HJ_LYS = "#f8d978";
const HJ_GLANS = "#fff3c4";
const HJ_HOV = "#7a5418";
const HJ_GEVIR = "#fff0b0";
const HJ_GEVIR_FJERN = "#e2b84c";

/** Det nære gevir: en stang, der buer op og frem, med fire sprosser. */
const GEVIR_NAER =
  "M190 42 C 198 20, 210 0, 226 -14 M194 32 L 212 27 M200 17 L 196 -6 M211 1 L 211 -22 M226 -14 L 238 -20 M226 -14 L 228 -27";
/** Det fjerne gevir: buer op og bagud. */
const GEVIR_FJERN =
  "M184 44 C 174 24, 160 6, 142 -8 M178 32 L 162 29 M167 15 L 162 -8 M154 3 L 146 -18 M142 -8 L 128 -12 M142 -8 L 135 -26";

/** Gevirspidserne, hvor der spirer blomster. */
const SPIDSER_NAER: [number, number][] = [
  [212, 27],
  [196, -6],
  [211, -22],
  [238, -20],
  [228, -27],
];
const SPIDSER_FJERN: [number, number][] = [
  [162, 29],
  [162, -8],
  [146, -18],
  [128, -12],
  [135, -26],
];

/** Hals, manke, hoved og gevir. `blomstrer` lader blomster og blade spire på geviret. */
const hjorteHoved = (blomstrer: boolean) => (
  <>
    {/* Det fjerne gevir bag hovedet. */}
    <path d={GEVIR_FJERN} stroke={HJ_GEVIR_FJERN} strokeWidth="7.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {blomstrer && (
      <>
        {blad(172, 20, -30)}
        {blad(152, -2, 40)}
        {blad(166, 6, -60)}
        {SPIDSER_FJERN.map(([x, y], i) => (
          <g key={`f${x}`}>{blomst(x, y, 4.6, i % 2 ? "#ffffff" : "#f7a6c6")}</g>
        ))}
      </>
    )}
    {/* Hals. */}
    <path d="M136 100 C 144 76, 158 58, 178 46 L 204 60 C 198 80, 190 102, 178 124 L 146 126 Z" fill={HJ_GULD} />
    {/* Manke under halsen. */}
    <path d="M200 72 C 196 86, 190 100, 184 116 C 180 112, 178 114, 176 120 C 173 114, 170 114, 167 118 C 171 98, 184 82, 200 72 Z" fill={HJ_MOERK} />
    <path d="M150 92 C 158 74, 168 62, 180 54" stroke={HJ_GLANS} strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Øret peger bagud. */}
    <ellipse cx="177" cy="50" rx="6" ry="12" transform="rotate(-55 177 50)" fill={HJ_MOERK} />
    <ellipse cx="177" cy="51" rx="3" ry="7.5" transform="rotate(-55 177 51)" fill="#f6c9a0" />
    {/* Hovedet. */}
    <path d="M180 46 C 188 38, 202 40, 210 48 C 216 56, 224 64, 228 72 C 230 80, 222 85, 214 83 C 204 81, 194 74, 186 66 C 180 60, 177 52, 180 46 Z" fill={HJ_GULD} />
    <ellipse cx="219" cy="77" rx="9" ry="7" fill={HJ_LYS} />
    <ellipse cx="226" cy="74" rx="3.4" ry="2.8" fill="#5a3b14" />
    <path d="M212 82 q 5 3 10 0" stroke="#8a5a1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <circle cx="206" cy="70" r="4" fill="#f5a37f" opacity="0.5" />
    {EYE(199, 58, 4)}
    {/* Det nære, skinnende gevir. */}
    <path d={GEVIR_NAER} stroke={HJ_GEVIR} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M192 34 C 197 20, 206 6, 218 -6" stroke="#fffbe8" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    {blomstrer && (
      <>
        {blad(205, 12, -50)}
        {blad(218, -6, 30)}
        {blad(193, 25, 60)}
        {blad(204, 4, 50)}
        {SPIDSER_NAER.map(([x, y], i) => (
          <g key={`n${x}`}>{blomst(x, y, 5.2, i % 2 ? "#f7a6c6" : "#ffffff")}</g>
        ))}
      </>
    )}
  </>
);

/** Ben: fjerne mørkere, nære lysere; hove nederst ved jorden (y 200). */
const hjorteBen = (x: number, y: number, w: number, fill: string) => (
  <>
    <rect x={x} y={y} width={w} height={200 - y} rx="5" fill={fill} />
    <rect x={x} y="190" width={w} height="10" rx="4" fill={HJ_HOV} />
  </>
);

/** Kroppen med guldglans. */
const hjorteKrop = (
  <>
    <ellipse cx="44" cy="104" rx="6" ry="9" transform="rotate(-20 44 104)" fill={HJ_MOERK} />
    <ellipse cx="106" cy="114" rx="68" ry="34" fill={HJ_GULD} />
    <ellipse cx="110" cy="134" rx="46" ry="9" fill={HJ_LYS} opacity="0.8" />
    <ellipse cx="48" cy="112" rx="9" ry="15" fill={HJ_GLANS} />
    <path d="M62 92 C 88 82, 124 80, 152 90" stroke={HJ_GLANS} strokeWidth="5" fill="none" strokeLinecap="round" />
  </>
);

/** Skinnende guldhjort med stort gevir — står den stille, løfter den hovedet, og geviret blomstrer. */
const goldenStag: CreatureSpec = {
  name: "Den gyldne hjort",
  rarity: "legendary",
  height: 34.4,
  aspect: 216 / 250,
  gait: "walk",
  pace: 0.8,
  viewBox: "28 -50 216 250",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{hjorteBen(146, 116, 12, HJ_MOERK)}</g>
      <g className="zoo-leg zoo-leg-b">{hjorteBen(52, 116, 12, HJ_MOERK)}</g>
      <g className="zoo-torso">
        {hjorteKrop}
        <g className="zoo-fx-sparkle">{GLIMT(92, 104, 5)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.8s")}>{GLIMT(130, 126, 3.6, HJ_GLANS)}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">{hjorteBen(162, 118, 13, HJ_GULD)}</g>
      <g className="zoo-leg zoo-leg-a">{hjorteBen(66, 118, 13, HJ_GULD)}</g>
      <g className="zoo-head">
        {hjorteHoved(false)}
        <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(220, -30, 4.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(152, -24, 3.6, HJ_GLANS)}</g>
      </g>
    </>
  ),
  special: (
    <>
      {hjorteBen(146, 116, 12, HJ_MOERK)}
      {hjorteBen(52, 116, 12, HJ_MOERK)}
      {hjorteKrop}
      {hjorteBen(162, 118, 13, HJ_GULD)}
      {hjorteBen(66, 118, 13, HJ_GULD)}
      {/* Hovedet løftet stolt; det nikker roligt, mens geviret blomstrer. */}
      <g className="zoo-fx-nod" style={{ ...fx("0s", "30% 100%"), animationDuration: "2s" }}>
        <g transform="rotate(-7 150 122)">
          {/* Et magisk skær bag geviret pulserer. */}
          <g className="zoo-fx-sparkle" style={{ ...fx("0s"), animationDuration: "2.4s" }}>
            <ellipse cx="184" cy="-2" rx="50" ry="34" fill="#fff6b0" opacity="0.55" />
          </g>
          {hjorteHoved(true)}
        </g>
      </g>
      <g className="zoo-fx-sparkle" style={fx("0.2s")}>{GLIMT(92, 104, 5)}</g>
      {/* Sommerfugle og lysprikker svæver op fra geviret. */}
      {stiger(196, 12, 31, -42, "0s", "3.2s", sommerfugl(196, 22, "#f472b6", "#fff", 1.6))}
      {stiger(132, 16, 35, -42, "1.1s", "3.2s", sommerfugl(132, 26, "#8b6cf0", "#fff4b0", 1.6))}
      {stiger(226, 28, 47, -42, "2.2s", "3.2s", sommerfugl(226, 38, "#38a8e8", "#fff", 1.6))}
      {stiger(178, 20, 32, -42, "0.6s", "2.8s", lysprik(178, 26, 2.6))}
      {stiger(112, 28, 40, -42, "1.6s", "2.8s", lysprik(112, 34, 2.6))}
      {stiger(204, 32, 44, -42, "2.4s", "2.8s", lysprik(204, 38, 2.6))}
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(186, -30, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(120, -16, 3.6, HJ_GLANS)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Lygtemanden (legendarisk)                                                */
/* ------------------------------------------------------------------------ */

const LY_KROP = "#eaf75a";
const LY_KERNE = "#fbffd6";
const LY_KANT = "#8fae1c";
const LY_SKAER = "#f2ff7e";

/** Lygtemandens krop: rund med en lille flamme i toppen og en lysstribe bagud. */
const lygteForm = (
  <>
    <path d="M44 76 C 40 88, 32 94, 22 96 C 34 102, 50 96, 58 84 Z" />
    <path d="M37 60 C 33 46, 34 34, 40 22 C 43 30, 47 35, 51 38 C 50 28, 54 16, 63 6 C 63 18, 67 27, 72 32 C 74 26, 78 22, 84 20 C 86 32, 86 46, 83 60 Z" />
    <circle cx="60" cy="62" r="24" />
  </>
);

/** Krop med mørkere kant (for kontrasten mod den lyse skov) og lys kerne. */
const lygteKrop = (
  <>
    <g fill={LY_KANT} stroke={LY_KANT} strokeWidth="5" strokeLinejoin="round">
      {lygteForm}
    </g>
    <g fill={LY_KROP}>{lygteForm}</g>
    <ellipse cx="68" cy="62" rx="17" ry="15" fill={LY_KERNE} />
    <path d="M58 18 C 57 26, 58 32, 60 36" stroke={LY_KERNE} strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

/** Ansigtet; `glad` giver en åben, glad mund. */
const lygteAnsigt = (glad: boolean) => (
  <>
    {EYE(63, 58, 3.4)}
    {EYE(75, 57, 3.2)}
    <circle cx="58" cy="67" r="3.2" fill="#ffb09a" opacity="0.75" />
    <circle cx="80" cy="65" r="2.8" fill="#ffb09a" opacity="0.75" />
    {glad ? (
      <path d="M64 66 Q 70 75 77 65 Z" fill="#7a3a2a" />
    ) : (
      <path d="M64 67 Q 70 72 76 66" stroke="#5a3a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
    )}
  </>
);

/** Små arme; den bagerste stikker frem bag kroppen. */
const LY_ARM = { stroke: LY_KROP, strokeWidth: 6, fill: "none", strokeLinecap: "round" } as const;
const lygteArmBag = (
  <>
    <path d="M38 66 L 32 72" {...LY_ARM} stroke={LY_KANT} strokeWidth={10} />
    <path d="M38 66 L 32 72" {...LY_ARM} />
  </>
);

/** Glorien: et fast skær og et skær, der pulserer. */
const lygteGlorie = (
  <>
    <g className="zoo-fx-sparkle" style={{ ...fx("0s"), animationDuration: "2.2s" }}>
      <circle cx="58" cy="58" r="40" fill={LY_SKAER} opacity="0.45" />
    </g>
    <circle cx="58" cy="58" r="32" fill={LY_SKAER} opacity="0.4" />
  </>
);

/** Lysekuglerne, lygtemanden tænder rundt om sig. */
const KUGLER = [-160, -120, -80, -20, 20, 60, 110, 150].map((g) => {
  const v = (g * Math.PI) / 180;
  return { g, x: r2(60 + Math.cos(v) * 47), y: r2(60 + Math.sin(v) * 45) };
});

/** Lille svævende lygtemand — står den stille, tænder den lyskugler én efter én og vinker. */
const lygtemand: CreatureSpec = {
  name: "Lygtemanden",
  rarity: "legendary",
  height: 7,
  aspect: 120 / 120,
  gait: "float",
  zone: "open",
  pace: 0.9,
  viewBox: "0 0 120 120",
  art: (
    <>
      {lygteGlorie}
      {lygteArmBag}
      {lygteKrop}
      {/* Forreste arm. */}
      <path d="M82 66 L 89 72" {...LY_ARM} stroke={LY_KANT} strokeWidth={10} />
      <path d="M82 66 L 89 72" {...LY_ARM} />
      {lygteAnsigt(false)}
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(92, 34, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(24, 50, 3.6, "#fffbd0")}</g>
    </>
  ),
  special: (
    <>
      {lygteGlorie}
      {/* Lyskuglerne tændes én efter én hele vejen rundt. */}
      {KUGLER.map(({ g, x, y }, i) => (
        <g key={g}>
          <circle cx={x} cy={y} r="4" fill="none" stroke={LY_KANT} strokeWidth="1.4" opacity="0.6" />
          <g className="zoo-fx-sparkle" style={{ ...fx(`${r2(2.4 - i * 0.3)}s`), animationDuration: "2.4s" }}>
            <circle cx={x} cy={y} r="8" fill={LY_SKAER} opacity="0.7" />
            <circle cx={x} cy={y} r="4.6" fill="#f6ff8a" stroke={LY_KANT} strokeWidth="1.4" />
            <circle cx={r2(x - 1.4)} cy={r2(y - 1.4)} r="1.4" fill="#fff" />
          </g>
        </g>
      ))}
      {lygteArmBag}
      {lygteKrop}
      {lygteAnsigt(true)}
      {/* Den forreste arm vinker. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "30% 100%"), animationDuration: "0.6s" }}>
        <path d="M80 56 L 88 44" {...LY_ARM} stroke={LY_KANT} strokeWidth={10} />
        <path d="M80 56 L 88 44" {...LY_ARM} />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Skovnissen (legendarisk)                                                 */
/* ------------------------------------------------------------------------ */

const NI_HUE = "#d8322e";
const NI_HUE_MOERK = "#a92420";
const NI_KOFTE = "#8f8a82";
const NI_KOFTE_MOERK = "#76716a";
const NI_BUKS = "#7a5638";
const NI_BUKS_MOERK = "#5e4330";
const NI_HUD = "#f6cfae";
const NI_SKAEG = "#fbfaf6";
const NI_TRAE = "#dca866";
const NI_TRAE_MOERK = "#a8743a";

/** Træsko; hælen i (x, y-10), bunden i y. */
const traesko = (x: number, y: number, fill: string) => (
  <path
    d={`M${x} ${y} V ${y - 6} C ${x} ${y - 10}, ${x + 6} ${y - 11}, ${x + 12} ${y - 10} C ${x + 18} ${y - 9}, ${x + 22} ${y - 10}, ${x + 26} ${y - 13} C ${x + 28} ${y - 10}, ${x + 27} ${y - 3}, ${x + 24} ${y} Z`}
    fill={fill}
  />
);

/** Lanterne; hanken i (x, y). `skaer` er radius på det pulserende lysskær (0 = intet). */
const lanterne = (x: number, y: number, skaer: number) => (
  <>
    {skaer > 0 && (
      <g className="zoo-fx-sparkle" style={{ ...fx("0s"), animationDuration: "2s" }}>
        <circle cx={x} cy={y + 15} r={skaer} fill="#ffe680" opacity="0.6" />
      </g>
    )}
    <path d={`M${x - 4} ${y + 5} Q ${x} ${y - 2} ${x + 4} ${y + 5}`} stroke="#3d3a36" strokeWidth="1.6" fill="none" />
    <path d={`M${x - 5} ${y + 5} H ${x + 5} L ${x + 7} ${y + 8} H ${x - 7} Z`} fill="#3d3a36" />
    <rect x={x - 6.5} y={y + 8} width="13" height="16" rx="1.5" fill="#3d3a36" />
    <rect x={x - 4.5} y={y + 10} width="9" height="12" rx="1" fill="#ffd75a" />
    <ellipse cx={x} cy={y + 17} rx="1.8" ry="3.2" fill="#fff6c8" />
    <rect x={x - 7.5} y={y + 23} width="15" height="3" rx="1" fill="#3d3a36" />
  </>
);

/** Hoved med hue, skæg og næse; centrum af ansigtet i (70, 64). */
const nisseHoved = (
  <>
    {/* Huen: en høj, rød top, der hælder bagud. */}
    <path d="M53 60 C 51 40, 46 20, 38 2 C 56 14, 76 32, 89 54 Z" fill={NI_HUE} />
    <path d="M44 14 C 50 22, 54 32, 56 44" stroke="#e8584f" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="70" cy="64" r="14" fill={NI_HUD} />
    {/* Skægget. */}
    <path d="M57 62 C 55 82, 62 100, 76 114 C 80 102, 88 86, 86 68 C 80 74, 64 72, 57 62 Z" fill={NI_SKAEG} />
    <path d="M68 82 C 70 92, 72 100, 75 106 M78 80 C 79 88, 80 94, 80 100" stroke="#e2ded4" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <ellipse cx="80" cy="70" rx="8" ry="4.4" fill={NI_SKAEG} />
    {/* Hueskanten og øjenbrynet. */}
    <path d="M53 60 L 89 54" stroke={NI_HUE_MOERK} strokeWidth="6" strokeLinecap="round" />
    <path d="M72 55 q 5 -3 10 0" stroke={NI_SKAEG} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <circle cx="74" cy="66" r="3.4" fill="#f4a0a0" opacity="0.6" />
    <circle cx="86" cy="64" r="5" fill="#ef9f88" />
    {EYE(78, 60, 2.8)}
  </>
);

/** Lille skovnisse med lanterne — står den stille, sætter den sig på en fluesvamp og spiller fløjte. */
const skovnisse: CreatureSpec = {
  name: "Skovnissen",
  rarity: "legendary",
  height: 8.1,
  aspect: 140 / 174,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 -24 140 174",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="114" width="10" height="30" rx="4" fill={NI_BUKS_MOERK} />
        {traesko(49, 150, NI_TRAE_MOERK)}
      </g>
      <g className="zoo-torso">
        {/* Bagerste arm. */}
        <path d="M54 86 L 50 104" stroke={NI_KOFTE_MOERK} strokeWidth="9" strokeLinecap="round" />
        <circle cx="50" cy="107" r="4.4" fill={NI_HUD} />
        {/* Kofte med bælte. */}
        <path d="M44 120 C 42 100, 46 84, 56 78 L 82 78 C 90 84, 94 100, 92 120 Z" fill={NI_KOFTE} />
        <rect x="43" y="104" width="50" height="6" fill="#5a3a22" />
        <rect x="80" y="103" width="7" height="8" rx="1.5" fill="none" stroke="#e8c05a" strokeWidth="1.8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="68" y="114" width="10" height="30" rx="4" fill={NI_BUKS} />
        {traesko(65, 150, NI_TRAE)}
      </g>
      <g className="zoo-head">{nisseHoved}</g>
      <g className="zoo-torso">
        {/* Forreste arm holder lanternen frem. */}
        <path d="M78 86 L 98 92" stroke={NI_KOFTE} strokeWidth="9" strokeLinecap="round" />
        <circle cx="100" cy="93" r="4.6" fill={NI_HUD} />
        {lanterne(101, 95, 15)}
        <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(114, 100, 3.6, "#fff6c2")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Lanternen står på jorden og lyser. */}
      {lanterne(16, 124, 11)}
      {/* Fluesvampen. */}
      <path d="M48 150 C 50 138, 50 128, 52 120 L 70 120 C 72 128, 72 138, 74 150 Z" fill="#f4efe2" />
      <path d="M50 130 Q 61 136 72 130" stroke="#ddd5c2" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M22 122 C 22 104, 40 96, 60 96 C 80 96, 98 104, 98 122 C 82 127, 38 127, 22 122 Z" fill="#d8352a" />
      <circle cx="34" cy="112" r="3.4" fill="#fff" />
      <circle cx="48" cy="104" r="2.6" fill="#fff" />
      <circle cx="90" cy="114" r="3" fill="#fff" />
      <circle cx="40" cy="120" r="2.2" fill="#fff" />
      {/* Bagerste ben, bøjet. */}
      <path d="M64 96 L 82 98 L 84 118" stroke={NI_BUKS_MOERK} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {traesko(80, 128, NI_TRAE_MOERK)}
      {/* Kroppen, som sidder. */}
      <g transform="translate(-4 -16)">
        <path d="M54 86 L 50 104" stroke={NI_KOFTE_MOERK} strokeWidth="9" strokeLinecap="round" />
        <path d="M44 120 C 42 100, 46 84, 56 78 L 82 78 C 90 84, 94 100, 92 120 Z" fill={NI_KOFTE} />
        <rect x="43" y="104" width="50" height="6" fill="#5a3a22" />
        <rect x="80" y="103" width="7" height="8" rx="1.5" fill="none" stroke="#e8c05a" strokeWidth="1.8" />
      </g>
      {/* Forreste lår. */}
      <path d="M70 100 L 92 101" stroke={NI_BUKS} strokeWidth="11" strokeLinecap="round" />
      {/* Underbenet vipper i takt. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "20% 0%"), animationDuration: "0.5s" }}>
        <path d="M92 100 L 94 120" stroke={NI_BUKS} strokeWidth="10" strokeLinecap="round" />
        {traesko(90, 132, NI_TRAE)}
      </g>
      <g transform="translate(-4 -16)">{nisseHoved}</g>
      {/* Fløjten og armene, der holder den. */}
      <path d="M80 54 L 116 72" stroke="#9a6a3a" strokeWidth="4.4" strokeLinecap="round" />
      <circle cx="104" cy="66" r="1" fill="#4a2e18" />
      <circle cx="110" cy="69" r="1" fill="#4a2e18" />
      <path d="M68 70 C 76 76, 86 70, 92 62" stroke={NI_KOFTE} strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="93" cy="61" r="4.2" fill={NI_HUD} />
      <path d="M74 76 C 84 80, 94 76, 100 68" stroke={NI_KOFTE} strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="101" cy="66" r="4.2" fill={NI_HUD} />
      <ellipse cx="78" cy="54" rx="7" ry="4" fill={NI_SKAEG} />
      {/* Noder stiger op fra fløjten. */}
      {stiger(120, 50, 66, -20, "0s", "2.4s", NODE(120, 64, "#6b3a8a", 1))}
      {stiger(108, 40, 56, -20, "0.8s", "2.4s", NODE(108, 54, "#2f6b4a", 0.9))}
      {stiger(124, 28, 44, -20, "1.6s", "2.4s", NODE(124, 42, "#b03a2a", 0.9))}
      {/* Ildfluer danser omkring. */}
      {(
        [
          [28, 64, "0s"],
          [12, 90, "0.5s"],
          [40, 30, "0.9s"],
          [128, 96, "0.3s"],
          [20, 40, "1.2s"],
        ] as const
      ).map(([x, y, d]) => (
        <g key={`${x}-${y}`} className="zoo-fx-sparkle" style={fx(d)}>
          {ildflue(x, y)}
        </g>
      ))}
    </>
  ),
};

export const specialsThree: Record<string, CreatureSpec> = {
  goldenStag,
  lygtemand,
  skovnisse,
};
