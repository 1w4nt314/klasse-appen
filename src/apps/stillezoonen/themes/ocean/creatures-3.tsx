import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Store, almindelige havdyr: delfin, pukkelhval, hammerhaj, sæl, mantarokke,
 * havodder, pingvin, hvidhval og klumpfisk. Profil mod højre (mantarokken ses
 * skråt ovenfra/forfra). Halen ligger i `zoo-tail` yderst til venstre.
 */

/* ---------- Delfin ---------- */

const dolphinKrop = "M40 48 C 66 16, 118 8, 148 22 C 160 27, 166 34, 172 38 C 178 42, 188 43, 197 47 C 198 52, 192 55, 182 55 C 170 58, 160 66, 148 74 C 128 86, 100 86, 80 78 C 62 72, 48 62, 40 52 Z";

const dolphin: CreatureSpec = {
  name: "Delfin",
  height: 22,
  aspect: 200 / 92,
  gait: "swim",
  pace: 1.3,
  viewBox: "0 0 200 92",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M48 49 C 36 44, 24 34, 6 28 C 12 40, 14 46, 12 49 C 14 54, 12 60, 6 70 C 24 64, 36 56, 48 51 Z" fill="#5f84a8" />
      </g>
      <path d="M126 70 C 122 82, 114 90, 98 92 C 114 90, 132 84, 140 70 Z" fill="#5f84a8" />
      <path d="M130 18 C 122 8, 106 2, 88 0 C 94 10, 92 18, 86 22 Z" fill="#5f84a8" />
      <path d={dolphinKrop} fill="#7a9fc0" />
      <Klip form={<path d={dolphinKrop} />}>
        <path d="M200 50 C 172 52, 152 60, 120 66 C 90 68, 60 60, 34 50 L 34 100 L 200 100 Z" fill="#e4eff6" />
        <path d="M50 40 C 80 20, 118 14, 146 24 C 120 22, 84 28, 56 46 Z" fill="#a3c2dc" opacity="0.7" />
      </Klip>
      <path d="M196 50 C 188 54, 178 54, 170 50" stroke="#3b5a78" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M170 50 q -3 -1 -4 -4" stroke="#3b5a78" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {EYE(158, 38, 4.6)}
      <circle cx="152" cy="50" r="4" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

/* ---------- Pukkelhval ---------- */

const pukkelKrop = "M60 56 C 90 40, 120 28, 150 26 C 180 24, 210 28, 236 40 C 252 46, 258 58, 254 68 C 250 84, 230 96, 200 98 C 160 102, 110 94, 80 72 C 70 66, 64 62, 60 58 Z";

const humpbackWhale: CreatureSpec = {
  name: "Pukkelhval",
  height: 30,
  aspect: 262 / 122,
  gait: "swim",
  pace: 0.5,
  viewBox: "0 0 262 122",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M66 57 C 52 50, 38 36, 14 26 C 8 24, 4 30, 8 36 C 14 42, 14 48, 12 52 C 14 56, 14 64, 8 72 C 4 78, 8 84, 14 82 C 38 76, 52 64, 66 59 Z" fill="#24456e" />
      </g>
      <path d="M110 32 C 116 22, 124 20, 132 28 Z" fill="#24456e" />
      <path d={pukkelKrop} fill="#2f5a8c" />
      <Klip form={<path d={pukkelKrop} />}>
        <path d="M262 70 C 232 82, 190 76, 150 78 C 112 76, 84 64, 50 52 L 50 130 L 262 130 Z" fill="#d6e6f0" />
        <path d="M236 88 C 210 94, 180 94, 150 90 M238 80 C 212 86, 184 86, 152 83 M232 96 C 206 101, 178 100, 150 96" stroke="#9db9cf" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M70 52 C 100 38, 130 30, 160 28 C 130 34, 100 44, 74 58 Z" fill="#3d6ca2" opacity="0.7" />
      </Klip>
      <g fill="#7fa6cc">
        <circle cx="238" cy="42" r="2.4" />
        <circle cx="226" cy="36" r="2.4" />
        <circle cx="244" cy="52" r="2.2" />
        <circle cx="212" cy="32" r="2.2" />
      </g>
      <path d="M182 80 C 180 100, 156 118, 106 120 C 104 118, 104 116, 108 114 C 138 106, 150 94, 158 78 Z" fill="#f6fafc" />
      <path d="M172 94 C 160 106, 140 112, 114 116" stroke="#d3e1ea" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M254 66 C 242 74, 224 74, 208 66" stroke="#1d3556" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M208 66 q -3 -1 -4 -5" stroke="#1d3556" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {EYE(214, 54, 4.2)}
      <circle cx="226" cy="62" r="4.4" fill="#ff9a8a" opacity="0.45" />
    </>
  ),
};

