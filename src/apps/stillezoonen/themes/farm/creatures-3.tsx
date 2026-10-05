import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige bondegårdsdyr: kalkun, æsel, gårdhund, gårdkat, tyr, pony,
 * lama, alpaka og ræv. Samme stil som creatures.tsx: profil mod højre, fødderne
 * på bunden af viewBox, fjerne ben først og nære ben sidst.
 */

/* ───────────────────────── Kalkun ───────────────────────── */

/** Halefjer i en vifte bag ryggen: vinkel i grader omkring (54, 88). */
const KALKUN_FJERE = [-168, -148, -128, -108, -88, -68, -48] as const;

const turkey: CreatureSpec = {
  name: "Kalkun",
  height: 13,
  aspect: 170 / 150,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 0 170 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M94 116 V 144 M84 147 H 104 M94 144 L 84 148 M94 144 L 104 148" stroke="#e0902a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M68 116 V 144 M58 147 H 78 M68 144 L 58 148 M68 144 L 78 148" stroke="#c97a1c" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        {KALKUN_FJERE.map((a, i) => (
          <g key={a} transform={`rotate(${a} 56 90)`}>
            <ellipse cx="86" cy="90" rx="30" ry="10" fill={i % 2 === 0 ? "#8a5632" : "#7a4a2a"} />
            <ellipse cx="82" cy="90" rx="17" ry="6" fill="#a8693a" />
            <ellipse cx="104" cy="90" rx="9" ry="7" fill="#ecc27a" />
          </g>
        ))}
        <ellipse cx="82" cy="96" rx="36" ry="28" fill="#8f5c36" />
        <ellipse cx="76" cy="100" rx="24" ry="15" transform="rotate(-8 76 100)" fill="#6f4426" />
        <path d="M60 96 C 72 88, 88 92, 98 100" stroke="#a8693a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M100 92 C 108 84, 112 70, 118 56" stroke="#86a8d6" strokeWidth="13" fill="none" strokeLinecap="round" />
        <ellipse cx="103" cy="100" rx="11" ry="13" fill="#9b6238" />
        <circle cx="110" cy="76" r="3.6" fill="#e0453a" />
        <circle cx="115" cy="64" r="3.4" fill="#e0453a" />
        <ellipse cx="124" cy="68" rx="5" ry="9" fill="#d63a34" />
        <circle cx="122" cy="46" r="12" fill="#86a8d6" />
        <path d="M130 42 L 144 47 L 130 53 Z" fill="#f2c24a" />
        <path d="M128 40 C 132 42, 132 50, 130 56 C 126 52, 126 44, 128 40 Z" fill="#d63a34" />
        <ellipse cx="122" cy="37" rx="5" ry="3" fill="#d63a34" />
        {EYE(124, 44, 3.2)}
      </g>
    </>
  ),
};

/* ───────────────────────── Æsel ───────────────────────── */

