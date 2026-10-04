import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne og legendariske jungledyr med særlig opførsel. `art` er figuren,
 * når den går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Abe med slips og mappe — står den stille, ringer bananmobilen. */
const businessMonkey: CreatureSpec = {
  name: "Forretningsaben",
  rarity: "rare",
  height: 17,
  aspect: 130 / 150,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 130 150",
  art: (
    <>
      <path d="M38 98 C 8 100, 6 64, 26 62 C 40 60, 40 80, 28 80" stroke="#7a4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a"><path d="M74 112 v 30" stroke="#6a3f23" strokeWidth="11" strokeLinecap="round" /><ellipse cx="78" cy="145" rx="9" ry="4" fill="#c49a70" /></g>
      <g className="zoo-leg zoo-leg-b"><path d="M76 74 l 18 24" stroke="#6a3f23" strokeWidth="9" strokeLinecap="round" /></g>
      <g className="zoo-torso">
        <ellipse cx="66" cy="94" rx="28" ry="30" fill="#8a5632" />
        <ellipse cx="72" cy="98" rx="16" ry="20" fill="#d9ab7f" />
        <path d="M66 68 h 12 l -3 6 h -6 z" fill="#a8261f" />
        <path d="M69 74 h 6 l 4 22 l -7 8 l -7 -8 z" fill="#c8382f" />
        <path d="M70 80 l 7 4 M68 88 l 9 5" stroke="#e8726a" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b"><path d="M58 112 v 32" stroke="#8a5632" strokeWidth="12" strokeLinecap="round" /><ellipse cx="62" cy="145" rx="9" ry="4" fill="#d9ab7f" /></g>
      <g className="zoo-leg zoo-leg-a">
        <path d="M62 76 l 22 26" stroke="#8a5632" strokeWidth="10" strokeLinecap="round" />
        <path d="M82 104 q 4 -6 8 0" stroke="#2a1d16" strokeWidth="3" fill="none" />
        <rect x="76" y="104" width="22" height="16" rx="3" fill="#3b2a20" />
        <path d="M76 110 h 22" stroke="#5a4232" strokeWidth="1.5" />
        <rect x="85" y="108" width="4" height="4" rx="1" fill="#e2b13c" />
        <circle cx="86" cy="104" r="6" fill="#d9ab7f" />
      </g>
      <g className="zoo-head">
        <circle cx="54" cy="44" r="11" fill="#8a5632" /><circle cx="54" cy="44" r="6" fill="#d9ab7f" />
        <circle cx="76" cy="42" r="27" fill="#8a5632" />
        <path d="M66 40 C 66 28, 82 26, 86 36 C 96 34, 104 44, 98 54 C 96 66, 74 70, 68 58 C 62 54, 62 46, 66 40 Z" fill="#e2b98e" />
        {EYE(77, 40, 3.6)}
        {EYE(92, 40, 3.6)}
        <path d="M82 58 q 6 5 12 0" stroke="#5a341c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  special: (
    <>
      <path d="M38 98 C 8 100, 6 64, 26 62 C 40 60, 40 80, 28 80" stroke="#7a4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M74 112 v 30" stroke="#6a3f23" strokeWidth="11" strokeLinecap="round" /><ellipse cx="78" cy="145" rx="9" ry="4" fill="#c49a70" />
      {/* Fri arm der gestikulerer ivrigt. */}
      <g className="zoo-fx-wave" style={{ transformOrigin: "0% 0%" }}>
        <path d="M80 78 l 22 6" stroke="#6a3f23" strokeWidth="9" strokeLinecap="round" />
        <circle cx="104" cy="85" r="6" fill="#c49a70" />
      </g>
      <ellipse cx="66" cy="94" rx="28" ry="30" fill="#8a5632" />
      <ellipse cx="72" cy="98" rx="16" ry="20" fill="#d9ab7f" />
      <path d="M66 68 h 12 l -3 6 h -6 z" fill="#a8261f" />
      <path d="M69 74 h 6 l 4 22 l -7 8 l -7 -8 z" fill="#c8382f" />
      <path d="M70 80 l 7 4 M68 88 l 9 5" stroke="#e8726a" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 112 v 32" stroke="#8a5632" strokeWidth="12" strokeLinecap="round" /><ellipse cx="62" cy="145" rx="9" ry="4" fill="#d9ab7f" />
      {/* Mappen står ved fødderne. */}
      <rect x="86" y="128" width="24" height="17" rx="3" fill="#3b2a20" />
      <path d="M93 128 q 5 -6 10 0" stroke="#2a1d16" strokeWidth="3" fill="none" />
      <path d="M86 134 h 24" stroke="#5a4232" strokeWidth="1.5" />
      <rect x="96" y="132" width="4" height="4" rx="1" fill="#e2b13c" />
      <g className="zoo-fx-nod" style={{ transformOrigin: "50% 100%" }}>
        <circle cx="54" cy="44" r="11" fill="#8a5632" /><circle cx="54" cy="44" r="6" fill="#d9ab7f" />
        <circle cx="76" cy="42" r="27" fill="#8a5632" />
        <path d="M66 40 C 66 28, 82 26, 86 36 C 96 34, 104 44, 98 54 C 96 66, 74 70, 68 58 C 62 54, 62 46, 66 40 Z" fill="#e2b98e" />
        {EYE(77, 40, 3.6)}
        {EYE(92, 40, 3.6)}
        <ellipse className="zoo-fx-talk" cx="89" cy="58" rx="5" ry="4.5" fill="#5a341c" />
      </g>
      {/* Bananmobilen holdt op til øret. */}
      <path d="M60 80 C 46 74, 40 62, 44 52" stroke="#8a5632" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M42 26 C 30 40, 34 60, 52 66 C 44 58, 40 44, 48 28 Z" fill="#f4d23c" stroke="#c9a21f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M42 26 l 4 -4" stroke="#6b4a1e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="45" cy="52" r="6" fill="#d9ab7f" />
      {/* "Bla bla" der stiger op. */}
      <g className="zoo-fx-rise"><path d="M104 40 q 4 -5 8 0 q 4 5 8 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
      <g className="zoo-fx-rise" style={{ "--d": "1.2s" } as React.CSSProperties}><path d="M108 28 q 3 -4 6 0 q 3 4 6 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  businessMonkey,
};
