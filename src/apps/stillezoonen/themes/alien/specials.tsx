import type { CSSProperties } from "react";
import { fx, GLIMT, HJERTE } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne rumvæsner med særlig opførsel. `art` er figuren, når den bevæger
 * sig; `special` (samme viewBox) vises, mens den holder pause. Se zoo-fx-* i zoo.css.
 */

/** Alien-cowboy i kuplen (som i `ufo`), med cowboyhat. */
const cowboy = (vink: boolean) => (
  // Løftet lidt op i kuplen, så ansigtet ses over tallerkenen.
  <g transform="translate(0 -7)">
    <circle cx="73" cy="40" r="15" fill="#7fe07a" />
    {EYE(68, 39, 3.6)}
    {EYE(80, 39, 3.6)}
    <path d="M70 47 q 3.5 3.5 8 0" stroke="#2f8a3b" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Cowboyhat */}
    <path d="M56 28 C 62 31, 84 31, 90 28 C 88 33, 58 33, 56 28 Z" fill="#a8672e" />
    <path d="M62 29 C 62 18, 66 15, 73 18 C 80 15, 84 18, 84 29 Z" fill="#c07a3a" />
    <path d="M62 26 h 22" stroke="#7a4420" strokeWidth="2.6" />
    {vink && (
      <g className="zoo-fx-wave" style={fx("0s", "50% 100%")}>
        <path d="M86 50 C 92 46, 94 40, 92 34" stroke="#7fe07a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="33" r="3.4" fill="#7fe07a" />
      </g>
    )}
  </g>
);

/** Kuplen og tallerkenen med ko-pletter. */
const tallerken = (
  <>
    <path d="M34 56 C 32 0, 110 -2, 108 56 Z" fill="#c5f7ff" opacity="0.55" />
    <path d="M44 36 C 48 18, 60 11, 74 11" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
    <path d="M16 62 C 26 84, 116 84, 126 62 Z" fill="#8f78e0" />
    <ellipse cx="71" cy="58" rx="67" ry="18" fill="#f7f4ee" />
    <ellipse cx="38" cy="56" rx="11" ry="6" fill="#2f2a2e" />
    <ellipse cx="80" cy="64" rx="13" ry="5.5" fill="#2f2a2e" />
    <ellipse cx="110" cy="54" rx="8" ry="5" fill="#2f2a2e" />
    <ellipse cx="62" cy="50" rx="6" ry="3.4" fill="#2f2a2e" />
    <circle cx="24" cy="64" r="4" fill="#ff7ac8" />
    <circle cx="50" cy="71" r="4" fill="#ffd84a" />
    <circle cx="92" cy="71" r="4" fill="#5fe3d8" />
    <circle cx="118" cy="64" r="4" fill="#ff7ac8" />
  </>
);

/** Lille ko, set fra siden, med midten i (0, 0). */
const lilleKo = (
  <>
    <path d="M-15 6 v 9 M-7 7 v 9 M7 7 v 9 M14 6 v 9" stroke="#e8e2d6" strokeWidth="4" strokeLinecap="round" />
    <path d="M-15 13 v 2 M-7 14 v 2 M7 14 v 2 M14 13 v 2" stroke="#4a3f3a" strokeWidth="4" strokeLinecap="round" />
    <path d="M-19 -2 C -26 0, -27 8, -23 12" stroke="#3b3532" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="0" cy="0" rx="19" ry="11" fill="#f7f4ee" />
    <ellipse cx="-6" cy="-4" rx="6" ry="4.4" fill="#3b3532" />
    <ellipse cx="8" cy="4" rx="5" ry="3.6" fill="#3b3532" />
    <path d="M17 -10 l -2 -6 l 5 4 Z" fill="#efe3c4" />
    <ellipse cx="22" cy="-3" rx="9" ry="8" fill="#f7f4ee" />
    <ellipse cx="27" cy="1" rx="6" ry="4.4" fill="#f3a9b4" />
    <ellipse cx="15" cy="-7" rx="4" ry="2" transform="rotate(-20 15 -7)" fill="#3b3532" />
    {EYE(23, -5, 2.2)}
  </>
);

/** Usynlig lodret stribe: gør en bob-gruppe høj, så den bevæger sig længere. */
const STRIBE = <rect x="70" y="0" width="0.1" height="160" fill="none" stroke="none" />;

/** UFO med ko-pletter og cowboy — holder den pause, beamer den en lille ko op. */
const cowUfo: CreatureSpec = {
  name: "Ko-UFO'en",
  rarity: "rare",
  // Samme UFO som `ufo` (height 14 på 90 enheder) med plads til lysstrålen under.
  height: 24.9,
  aspect: 140 / 160,
  gait: "float",
  pace: 1,
  // Står på jorden: boksen rummer lysstrålen helt ned, så UFO'en svæver
  // over sin skygge (i zone "open" røg tallerkenen op under topbaren).
  zone: "ground",
  viewBox: "0 0 140 160",
  art: (
    <>
      {cowboy(false)}
      {tallerken}
      <circle cx="71" cy="80" r="4.4" fill="#ffd84a" />
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>
        {GLIMT(24, 64, 3, "#fff")}
      </g>
    </>
  ),
  special: (
    <>
      {/* Lysstrålen fra bunden af UFO'en og ned. */}
      <path d="M54 78 L 88 78 L 120 156 L 22 156 Z" fill="#fff2a8" opacity="0.4" />
      <path d="M62 78 L 80 78 L 98 156 L 44 156 Z" fill="#fff8d0" opacity="0.45" />
      <ellipse cx="71" cy="155" rx="50" ry="4.6" fill="#fff2a8" opacity="0.6" />
      <g className="zoo-fx-sparkle" style={fx("0s")}>{GLIMT(40, 132, 3.4, "#fffbe0")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(102, 120, 3, "#fffbe0")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(58, 100, 2.6, "#fffbe0")}</g>
      {/* Koen svæver op i strålen og tumler lidt rundt. */}
      <g className="zoo-fx-bob" style={{ ...fx("0s"), animationDuration: "1.4s" } as CSSProperties}>
        {STRIBE}
        <g className="zoo-fx-bob" style={{ ...fx("0.7s"), animationDuration: "1.4s" } as CSSProperties}>
          {STRIBE}
          <g transform="translate(71 126)">
            <g className="zoo-fx-wave" style={{ ...fx("0s", "50% 50%"), animationDuration: "1.6s" } as CSSProperties}>
              {lilleKo}
            </g>
          </g>
        </g>
      </g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{HJERTE(98, 104, 4, "#ff7ac8")}</g>
      {cowboy(true)}
      {tallerken}
      <circle cx="71" cy="80" r="5" fill="#fff2a8" />
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  cowUfo,
};
