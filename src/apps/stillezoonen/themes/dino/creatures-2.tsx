import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Almindelige forhistoriske dyr i Dino-dalen: flyveøgler, ur-fugl og
 * små og mellemstore dinoer. Flade farver, profil mod højre, bunden på
 * viewBox'ens bund (flyverne fylder viewBox'en).
 */

const pteranodon: CreatureSpec = {
  name: "Pteranodon",
  height: 12,
  aspect: 200 / 130,
  gait: "float",
  zone: "open",
  pace: 1,
  viewBox: "0 0 200 130",
  art: (
    <>
      {/* fjern vinge (mørkere) */}
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as React.CSSProperties}>
        <path
          d="M110 64 C 108 38, 98 16, 74 4 C 70 20, 74 30, 80 34 C 82 46, 88 54, 96 66 Z"
          fill="#cf7a3f"
        />
        <path d="M110 64 C 106 38, 96 16, 74 4" stroke="#a85a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* lille hale og fødder */}
      <path d="M82 76 L 60 90 L 84 88 Z" fill="#d9803f" />
      <path d="M96 88 L 92 102 L 100 102 L 104 90 Z" fill="#d9803f" />
      <path d="M114 88 L 112 102 L 120 102 L 120 90 Z" fill="#d9803f" />
      <g className="zoo-torso">
        <ellipse cx="108" cy="76" rx="32" ry="16" fill="#eb9a52" transform="rotate(-8 108 76)" />
        <ellipse cx="112" cy="84" rx="22" ry="8" fill="#f8dcae" transform="rotate(-8 112 84)" />
      </g>
      {/* nær vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.6s" } as React.CSSProperties}>
        <path
          d="M102 68 C 84 44, 50 22, 10 16 C 22 28, 28 36, 30 46 C 40 46, 46 52, 48 62 C 60 62, 68 70, 70 80 C 82 82, 92 82, 104 80 Z"
          fill="#f4b46c"
        />
        <path d="M102 68 C 84 44, 50 22, 10 16" stroke="#c9703a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M102 70 L 30 46 M102 72 L 48 62 M102 74 L 70 80" stroke="#e29247" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        <path d="M122 70 C 134 66, 140 60, 146 54" stroke="#eb9a52" strokeWidth="16" fill="none" strokeLinecap="round" />
        {/* lang kam bagud */}
        <path d="M146 40 C 130 28, 110 24, 84 32 C 106 44, 128 54, 148 56 Z" fill="#e0483f" />
        <ellipse cx="151" cy="50" rx="15" ry="11" fill="#eb9a52" />
        {/* næb */}
        <path d="M158 43 C 172 46, 188 52, 199 57 L 196 61 C 180 62, 166 61, 156 58 Z" fill="#f4b46c" />
        <path d="M156 58 C 168 62, 184 62, 196 61" stroke="#c9703a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(152, 47, 3.8)}
      </g>
    </>
  ),
};

