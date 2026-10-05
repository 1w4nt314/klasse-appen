import type { CSSProperties } from "react";
import { fx } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne skovdyr med særlig opførsel. `art` er figuren, når den går;
 * `special` (samme viewBox) vises, mens den står stille. Se zoo-fx-* i zoo.css.
 */

/** Pigge lægges som trekanter langs en halvcirkel (spids/dal skiftevis). */
function piggeKurve(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  dybde: number,
  antal: number,
  fraGrader: number,
  tilGrader: number,
) {
  const punkter: string[] = [];
  for (let i = 0; i <= antal * 2; i++) {
    const t = i / (antal * 2);
    const v = ((fraGrader + (tilGrader - fraGrader) * t) * Math.PI) / 180;
    const k = i % 2 === 0 ? 1 : 1 - dybde;
    punkter.push(`${(cx + Math.cos(v) * rx * k).toFixed(1)},${(cy - Math.sin(v) * ry * k).toFixed(1)}`);
  }
  return punkter.join(" ");
}

/** Regndråbe med spidsen opad; (x, y) er dråbens bund. */
const draabe = (x: number, y: number, s = 1) => (
  <path
    d={`M${x} ${y - 10 * s} C ${x + 4 * s} ${y - 4 * s}, ${x + 4 * s} ${y}, ${x} ${y} C ${x - 4 * s} ${y}, ${x - 4 * s} ${y - 4 * s}, ${x} ${y - 10 * s} Z`}
    fill="#6fbbe8"
  />
);

/** Regn: dråber over bladet, der blinker i forskudt takt, så det ligner regn. */
const REGN: ReadonlyArray<readonly [number, number, string]> = [
  [18, -52, "0s"],
  [44, -58, "0.35s"],
  [72, -56, "0.7s"],
  [100, -58, "0.2s"],
  [126, -50, "0.55s"],
  [58, -40, "0.9s"],
  [112, -36, "1.1s"],
  [-6, -20, "0.45s"],
  [140, -10, "0.8s"],
];