const donkey: CreatureSpec = {
  name: "Æsel",
  height: 20,
  aspect: 230 / 200,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 230 200",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M40 98 C 24 104, 22 128, 26 148" stroke="#7d7770" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="26" cy="156" rx="7" ry="14" fill="#4f4a45" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="140" y="124" width="14" height="76" rx="6" fill="#7f7a73" />
        <rect x="140" y="188" width="14" height="12" rx="4" fill="#3a302b" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="124" width="14" height="76" rx="6" fill="#7f7a73" />
        <rect x="44" y="188" width="14" height="12" rx="4" fill="#3a302b" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="98" cy="108" rx="62" ry="30" fill="#9c968e" />
        <ellipse cx="98" cy="130" rx="46" ry="8" fill="#e6dfd2" opacity="0.8" />
        <path d="M46 88 C 80 78, 120 78, 150 90" stroke="#6d6760" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M130 84 L 132 112" stroke="#6d6760" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="156" y="126" width="15" height="74" rx="6" fill="#9c968e" />
        <rect x="156" y="188" width="15" height="12" rx="4" fill="#3a302b" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="126" width="15" height="74" rx="6" fill="#9c968e" />
        <rect x="60" y="188" width="15" height="12" rx="4" fill="#3a302b" />
      </g>
      <g className="zoo-head">
        <path d="M122 90 L 120 76 L 130 80 L 130 66 L 138 72 L 142 56 L 148 64 L 154 48 L 158 58 L 166 42 L 170 54 L 168 66 L 150 76 L 132 94 Z" fill="#5b5651" />
        <path d="M124 90 C 134 64, 148 50, 166 46 L 192 72 C 178 82, 172 100, 160 128 Z" fill="#9c968e" />
        <ellipse cx="176" cy="30" rx="7" ry="26" transform="rotate(-16 176 30)" fill="#7f7a73" />
        <ellipse cx="176" cy="32" rx="3.2" ry="19" transform="rotate(-16 176 32)" fill="#e8b9b0" />
        <ellipse cx="194" cy="70" rx="27" ry="17" transform="rotate(38 194 70)" fill="#9c968e" />
        <ellipse cx="190" cy="31" rx="7.5" ry="26" transform="rotate(8 190 31)" fill="#9c968e" />
        <ellipse cx="190" cy="33" rx="3.4" ry="19" transform="rotate(8 190 33)" fill="#e8b9b0" />
        <ellipse cx="213" cy="85" rx="13" ry="10.5" transform="rotate(38 213 85)" fill="#e9e1d2" />
        <ellipse cx="221" cy="84" rx="2" ry="2.8" fill="#6d6760" />
        <path d="M184 52 C 188 46, 196 48, 198 54 C 192 56, 188 56, 184 52 Z" fill="#5b5651" />
        <circle cx="199" cy="66" r="7.4" fill="#e9e1d2" />
        {EYE(199, 66, 3.8)}
      </g>
    </>
  ),
};

/* ───────────────────────── Gårdhund (border collie) ───────────────────────── */

const farmDog: CreatureSpec = {
  name: "Gårdhund",
  height: 12,
  aspect: 190 / 130,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 190 130",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M46 62 C 24 64, 10 50, 14 30" stroke="#26231f" strokeWidth="12" fill="none" strokeLinecap="round" />
        <circle cx="14" cy="29" r="7.5" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="112" y="78" width="11" height="52" rx="5" fill="#1a1815" />
        <rect x="111" y="118" width="13" height="12" rx="5" fill="#d8d4cc" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="40" y="78" width="11" height="52" rx="5" fill="#1a1815" />
        <rect x="39" y="118" width="13" height="12" rx="5" fill="#d8d4cc" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="68" rx="52" ry="24" fill="#26231f" />
        <path d="M116 52 C 126 40, 138 38, 150 46 L 142 74 L 120 76 Z" fill="#26231f" />
        <ellipse cx="124" cy="78" rx="15" ry="14" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="126" y="80" width="12" height="50" rx="5" fill="#26231f" />
        <rect x="125" y="116" width="14" height="14" rx="5" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="54" y="80" width="12" height="50" rx="5" fill="#26231f" />
        <rect x="53" y="116" width="14" height="14" rx="5" fill="#fbf8f1" />
      </g>
      <g className="zoo-head">
        <ellipse cx="144" cy="46" rx="22" ry="20" fill="#26231f" />
        <path d="M126 34 C 116 14, 132 4, 146 12 C 152 16, 148 26, 144 32 C 140 30, 132 30, 126 34 Z" fill="#1a1815" />
        <path d="M134 62 C 140 74, 152 76, 158 66 C 150 64, 142 62, 134 62 Z" fill="#fbf8f1" />
        <ellipse cx="167" cy="57" rx="16" ry="10" fill="#26231f" />
        <ellipse cx="170" cy="62" rx="13" ry="8" fill="#fbf8f1" />
        <ellipse cx="165" cy="42" rx="4.5" ry="16" transform="rotate(-40 165 42)" fill="#fbf8f1" />
        <ellipse cx="181" cy="55" rx="4.6" ry="3.8" fill="#1a1815" />
        <path d="M168 69 C 170 76, 178 76, 178 68 Z" fill="#f08aa0" />
        <circle cx="151" cy="43" r="5.8" fill="#c98a3a" />
        {EYE(152, 43, 3.4)}
      </g>
    </>
  ),
};

/* ───────────────────────── Gårdkat ───────────────────────── */

