import type { CSSProperties } from "react";
import { fx, GLIMT } from "../fx";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Sjældne akvariedyr med særlig opførsel. `art` er figuren, når den svømmer;
 * `special` (samme viewBox) vises, mens den holder pause. Se zoo-fx-* i zoo.css.
 */

const PIG = "#d8a53a";
const VINKLER = [-120, -95, -70, -45, -20, 5, 30, 55, 80, 105, 130, 155, 180, 205];

/** Kuglefiskens krop (som `pufferfish`), uden hale og ansigt. */
const kuglekrop = (
  <>
    {VINKLER.map((a) => (
      <path key={a} d="M-4 -40 L 0 -49 L 4 -40 Z" fill={PIG} transform={`translate(62 56) rotate(${a})`} />
    ))}
    <circle cx="62" cy="56" r="40" fill="#f6cc52" />
    <path d="M26 66 C 36 96, 90 100, 100 68 C 90 80, 40 84, 26 66 Z" fill="#fdf0c2" />
    <circle cx="48" cy="34" r="3.4" fill="#e0a83a" />
    <circle cx="62" cy="26" r="3" fill="#e0a83a" />
    <circle cx="40" cy="52" r="3" fill="#e0a83a" />
    <circle cx="56" cy="46" r="3.4" fill="#e0a83a" />
    <path d="M52 62 C 64 58, 68 72, 56 76 C 48 74, 46 66, 52 62 Z" fill="#e0a83a" />
  </>
);

const HALE = <path d="M26 58 C 18 50, 10 44, 3 44 C 8 54, 8 66, 3 74 C 10 72, 18 66, 26 58 Z" fill="#e0a83a" />;

/** Boblepustepind i munden: skaft og ring. */
const PIND = (
  <>
    <path d="M104 63 L 124 56" stroke="#d6457f" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="131" cy="53" r="8" fill="none" stroke="#d6457f" strokeWidth="3.4" />
  </>
);

const t = (v: number) => +v.toFixed(2);

/** Sæbeboble med regnbueskær og lysglimt. */
const boble = (x: number, y: number, r: number) => (
  <>
    <circle cx={x} cy={y} r={r} fill="#dff4ff" fillOpacity="0.35" stroke="#9fdcf5" strokeWidth={r > 6 ? 1.8 : 1.4} />
    <path d={`M${t(x - r * 0.55)} ${t(y + r * 0.45)} a ${t(r * 0.75)} ${t(r * 0.75)} 0 0 0 ${t(r * 1.1)} ${t(r * 0.2)}`} stroke="#f39ac8" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
    <circle cx={t(x + r * 0.35)} cy={t(y - r * 0.4)} r={t(Math.max(1.2, r * 0.22))} fill="#fff" />
  </>
);

/** viewBox' overkant: boblerne må ikke stige længere op. */
const TOP = -40;

/**
 * En boble, der stiger op. zoo-fx-rise løfter gruppen 120 % af dens egen højde,
 * så en usynlig stribe gør gruppen netop så høj, at boblen ender ved TOP.
 */
const stigendeBoble = (x: number, y: number, r: number, d: string) => {
  const h = t((y - r - TOP) / 1.2 - 2 * r);
  return (
    <g className="zoo-fx-rise" style={{ ...fx(d, "50% 100%"), animationDuration: "2.6s" } as CSSProperties}>
      <rect x={x} y={t(y - r - h)} width="0.1" height={t(h)} fill="none" />
      {boble(x, y, r)}
    </g>
  );
};

/** Kuglefisk med boblepustepind — holder den pause, puster den sæbebobler. */
const bubblePuffer: CreatureSpec = {
  name: "Sæbeboble-kuglefisken",
  rarity: "rare",
  // Samme fisk som `pufferfish` (height 11 på 100 enheder), men med plads til
  // pinden og boblerne over den.
  height: 15.4,
  aspect: 150 / 140,
  gait: "swim",
  pace: 0.8,
  viewBox: "0 -40 150 140",
  art: (
    <>
      <g className="zoo-tail">{HALE}</g>
      {kuglekrop}
      <g className="zoo-head">
        <circle cx="86" cy="44" r="11" fill="#fff" />
        {EYE(88, 44, 6.4)}
        {PIND}
        <ellipse cx="102" cy="62" rx="6.4" ry="5.2" fill="#e8884a" />
        <ellipse cx="104" cy="62" rx="2.4" ry="2" fill="#9a4a24" />
        <circle cx="86" cy="62" r="5" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
  special: (
    <>
      {HALE}
      {kuglekrop}
      {/* Pustede kinder og spidset mund mod pinden. */}
      <circle cx="86" cy="44" r="11" fill="#fff" />
      {EYE(88, 44, 6.4)}
      {PIND}
      <circle cx="88" cy="63" r="8" fill="#ff9a8a" opacity="0.6" />
      <circle cx="103" cy="62" r="5.4" fill="#e8884a" />
      <circle cx="104" cy="62" r="2.6" fill="#7a3418" />
      {/* Boblen i ringen vokser og svulmer. */}
      <g className="zoo-fx-bob" style={{ ...fx("0s"), animationDuration: "0.7s" } as CSSProperties}>
        {boble(132, 50, 11)}
      </g>
      {/* Bobler, der stiger op i forskudt takt. */}
      {stigendeBoble(139, 28, 9, "0s")}
      {stigendeBoble(120, 26, 6, "0.65s")}
      {stigendeBoble(143, 6, 5, "1.3s")}
      {stigendeBoble(126, 2, 7.5, "1.95s")}
      <g className="zoo-fx-sparkle" style={fx("0.4s")}>
        {GLIMT(116, 40, 3.2)}
        {GLIMT(146, 40, 2.6)}
      </g>
    </>
  ),
};

export const specials: Record<string, CreatureSpec> = {
  bubblePuffer,
};
