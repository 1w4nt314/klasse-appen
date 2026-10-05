import type { CSSProperties } from "react";
import { fx, GLIMT, NODE, STJERNE } from "../fx";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne dinoer med særlig opførsel (anden omgang). `art` er figuren, når
 * den går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/* ------------------------------------------------------------------------ */
/* Fælles hjælpere                                                          */
/* ------------------------------------------------------------------------ */

/** Afrunder til én decimal (beregnede koordinater). */
const rund = (v: number) => Math.round(v * 10) / 10;

/** fx() med egen varighed og evt. egen tidsfunktion. */
const fxv = (d: string, origin: string | undefined, varighed: string, tid?: string) =>
  ({ ...fx(d, origin), animationDuration: varighed, ...(tid ? { animationTimingFunction: tid } : {}) }) as CSSProperties;

/**
 * Usynlig ramme [x, y, bredde, højde]. Lagt i en fx-gruppe, som den omslutter
 * helt, ER den gruppens boks — så kan drejepunktet regnes præcist ud med `drej`,
 * også når det ligger langt uden for selve rammen (fx midten af en bane).
 */
type Ramme = readonly [number, number, number, number];

const ramme = ([x, y, b, h]: Ramme) => <rect x={x} y={y} width={b} height={h} fill="none" stroke="none" />;

/** Drejepunktet (px, py) udtrykt i procent af rammen. */
const drej = ([x, y, b, h]: Ramme, px: number, py: number) =>
  `${rund(((px - x) / b) * 100)}% ${rund(((py - y) / h) * 100)}%`;

/** Usynlig firkant centreret om (x, y): gruppens drejepunkt "50% 50%" bliver (x, y). */
const omkring = (x: number, y: number, rx: number, ry = rx) => ramme([x - rx, y - ry, 2 * rx, 2 * ry]);

/**
 * Usynlig boks over et element, der stiger op (zoo-fx-rise løfter 120 % af
 * gruppens højde): elementet med overkant `top` og højde `hoejde` ender ved `slut`.
 */
const loeft = (x: number, top: number, hoejde: number, slut: number) => {
  const h = rund((top - slut) / 1.2 - hoejde);
  return <rect x={x} y={rund(top - h)} width="1" height={h} fill="none" stroke="none" />;
};

/** Glimt eller stjerne, der funkler. */
const funkel = (x: number, y: number, r: number, d: string, slags: "stjerne" | "glimt", farve: string, varighed = "1.6s") => (
  <g className="zoo-fx-sparkle" style={fxv(d, undefined, varighed)}>
    {slags === "stjerne" ? STJERNE(x, y, r, farve) : GLIMT(x, y, r, farve)}
  </g>
);

/* ------------------------------------------------------------------------ */
/* Rutsjebane-langhalsen                                                    */
/* ------------------------------------------------------------------------ */

const B_KROP = "#4fb3a5";
const B_MOERK = "#3a9488";
const B_LYS = "#cdeee0";
const B_MUND = "#2c6d63";
const RING_ROED = "#ef5a4c";
const VAND = "#7cc8ee";
const VAND_LYS = "#a8dcf5";

/** Langhalsens hoved (som `brachiosaurus`), uden mund. */
const brachioHoved = (
  <>
    <ellipse cx="184" cy="42" rx="26" ry="17" fill={B_KROP} />
    <circle cx="170" cy="28" r="10" fill={B_KROP} />
    <path d="M168 50 C 182 58, 200 58, 208 48" stroke={B_LYS} strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="207" cy="36" r="2.4" fill={B_MUND} />
    <circle cx="190" cy="50" r="4.5" fill="#ffc2b0" opacity="0.7" />
    {EYE(190, 38, 4.8)}
  </>
);

