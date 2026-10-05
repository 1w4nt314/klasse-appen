import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Sjældne rumvæsner med særlig opførsel (anden omgang). `art` er figuren, når
 * den går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Afrunder til én decimal (beregnede koordinater). */
const rund = (v: number) => Math.round(v * 10) / 10;

/** fx() med egen varighed og evt. egen tidsfunktion (fx kantede trin). */
const fxv = (d: string, origin: string | undefined, varighed: string, tid?: string) =>
  ({ ...fx(d, origin), animationDuration: varighed, ...(tid ? { animationTimingFunction: tid } : {}) }) as CSSProperties;

/** Kantede robot-ryk: hold stillingen og hop så direkte til den næste. */
const TRIN = "steps(3, jump-none)";

/**
 * Usynlig firkant centreret om (x, y). Lagt i en fx-gruppe, som den omslutter
 * helt, bliver gruppens drejepunkt "50% 50%" præcis (x, y) — fx en skulder.
 */
const omkring = (x: number, y: number, rx: number, ry = rx) => (
  <rect x={x - rx} y={y - ry} width={2 * rx} height={2 * ry} fill="none" stroke="none" />
);

/** Usynlig lodret boks: gør en zoo-fx-bob-gruppe højere, så den hopper længere (4 % af højden). */
const boks = (x: number, y: number, h: number) => <rect x={x} y={y} width="1" height={h} fill="none" stroke="none" />;

/**
 * Usynlig boks over et element, der stiger op (zoo-fx-rise løfter 120 % af
 * gruppens højde): elementet med overkant `top` og højde `hoejde` ender ved `slut`.
 */
const loeft = (x: number, top: number, hoejde: number, slut: number) => {
  const h = rund((top - slut) / 1.2 - hoejde);
  return <rect x={x} y={rund(top - h)} width="1" height={h} fill="none" stroke="none" />;
};

/* ------------------------------------------------------------------------ */
/* Fælles alien-krop (som Grøn alien i creatures.tsx), i valgfri farve        */
/* ------------------------------------------------------------------------ */

type AlienFarver = {
  benBag: string;
  krop: string;
  mave: string;
  plet: string;
  benFor: string;
  hoved: string;
  hovedPlet: string;
  stilk: string;
  mund: string;
};

const GROEN: AlienFarver = {
  benBag: "#43a84b",
  krop: "#6fd36b",
  mave: "#c9f5a3",
  plet: "#56bd57",
  benFor: "#7fe07a",
  hoved: "#7fe07a",
  hovedPlet: "#6bd066",
  stilk: "#56bd57",
  mund: "#2f8a3b",
};

const TURKIS: AlienFarver = {
  benBag: "#1f9f96",
  krop: "#3fcabd",
  mave: "#c4f6ee",
  plet: "#27b0a4",
  benFor: "#5fdfd2",
  hoved: "#5fdfd2",
  hovedPlet: "#45cfc1",
  stilk: "#27b0a4",
  mund: "#17756d",
};

const alienBenBag = (f: AlienFarver) => (
  <>
    <rect x="48" y="114" width="12" height="34" rx="6" fill={f.benBag} />
    <ellipse cx="57" cy="147" rx="10" ry="4" fill={f.benBag} />
  </>
);

const alienBenFor = (f: AlienFarver) => (
  <>
    <rect x="68" y="116" width="13" height="32" rx="6" fill={f.benFor} />
    <ellipse cx="78" cy="147" rx="11" ry="4" fill={f.benFor} />
  </>
);

const alienKrop = (f: AlienFarver) => (
  <>
    <ellipse cx="62" cy="98" rx="27" ry="32" fill={f.krop} />
    <ellipse cx="68" cy="104" rx="15" ry="21" fill={f.mave} />
    <circle cx="50" cy="92" r="3.5" fill={f.plet} />
    <circle cx="46" cy="106" r="2.5" fill={f.plet} />
  </>
);

/** Antenner, hovedkugle og pletter (uden øjne og mund). */
const alienHoved = (f: AlienFarver) => (
  <>
    <path d="M54 24 C 50 14, 46 9, 41 5" stroke={f.stilk} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M78 22 C 82 14, 87 9, 93 5" stroke={f.stilk} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <circle cx="41" cy="5" r="5.5" fill="#ff7ac8" />
    <circle cx="93" cy="5" r="5.5" fill="#ffd84a" />
    <circle cx="64" cy="50" r="34" fill={f.hoved} />
    <circle cx="42" cy="58" r="4" fill={f.hovedPlet} />
    <circle cx="50" cy="38" r="3" fill={f.hovedPlet} />
    <circle cx="76" cy="68" r="5" fill="#ff9fb8" opacity="0.55" />
  </>
);

