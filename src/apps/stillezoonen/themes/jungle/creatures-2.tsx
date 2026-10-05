import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Almindelige jungledyr, runde 2: kattene, aberne, de store plantespisere
 * og de små jordboere. Samme regler som i creatures.tsx: profil mod højre,
 * fødder på bunden, ben i zoo-leg-a/b (diagonal gangart), fjerne ben først.
 */

/** Leopard-rosette: åben ring af pletter med lysere midte. */
const rosetteLille = (x: number, y: number, r = 5) => (
  <circle cx={x} cy={y} r={r} fill="#e3a63f" stroke="#4a3320" strokeWidth="2.4" />
);

/** Jaguar-rosette: stor ring med en mørk prik i midten. */
const rosetteStor = (x: number, y: number, r = 7.5) => (
  <>
    <circle cx={x} cy={y} r={r} fill="#d98f2a" stroke="#3b281a" strokeWidth="3" />
    <circle cx={x} cy={y} r={r * 0.28} fill="#3b281a" />
  </>
);

const leopard: CreatureSpec = {
  name: "Leopard",
  height: 17,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 210 124",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M42 62 C 22 66, 8 52, 12 30" stroke="#efbb52" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M13 36 C 12 30, 12 26, 13 22" stroke="#4a3320" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="20" cy="62" r="2.6" fill="#4a3320" /><circle cx="12" cy="50" r="2.6" fill="#4a3320" />
      </g>
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="70" width="15" height="52" rx="7" fill="#cf9a35" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="70" width="15" height="52" rx="7" fill="#cf9a35" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="66" rx="64" ry="26" fill="#efbb52" />
        <path d="M54 78 C 80 92, 130 92, 152 80" fill="#fbe9c0" />
        {rosetteLille(66, 56)}
        {rosetteLille(84, 48)}
        {rosetteLille(103, 52)}
        {rosetteLille(122, 47)}
        {rosetteLille(138, 56)}
        {rosetteLille(76, 70, 4.5)}
        {rosetteLille(95, 66, 4.5)}
        {rosetteLille(114, 66, 4.5)}
        {rosetteLille(130, 70, 4)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="150" y="72" width="16" height="50" rx="7" fill="#efbb52" />
        <circle cx="158" cy="86" r="2.6" fill="#4a3320" /><circle cx="160" cy="100" r="2.6" fill="#4a3320" />
        <ellipse cx="160" cy="120" rx="10" ry="4" fill="#fbe9c0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="64" y="72" width="16" height="50" rx="7" fill="#efbb52" />
        <circle cx="72" cy="86" r="2.6" fill="#4a3320" /><circle cx="74" cy="100" r="2.6" fill="#4a3320" />
        <ellipse cx="74" cy="120" rx="10" ry="4" fill="#fbe9c0" />
      </g>
      <g className="zoo-head">
        <circle cx="160" cy="34" r="8" fill="#efbb52" /><circle cx="160" cy="34" r="4" fill="#4a3320" />
        <circle cx="186" cy="34" r="8" fill="#efbb52" /><circle cx="186" cy="34" r="4" fill="#4a3320" />
        <circle cx="174" cy="54" r="25" fill="#efbb52" />
        <ellipse cx="185" cy="66" rx="16" ry="11" fill="#fbe9c0" />
        <path d="M188 58 l 8 0 l -4 5 z" fill="#4a3320" />
        <circle cx="166" cy="42" r="2.4" fill="#4a3320" /><circle cx="172" cy="36" r="2.4" fill="#4a3320" />
        <circle cx="164" cy="54" r="2.4" fill="#4a3320" /><circle cx="170" cy="62" r="2.4" fill="#4a3320" />
        <path d="M174 66 q 6 5 12 1" stroke="#4a3320" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(176, 49, 3.8)}
        {EYE(191, 48, 3.3)}
      </g>
    </>
  ),
};

