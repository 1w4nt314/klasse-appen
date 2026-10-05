import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige jungledyr. Samme stil som creatures.tsx: flade farver,
 * profil mod højre, bunden på viewBox'ens bund.
 */

const capybara: CreatureSpec = {
  name: "Capybara",
  height: 13,
  aspect: 200 / 110,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 200 110",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="76" width="17" height="34" rx="8" fill="#8a5b36" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="76" width="17" height="34" rx="8" fill="#8a5b36" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="60" rx="68" ry="34" fill="#a9764a" />
        <path
          d="M34 44 C 60 28, 118 28, 150 46"
          stroke="#c99a6b"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M40 84 C 70 96, 118 96, 144 84"
          stroke="#8a5b36"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="132" y="76" width="18" height="34" rx="8" fill="#a9764a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="56" y="76" width="18" height="34" rx="8" fill="#a9764a" />
      </g>
      <g className="zoo-head">
        <circle cx="158" cy="32" r="7" fill="#8a5b36" />
        <circle cx="158" cy="32" r="3.5" fill="#d9a07a" />
        <path
          d="M146 40 C 156 28, 178 28, 188 36 C 198 40, 198 58, 194 68 C 188 80, 164 82, 150 74 C 142 66, 140 50, 146 40 Z"
          fill="#a9764a"
        />
        <ellipse cx="178" cy="72" rx="14" ry="6" fill="#c99a6b" />
        <ellipse cx="192" cy="46" rx="6" ry="8" fill="#6e4326" />
        <circle cx="191" cy="44" r="1.8" fill="#3b2314" />
        <path
          d="M176 66 q 8 5 17 -1"
          stroke="#6e4326"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {EYE(170, 46, 3.8)}
      </g>
    </>
  ),
};

const coati: CreatureSpec = {
  name: "Næsebjørn",
  height: 10,
  aspect: 200 / 120,
  gait: "walk",
  pace: 1.1,
  viewBox: "0 0 200 120",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M58 68 C 24 72, 8 42, 28 8"
          stroke="#b98a5e"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M58 68 C 24 72, 8 42, 28 8"
          stroke="#4a3226"
          strokeWidth="14"
          fill="none"
          strokeDasharray="7 9"
        />
        <circle cx="28" cy="9" r="7" fill="#4a3226" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="124" y="82" width="14" height="38" rx="7" fill="#3a271d" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="82" width="14" height="38" rx="7" fill="#3a271d" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="68" rx="52" ry="25" fill="#8a5a3a" />
        <path
          d="M58 54 C 84 44, 120 44, 142 54"
          stroke="#a87650"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M62 84 C 88 94, 120 94, 142 84"
          stroke="#6e4528"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="134" y="82" width="15" height="38" rx="7" fill="#4a3226" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="72" y="82" width="15" height="38" rx="7" fill="#4a3226" />
      </g>
      <g className="zoo-head">
        <circle cx="146" cy="38" r="8" fill="#4a3226" />
        <circle cx="146" cy="38" r="4" fill="#c08a5a" />
        <ellipse cx="152" cy="58" rx="22" ry="19" fill="#8a5a3a" />
        <path
          d="M160 52 C 172 50, 190 58, 196 66 C 194 74, 176 76, 160 72 Z"
          fill="#e9d6b8"
        />
        <path
          d="M160 46 C 168 44, 178 50, 180 56 C 172 56, 164 54, 160 50 Z"
          fill="#4a3226"
          opacity="0.85"
        />
        <ellipse cx="195" cy="65" rx="4.5" ry="3.6" fill="#2b1d16" />
        <path
          d="M168 70 q 8 4 16 -1"
          stroke="#8a6a50"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="160" cy="44" r="4" fill="#fbf1e4" />
        {EYE(162, 51, 3.6)}
      </g>
    </>
  ),
};