const quetzalcoatlus: CreatureSpec = {
  name: "Quetzalcoatlus",
  height: 16,
  aspect: 240 / 150,
  gait: "float",
  zone: "open",
  pace: 0.8,
  viewBox: "0 0 240 150",
  art: (
    <>
      {/* fjern vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.9s" } as React.CSSProperties}>
        <path
          d="M116 92 C 112 62, 98 28, 62 4 C 62 20, 66 28, 72 34 C 74 50, 82 62, 90 70 C 94 80, 100 88, 108 96 Z"
          fill="#5f8280"
        />
        <path d="M116 92 C 112 62, 98 28, 62 4" stroke="#466664" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* ben og hale */}
      <path d="M100 106 L 96 132 L 102 140" stroke="#6f8f8a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M116 108 L 116 134 L 122 142" stroke="#8fb0a8" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M86 98 L 66 112 L 90 108 Z" fill="#7a9d96" />
      <g className="zoo-torso">
        <ellipse cx="110" cy="96" rx="32" ry="17" fill="#8fb0a8" transform="rotate(-8 110 96)" />
        <ellipse cx="114" cy="104" rx="22" ry="8" fill="#e3eee6" transform="rotate(-8 114 104)" />
      </g>
      {/* nær vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.9s" } as React.CSSProperties}>
        <path
          d="M104 90 C 80 62, 44 34, 4 28 C 16 40, 22 48, 24 58 C 36 58, 42 64, 44 74 C 56 74, 62 82, 64 92 C 78 94, 90 96, 106 100 Z"
          fill="#a8c4bd"
        />
        <path d="M104 90 C 80 62, 44 34, 4 28" stroke="#5f8280" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M106 92 L 24 58 M106 95 L 44 74 M106 98 L 64 92" stroke="#7fa49c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-head">
        {/* lang hals */}
        <path d="M128 88 C 150 78, 156 56, 170 36" stroke="#8fb0a8" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M130 94 C 154 86, 162 62, 174 42" stroke="#e3eee6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* lille kam */}
        <path d="M168 24 C 158 20, 150 22, 146 28 C 154 32, 162 34, 170 32 Z" fill="#e6735a" />
        <ellipse cx="177" cy="31" rx="13" ry="9" fill="#8fb0a8" />
        {/* langt næb */}
        <path d="M186 25 L 238 34 L 237 38 L 186 40 Z" fill="#a8c4bd" />
        <path d="M184 40 L 237 38" stroke="#5f8280" strokeWidth="2" strokeLinecap="round" />
        <path d="M186 37 q 6 3 12 1" stroke="#466664" strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(178, 28, 3.8)}
      </g>
    </>
  ),
};

const archaeopteryx: CreatureSpec = {
  name: "Archaeopteryx",
  height: 7,
  aspect: 165 / 120,
  gait: "float",
  zone: "open",
  pace: 1.2,
  viewBox: "-5 0 165 120",
  art: (
    <>
      {/* lang fjerhale */}
      <path d="M62 68 L 6 106" stroke="#24566f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g transform="translate(52 75)">
        <ellipse rx="12" ry="4.4" fill="#2f6a86" transform="rotate(172) translate(10 0)" />
        <ellipse rx="12" ry="4.4" fill="#4f90ad" transform="rotate(118) translate(10 0)" />
      </g>
      <g transform="translate(41 83)">
        <ellipse rx="12" ry="4.4" fill="#4f90ad" transform="rotate(172) translate(10 0)" />
        <ellipse rx="12" ry="4.4" fill="#2f6a86" transform="rotate(118) translate(10 0)" />
      </g>
      <g transform="translate(30 90)">
        <ellipse rx="12" ry="4.4" fill="#2f6a86" transform="rotate(172) translate(10 0)" />
        <ellipse rx="12" ry="4.4" fill="#4f90ad" transform="rotate(118) translate(10 0)" />
      </g>
      <g transform="translate(19 97)">
        <ellipse rx="12" ry="4.4" fill="#4f90ad" transform="rotate(172) translate(10 0)" />
        <ellipse rx="12" ry="4.4" fill="#2f6a86" transform="rotate(118) translate(10 0)" />
      </g>
      <ellipse cx="9" cy="104" rx="10" ry="4.6" fill="#7fb4cc" transform="rotate(145 9 104)" />
      {/* fjern vinge */}
      <g className="zoo-wing" style={{ "--flap": "0.35s" } as React.CSSProperties}>
        <g transform="translate(86 54)" opacity="0.9">
          <ellipse rx="22" ry="6.5" fill="#24566f" transform="rotate(-70) translate(20 0)" />
          <ellipse rx="22" ry="6.5" fill="#24566f" transform="rotate(-95) translate(20 0)" />
          <ellipse rx="22" ry="6.5" fill="#24566f" transform="rotate(-120) translate(20 0)" />
        </g>
      </g>
      {/* ben */}
      <path d="M72 76 L 70 90 L 62 94 M70 90 L 76 94" stroke="#e8a64a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g className="zoo-torso">
        <ellipse cx="80" cy="64" rx="28" ry="15" fill="#3f7a96" transform="rotate(-14 80 64)" />
        <ellipse cx="86" cy="72" rx="17" ry="7" fill="#f4e6c4" transform="rotate(-14 86 72)" />
      </g>
      {/* nær vinge: fjervifte */}
      <g className="zoo-wing" style={{ "--flap": "0.35s" } as React.CSSProperties}>
        <g transform="translate(88 56)">
          <ellipse rx="26" ry="7.5" fill="#4f90ad" transform="rotate(-100) translate(24 0)" />
          <ellipse rx="26" ry="7.5" fill="#2f6a86" transform="rotate(-125) translate(24 0)" />
          <ellipse rx="26" ry="7.5" fill="#4f90ad" transform="rotate(-150) translate(24 0)" />
          <ellipse rx="26" ry="7.5" fill="#2f6a86" transform="rotate(-175) translate(24 0)" />
          <ellipse rx="22" ry="7" fill="#7fb4cc" transform="rotate(-200) translate(20 0)" />
        </g>
      </g>
      <g className="zoo-head">
        <path d="M96 56 C 104 54, 108 50, 110 46" stroke="#3f7a96" strokeWidth="12" fill="none" strokeLinecap="round" />
        <circle cx="113" cy="42" r="13" fill="#3f7a96" />
        <ellipse cx="116" cy="50" rx="8" ry="4" fill="#f4e6c4" />
        {/* tandløst, sødt næb */}
        <path d="M122 38 C 132 38, 140 42, 142 47 C 134 50, 126 50, 121 48 Z" fill="#f2b04a" />
        <path d="M124 46 q 6 2 14 0" stroke="#c9822a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* små fjer på hovedet */}
        <path d="M106 32 C 104 24, 110 22, 112 28 C 114 22, 120 24, 118 30 Z" fill="#2f6a86" />
        {EYE(117, 39, 3.6)}
      </g>
    </>
  ),
};