const jaguar: CreatureSpec = {
  name: "Jaguar",
  height: 17,
  aspect: 210 / 124,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 210 124",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M40 64 C 26 66, 16 56, 18 42" stroke="#e8a23a" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M18 48 C 17 44, 17 42, 18 40" stroke="#3b281a" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M26 56 l 6 8 M19 52 l 8 4" stroke="#3b281a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a"><rect x="136" y="72" width="19" height="50" rx="8" fill="#c98626" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="52" y="72" width="19" height="50" rx="8" fill="#c98626" /></g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="66" rx="66" ry="30" fill="#e8a23a" />
        <path d="M52 82 C 80 98, 130 98, 154 84" fill="#fbe3b8" />
        {rosetteStor(64, 58, 6.5)}
        {rosetteStor(86, 48, 7.5)}
        {rosetteStor(110, 50, 7.5)}
        {rosetteStor(132, 52, 7)}
        {rosetteStor(76, 72, 6)}
        {rosetteStor(100, 68, 6.5)}
        {rosetteStor(124, 70, 6)}
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="148" y="74" width="20" height="48" rx="8" fill="#e8a23a" />
        <circle cx="158" cy="88" r="3" fill="#3b281a" /><circle cx="160" cy="102" r="3" fill="#3b281a" />
        <ellipse cx="160" cy="120" rx="11" ry="4" fill="#fbe3b8" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="74" width="20" height="48" rx="8" fill="#e8a23a" />
        <circle cx="72" cy="88" r="3" fill="#3b281a" /><circle cx="74" cy="102" r="3" fill="#3b281a" />
        <ellipse cx="74" cy="120" rx="11" ry="4" fill="#fbe3b8" />
      </g>
      <g className="zoo-head">
        <circle cx="160" cy="32" r="8" fill="#e8a23a" /><circle cx="160" cy="32" r="4" fill="#3b281a" />
        <circle cx="187" cy="32" r="8" fill="#e8a23a" /><circle cx="187" cy="32" r="4" fill="#3b281a" />
        <circle cx="174" cy="54" r="27" fill="#e8a23a" />
        <ellipse cx="185" cy="68" rx="17" ry="12" fill="#fbe3b8" />
        <path d="M188 59 l 9 0 l -4.5 5.5 z" fill="#3b281a" />
        <circle cx="163" cy="44" r="3" fill="#3b281a" /><circle cx="170" cy="36" r="3" fill="#3b281a" />
        <circle cx="162" cy="58" r="3" fill="#3b281a" /><circle cx="170" cy="66" r="3" fill="#3b281a" />
        <path d="M175 68 q 6 5 13 1" stroke="#3b281a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(176, 49, 4)}
        {EYE(191.5, 48, 3.4)}
      </g>
    </>
  ),
};

const orangutan: CreatureSpec = {
  name: "Orangutang",
  height: 22,
  aspect: 170 / 150,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 170 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M46 104 C 44 120, 46 134, 46 143" stroke="#a8461f" strokeWidth="14" strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="146" rx="10" ry="4" fill="#6e3318" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M100 62 C 120 84, 136 114, 134 140" stroke="#a8461f" strokeWidth="12" strokeLinecap="round" fill="none" />
        <ellipse cx="137" cy="145" rx="9" ry="4.5" fill="#6e3318" />
      </g>
      <g className="zoo-torso">
        <path d="M20 100 C 16 70, 46 54, 84 52 C 112 50, 128 62, 124 86 C 120 110, 50 126, 20 100 Z" fill="#c9622b" />
        <path d="M40 72 q 6 12 0 24 M54 64 q 6 14 0 28 M68 60 q 6 14 0 28 M82 58 q 6 14 0 26" stroke="#dd8140" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M30 106 q 6 10 12 2 q 6 10 12 2 q 6 10 12 2 q 6 8 12 0 q 6 8 12 -2" stroke="#b05224" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M62 108 C 60 122, 62 134, 62 143" stroke="#c9622b" strokeWidth="16" strokeLinecap="round" fill="none" />
        <ellipse cx="66" cy="146" rx="11" ry="4" fill="#7a3a1c" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M90 70 C 110 90, 126 118, 122 141" stroke="#9a4119" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M90 70 C 110 90, 126 118, 122 141" stroke="#d8702f" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M104 88 q 6 12 4 24 M96 84 q 5 10 4 20 M114 108 q 4 8 2 16" stroke="#ee9650" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="125" cy="146" rx="10" ry="5" fill="#7a3a1c" />
      </g>
      <g className="zoo-head">
        <path d="M112 54 C 108 38, 122 30, 136 34 C 150 38, 152 56, 144 68 C 134 76, 118 70, 112 54 Z" fill="#c9622b" />
        <path d="M118 36 q 6 -7 14 -4 M108 56 q -4 8 -2 16 M112 66 q -2 6 0 12" stroke="#dd8140" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="136" cy="56" rx="11" ry="12" fill="#e0a37c" />
        <ellipse cx="126" cy="60" rx="7" ry="11" fill="#cf8c62" />
        <ellipse cx="144" cy="64" rx="8" ry="6" fill="#f2c9a6" />
        <path d="M140 68 q 4 3 8 0" stroke="#7a3a1c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="148" cy="62" r="1.2" fill="#7a3a1c" />
        {EYE(138, 51, 3)}
      </g>
    </>
  ),
};