const redPanda: CreatureSpec = {
  name: "Rød panda",
  height: 11,
  aspect: 190 / 130,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 190 130",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M60 88 C 20 102, 4 62, 22 28"
          stroke="#d9582e"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 88 C 20 102, 4 62, 22 28"
          stroke="#a8381d"
          strokeWidth="28"
          fill="none"
          strokeDasharray="8 14"
          strokeDashoffset="-4"
        />
        <circle cx="22" cy="27" r="14" fill="#7a2a1a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="116" y="94" width="16" height="36" rx="8" fill="#3a1c19" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="60" y="94" width="16" height="36" rx="8" fill="#3a1c19" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="98" cy="84" rx="46" ry="28" fill="#d9582e" />
        <path
          d="M60 70 C 84 56, 116 56, 138 70"
          stroke="#ec7a46"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M62 100 C 86 112, 118 112, 138 100"
          stroke="#7a2a1a"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="126" y="94" width="17" height="36" rx="8" fill="#4a2420" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="94" width="17" height="36" rx="8" fill="#4a2420" />
      </g>
      <g className="zoo-head">
        <path d="M124 40 L 120 16 L 142 30 Z" fill="#d9582e" />
        <path d="M126 36 L 124 24 L 136 31 Z" fill="#f6e3d0" />
        <path d="M156 32 L 166 12 L 174 38 Z" fill="#d9582e" />
        <path d="M160 33 L 166 21 L 169 35 Z" fill="#f6e3d0" />
        <circle cx="146" cy="58" r="30" fill="#d9582e" />
        <ellipse cx="142" cy="36" rx="14" ry="6" fill="#ec7a46" opacity="0.8" />
        <ellipse cx="136" cy="68" rx="18" ry="13" fill="#fbf1e4" />
        <ellipse cx="164" cy="64" rx="16" ry="11" fill="#fbf1e4" />
        <ellipse cx="178" cy="60" rx="7" ry="6" fill="#fbf1e4" />
        <ellipse cx="182" cy="57" rx="4.6" ry="3.8" fill="#2b1d16" />
        <path
          d="M157 58 q 2 8 -1 12"
          stroke="#9b3a22"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M168 72 q 5 3 10 -1"
          stroke="#6e3a2a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {EYE(160, 53, 3.8)}
      </g>
    </>
  ),
};

const iguana: CreatureSpec = {
  name: "Leguan",
  height: 9,
  aspect: 250 / 100,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 250 100",
  art: (
    <>
      <path
        d="M92 44 C 60 50, 36 66, 6 90 C 40 90, 70 82, 94 72 Z"
        fill="#6cae4a"
      />
      <path
        d="M40 66 l 4 10 M62 58 l 4 12 M80 52 l 4 12"
        stroke="#4c8c35"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M112 68 C 108 80, 106 88, 104 95.5 L 118 95.5"
          stroke="#4c8c35"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M168 68 C 170 80, 174 88, 180 95.5 L 194 95.5"
          stroke="#4c8c35"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="zoo-torso">
        <ellipse cx="130" cy="58" rx="48" ry="20" fill="#6cae4a" />
        <path
          d="M92 70 C 116 80, 150 80, 172 70"
          stroke="#a6d682"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M112 42 l 3 14 M130 40 l 3 15 M148 42 l 3 14"
          stroke="#4c8c35"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <g fill="#3e7a2e">
          <path d="M82 44 l 4 -10 l 5 10 z" />
          <path d="M96 41 l 4 -11 l 5 11 z" />
          <path d="M110 39 l 4 -11 l 5 11 z" />
          <path d="M124 38 l 4 -11 l 5 11 z" />
          <path d="M138 38 l 4 -11 l 5 11 z" />
          <path d="M152 40 l 4 -10 l 5 10 z" />
          <path d="M66 52 l 3 -8 l 4 9 z" />
          <path d="M52 58 l 3 -7 l 4 8 z" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M124 70 C 120 80, 118 88, 116 95.5 L 130 95.5"
          stroke="#6cae4a"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M158 70 C 160 80, 164 88, 170 95.5 L 184 95.5"
          stroke="#6cae4a"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="zoo-head">
        <path
          d="M168 60 C 168 82, 192 88, 200 66 Z"
          fill="#8fc86a"
        />
        <path
          d="M156 42 C 170 34, 194 38, 208 50 C 214 56, 210 64, 200 66 C 182 68, 166 64, 154 58 Z"
          fill="#6cae4a"
        />
        <circle cx="168" cy="54" r="8" fill="#a6d682" />
        <path
          d="M186 60 q 10 4 20 -2"
          stroke="#3e7a2e"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="207" cy="52" r="1.6" fill="#2d5a22" />
        {EYE(182, 48, 3.6)}
      </g>
    </>
  ),
};

