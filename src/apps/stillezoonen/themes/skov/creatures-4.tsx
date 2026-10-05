import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Den danske skov: almindelige smådyr. Sommerfugle og vandnymfe er set oppefra
 * med spejlede vinger; humlebi og flagermus ses fra siden; myre, edderkop og
 * sankthansorm kravler (bunden af viewBox = jorden).
 */

const MORK = "#2e2622";

/** Tynd, afrundet streg til ben. */
const streg = (d: string, farve: string, bredde = 3) => (
  <path d={d} stroke={farve} strokeWidth={bredde} fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

/* ---------- Dagpåfugleøje ---------- */

/** Øjeplet: gul kant, blå midte, sort pupil og et lille lysglimt. */
const pavePlet = (cx: number, cy: number, r: number) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="#f3dc8a" />
    <circle cx={cx} cy={cy} r={r * 0.72} fill="#2c2420" />
    <circle cx={cx} cy={cy} r={r * 0.56} fill="#4a74d0" />
    <circle cx={cx} cy={cy} r={r * 0.3} fill="#1d1a17" />
    <circle cx={cx - r * 0.2} cy={cy - r * 0.22} r={r * 0.13} fill="#fff" />
  </>
);

const paveVinger = (
  <>
    {/* bagvinge */}
    <path
      d="M70 48 C 52 46, 28 38, 16 26 C 12 16, 22 10, 36 14 C 54 20, 66 34, 71 46 Z"
      fill="#c9472c"
      stroke="#3d2623"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M62 46 C 48 40, 34 32, 26 22" stroke="#e0693f" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
    {pavePlet(34, 26, 6.6)}
    {/* forvinge */}
    <path
      d="M84 46 C 92 34, 98 18, 91 7 C 76 4, 56 12, 50 26 C 52 36, 62 44, 72 47 Z"
      fill="#c9472c"
      stroke="#3d2623"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path d="M78 44 C 74 34, 66 24, 62 18" stroke="#e0693f" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
    <path d="M58 24 C 62 16, 72 11, 82 10" stroke="#3d2623" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
    {pavePlet(82, 20, 6)}
    <ellipse cx="74" cy="44" rx="9" ry="3" fill="#7a2a20" opacity="0.65" />
  </>
);

const peacockButterfly: CreatureSpec = {
  name: "Dagpåfugleøje",
  height: 5,
  aspect: 120 / 100,
  gait: "float",
  zone: "open",
  pace: 0.9,
  viewBox: "0 0 120 100",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.4s" } as CSSProperties}>
        {paveVinger}
        <g transform="matrix(1 0 0 -1 0 100)">{paveVinger}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="66" cy="50" rx="26" ry="5" fill="#4a3228" />
        <ellipse cx="70" cy="48.4" rx="14" ry="1.6" fill="#6a4a3a" />
      </g>
      <g className="zoo-head">
        <circle cx="97" cy="50" r="7" fill="#4a3228" />
        <path
          d="M99 44 C 104 36, 110 32, 114 28 M99 56 C 104 64, 110 68, 114 72"
          stroke="#4a3228"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="114" cy="28" r="2.4" fill="#4a3228" />
        <circle cx="114" cy="72" r="2.4" fill="#4a3228" />
        {EYE(100, 46.5, 2.5)}
        {EYE(100, 53.5, 2.5)}
      </g>
    </>
  ),
};

/* ---------- Citronsommerfugl ---------- */

const citronVinger = (
  <>
    {/* bagvinge med en lille spids */}
    <path
      d="M70 48 C 54 45, 34 38, 12 21 C 18 13, 32 12, 44 18 C 58 25, 66 36, 71 46 Z"
      fill="#f1e04a"
      stroke="#c9b52a"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M64 46 C 52 40, 38 30, 26 22" stroke="#fbf3a6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M66 42 C 52 34, 40 26, 30 24" stroke="#c9b52a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="42" cy="28" r="2.2" fill="#ee8a2e" />
    {/* forvinge */}
    <path
      d="M84 46 C 92 32, 98 18, 93 6 C 78 8, 58 17, 52 30 C 56 40, 66 45, 72 47 Z"
      fill="#f1e04a"
      stroke="#c9b52a"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M80 44 C 76 34, 70 24, 66 17" stroke="#fbf3a6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
    <path d="M70 44 C 70 34, 76 22, 86 14" stroke="#c9b52a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="78" cy="30" r="2.2" fill="#ee8a2e" />
  </>
);