/** Øje med hvide; pupillen sidder (dx, dy) fra midten (som Grøn alien: 2 til højre). */
const alienOeje = (x: number, y: number, dx = 2, dy = 0) => (
  <>
    <circle cx={x} cy={y} r="8.5" fill="#fff" />
    {EYE(x + dx, y + dy, 5)}
  </>
);

const alienSmil = (f: AlienFarver) => (
  <path d="M82 66 q 8 8 18 -1" stroke={f.mund} strokeWidth="3" fill="none" strokeLinecap="round" />
);

/** Stor, åben begejstret mund. */
const alienJubel = (f: AlienFarver) => (
  <>
    <path d="M81 64 q 9 13 20 -1 Z" fill={f.mund} />
    <path d="M86 70 q 5 3 10 -1" stroke="#ff8fae" strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

/* ------------------------------------------------------------------------ */
/* Stjernekiggeren                                                          */
/* ------------------------------------------------------------------------ */

const KORT = "#2c3f94";
const KORT_PAPIR = "#f3e6b8";
const KIKKERT = "#e2574c";
const KIKKERT_LYS = "#ff8f84";
const MESSING = "#ffd84a";
const STATIV = "#a86c3a";

/** Det sammenrullede stjernekort (blåt papir med små stjerner). */
const stjernekort = (
  <>
    <rect x="30" y="95" width="64" height="12" rx="6" fill={KORT} />
    <rect x="58" y="95" width="5" height="12" fill="#ff7ac8" />
    <ellipse cx="91" cy="101" rx="3.5" ry="6" fill={KORT_PAPIR} />
    <ellipse cx="91" cy="101" rx="1.4" ry="2.6" fill={KORT} />
    {STJERNE(40, 101, 3.4, MESSING)}
    {STJERNE(51, 99, 2.4, "#fff3a8")}
    {STJERNE(72, 102, 3, MESSING)}
    {STJERNE(82, 99, 2.2, "#fff3a8")}
  </>
);

/** Stjerne eller glimt på himlen, der funkler. */
const funkel = (x: number, y: number, r: number, d: string, slags: "stjerne" | "glimt", farve: string) => (
  <g className="zoo-fx-sparkle" style={fxv(d, undefined, "1.6s")}>
    {slags === "stjerne" ? STJERNE(x, y, r, farve) : GLIMT(x, y, r, farve)}
  </g>
);

/** Grøn alien med et stjernekort under armen — står den stille, kigger den på stjerner i kikkert. */
const stargazer: CreatureSpec = {
  name: "Stjernekiggeren",
  rarity: "rare",
  height: 24,
  aspect: 160 / 190,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 -40 160 190",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{alienBenBag(GROEN)}</g>
      <g className="zoo-torso">
        {alienKrop(GROEN)}
        {/* Stjernekortet klemt ind under armen. */}
        <g transform="rotate(-10 62 101)">{stjernekort}</g>
        <path d="M64 84 C 72 92, 78 98, 76 107" stroke={GROEN.benFor} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="76" cy="108" r="5.5" fill={GROEN.benFor} />
      </g>
      <g className="zoo-leg zoo-leg-b">{alienBenFor(GROEN)}</g>
      <g className="zoo-head">
        {alienHoved(GROEN)}
        {alienOeje(68, 52)}
        {alienOeje(88, 50)}
        {alienOeje(78, 33)}
        {alienSmil(GROEN)}
      </g>
    </>
  ),
  special: (
    <>
      {/* Stjerner og en lille måne, der funkler over kikkerten. */}
      <path d="M26 -30 a 11 11 0 1 0 10 16 a 9 9 0 1 1 -10 -16 Z" fill="#fff3a8" />
      {funkel(148, -24, 8, "0s", "stjerne", MESSING)}
      {funkel(118, -28, 5.5, "0.5s", "stjerne", "#fff3a8")}
      {funkel(136, -2, 4.5, "1s", "stjerne", "#fff")}
      {funkel(98, -12, 5, "0.3s", "stjerne", MESSING)}
      {funkel(154, 2, 4, "1.3s", "glimt", "#fff")}
      {funkel(70, -28, 4.5, "0.8s", "glimt", "#fff")}
      {funkel(132, -34, 3.5, "1.15s", "glimt", MESSING)}
      {/* Stjernekortet ligger på jorden bag den. */}
      <g transform="translate(-22 41)">{stjernekort}</g>
      {alienBenBag(GROEN)}
      {alienKrop(GROEN)}
      {alienBenFor(GROEN)}
      {/* Stativet: tre ben og et beslag under røret. */}
      <path d="M122 54 L 104 148 M122 54 L 140 148" stroke={STATIV} strokeWidth="4" strokeLinecap="round" />
      <path d="M122 54 L 123 148" stroke="#8a5530" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="119" y="42" width="6" height="14" rx="2" fill="#3a3550" />
      <circle cx="122" cy="43" r="5" fill="#3a3550" />
      {/* Kikkerten peger skråt op mod himlen; okularet sidder ved det forreste øje. */}
      <g transform="rotate(-35 96 50)">
        <rect x="103" y="42" width="38" height="16" rx="3" fill={KIKKERT} />
        <path d="M107 46 H 136" stroke={KIKKERT_LYS} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="112" y="42" width="4" height="16" fill={MESSING} />
        <rect x="139" y="39" width="9" height="22" rx="3" fill={MESSING} />
        <ellipse cx="148" cy="50" rx="2.5" ry="9" fill="#bfe9ff" />
      </g>
      {/* Hovedet nikker begejstret — drejet om øjet ved okularet. */}
      <g className="zoo-fx-nod" style={fxv("0s", "50% 50%", "0.55s")}>
        {omkring(90, 50, 56, 52)}
        {alienHoved(GROEN)}
        {alienOeje(68, 52, 3, -3)}
        {alienOeje(78, 33, 3, -3)}
        {alienOeje(88, 50, 3, -1)}
        {alienJubel(GROEN)}
      </g>
      {/* Okularet trykket mod øjet. */}
      <g transform="rotate(-35 96 50)">
        <rect x="92" y="44" width="12" height="12" rx="3" fill="#3a3550" />
      </g>
      {/* Armen holder om kikkerten. */}
      <path d="M68 88 C 86 94, 102 82, 106 60" stroke={GROEN.benFor} strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="107" cy="57" r="5.5" fill={GROEN.benFor} />
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Dansebotten                                                              */
/* ------------------------------------------------------------------------ */

const ROBOT = "#8fb3ff";
const ROBOT_MOERK = "#5f86d6";
const ROBOT_FOD = "#4b6fbd";
const ROBOT_MELLEM = "#6f95e8";
const SKAERM = "#1f2d5a";
const LYS_CYAN = "#7ff3ff";

const FACET = ["#eef3ff", "#9aa8c8", "#ffffff", "#c8d2ea", "#ffb3e2", "#aef6ff"];

/** Diskokugle med spejlfacetter, midt i (x, y). */
const diskokugle = (x: number, y: number, r: number) => {
  const n = 4;
  const s = (2 * r) / n;
  return (
    <>
      <Klip form={<circle cx={x} cy={y} r={r} />}>
        {Array.from({ length: n * n }, (_, i) => {
          const kol = i % n;
          const rk = Math.floor(i / n);
          return (
            <rect
              key={i}
              x={rund(x - r + kol * s)}
              y={rund(y - r + rk * s)}
              width={rund(s)}
              height={rund(s)}
              fill={FACET[(kol * 2 + rk * 3) % FACET.length]}
              stroke="#7d8bb0"
              strokeWidth="0.7"
            />
          );
        })}
      </Klip>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#7d8bb0" strokeWidth="1.2" />
    </>
  );
};

/** Robotkrop (som Robot i creatures.tsx) uden ben og arme. */
const robotKrop = (
  <>
    <rect x="32" y="70" width="58" height="46" rx="12" fill={ROBOT} />
    <rect x="42" y="80" width="30" height="24" rx="7" fill="#dcebff" />
    <circle cx="50" cy="92" r="4.2" fill="#ff7ac8" />
    <circle cx="62" cy="92" r="4.2" fill="#ffd84a" />
  </>
);

const robotBenBag = (
  <>
    <rect x="42" y="108" width="14" height="36" rx="5" fill={ROBOT_MOERK} />
    <rect x="37" y="142" width="28" height="8" rx="4" fill={ROBOT_FOD} />
  </>
);

const robotBenFor = (
  <>
    <rect x="64" y="110" width="14" height="34" rx="5" fill={ROBOT} />
    <rect x="59" y="142" width="28" height="8" rx="4" fill={ROBOT_MELLEM} />
  </>
);

/** Hovedskal med øre og skærm (uden øjne, mund og antenne). */
const robotHoved = (
  <>
    <rect x="28" y="18" width="68" height="54" rx="16" fill={ROBOT} />
    <rect x="22" y="34" width="9" height="20" rx="4" fill="#ffd84a" />
    <rect x="40" y="28" width="54" height="36" rx="12" fill={SKAERM} />
  </>
);

/** Robotarm i to led: overarm fra skulder til albue, underarm med gribeklo. */
const robotKlo = (x: number, y: number, op: boolean) => (
  <path
    d={op ? `M${x - 5} ${y - 6} L ${x - 3} ${y} H ${x + 3} L ${x + 5} ${y - 6}` : `M${x - 5} ${y + 6} L ${x - 3} ${y} H ${x + 3} L ${x + 5} ${y + 6}`}
    stroke="#ffd84a"
    strokeWidth="3"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

/** Farvet lysprik fra diskokuglen, der blinker. */
const lysprik = (x: number, y: number, r: number, farve: string, d: string) => (
  <g className="zoo-fx-sparkle" style={fxv(d, undefined, "0.9s")}>
    <circle cx={x} cy={y} r={r} fill={farve} />
  </g>
);

/** Robot med diskokugle på antennen — står den stille, laver den robotdans. */
const danceBot: CreatureSpec = {
  name: "Dansebotten",
  rarity: "rare",
  height: 21.5,
  aspect: 120 / 170,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 -20 120 170",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{robotBenBag}</g>
      <g className="zoo-torso">{robotKrop}</g>
      <g className="zoo-leg zoo-leg-b">{robotBenFor}</g>
      <g className="zoo-head">
        <path d="M62 20 V 6" stroke={ROBOT_MOERK} strokeWidth="3.5" strokeLinecap="round" />
        {diskokugle(62, -5, 9)}
        {GLIMT(58, -9, 3.5)}
        {robotHoved}
        <g className="zoo-eye"><circle cx="64" cy="43" r="6.4" fill={LYS_CYAN} /><circle cx="66" cy="41" r="2.2" fill="#fff" /></g>
        <g className="zoo-eye"><circle cx="82" cy="43" r="6.4" fill={LYS_CYAN} /><circle cx="84" cy="41" r="2.2" fill="#fff" /></g>
        <path d="M68 54 q 8 6 16 0" stroke={LYS_CYAN} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <path d="M78 80 C 86 84, 92 92, 94 104" stroke={ROBOT_MELLEM} strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="106" r="6" fill="#ffd84a" />
    </>
  ),
  special: (
    <>
      {/* Lysprikker fra diskokuglen blinker rundt om den. */}
      {lysprik(12, 6, 3.5, "#ff7ac8", "0s")}
      {lysprik(30, -10, 3, "#ffd84a", "0.3s")}
      {lysprik(96, -12, 3.5, LYS_CYAN, "0.6s")}
      {lysprik(112, 10, 3, "#9dff8a", "0.15s")}
      {lysprik(8, 34, 2.6, LYS_CYAN, "0.45s")}
      {lysprik(114, 120, 3, "#c49bff", "0.75s")}
      {lysprik(8, 124, 3.4, "#ffd84a", "0.2s")}
      {lysprik(100, 136, 2.6, "#ff7ac8", "0.5s")}
      <g className="zoo-fx-sparkle" style={fxv("0.35s", undefined, "0.9s")}>
        {GLIMT(40, -4, 5, "#fff")}
        {GLIMT(86, 0, 4, "#fff3a8")}
      </g>
      {robotBenBag}
      {robotBenFor}
      {/* Overkroppen popper op og ned i takt. */}
      <g className="zoo-fx-bob" style={fxv("0s", undefined, "0.45s", "steps(2, jump-none)")}>
        {/* Bageste arm: skulder og albue drejer i kantede ryk. */}
        <g className="zoo-fx-wave" style={fxv("0s", "50% 50%", "0.9s", TRIN)}>
          {omkring(40, 80, 40, 34)}
          <path d="M40 80 H 18" stroke={ROBOT_MOERK} strokeWidth="9" strokeLinecap="round" />
          <g className="zoo-fx-wave" style={fxv("0s", "50% 50%", "0.9s", TRIN)}>
            {omkring(18, 80, 8, 32)}
            <path d="M18 80 V 58" stroke={ROBOT_MOERK} strokeWidth="9" strokeLinecap="round" />
            {robotKlo(18, 54, true)}
            <circle cx="18" cy="80" r="5.5" fill={ROBOT_FOD} />
          </g>
        </g>
        {robotKrop}
        {/* Hovedet tikker frem og tilbage. */}
        <g className="zoo-fx-nod" style={fxv("0.2s", "50% 100%", "0.45s", TRIN)}>
          <path d="M62 20 V 6" stroke={ROBOT_MOERK} strokeWidth="3.5" strokeLinecap="round" />
          {/* Diskokuglen snurrer. */}
          <g className="zoo-fx-spin" style={fxv("0s", undefined, "1.2s")}>{diskokugle(62, -5, 9)}</g>
          {GLIMT(58, -9, 3.5)}
          {robotHoved}
          {/* Glade, lukkede øjne og stort smil. */}
          <path d="M58 45 q 6 -8 12 0 M76 45 q 6 -8 12 0" stroke={LYS_CYAN} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M66 52 q 10 10 20 0 Z" fill={LYS_CYAN} />
        </g>
        {/* Forreste arm i modtakt: den ene arm op, den anden ned. */}
        <g className="zoo-fx-wave" style={fxv("0.9s", "50% 50%", "0.9s", TRIN)}>
          {omkring(84, 86, 34, 28)}
          <path d="M84 86 H 102" stroke={ROBOT_MELLEM} strokeWidth="9" strokeLinecap="round" />
          <g className="zoo-fx-wave" style={fxv("0.9s", "50% 50%", "0.9s", TRIN)}>
            {omkring(102, 86, 8, 24)}
            <path d="M102 86 V 104" stroke={ROBOT_MELLEM} strokeWidth="9" strokeLinecap="round" />
            {robotKlo(102, 107, false)}
            <circle cx="102" cy="86" r="5.5" fill={ROBOT_FOD} />
          </g>
        </g>
        {/* Farvede lyspletter fra kuglen på kroppen. */}
        {lysprik(82, 78, 2.6, "#ff7ac8", "0.4s")}
        {lysprik(40, 108, 2.4, LYS_CYAN, "0.1s")}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Turist-alien                                                             */
/* ------------------------------------------------------------------------ */

const SKJORTE = "#ff7f50";
const SKJORTE_MOERK = "#e8603a";
const BLAD = "#2f9e5a";
const STRAA = "#f3cf72";
const STRAA_MOERK = "#d9ae4e";
const HATTEBAAND = "#e2457a";
const KAMERA = "#3d4250";
const KAMERA_LYS = "#5d6475";

/** Hibiscusblomst med fem kronblade. */
const blomst = (x: number, y: number, r: number, farve: string) => (
  <>
    {Array.from({ length: 5 }, (_, i) => {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      return <circle key={i} cx={rund(x + r * 0.62 * Math.cos(a))} cy={rund(y + r * 0.62 * Math.sin(a))} r={rund(r * 0.5)} fill={farve} />;
    })}
    <circle cx={x} cy={y} r={rund(r * 0.32)} fill="#ffd84a" />
  </>
);

/** Hawaiiskjorte over kroppen: klippet til torsoen, med blomster, blade og knapper. */
const hawaiiskjorte = (
  <>
    <Klip form={<ellipse cx="62" cy="98" rx="27" ry="32" />}>
      <path d="M30 60 H 96 V 118 Q 64 124 30 116 Z" fill={SKJORTE} />
      <ellipse cx="44" cy="86" rx="6" ry="2.6" transform="rotate(-30 44 86)" fill={BLAD} />
      <ellipse cx="74" cy="112" rx="6" ry="2.6" transform="rotate(25 74 112)" fill={BLAD} />
      <ellipse cx="56" cy="104" rx="5" ry="2.2" transform="rotate(60 56 104)" fill={BLAD} />
      {blomst(48, 98, 8, "#fff4c2")}
      {blomst(66, 84, 6.5, "#ffd84a")}
      {blomst(40, 112, 6, "#ffd84a")}
      {blomst(80, 100, 6, "#fff4c2")}
      <path d="M30 116 Q 64 124 96 118" stroke={SKJORTE_MOERK} strokeWidth="2.5" fill="none" />
      {/* Knapperne fortil. */}
      <circle cx="86" cy="92" r="1.8" fill="#fff" />
      <circle cx="87" cy="104" r="1.8" fill="#fff" />
    </Klip>
    {/* Kraven i halsen. */}
    <path d="M70 80 L 82 92 L 84 80 Z" fill={SKJORTE_MOERK} />
    <path d="M84 78 L 86 92 L 92 82 Z" fill={SKJORTE_MOERK} />
  </>
);

/** Ærmet om skulderen. */
const aerme = <path d="M58 84 C 62 80, 72 80, 74 88 L 72 96 C 66 98, 60 96, 58 92 Z" fill={SKJORTE_MOERK} />;

/** Solhat af strå med blomsterbånd; antennerne stikker ud under skyggen. */
const solhat = (
  <g transform="rotate(-6 66 18)">
    <ellipse cx="66" cy="18" rx="42" ry="7" fill={STRAA_MOERK} />
    <path d="M44 18 C 44 2, 52 -4, 66 -4 C 80 -4, 88 2, 88 18 Z" fill={STRAA} />
    <path d="M44 12 Q 66 8 88 12 L 88 18 Q 66 14 44 18 Z" fill={HATTEBAAND} />
    {blomst(80, 13, 6, "#fff4c2")}
    <ellipse cx="66" cy="16" rx="40" ry="5" fill={STRAA} />
    <path d="M52 2 C 56 -1, 62 -2, 68 -2" stroke="#fbe6a6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </g>
);

/** Kamera set fra siden, objektivet peger frem (mod højre). (x, y) er kameraets øverste venstre hjørne. */
const kamera = (x: number, y: number) => (
  <>
    <rect x={x + 4} y={y - 4} width="8" height="5" rx="1.5" fill={KAMERA_LYS} />
    <rect x={x + 13} y={y - 3} width="6" height="4" rx="1" fill="#fff6c0" />
    <rect x={x} y={y} width="20" height="14" rx="3" fill={KAMERA} />
    <rect x={x + 19} y={y + 2} width="7" height="10" rx="2" fill={KAMERA_LYS} />
    <ellipse cx={x + 26} cy={y + 7} rx="2" ry="4.5" fill="#9fd6ff" />
    <circle cx={x + 5} cy={y + 5} r="2" fill="#ff7ac8" />
  </>
);

/** Lille polaroidfoto af en planet (overkant `y`, ca. 12 × 14). */
const foto = (x: number, y: number, vinkel: number) => (
  <g transform={`rotate(${vinkel} ${x + 6} ${y + 7})`}>
    <rect x={x} y={y} width="12" height="14" rx="1" fill="#fff" />
    <rect x={x + 1.5} y={y + 1.5} width="9" height="8" fill="#3a2a7a" />
    <circle cx={x + 6} cy={y + 5.5} r="2.6" fill="#ffb22e" />
    <circle cx={x + 3.5} cy={y + 3} r="0.8" fill="#fff" />
  </g>
);

/** Turkis alien på ferie — står den stille, tager den billeder med blitz. */
const touristAlien: CreatureSpec = {
  name: "Turist-alien",
  rarity: "rare",
  height: 23.6,
  aspect: 140 / 186,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 -36 140 186",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{alienBenBag(TURKIS)}</g>
      <g className="zoo-torso">
        {alienKrop(TURKIS)}
        {hawaiiskjorte}
        {/* Kameraet hænger i en rem om halsen. */}
        <path d="M78 93 C 74 86, 72 82, 72 78 M94 93 C 92 86, 90 82, 88 76" stroke="#2b2f3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {kamera(76, 92)}
        {/* Armen hænger ned langs siden. */}
        <path d="M64 88 C 66 98, 68 104, 68 110" stroke={TURKIS.benFor} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="68" cy="111" r="5.5" fill={TURKIS.benFor} />
        {aerme}
      </g>
      <g className="zoo-leg zoo-leg-b">{alienBenFor(TURKIS)}</g>
      <g className="zoo-head">
        {alienHoved(TURKIS)}
        {alienOeje(68, 52)}
        {alienOeje(88, 50)}
        {alienOeje(78, 33)}
        {alienSmil(TURKIS)}
        {solhat}
      </g>
    </>
  ),
  special: (
    <>
      {alienBenBag(TURKIS)}
      {alienKrop(TURKIS)}
      {hawaiiskjorte}
      {alienBenFor(TURKIS)}
      {alienHoved(TURKIS)}
      {alienOeje(68, 52, 3, -2)}
      {alienOeje(78, 33, 3, -2)}
      {alienOeje(88, 50)}
      {alienJubel(TURKIS)}
      {solhat}
      {/* Kameraet holdes op til det forreste øje. */}
      {kamera(94, 42)}
      {/* Armen løfter kameraet. */}
      <path d="M64 88 C 78 94, 94 80, 100 62" stroke={TURKIS.benFor} strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="101" cy="58" r="5.5" fill={TURKIS.benFor} />
      {aerme}
      {/* Blitzen blinker med et stort hvidt glimt. */}
      <g className="zoo-fx-sparkle" style={fxv("0s", undefined, "1.2s")}>
        <circle cx="120" cy="32" r="10" fill="#fff" opacity="0.45" />
        {GLIMT(120, 32, 18, "#fff")}
        {GLIMT(120, 32, 8, "#fff6c0")}
      </g>
      {/* Fotos og hjerter stiger op. */}
      <g className="zoo-fx-rise" style={fxv("0s", "50% 100%", "2.4s")}>
        {loeft(122, 4, 14, -34)}
        {foto(116, 4, -12)}
      </g>
      <g className="zoo-fx-rise" style={fxv("0.8s", "50% 100%", "2.4s")}>
        {loeft(132, 20, 9, -32)}
        {HJERTE(132, 24, 5, "#ff6fa8")}
      </g>
      <g className="zoo-fx-rise" style={fxv("1.6s", "50% 100%", "2.4s")}>
        {loeft(98, 0, 14, -34)}
        {foto(92, 0, 10)}
      </g>
      <g className="zoo-fx-rise" style={fxv("1.2s", "50% 100%", "2.4s")}>
        {loeft(84, -6, 8, -32)}
        {HJERTE(84, -2, 4.5, "#ff9fd0")}
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Kokke-tentaklen                                                          */
/* ------------------------------------------------------------------------ */

const TENTAKEL = "#35c5d6";
const TENTAKEL_MOERK = "#1fa3b8";
const TENTAKEL_LYS = "#6fe0ec";
const HUE_SKYGGE = "#dfe3ee";
const TRAE = "#c98a3c";
const TRAE_LYS = "#e6ac5e";
const PEBER = "#7a4a2a";

/** Kokkehue med pust; sidder på toppen af kroppen. */
const kokkehue = (
  <g transform="rotate(10 76 12)">
    <circle cx="60" cy="-6" r="13" fill="#fff" stroke={HUE_SKYGGE} strokeWidth="1.5" />
    <circle cx="92" cy="-6" r="12" fill="#fff" stroke={HUE_SKYGGE} strokeWidth="1.5" />
    <circle cx="76" cy="-16" r="16" fill="#fff" stroke={HUE_SKYGGE} strokeWidth="1.5" />
    <circle cx="76" cy="-3" r="13" fill="#fff" />
    <rect x="54" y="0" width="44" height="16" rx="4" fill="#f4f6fb" stroke={HUE_SKYGGE} strokeWidth="1.5" />
    <path d="M65 3 V 13 M76 3 V 13 M87 3 V 13" stroke={HUE_SKYGGE} strokeWidth="2" strokeLinecap="round" />
  </g>
);

/** De fire tentakel-ben (som Tentakelven i creatures.tsx). `bag` er de fjerne, `for` de nære. */
const BEN_BAG = ["M94 78 C 102 92, 86 102, 94 114 C 97 119, 100 121, 102 125", "M54 78 C 62 92, 46 102, 54 114 C 57 119, 60 121, 62 125"];
const BEN_FOR = ["M108 82 C 116 96, 100 104, 108 116 C 111 120, 114 122, 116 125", "M68 84 C 76 96, 60 104, 68 116 C 71 120, 74 122, 76 125"];

const tentakelBen = (d: string, bag: boolean) => (
  <path d={d} stroke={bag ? TENTAKEL_MOERK : TENTAKEL} strokeWidth={bag ? 10 : 11} fill="none" strokeLinecap="round" />
);

const tentakelKrop = (
  <>
    <path d="M26 80 C 20 30, 54 10, 76 10 C 110 10, 130 44, 122 80 C 112 98, 38 98, 26 80 Z" fill={TENTAKEL} />
    <circle cx="46" cy="40" r="5" fill={TENTAKEL_LYS} />
    <circle cx="62" cy="26" r="3.4" fill={TENTAKEL_LYS} />
    <circle cx="40" cy="62" r="4" fill={TENTAKEL_LYS} />
  </>
);

/** Pizza set ovenfra, midt i (x, y). */
const pizza = (x: number, y: number) => (
  <>
    <circle cx={x} cy={y} r="16" fill="#e9a54a" />
    <circle cx={x} cy={y} r="13" fill="#e8553f" />
    <circle cx={x} cy={y} r="11.5" fill="#ffd45a" />
    {[
      [-5, -5],
      [5, -4],
      [0, 5],
      [-7, 4],
      [7, 5],
    ].map(([dx, dy], i) => (
      <circle key={i} cx={x + dx} cy={y + dy} r="2.6" fill="#d8402f" />
    ))}
    <ellipse cx={x + 1} cy={y - 1} rx="2.6" ry="1.3" transform={`rotate(-30 ${x + 1} ${y - 1})`} fill="#3fae4a" />
    <ellipse cx={x - 3} cy={y + 9} rx="2.4" ry="1.2" transform={`rotate(20 ${x - 3} ${y + 9})`} fill="#3fae4a" />
  </>
);

/** Dampsky (lille bølget streg), der stiger op. */
const damp = (x: number, y: number, d: string) => (
  <g className="zoo-fx-rise" style={fxv(d, "50% 100%", "1.8s")}>
    {loeft(x, y - 10, 10, y - 24)}
    <path d={`M${x} ${y} c -3 -2, 3 -3, 0 -5 c -3 -2, 3 -3, 0 -5`} stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" />
  </g>
);

/** Tentakelven med kokkehue — står den stille, kaster den pizza og laver mad med de andre arme. */
const chefTentacle: CreatureSpec = {
  name: "Kokke-tentaklen",
  rarity: "rare",
  height: 26.3,
  aspect: 180 / 214,
  gait: "walk",
  pace: 0.9,
  viewBox: "-20 -84 180 214",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">{tentakelBen(BEN_BAG[0], true)}</g>
      <g className="zoo-leg zoo-leg-b">{tentakelBen(BEN_BAG[1], true)}</g>
      <g className="zoo-torso">
        {tentakelKrop}
        {kokkehue}
      </g>
      <g className="zoo-leg zoo-leg-b">{tentakelBen(BEN_FOR[0], false)}</g>
      <g className="zoo-leg zoo-leg-a">{tentakelBen(BEN_FOR[1], false)}</g>
      <g className="zoo-head">
        <circle cx="88" cy="44" r="10.5" fill="#fff" />
        {EYE(91, 44, 5.8)}
        <circle cx="110" cy="50" r="8.5" fill="#fff" />
        {EYE(112, 50, 4.8)}
        <circle cx="104" cy="68" r="5" fill="#ff9fb8" opacity="0.55" />
        <path d="M90 66 q 10 9 20 -1" stroke="#16788a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      {/* Bageste arm vinker med grydeskeen. */}
      <g className="zoo-fx-wave" style={fxv("0s", "50% 50%", "0.8s")}>
        {omkring(30, 56, 38, 70)}
        <path d="M2 4 L 10 40" stroke={TRAE} strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="0" cy="-5" rx="5.5" ry="9" transform="rotate(-12 0 -5)" fill={TRAE_LYS} />
        <ellipse cx="0" cy="-5" rx="3" ry="5.5" transform="rotate(-12 0 -5)" fill={TRAE} />
        <path d="M32 58 C 18 58, 8 50, 8 36" stroke={TENTAKEL_MOERK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {tentakelBen(BEN_BAG[0], true)}
      {tentakelBen(BEN_BAG[1], true)}
      {tentakelKrop}
      {kokkehue}
      {tentakelBen(BEN_FOR[0], false)}
      {tentakelBen(BEN_FOR[1], false)}
      {/* Øjnene kigger op efter pizzaen. */}
      <circle cx="88" cy="44" r="10.5" fill="#fff" />
      {EYE(92, 40, 5.8)}
      <circle cx="110" cy="50" r="8.5" fill="#fff" />
      {EYE(113, 46, 4.8)}
      <circle cx="104" cy="68" r="5" fill="#ff9fb8" opacity="0.55" />
      <path d="M90 64 q 10 13 20 0 Z" fill="#16788a" />
      <path d="M95 70 q 5 3 10 0" stroke="#ff8fae" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Pizza-armen strækker sig op med flad tentakelspids. */}
      <path d="M108 22 C 124 18, 132 8, 130 -4" stroke={TENTAKEL} strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="130" cy="-5" rx="8" ry="3.5" fill={TENTAKEL} />
      <path d="M118 -12 q -3 4 0 8 M142 -12 q 3 4 0 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Pizzaen hopper (to bob-lag for et højere kast) og snurrer; dampen følger med. */}
      <g className="zoo-fx-bob" style={fxv("0s", undefined, "0.8s")}>
        {boks(150, -84, 214)}
        <g className="zoo-fx-bob" style={fxv("0s", undefined, "0.8s")}>
          {boks(150, -84, 214)}
          <g className="zoo-fx-spin" style={fxv("0s", undefined, "1.4s")}>{pizza(130, -24)}</g>
          {damp(124, -42, "0s")}
          {damp(132, -44, "0.6s")}
          {damp(140, -42, "1.2s")}
        </g>
      </g>
      {/* Forreste arm vinker med pebermøllen. */}
      <g className="zoo-fx-wave" style={fxv("0.4s", "50% 50%", "0.8s")}>
        {omkring(116, 78, 36, 46)}
        <path d="M114 82 C 128 92, 142 86, 144 72" stroke={TENTAKEL} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M138 72 C 136 62, 140 58, 140 52 C 140 48, 137 46, 138 42 L 150 42 C 151 46, 148 48, 148 52 C 148 58, 152 62, 150 72 Z" fill={PEBER} />
        <rect x="137" y="62" width="14" height="3" rx="1" fill="#c9cfd8" />
        <circle cx="144" cy="38" r="4" fill="#5a3520" />
        <circle cx="144" cy="72" r="5.5" fill={TENTAKEL} />
      </g>
    </>
  ),
};

export const specialsTwo: Record<string, CreatureSpec> = {
  stargazer,
  danceBot,
  touristAlien,
  chefTentacle,
};