const chimp: CreatureSpec = {
  name: "Chimpanse",
  height: 19,
  aspect: 150 / 142,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 150 142",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><path d="M42 104 v 32" stroke="#2b211e" strokeWidth="15" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M90 72 C 100 96, 102 116, 100 132" stroke="#2b211e" strokeWidth="13" strokeLinecap="round" fill="none" /></g>
      <g className="zoo-torso">
        <ellipse cx="64" cy="82" rx="38" ry="31" fill="#3b2e2a" transform="rotate(-10 64 82)" />
        <path d="M36 70 C 50 58, 70 56, 84 62" stroke="#5a463d" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M58 104 v 30" stroke="#3b2e2a" strokeWidth="17" strokeLinecap="round" /><ellipse cx="62" cy="137" rx="12" ry="4" fill="#c9a27c" /></g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M84 72 C 96 96, 98 116, 96 130" stroke="#3b2e2a" strokeWidth="15" strokeLinecap="round" fill="none" />
        <ellipse cx="98" cy="134" rx="10" ry="6" fill="#c9a27c" />
      </g>
      <g className="zoo-head">
        <circle cx="92" cy="48" r="11" fill="#d6a97d" /><circle cx="92" cy="48" r="6" fill="#bf8c62" />
        <circle cx="108" cy="46" r="23" fill="#3b2e2a" />
        <path d="M100 26 q 6 -6 14 -3" stroke="#5a463d" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M104 40 C 106 34, 120 32, 126 40 C 134 46, 134 62, 124 68 C 114 72, 102 66, 100 56 C 98 50, 100 44, 104 40 Z" fill="#dcb48a" />
        <ellipse cx="126" cy="60" rx="11" ry="9" fill="#ecd0b0" />
        <path d="M104 40 q 12 -6 22 0" stroke="#3b2e2a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="130" cy="56" r="1.5" fill="#6a4a38" />
        <path d="M118 66 q 6 4 12 0" stroke="#6a4a38" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {EYE(114, 47, 3.4)}
      </g>
    </>
  ),
};

const mandrill: CreatureSpec = {
  name: "Mandril",
  height: 15,
  aspect: 190 / 130,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 190 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><rect x="40" y="76" width="15" height="52" rx="7" fill="#5f5139" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="116" y="76" width="14" height="52" rx="7" fill="#5f5139" /></g>
      <g className="zoo-tail"><path d="M28 62 q -10 -4 -12 -14" stroke="#7b6a50" strokeWidth="6" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="84" cy="68" rx="58" ry="30" fill="#8a7757" />
        <path d="M50 50 C 76 40, 110 42, 132 54" stroke="#a08b68" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="32" cy="76" rx="13" ry="15" fill="#d6455a" />
        <ellipse cx="32" cy="80" rx="8" ry="8" fill="#4a73d4" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="52" y="78" width="17" height="50" rx="7" fill="#8a7757" /><ellipse cx="62" cy="126" rx="11" ry="4" fill="#5f5139" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="128" y="78" width="17" height="50" rx="7" fill="#8a7757" /><ellipse cx="138" cy="126" rx="11" ry="4" fill="#5f5139" /></g>
      <g className="zoo-head">
        <circle cx="130" cy="52" r="9" fill="#8a7757" /><circle cx="130" cy="52" r="4.5" fill="#d9b08a" />
        <circle cx="144" cy="52" r="27" fill="#8a7757" />
        <path d="M126 32 C 134 20, 152 22, 158 32 C 148 30, 138 30, 126 32 Z" fill="#c4a05a" />
        <path d="M128 70 C 134 92, 158 98, 176 78 C 168 82, 158 84, 150 78 Z" fill="#f5b83a" />
        <path d="M148 52 C 160 46, 180 48, 187 58 C 190 70, 182 80, 168 80 C 154 80, 146 72, 146 62 Z" fill="#3f78d8" />
        <path d="M154 60 l 6 10 M163 58 l 6 11 M172 58 l 6 10" stroke="#2a58b0" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M152 48 C 164 46, 178 50, 185 57" stroke="#e0262e" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="186" cy="60" r="6.5" fill="#e0262e" />
        <circle cx="187" cy="58" r="1.4" fill="#7a1018" />
        <path d="M142 38 q 8 -5 16 -1" stroke="#5f5139" strokeWidth="4" fill="none" strokeLinecap="round" />
        {EYE(150, 42, 3.3)}
      </g>
    </>
  ),
};