const chameleon: CreatureSpec = {
  name: "Kamæleon",
  height: 8,
  aspect: 180 / 106,
  gait: "walk",
  pace: 0.6,
  viewBox: "0 24 180 106",
  art: (
    <g transform="translate(0 12)">
      <g className="zoo-tail">
        <path
          d="M58 68 C 30 66, 12 82, 16 102 C 20 120, 46 120, 48 104 C 49 92, 34 88, 30 98 C 28 104, 33 108, 38 106"
          stroke="#4fa23a"
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M58 68 C 30 66, 12 82, 16 102 C 20 120, 46 120, 48 104"
          stroke="#8cc152"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M112 84 L 116 108"
          stroke="#4fa23a"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="116" cy="113" rx="10" ry="5" fill="#4fa23a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M70 84 L 64 108"
          stroke="#4fa23a"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="64" cy="113" rx="10" ry="5" fill="#4fa23a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="92" cy="64" rx="44" ry="31" fill="#8cc152" />
        <path
          d="M60 80 C 82 94, 112 94, 130 80"
          stroke="#c8e68f"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M70 38 C 92 30, 116 34, 130 46"
          stroke="#4fa23a"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="76" cy="62" r="5" fill="#f2a33a" />
        <circle cx="94" cy="56" r="4" fill="#f2a33a" />
        <circle cx="108" cy="68" r="5" fill="#f2a33a" />
        <g fill="#4fa23a">
          <path d="M60 36 l 4 -8 l 4 8 z" />
          <path d="M74 31 l 4 -8 l 4 8 z" />
          <path d="M88 29 l 4 -8 l 4 8 z" />
          <path d="M102 30 l 4 -8 l 4 8 z" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M124 84 L 130 108"
          stroke="#6aa83e"
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="130" cy="113" rx="11" ry="5" fill="#6aa83e" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M82 84 L 78 108"
          stroke="#6aa83e"
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="78" cy="113" rx="11" ry="5" fill="#6aa83e" />
      </g>
      <g className="zoo-head">
        <path
          d="M114 44 C 112 22, 130 14, 146 22 C 140 28, 138 34, 138 42 Z"
          fill="#6aa83e"
        />
        <path
          d="M118 36 C 118 28, 126 24, 134 26"
          stroke="#c8e68f"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="140" cy="52" rx="28" ry="19" fill="#8cc152" />
        <ellipse cx="164" cy="56" rx="12" ry="9" fill="#8cc152" />
        <path
          d="M150 62 C 158 66, 170 66, 176 60"
          stroke="#4fa23a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="172" cy="50" r="1.8" fill="#2d5a22" />
        <circle cx="146" cy="44" r="13" fill="#6aa83e" />
        <circle cx="146" cy="44" r="9.5" fill="#f2d24b" />
        <circle
          cx="146"
          cy="44"
          r="9.5"
          fill="none"
          stroke="#4fa23a"
          strokeWidth="2"
        />
        {EYE(148, 44, 4.4)}
      </g>
    </g>
  ),
};

const gecko: CreatureSpec = {
  name: "Gekko",
  height: 6,
  aspect: 200 / 80,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 200 80",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M62 34 C 40 36, 24 28, 8 10 C 12 34, 34 56, 64 54 Z"
          fill="#b7d65a"
        />
        <path
          d="M22 24 l 3 8 M36 32 l 2 9 M50 36 l 1 9"
          stroke="#f08a3c"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M88 52 L 78 64 L 90 70"
          stroke="#8fb83a"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="92" cy="74" r="5.5" fill="#8fb83a" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M138 50 L 146 64 L 158 70"
          stroke="#8fb83a"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="160" cy="74" r="5.5" fill="#8fb83a" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="104" cy="42" rx="50" ry="17" fill="#b7d65a" />
        <path
          d="M60 54 C 86 62, 124 62, 150 52"
          stroke="#e6f0a8"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="80" cy="36" r="4.5" fill="#f08a3c" />
        <circle cx="100" cy="32" r="4" fill="#f08a3c" />
        <circle cx="120" cy="35" r="4.5" fill="#f08a3c" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M100 52 L 90 64 L 102 70"
          stroke="#b7d65a"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="104" cy="74" r="6" fill="#b7d65a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M148 50 L 156 64 L 170 70"
          stroke="#b7d65a"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="172" cy="74" r="6" fill="#b7d65a" />
      </g>
      <g className="zoo-head">
        <ellipse cx="158" cy="38" rx="26" ry="18" fill="#b7d65a" />
        <ellipse cx="176" cy="44" rx="14" ry="10" fill="#c6e06c" />
        <path
          d="M168 49 q 8 4 16 -1"
          stroke="#6a8a22"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="187" cy="40" r="1.6" fill="#4a6618" />
        <circle cx="160" cy="28" r="10" fill="#f2d24b" />
        {EYE(162, 28, 5.4)}
      </g>
    </>
  ),
};