const farmCat: CreatureSpec = {
  name: "Gårdkat",
  height: 8,
  aspect: 130 / 110,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 130 110",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M32 78 C 14 76, 8 54, 14 38 C 18 26, 32 24, 32 34" stroke="#e8923a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M11 56 H 18 M12 46 H 19 M16 36 L 22 40" stroke="#c4651e" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="82" y="82" width="10" height="28" rx="5" fill="#c4651e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="32" y="82" width="10" height="28" rx="5" fill="#c4651e" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="62" cy="72" rx="36" ry="22" fill="#f0a04a" />
        <ellipse cx="62" cy="86" rx="24" ry="8" fill="#f9dcae" opacity="0.8" />
        <path d="M44 54 C 46 60, 46 66, 44 72 M58 50 C 60 58, 60 66, 58 74 M72 52 C 74 60, 74 68, 72 74" stroke="#d47a28" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="94" y="82" width="11" height="28" rx="5" fill="#f0a04a" />
        <rect x="94" y="101" width="11" height="9" rx="4.5" fill="#fbeed2" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="44" y="82" width="11" height="28" rx="5" fill="#f0a04a" />
        <rect x="44" y="101" width="11" height="9" rx="4.5" fill="#fbeed2" />
      </g>
      <g className="zoo-head">
        <path d="M80 42 L 80 20 L 95 34 Z" fill="#f0a04a" />
        <path d="M83 37 L 83 27 L 90 34 Z" fill="#f1a6b0" />
        <path d="M102 34 L 112 18 L 116 44 Z" fill="#e8923a" />
        <path d="M106 36 L 112 26 L 113 40 Z" fill="#f1a6b0" />
        <circle cx="98" cy="52" r="20" fill="#f0a04a" />
        <ellipse cx="108" cy="61" rx="11" ry="8" fill="#fbeed2" />
        <path d="M92 36 L 93 43 M98 34 L 98 42 M104 36 L 103 43" stroke="#c4651e" strokeWidth="3" strokeLinecap="round" />
        <path d="M105 55 L 112 55 L 108.5 59.5 Z" fill="#e8808f" />
        <path d="M108.5 59.5 V 63 M108.5 63 C 106 66, 103 65, 102 63 M108.5 63 C 111 66, 114 65, 115 63" stroke="#8a4b2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M112 58 L 126 54 M112 61 L 127 62" stroke="#fbeed2" strokeWidth="1.4" strokeLinecap="round" />
        {EYE(99.5, 47, 3.8)}
        {EYE(114, 47, 3.3)}
      </g>
    </>
  ),
};

/* ───────────────────────── Tyr ───────────────────────── */

const bull: CreatureSpec = {
  name: "Tyr",
  height: 22,
  aspect: 240 / 160,
  gait: "walk",
  pace: 0.6,
  viewBox: "0 0 240 160",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M38 52 C 22 58, 20 84, 24 106" stroke="#3a2418" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="112" rx="7" ry="12" fill="#2a1a12" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="136" y="94" width="21" height="66" rx="8" fill="#43291b" />
        <rect x="136" y="150" width="21" height="10" rx="4" fill="#241811" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="50" y="94" width="21" height="66" rx="8" fill="#43291b" />
        <rect x="50" y="150" width="21" height="10" rx="4" fill="#241811" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="104" cy="76" rx="70" ry="38" fill="#5a3826" />
        <ellipse cx="142" cy="54" rx="34" ry="30" fill="#5a3826" />
                <ellipse cx="70" cy="58" rx="22" ry="9" fill="#6b4630" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="156" y="96" width="22" height="64" rx="8" fill="#5a3826" />
        <rect x="156" y="150" width="22" height="10" rx="4" fill="#2e211a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="68" y="96" width="22" height="64" rx="8" fill="#5a3826" />
        <rect x="68" y="150" width="22" height="10" rx="4" fill="#2e211a" />
      </g>
      <g className="zoo-head">
        <ellipse cx="170" cy="94" rx="22" ry="18" fill="#43291b" />
        <ellipse cx="168" cy="72" rx="30" ry="30" fill="#5a3826" />
        <path d="M184 62 C 178 44, 186 30, 202 28" stroke="#d9c9a4" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M198 60 C 198 40, 210 26, 228 28" stroke="#f1e6c8" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M216 24 C 222 24, 226 26, 229 30" stroke="#b9a578" strokeWidth="8" fill="none" strokeLinecap="round" />
        <ellipse cx="180" cy="66" rx="13" ry="6.5" transform="rotate(24 180 66)" fill="#43291b" />
        <ellipse cx="183" cy="66" rx="7" ry="3" transform="rotate(24 183 66)" fill="#c98e86" />
        <ellipse cx="198" cy="82" rx="27" ry="24" fill="#5a3826" />
        <circle cx="196" cy="58" r="8" fill="#7a5036" />
        <circle cx="206" cy="56" r="7" fill="#6e4833" />
        <ellipse cx="216" cy="96" rx="19" ry="14" fill="#d2ae86" />
        <ellipse cx="228" cy="92" rx="2.4" ry="3.4" fill="#7a4b3a" />
        <ellipse cx="219" cy="95" rx="2.4" ry="3.4" fill="#7a4b3a" />
        <circle cx="228" cy="103" r="6.4" fill="none" stroke="#d9b24a" strokeWidth="3" />
        {EYE(208, 76, 3.8)}
      </g>
    </>
  ),
};