const lemur: CreatureSpec = {
  name: "Ringhalet lemur",
  height: 12,
  aspect: 200 / 110,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 200 110",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M54 66 C 14 70, 4 32, 30 20 C 48 12, 62 26, 54 40" stroke="#f1eee6" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M54 66 C 14 70, 4 32, 30 20 C 48 12, 62 26, 54 40" stroke="#26262b" strokeWidth="13" fill="none" strokeDasharray="7 7" strokeDashoffset="3" />
        <circle cx="54" cy="40" r="6.5" fill="#26262b" />
      </g>
      <g className="zoo-leg zoo-leg-a"><path d="M128 78 v 26" stroke="#7d838b" strokeWidth="9" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M66 78 v 26" stroke="#7d838b" strokeWidth="9" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="96" cy="68" rx="44" ry="21" fill="#9ca1a8" />
        <ellipse cx="100" cy="78" rx="34" ry="11" fill="#ece9e2" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M138 78 v 26" stroke="#9ca1a8" strokeWidth="10" strokeLinecap="round" /><ellipse cx="141" cy="106" rx="8" ry="3.5" fill="#4a4d54" /></g>
      <g className="zoo-leg zoo-leg-a"><path d="M76 78 v 26" stroke="#9ca1a8" strokeWidth="10" strokeLinecap="round" /><ellipse cx="79" cy="106" rx="8" ry="3.5" fill="#4a4d54" /></g>
      <g className="zoo-head">
        <circle cx="146" cy="28" r="7" fill="#9ca1a8" /><circle cx="146" cy="28" r="3.5" fill="#f4f1ea" />
        <ellipse cx="156" cy="46" rx="22" ry="19" fill="#9ca1a8" />
        <ellipse cx="160" cy="52" rx="18" ry="13" fill="#f4f1ea" />
        <ellipse cx="173" cy="55" rx="14" ry="8.5" fill="#f4f1ea" />
        <ellipse cx="156" cy="43" rx="8.5" ry="7.5" fill="#26262b" transform="rotate(-20 156 43)" />
        <circle cx="157" cy="43" r="5" fill="#f3a93a" />
        {EYE(157, 43, 2.8)}
        <ellipse cx="185" cy="53" rx="4.4" ry="3.4" fill="#26262b" />
        <path d="M168 60 q 6 4 12 0" stroke="#7d838b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const gibbon: CreatureSpec = {
  name: "Gibbon",
  height: 19,
  aspect: 120 / 170,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 120 170",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M54 130 C 50 142, 50 154, 50 163" stroke="#b8935a" strokeWidth="11" strokeLinecap="round" fill="none" />
        <ellipse cx="56" cy="166" rx="10" ry="4" fill="#3a2c26" />
      </g>
      <g className="zoo-torso">
        <path d="M66 74 C 76 92, 80 108, 78 124" stroke="#b8935a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="78" cy="126" r="5" fill="#3a2c26" />
        <ellipse cx="58" cy="98" rx="17" ry="34" fill="#d8b878" />
        <ellipse cx="66" cy="104" rx="9" ry="22" fill="#ecd9a8" />
        <path d="M52 72 C 34 72, 20 58, 14 40" stroke="#d8b878" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="13" cy="37" r="6" fill="#3a2c26" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M62 132 C 60 144, 62 154, 62 163" stroke="#d8b878" strokeWidth="12" strokeLinecap="round" fill="none" />
        <ellipse cx="69" cy="166" rx="10.5" ry="4" fill="#3a2c26" />
      </g>
      <g className="zoo-head">
        <circle cx="60" cy="52" r="18" fill="#d8b878" />
        <path d="M46 40 q 6 -9 18 -7" stroke="#b8935a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="54" r="5" fill="#b8935a" />
        <ellipse cx="72" cy="53" rx="11" ry="13" fill="#5b4538" />
        <ellipse cx="72" cy="53" rx="11" ry="13" fill="none" stroke="#fbf6ea" strokeWidth="3.5" />
        <circle cx="75" cy="48" r="4.6" fill="#fff" />
        {EYE(76, 48, 3)}
        <ellipse cx="82" cy="56" rx="3.6" ry="3" fill="#3a2c26" />
        <path d="M72 61 q 4 3 8 0" stroke="#fbf6ea" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const rhino: CreatureSpec = {
  name: "Næsehorn",
  height: 24,
  aspect: 220 / 140,
  gait: "walk",
  pace: 0.65,
  viewBox: "0 0 220 140",
  art: (
    <>
      <g className="zoo-tail"><path d="M30 68 C 20 80, 20 92, 24 100" stroke="#737d88" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M24 98 l -5 8 l 9 -3 z" fill="#4f5862" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="40" y="90" width="26" height="48" rx="9" fill="#737d88" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="128" y="92" width="26" height="46" rx="9" fill="#737d88" /></g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="74" rx="68" ry="44" fill="#8f99a4" />
        <path d="M122 40 C 134 60, 134 86, 126 108" stroke="#7a848f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M50 50 C 42 70, 42 90, 50 106" stroke="#7a848f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M52 108 C 76 124, 118 124, 140 108" stroke="#7a848f" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="54" y="94" width="28" height="44" rx="9" fill="#8f99a4" /><path d="M58 134 h20" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="142" y="94" width="28" height="44" rx="9" fill="#8f99a4" /><path d="M146 134 h20" stroke="#e9e4d8" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <path d="M140 42 L 142 22 L 158 38 Z" fill="#7a848f" /><path d="M144 38 L 145 29 L 152 37 Z" fill="#d9a6a6" opacity="0.7" />
        <path d="M138 46 C 158 34, 188 46, 204 80 C 210 94, 202 104, 188 104 C 164 104, 142 92, 134 76 Z" fill="#a1abb6" />
        <path d="M168 54 C 172 46, 178 42, 184 40 C 186 48, 186 54, 184 60 Z" fill="#efe6d0" />
        <path d="M188 66 C 190 54, 196 44, 204 36 C 208 48, 210 64, 207 80 Z" fill="#f4ecd8" />
        <path d="M198 52 q 4 14 8 22" stroke="#d8cdb2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="190" cy="84" rx="4" ry="2.5" fill="#6a737d" />
        <circle cx="172" cy="80" r="6" fill="#e6a4a4" opacity="0.4" />
        <path d="M176 94 q 10 5 22 -2" stroke="#6a737d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {EYE(166, 66, 4)}
      </g>
    </>
  ),
};

const hippo: CreatureSpec = {
  name: "Flodhest",
  height: 22,
  aspect: 220 / 120,
  gait: "walk",
  pace: 0.6,
  viewBox: "0 0 220 120",
  art: (
    <>
      <g className="zoo-tail"><path d="M20 62 q -8 2 -10 12" stroke="#8d7f99" strokeWidth="6" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="44" y="86" width="26" height="32" rx="10" fill="#8d7f99" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="126" y="86" width="26" height="32" rx="10" fill="#8d7f99" /></g>
      <g className="zoo-torso">
        <ellipse cx="88" cy="64" rx="72" ry="44" fill="#a99bb5" />
        <path d="M30 86 C 56 106, 124 106, 150 86" fill="#d6c3d0" opacity="0.8" />
        <path d="M50 38 C 70 30, 104 30, 126 40" stroke="#bcaec6" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="56" y="88" width="28" height="30" rx="10" fill="#a99bb5" /><path d="M60 114 h20" stroke="#efe6e2" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="138" y="88" width="28" height="30" rx="10" fill="#a99bb5" /><path d="M142 114 h20" stroke="#efe6e2" strokeWidth="4" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <circle cx="150" cy="32" r="6.5" fill="#a99bb5" /><circle cx="150" cy="32" r="3.2" fill="#d9a6b4" />
        <path d="M144 48 C 152 30, 178 26, 198 34 C 214 40, 218 64, 212 84 C 206 98, 160 102, 146 92 C 136 82, 136 60, 144 48 Z" fill="#a99bb5" />
        <circle cx="168" cy="32" r="9" fill="#a99bb5" />
        <ellipse cx="192" cy="74" rx="26" ry="24" fill="#c7b4c6" />
        <circle cx="204" cy="58" r="2.8" fill="#5e5068" /><circle cx="194" cy="56" r="2.8" fill="#5e5068" />
        <path d="M172 82 q 20 12 40 -2" stroke="#5e5068" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M200 83 l 3 7 l 4 -7 z" fill="#fffaf0" />
        <circle cx="168" cy="72" r="7" fill="#e6a4b4" opacity="0.45" />
        {EYE(170, 32, 3.6)}
      </g>
    </>
  ),
};

/** Okapiens zebrastriber: lyse ben med mørke bånd. */
const okapiBen = (x: number, y: number, w: number, fill: string, stribe: string) => (
  <>
    <rect x={x} y={y} width={w} height={178 - y} rx="6" fill={fill} />
    <path
      d={`M${x} ${y + 12} h${w} M${x} ${y + 24} h${w} M${x} ${y + 36} h${w} M${x} ${y + 48} h${w}`}
      stroke={stribe}
      strokeWidth="4.5"
    />
    <rect x={x} y="170" width={w} height="8" rx="3" fill="#3a2820" />
  </>
);

const okapi: CreatureSpec = {
  name: "Okapi",
  height: 21,
  aspect: 200 / 180,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 200 180",
  art: (
    <>
      <g className="zoo-tail"><path d="M36 78 q -10 6 -10 26" stroke="#4a2f24" strokeWidth="5" fill="none" strokeLinecap="round" /><ellipse cx="26" cy="106" rx="4" ry="7" fill="#2f1f19" /></g>
      <g className="zoo-leg zoo-leg-a">{okapiBen(48, 96, 14, "#cdbd9e", "#3a2820")}</g>
      <g className="zoo-leg zoo-leg-b">{okapiBen(124, 98, 14, "#cdbd9e", "#3a2820")}</g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="80" rx="58" ry="30" fill="#5c3b2e" />
        <g stroke="#efe4cd" strokeWidth="4" strokeLinecap="round">
          <path d="M44 74 h 18" /><path d="M42 84 h 22" /><path d="M44 94 h 20" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">{okapiBen(64, 98, 15, "#f1e6cf", "#3a2820")}</g>
      <g className="zoo-leg zoo-leg-a">{okapiBen(132, 100, 16, "#f1e6cf", "#3a2820")}</g>
      <g className="zoo-head">
        <path d="M118 70 C 124 46, 134 32, 146 28 L 168 42 C 158 54, 154 70, 154 86 C 140 94, 126 90, 118 70 Z" fill="#6a4536" />
        <path d="M156 16 v -8 M166 16 v -8" stroke="#4a2f24" strokeWidth="5" strokeLinecap="round" />
        <circle cx="156" cy="7" r="3.2" fill="#2f1f19" /><circle cx="166" cy="7" r="3.2" fill="#2f1f19" />
        <path d="M144 22 C 134 14, 126 20, 126 28 C 134 32, 144 30, 148 28 Z" fill="#6a4536" />
        <path d="M138 24 C 134 22, 132 24, 132 27 C 136 28, 140 28, 142 27 Z" fill="#d9a6a6" opacity="0.7" />
        <path d="M146 20 C 158 12, 178 20, 190 36 C 194 44, 186 50, 176 48 C 162 46, 148 40, 146 20 Z" fill="#7a4f3a" />
        <ellipse cx="184" cy="42" rx="9" ry="6.5" fill="#d6b894" transform="rotate(25 184 42)" />
        <ellipse cx="190" cy="44" rx="3.6" ry="2.6" fill="#2f1f19" />
        <path d="M168 30 l 8 6" stroke="#efe4cd" strokeWidth="3" strokeLinecap="round" />
        {EYE(170, 28, 3.6)}
      </g>
    </>
  ),
};

const anteater: CreatureSpec = {
  name: "Myreslug",
  height: 14,
  aspect: 240 / 100,
  gait: "walk",
  pace: 0.75,
  viewBox: "0 0 240 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M72 42 C 44 30, 14 48, 6 80 C 4 92, 18 98, 40 90 C 60 82, 76 66, 80 50 Z" fill="#6d6054" />
        <path d="M60 46 C 40 48, 24 62, 18 84 M70 52 C 54 60, 40 72, 34 88" stroke="#8a7b6c" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a"><rect x="78" y="60" width="15" height="38" rx="7" fill="#5f5348" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="146" y="62" width="14" height="36" rx="7" fill="#d8ccb2" /></g>
      <g className="zoo-torso">
        <ellipse cx="112" cy="54" rx="56" ry="28" fill="#8d7d6c" />
        <path d="M70 36 C 94 28, 124 28, 146 38" stroke="#a39382" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M124 26 C 144 40, 154 58, 152 78" stroke="#f2ede2" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M124 26 C 144 40, 154 58, 152 78" stroke="#2a2522" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="92" y="62" width="16" height="36" rx="7" fill="#8d7d6c" /><path d="M98 96 h10" stroke="#2a2522" strokeWidth="3" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="132" y="64" width="16" height="34" rx="7" fill="#ece1c8" />
        <path d="M132 76 h16" stroke="#2a2522" strokeWidth="4" />
        <path d="M134 98 l 12 0 M138 98 l 8 -2" stroke="#2a2522" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M150 28 C 170 30, 200 48, 226 62 C 232 66, 230 74, 222 74 C 196 74, 170 72, 152 66 C 142 56, 142 36, 150 28 Z" fill="#8d7d6c" />
        <path d="M166 62 C 190 68, 210 72, 224 72 C 214 76, 190 76, 168 70 Z" fill="#b2a591" />
        <circle cx="150" cy="30" r="6" fill="#6d6054" />
        <circle cx="227" cy="67" r="3.4" fill="#2a2522" />
        <path d="M200 70 q 10 3 20 0" stroke="#6d6054" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(168, 46, 3.2)}
      </g>
    </>
  ),
};