/** Pindsvin (som `hedgehog`) — står det stille, holder det et bøgeblad som paraply i regnen. */
const umbrellaHedgehog: CreatureSpec = {
  name: "Paraply-pindsvinet",
  rarity: "rare",
  // Samme pindsvin som `hedgehog` (height 5 på 76 enheder) med plads til
  // paraply og regn over sig; viewBox er udvidet lige meget til begge sider.
  height: 9.6,
  aspect: 164 / 146,
  gait: "walk",
  pace: 0.7,
  viewBox: "-20 -70 164 146",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="72" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="36" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g className="zoo-torso">
        {/* tre lag pigge, mørkest bagerst, med lyse spidser i øverste lag */}
        <polygon points={piggeKurve(54, 60, 46, 46, 0.16, 14, 188, -8)} fill="#553923" />
        <polygon points={piggeKurve(54, 60, 40, 40, 0.18, 12, 182, -2)} fill="#74502f" />
        <polygon points={piggeKurve(52, 60, 31, 31, 0.2, 9, 176, 6)} fill="#946a42" />
        <polygon points={piggeKurve(50, 60, 20, 18, 0.22, 6, 170, 12)} fill="#b08555" />
        <ellipse cx="54" cy="63" rx="40" ry="7.5" fill="#74502f" />
        {/* Et lille bøgeblad båret på piggene — paraplyen til senere. */}
        <path d="M40 22 C 48 8, 70 6, 78 18 C 70 22, 52 26, 40 22 Z" fill="#7cbf4a" />
        <path d="M42 21 C 54 17, 66 15, 77 18" stroke="#5a9a36" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <ellipse cx="82" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <ellipse cx="46" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g className="zoo-head">
        {/* panden dækket af små pigge */}
        <path
          d="M80 40 C 92 38, 104 46, 118 56 C 119 58, 118 60, 116 61 C 106 66, 90 68, 80 64 C 74 58, 74 46, 80 40 Z"
          fill="#f0dab5"
        />
        <ellipse cx="90" cy="43" rx="6" ry="5.5" fill="#b08a5e" />
        <ellipse cx="90" cy="43.5" rx="3.2" ry="3" fill="#e9a9a6" />
        <circle cx="118" cy="57.5" r="4" fill="#2b2420" />
        <circle cx="119.4" cy="56.2" r="1.1" fill="#fff" />
        <circle cx="94" cy="60" r="5" fill="#f1a6b0" opacity="0.55" />
        <path d="M104 62 C 108 65, 112 65, 114 63" stroke="#a88a62" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {EYE(103, 52, 3.6)}
      </g>
    </>
  ),
  special: (
    <>
      {/* Regnen. */}
      {REGN.map(([x, y, d]) => (
        <g key={`${x},${y}`} className="zoo-fx-sparkle" style={{ ...fx(d), animationDuration: "1.2s" } as CSSProperties}>
          {draabe(x, y)}
        </g>
      ))}
      {/* En lille vandpyt. */}
      <ellipse cx="62" cy="74" rx="62" ry="2.6" fill="#9fd3f2" opacity="0.6" />

      <g>
        <ellipse cx="72" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g>
        <ellipse cx="36" cy="70" rx="9" ry="6.5" fill="#b08a5e" />
      </g>
      <g>
        {/* tre lag pigge, mørkest bagerst, med lyse spidser i øverste lag */}
        <polygon points={piggeKurve(54, 60, 46, 46, 0.16, 14, 188, -8)} fill="#553923" />
        <polygon points={piggeKurve(54, 60, 40, 40, 0.18, 12, 182, -2)} fill="#74502f" />
        <polygon points={piggeKurve(52, 60, 31, 31, 0.2, 9, 176, 6)} fill="#946a42" />
        <polygon points={piggeKurve(50, 60, 20, 18, 0.22, 6, 170, 12)} fill="#b08555" />
        <ellipse cx="54" cy="63" rx="40" ry="7.5" fill="#74502f" />
      </g>
      <g>
        <ellipse cx="82" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g>
        <ellipse cx="46" cy="70" rx="9.5" ry="6.5" fill="#e3c9a0" />
      </g>
      <g>
        {/* panden dækket af små pigge */}
        <path
          d="M80 40 C 92 38, 104 46, 118 56 C 119 58, 118 60, 116 61 C 106 66, 90 68, 80 64 C 74 58, 74 46, 80 40 Z"
          fill="#f0dab5"
        />
        <ellipse cx="90" cy="43" rx="6" ry="5.5" fill="#b08a5e" />
        <ellipse cx="90" cy="43.5" rx="3.2" ry="3" fill="#e9a9a6" />
        <circle cx="118" cy="57.5" r="4" fill="#2b2420" />
        <circle cx="119.4" cy="56.2" r="1.1" fill="#fff" />
        <circle cx="94" cy="60" r="5" fill="#f1a6b0" opacity="0.55" />
        <path d="M104 62 C 108 65, 112 65, 114 63" stroke="#a88a62" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {EYE(103, 52, 3.6)}
      </g>
      {/* Bøgebladet som paraply; det vipper blidt i regnen. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "62% 100%"), animationDuration: "2.4s" } as CSSProperties}>
        <path d="M80 -10 C 84 10, 92 32, 98 50" stroke="#6b8f3a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path
          d="M10 -10 C 22 -50, 120 -54, 136 -12 C 128 -18, 118 -18, 110 -11 C 102 -18, 90 -19, 82 -10 C 74 -18, 62 -19, 54 -10 C 46 -18, 34 -18, 26 -10 C 21 -15, 15 -15, 10 -10 Z"
          fill="#7cbf4a"
        />
        <path d="M73 -46 C 74 -34, 76 -22, 80 -10 M73 -40 L 46 -24 M74 -32 L 30 -16 M74 -38 L 102 -24 M76 -28 L 120 -16" stroke="#5a9a36" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M28 -30 C 40 -42, 60 -48, 76 -47" stroke="#a9dc7c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* Poten om stilken. */}
      <ellipse cx="98" cy="52" rx="5" ry="4" fill="#e3c9a0" />
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  umbrellaHedgehog,
};