const iguanodon: CreatureSpec = {
  name: "Iguanodon",
  height: 20,
  aspect: 260 / 170,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 260 170",
  art: (
    <>
      {/* hale */}
      <path d="M84 52 C 54 50, 24 66, 4 98 C 32 92, 64 98, 92 100 Z" fill="#7d9a78" />
      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">
        <rect x="124" y="92" width="22" height="66" rx="11" fill="#5f7d5d" />
        <ellipse cx="140" cy="162" rx="22" ry="8" fill="#5f7d5d" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="172" y="84" width="14" height="40" rx="7" fill="#5f7d5d" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="128" cy="70" rx="70" ry="37" fill="#7d9a78" transform="rotate(-6 128 70)" />
        <ellipse cx="134" cy="88" rx="48" ry="16" fill="#b9ceaa" transform="rotate(-6 134 88)" />
        <circle cx="96" cy="56" r="5" fill="#5f7d5d" opacity="0.5" />
        <circle cx="122" cy="50" r="5" fill="#5f7d5d" opacity="0.5" />
        <circle cx="150" cy="52" r="5" fill="#5f7d5d" opacity="0.5" />
        {/* hals */}
        <path d="M168 62 C 184 56, 192 50, 200 44" stroke="#7d9a78" strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d="M172 78 C 186 72, 196 64, 204 56" stroke="#b9ceaa" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* lår */}
        <ellipse cx="112" cy="94" rx="22" ry="24" fill="#8fae88" />
      </g>
      {/* nære ben */}
      <g className="zoo-leg zoo-leg-b">
        <rect x="100" y="94" width="24" height="64" rx="12" fill="#8fae88" />
        <ellipse cx="118" cy="162" rx="24" ry="8" fill="#8fae88" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="158" y="82" width="16" height="40" rx="8" fill="#7d9a78" />
        <ellipse cx="168" cy="124" rx="11" ry="8" fill="#7d9a78" />
        {/* tommelfinger-pig */}
        <path d="M170 116 L 194 112 L 176 134 Z" fill="#f1e6c8" />
      </g>
      <g className="zoo-head">
        <ellipse cx="216" cy="44" rx="26" ry="16" fill="#7d9a78" />
        <ellipse cx="236" cy="50" rx="14" ry="12" fill="#7d9a78" />
        <ellipse cx="240" cy="56" rx="10" ry="6" fill="#b9ceaa" />
        <path d="M228 60 q 10 5 22 -1" stroke="#5f7d5d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="244" cy="46" r="2" fill="#5f7d5d" />
        {EYE(218, 40, 3.8)}
      </g>
    </>
  ),
};