const armadillo: CreatureSpec = {
  name: "Bæltedyr",
  height: 9,
  aspect: 130 / 80,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 130 80",
  art: (
    <>
      <g className="zoo-tail"><path d="M20 52 C 10 56, 6 62, 4 68" stroke="#cdb7a0" strokeWidth="6" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="76" y="54" width="11" height="24" rx="5" fill="#b6a08a" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="36" y="54" width="11" height="24" rx="5" fill="#b6a08a" /></g>
      <g className="zoo-torso">
        <ellipse cx="58" cy="56" rx="40" ry="11" fill="#d5bfa8" />
        <path d="M16 56 C 14 28, 38 14, 62 14 C 88 14, 104 34, 102 56 Z" fill="#a9998a" />
        <path d="M30 24 C 40 16, 54 14, 66 14" stroke="#c4b6a8" strokeWidth="4" fill="none" strokeLinecap="round" />
        <g stroke="#7f6f60" strokeWidth="2.6" fill="none" strokeLinecap="round">
          <path d="M30 22 C 36 34, 36 46, 32 56" />
          <path d="M44 16 C 50 30, 50 46, 46 56" />
          <path d="M58 14 C 64 30, 64 46, 60 56" />
          <path d="M72 15 C 78 30, 78 46, 74 56" />
          <path d="M86 20 C 92 32, 92 46, 90 56" />
        </g>
        <path d="M16 56 H 102" stroke="#7f6f60" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><rect x="48" y="56" width="12" height="22" rx="5" fill="#d5bfa8" /><path d="M50 77 h9" stroke="#7f6f60" strokeWidth="2.5" strokeLinecap="round" /></g>
      <g className="zoo-leg zoo-leg-a"><rect x="88" y="56" width="12" height="22" rx="5" fill="#d5bfa8" /><path d="M90 77 h9" stroke="#7f6f60" strokeWidth="2.5" strokeLinecap="round" /></g>
      <g className="zoo-head">
        <ellipse cx="96" cy="33" rx="5" ry="9" fill="#d5bfa8" transform="rotate(-14 96 33)" />
        <ellipse cx="96" cy="34" rx="2.4" ry="5.5" fill="#d9a6a6" opacity="0.7" transform="rotate(-14 96 34)" />
        <path d="M92 40 C 102 36, 114 42, 124 54 C 126 60, 120 64, 110 64 C 98 64, 90 58, 90 50 Z" fill="#d5bfa8" />
        <path d="M92 40 C 100 36, 106 38, 108 42 C 102 44, 96 46, 92 46 Z" fill="#a9998a" />
        <circle cx="123" cy="57" r="2.4" fill="#4a3a30" />
        <path d="M108 62 q 6 3 12 0" stroke="#7f6f60" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(106, 50, 2.9)}
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  leopard,
  jaguar,
  orangutan,
  chimp,
  mandrill,
  lemur,
  gibbon,
  rhino,
  hippo,
  okapi,
  anteater,
  armadillo,
};