/* ───────────────────────── Pony ───────────────────────── */

const pony: CreatureSpec = {
  name: "Pony",
  height: 17,
  aspect: 220 / 170,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 220 170",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M44 80 C 20 74, 6 100, 12 140 C 22 132, 28 124, 34 112 C 40 100, 48 94, 46 86 Z" fill="#5f5b60" />
        <path d="M36 88 C 22 92, 18 110, 18 128" stroke="#8d8890" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="140" y="116" width="15" height="54" rx="7" fill="#d4cfc6" />
        <rect x="140" y="160" width="15" height="10" rx="4" fill="#4b4440" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="116" width="15" height="54" rx="7" fill="#d4cfc6" />
        <rect x="46" y="160" width="15" height="10" rx="4" fill="#4b4440" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="96" cy="96" rx="62" ry="34" fill="#f4f0e8" />
        <ellipse cx="78" cy="82" rx="22" ry="14" transform="rotate(-10 78 82)" fill="#a9a39b" />
        <ellipse cx="56" cy="104" rx="10" ry="14" fill="#a9a39b" />
        <ellipse cx="120" cy="104" rx="13" ry="10" fill="#a9a39b" />
        <ellipse cx="96" cy="122" rx="42" ry="8" fill="#e4ded2" opacity="0.9" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="156" y="118" width="16" height="52" rx="7" fill="#f4f0e8" />
        <rect x="156" y="160" width="16" height="10" rx="4" fill="#4b4440" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="118" width="16" height="52" rx="7" fill="#f4f0e8" />
        <rect x="62" y="160" width="16" height="10" rx="4" fill="#4b4440" />
      </g>
      <g className="zoo-head">
        <path d="M120 88 C 122 56, 140 36, 168 32 L 172 44 C 156 50, 148 60, 146 72 C 144 80, 142 88, 140 98 Z" fill="#5f5b60" />
        <circle cx="128" cy="76" r="9" fill="#5f5b60" />
        <circle cx="130" cy="62" r="9" fill="#5f5b60" />
        <circle cx="140" cy="48" r="9" fill="#5f5b60" />
        <path d="M126 90 C 134 66, 148 52, 162 46 L 186 62 C 172 74, 168 98, 158 120 Z" fill="#f4f0e8" />
        <path d="M168 40 L 168 22 L 180 36 Z" fill="#a9a39b" />
        <ellipse cx="180" cy="64" rx="25" ry="20" transform="rotate(28 180 64)" fill="#f4f0e8" />
        <ellipse cx="198" cy="80" rx="13" ry="11" transform="rotate(28 198 80)" fill="#e6dccd" />
        <ellipse cx="204" cy="81" rx="2" ry="2.8" fill="#8a6b60" />
        <path d="M164 38 C 176 28, 194 34, 192 46 C 190 56, 184 62, 177 58 C 172 54, 166 52, 164 38 Z" fill="#5f5b60" />
        <circle cx="170" cy="56" r="5" fill="#5f5b60" />
        {EYE(188, 62, 4.2)}
      </g>
    </>
  ),
};

/* ───────────────────────── Lama ───────────────────────── */

const LAMA_ULD: ReadonlyArray<readonly [number, number, number, boolean]> = [
  [44, 150, 22, false],
  [56, 128, 22, true],
  [82, 120, 24, false],
  [106, 132, 20, true],
  [108, 162, 20, false],
  [84, 178, 20, true],
  [58, 174, 20, false],
];