const protoceratops: CreatureSpec = {
  name: "Protoceratops",
  height: 9,
  aspect: 200 / 120,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 200 120",
  art: (
    <>
      {/* hale */}
      <path d="M44 60 C 28 64, 14 76, 4 92 C 22 90, 38 90, 52 88 Z" fill="#c8a36a" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="112" y="80" width="17" height="40" rx="8" fill="#a98349" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="48" y="80" width="17" height="40" rx="8" fill="#a98349" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="92" cy="72" rx="58" ry="29" fill="#c8a36a" />
        <ellipse cx="96" cy="88" rx="42" ry="13" fill="#ecd7a4" />
        <path d="M50 54 C 76 44, 106 44, 130 54" stroke="#a98349" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="124" y="80" width="18" height="40" rx="9" fill="#c8a36a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="80" width="18" height="40" rx="9" fill="#c8a36a" />
      </g>
      <g className="zoo-head">
        {/* stort nakkeskjold */}
        <path d="M158 56 C 152 6, 98 -4, 86 30 C 86 52, 110 66, 142 74 Z" fill="#c26a3a" />
        <path d="M152 56 C 146 18, 104 10, 96 32 C 96 48, 116 60, 142 68 Z" fill="#f0a96e" />
        <circle cx="106" cy="12" r="5" fill="#c26a3a" />
        <circle cx="124" cy="6" r="5" fill="#c26a3a" />
        <circle cx="142" cy="12" r="5" fill="#c26a3a" />
        <circle cx="90" cy="20" r="5" fill="#c26a3a" />
        <circle cx="153" cy="28" r="5" fill="#c26a3a" />
        {/* hoved */}
        <ellipse cx="152" cy="68" rx="24" ry="20" fill="#c8a36a" />
        <ellipse cx="150" cy="80" rx="16" ry="8" fill="#ecd7a4" />
        {/* papegøjenæb */}
        <path d="M166 54 C 182 52, 194 62, 192 76 C 186 72, 180 72, 172 78 C 164 74, 162 64, 166 54 Z" fill="#f1d089" />
        <path d="M176 72 q 7 3 14 -1" stroke="#a98349" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="186" cy="62" r="1.8" fill="#a98349" />
        {EYE(158, 62, 3.8)}
      </g>
    </>
  ),
};

const compsognathus: CreatureSpec = {
  name: "Compsognathus",
  height: 5,
  aspect: 160 / 90,
  gait: "walk",
  pace: 1.4,
  viewBox: "0 0 160 90",
  art: (
    <>
      {/* lang hale */}
      <path d="M62 38 C 42 40, 24 36, 4 26 C 22 48, 42 58, 66 56 Z" fill="#9bc66a" />
      <path d="M60 46 C 42 46, 26 42, 12 34" stroke="#6f9a44" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M88 52 L 96 70 L 90 84 L 102 85" stroke="#6f9a44" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="80" cy="48" rx="26" ry="15" fill="#9bc66a" transform="rotate(-8 80 48)" />
        <ellipse cx="84" cy="55" rx="18" ry="7" fill="#e6f0c4" transform="rotate(-8 84 55)" />
        <circle cx="68" cy="42" r="3" fill="#6f9a44" opacity="0.55" />
        <circle cx="80" cy="38" r="3" fill="#6f9a44" opacity="0.55" />
        {/* tynd hals */}
        <path d="M98 42 C 110 40, 114 30, 118 22" stroke="#9bc66a" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M76 52 L 68 70 L 74 84 L 86 85" stroke="#b6dc84" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="78" cy="54" rx="11" ry="9" fill="#b6dc84" />
      </g>
      {/* bitte små arme */}
      <path d="M98 52 L 108 60 L 112 58" stroke="#9bc66a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g className="zoo-head">
        <path d="M112 22 C 112 10, 126 8, 136 14 C 144 17, 152 22, 153 26 C 150 31, 140 30, 130 31 C 120 33, 112 31, 112 22 Z" fill="#9bc66a" />
        <path d="M122 29 C 130 33, 144 31, 151 28 C 146 31, 132 32, 122 29 Z" fill="#e6f0c4" />
        <path d="M133 27 q 8 2 16 -1" stroke="#6f9a44" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="146" cy="21" r="1.4" fill="#6f9a44" />
        {EYE(125, 17, 3.6)}
      </g>
    </>
  ),
};