/** Rød-hvid badering som en ellipse-bue (øverste eller nederste halvdel). */
const ringBue = (cx: number, cy: number, rx: number, ry: number, halvdel: "bag" | "for") => {
  const d =
    halvdel === "bag"
      ? `M${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`
      : `M${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
  return (
    <>
      <path d={d} stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d={d} stroke={RING_ROED} strokeWidth="8" fill="none" strokeDasharray="9 9" />
    </>
  );
};

/** Halsens bue: midtpunkt C, ydre radius (rutsjebanen) og indre radius. */
const BC = { x: 172, y: 254 };
const B_R = 92;
const B_RI = 56;

/** Punkt på buen om C; vinkel i grader fra lodret op, med uret. */
const paaBue = (r: number, grader: number) => {
  const v = (grader * Math.PI) / 180;
  return `${rund(BC.x + r * Math.sin(v))} ${rund(BC.y - r * Math.cos(v))}`;
};

const BUE_FRA = -62;
const BUE_TIL = 116;

type UngeFarver = { krop: string; mave: string; moerk: string };

const GROEN_UNGE: UngeFarver = { krop: "#7cc36a", mave: "#d6efa6", moerk: "#4f9a45" };
const ORANGE_UNGE: UngeFarver = { krop: "#f5a742", mave: "#fde3b0", moerk: "#d2781f" };

/** Lille T. rex-unge, der sidder og rutsjer: sædet i (0, 0), benene frem, armene i vejret. */
const rutsjeUnge = (f: UngeFarver) => (
  <>
    {/* Halen slæber efter på rutsjebanen. */}
    <path d="M-4 -3 C -14 -6, -24 -4, -32 0 C -24 4, -12 4, 0 2 Z" fill={f.krop} />
    <path d="M5 -17 L 14 -27" stroke={f.moerk} strokeWidth="3.4" strokeLinecap="round" />
    <ellipse cx="0" cy="-11" rx="11" ry="11.5" fill={f.krop} />
    <ellipse cx="4" cy="-8" rx="6" ry="7.5" fill={f.mave} />
    {/* Benene strakt frem. */}
    <path d="M4 -4 H 16" stroke={f.moerk} strokeWidth="8" strokeLinecap="round" />
    <ellipse cx="20" cy="-6" rx="3.2" ry="4.6" fill={f.moerk} />
    {/* Hoved med stort, glad gab. */}
    <ellipse cx="3" cy="-29" rx="11.5" ry="10.5" fill={f.krop} />
    <ellipse cx="12" cy="-26" rx="9" ry="7" fill={f.krop} />
    <path d="M6 -24 Q 14 -15 21 -25 Z" fill="#7a3a2a" />
    <path d="M10 -20 Q 14 -18 17 -21" stroke="#ff8f8f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <circle cx="0" cy="-23" r="2.8" fill="#f4a6a0" opacity="0.65" />
    {EYE(5, -32, 3.2)}
    {/* Armene i vejret: wheee! */}
    <path d="M8 -14 L 20 -20" stroke={f.moerk} strokeWidth="3.6" strokeLinecap="round" />
  </>
);

/** Rammen om ungen, når den sidder øverst på buen (sæde i (BC.x, BC.y - B_R), skaleret 1.2). */
const UNGE_RAMME: Ramme = [128, 106, 84, 150];

/**
 * En unge, der kører rundt om buens midte (zoo-fx-spin). Klippet skjuler den
 * under vandet og bag ryggen, så det ses som: kravler op ad ryggen, venter på
 * toppen, suser ned ad halsen og plasker i dammen. ease-in-out: den bliver
 * hængende på toppen og får fart på ned ad banen.
 */
const rutsjer = (f: UngeFarver, d: string) => (
  <g className="zoo-fx-spin" style={fxv(d, drej(UNGE_RAMME, BC.x, BC.y), "4s", "ease-in-out")}>
    {ramme(UNGE_RAMME)}
    <g transform={`translate(${BC.x} ${BC.y - B_R}) scale(1.2)`}>{rutsjeUnge(f)}</g>
  </g>
);

/** Langhals med badering om halsen — står den stille, bliver halsen til en rutsjebane. */
const slideBrachio: CreatureSpec = {
  name: "Rutsjebane-langhalsen",
  rarity: "rare",
  height: 36,
  // Som `brachiosaurus` (226 × 300), men bredere, så rutsjebanen og dammen kan være der.
  aspect: 340 / 300,
  gait: "walk",
  pace: 0.5,
  viewBox: "0 0 340 300",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="126" y="226" width="26" height="74" rx="12" fill={B_MOERK} />
        <ellipse cx="139" cy="295" rx="16" ry="5" fill={B_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="236" width="26" height="64" rx="12" fill={B_MOERK} />
        <ellipse cx="51" cy="295" rx="16" ry="5" fill={B_LYS} />
      </g>
      <g className="zoo-torso">
        <path d="M30 208 C 16 212, 8 226, 4 244 C 18 240, 32 238, 42 238 Z" fill={B_KROP} />
        <ellipse cx="98" cy="220" rx="76" ry="42" fill={B_KROP} />
        <path d="M32 238 C 56 268, 130 270, 164 238 C 134 254, 62 254, 32 238 Z" fill={B_LYS} />
        <g fill={B_MOERK}>
          <circle cx="58" cy="196" r="6" /><circle cx="82" cy="188" r="6" /><circle cx="106" cy="190" r="6" />
          <circle cx="70" cy="212" r="5" /><circle cx="94" cy="206" r="5" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="140" y="226" width="28" height="74" rx="12" fill={B_KROP} />
        <ellipse cx="154" cy="295" rx="17" ry="5" fill={B_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="236" width="28" height="64" rx="12" fill={B_KROP} />
        <ellipse cx="66" cy="295" rx="17" ry="5" fill={B_LYS} />
      </g>
      <g className="zoo-head">
        {/* Baderingen om halsen: bagerste halvdel bag halsen, forreste foran. */}
        <g transform="rotate(-8 157 128)">{ringBue(157, 128, 32, 9, "bag")}</g>
        <path d="M112 208 C 130 164, 134 110, 142 62 C 148 46, 170 46, 176 62 C 182 112, 184 174, 172 246 Z" fill={B_KROP} />
        <path d="M166 76 C 170 116, 170 168, 162 222" stroke={B_LYS} strokeWidth="9" fill="none" strokeLinecap="round" />
        <g transform="rotate(-8 157 128)">{ringBue(157, 128, 32, 9, "for")}</g>
        {brachioHoved}
        <path d="M198 50 Q 204 56 210 46" stroke={B_MUND} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Stjerner og glimt på himlen. */}
      {funkel(52, 92, 9, "0s", "stjerne", "#ffd84a")}
      {funkel(118, 58, 6, "0.6s", "stjerne", "#ff9fc8")}
      {funkel(246, 92, 8, "1.1s", "stjerne", "#ffd84a")}
      {funkel(300, 150, 6, "0.3s", "glimt", "#fff")}
      {funkel(196, 40, 5, "0.9s", "glimt", "#fff")}
      {funkel(24, 150, 5, "1.3s", "glimt", "#fff3a8")}
      {/* Fjerne ben og halen. */}
      <rect x="126" y="226" width="26" height="74" rx="12" fill={B_MOERK} />
      <ellipse cx="139" cy="295" rx="16" ry="5" fill={B_LYS} />
      <rect x="38" y="236" width="26" height="64" rx="12" fill={B_MOERK} />
      <ellipse cx="51" cy="295" rx="16" ry="5" fill={B_LYS} />
      <path d="M30 208 C 16 212, 8 226, 4 244 C 18 240, 32 238, 42 238 Z" fill={B_KROP} />
      {/* Halsen bøjer i en stor bue ned i dammen: oversiden er rutsjebanen. */}
      <path
        d={`M${paaBue(B_R, BUE_FRA)} A ${B_R} ${B_R} 0 0 1 ${paaBue(B_R, BUE_TIL)} L ${paaBue(B_RI, BUE_TIL)} A ${B_RI} ${B_RI} 0 0 0 ${paaBue(B_RI, BUE_FRA)} Z`}
        fill={B_KROP}
      />
      <path d={`M${paaBue(B_RI + 6, -20)} A ${B_RI + 6} ${B_RI + 6} 0 0 1 ${paaBue(B_RI + 6, 104)}`} stroke={B_LYS} strokeWidth="8" fill="none" strokeLinecap="round" />
      <g fill={B_MOERK}>
        {[-6, 24, 54].map((v) => {
          const [x, y] = paaBue(B_R - 16, v).split(" ");
          return <circle key={v} cx={x} cy={y} r="5" />;
        })}
      </g>
      {/* Baderingens bagerste halvdel flyder bag hovedet. */}
      {ringBue(303, 266, 22, 6, "bag")}
      {/* Hovedet titter op af vandet og nikker glad. */}
      <g className="zoo-fx-nod" style={fxv("0s", drej([276, 210, 60, 70], 304, 272), "1.1s")}>
        {ramme([276, 210, 60, 70])}
        <path d="M290 276 C 289 262, 291 252, 296 246 L 316 246 C 317 256, 317 266, 318 276 Z" fill={B_KROP} />
        <g transform="translate(122 198)">
          {brachioHoved}
          <path d="M194 48 Q 203 60 212 45 Z" fill={B_MUND} />
          <path d="M199 53 Q 204 55 208 51" stroke="#ff9aa0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* To unger på skift: grøn og orange, en halv omgang fra hinanden. */}
      <Klip form={<path d="M0 0 H340 V296 H210 V200 H0 Z" />}>
        {rutsjer(GROEN_UNGE, "0s")}
        {rutsjer(ORANGE_UNGE, "2s")}
      </Klip>
      {/* Kroppen foran (ungerne kravler op bag ryggen). */}
      <ellipse cx="98" cy="220" rx="76" ry="42" fill={B_KROP} />
      <path d="M32 238 C 56 268, 130 270, 164 238 C 134 254, 62 254, 32 238 Z" fill={B_LYS} />
      <g fill={B_MOERK}>
        <circle cx="58" cy="196" r="6" /><circle cx="82" cy="188" r="6" /><circle cx="106" cy="190" r="6" />
        <circle cx="70" cy="212" r="5" /><circle cx="94" cy="206" r="5" />
      </g>
      {/* Nære ben. */}
      <rect x="140" y="226" width="28" height="74" rx="12" fill={B_KROP} />
      <ellipse cx="154" cy="295" rx="17" ry="5" fill={B_LYS} />
      <rect x="52" y="236" width="28" height="64" rx="12" fill={B_KROP} />
      <ellipse cx="66" cy="295" rx="17" ry="5" fill={B_LYS} />
      {/* Dammen foran. */}
      <ellipse cx="276" cy="282" rx="62" ry="16" fill={VAND} />
      <ellipse cx="282" cy="281" rx="46" ry="9" fill={VAND_LYS} />
      <path d="M232 284 q 8 -4 16 0 M300 290 q 8 -4 16 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
      {ringBue(303, 266, 22, 6, "for")}
      {/* Plask, hver gang en unge rammer vandet. */}
      <g className="zoo-fx-sparkle" style={fxv("1.56s", "50% 100%", "2s")}>
        <circle cx="252" cy="256" r="3.4" fill={VAND_LYS} />
        <circle cx="258" cy="246" r="4" fill={VAND_LYS} />
        <circle cx="270" cy="244" r="3.4" fill={VAND_LYS} />
        <circle cx="280" cy="252" r="3" fill={VAND_LYS} />
        <path d="M248 266 q 18 -10 36 0" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {GLIMT(264, 236, 5)}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Xylofon-stegosaurussen                                                   */
/* ------------------------------------------------------------------------ */

const S_KROP = "#5fae5a";
const S_MOERK = "#4b9a4a";
const S_LYS = "#e6f0b5";
const S_MUND = "#2f6d33";
const S_PIG = "#f4ead0";

/** Ryggens højde (y) ved x på kroppens ellipse (cx 112, cy 82, rx 80, ry 40). */
const rygY = (x: number) => rund(82 - 40 * Math.sqrt(Math.max(0, 1 - ((x - 112) / 80) ** 2)));

/** Rygplade: spids rude med fod ned i ryggen (som `stegosaurus`). */
const plade = (x: number, w: number, h: number) => {
  const y = rygY(x);
  return `M${rund(x - w / 2)} ${rund(y + 8)} L ${x} ${rund(y - h)} L ${rund(x + w / 2)} ${rund(y + 8)} Z`;
};

/** Pladerne som xylofon-tangenter i regnbuens farver: [x, bredde, højde, farve, lys]. */
const TANGENTER: [number, number, number, string, string][] = [
  [64, 30, 26, "#e8574a", "#f6a198"],
  [88, 36, 38, "#f39a33", "#f9c98a"],
  [112, 38, 44, "#f5cf3f", "#fbe9a0"],
  [136, 36, 40, "#8ed24e", "#c9eca0"],
  [158, 32, 30, "#4b9be8", "#a3cdf5"],
  [178, 26, 20, "#a06ee0", "#d2b6f2"],
];

const regnbuePlader = (
  <>
    {TANGENTER.map(([x, w, h, farve, lys]) => (
      <g key={x}>
        <path d={plade(x, w, h)} fill={farve} stroke={farve} strokeWidth="3" strokeLinejoin="round" />
        <path d={`M${x} ${rund(rygY(x) - h * 0.6)} V ${rund(rygY(x) - 2)}`} stroke={lys} strokeWidth="4" strokeLinecap="round" />
      </g>
    ))}
  </>
);

/** Kroppen (som `stegosaurus`) uden hale og plader. */
const stegoKrop = (
  <>
    <ellipse cx="112" cy="82" rx="80" ry="40" fill={S_KROP} />
    <path d="M40 98 C 64 124, 150 126, 186 96 C 160 112, 66 112, 40 98 Z" fill={S_LYS} />
  </>
);

/** Hoved og hals (som `stegosaurus`), uden mund. */
const stegoHoved = (
  <>
    <path d="M172 78 C 190 82, 206 90, 218 104" stroke={S_KROP} strokeWidth="32" fill="none" strokeLinecap="round" />
    <ellipse cx="228" cy="108" rx="23" ry="15" fill={S_KROP} />
    <path d="M212 118 C 224 126, 240 126, 249 114" stroke={S_LYS} strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="246" cy="102" r="2.2" fill={S_MUND} />
    <circle cx="222" cy="116" r="4.5" fill="#ffc2b0" opacity="0.7" />
    {EYE(233, 101, 4.4)}
  </>
);

/** Kølle-grebet (halespidsen) og køllens kugle ved midterstillingen. */
const GREB = { x: 40, y: -40 };
const KUGLE = { x: 76.8, y: 9.1 };
const KOELLE_RAMME: Ramme = [30, -50, 60, 70];

/** Plade, der lyser op, når køllen rammer den. */
const pladeLys = (x: number, w: number, h: number, lys: string, d: string) => (
  <g className="zoo-fx-sparkle" style={fxv(d, undefined, "1.2s")}>
    <path d={plade(x, w, h)} fill={lys} stroke="#fffbe0" strokeWidth="5" strokeOpacity="0.8" strokeLinejoin="round" />
    {GLIMT(x + 10, rund(rygY(x) - h - 4), 5)}
  </g>
);

/** Node, der stiger op til toppen af viewBox. */
const stigendeNode = (x: number, y: number, farve: string, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "2.4s")}>
    {loeft(x, y - 12, 15, -60)}
    {NODE(x, y, farve, 1.1)}
  </g>
);

/** Stegosaurus med regnbueplader — står den stille, spiller den xylofon på dem med halen. */
const xyloStego: CreatureSpec = {
  name: "Xylofon-stegosaurussen",
  rarity: "rare",
  // Som `stegosaurus` (18 på 148 enheder), med plads over til halen og noderne.
  height: (18 * 212) / 148,
  aspect: 256 / 212,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 -64 256 212",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="150" y="100" width="22" height="48" rx="10" fill={S_MOERK} />
        <ellipse cx="161" cy="145" rx="11" ry="3.5" fill={S_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="58" y="96" width="26" height="52" rx="11" fill={S_MOERK} />
        <ellipse cx="71" cy="145" rx="13" ry="3.5" fill={S_LYS} />
      </g>
      <g className="zoo-torso">
        <g fill={S_PIG} stroke={S_PIG} strokeWidth="3" strokeLinejoin="round">
          <path d="M16 90 L 6 56 L 34 80 Z" />
          <path d="M36 82 L 32 44 L 56 72 Z" />
          <path d="M18 98 L 4 124 L 36 102 Z" />
          <path d="M38 100 L 30 126 L 56 100 Z" />
        </g>
        <path d="M54 64 C 36 66, 20 76, 10 92 C 24 100, 42 108, 62 108 Z" fill={S_KROP} />
        {regnbuePlader}
        {stegoKrop}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="160" y="100" width="24" height="48" rx="10" fill={S_KROP} />
        <ellipse cx="172" cy="145" rx="12" ry="3.5" fill={S_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="96" width="28" height="52" rx="11" fill={S_KROP} />
        <ellipse cx="84" cy="145" rx="14" ry="3.5" fill={S_LYS} />
      </g>
      <g className="zoo-head">
        {stegoHoved}
        <path d="M247 112 Q 238 120 226 117" stroke={S_MUND} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Noder i tangenternes farver stiger op. */}
      {stigendeNode(104, -12, "#e8574a", "0s")}
      {stigendeNode(134, -4, "#f39a33", "0.6s")}
      {stigendeNode(160, 6, "#4b9be8", "1.2s")}
      {stigendeNode(118, 2, "#a06ee0", "1.8s")}
      {/* Fjerne ben. */}
      <rect x="150" y="100" width="22" height="48" rx="10" fill={S_MOERK} />
      <ellipse cx="161" cy="145" rx="11" ry="3.5" fill={S_LYS} />
      <rect x="58" y="96" width="26" height="52" rx="11" fill={S_MOERK} />
      <ellipse cx="71" cy="145" rx="13" ry="3.5" fill={S_LYS} />
      {/* Halen er løftet højt op bag ryggen, med pigge og en lille sløjfe om køllen. */}
      <g fill={S_PIG} stroke={S_PIG} strokeWidth="3" strokeLinejoin="round">
        <path d="M8 58 L 2 44 L 14 46 Z" />
        <path d="M12 26 L 3 14 L 18 16 Z" />
        <path d="M22 4 L 16 -10 L 30 -4 Z" />
      </g>
      <path
        d="M58 104 C 30 104, 10 88, 6 62 C 2 36, 10 6, 26 -18 C 30 -26, 34 -34, 38 -42 Q 44 -48, 46 -38 C 40 -26, 32 -8, 28 14 C 24 36, 28 58, 40 70 C 46 76, 52 76, 60 74 Z"
        fill={S_KROP}
      />
      {regnbuePlader}
      {/* De to plader, køllen rammer, lyser op på skift. */}
      {pladeLys(88, 36, 38, "#f9c98a", "0.6s")}
      {pladeLys(64, 30, 26, "#f6a198", "0s")}
      {stegoKrop}
      {/* Køllen svinger frem og tilbage mellem de to bageste plader (ding-dong). */}
      <g className="zoo-fx-wave" style={fxv("0s", drej(KOELLE_RAMME, GREB.x, GREB.y), "0.6s")}>
        {ramme(KOELLE_RAMME)}
        <path d={`M${GREB.x} ${GREB.y} L ${KUGLE.x} ${KUGLE.y}`} stroke="#b07a46" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx={KUGLE.x} cy={KUGLE.y} r="7" fill="#ff7ac8" />
        <circle cx={KUGLE.x + 2.4} cy={KUGLE.y - 2.4} r="2.2" fill="#ffd0ea" />
      </g>
      {/* Sløjfen holder køllen fast på halespidsen. */}
      <path d="M40 -40 L 32 -46 L 33 -35 Z M40 -40 L 48 -46 L 47 -35 Z" fill="#ff7ac8" stroke="#ff7ac8" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="40" cy="-40" r="2.6" fill="#d6457f" />
      {/* Nære ben. */}
      <rect x="160" y="100" width="24" height="48" rx="10" fill={S_KROP} />
      <ellipse cx="172" cy="145" rx="12" ry="3.5" fill={S_LYS} />
      <rect x="70" y="96" width="28" height="52" rx="11" fill={S_KROP} />
      <ellipse cx="84" cy="145" rx="14" ry="3.5" fill={S_LYS} />
      {/* Hovedet nikker i takt. */}
      <g className="zoo-fx-nod" style={fxv("0s", drej([150, 60, 104, 70], 176, 86), "0.6s")}>
        {ramme([150, 60, 104, 70])}
        {stegoHoved}
        <path d="M248 112 Q 238 124 226 117 Z" fill={S_MUND} />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Golf-ankylosaurussen                                                     */
/* ------------------------------------------------------------------------ */

const A_KROP = "#b88a55";
const A_MOERK = "#8a5a2a";
const A_LYS = "#efe0b8";
const A_PANSER = "#d9b97c";
const A_PIG = "#f4ead0";
const A_MUND = "#6b4420";
const KASKET = "#3f7fd1";
const KASKET_SKYGGE = "#2f64ad";

/** Punkt på en ellipse (vinkel i grader, y vender nedad). */
const paaEllipse = (cx: number, cy: number, rx: number, ry: number, grader: number) => {
  const v = (grader * Math.PI) / 180;
  return { x: rund(cx + rx * Math.cos(v)), y: rund(cy + ry * Math.sin(v)) };
};

const panserYdre = Array.from({ length: 8 }, (_, i) => paaEllipse(120, 66, 72, 36, 200 + i * 20));
const panserInde = Array.from({ length: 5 }, (_, i) => paaEllipse(120, 70, 48, 20, 215 + i * 27.5));

/** Kroppen med panser (som `ankylosaurus`), uden hale og ben. */
const ankyloKrop = (
  <>
    <path d="M38 76 C 36 40, 78 26, 122 26 C 166 26, 202 42, 202 76 C 202 92, 180 100, 120 100 C 62 100, 40 92, 38 76 Z" fill={A_KROP} />
    <path d="M44 86 C 70 106, 160 106, 196 86 C 170 98, 70 98, 44 86 Z" fill={A_LYS} />
    <path d="M46 70 C 48 44, 82 32, 122 32 C 164 32, 196 46, 198 70 C 168 62, 76 62, 46 70 Z" fill={A_PANSER} />
    <g stroke="#a9763e" strokeWidth="4" fill="none" strokeLinecap="round">
      <path d="M84 36 C 88 46, 88 56, 84 64" />
      <path d="M122 32 C 126 44, 126 54, 122 64" />
      <path d="M160 36 C 164 46, 164 56, 160 64" />
    </g>
    <g fill={A_MOERK}>
      {panserYdre.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="6" />
      ))}
    </g>
    <g fill={A_PIG}>
      {panserInde.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.6" />
      ))}
    </g>
    <g fill={A_PIG} stroke={A_PIG} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M44 74 L 34 66 L 46 86 Z" />
      <path d="M196 74 L 206 66 L 194 86 Z" />
    </g>
  </>
);

/** Hovedet (som `ankylosaurus`) med golfkasket, uden mund. */
const ankyloHoved = (
  <>
    <path d="M188 60 L 182 44 L 202 56 Z" fill={A_PIG} stroke={A_PIG} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M188 62 C 196 52, 222 54, 232 66 C 240 76, 238 90, 226 94 C 210 98, 192 94, 188 84 Z" fill={A_KROP} />
    <path d="M226 68 C 236 74, 238 88, 228 94 C 222 96, 220 90, 220 84 Z" fill={A_PANSER} />
    <circle cx="206" cy="86" r="5" fill="#ffc2b0" opacity="0.7" />
    {EYE(210, 72, 4.2)}
    {/* Golfkasket med skygge frem over snuden. */}
    <path d="M194 60 C 194 42, 224 40, 228 58 Z" fill={KASKET} />
    <path d="M222 56 C 232 52, 242 54, 246 60 C 238 63, 228 62, 222 60 Z" fill={KASKET_SKYGGE} />
    <path d="M200 50 C 206 46, 214 45, 220 47" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <circle cx="211" cy="43" r="2.6" fill="#fff" />
  </>
);

/** Golfboldens bane: en bue fra tee'en over dinoen og ned i hullet ved flaget. */
const GOLF_C = { x: 158, y: 109 };
const BOLD_RAMME: Ramme = [33, 96, 14, 14];

/** Ankylosaurus med golfkasket — står den stille, slår den golf med halekøllen. */
const golfAnkylo: CreatureSpec = {
  name: "Golf-ankylosaurussen",
  rarity: "rare",
  // Som `ankylosaurus` (12 på 114 enheder), med plads til boldens bue og flaget.
  height: (12 * 130) / 114,
  aspect: 300 / 130,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 -16 300 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="158" y="82" width="26" height="32" rx="12" fill={A_MOERK} />
        <ellipse cx="171" cy="111" rx="12" ry="3.2" fill={A_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="64" y="82" width="26" height="32" rx="12" fill={A_MOERK} />
        <ellipse cx="77" cy="111" rx="12" ry="3.2" fill={A_LYS} />
      </g>
      <g className="zoo-torso">
        <path d="M50 62 C 40 64, 32 70, 26 74 C 32 82, 40 86, 52 90 Z" fill={A_KROP} />
        <ellipse cx="22" cy="74" rx="19" ry="17" fill={A_MOERK} />
        <g fill={A_PIG} stroke={A_PIG} strokeWidth="2.5" strokeLinejoin="round">
          <path d="M14 60 L 10 50 L 22 58 Z" />
          <path d="M8 66 L 3 62 L 6 76 Z" />
          <path d="M26 58 L 32 50 L 34 62 Z" />
        </g>
        {ankyloKrop}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="170" y="82" width="28" height="32" rx="12" fill={A_KROP} />
        <ellipse cx="184" cy="111" rx="13" ry="3.2" fill={A_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="76" y="82" width="28" height="32" rx="12" fill={A_KROP} />
        <ellipse cx="90" cy="111" rx="13" ry="3.2" fill={A_LYS} />
      </g>
      <g className="zoo-head">
        {ankyloHoved}
        <path d="M204 92 Q 218 98 232 88" stroke={A_MUND} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Boldens bane som en prikket bue fra tee'en til hullet. */}
      <path d="M40 103 A 118.15 118.15 0 1 1 276.3 103" stroke="#fff" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" fill="none" opacity="0.75" />
      {/* Golfbanen: en lille grøn med hul og flag foran dinoen. */}
      <ellipse cx="274" cy="110.6" rx="24" ry="3.4" fill="#8fd16a" />
      <ellipse cx="274" cy="111" rx="9" ry="2.6" fill="#3a2a22" />
      <path d="M281 111 V 50" stroke="#f4f4f4" strokeWidth="2.6" strokeLinecap="round" />
      <g className="zoo-fx-wave" style={fxv("0s", "0% 50%", "0.7s")}>
        <path d="M282 50 L 298 57 L 282 64 Z" fill="#e8574a" stroke="#e8574a" strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      {/* Tee'en, bolden bliver slået fra. */}
      <path d="M40 108 V 113 M36 108 H 44" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      {/* Fjerne ben. */}
      <rect x="158" y="82" width="26" height="32" rx="12" fill={A_MOERK} />
      <ellipse cx="171" cy="111" rx="12" ry="3.2" fill={A_LYS} />
      <rect x="64" y="82" width="26" height="32" rx="12" fill={A_MOERK} />
      <ellipse cx="77" cy="111" rx="12" ry="3.2" fill={A_LYS} />
      {/* Halekøllen svinger som en golfkølle om halens rod. */}
      <g className="zoo-fx-wave" style={fxv("0s", "50% 50%", "1.3s")}>
        {omkring(54, 76, 54, 28)}
        <path d="M58 62 C 44 66, 32 76, 24 84 C 30 94, 44 96, 60 92 Z" fill={A_KROP} />
        <ellipse cx="18" cy="89" rx="14" ry="12" fill={A_MOERK} />
        <g fill={A_PIG} stroke={A_PIG} strokeWidth="2.5" strokeLinejoin="round">
          <path d="M12 79 L 10 70 L 20 77 Z" />
          <path d="M24 78 L 30 70 L 31 81 Z" />
        </g>
      </g>
      {ankyloKrop}
      {/* Nære ben. */}
      <rect x="170" y="82" width="28" height="32" rx="12" fill={A_KROP} />
      <ellipse cx="184" cy="111" rx="13" ry="3.2" fill={A_LYS} />
      <rect x="76" y="82" width="28" height="32" rx="12" fill={A_KROP} />
      <ellipse cx="90" cy="111" rx="13" ry="3.2" fill={A_LYS} />
      {/* Hovedet med stort, glad smil — følger bolden med øjnene. */}
      {ankyloHoved}
      <path d="M204 90 Q 218 102 233 86 Z" fill={A_MUND} />
      {/* Bolden flyver i en bue og falder i hullet; under jorden er den klippet væk. */}
      <Klip form={<rect x="0" y="-16" width="300" height="125" />}>
        <g className="zoo-fx-spin" style={fxv("0s", drej(BOLD_RAMME, GOLF_C.x, GOLF_C.y), "2.6s")}>
          {ramme(BOLD_RAMME)}
          <circle cx="40" cy="103" r="6" fill="#fff" stroke="#c9c9c9" strokeWidth="0.8" />
          <circle cx="38" cy="101.4" r="1" fill="#d6d6d6" />
          <circle cx="41.8" cy="104.2" r="1" fill="#d6d6d6" />
          <circle cx="42" cy="100.6" r="1" fill="#d6d6d6" />
        </g>
      </Klip>
      {/* Stjerner ved slaget og når bolden lander i hullet. */}
      <g className="zoo-fx-sparkle" style={fxv("1.3s", undefined, "2.6s")}>
        {STJERNE(42, 88, 7, "#ffd84a")}
        {GLIMT(54, 98, 4.5)}
        {GLIMT(30, 104, 3.5, "#fff3a8")}
      </g>
      <g className="zoo-fx-sparkle" style={fxv("0s", undefined, "2.6s")}>
        {STJERNE(262, 92, 6, "#ffd84a")}
        {GLIMT(270, 100, 4)}
        {STJERNE(292, 100, 5, "#ff9fc8")}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Arkæolog-raptoren                                                        */
/* ------------------------------------------------------------------------ */

const R_KROP = "#9a78d0";
const R_MOERK = "#7d5cb8";
const R_LYS = "#e9ddf7";
const R_MUND = "#5a3d92";
const R_KLO = "#f4ead0";
const R_TURKIS = "#3fc1b5";
const R_PINK = "#f27aa8";
const HAT = "#e3cd94";
const HAT_SKYGGE = "#cdb373";
const HAT_BAAND = "#8f6a3a";
const KNOGLE = "#f8f1de";
const KNOGLE_KANT = "#cfb98c";
const JORD = "#c49a64";
const STOEV = "#fbf1dc";
const STOEV_KANT = "#dcc79c";

/** Lille fjer: smal dråbeform drejet om sin rod (som i creatures-1). */
const fjer = (x: number, y: number, vinkel: number, laengde: number, farve: string) => (
  <ellipse
    cx={rund(x + laengde / 2)}
    cy={y}
    rx={rund(laengde / 2)}
    ry={rund(laengde / 5)}
    fill={farve}
    transform={`rotate(${vinkel} ${x} ${y})`}
  />
);

/** Hale med fjerdusk (som `velociraptor`). */
const raptorHale = (
  <>
    <path d="M54 70 C 38 64, 22 58, 8 52 C 10 66, 30 84, 58 88 Z" fill={R_KROP} />
    {fjer(10, 52, 200, 18, R_TURKIS)}
    {fjer(10, 54, 170, 20, R_PINK)}
    {fjer(12, 56, 140, 18, R_TURKIS)}
  </>
);

/** Kroppen (som `velociraptor`), uden hældning — den lægges på udefra. */
const raptorKrop = (
  <>
    <ellipse cx="86" cy="72" rx="38" ry="22" fill={R_KROP} />
    <path d="M52 78 C 70 98, 108 98, 124 76 C 106 88, 70 88, 52 78 Z" fill={R_LYS} />
    <g stroke={R_MOERK} strokeWidth="4" fill="none" strokeLinecap="round">
      <path d="M68 54 q 4 8 0 14" />
      <path d="M84 52 q 4 8 0 14" />
      <path d="M100 54 q 4 8 0 14" />
    </g>
  </>
);

/** Hals og hoved (som `velociraptor`) med safarihat, uden mund. */
const raptorHoved = (
  <>
    <path d="M104 66 C 112 52, 120 44, 128 38 L 142 46 C 134 58, 126 68, 118 78 Z" fill={R_KROP} />
    {fjer(124, 26, 215, 16, R_PINK)}
    <path d="M120 30 C 124 18, 146 18, 158 28 C 166 34, 162 44, 152 46 C 140 50, 124 48, 120 38 Z" fill={R_KROP} />
    <path d="M130 46 C 140 52, 154 52, 160 44 C 152 48, 140 46, 130 46 Z" fill={R_LYS} />
    <circle cx="160" cy="32" r="1.8" fill={R_MUND} />
    <circle cx="140" cy="42" r="3.6" fill="#ffc2b0" opacity="0.7" />
    {EYE(142, 33, 4.4)}
    {/* Safarihat. */}
    <path d="M122 21 C 122 5, 156 5, 156 21 Z" fill={HAT} />
    <path d="M123 18 H 155" stroke={HAT_BAAND} strokeWidth="3.5" />
    <path d="M114 22 Q 139 15, 164 22 Q 139 27, 114 22 Z" fill={HAT_SKYGGE} />
    <circle cx="139" cy="7" r="2" fill={HAT_SKYGGE} />
  </>
);

/** Lille pensel: skaft fra (x, y) i retningen `vinkel` (grader), med hår yderst. */
const pensel = (x: number, y: number, vinkel: number) => (
  <g transform={`rotate(${vinkel} ${x} ${y})`}>
    <path d={`M${x} ${y} H ${x + 14}`} stroke="#c98a3c" strokeWidth="3.4" strokeLinecap="round" />
    <path d={`M${x + 14} ${y} H ${x + 18}`} stroke="#b9bccb" strokeWidth="4.4" />
    <path d={`M${x + 18} ${y - 2.8} Q ${x + 26} ${y - 3}, ${x + 28} ${y} Q ${x + 26} ${y + 3}, ${x + 18} ${y + 2.8} Z`} fill="#f2d48a" />
  </g>
);

/** Støvsky, der stiger op fra udgravningen. */
const stoevsky = (x: number, y: number, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "1.8s")}>
    {loeft(x, y - 6, 12, 8)}
    <g fill={STOEV} stroke={STOEV_KANT} strokeWidth="1">
      <circle cx={x - 4} cy={y} r="4.5" />
      <circle cx={x + 8} cy={y + 2} r="3.6" />
      <circle cx={x + 3} cy={y - 2} r="5.5" />
    </g>
  </g>
);

/** Velociraptor med safarihat og pensel — står den stille, graver den en dinoknogle frem. */
const diggerRaptor: CreatureSpec = {
  name: "Arkæolog-raptoren",
  rarity: "rare",
  height: 11,
  // Som `velociraptor` ("-12 0 182 128"), med plads til knoglen og støvet foran.
  aspect: 210 / 128,
  gait: "walk",
  pace: 1.4,
  viewBox: "-12 0 210 128",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M80 82 L 94 102" stroke={R_MOERK} strokeWidth="16" strokeLinecap="round" />
        <path d="M94 102 L 80 116" stroke={R_MOERK} strokeWidth="8" strokeLinecap="round" />
        <path d="M78 124 H 100" stroke={R_MOERK} strokeWidth="8" strokeLinecap="round" />
        <path d="M99 121 q 7 -1 8 -9" stroke={R_KLO} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {raptorHale}
        <g transform="rotate(-12 86 72)">{raptorKrop}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M94 84 L 110 104" stroke={R_KROP} strokeWidth="17" strokeLinecap="round" />
        <path d="M110 104 L 96 117" stroke={R_KROP} strokeWidth="8.5" strokeLinecap="round" />
        <path d="M92 124 H 116" stroke={R_KROP} strokeWidth="8.5" strokeLinecap="round" />
        <path d="M114 121 q 8 -1 9 -10" stroke={R_KLO} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </g>
      {/* Arm med fjer, der holder penslen. */}
      <g>
        {fjer(112, 72, 110, 20, R_PINK)}
        {fjer(112, 72, 80, 20, R_TURKIS)}
        {fjer(112, 72, 50, 18, R_PINK)}
        {pensel(118, 86, -50)}
        <path d="M110 68 L 124 80" stroke={R_MOERK} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        {raptorHoved}
        <path d="M160 40 Q 152 46 144 43" stroke={R_MUND} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Støvskyer stiger op fra hullet. */}
      {stoevsky(184, 116, "0s")}
      {stoevsky(176, 108, "0.6s")}
      {stoevsky(186, 100, "1.2s")}
      {/* Fjerne ben på hug. */}
      <path d="M80 100 L 100 106" stroke={R_MOERK} strokeWidth="15" strokeLinecap="round" />
      <path d="M100 106 L 84 120" stroke={R_MOERK} strokeWidth="8" strokeLinecap="round" />
      <path d="M78 124 H 100" stroke={R_MOERK} strokeWidth="8" strokeLinecap="round" />
      <path d="M99 121 q 7 -1 8 -9" stroke={R_KLO} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Hale og krop, sænket og lænet frem. */}
      <g transform="translate(0 18)">{raptorHale}</g>
      <g transform="translate(-2 20) rotate(2 86 72)">{raptorKrop}</g>
      {/* Nære ben på hug. */}
      <path d="M92 102 L 112 108" stroke={R_KROP} strokeWidth="17" strokeLinecap="round" />
      <path d="M112 108 L 98 120" stroke={R_KROP} strokeWidth="8.5" strokeLinecap="round" />
      <path d="M92 124 H 116" stroke={R_KROP} strokeWidth="8.5" strokeLinecap="round" />
      <path d="M114 121 q 8 -1 9 -10" stroke={R_KLO} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {/* Den store knogle stikker op af jorden. */}
      <path d="M146 124 L 170 80" stroke={KNOGLE_KANT} strokeWidth="14" strokeLinecap="round" />
      <circle cx="164.8" cy="77" r="9" fill={KNOGLE_KANT} />
      <circle cx="175.2" cy="83" r="9" fill={KNOGLE_KANT} />
      <path d="M146 124 L 170 80" stroke={KNOGLE} strokeWidth="11" strokeLinecap="round" />
      <circle cx="164.8" cy="77" r="7.5" fill={KNOGLE} />
      <circle cx="175.2" cy="83" r="7.5" fill={KNOGLE} />
      <path d="M152 112 L 164 90" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      {/* Jordbunken om knoglens fod. */}
      <ellipse cx="152" cy="122" rx="26" ry="5.5" fill={JORD} />
      <circle cx="140" cy="121" r="1.8" fill="#9c7448" />
      <circle cx="164" cy="122" r="1.6" fill="#9c7448" />
      {/* Knoglen funkler. */}
      {funkel(181, 66, 5.5, "0s", "glimt", "#fff")}
      {funkel(152, 84, 4, "0.7s", "glimt", "#fff3a8")}
      {funkel(180, 100, 4.5, "0.35s", "stjerne", "#ffd84a", "1.4s")}
      {/* Hovedet bøjet ned mod fundet — nikker begejstret. */}
      <g className="zoo-fx-nod" style={fxv("0s", drej([100, 0, 80, 100], 118, 92), "0.5s")}>
        {ramme([100, 0, 80, 100])}
        <g transform="translate(4 22) rotate(16 118 70)">
          {raptorHoved}
          <path d="M161 39 Q 154 50 143 44 Z" fill={R_MUND} />
        </g>
      </g>
      {/* Armen børster jorden væk med penslen. */}
      <g className="zoo-fx-wave" style={fxv("0s", "50% 50%", "0.35s")}>
        {omkring(114, 92, 40, 26)}
        {fjer(114, 92, 100, 16, R_PINK)}
        {fjer(114, 92, 70, 16, R_TURKIS)}
        {pensel(130, 104, 20)}
        <path d="M112 90 L 132 104" stroke={R_MOERK} strokeWidth="6" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const specialsTwo: Record<string, CreatureSpec> = {
  slideBrachio,
  xyloStego,
  golfAnkylo,
  diggerRaptor,
};
