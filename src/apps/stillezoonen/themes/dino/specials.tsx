import type { CSSProperties } from "react";
import { fx, GLIMT } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne dinoer med særlig opførsel. `art` er figuren, når den går;
 * `special` (samme viewBox) vises, mens den står stille. Se zoo-fx-* i zoo.css.
 */

/** Skumbobbel, der stiger op fra munden. Den usynlige stribe gør stigningen længere. */
const boble = (x: number, y: number, r: number, d: string) => (
  <g className="zoo-fx-rise" style={{ ...fx(d, "50% 100%"), animationDuration: "2.2s" } as CSSProperties}>
    <rect x={x} y={y - 26} width="0.1" height="26" fill="none" stroke="none" />
    <circle cx={x} cy={y} r={r} fill="#fff" stroke="#bfe2f5" strokeWidth="1.2" />
  </g>
);

/** T. rex (som `tRex`) med tandbørste — står den stille, børster den tænder. */
const toothbrushRex: CreatureSpec = {
  name: "Tandbørste-T. rex",
  rarity: "rare",
  height: 28,
  aspect: 262 / 184,
  gait: "walk",
  pace: 0.85,
  viewBox: "0 12 262 184",
  art: (
    <>

      {/* fjerne ben */}
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="112" cy="124" rx="22" ry="28" fill="#4b9a4a" />
        <path d="M108 138 C 106 156, 108 168, 108 176" stroke="#4b9a4a" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="189" rx="19" ry="7" fill="#4b9a4a" />
      </g>
<g className="zoo-torso">
        {/* hale */}
        <path d="M78 82 C 52 86, 26 102, 4 134 C 26 136, 54 128, 84 122 Z" fill="#5fae5a" />
        <path d="M58 118 C 40 126, 24 132, 8 134" stroke="#e6f0b5" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="122" cy="98" rx="64" ry="44" fill="#5fae5a" />
        <path d="M66 112 C 82 146, 160 150, 184 112 C 160 130, 96 132, 66 112 Z" fill="#e6f0b5" />
        <g stroke="#4b9a4a" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M84 62 q 6 10 2 20" />
          <path d="M106 56 q 6 10 2 22" />
          <path d="M128 56 q 6 10 2 22" />
        </g>
        {/* små arme */}
        <path d="M176 108 C 186 110, 192 116, 192 124" stroke="#4b9a4a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M192 126 l 3 6 M192 126 l -3 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      {/* Tandbørsten i den lille hånd. */}
        <path d="M193 124 L 199 96" stroke="#4aa3e0" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="195" y="84" width="9" height="13" rx="2" fill="#fff" stroke="#bfe2f5" strokeWidth="1.5" />
      </g>
{/* nært ben */}
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="144" cy="122" rx="27" ry="31" fill="#5fae5a" />
        <path d="M144 138 C 142 156, 144 168, 144 176" stroke="#5fae5a" strokeWidth="26" fill="none" strokeLinecap="round" />
        <ellipse cx="156" cy="188" rx="21" ry="8" fill="#5fae5a" />
        <path d="M168 190 h 6 M162 193 h 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      </g>
<g className="zoo-head">
        <ellipse cx="178" cy="74" rx="24" ry="26" fill="#5fae5a" />
        <path d="M164 52 C 164 24, 206 12, 236 24 C 256 30, 260 52, 254 64 C 248 82, 222 88, 196 86 C 174 84, 162 66, 166 40 Z" fill="#5fae5a" />
        {/* lys hage */}
        <path d="M200 84 C 220 90, 244 84, 254 66 C 250 78, 232 82, 214 76 Z" fill="#e6f0b5" />
        {/* venligt smil */}
        <path d="M250 62 C 240 76, 224 76, 212 66" stroke="#2f6d33" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="252" cy="42" r="2.6" fill="#2f6d33" />
        <circle cx="214" cy="62" r="7" fill="#ffc2b0" opacity="0.7" />
        {EYE(224, 40, 6)}
        <path d="M214 28 q 10 -4 20 2" stroke="#4b9a4a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>

      {/* fjerne ben */}
      <g>
        <ellipse cx="112" cy="124" rx="22" ry="28" fill="#4b9a4a" />
        <path d="M108 138 C 106 156, 108 168, 108 176" stroke="#4b9a4a" strokeWidth="22" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="189" rx="19" ry="7" fill="#4b9a4a" />
      </g>
<g>
        {/* hale */}
        <path d="M78 82 C 52 86, 26 102, 4 134 C 26 136, 54 128, 84 122 Z" fill="#5fae5a" />
        <path d="M58 118 C 40 126, 24 132, 8 134" stroke="#e6f0b5" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* krop */}
        <ellipse cx="122" cy="98" rx="64" ry="44" fill="#5fae5a" />
        <path d="M66 112 C 82 146, 160 150, 184 112 C 160 130, 96 132, 66 112 Z" fill="#e6f0b5" />
        <g stroke="#4b9a4a" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M84 62 q 6 10 2 20" />
          <path d="M106 56 q 6 10 2 22" />
          <path d="M128 56 q 6 10 2 22" />
        </g>
        {/* små arme */}
        <path d="M176 108 C 186 110, 192 116, 192 124" stroke="#4b9a4a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M192 126 l 3 6 M192 126 l -3 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      </g>
{/* nært ben */}
      <g>
        <ellipse cx="144" cy="122" rx="27" ry="31" fill="#5fae5a" />
        <path d="M144 138 C 142 156, 144 168, 144 176" stroke="#5fae5a" strokeWidth="26" fill="none" strokeLinecap="round" />
        <ellipse cx="156" cy="188" rx="21" ry="8" fill="#5fae5a" />
        <path d="M168 190 h 6 M162 193 h 6" stroke="#e6f0b5" strokeWidth="3" strokeLinecap="round" />
      </g>
<g>
        <ellipse cx="178" cy="74" rx="24" ry="26" fill="#5fae5a" />
        <path d="M164 52 C 164 24, 206 12, 236 24 C 256 30, 260 52, 254 64 C 248 82, 222 88, 196 86 C 174 84, 162 66, 166 40 Z" fill="#5fae5a" />
        {/* lys hage */}
        <path d="M200 84 C 220 90, 244 84, 254 66 C 250 78, 232 82, 214 76 Z" fill="#e6f0b5" />
        {/* venligt smil */}
        <path d="M250 62 C 240 76, 224 76, 212 66" stroke="#2f6d33" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="252" cy="42" r="2.6" fill="#2f6d33" />
        <circle cx="214" cy="62" r="7" fill="#ffc2b0" opacity="0.7" />
        {EYE(224, 40, 6)}
        <path d="M214 28 q 10 -4 20 2" stroke="#4b9a4a" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      {/* Skum om munden. */}
      <circle cx="244" cy="70" r="6" fill="#fff" />
      <circle cx="236" cy="74" r="5" fill="#fff" />
      <circle cx="252" cy="66" r="4.4" fill="#fff" />
      <circle cx="228" cy="72" r="3.6" fill="#fff" />
      {/* Tandbørsten skrubber frem og tilbage i munden. */}
      <g className="zoo-fx-shake" style={{ ...fx("0s"), animationDuration: "0.25s" } as CSSProperties}>
        <path d="M254 70 L 230 62" stroke="#4aa3e0" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M230 62 L 196 108" stroke="#4aa3e0" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="248" y="61" width="13" height="9" rx="2" fill="#fff" stroke="#bfe2f5" strokeWidth="1.5" transform="rotate(18 254 66)" />
      </g>
      {/* Bobler stiger op, og tænderne glimter. */}
      {boble(240, 54, 4, "0s")}
      {boble(254, 50, 3, "0.7s")}
      {boble(232, 48, 3.4, "1.4s")}
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(258, 76, 5, "#fff")}</g>
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  toothbrushRex,
};