/* ---------- Hammerhaj ---------- */

const hammerhaj: CreatureSpec = {
  name: "Hammerhaj",
  height: 22,
  aspect: 220 / 100,
  gait: "swim",
  pace: 1,
  viewBox: "0 0 220 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M58 52 C 46 42, 32 24, 6 6 C 10 24, 14 38, 22 50 C 14 60, 10 72, 8 84 C 30 76, 46 64, 58 55 Z" fill="#6a7f92" />
      </g>
      <path d="M134 32 C 126 20, 116 10, 108 4 C 106 16, 100 26, 90 34 Z" fill="#6a7f92" />
      <path d="M112 66 C 106 80, 98 88, 84 94 C 100 94, 122 86, 132 70 Z" fill="#6a7f92" />
      <path d="M56 52 C 80 34, 120 28, 176 32 L 176 66 C 130 76, 86 70, 56 56 Z" fill="#8499ab" />
      <Klip form={<path d="M56 52 C 80 34, 120 28, 176 32 L 176 66 C 130 76, 86 70, 56 56 Z" />}>
        <path d="M40 58 C 90 56, 140 58, 190 52 L 190 100 L 40 100 Z" fill="#eaf0f4" />
      </Klip>
      <path d="M150 42 q -3 7 0 14 M158 41 q -3 7 0 14 M166 40 q -3 7 0 14" stroke="#5f7386" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M170 40 C 166 20, 176 6, 192 6 C 208 6, 216 18, 210 34 L 210 62 C 216 78, 208 92, 192 92 C 176 92, 166 80, 170 58 Z" fill="#8499ab" />
      <path d="M176 66 C 176 78, 182 84, 192 84 C 186 76, 186 70, 188 60 Z" fill="#a4b6c5" opacity="0.8" />
      {EYE(199, 19, 4.4)}
      {EYE(199, 79, 4.4)}
      <path d="M190 50 q 10 10 20 0" stroke="#3f5365" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="184" cy="56" r="4" fill="#ff9a8a" opacity="0.55" />
    </>
  ),
};

/* ---------- Sæl ---------- */

const saelKrop = "M20 84 C 20 60, 52 46, 92 48 C 126 50, 146 60, 148 78 C 148 94, 124 100, 92 100 C 54 100, 20 98, 20 84 Z";

const seal: CreatureSpec = {
  name: "Sæl",
  height: 16,
  aspect: 186 / 106,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 0 186 106",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M30 78 C 20 72, 12 64, 2 62 C 6 72, 8 84, 4 94 C 16 92, 28 88, 32 84 Z" fill="#7d8a94" />
      </g>
      <path d={saelKrop} fill="#9aa8b2" />
      <Klip form={<path d={saelKrop} />}>
        <path d="M10 90 C 50 80, 100 82, 160 76 L 160 110 L 10 110 Z" fill="#dde4e8" />
        <g fill="#6f7d88">
          <circle cx="50" cy="62" r="5" />
          <circle cx="72" cy="56" r="3.6" />
          <circle cx="92" cy="62" r="5.4" />
          <circle cx="116" cy="60" r="3.8" />
          <circle cx="62" cy="74" r="3.4" />
          <circle cx="104" cy="74" r="3.4" />
        </g>
      </Klip>
      <path d="M96 82 C 92 92, 98 100, 110 98 C 114 92, 112 86, 108 80 Z" fill="#7d8a94" />
      <circle cx="128" cy="44" r="26" fill="#9aa8b2" />
      <ellipse cx="150" cy="54" rx="16" ry="13" fill="#dde4e8" />
      <ellipse cx="160" cy="46" rx="5.4" ry="4" fill="#3a4650" />
      <path d="M160 50 v 3 M160 53 q -4 4 -9 1 M160 53 q 4 4 8 1" stroke="#3a4650" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <g fill="#6f7d88"><circle cx="152" cy="46" r="1.2" /><circle cx="155" cy="49" r="1.2" /><circle cx="150" cy="50" r="1.2" /></g>
      <path d="M163 55 L 184 52 M164 58 L 185 60 M162 61 L 180 69" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      {EYE(136, 38, 6.2)}
      <circle cx="142" cy="56" r="4.6" fill="#ff9a8a" opacity="0.5" />
      <circle cx="122" cy="26" r="3.4" fill="#6f7d88" />
    </>
  ),
};

/* ---------- Mantarokke ---------- */

const mantaVinge = (
  <path d="M120 50 C 150 30, 190 26, 218 30 C 208 46, 182 72, 150 86 C 138 90, 126 92, 118 92 Z" fill="#2f4a68" />
);
const mantaBand = (
  <path d="M118 92 C 126 92, 138 90, 150 86 C 182 72, 208 46, 218 30 C 206 52, 180 80, 148 92 C 136 98, 124 98, 118 98 Z" fill="#cfe3ee" />
);
const mantaHorn = (
  <path d="M138 82 C 150 84, 158 96, 154 112 C 148 102, 142 98, 134 98 Z" fill="#2f4a68" />
);