const llama: CreatureSpec = {
  name: "Lama",
  height: 24,
  aspect: 200 / 250,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 200 250",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M32 140 C 18 138, 14 126, 18 116" stroke="#f1e6d0" strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="106" y="172" width="13" height="78" rx="6" fill="#d9c6a4" />
        <rect x="106" y="238" width="13" height="12" rx="4" fill="#5a4030" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="42" y="172" width="13" height="78" rx="6" fill="#d9c6a4" />
        <rect x="42" y="238" width="13" height="12" rx="4" fill="#5a4030" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="76" cy="150" rx="52" ry="34" fill="#efe3cb" />
        {LAMA_ULD.map(([x, y, r, lys], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={lys ? "#f7eedb" : "#efe3cb"} />
        ))}
        <ellipse cx="94" cy="138" rx="22" ry="14" fill="#9a6a43" />
        <ellipse cx="58" cy="164" rx="14" ry="11" fill="#b58458" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="172" width="14" height="78" rx="6" fill="#f1e6d0" />
        <rect x="120" y="238" width="14" height="12" rx="4" fill="#6b4a38" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="56" y="172" width="14" height="78" rx="6" fill="#f1e6d0" />
        <rect x="56" y="238" width="14" height="12" rx="4" fill="#6b4a38" />
      </g>
      <g className="zoo-head">
        <path d="M102 150 C 102 112, 112 82, 122 62 L 152 68 C 146 96, 142 122, 130 152 Z" fill="#efe3cb" />
        <circle cx="116" cy="140" r="15" fill="#f4ead6" />
        <circle cx="132" cy="138" r="13" fill="#efe3cb" />
        <circle cx="112" cy="116" r="11" fill="#f4ead6" />
        <circle cx="116" cy="94" r="10" fill="#efe3cb" />
        <circle cx="142" cy="106" r="10" fill="#f4ead6" />
        <circle cx="146" cy="84" r="8" fill="#efe3cb" />
        <ellipse cx="126" cy="106" rx="7" ry="14" fill="#c4966a" />
        <path d="M126 46 C 116 34, 116 22, 124 15" stroke="#c9ab80" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M138 42 C 132 28, 136 18, 146 13" stroke="#f1e6d0" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M139 40 C 134 29, 137 21, 144 16" stroke="#e8a8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="142" cy="56" rx="20" ry="17" fill="#f1e6d0" />
        <ellipse cx="160" cy="64" rx="15" ry="11" fill="#f7eedb" />
        <ellipse cx="172" cy="64" rx="4.4" ry="3.6" fill="#7a5640" />
        <path d="M168 68 C 171 70, 172 72, 172 74" stroke="#9a7458" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="136" cy="42" r="8" fill="#f7eedb" />
        <circle cx="146" cy="44" r="7" fill="#efe3cb" />
        {EYE(150, 54, 3.8)}
      </g>
    </>
  ),
};

/* ───────────────────────── Alpaka ───────────────────────── */

const ALPAKA_ULD: ReadonlyArray<readonly [number, number, number, boolean]> = [
  [32, 120, 22, false],
  [46, 100, 22, true],
  [72, 92, 24, false],
  [98, 104, 20, true],
  [100, 134, 20, false],
  [76, 150, 20, true],
  [48, 146, 20, false],
];

