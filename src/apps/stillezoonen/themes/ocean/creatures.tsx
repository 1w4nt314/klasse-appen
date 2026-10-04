import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Havdyrene i Stillezoonen. Fisk og skildpadde er tegnet i profil, vendt mod højre;
 * halen/finnen ligger i `zoo-tail` yderst til venstre (CSS drejer den om dens højre kant).
 * Krabben er set forfra og går sidelæns på sandbunden.
 */

const clownfish: CreatureSpec = {
  name: "Klovnfisk",
  height: 10,
  aspect: 120 / 76,
  gait: "swim",
  pace: 1.1,
  viewBox: "0 0 120 76",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M26 40 C 16 32, 8 22, 2 20 C 8 32, 8 48, 2 60 C 8 58, 18 48, 26 40 Z" fill="#e8601a" />
      </g>
      <path d="M44 16 C 52 -2, 84 -2, 96 16 Z" fill="#e8601a" />
      <path d="M58 62 C 62 72, 74 76, 80 66 Z" fill="#e8601a" />
      <ellipse cx="68" cy="40" rx="46" ry="29" fill="#f58a2d" />
      <path d="M46 14.5 A46 29 0 0 1 62 11.3 L62 68.7 A46 29 0 0 1 46 65.5 Z" fill="#5a3a2a" />
      <path d="M84 12.8 A46 29 0 0 1 98 18 L98 62 A46 29 0 0 1 84 67.2 Z" fill="#5a3a2a" />
      <path d="M48 13.9 A46 29 0 0 1 60 11.4 L60 68.6 A46 29 0 0 1 48 66.1 Z" fill="#fff6ea" />
      <path d="M86 13.3 A46 29 0 0 1 96 17 L96 63 A46 29 0 0 1 86 66.7 Z" fill="#fff6ea" />
      <path d="M22.5 44 A46 29 0 0 0 113.5 44 C 96 56, 40 56, 22.5 44 Z" fill="#ffc07a" opacity="0.5" />
      <g className="zoo-head">
        <path d="M70 46 C 78 44, 82 54, 74 60 C 66 58, 64 50, 70 46 Z" fill="#e8601a" />
        {EYE(100, 34, 4.4)}
        <path d="M108 46 q 3 3 7 0" stroke="#a8431a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="96" cy="46" r="4" fill="#ff9a8a" opacity="0.5" />
      </g>
    </>
  ),
};