const dilophosaurus: CreatureSpec = {
  name: "Dilophosaurus",
  height: 16,
  aspect: 240 / 160,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 240 160",
  art: (
    <>
      {/* hale */}
      <path d="M72 60 C 44 58, 18 74, 4 100 C 32 92, 62 94, 80 96 Z" fill="#62a58a" />
      <path d="M68 68 C 48 72, 30 84, 16 98" stroke="#3f7d66" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="116" y="84" width="20" height="66" rx="10" fill="#3f7d66" />
        <ellipse cx="130" cy="152" rx="20" ry="8" fill="#3f7d66" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="112" cy="72" rx="54" ry="28" fill="#62a58a" transform="rotate(-10 112 72)" />
        <ellipse cx="118" cy="86" rx="38" ry="13" fill="#cfe6c2" transform="rotate(-10 118 86)" />
        <circle cx="88" cy="54" r="4.5" fill="#3f7d66" opacity="0.5" />
        <circle cx="110" cy="48" r="4.5" fill="#3f7d66" opacity="0.5" />
        <circle cx="132" cy="50" r="4.5" fill="#3f7d66" opacity="0.5" />
        <ellipse cx="104" cy="88" rx="21" ry="21" fill="#78bb9f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="94" y="84" width="22" height="66" rx="11" fill="#78bb9f" />
        <ellipse cx="108" cy="152" rx="22" ry="8" fill="#78bb9f" />
      </g>
      {/* bitte små arme */}
      <g className="zoo-leg zoo-leg-a">
        <path d="M148 80 L 160 90 L 167 88" stroke="#62a58a" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-head">
        {/* farvet nakkekrave */}
        <ellipse cx="160" cy="56" rx="20" ry="27" fill="#f5c242" transform="rotate(18 160 56)" />
        <circle cx="140" cy="62" r="6" fill="#f5c242" />
        <circle cx="146" cy="78" r="6" fill="#f5c242" />
        <circle cx="146" cy="44" r="6" fill="#f5c242" />
        <path d="M148 40 C 138 50, 138 66, 148 76" stroke="#e8944a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M158 36 C 150 48, 152 64, 160 76" stroke="#e8944a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* hals */}
        <path d="M136 66 C 152 62, 160 52, 168 42" stroke="#62a58a" strokeWidth="26" fill="none" strokeLinecap="round" />
        {/* to kamme */}
        <path d="M172 32 C 168 6, 196 -2, 206 28 Z" fill="#d6453d" />
        <path d="M188 32 C 186 10, 212 4, 220 32 Z" fill="#f0705a" />
        <ellipse cx="190" cy="42" rx="24" ry="15" fill="#62a58a" />
        <ellipse cx="210" cy="48" rx="16" ry="9" fill="#62a58a" />
        <ellipse cx="208" cy="53" rx="14" ry="4.5" fill="#cfe6c2" />
        <path d="M206 52 q 8 4 17 0" stroke="#3f7d66" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="221" cy="44" r="1.8" fill="#3f7d66" />
        {EYE(192, 38, 3.8)}
      </g>
    </>
  ),
};