const brimstone: CreatureSpec = {
  name: "Citronsommerfugl",
  height: 5,
  aspect: 120 / 100,
  gait: "float",
  zone: "open",
  pace: 0.9,
  viewBox: "0 0 120 100",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.4s" } as CSSProperties}>
        {citronVinger}
        <g transform="matrix(1 0 0 -1 0 100)">{citronVinger}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="66" cy="50" rx="26" ry="4.6" fill="#6a5a34" />
        <ellipse cx="70" cy="48.6" rx="14" ry="1.5" fill="#8c7a4a" />
      </g>
      <g className="zoo-head">
        <circle cx="97" cy="50" r="6.6" fill="#6a5a34" />
        <path
          d="M99 44 C 104 36, 110 32, 114 28 M99 56 C 104 64, 110 68, 114 72"
          stroke="#6a5a34"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="114" cy="28" r="2.4" fill="#ee8a2e" />
        <circle cx="114" cy="72" r="2.4" fill="#ee8a2e" />
        {EYE(100, 46.6, 2.4)}
        {EYE(100, 53.4, 2.4)}
      </g>
    </>
  ),
};

/* ---------- Humlebi ---------- */

const bumblebee: CreatureSpec = {
  name: "Humlebi",
  height: 3.5,
  aspect: 84 / 66,
  gait: "float",
  zone: "open",
  pace: 1.0,
  viewBox: "0 0 84 66",
  art: (
    <>
      {/* små vinger, rodfæstet i ryggen */}
      <g className="zoo-wing" style={{ "--flap": "0.07s", transformOrigin: "52% 100%" } as CSSProperties}>
        <path
          d="M36 26 C 22 24, 10 12, 14 4 C 26 2, 38 12, 36 26 Z"
          fill="#e4f4fb"
          fillOpacity="0.85"
          stroke="#a9d3e6"
          strokeWidth="1"
        />
        <path
          d="M38 26 C 38 14, 46 4, 56 6 C 58 14, 50 24, 38 26 Z"
          fill="#f3fbff"
          fillOpacity="0.9"
          stroke="#a9d3e6"
          strokeWidth="1"
        />
      </g>
      <path d="M22 56 L 20 63 M34 58 L 34 64 M46 56 L 49 62" stroke="#2f2622" strokeWidth="2.6" strokeLinecap="round" />
      <g className="zoo-torso">
        <Klip form={<ellipse cx="34" cy="40" rx="28" ry="19" />}>
          <rect x="0" y="0" width="84" height="66" fill="#f2c230" />
          {/* hvid hale, sorte og gule bælter */}
          <rect x="0" y="0" width="15" height="66" fill="#f8f4e6" />
          <rect x="15" y="0" width="12" height="66" fill="#2f2622" />
          <rect x="41" y="0" width="12" height="66" fill="#2f2622" />
          <ellipse cx="34" cy="56" rx="26" ry="5" fill="#c8961c" opacity="0.5" />
        </Klip>
      </g>
      <g className="zoo-head">
        <path d="M63 32 C 62 26, 66 22, 71 22" stroke="#2f2622" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="71" cy="22" r="2" fill="#2f2622" />
        <circle cx="62" cy="42" r="12" fill="#2f2622" />
        <circle cx="58" cy="49" r="3.6" fill="#f09d8a" opacity="0.7" />
        <circle cx="66" cy="38" r="4.8" fill="#fff" />
        {EYE(67, 38, 3.6)}
        <path d="M63 49 C 66 52, 70 51, 72 48" stroke="#fff3d6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Blåbåndet pragtvandnymfe ---------- */

const nymfeVinger = (
  <>
    {/* bagvinge */}
    <path
      d="M82 43 C 68 28, 46 20, 28 22 C 22 30, 36 41, 58 46 Z"
      fill="#2b3f8f"
      fillOpacity="0.9"
      stroke="#1d2b6a"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M76 43 C 62 34, 46 28, 34 26" stroke="#4a66c0" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* forvinge */}
    <path
      d="M94 42 C 96 22, 84 6, 66 4 C 54 6, 56 22, 70 36 C 78 41, 86 43, 94 42 Z"
      fill="#34489e"
      fillOpacity="0.9"
      stroke="#1d2b6a"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M88 40 C 84 28, 76 16, 68 10" stroke="#5876cc" strokeWidth="2" fill="none" strokeLinecap="round" />
  </>
);

const demoiselle: CreatureSpec = {
  name: "Blåbåndet pragtvandnymfe",
  height: 4,
  aspect: 132 / 90,
  gait: "float",
  zone: "open",
  pace: 1.0,
  viewBox: "0 0 132 90",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.2s" } as CSSProperties}>
        {nymfeVinger}
        <g transform="matrix(1 0 0 -1 0 90)">{nymfeVinger}</g>
      </g>
      <g className="zoo-torso">
        {/* slank, metalblå krop med bånd */}
        <ellipse cx="54" cy="45" rx="46" ry="3.8" fill="#2a86c8" />
        <ellipse cx="54" cy="43.6" rx="44" ry="1.2" fill="#6cc4ee" opacity="0.8" />
        <path d="M24 41.4 V 48.6 M38 41.4 V 48.6 M52 41.4 V 48.6 M66 41.4 V 48.6" stroke="#1d5f9a" strokeWidth="2" />
        <ellipse cx="8" cy="45" rx="3.4" ry="4" fill="#1d5f9a" />
        <ellipse cx="94" cy="45" rx="13" ry="7.6" fill="#1fa3b8" />
        <ellipse cx="96" cy="42" rx="8" ry="2.6" fill="#7fe0e4" opacity="0.7" />
      </g>
      <g className="zoo-head">
        <circle cx="114" cy="45" r="9" fill="#2a86c8" />
        <ellipse cx="116" cy="45" rx="5" ry="7" fill="#1fa3b8" />
        {EYE(116, 39, 4.2)}
        {EYE(116, 51, 4.2)}
        <path d="M121 45 Q 123 46 124 44" stroke="#1d5f9a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Rød skovmyre ---------- */

const MYRE_ROD = "#b5472e";
const MYRE_LYS = "#cf5e3a";
const MYRE_FJERN = "#5c4038";

const woodAnt: CreatureSpec = {
  name: "Rød skovmyre",
  height: 2.5,
  aspect: 100 / 60,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 100 60",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">{streg("M60 37 L 66 48 L 67 58", MYRE_FJERN)}</g>
      <g className="zoo-leg zoo-leg-b">
        {streg("M66 36 L 80 42 L 87 56", MYRE_FJERN)}
        {streg("M50 37 L 32 44 L 26 56", MYRE_FJERN)}
      </g>
      <g className="zoo-torso">
        {/* bagkrop, stilk, bryst */}
        <ellipse cx="24" cy="32" rx="20" ry="15" fill={MORK} />
        <ellipse cx="20" cy="26" rx="11" ry="5" fill="#4a3a34" />
        <circle cx="46" cy="33" r="5" fill={MYRE_ROD} />
        <ellipse cx="58" cy="30" rx="14" ry="9" fill={MYRE_ROD} />
        <ellipse cx="58" cy="26" rx="9" ry="3.4" fill={MYRE_LYS} opacity="0.8" />
      </g>
      {/* nære ben */}
      <g className="zoo-leg zoo-leg-a">
        {streg("M64 36 L 74 44 L 76 58", MORK)}
        {streg("M52 37 L 40 46 L 35 58", MORK)}
      </g>
      <g className="zoo-leg zoo-leg-b">{streg("M58 37 L 56 48 L 53 58", MORK)}</g>
      <g className="zoo-head">
        <path d="M86 14 C 88 4, 94 2, 98 6" stroke={MORK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M82 13 C 82 5, 86 2, 90 2" stroke={MORK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="27" r="14" fill={MYRE_LYS} />
        <path d="M68 24 C 68 14, 78 12, 84 14 C 76 16, 72 20, 72 28 Z" fill={MORK} opacity="0.55" />
        <path d="M90 36 L 97 38 L 92 41 Z" fill={MORK} />
        <circle cx="76" cy="34" r="3.2" fill="#f09d8a" opacity="0.55" />
        {EYE(85, 23, 4.2)}
      </g>
    </>
  ),
};

/* ---------- Dværgflagermus ---------- */

const FLAG_PELS = "#7a5638";
const FLAG_MAVE = "#b08658";
const FLAG_HUD = "#6b4a36";
const FLAG_KNOGLE = "#4a3225";

/** Læder-vinge set fra siden: fire fingre fra skulderen med bue-kanter mellem spidserne. */
const flagVinge = (hud: string, knogle: string) => (
  <>
    <path
      d="M62 50 C 62 30, 60 14, 56 2 C 54 12, 40 12, 28 6 C 28 16, 16 16, 8 22 C 10 30, 4 34, 6 42 C 16 44, 26 50, 36 56 Z"
      fill={hud}
      stroke={knogle}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M62 50 L 56 2 M62 50 L 28 6 M62 50 L 8 22 M62 50 L 6 42" stroke={knogle} strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </>
);

const pipistrelle: CreatureSpec = {
  name: "Dværgflagermus",
  height: 5,
  aspect: 110 / 74,
  gait: "float",
  zone: "open",
  pace: 1.1,
  viewBox: "0 0 110 74",
  art: (
    <>
      {/* fjern vinge (mørkere) */}
      <g className="zoo-wing" style={{ "--flap": "0.16s", transformOrigin: "100% 100%" } as CSSProperties}>
        <g transform="translate(9 0)">{flagVinge("#5a3e2e", "#3a271c")}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="54" rx="26" ry="14" fill={FLAG_PELS} />
        <ellipse cx="62" cy="60" rx="18" ry="7" fill={FLAG_MAVE} />
        <ellipse cx="34" cy="63" rx="10" ry="4" transform="rotate(14 34 63)" fill={FLAG_HUD} />
        <path d="M54 66 L 52 72 M63 67 L 62 73" stroke={FLAG_KNOGLE} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {/* nær vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.16s", transformOrigin: "100% 100%" } as CSSProperties}>
        {flagVinge(FLAG_HUD, FLAG_KNOGLE)}
      </g>
      <g className="zoo-head">
        <path d="M70 34 L 66 14 L 80 28 Z" fill={FLAG_PELS} stroke={FLAG_PELS} strokeWidth="2" strokeLinejoin="round" />
        <path d="M71 32 L 69 20 L 77 29 Z" fill="#e3a9b0" />
        <path d="M82 36 L 90 16 L 94 38 Z" fill={FLAG_PELS} stroke={FLAG_PELS} strokeWidth="2" strokeLinejoin="round" />
        <path d="M86 36 L 90 24 L 91 37 Z" fill="#e3a9b0" />
        <circle cx="82" cy="48" r="15" fill={FLAG_PELS} />
        <ellipse cx="92" cy="54" rx="9" ry="7" fill={FLAG_MAVE} />
        <ellipse cx="97.5" cy="52" rx="3" ry="2.4" fill="#3a2a22" />
        <circle cx="80" cy="56" r="3.6" fill="#f09d8a" opacity="0.6" />
        <path d="M90 59 C 93 61, 97 60, 98 57" stroke="#3a2a22" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {EYE(86, 44, 3.6)}
      </g>
    </>
  ),
};

/* ---------- Korsedderkop ---------- */

const EDDER_NAER = "#6e4a2e";
const EDDER_FJERN = "#4f3520";

const crossSpider: CreatureSpec = {
  name: "Korsedderkop",
  height: 3,
  aspect: 110 / 66,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 110 66",
  art: (
    <>
      {/* fjerne ben (mørke) */}
      <g className="zoo-leg zoo-leg-a">
        {streg("M70 48 C 70 54, 72 58, 72 64", EDDER_FJERN)}
        {streg("M62 46 C 48 52, 36 56, 28 64", EDDER_FJERN)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        {streg("M78 40 C 86 22, 94 34, 96 64", EDDER_FJERN)}
        {streg("M64 46 C 60 52, 58 58, 54 64", EDDER_FJERN)}
      </g>
      <g className="zoo-torso">
        <circle cx="38" cy="28" r="21" fill="#a8723f" />
        <path d="M18 36 C 24 50, 52 54, 58 36 C 56 48, 20 50, 18 36 Z" fill="#8a5a32" />
        <ellipse cx="30" cy="16" rx="11" ry="5" transform="rotate(-24 30 16)" fill="#c28d58" opacity="0.85" />
        {/* lyst kors af prikker */}
        <g fill="#f6ecd0">
          <circle cx="38" cy="15" r="2.6" />
          <circle cx="38" cy="23" r="3" />
          <circle cx="38" cy="32" r="3.2" />
          <circle cx="38" cy="41" r="2.6" />
          <circle cx="28.5" cy="25" r="2.6" />
          <circle cx="47.5" cy="25" r="2.6" />
        </g>
      </g>
      {/* nære ben */}
      <g className="zoo-leg zoo-leg-b">
        {streg("M76 46 C 82 36, 88 46, 86 64", EDDER_NAER)}
        {streg("M64 50 C 46 56, 28 56, 16 64", EDDER_NAER)}
      </g>
      <g className="zoo-leg zoo-leg-a">
        {streg("M80 42 C 94 20, 104 36, 104 64", EDDER_NAER)}
        {streg("M66 48 C 56 54, 46 56, 42 64", EDDER_NAER)}
      </g>
      <g className="zoo-head">
        <circle cx="74" cy="40" r="13" fill="#8a5a32" />
        <ellipse cx="72" cy="34" rx="6" ry="3" fill="#a8723f" opacity="0.9" />
        <circle cx="70" cy="46" r="3.2" fill="#f09d8a" opacity="0.55" />
        {EYE(78, 36, 4.4)}
        {EYE(86, 41, 3.2)}
        <path d="M80 47 C 83 50, 87 49, 88 46" stroke="#3a2418" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Sankthansorm ---------- */

const ORM_MORK = "#5a4030";
const ORM_LYS = "#75563f";
const GLOD = "#c8f03c";

const glowWorm: CreatureSpec = {
  name: "Sankthansorm",
  height: 2.5,
  aspect: 120 / 56,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 120 56",
  art: (
    <>
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">{streg("M66 40 L 66 48 L 64 55", "#2e2018", 2.8)}</g>
      <g className="zoo-leg zoo-leg-b">
        {streg("M80 40 L 86 48 L 87 55", "#2e2018", 2.8)}
        {streg("M52 40 L 46 48 L 44 55", "#2e2018", 2.8)}
      </g>
      <g className="zoo-torso">
        {/* glød */}
        <circle cx="30" cy="30" r="22" fill={GLOD} opacity="0.16" />
        <circle cx="30" cy="30" r="17" fill={GLOD} opacity="0.22" />
        <circle cx="30" cy="30" r="13" fill={GLOD} opacity="0.3" />
        {/* lysende bagende */}
        <ellipse cx="24" cy="30" rx="13" ry="11" fill={GLOD} />
        <ellipse cx="38" cy="30" rx="14" ry="12.5" fill={GLOD} />
        <path d="M31 18.5 C 33 26, 33 34, 31 41.5" stroke="#8fb81f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="30" cy="23" rx="16" ry="4" fill="#f2ffb0" opacity="0.75" />
        {/* mørke led */}
        <ellipse cx="53" cy="30" rx="14" ry="13" fill={ORM_MORK} />
        <ellipse cx="68" cy="30" rx="14" ry="13" fill={ORM_MORK} />
        <ellipse cx="82" cy="30" rx="12" ry="12" fill={ORM_MORK} />
        <path d="M45 19 C 48 26, 48 34, 45 41 M60 19 C 63 26, 63 34, 60 41 M74 20 C 76 27, 76 33, 74 40" stroke="#3e2b20" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="53" cy="22" rx="8" ry="3" fill={ORM_LYS} />
        <ellipse cx="68" cy="22" rx="8" ry="3" fill={ORM_LYS} />
        <ellipse cx="82" cy="22" rx="7" ry="3" fill={ORM_LYS} />
      </g>
      {/* nære ben */}
      <g className="zoo-leg zoo-leg-a">
        {streg("M80 40 L 86 48 L 87 55", "#2e2018", 2.8)}
        {streg("M52 40 L 46 48 L 44 55", "#2e2018", 2.8)}
      </g>
      <g className="zoo-leg zoo-leg-b">{streg("M66 40 L 66 48 L 64 55", "#2e2018", 2.8)}</g>
      <g className="zoo-head">
        <path d="M100 22 C 100 14, 104 10, 109 11 M96 21 C 94 13, 96 8, 101 6" stroke="#2e2018" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="98" cy="31" r="11" fill="#4a3224" />
        <ellipse cx="96" cy="25" rx="6" ry="2.6" fill={ORM_LYS} />
        <circle cx="95" cy="38" r="3" fill="#f09d8a" opacity="0.55" />
        {EYE(102, 28, 3.6)}
        <path d="M104 36 C 106 38.5, 109 38, 110 35.5" stroke="#2e2018" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

export const yetMore: Record<string, CreatureSpec> = {
  peacockButterfly,
  brimstone,
  bumblebee,
  demoiselle,
  woodAnt,
  pipistrelle,
  crossSpider,
  glowWorm,
};