const hornbill: CreatureSpec = {
  name: "Næsehornsfugl",
  height: 14,
  aspect: 170 / 150,
  gait: "hop",
  pace: 1,
  viewBox: "0 0 170 150",
  art: (
    <>
      <path d="M40 88 L 4 126 L 12 134 L 52 112 Z" fill="#2a2d33" />
      <path d="M4 126 L 12 134 L 22 124 L 14 118 Z" fill="#fff4d6" />
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M60 104 V 145 M54 147.5 h 12"
          stroke="#6b6f78"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M74 104 V 145 M68 147.5 h 12"
          stroke="#858993"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-torso">
        <ellipse cx="68" cy="76" rx="36" ry="32" fill="#2a2d33" />
        <path
          d="M82 54 C 98 62, 98 92, 82 104 C 70 94, 70 70, 82 54 Z"
          fill="#fff4d6"
        />
        <path
          d="M32 70 C 44 58, 62 62, 66 76 C 56 88, 38 86, 32 70 Z"
          fill="#3d424b"
        />
        <path
          d="M34 78 C 42 86, 54 88, 62 82"
          stroke="#fff4d6"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-head">
        <path d="M84 62 C 96 70, 112 64, 114 50 L 92 36 Z" fill="#f3e7b8" />
        <circle cx="100" cy="38" r="19" fill="#2a2d33" />
        <path
          d="M110 30 C 130 24, 156 36, 164 62 C 146 56, 126 54, 108 52 Z"
          fill="#f5b623"
        />
        <path
          d="M108 32 C 114 12, 142 12, 152 32 C 142 30, 124 28, 108 32 Z"
          fill="#ef8a2b"
        />
        <path
          d="M112 44 C 130 46, 150 52, 162 60"
          stroke="#c98a1a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="103" cy="38" r="7.5" fill="#fff4d6" />
        {EYE(104, 38, 3.8)}
      </g>
    </>
  ),
};

const peacock: CreatureSpec = {
  name: "Påfugl",
  height: 16,
  aspect: 240 / 170,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 240 170",
  art: (
    <>
      <g className="zoo-tail">
        <path
          d="M98 92 C 62 92, 28 118, 4 162 C 44 156, 86 140, 112 118 Z"
          fill="#1f7a52"
        />
        <path
          d="M100 98 C 70 104, 40 124, 18 156 C 52 148, 88 134, 112 116 Z"
          fill="#2fa070"
        />
        <g>
          <circle cx="86" cy="116" r="6.5" fill="#d9a62e" />
          <circle cx="86" cy="116" r="4" fill="#1c8f9f" />
          <circle cx="86" cy="116" r="1.8" fill="#14456a" />
          <circle cx="62" cy="130" r="6.5" fill="#d9a62e" />
          <circle cx="62" cy="130" r="4" fill="#1c8f9f" />
          <circle cx="62" cy="130" r="1.8" fill="#14456a" />
          <circle cx="38" cy="146" r="6.5" fill="#d9a62e" />
          <circle cx="38" cy="146" r="4" fill="#1c8f9f" />
          <circle cx="38" cy="146" r="1.8" fill="#14456a" />
        </g>
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path
          d="M118 124 V 165 M111 167.5 h 14"
          stroke="#8a7a68"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path
          d="M138 124 V 165 M131 167.5 h 14"
          stroke="#a89886"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="zoo-torso">
        <ellipse cx="124" cy="100" rx="42" ry="30" fill="#1b67c9" />
        <path
          d="M86 98 C 100 80, 132 82, 146 104 C 128 118, 100 118, 86 98 Z"
          fill="#2c8f6e"
        />
        <path
          d="M94 98 h 40 M98 106 h 34"
          stroke="#d9a62e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M130 118 C 140 124, 158 118, 162 104"
          stroke="#14456a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
      <g className="zoo-head">
        <path
          d="M150 96 C 160 76, 166 56, 168 40"
          stroke="#1b67c9"
          strokeWidth="17"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M156 92 C 164 76, 170 60, 172 44"
          stroke="#3d8be0"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <circle cx="172" cy="32" r="12" fill="#1b67c9" />
        <path
          d="M168 14 v -10 M172 13 v -12 M176 14 l 4 -10"
          stroke="#14456a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="168" cy="3" r="3" fill="#1c8f9f" />
        <circle cx="172" cy="1.5" r="3" fill="#1c8f9f" />
        <circle cx="180" cy="4" r="3" fill="#1c8f9f" />
        <path d="M181 32 L 192 36 L 181 38 Z" fill="#d9b25a" />
        <ellipse cx="174" cy="30" rx="6" ry="4.5" fill="#fff" />
        {EYE(175, 30, 2.8)}
      </g>
    </>
  ),
};

