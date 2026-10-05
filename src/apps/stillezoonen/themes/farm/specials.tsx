import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne bondegårdsdyr med særlig opførsel. `art` er figuren, når den går;
 * `special` (samme viewBox) vises, mens den står stille. Se zoo-fx-* i zoo.css.
 */

/** Hestens hoved (som `horse`) med runde læsebriller. */
const hesteHoved = (
  <>
        <path d="M192 26 L 194 6 L 204 24 Z" fill="#b8703c" />
        <path d="M195 22 L 196 11 L 201 22 Z" fill="#e2a58a" />
        <path d="M186 24 C 200 16, 216 22, 224 36 C 232 48, 246 64, 244 74 C 240 82, 228 80, 220 74 C 208 68, 198 60, 190 50 C 184 42, 182 32, 186 24 Z" fill="#b8703c" />
        <path d="M206 28 C 214 38, 226 54, 236 70 L 230 74 C 220 66, 210 54, 202 40 Z" fill="#f6efe2" />
        <ellipse cx="238" cy="74" rx="8" ry="6" fill="#e0b48c" />
        <ellipse cx="240" cy="73" rx="1.8" ry="2.4" fill="#6b4a36" />
        <path d="M188 22 C 200 18, 210 24, 208 38 C 200 34, 192 30, 188 22 Z" fill="#4a2c1a" />
        {EYE(208, 40, 4)}
        {/* Runde læsebriller. */}
        <circle cx="209" cy="41" r="9" fill="#ffffff" fillOpacity="0.25" stroke="#3a2a22" strokeWidth="2.6" />
        <path d="M200 38 L 190 31" stroke="#3a2a22" strokeWidth="2.2" strokeLinecap="round" />
  </>
);

/** Hest med briller og en bog på ryggen — står den stille, sætter den sig og læser. */
const readingHorse: CreatureSpec = {
  name: "Læsehesten",
  rarity: "rare",
  height: 26,
  aspect: 250 / 210,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 250 210",
  art: (

    <>
      <path d="M44 96 C 22 98, 12 128, 18 162 C 28 144, 34 128, 50 112 Z" fill="#4a2c1a" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="142" y="112" width="15" height="98" rx="7" fill="#965a30" />
        <rect x="142" y="198" width="15" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="48" y="112" width="15" height="98" rx="7" fill="#965a30" />
        <rect x="48" y="198" width="15" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="108" cy="104" rx="72" ry="34" fill="#b8703c" />
        <path d="M138 84 C 148 54, 166 36, 190 28 L 218 50 C 200 62, 192 84, 184 114 Z" fill="#b8703c" />
        <path d="M130 86 C 138 54, 158 32, 190 22 L 192 36 C 172 44, 160 60, 152 92 Z" fill="#4a2c1a" />
        <ellipse cx="108" cy="124" rx="48" ry="10" fill="#cd8a52" opacity="0.6" />
              {/* Yndlingsbogen spændt fast på ryggen. */}
        <path d="M98 74 C 96 92, 98 112, 104 136" stroke="#6b4a36" strokeWidth="4" fill="none" />
        <rect x="80" y="60" width="44" height="15" rx="2.5" fill="#2f6fb0" />
        <rect x="83" y="63" width="38" height="5" rx="1" fill="#fffaf0" />
        <rect x="80" y="70" width="44" height="5" rx="2" fill="#245a92" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="158" y="114" width="16" height="96" rx="7" fill="#b8703c" />
        <rect x="158" y="192" width="16" height="6" fill="#f6efe2" />
        <rect x="158" y="198" width="16" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="114" width="16" height="96" rx="7" fill="#b8703c" />
        <rect x="62" y="192" width="16" height="6" fill="#f6efe2" />
        <rect x="62" y="198" width="16" height="12" rx="4" fill="#3a2a22" />
      </g>
      <g className="zoo-head">{hesteHoved}</g>
    </>
  ),
  special: (
    <>
      {/* Halen ligger på jorden bag den. */}
      <path d="M62 158 C 36 160, 22 184, 24 208 C 40 196, 54 184, 72 174 Z" fill="#4a2c1a" />
      {/* Bagbenene strakt frem langs jorden; hovene står, hvor de nære forben står, når den går. */}
      <rect x="104" y="192" width="64" height="15" rx="7" fill="#965a30" />
      <rect x="160" y="192" width="14" height="15" rx="4" fill="#3a2a22" />
      {/* Fjerne forben bag bogen. */}
      <path d="M158 112 C 186 124, 214 134, 232 140" stroke="#965a30" strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Kroppen sidder op. */}
      <ellipse cx="124" cy="136" rx="34" ry="58" transform="rotate(28 124 136)" fill="#b8703c" />
      <ellipse cx="134" cy="146" rx="18" ry="40" transform="rotate(28 134 146)" fill="#cd8a52" opacity="0.6" />
      {/* Hals og man. */}
      <path d="M138 104 C 142 74, 156 56, 174 46 L 196 68 C 182 78, 174 94, 170 118 Z" fill="#b8703c" />
      <path d="M128 106 C 132 74, 148 50, 174 38 L 178 50 C 160 58, 148 78, 144 106 Z" fill="#4a2c1a" />
      {/* Nære baglår og -ben. */}
      <ellipse cx="92" cy="178" rx="46" ry="32" fill="#b8703c" />
      <rect x="92" y="195" width="62" height="15" rx="7" fill="#b8703c" />
      <rect x="148" y="195" width="14" height="15" rx="4" fill="#3a2a22" />
      {/* Den åbne bog. */}
      <g transform="translate(212 134) scale(1.3) translate(-212 -134)">
        <path d="M212 152 L 186 146 L 186 112 L 212 118 L 238 112 L 238 146 Z" fill="#2f6fb0" />
        <path d="M212 120 L 189 115 L 189 144 L 212 149 Z" fill="#fffaf0" />
        <path d="M212 120 L 235 115 L 235 144 L 212 149 Z" fill="#fffaf0" />
        <path d="M193 122 l 15 3.4 M193 128 l 15 3.4 M193 134 l 11 2.5 M216 125.4 l 15 -3.4 M216 131.4 l 15 -3.4 M216 137.4 l 11 -2.5" stroke="#b9ab92" strokeWidth="1.8" strokeLinecap="round" />
        {/* Siden, der langsomt vendes. */}
        <g className="zoo-fx-flip" style={{ animationDuration: "4.5s" }}>
          <path d="M212 120 L 235 115 L 235 144 L 212 149 Z" fill="#f3ead6" stroke="#e2d6bd" strokeWidth="0.8" />
          <path d="M216 125.4 l 15 -3.4 M216 131.4 l 15 -3.4" stroke="#b9ab92" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <path d="M212 119 v 31" stroke="#245a92" strokeWidth="2" />
        <path d="M214 149 l 2 12 l 3 -3 l 3 2 l -2 -11" fill="#e0453a" />
      </g>
      {/* Nære forben holder bogen. */}
      <path d="M146 116 C 160 136, 172 148, 184 152" stroke="#b8703c" strokeWidth="15" fill="none" strokeLinecap="round" />
      <ellipse cx="186" cy="151" rx="7" ry="8" transform="rotate(-20 186 151)" fill="#3a2a22" />
      {/* Hovedet bøjet over bogen; nikker stille og roligt, mens den læser. */}
      <g className="zoo-fx-nod" style={{ animationDuration: "2.2s", transformOrigin: "20% 40%" }}>
        <g transform="translate(-16 22) rotate(14 190 40)">{hesteHoved}</g>
      </g>
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  readingHorse,
};