const oviraptor: CreatureSpec = {
  name: "Oviraptor",
  height: 11,
  aspect: 200 / 150,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 200 150",
  art: (
    <>
      {/* hale-fjervifte */}
      <g transform="translate(66 66)">
        <ellipse rx="24" ry="8" fill="#2f7f8c" transform="rotate(200) translate(22 0)" />
        <ellipse rx="26" ry="8" fill="#4aa3b0" transform="rotate(185) translate(24 0)" />
        <ellipse rx="26" ry="8" fill="#f3e3b5" transform="rotate(170) translate(24 0)" />
        <ellipse rx="24" ry="8" fill="#4aa3b0" transform="rotate(155) translate(22 0)" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M110 100 L 106 126 L 110 144 M110 144 L 126 146 M110 144 L 122 138" stroke="#c98a2e" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="76" rx="44" ry="30" fill="#4aa3b0" />
        <ellipse cx="108" cy="88" rx="30" ry="16" fill="#f3e3b5" />
        {/* fjerdusk nederst */}
        <path d="M70 94 q 6 12 12 0 q 6 12 12 0 q 6 12 12 0 q 6 12 12 0 q 6 12 12 0" fill="#f3e3b5" />
        <path d="M128 66 C 136 62, 140 56, 144 50" stroke="#4aa3b0" strokeWidth="20" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M94 100 L 92 126 L 96 144 M96 144 L 112 146 M96 144 L 108 138" stroke="#e3a64a" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* fjerbeklædte arme */}
      <g className="zoo-leg zoo-leg-a">
        <g transform="translate(120 76)">
          <ellipse rx="20" ry="7" fill="#2f7f8c" transform="rotate(95) translate(18 0)" />
          <ellipse rx="22" ry="7" fill="#4aa3b0" transform="rotate(115) translate(20 0)" />
          <ellipse rx="22" ry="7" fill="#f3e3b5" transform="rotate(135) translate(20 0)" />
        </g>
      </g>
      <g className="zoo-head">
        {/* høj kam */}
        <path d="M142 28 C 140 4, 168 -2, 172 22 C 164 24, 152 26, 142 28 Z" fill="#e8534a" />
        <ellipse cx="156" cy="36" rx="18" ry="15" fill="#4aa3b0" />
        {/* papegøjenæb */}
        <path d="M168 30 C 184 30, 192 40, 184 54 C 178 48, 172 48, 164 46 C 164 40, 164 34, 168 30 Z" fill="#f2c14e" />
        <path d="M168 46 q 8 3 15 -1" stroke="#c98a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="179" cy="38" r="1.8" fill="#c98a2e" />
        {EYE(158, 33, 3.8)}
      </g>
    </>
  ),
};

const gallimimus: CreatureSpec = {
  name: "Gallimimus",
  height: 16,
  aspect: 240 / 190,
  gait: "walk",
  pace: 1.4,
  viewBox: "0 0 240 190",
  art: (
    <>
      {/* stiv hale */}
      <path d="M72 84 C 48 82, 24 80, 4 84 C 24 98, 48 104, 76 106 Z" fill="#d9b46a" />
      <path d="M68 92 C 48 92, 28 90, 12 86" stroke="#a8783d" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
      <g className="zoo-leg zoo-leg-a">
        <path d="M118 112 L 112 150 L 118 180 L 134 188" stroke="#a8783d" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="112" cy="98" rx="48" ry="28" fill="#d9b46a" transform="rotate(-10 112 98)" />
        <ellipse cx="118" cy="110" rx="32" ry="12" fill="#f6e6bc" transform="rotate(-10 118 110)" />
        <path d="M76 84 C 92 72, 114 68, 134 74" stroke="#a8783d" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.55" />
        <path d="M82 96 C 98 86, 118 82, 138 88" stroke="#a8783d" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* lang hals */}
        <path d="M140 84 C 166 76, 150 46, 170 30" stroke="#d9b46a" strokeWidth="13" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M100 112 L 96 150 L 104 180 L 120 188" stroke="#c99a50" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* små arme */}
      <path d="M140 98 L 154 108 L 160 106" stroke="#d9b46a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g className="zoo-head">
        <ellipse cx="178" cy="24" rx="13" ry="9" fill="#d9b46a" />
        <path d="M186 22 C 196 22, 204 26, 208 30 C 200 34, 192 34, 186 32 Z" fill="#f1d089" />
        <path d="M188 31 q 7 2 14 -1" stroke="#a8783d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {EYE(180, 21, 3.4)}
      </g>
    </>
  ),
};

export const more: Record<string, CreatureSpec> = {
  pteranodon,
  quetzalcoatlus,
  archaeopteryx,
  iguanodon,
  protoceratops,
  compsognathus,
  dilophosaurus,
  oviraptor,
  gallimimus,
};