const tang: CreatureSpec = {
  name: "Blå kirurgfisk",
  height: 11,
  aspect: 132 / 90,
  gait: "swim",
  pace: 1,
  viewBox: "0 0 132 90",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M28 46 C 20 38, 12 24, 2 20 C 8 34, 8 58, 2 72 C 12 66, 20 54, 28 46 Z" fill="#ffd23c" />
      </g>
      <path d="M40 18 C 56 0, 100 0, 112 22 Z" fill="#1f56b8" />
      <path d="M52 70 C 62 86, 88 88, 96 72 Z" fill="#1f56b8" />
      <ellipse cx="74" cy="46" rx="50" ry="34" fill="#3b95ee" />
      <path d="M36 56 C 46 30, 82 22, 100 44 C 90 36, 72 40, 64 58 C 58 72, 40 72, 36 56 Z" fill="#17306e" />
      <path d="M24.8 52 A50 34 0 0 0 123.2 52 C 104 64, 44 64, 24.8 52 Z" fill="#9fd0ff" opacity="0.4" />
      <path d="M30 48 l 8 -4 l 0 8 z" fill="#ffd23c" />
      <g className="zoo-head">
        <path d="M80 54 C 90 52, 92 64, 82 68 C 76 64, 74 58, 80 54 Z" fill="#2c78d4" />
        {EYE(104, 38, 4.6)}
        <path d="M116 52 q 3 3 7 0" stroke="#17306e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

const spike = (angle: number, key: string) => (
  <path key={key} d="M-4 -40 L 0 -49 L 4 -40 Z" fill="#d8a53a" transform={`translate(62 56) rotate(${angle})`} />
);

const pufferfish: CreatureSpec = {
  name: "Kuglefisk",
  height: 11,
  aspect: 112 / 100,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 0 112 100",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M26 58 C 18 50, 10 44, 3 44 C 8 54, 8 66, 3 74 C 10 72, 18 66, 26 58 Z" fill="#e0a83a" />
      </g>
      {[-120, -95, -70, -45, -20, 5, 30, 55, 80, 105, 130, 155, 180, 205].map((a, i) => spike(a, `sp-${i}`))}
      <circle cx="62" cy="56" r="40" fill="#f6cc52" />
      <path d="M26 66 C 36 96, 90 100, 100 68 C 90 80, 40 84, 26 66 Z" fill="#fdf0c2" />
      <circle cx="48" cy="34" r="3.4" fill="#e0a83a" />
      <circle cx="62" cy="26" r="3" fill="#e0a83a" />
      <circle cx="40" cy="52" r="3" fill="#e0a83a" />
      <circle cx="56" cy="46" r="3.4" fill="#e0a83a" />
      <path d="M52 62 C 64 58, 68 72, 56 76 C 48 74, 46 66, 52 62 Z" fill="#e0a83a" />
      <g className="zoo-head">
        <circle cx="86" cy="44" r="11" fill="#fff" />
        {EYE(88, 44, 6.4)}
        <ellipse cx="100" cy="62" rx="6.4" ry="5.2" fill="#e8884a" />
        <ellipse cx="102" cy="62" rx="2.4" ry="2" fill="#9a4a24" />
        <circle cx="86" cy="62" r="5" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
};

const turtle: CreatureSpec = {
  name: "Havskildpadde",
  height: 19,
  aspect: 210 / 122,
  gait: "swim",
  pace: 0.6,
  viewBox: "0 0 210 122",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M44 84 C 34 86, 18 94, 4 108 C 22 112, 38 104, 50 96 Z" fill="#6aa86a" />
      </g>
      <g className="zoo-tail">
        <path d="M128 78 C 100 80, 66 96, 46 114 C 42 120, 50 124, 58 122 C 90 118, 124 106, 136 92 Z" fill="#4f8f58" />
      </g>
      <path d="M32 80 C 38 98, 160 100, 176 80 Z" fill="#efdca0" />
      <path d="M34 82 C 34 36, 86 18, 124 24 C 160 30, 176 58, 172 82 Z" fill="#5da05a" />
      <path d="M60 50 L 86 36 L 116 40 L 128 62 L 104 76 L 70 72 Z" fill="#8cc774" />
      <path d="M128 46 L 152 52 L 156 72 L 134 78 Z" fill="#8cc774" opacity="0.85" />
      <path d="M46 62 L 60 56 L 66 76 L 42 80 Z" fill="#8cc774" opacity="0.85" />
      <path d="M38 70 C 60 78, 150 78, 172 70 L 172 82 L 34 82 Z" fill="#3f7d48" opacity="0.5" />
      <g className="zoo-head">
        <path d="M160 68 C 170 62, 182 60, 190 64 L 190 84 C 182 86, 168 86, 158 84 Z" fill="#7fb877" />
        <circle cx="190" cy="68" r="19" fill="#8cc774" />
        <ellipse cx="202" cy="76" rx="9" ry="6" fill="#a4d58c" />
        {EYE(194, 62, 4.2)}
        <circle cx="187" cy="76" r="4" fill="#ff9a8a" opacity="0.55" />
        <path d="M200 80 q 4 3 8 -1" stroke="#4d8a52" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-tail">
        <path d="M158 76 C 130 74, 96 90, 76 110 C 72 117, 80 123, 90 121 C 124 114, 160 102, 168 88 Z" fill="#74b06e" />
      </g>
    </>
  ),
};

