import type { CSSProperties } from "react";
import { fx, GLIMT, HJERTE, NODE, STJERNE } from "../fx";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne skovdyr med særlig opførsel (anden omgang). `art` er figuren, når
 * den går/hopper; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/* ------------------------------------------------------------------------ */
/* Fælles hjælpere                                                          */
/* ------------------------------------------------------------------------ */

/** Afrunder til én decimal (beregnede koordinater). */
const rund = (v: number) => Math.round(v * 10) / 10;

/** fx() med egen varighed. */
const fxv = (d: string, origin: string | undefined, varighed: string) =>
  ({ ...fx(d, origin), animationDuration: varighed }) as CSSProperties;

/**
 * Usynlig ramme [x, y, bredde, højde]. Lagt i en fx-gruppe, som den omslutter
 * helt, ER den gruppens boks — så kan drejepunktet regnes præcist ud med `drej`.
 */
type Ramme = readonly [number, number, number, number];

const ramme = ([x, y, b, h]: Ramme) => <rect x={x} y={y} width={b} height={h} fill="none" stroke="none" />;

/** Drejepunktet (px, py) udtrykt i procent af rammen. */
const drej = ([x, y, b, h]: Ramme, px: number, py: number) =>
  `${rund(((px - x) / b) * 100)}% ${rund(((py - y) / h) * 100)}%`;

/**
 * Usynlig stribe over et element, der stiger op (zoo-fx-rise løfter 120 % af
 * gruppens højde): elementet med overkant `top` og højde `hoejde` ender ved `slut`.
 */
const loeft = (x: number, top: number, hoejde: number, slut: number) => {
  const h = rund((top - slut) / 1.2 - hoejde);
  return <rect x={x} y={rund(top - h)} width="0.1" height={h} fill="none" stroke="none" />;
};

/** Glimt eller stjerne, der funkler. */
const funkel = (x: number, y: number, r: number, d: string, slags: "stjerne" | "glimt", farve: string, varighed = "1.6s") => (
  <g className="zoo-fx-sparkle" style={fxv(d, undefined, varighed)}>
    {slags === "stjerne" ? STJERNE(x, y, r, farve) : GLIMT(x, y, r, farve)}
  </g>
);

/* ------------------------------------------------------------------------ */
/* Lærer-uglen                                                              */
/* ------------------------------------------------------------------------ */

const U_KROP = "#94653d";
const U_MOERK = "#7a4f31";
const U_LYS = "#ecd7b0";
const U_STREG = "#6b4429";
const U_FOD_FJERN = "#e0b258";
const U_FOD_NAER = "#f0c46c";
const BRILLE = "#2e2a33";
const PIND = "#c9924e";
const KRIDT = "#f6f4ea";
const TAVLE = "#2f5a46";
const STAFFELI = "#a5713f";
const STAFFELI_MOERK = "#7d5230";