const alpaca: CreatureSpec = {
  name: "Alpaka",
  height: 18,
  aspect: 180 / 200,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 180 200",
  art: (
    <>
      <circle cx="22" cy="112" r="10" fill="#d9b88c" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="86" y="140" width="12" height="60" rx="6" fill="#a9825a" />
        <rect x="86" y="190" width="12" height="10" rx="4" fill="#4a3626" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="38" y="140" width="12" height="60" rx="6" fill="#a9825a" />
        <rect x="38" y="190" width="12" height="10" rx="4" fill="#4a3626" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="68" cy="120" rx="48" ry="36" fill="#d9b88c" />
        {ALPAKA_ULD.map(([x, y, r, lys], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={lys ? "#e8cfa8" : "#d9b88c"} />
        ))}
        <ellipse cx="66" cy="132" rx="26" ry="14" fill="#bf9667" opacity="0.7" />
        <circle cx="70" cy="110" r="14" fill="#e8cfa8" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="100" y="140" width="13" height="60" rx="6" fill="#b88f63" />
        <rect x="100" y="190" width="13" height="10" rx="4" fill="#4a3626" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="140" width="13" height="60" rx="6" fill="#b88f63" />
        <rect x="52" y="190" width="13" height="10" rx="4" fill="#4a3626" />
      </g>
      <g className="zoo-head">
        <path d="M90 118 C 92 96, 98 80, 106 68 L 134 74 C 128 94, 124 110, 120 126 Z" fill="#d9b88c" />
        <circle cx="104" cy="112" r="13" fill="#e8cfa8" />
        <circle cx="104" cy="90" r="12" fill="#d9b88c" />
        <circle cx="124" cy="104" r="12" fill="#e8cfa8" />
        <circle cx="130" cy="84" r="10" fill="#d9b88c" />
        <circle cx="120" cy="124" r="12" fill="#d9b88c" />
        <ellipse cx="112" cy="20" rx="5" ry="11" transform="rotate(-12 112 20)" fill="#bf9667" />
        <ellipse cx="130" cy="18" rx="5" ry="11" transform="rotate(14 130 18)" fill="#d9b88c" />
        <circle cx="106" cy="48" r="17" fill="#d9b88c" />
        <circle cx="122" cy="34" r="17" fill="#e8cfa8" />
        <circle cx="138" cy="44" r="16" fill="#d9b88c" />
        <circle cx="112" cy="62" r="15" fill="#e8cfa8" />
        <circle cx="130" cy="30" r="12" fill="#f1dcb8" />
        <circle cx="120" cy="64" r="13" fill="#e8cfa8" />
        <ellipse cx="146" cy="62" rx="12" ry="10" fill="#f1dcb8" />
        <ellipse cx="156" cy="62" rx="3.6" ry="3" fill="#6b4a35" />
        <path d="M153 66 C 155 68, 156 70, 156 71" stroke="#8a6446" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="138" cy="40" r="10" fill="#e8cfa8" />
        {EYE(140, 54, 3.8)}
      </g>
    </>
  ),
};

/* ───────────────────────── Ræv ───────────────────────── */

const fox: CreatureSpec = {
  name: "Ræv",
  height: 9,
  aspect: 190 / 110,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 190 110",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M54 64 C 36 44, 8 46, 4 72 C 6 88, 30 94, 52 80 Z" fill="#e8803a" />
        <path d="M22 49 C 12 52, 5 60, 4 72 C 5 82, 12 89, 22 91 C 17 80, 17 60, 22 49 Z" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="114" y="76" width="9" height="34" rx="4" fill="#c4651e" />
        <rect x="114" y="94" width="9" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="56" y="76" width="9" height="34" rx="4" fill="#c4651e" />
        <rect x="56" y="94" width="9" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="96" cy="64" rx="44" ry="20" fill="#e8803a" />
        <ellipse cx="96" cy="76" rx="30" ry="7" fill="#f6c58e" opacity="0.8" />
        <ellipse cx="132" cy="70" rx="12" ry="12" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="126" y="78" width="10" height="32" rx="4" fill="#e8803a" />
        <rect x="126" y="94" width="10" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="68" y="78" width="10" height="32" rx="4" fill="#e8803a" />
        <rect x="68" y="94" width="10" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-head">
        <path d="M132 36 L 130 10 L 148 30 Z" fill="#c4651e" />
        <path d="M146 32 L 154 8 L 163 36 Z" fill="#e8803a" />
        <path d="M150 30 L 154 14 L 159 32 Z" fill="#26231f" />
        <path d="M128 54 C 126 38, 142 30, 156 34 C 166 38, 172 50, 183 58 C 176 66, 160 70, 148 68 C 136 66, 128 62, 128 54 Z" fill="#e8803a" />
        <path d="M138 62 C 148 62, 156 56, 167 53 C 174 55, 179 57, 183 58 C 176 66, 160 71, 148 69 C 142 68, 138 66, 138 62 Z" fill="#fbf8f1" />
        <circle cx="183" cy="58" r="3.8" fill="#26231f" />
        <path d="M168 62 C 172 64, 176 63, 178 61" stroke="#26231f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {EYE(153, 45, 3.6)}
      </g>
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  turkey,
  donkey,
  farmDog,
  farmCat,
  bull,
  pony,
  llama,
  alpaca,
  fox,
};