const jellyfish: CreatureSpec = {
  name: "Vandmand",
  height: 16,
  aspect: 100 / 130,
  gait: "float",
  pace: 0.7,
  viewBox: "0 0 100 130",
  art: (
    <>
      <g fill="none" strokeLinecap="round">
        <path d="M30 62 C 22 80, 38 92, 28 112 C 26 118, 28 122, 30 126" stroke="#d98ae0" strokeWidth="3.4" />
        <path d="M44 64 C 36 84, 52 96, 44 114 C 42 120, 44 124, 46 128" stroke="#e7a3e8" strokeWidth="3.4" />
        <path d="M60 64 C 68 84, 52 96, 62 114 C 64 120, 62 124, 60 128" stroke="#e7a3e8" strokeWidth="3.4" />
        <path d="M72 62 C 80 80, 64 92, 74 112 C 76 118, 74 122, 72 126" stroke="#d98ae0" strokeWidth="3.4" />
        <path d="M38 62 C 34 78, 46 84, 42 100" stroke="#f4c0f0" strokeWidth="7" />
        <path d="M54 62 C 58 78, 46 86, 52 104" stroke="#f4c0f0" strokeWidth="7" />
      </g>
      <g className="zoo-torso">
        <path
          d="M10 64 C 8 22, 28 4, 50 4 C 72 4, 92 22, 90 64 C 82 72, 74 72, 70 64 C 64 72, 56 72, 50 64 C 44 72, 36 72, 30 64 C 26 72, 18 72, 10 64 Z"
          fill="#ee9ad4"
        />
        <path d="M18 54 C 16 30, 30 14, 50 12 C 36 20, 28 36, 30 54 Z" fill="#f8c4ea" opacity="0.8" />
        <circle cx="40" cy="22" r="4" fill="#f8c4ea" />
        <circle cx="62" cy="20" r="3" fill="#d982c4" />
        <circle cx="76" cy="36" r="3.4" fill="#d982c4" />
      </g>
      <g className="zoo-head">
        {EYE(52, 44, 4.4)}
        {EYE(72, 44, 4.4)}
        <path d="M58 53 q 4 4 8 0" stroke="#a24d8c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="46" cy="52" r="3.6" fill="#ff8aa0" opacity="0.5" />
        <circle cx="80" cy="52" r="3.6" fill="#ff8aa0" opacity="0.5" />
      </g>
    </>
  ),
};

const seahorse: CreatureSpec = {
  name: "Søhest",
  height: 15,
  aspect: 76 / 130,
  gait: "float",
  pace: 0.7,
  viewBox: "0 0 76 130",
  art: (
    <>
      <path d="M18 56 C 8 52, 6 70, 16 78 C 20 70, 22 62, 22 58 Z" fill="#f9c968" />
      <path d="M17 60 l -7 3 M17 66 l -8 3 M18 72 l -6 4" stroke="#e8933a" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M30 84 C 28 106, 14 108, 18 122 C 21 130, 36 130, 38 120 C 40 112, 30 112, 32 108 C 36 100, 42 96, 40 86 Z"
        fill="#f29a2e"
      />
      <path
        d="M24 36 C 18 52, 14 70, 22 86 C 28 96, 44 96, 48 84 C 52 70, 50 50, 44 38 Z"
        fill="#f6a93b"
      />
      <path
        d="M34 38 C 44 40, 54 52, 52 68 C 50 80, 44 88, 38 90 C 44 78, 44 56, 34 38 Z"
        fill="#fbd27a"
      />
      <path d="M26 52 h 20 M25 62 h 22 M26 72 h 20 M28 82 h 16" stroke="#e8933a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 28 l -6 -10 l 8 4 l 2 -10 l 6 8 l 6 -8 z" fill="#e8933a" />
      <g className="zoo-head">
        <circle cx="36" cy="30" r="15" fill="#f6a93b" />
        <path d="M44 28 C 54 26, 62 28, 70 30 C 72 33, 70 36, 66 36 C 58 38, 50 40, 44 42 Z" fill="#f9c968" />
        <path d="M70 31 q 3 1 0 4" stroke="#c9741f" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(40, 26, 4)}
        <circle cx="40" cy="38" r="3.2" fill="#ff8aa0" opacity="0.5" />
      </g>
    </>
  ),
};