/** Uglens hoved (som `tawnyOwl`) med runde briller. */
const ugleHoved = (
  <>
    <circle cx="66" cy="46" r="30" fill={U_KROP} />
    <path d="M44 28 C 50 20, 60 17, 68 18" stroke={U_STREG} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="52" cy="24" r="2.6" fill={U_LYS} />
    <circle cx="62" cy="19" r="2.4" fill={U_LYS} />
    {/* Lyst ansigtsslør. */}
    <ellipse cx="70" cy="48" rx="25" ry="21" fill="#f2e2c0" />
    <ellipse cx="70" cy="48" rx="25" ry="21" fill="none" stroke="#c99a68" strokeWidth="2.4" />
    {/* Kloge, løftede øjenbryn. */}
    <path d="M50 33 C 53 27, 61 26, 66 30 M78 30 C 82 26, 90 27, 93 33" stroke={U_STREG} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    {EYE(60, 47, 7.4)}
    {EYE(83, 47, 6.4)}
    {/* Runde briller med stang om bag øret. */}
    <path d="M49.5 45 L 40 40" stroke={BRILLE} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="60" cy="47" r="10.5" fill="#fff" fillOpacity="0.22" stroke={BRILLE} strokeWidth="2.6" />
    <circle cx="83" cy="47" r="9.2" fill="#fff" fillOpacity="0.22" stroke={BRILLE} strokeWidth="2.6" />
    <path d="M70.5 45.5 Q 72.2 42.5 73.8 45.5" stroke={BRILLE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <path d="M70 53 C 77 53, 82 58, 80 64 C 74 67, 68 63, 70 53 Z" fill="#e8b040" />
  </>
);

/** Krop og bryst (som `tawnyOwl`). */
const ugleKrop = (
  <>
    <ellipse cx="58" cy="84" rx="34" ry="38" fill={U_KROP} />
    <ellipse cx="64" cy="94" rx="22" ry="26" fill={U_LYS} />
    <path d="M56 80 V 88 M64 76 V 86 M72 80 V 90 M52 96 V 104 M60 94 V 104 M68 96 V 106 M76 98 V 106" stroke={U_KROP} strokeWidth="2.6" strokeLinecap="round" />
  </>
);

const ugleHale = <path d="M30 100 L 12 124 L 32 124 L 46 110 Z" fill={U_STREG} />;
const ugleFodFjern = <path d="M52 116 V 124 M46 127 H 58" stroke={U_FOD_FJERN} strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
const ugleFodNaer = <path d="M70 116 V 124 M64 127 H 76" stroke={U_FOD_NAER} strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />;

/** Kridtskrift på tavlen: "1+1=2" og "ABC". */
const kridtTekst = (
  <g stroke={KRIDT} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M103 25 L 106 22 V 34" />
    <path d="M111 28 H 119 M115 24 V 32" />
    <path d="M123 25 L 126 22 V 34" />
    <path d="M131 26 H 139 M131 30.5 H 139" />
    <path d="M142.5 25 C 143 21.5, 150 21.5, 149.5 25.5 C 149 28.5, 144.5 31, 142.5 34 H 150" />
    <path d="M106 54 L 111 42 L 116 54 M108 50 H 114" />
    <path d="M121 54 V 42 H 125 C 129 42, 129 48, 125 48 H 121 M125 48 C 130 48, 130 54, 125 54 H 121" />
    <path d="M143 44 C 140 41, 134 42, 134 48 C 134 54, 140 55, 143 52" />
  </g>
);

/** Ramme om den hævede vinge med pegepinden; drejer om skulderen (78, 92). */
const VINGE_RAMME: Ramme = [60, 30, 80, 80];
/** Ramme om hovedet; nikker om halsen (66, 76). */
const UGLE_HOVED_RAMME: Ramme = [34, 12, 64, 66];

/** Natugle med runde briller og pegepind under vingen — står den stille, underviser den ved tavlen. */
const teacherOwl: CreatureSpec = {
  name: "Lærer-uglen",
  rarity: "rare",
  // Som `tawnyOwl` (9 på 132 enheder), men med plads til tavlen ved siden af.
  // Boksen er symmetrisk om uglen (midt x 60), så den ikke hopper, når den vender.
  height: (9 * 144) / 132,
  aspect: 212 / 144,
  gait: "hop",
  pace: 0.8,
  viewBox: "-46 -12 212 144",
  art: (
    <>
      {ugleHale}
      <g className="zoo-leg zoo-leg-a">{ugleFodFjern}</g>
      <g className="zoo-torso">
        {ugleKrop}
        {/* Pegepinden stikker ud under vingen. */}
        <path d="M8 80 L 94 98" stroke={PIND} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M90 97.2 L 94 98" stroke="#d6453a" strokeWidth="3.6" strokeLinecap="round" />
        {/* Foldet vinge langs siden. */}
        <path d="M54 56 C 38 60, 24 76, 23 96 C 22 108, 28 116, 36 120 C 48 112, 60 96, 63 74 Z" fill={U_MOERK} />
        <path d="M30 98 C 36 92, 44 90, 52 90 M28 108 C 34 102, 42 100, 48 100" stroke="#5d3a22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="74" r="2.6" fill={U_LYS} />
        <circle cx="34" cy="84" r="2.4" fill={U_LYS} />
      </g>
      <g className="zoo-leg zoo-leg-b">{ugleFodNaer}</g>
      <g className="zoo-head">{ugleHoved}</g>
    </>
  ),
  special: (
    <>
      {/* Staffeliet: bagerste ben, så de to forreste, tavlen og hylden til kridtet. */}
      <path d="M124 8 L 124 129" stroke={STAFFELI_MOERK} strokeWidth="4" strokeLinecap="round" />
      <path d="M115 4 L 95 129 M133 4 L 153 129" stroke={STAFFELI} strokeWidth="4.4" strokeLinecap="round" />
      <rect x="92" y="12" width="64" height="52" rx="3" fill={STAFFELI} />
      <rect x="96" y="16" width="56" height="44" rx="1.5" fill={TAVLE} />
      {kridtTekst}
      <rect x="88" y="63" width="72" height="5" rx="2" fill={STAFFELI_MOERK} />
      <rect x="140" y="60" width="9" height="3.4" rx="1.4" fill={KRIDT} />
      {/* Kridtstjerner, der glimter om tavlen. */}
      {funkel(152, 48, 4, "0s", "glimt", KRIDT, "1.8s")}
      {funkel(104, 2, 5, "0.6s", "stjerne", "#ffe27a", "1.8s")}
      {funkel(158, 4, 4.4, "1.2s", "stjerne", KRIDT, "1.8s")}
      {/* Uglen. */}
      {ugleHale}
      {ugleFodFjern}
      {ugleKrop}
      {/* Den fjerne, foldede vinge. */}
      <path d="M54 56 C 38 60, 24 76, 23 96 C 22 108, 28 116, 36 120 C 48 112, 60 96, 63 74 Z" fill={U_MOERK} />
      {ugleFodNaer}
      {/* Hovedet nikker klogt. */}
      <g className="zoo-fx-nod" style={fxv("0.3s", drej(UGLE_HOVED_RAMME, 66, 76), "1.4s")}>
        {ramme(UGLE_HOVED_RAMME)}
        {ugleHoved}
      </g>
      {/* Vingen peger med pegepinden hen over tavlen. */}
      <g className="zoo-fx-wave" style={fxv("0s", drej(VINGE_RAMME, 78, 92), "1.4s")}>
        {ramme(VINGE_RAMME)}
        <path d="M100 90 L 134 40" stroke={PIND} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M131.8 43.2 L 134 40" stroke="#d6453a" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M66 102 C 70 88, 88 80, 104 78 C 110 77, 113 82, 109 86 C 100 94, 86 102, 72 108 Z" fill={U_MOERK} />
        <path d="M80 96 C 88 90, 96 87, 104 86" stroke="#5d3a22" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Bager-grævlingen                                                         */
/* ------------------------------------------------------------------------ */

const G_KROP = "#8d9096";
const G_RYG = "#b4b7bb";
const G_MAVE = "#3a3835";
const G_BEN = "#26231f";
const G_BEN_NAER = "#33302d";
const G_HVID = "#f4f2ee";
const HUE = "#ffffff";
const HUE_SKYGGE = "#dcdde2";
const DEJ = "#f3dcae";
const BOLLE = "#d58a3a";
const BOLLE_LYS = "#f0b765";
const BAENK = "#b9834d";
const BAENK_MOERK = "#93643a";

/** Hvid bagerhue, der sidder på grævlingens hoved. */
const bagerhue = (
  <g transform="rotate(-8 140 22)">
    <circle cx="130" cy="10" r="9" fill={HUE} stroke={HUE_SKYGGE} strokeWidth="1.6" />
    <circle cx="151" cy="10" r="9" fill={HUE} stroke={HUE_SKYGGE} strokeWidth="1.6" />
    <circle cx="140.5" cy="4" r="10.5" fill={HUE} stroke={HUE_SKYGGE} strokeWidth="1.6" />
    <path d="M125 12 C 130 18, 150 18, 156 12 L 156 22 L 125 22 Z" fill={HUE} />
    <path d="M134 10 C 135 14, 135 17, 134 20 M146 9 C 147 14, 147 17, 146 20" stroke={HUE_SKYGGE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <rect x="124" y="18" width="33" height="11" rx="3" fill={HUE} stroke={HUE_SKYGGE} strokeWidth="1.6" />
  </g>
);

/** Grævlingens hoved (som `badger`) med bagerhue. */
const graevlingHoved = (
  <>
    <circle cx="127" cy="27" r="8" fill={G_BEN} />
    <Klip form={<path d="M122 38 C 128 24, 148 24, 158 38 C 164 46, 168 56, 168 66 C 156 74, 136 76, 126 72 C 120 64, 118 48, 122 38 Z" />}>
      <rect x="110" y="20" width="64" height="60" fill={G_HVID} />
      <path d="M172 52 L 126 24 L 116 40 L 170 70 Z" fill={G_BEN} />
    </Klip>
    <circle cx="167" cy="64" r="4" fill={G_BEN} />
    <circle cx="148" cy="47" r="5.8" fill={G_HVID} />
    {EYE(148, 47, 3.4)}
    {bagerhue}
  </>
);

/** Kroppen (som `badger`). */
const graevlingKrop = (
  <>
    <ellipse cx="22" cy="54" rx="10" ry="7" fill={G_KROP} />
    <ellipse cx="82" cy="56" rx="58" ry="30" fill={G_KROP} />
    <ellipse cx="80" cy="45" rx="48" ry="16" fill={G_RYG} />
    <ellipse cx="86" cy="77" rx="44" ry="10" fill={G_MAVE} />
  </>
);

/** Lille bolle (kuppel) med midten af bunden i (x, 73). */
const bolle = (x: number) => (
  <g key={x}>
    <path d={`M${x - 7} 73 C ${x - 7} 63, ${x + 7} 63, ${x + 7} 73 Z`} fill={BOLLE} />
    <ellipse cx={x - 1.5} cy="67.6" rx="3.2" ry="1.6" fill={BOLLE_LYS} />
    <path d={`M${x - 3} 70 Q ${x} 68 ${x + 3} 70`} stroke="#a8652a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </g>
);

/** Damp, der stiger op fra en bolle og forsvinder lige under boksens top. */
const damp = (x: number, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "2.4s")}>
    {loeft(x, 38, 22, -22)}
    <path d={`M${x} 60 c -3.5 -3.5, 3.5 -7.5, 0 -11 c -3.5 -3.5, 3.5 -7.5, 0 -11`} stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.92" />
  </g>
);

/** Armen drejer om skulderen (102, 50); poten ælter dejen. */
const ARM_RAMME: Ramme = [84, 32, 36, 46];
/** Hovedet (løftet 8 op) nikker om halsen (128, 62). */
const G_HOVED_RAMME: Ramme = [112, -22, 66, 92];
const AELT = "0.7s";

/** Grævling med bagerhue — står den stille, ælter den dej ved bænken med nybagte boller. */
const bakerBadger: CreatureSpec = {
  name: "Bager-grævlingen",
  rarity: "rare",
  // Som `badger` (8 på 100 enheder), med plads til huen, dampen og bænken.
  // Boksen er symmetrisk om grævlingen (midt x 90).
  height: (8 * 126) / 100,
  aspect: 228 / 126,
  gait: "walk",
  pace: 0.8,
  viewBox: "-24 -26 228 126",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="106" y="64" width="14" height="36" rx="6" fill={G_BEN} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="36" y="64" width="14" height="36" rx="6" fill={G_BEN} />
      </g>
      <g className="zoo-torso">{graevlingKrop}</g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="66" width="15" height="34" rx="6" fill={G_BEN_NAER} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="50" y="66" width="15" height="34" rx="6" fill={G_BEN_NAER} />
      </g>
      <g className="zoo-head">{graevlingHoved}</g>
    </>
  ),
  special: (
    <>
      <rect x="106" y="64" width="14" height="36" rx="6" fill={G_BEN} />
      <rect x="36" y="64" width="14" height="36" rx="6" fill={G_BEN} />
      {graevlingKrop}
      <rect x="50" y="66" width="15" height="34" rx="6" fill={G_BEN_NAER} />
      {/* Hovedet er løftet en anelse og nikker tilfreds. */}
      <g className="zoo-fx-nod" style={fxv("0s", drej(G_HOVED_RAMME, 128, 62), "1.4s")}>
        {ramme(G_HOVED_RAMME)}
        <g transform="translate(2 -8)">{graevlingHoved}</g>
      </g>
      {/* Bænken foran. */}
      <rect x="102" y="82" width="6" height="18" fill={BAENK_MOERK} />
      <rect x="188" y="82" width="6" height="18" fill={BAENK_MOERK} />
      <rect x="96" y="76" width="104" height="8" rx="2" fill={BAENK} />
      <rect x="96" y="81" width="104" height="3" fill={BAENK_MOERK} />
      {/* Dejen: kuplen trykkes flad, når poten ælter. */}
      <ellipse cx="112" cy="74.5" rx="15" ry="2.6" fill={DEJ} />
      <g className="zoo-fx-talk" style={fxv(AELT, "50% 100%", AELT)}>
        <path d="M100 75 C 100 64.1, 124 64.1, 124 75 Z" fill={DEJ} />
      </g>
      <circle cx="98" cy="73" r="1.4" fill="#fff" />
      <circle cx="127" cy="72" r="1.2" fill="#fff" />
      <g className="zoo-fx-wave" style={fxv("0s", drej(ARM_RAMME, 102, 50), AELT)}>
        {ramme(ARM_RAMME)}
        <circle cx="102" cy="50" r="8" fill={G_KROP} />
        <path d="M102 50 L 113 66" stroke={G_BEN_NAER} strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="113" cy="66" rx="6" ry="4" fill={G_BEN} />
      </g>
      {/* Bakken med nybagte boller, der damper. */}
      {damp(176, "0s")}
      {damp(190, "0.8s")}
      {damp(162, "1.6s")}
      <rect x="150" y="72.5" width="48" height="3.6" rx="1.6" fill="#9aa0a6" />
      {[162, 176, 190].map(bolle)}
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Trommespætten                                                            */
/* ------------------------------------------------------------------------ */

const S_SORT = "#26252c";
const S_HVID = "#f6f1e6";
const S_ROED = "#d93a2e";
const S_NAEB = "#3b3a42";
const TROMME_BLAA = "#2f5fb0";
const GULD = "#f2c14e";
const BARK = "#7b5232";
const BARK_MOERK = "#5e3d24";
const SNIT = "#e6c38f";
const AARRING = "#c99a5a";

/** Lille trommeslager-hue (høj, blå med guldkant og fjerdusk), bunden midt i (0, 0). */
const trommeHue = (
  <>
    <path d="M-12 0 L -8.5 -17 L 8.5 -17 L 12 0 Z" fill={TROMME_BLAA} />
    <rect x="-12.5" y="-4" width="25" height="4.4" rx="1.4" fill={GULD} />
    <rect x="-9" y="-18.4" width="18" height="3.4" rx="1.4" fill={GULD} />
    <path d="M-3 -9 L 0 -12 L 3 -9 L 0 -6 Z" fill={GULD} />
    <path d="M7 0 L 16 3 L 7 2.6 Z" fill={S_SORT} />
    <ellipse cx="0" cy="-22" rx="3.6" ry="4.4" fill={S_ROED} />
    <ellipse cx="0.6" cy="-23.2" rx="1.4" ry="1.8" fill="#ff8a7e" />
  </>
);

const spaetteFodFjern = <path d="M54 84 V 104 M47 108 H 61 M54 104 L 48 108 M54 104 L 60 108" stroke="#8c8c96" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
const spaetteFodNaer = <path d="M72 84 V 104 M65 108 H 79 M72 104 L 66 108 M72 104 L 78 108" stroke="#a4a4ae" strokeWidth="4.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />;

/** Hovedet i oprejst stilling: midte (84, 32), næbbet peger mod stubben. */
const opretHoved = (
  <>
    {/* Halsen, så hovedet hænger sammen med kroppen, når det hakker. */}
    <ellipse cx="78" cy="46" rx="10" ry="12" fill={S_HVID} />
    <circle cx="84" cy="32" r="15" fill={S_HVID} />
    <path d="M69 32 C 68 18, 80 14, 90 17 C 95 19, 98 22, 98 24 C 90 22, 80 26, 69 32 Z" fill={S_SORT} />
    <ellipse cx="72" cy="27" rx="4" ry="6" transform="rotate(-18 72 27)" fill={S_ROED} />
    <path d="M89 38 C 87 43, 83 46, 78 47" stroke={S_SORT} strokeWidth="3.4" fill="none" strokeLinecap="round" />
    <path d="M97 28 L 118 33 L 97 37.5 Z" fill={S_NAEB} />
    {EYE(89, 29, 3.4)}
    <g transform="translate(83 18) rotate(-10)">{trommeHue}</g>
  </>
);

/** Ramme om hoved og hals; hakker om brystet (90, 80), så næbbet slår vandret ind i stubben. */
const S_HOVED_RAMME: Ramme = [60, -16, 60, 96];

/** Træsplint, der springer ud fra stedet, hvor næbbet rammer. */
const splint = (x: number, y: number, v: number, d: string) => (
  <g key={d} className="zoo-fx-sparkle" style={fxv(d, undefined, "0.64s")}>
    <rect x={x - 3} y={y - 1} width="6" height="2.2" rx="1" transform={`rotate(${v} ${x} ${y})`} fill={SNIT} />
  </g>
);

/** Splinterne: [x, y, vinkel, fase]. */
const SPLINTER: [number, number, number, string][] = [
  [116, 24, -30, "0s"],
  [126, 22, 20, "0.16s"],
  [112, 40, 40, "0.32s"],
  [128, 42, -15, "0.48s"],
];

/** Node, der stiger op fra stubben. */
const stigendeNode = (x: number, y: number, farve: string, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "2.4s")}>
    {loeft(x, y - 12, 15, -26)}
    {NODE(x, y, farve)}
  </g>
);

/** Flagspætte med trommeslager-hue — står den stille, trommer den med næbbet på en træstub. */
const drummerWoodpecker: CreatureSpec = {
  name: "Trommespætten",
  rarity: "rare",
  // Som `woodpecker` (6 på 112 enheder), med plads til huen, stubben og noderne.
  // Boksen er symmetrisk om spætten (midt x 67).
  height: (6 * 142) / 112,
  aspect: 174 / 142,
  gait: "hop",
  pace: 1.1,
  viewBox: "-20 -30 174 142",
  art: (
    <>
      {/* Stiv hale. */}
      <path d="M30 70 L 4 92 L 12 98 L 42 84 Z" fill={S_SORT} />
      <path d="M32 80 L 14 96 L 26 96 L 42 88 Z" fill={S_ROED} />
      <g className="zoo-leg zoo-leg-a">{spaetteFodFjern}</g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="68" rx="37" ry="21" transform="rotate(-12 60 68)" fill={S_SORT} />
        <ellipse cx="68" cy="75" rx="27" ry="12" transform="rotate(-12 68 75)" fill={S_HVID} />
        <ellipse cx="38" cy="80" rx="10" ry="7" transform="rotate(-12 38 80)" fill={S_ROED} />
        {/* Foldet vinge: hvid skulderplet og hvide pletter. */}
        <ellipse cx="66" cy="58" rx="12" ry="5" transform="rotate(-12 66 58)" fill={S_HVID} />
        <circle cx="36" cy="64" r="2.8" fill={S_HVID} />
        <circle cx="46" cy="62" r="2.8" fill={S_HVID} />
        <circle cx="42" cy="71" r="2.6" fill={S_HVID} />
        <circle cx="52" cy="69" r="2.6" fill={S_HVID} />
      </g>
      <g className="zoo-leg zoo-leg-b">{spaetteFodNaer}</g>
      <g className="zoo-head">
        <circle cx="94" cy="44" r="18" fill={S_HVID} />
        <path d="M76 44 C 74 28, 88 22, 100 26 C 106 28, 110 32, 110 34 C 100 32, 88 36, 76 44 Z" fill={S_SORT} />
        <ellipse cx="82" cy="38" rx="4.4" ry="6.4" transform="rotate(-18 82 38)" fill={S_ROED} />
        <path d="M99 50 C 97 55, 93 58, 88 59" stroke={S_SORT} strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d="M108 40 L 130 44 L 108 49 Z" fill={S_NAEB} />
        {EYE(99, 41, 3.8)}
        <g transform="translate(93 28) rotate(-10)">{trommeHue}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Træstubben med årringe og et lille hak, hvor der trommes. */}
      <path d="M115 112 C 120 104, 121 96, 121 86 V 30 H 149 V 86 C 149 96, 150 104, 155 112 Z" fill={BARK} />
      <path d="M128 40 V 70 M140 48 V 96 M133 80 V 104" stroke={BARK_MOERK} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="135" cy="30" rx="14" ry="4.6" fill={SNIT} />
      <ellipse cx="135" cy="30" rx="8.5" ry="2.6" fill="none" stroke={AARRING} strokeWidth="1.4" />
      <ellipse cx="135" cy="30" rx="3.6" ry="1.1" fill="none" stroke={AARRING} strokeWidth="1.2" />
      <ellipse cx="122.4" cy="35" rx="1.8" ry="3" fill={BARK_MOERK} />
      {/* Noder stiger op fra stubben. */}
      {stigendeNode(132, 16, TROMME_BLAA, "0s")}
      {stigendeNode(143, 20, S_ROED, "1.2s")}
      {/* Spætten står oprejst på jorden: hale som støtteben. */}
      <path d="M52 84 L 36 110 L 47 110 L 62 88 Z" fill={S_SORT} />
      {spaetteFodFjern}
      <ellipse cx="66" cy="64" rx="19" ry="30" transform="rotate(16 66 64)" fill={S_SORT} />
      <ellipse cx="73" cy="68" rx="10" ry="22" transform="rotate(16 73 68)" fill={S_HVID} />
      <ellipse cx="59" cy="89" rx="8" ry="6" transform="rotate(16 59 89)" fill={S_ROED} />
      <ellipse cx="62" cy="52" rx="4.4" ry="10" transform="rotate(16 62 52)" fill={S_HVID} />
      <circle cx="54" cy="66" r="2.4" fill={S_HVID} />
      <circle cx="52" cy="75" r="2.4" fill={S_HVID} />
      <circle cx="58" cy="72" r="2.2" fill={S_HVID} />
      {spaetteFodNaer}
      {/* Hovedet hakker hurtigt ind i stubben: tok-tok-tok. */}
      <g className="zoo-fx-nod" style={fxv("0s", drej(S_HOVED_RAMME, 90, 80), "0.16s")}>
        {ramme(S_HOVED_RAMME)}
        {opretHoved}
      </g>
      {/* Træsplinter springer ud. */}
      {SPLINTER.map(([x, y, v, d]) => splint(x, y, v, d))}
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Picnic-ræven                                                             */
/* ------------------------------------------------------------------------ */

const R_KROP = "#e8803a";
const R_MOERK = "#c4651e";
const R_HVID = "#fbf8f1";
const R_SOK = "#26231f";
const R_MAVE = "#f6c58e";
const KURV = "#c98d4a";
const KURV_MOERK = "#a8743c";
const TERN = "#e2483d";
const TAEPPE = "#fdf3ec";
const AEBLE = "#e0392f";
const SAFT = "#d8323c";

/** Rævens hoved (som `fox`). */
const raeveHoved = (
  <>
    <path d="M136 38 L 134 10 L 152 32 Z" fill={R_MOERK} />
    <path d="M150 32 L 158 8 L 167 36 Z" fill={R_KROP} />
    <path d="M154 30 L 158 14 L 163 32 Z" fill={R_SOK} />
    <path d="M132 54 C 130 38, 146 30, 160 34 C 170 38, 176 50, 187 58 C 180 66, 164 70, 152 68 C 140 66, 132 62, 132 54 Z" fill={R_KROP} />
    <path d="M142 62 C 152 62, 160 56, 171 53 C 178 55, 183 57, 187 58 C 180 66, 164 71, 152 69 C 146 68, 142 66, 142 62 Z" fill={R_HVID} />
    <circle cx="187" cy="58" r="3.8" fill={R_SOK} />
    {EYE(157, 45, 3.6)}
  </>
);

/** Lille picnickurv med rødternet serviet; bunden midt i (0, 0). */
const picnicKurv = (
  <>
    <path d="M-10 -15 C -10 -30, 10 -30, 10 -15" stroke={KURV_MOERK} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M-8 -17 L -4 -22 L 1 -18 L 5 -21.5 L 8 -17 Z" fill={TERN} />
    <path d="M-13 -16 H 13 L 10 0 H -10 Z" fill={KURV} />
    <path d="M-12 -10 H 12 M-11 -5 H 11 M-5 -16 V 0 M3 -16 V 0" stroke={KURV_MOERK} strokeWidth="1.4" />
    <rect x="-14" y="-18" width="28" height="4" rx="1.6" fill={KURV_MOERK} />
  </>
);

/** Halen peger skråt op bag ryggen og drejer om roden (70, 90). */
const raeveHale = (
  <>
    <path d="M74 96 C 52 98, 26 86, 18 66 C 12 52, 18 40, 30 40 C 36 58, 52 74, 76 80 Z" fill={R_KROP} />
    <Klip form={<path d="M74 96 C 52 98, 26 86, 18 66 C 12 52, 18 40, 30 40 C 36 58, 52 74, 76 80 Z" />}>
      <circle cx="18" cy="46" r="15" fill={R_HVID} />
    </Klip>
  </>
);
const HALE_RAMME: Ramme = [10, 34, 70, 70];

/** Ternet tæppe i perspektiv. */
const TAEPPE_FORM = "M28 96 H 176 L 198 110 H 4 Z";
const ternStriber = Array.from({ length: 14 }, (_, i) => 6 + i * 14);

/** Hjerte, der stiger op til lige under boksens top. */
const stigendeHjerte = (x: number, y: number, r: number, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "2.8s")}>
    {loeft(x, rund(y - r * 1.2), rund(r * 2.1), -30)}
    {HJERTE(x, y, r, "#ff6f91")}
  </g>
);