const hummingbird: CreatureSpec = {
  name: "Kolibri",
  height: 6,
  aspect: 130 / 100,
  gait: "float",
  zone: "open",
  pace: 1.2,
  viewBox: "0 0 130 100",
  art: (
    <>
      <g className="zoo-wing" style={{ transformOrigin: "90% 100%", "--flap": "0.09s" } as React.CSSProperties}>
        <path
          d="M62 54 C 54 26, 34 8, 12 6 C 16 30, 34 50, 58 62 Z"
          fill="#7fd0c4"
          opacity="0.85"
        />
        <path
          d="M66 52 C 64 28, 52 10, 34 2 C 34 24, 44 44, 62 58 Z"
          fill="#b4e8e0"
          opacity="0.95"
        />
      </g>
      <path d="M46 68 L 22 94 L 36 98 L 52 78 Z" fill="#1f8a68" />
      <path d="M52 72 L 36 98 L 48 98 L 58 78 Z" fill="#2fb386" />
      <g className="zoo-torso">
        <ellipse
          cx="64"
          cy="58"
          rx="30"
          ry="15"
          fill="#2fb386"
          transform="rotate(-35 64 58)"
        />
        <ellipse
          cx="72"
          cy="66"
          rx="18"
          ry="8"
          fill="#e8f3d8"
          transform="rotate(-35 72 66)"
        />
      </g>
      <g className="zoo-head">
        <circle cx="88" cy="38" r="13" fill="#2fb386" />
        <ellipse cx="92" cy="47" rx="8" ry="5.5" fill="#e0384f" />
        <path
          d="M99 36 L 128 48"
          stroke="#3a2f2a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {EYE(91, 34, 3.2)}
      </g>
    </>
  ),
};

/** Ét par vinger (overside, set oppefra); spejles til undersiden. */
const vinger = (
  <>
    <path
      d="M72 48 C 62 26, 72 8, 98 0 C 106 18, 98 38, 82 50 Z"
      fill="#2f7de0"
      stroke="#1d2f4f"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M72 50 C 54 36, 34 22, 20 32 C 16 44, 40 54, 66 54 Z"
      fill="#4a9aef"
      stroke="#1d2f4f"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M76 44 C 72 30, 80 16, 94 8"
      stroke="#8cc8ff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      opacity="0.8"
    />
    <circle cx="97" cy="8" r="2" fill="#fff" />
    <circle cx="88" cy="22" r="1.8" fill="#fff" />
    <circle cx="26" cy="36" r="2" fill="#fff" />
    <circle cx="38" cy="44" r="1.8" fill="#fff" />
  </>
);

const morpho: CreatureSpec = {
  name: "Blå sommerfugl",
  height: 7,
  aspect: 120 / 100,
  gait: "float",
  zone: "open",
  pace: 0.9,
  viewBox: "0 0 120 100",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.45s" } as React.CSSProperties}>
        {vinger}
        <g transform="matrix(1 0 0 -1 0 100)">{vinger}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="62" cy="50" rx="36" ry="4.5" fill="#3a2a22" />
      </g>
      <g className="zoo-head">
        <circle cx="100" cy="50" r="7" fill="#3a2a22" />
        <path
          d="M102 44 C 108 34, 114 32, 118 26 M102 56 C 108 66, 114 68, 118 74"
          stroke="#3a2a22"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="118" cy="26" r="2.2" fill="#3a2a22" />
        <circle cx="118" cy="74" r="2.2" fill="#3a2a22" />
        {EYE(102, 49, 2.4)}
      </g>
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  capybara,
  coati,
  redPanda,
  iguana,
  chameleon,
  gecko,
  hornbill,
  peacock,
  hummingbird,
  morpho,
};