const mantaRay: CreatureSpec = {
  name: "Mantarokke",
  height: 18,
  aspect: 220 / 118,
  gait: "float",
  pace: 0.7,
  viewBox: "0 0 220 118",
  art: (
    <>
      <path d="M110 44 C 110 28, 106 14, 108 2" stroke="#2f4a68" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="zoo-wing" style={{ "--flap": "1.2s" } as React.CSSProperties}>
        {mantaVinge}
        {mantaBand}
        <g transform="matrix(-1 0 0 1 220 0)">
          {mantaVinge}
          {mantaBand}
        </g>
      </g>
      <ellipse cx="110" cy="64" rx="31" ry="30" fill="#2f4a68" />
      <path d="M92 44 C 98 40, 106 46, 108 54 C 100 56, 94 52, 92 44 Z M128 44 C 122 40, 114 46, 112 54 C 120 56, 126 52, 128 44 Z" fill="#dbe8f0" opacity="0.85" />
      {mantaHorn}
      <g transform="matrix(-1 0 0 1 220 0)">{mantaHorn}</g>
      <path d="M80 80 C 82 72, 138 72, 140 80 C 142 100, 130 112, 110 112 C 90 112, 78 100, 80 80 Z" fill="#e6f1f6" />
      {EYE(90, 66, 4.2)}
      {EYE(130, 66, 4.2)}
      <path d="M98 94 q 12 12 24 0" stroke="#35506b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="90" cy="90" r="4" fill="#ff9a8a" opacity="0.5" />
      <circle cx="130" cy="90" r="4" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

/* ---------- Havodder ---------- */

const seaOtter: CreatureSpec = {
  name: "Havodder",
  height: 12,
  aspect: 170 / 84,
  gait: "float",
  pace: 0.6,
  viewBox: "0 0 170 84",
  art: (
    <>
      <path d="M8 78 q 10 -5 20 0 t 20 0 t 20 0 M96 80 q 10 -5 20 0 t 20 0" stroke="#d7eef8" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M30 58 C 18 56, 8 58, 2 62 C 8 68, 20 66, 32 64 Z" fill="#6b4228" />
      <path d="M22 52 C 14 42, 18 30, 27 30 C 34 32, 38 42, 34 52 Z" fill="#6b4228" />
      <path d="M32 54 C 26 44, 30 34, 38 34 C 44 36, 46 44, 42 54 Z" fill="#7d4f31" />
      <ellipse cx="80" cy="56" rx="58" ry="21" fill="#8a5a3a" />
      <ellipse cx="82" cy="48" rx="48" ry="12" fill="#b07a52" />
      <ellipse cx="91" cy="30" rx="14" ry="10" fill="#8e9aa6" />
      <path d="M82 27 C 84 22, 92 21, 98 24" stroke="#c5ced6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M112 56 C 106 52, 102 46, 102 42" stroke="#6b4228" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M72 56 C 78 52, 80 46, 80 42" stroke="#6b4228" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="102" cy="40" r="5.4" fill="#5a3520" />
      <circle cx="80" cy="40" r="5.4" fill="#5a3520" />
      <circle cx="124" cy="30" r="5.6" fill="#7d4f31" />
      <circle cx="154" cy="30" r="5.6" fill="#7d4f31" />
      <circle cx="140" cy="46" r="21" fill="#8a5a3a" />
      <ellipse cx="141" cy="49" rx="15" ry="14" fill="#f0d9b5" />
      {EYE(134, 42, 3.4)}
      {EYE(149, 42, 3.4)}
      <ellipse cx="141.5" cy="50" rx="4.4" ry="3.2" fill="#3a2418" />
      <path d="M141.5 53 q -4 5 -8 1 M141.5 53 q 4 5 8 1" stroke="#3a2418" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="131" cy="52" r="3.4" fill="#ff9a8a" opacity="0.5" />
      <circle cx="152" cy="52" r="3.4" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

/* ---------- Pingvin ---------- */

const pingvinKrop = "M30 42 C 38 16, 80 6, 112 10 C 132 12, 144 24, 146 38 C 148 56, 130 72, 106 74 C 68 78, 38 64, 30 42 Z";

const penguin: CreatureSpec = {
  name: "Pingvin",
  height: 13,
  aspect: 164 / 84,
  gait: "swim",
  pace: 1.2,
  viewBox: "0 0 164 84",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M36 50 C 24 44, 14 46, 2 38 C 4 48, 6 58, 10 66 C 20 62, 30 58, 36 56 Z" fill="#f08a1c" />
        <path d="M36 44 L 22 40 L 30 52 Z" fill="#263043" />
      </g>
      <path d={pingvinKrop} fill="#263043" />
      <Klip form={<path d={pingvinKrop} />}>
        <path d="M150 38 C 142 46, 128 40, 112 44 C 86 46, 56 46, 20 46 L 20 90 L 150 90 Z" fill="#fff6ea" />
        <path d="M60 20 C 84 10, 110 12, 126 18 C 104 16, 82 20, 64 28 Z" fill="#3d4a62" opacity="0.8" />
      </Klip>
      <path d="M142 30 C 150 30, 156 34, 158 38 C 154 42, 148 44, 142 44 Z" fill="#f08a1c" />
      <path d="M144 38 C 148 38, 153 38, 157 38" stroke="#b8560c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M108 44 C 94 44, 76 58, 56 74 C 68 80, 92 72, 112 56 Z" fill="#1c2433" />
      {EYE(130, 28, 4.2)}
      <circle cx="128" cy="45" r="4" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

/* ---------- Hvidhval ---------- */

const hvidKrop = "M46 56 C 64 38, 96 34, 118 36 C 124 22, 146 8, 172 10 C 192 12, 200 34, 196 52 C 195 60, 188 66, 178 66 C 160 82, 120 84, 94 82 C 70 80, 54 68, 46 56 Z";

const beluga: CreatureSpec = {
  name: "Hvidhval",
  height: 22,
  aspect: 200 / 98,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 0 200 98",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M50 58 C 38 54, 24 44, 8 34 C 12 46, 12 54, 8 58 C 12 64, 12 72, 8 82 C 24 72, 38 64, 50 60 Z" fill="#cadbe8" />
      </g>
      <path d={hvidKrop} fill="#f4f8fb" />
      <Klip form={<path d={hvidKrop} />}>
        <path d="M40 66 C 80 64, 140 70, 200 66 L 200 100 L 40 100 Z" fill="#d6e5ef" />
        <path d="M132 40 C 126 50, 126 62, 132 74" stroke="#cadbe8" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M60 48 C 86 38, 106 36, 118 38 C 100 40, 84 46, 66 54 Z" fill="#e4eef5" />
      </Klip>
      <path d="M104 72 C 96 82, 100 94, 114 94 C 124 92, 124 80, 118 70 Z" fill="#cadbe8" />
      <path d="M190 58 C 184 65, 176 65, 170 60" stroke="#5f7e98" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M170 60 q -3 -1 -4 -4" stroke="#5f7e98" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {EYE(176, 40, 4.4)}
      <circle cx="164" cy="52" r="4" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

/* ---------- Klumpfisk ---------- */

const klumpKrop = "M74 22 C 108 16, 138 44, 138 78 C 138 112, 108 138, 74 134 Z";

const sunfish: CreatureSpec = {
  name: "Klumpfisk",
  height: 22,
  aspect: 150 / 150,
  gait: "swim",
  pace: 0.6,
  viewBox: "0 0 150 150",
  art: (
    <>
      <path d="M86 26 C 70 14, 52 8, 34 2 C 30 22, 34 40, 46 54 Z" fill="#7d8e9b" />
      <path d="M86 130 C 70 142, 52 146, 34 148 C 30 128, 34 110, 46 100 Z" fill="#7d8e9b" />
      <g className="zoo-tail">
        <path d="M76 40 C 58 42, 54 52, 44 56 C 54 62, 42 70, 48 76 C 40 82, 52 86, 46 94 C 54 100, 62 106, 76 108 Z" fill="#9aabb8" />
      </g>
      <path d={klumpKrop} fill="#a4b3be" />
      <Klip form={<path d={klumpKrop} />}>
        <path d="M40 98 C 80 92, 120 96, 150 88 L 150 150 L 40 150 Z" fill="#e2e9ee" />
        <g fill="#8797a3" opacity="0.7">
          <circle cx="82" cy="48" r="5" />
          <circle cx="96" cy="38" r="3.4" />
          <circle cx="70" cy="62" r="3.6" />
          <circle cx="84" cy="106" r="4" />
        </g>
      </Klip>
      <ellipse cx="94" cy="92" rx="9" ry="14" fill="#8797a3" transform="rotate(-24 94 92)" />
      <path d="M134 76 C 146 76, 148 90, 134 92 Z" fill="#e2e9ee" />
      <path d="M130 94 q 4 6 10 2" stroke="#4d5e6b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="112" cy="60" r="9" fill="#fff" />
      {EYE(114, 61, 6)}
      <circle cx="116" cy="80" r="5" fill="#ff9a8a" opacity="0.5" />
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  dolphin,
  humpbackWhale,
  hammerhead: hammerhaj,
  seal,
  mantaRay,
  seaOtter,
  penguin,
  beluga,
  sunfish,
};