const octopus: CreatureSpec = {
  name: "Blæksprutte",
  height: 18,
  aspect: 150 / 130,
  gait: "float",
  pace: 0.8,
  viewBox: "0 0 150 130",
  art: (
    <>
      <g fill="none" strokeLinecap="round">
        <path d="M52 80 C 34 92, 50 108, 30 114 C 22 116, 16 112, 14 106" stroke="#7a49b4" strokeWidth="11" />
        <path d="M70 84 C 56 100, 72 116, 54 124" stroke="#7a49b4" strokeWidth="11" />
        <path d="M96 84 C 108 100, 92 114, 106 124" stroke="#7a49b4" strokeWidth="11" />
        <path d="M112 78 C 128 90, 116 106, 134 112 C 140 114, 144 110, 144 104" stroke="#7a49b4" strokeWidth="11" />
      </g>
      <g className="zoo-torso">
        <g fill="none" strokeLinecap="round">
          <path d="M44 76 C 22 80, 26 102, 8 100" stroke="#9366cc" strokeWidth="12" />
          <path d="M62 82 C 48 96, 56 114, 40 122" stroke="#9366cc" strokeWidth="12" />
          <path d="M84 84 C 82 100, 76 112, 84 124" stroke="#9366cc" strokeWidth="12" />
          <path d="M106 82 C 118 96, 108 112, 122 122" stroke="#9366cc" strokeWidth="12" />
        </g>
        <g fill="#d7bff0">
          <circle cx="12" cy="99" r="2.2" /><circle cx="25" cy="94" r="2.2" />
          <circle cx="42" cy="119" r="2.2" /><circle cx="50" cy="104" r="2.2" />
          <circle cx="83" cy="108" r="2.2" /><circle cx="86" cy="120" r="2.2" />
          <circle cx="118" cy="118" r="2.2" /><circle cx="112" cy="102" r="2.2" />
        </g>
        <ellipse cx="82" cy="44" rx="44" ry="40" fill="#a678dc" transform="rotate(8 82 44)" />
        <path d="M46 50 C 46 28, 58 14, 76 12 C 62 22, 56 36, 58 54 Z" fill="#c4a0ec" opacity="0.7" />
        <circle cx="60" cy="24" r="3.4" fill="#c4a0ec" />
        <circle cx="106" cy="20" r="3" fill="#8a58c4" />
        <circle cx="52" cy="46" r="3" fill="#8a58c4" />
      </g>
      <g className="zoo-head">
        <circle cx="86" cy="52" r="9.5" fill="#fff" />
        <circle cx="112" cy="52" r="9.5" fill="#fff" />
        {EYE(89, 52, 6)}
        {EYE(115, 52, 6)}
        <path d="M94 70 q 8 6 16 0" stroke="#5b3390" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="76" cy="66" r="4.4" fill="#ff8aa0" opacity="0.5" />
        <circle cx="128" cy="66" r="4.4" fill="#ff8aa0" opacity="0.5" />
      </g>
    </>
  ),
};

const crab: CreatureSpec = {
  name: "Krabbe",
  height: 8,
  aspect: 130 / 72,
  gait: "walk",
  pace: 1,
  zone: "ground",
  viewBox: "0 0 130 72",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <path d="M38 50 L 22 50 L 18 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M40 57 L 26 61 L 24 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M50 62 L 41 66 L 39 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M92 50 L 108 50 L 112 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M90 57 L 104 61 L 106 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M80 62 L 89 66 L 91 68" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <path d="M30 24 C 24 8, 10 6, 6 16 C 4 26, 14 32, 22 32 Z" fill="#e8553f" />
        <path d="M100 24 C 106 8, 120 6, 124 16 C 126 26, 116 32, 108 32 Z" fill="#e8553f" />
        <path d="M14 14 L 6 4 L 22 8 Z" fill="#f2735a" />
        <path d="M116 14 L 124 4 L 108 8 Z" fill="#f2735a" />
        <path d="M26 36 C 26 30, 32 28, 38 30 M104 36 C 104 30, 98 28, 92 30" stroke="#d0402e" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="65" cy="46" rx="38" ry="22" fill="#f06048" />
        <ellipse cx="65" cy="56" rx="30" ry="10" fill="#f68a74" opacity="0.6" />
      </g>
      <g className="zoo-head">
        <path d="M54 30 V 20 M76 30 V 20" stroke="#d0402e" strokeWidth="4" strokeLinecap="round" />
        <circle cx="54" cy="16" r="8" fill="#fff" />
        <circle cx="76" cy="16" r="8" fill="#fff" />
        {EYE(55, 16, 4.6)}
        {EYE(77, 16, 4.6)}
        <path d="M58 48 q 7 6 14 0" stroke="#9a2a1c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="46" r="4.2" fill="#ff9a8a" opacity="0.55" />
        <circle cx="86" cy="46" r="4.2" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
};

export const creatures: Record<string, CreatureSpec> = {
  clownfish,
  tang,
  pufferfish,
  turtle,
  jellyfish,
  seahorse,
  octopus,
  crab,
};