/** Ræv med picnickurv i munden — står den stille, holder den picnic og logrer med halen. */
const picnicFox: CreatureSpec = {
  name: "Picnic-ræven",
  rarity: "rare",
  // Som `fox` (9 på 110 enheder), med plads over til ørerne og hjerterne.
  height: (9 * 144) / 110,
  aspect: 200 / 144,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 -34 200 144",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M58 62 C 40 36, 8 40, 4 70 C 6 92, 34 98, 60 80 Z" fill={R_KROP} />
        <path d="M18 47 C 9 54, 5 62, 4 70 C 5 82, 12 91, 24 94 C 17 82, 16 60, 18 47 Z" fill={R_HVID} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="118" y="76" width="9" height="34" rx="4" fill={R_MOERK} />
        <rect x="118" y="94" width="9" height="16" rx="4" fill={R_SOK} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="60" y="76" width="9" height="34" rx="4" fill={R_MOERK} />
        <rect x="60" y="94" width="9" height="16" rx="4" fill={R_SOK} />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="64" rx="44" ry="20" fill={R_KROP} />
        <ellipse cx="100" cy="76" rx="30" ry="7" fill={R_MAVE} opacity="0.8" />
        <ellipse cx="136" cy="70" rx="12" ry="12" fill={R_HVID} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="130" y="78" width="10" height="32" rx="4" fill={R_KROP} />
        <rect x="130" y="94" width="10" height="16" rx="4" fill={R_SOK} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="72" y="78" width="10" height="32" rx="4" fill={R_KROP} />
        <rect x="72" y="94" width="10" height="16" rx="4" fill={R_SOK} />
      </g>
      <g className="zoo-head">
        {raeveHoved}
        {/* Kurven hænger i munden. */}
        <g transform="translate(177 92)">{picnicKurv}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Det rødternede tæppe. */}
      <Klip form={<path d={TAEPPE_FORM} />}>
        <rect x="0" y="94" width="200" height="16" fill={TAEPPE} />
        {ternStriber.map((x) => (
          <rect key={x} x={x} y="94" width="7" height="16" fill={TERN} opacity="0.55" />
        ))}
        <rect x="0" y="98.5" width="200" height="3.6" fill={TERN} opacity="0.55" />
        <rect x="0" y="105.5" width="200" height="4.5" fill={TERN} opacity="0.55" />
      </Klip>
      {/* Halen logrer glad. */}
      <g className="zoo-fx-wave" style={fxv("0s", drej(HALE_RAMME, 70, 90), "0.5s")}>
        {ramme(HALE_RAMME)}
        {raeveHale}
      </g>
      {/* Ræven sidder: lår, krop og forben. */}
      <rect x="118" y="70" width="9" height="40" rx="4" fill={R_MOERK} />
      <rect x="118" y="94" width="9" height="16" rx="4" fill={R_SOK} />
      <ellipse cx="114" cy="66" rx="22" ry="33" transform="rotate(24 114 66)" fill={R_KROP} />
      <ellipse cx="86" cy="88" rx="28" ry="19" fill={R_KROP} />
      <ellipse cx="102" cy="106" rx="15" ry="4" fill={R_SOK} />
      <ellipse cx="134" cy="54" rx="12" ry="18" transform="rotate(14 134 54)" fill={R_HVID} />
      <rect x="130" y="70" width="10" height="40" rx="4" fill={R_KROP} />
      <rect x="130" y="94" width="10" height="16" rx="4" fill={R_SOK} />
      {/* Hovedet, løftet op, nikker glad. */}
      <g className="zoo-fx-nod" style={fxv("0.4s", drej([124, -28, 64, 68], 146, 34), "1.6s")}>
        {ramme([124, -28, 64, 68])}
        <g transform="translate(-4 -34)">
          {raeveHoved}
          <path d="M170 32 Q 175 36 180 31" stroke={R_SOK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        <circle cx="160" cy="21" r="3.6" fill="#ff9aa0" opacity="0.6" />
      </g>
      {/* Kurv, æble og en kop saft på tæppet. */}
      <g transform="translate(160 104)">{picnicKurv}</g>
      <circle cx="178" cy="102.6" r="6" fill={AEBLE} />
      <circle cx="176" cy="100.6" r="1.8" fill="#ff8a80" />
      <path d="M178 97 L 179 93" stroke="#6b4a2a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M179 95 C 182 92, 185 93, 186 94 C 184 96, 181 96, 179 95 Z" fill="#5aa04a" />
      <path d="M186 90 H 197 L 195.4 105 H 187.6 Z" fill="#dff1fa" stroke="#9fc7da" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M186.8 95 H 196.2 L 195.4 105 H 187.6 Z" fill={SAFT} />
      <path d="M193 92 L 196 84" stroke="#3fa0e0" strokeWidth="1.6" strokeLinecap="round" />
      {/* Små hjerter stiger op. */}
      {stigendeHjerte(104, 26, 5, "0s")}
      {stigendeHjerte(116, 10, 4, "0.95s")}
      {stigendeHjerte(190, 64, 4.4, "1.9s")}
    </>
  ),
};

export const specialsTwo: Record<string, CreatureSpec> = {
  teacherOwl,
  bakerBadger,
  drummerWoodpecker,
  picnicFox,
};
