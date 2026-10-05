import { EYE } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Legendariske bondegårdsdyr med særlig opførsel. `art` er figuren, når den
 * går; `special` (samme viewBox) vises, mens den står stille.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/* ------------------------------------------------------------------------ */
/* Guldhønen (legendarisk)                                                  */
/* ------------------------------------------------------------------------ */

const HOENE_GULD = "#f6c343";
const HOENE_MOERK = "#e0a42a";
const HOENE_VINGE = "#eaae2e";
const HOENE_GLANS = "#fff6cf";

/** Halefjer i guld; `dy` flytter dem ned, når hønen sidder. */
const hoeneHale = (dy: number) => (
  <g transform={`translate(0 ${dy})`}>
    <path d="M36 62 C 16 56, 8 40, 8 26 C 18 30, 28 38, 42 50 Z" fill={HOENE_MOERK} />
    <path d="M36 70 C 16 70, 4 60, 2 46 C 14 50, 26 56, 40 62 Z" fill="#f2bd3c" />
    <path d="M14 36 C 20 44, 28 50, 36 54 M10 52 C 18 58, 26 62, 34 64" stroke={HOENE_GLANS} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
  </g>
);

/** Hønens hoved i guld (koordinater som Høne i creatures.tsx). */
const hoeneHoved = (
  <>
    <circle cx="84" cy="40" r="18" fill={HOENE_GULD} />
    <path d="M73 34 C 76 27, 84 24, 91 26" stroke={HOENE_GLANS} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="76" cy="21" r="6.5" fill="#e0453a" />
    <circle cx="85" cy="18" r="7.5" fill="#e0453a" />
    <circle cx="94" cy="22" r="6" fill="#e0453a" />
    <path d="M98 38 L 114 44 L 98 49 Z" fill="#ef8a1c" />
    <ellipse cx="98" cy="55" rx="4.5" ry="6.5" fill="#e0453a" />
    {EYE(90, 36, 3.6)}
  </>
);

/** Skinnende guldhøne — står den stille, sætter den sig og lægger et guldæg. */
const goldenHen: CreatureSpec = {
  name: "Guldhønen",
  rarity: "legendary",
  height: 9,
  aspect: 120 / 120,
  gait: "walk",
  pace: 1.15,
  viewBox: "0 0 120 120",
  art: (
    <>
      {hoeneHale(0)}
      <g className="zoo-leg zoo-leg-a">
        <path d="M54 88 V 114 M46 116 H 62 M54 114 L 46 117 M54 114 L 62 117" stroke="#f0a02a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <path d="M70 88 V 114 M62 116 H 78 M70 114 L 62 117 M70 114 L 78 117" stroke="#d98a1c" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="60" cy="70" rx="36" ry="28" fill={HOENE_GULD} />
        <path d="M70 46 C 84 50, 92 60, 88 76 C 80 84, 70 80, 70 70 Z" fill={HOENE_GULD} />
        <path d="M34 56 C 44 46, 60 43, 72 46" stroke={HOENE_GLANS} strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="54" cy="74" rx="22" ry="14" transform="rotate(-8 54 74)" fill={HOENE_VINGE} />
        <path d="M40 78 q 10 4 22 0 M42 84 q 10 3 18 0" stroke="#cf8f17" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Guldet glimter. */}
        <g className="zoo-fx-sparkle">{GLIMT(46, 62, 4.5)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(78, 86, 3.4)}</g>
      </g>
      <g className="zoo-head">
        {hoeneHoved}
        <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(70, 44, 3)}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Hønen sidder i en lille hørede; bunden står, hvor fødderne står, når den går. */}
      <ellipse cx="64" cy="116" rx="54" ry="4" fill="#d9b45a" />
      {hoeneHale(16)}
      <ellipse cx="60" cy="90" rx="40" ry="27" fill={HOENE_GULD} />
      <path d="M70 56 C 84 60, 92 70, 88 86 C 80 94, 70 90, 70 80 Z" fill={HOENE_GULD} />
      <path d="M30 76 C 40 66, 58 63, 70 66" stroke={HOENE_GLANS} strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="54" cy="94" rx="24" ry="14" transform="rotate(-6 54 94)" fill={HOENE_VINGE} />
      <path d="M38 98 q 11 4 24 0 M40 104 q 10 3 19 0" stroke="#cf8f17" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M12 117 l 10 -4 M26 118 l 9 -5 M84 118 l 8 -5 M98 118 l 9 -4 M44 118 l 8 -4" stroke="#b98f3a" strokeWidth="2" strokeLinecap="round" />
      {/* Det skinnende guldæg. */}
      <ellipse cx="106" cy="103" rx="10" ry="13" fill="#ffd23f" stroke="#d99a1c" strokeWidth="1.6" />
      <ellipse cx="102" cy="98" rx="3" ry="5.5" transform="rotate(-18 102 98)" fill={HOENE_GLANS} />
      {/* Hovedet nikker stolt. */}
      <g className="zoo-fx-nod" style={fx("0s", "50% 100%")}>
        <g transform="translate(0 10)">{hoeneHoved}</g>
      </g>
      {/* Ægget funkler. */}
      <g className="zoo-fx-sparkle">{GLIMT(114, 86, 4.5)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.45s")}>{GLIMT(110, 109, 3, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{STJERNE(95, 84, 3, "#ffe98a")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.25s")}>{GLIMT(116, 100, 2.4, "#fff3b0")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.15s")}>{GLIMT(44, 82, 4)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Månekoen (legendarisk)                                                   */
/* ------------------------------------------------------------------------ */

const KO_BLAA = "#5b57c9";
const KO_MOERK = "#423e9e";
const KO_SOELV = "#e6eaff";
const KO_STJERNE = "#ffe27a";

/** Usynlig boks fra viewBox' top til bund, så zoo-fx-bob løfter koen et par streger. */
const KO_BOB_BOKS = <rect x="100" y="-24" width="1" height="174" fill="none" />;

/** Halen med sølvdusk. */
const koHale = (
  <>
    <path d="M34 58 C 18 64, 18 88, 24 104" stroke={KO_MOERK} strokeWidth="4" fill="none" strokeLinecap="round" />
    <ellipse cx="24" cy="108" rx="6" ry="9" fill={KO_SOELV} />
  </>
);

/** Kroppen med stjernepletter. */
const koKrop = (
  <>
    <ellipse cx="100" cy="70" rx="68" ry="38" fill={KO_BLAA} />
    <path d="M52 50 C 76 36, 124 34, 150 46" stroke="#7b78e0" strokeWidth="6" fill="none" strokeLinecap="round" />
    {STJERNE(80, 58, 11, KO_STJERNE)}
    {STJERNE(128, 82, 9, KO_SOELV)}
    {STJERNE(58, 86, 6.5, KO_SOELV)}
    {STJERNE(118, 52, 6, KO_STJERNE)}
    <circle cx="98" cy="78" r="1.8" fill={KO_SOELV} />
    <circle cx="146" cy="64" r="1.5" fill={KO_SOELV} />
    <circle cx="44" cy="66" r="1.5" fill={KO_STJERNE} />
    <circle cx="100" cy="94" r="1.4" fill={KO_STJERNE} />
  </>
);

/** Ben (fjern = mørkere); hovene er dybblå. */
const koBen = (x: number, y: number, w: number, h: number, fill: string) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx="7" fill={fill} />
    <rect x={x} y="138" width={w} height="10" rx="4" fill="#2a2668" />
  </>
);

/** Koens hoved med halvmåne i panden og sølvklokke (koordinater som Ko i creatures.tsx). */
const koHoved = (
  <>
    <path d="M160 40 C 156 28, 160 22, 166 20 C 164 28, 168 34, 172 38 Z" fill={KO_SOELV} />
    <ellipse cx="156" cy="48" rx="14" ry="7" transform="rotate(-18 156 48)" fill={KO_MOERK} />
    <ellipse cx="178" cy="60" rx="24" ry="22" fill={KO_BLAA} />
    {/* Lille halvmåne i panden. */}
    <path d="M176 38 A 8 8 0 1 0 176 54 A 6.5 6.5 0 0 1 176 38 Z" fill={KO_STJERNE} />
    <ellipse cx="194" cy="76" rx="16" ry="12" fill="#c9a8f0" />
    <ellipse cx="200" cy="74" rx="2.4" ry="3.4" fill="#9a74d4" />
    <ellipse cx="190" cy="76" rx="2.4" ry="3.4" fill="#9a74d4" />
    <path d="M168 34 C 170 24, 176 22, 182 24 C 180 30, 176 34, 172 38 Z" fill={KO_SOELV} />
    {EYE(186, 54, 4)}
    {/* Halsbånd med sølvklokke. */}
    <path d="M154 74 C 158 84, 170 86, 178 80" stroke="#f2c84b" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M159 96 C 159 88, 161 84, 166 84 C 171 84, 173 88, 173 96 Z" fill="#dfe4f2" stroke="#8f98b8" strokeWidth="1.3" />
    <path d="M162 94 C 162 90, 163 87, 165 86.5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <circle cx="166" cy="97" r="2.2" fill="#8f98b8" />
  </>
);

/** Natblå ko med stjernepletter — står den stille, svæver den over månen. */
const moonCow: CreatureSpec = {
  name: "Månekoen",
  rarity: "legendary",
  height: 23.2,
  aspect: 220 / 174,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 -24 220 174",
  art: (
    <>
      {koHale}
      <ellipse cx="80" cy="104" rx="13" ry="9" fill="#c9a8f0" />
      <g className="zoo-leg zoo-leg-a">{koBen(128, 88, 18, 60, KO_MOERK)}</g>
      <g className="zoo-leg zoo-leg-b">{koBen(46, 88, 18, 60, KO_MOERK)}</g>
      <g className="zoo-torso">
        {koKrop}
        <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(100, 66, 4.5)}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">{koBen(146, 90, 19, 58, KO_BLAA)}</g>
      <g className="zoo-leg zoo-leg-a">{koBen(62, 90, 19, 58, KO_BLAA)}</g>
      <g className="zoo-head">
        {koHoved}
        <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(204, 44, 3.4)}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Skyggen bliver på jorden, mens koen svæver. */}
      <ellipse cx="106" cy="147" rx="66" ry="4" fill="#1f1c5a" opacity="0.22" />
      {/* Halvmånen, som koen svæver hen over. */}
      <circle cx="104" cy="128" r="19" fill="#fff6c2" opacity="0.45" />
      <path d="M111.5 115 A 15 15 0 1 0 111.5 141 A 14 14 0 0 1 111.5 115 Z" fill={KO_STJERNE} stroke="#e9b93a" strokeWidth="1.2" />
      <path d="M93 124 q 3 3 6 0" stroke="#b9861e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M95 132 q 3 2 5 0" stroke="#b9861e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <g className="zoo-fx-bob">
        {KO_BOB_BOKS}
        {koHale}
        <ellipse cx="80" cy="104" rx="13" ry="9" fill="#c9a8f0" />
        {koBen(128, 88, 18, 60, KO_MOERK)}
        {koBen(46, 88, 18, 60, KO_MOERK)}
        {koKrop}
        {koBen(146, 90, 19, 58, KO_BLAA)}
        {koBen(62, 90, 19, 58, KO_BLAA)}
        {koHoved}
        {/* Glad mund: "Muuu!" */}
        <ellipse cx="196" cy="82" rx="4" ry="2.6" fill="#6b3f8a" />
      </g>
      {/* Stjernerne omkring hende funkler. */}
      <g className="zoo-fx-sparkle">{STJERNE(34, 2, 6, KO_STJERNE)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.4s")}>{STJERNE(122, -12, 5, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.8s")}>{STJERNE(76, -10, 4, KO_STJERNE)}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{STJERNE(200, 8, 5.5, KO_STJERNE)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(160, -6, 4, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(132, 118, 3.4, "#fff3b0")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.2s")}>{GLIMT(12, 70, 3.4, "#fff")}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Enhjørningen (legendarisk)                                               */
/* ------------------------------------------------------------------------ */

const REGNBUE = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"];
const EH_HVID = "#fdfbff";
const EH_SKYGGE = "#e4def2";
const EH_HOV = "#e8b83e";
const EH_HOV_MOERK = "#c7952a";

type Pkt = [number, number];
const bezier = (a: Pkt, b: Pkt, c: Pkt, d: Pkt) => (t: number): Pkt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};

/** Én manelok, der peger bagud fra roden i (0, 0). */
const LOK = "M5 -6 C -6 -10, -22 -7, -30 4 C -20 1, -8 4, 5 7 Z";

/**
 * Regnbuemanen: en lok pr. farve langs nakkekammen (fra ørerne mod manken).
 * `vift` lader lokkerne vifte i forskudt takt.
 */
const regnbueManke = (kam: (t: number) => Pkt, vift: boolean) =>
  REGNBUE.map((farve, i) => {
    const [x, y] = kam(0.92 - i * 0.16);
    const vinkel = -14 - i * 11;
    const lok = <path d={LOK} fill={farve} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${vinkel})`} />;
    return vift ? (
      <g key={farve} className="zoo-fx-wave" style={{ ...fx(`${(i * 0.15).toFixed(2)}s`, "90% 40%"), animationDuration: "0.7s" }}>
        {lok}
      </g>
    ) : (
      <g key={farve}>{lok}</g>
    );
  });

/** Regnbuehalen: seks tætte striber. */
const regnbueHale = (
  <>
    {REGNBUE.map((farve, i) => (
      <path
        key={farve}
        d={`M${46 - i * 0.6} ${96 + i * 2.6} C ${30 - i * 2} ${98 + i * 3}, ${18 - i * 0.6} ${120 + i * 3}, ${16 + i * 3.4} ${152 - i * 2}`}
        stroke={farve}
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
    ))}
  </>
);

/** Det gyldne snoede horn tegnes i lokale koordinater og drejes på plads. */
const enhjoerningHorn = (
  <g transform="translate(210 24) rotate(27)">
    <path d="M-5 1 L 5 1 L 0 -34 Z" fill="#f7c948" stroke="#d99a1c" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M-4 -5 L 4 -9 M-3 -13 L 3 -17 M-2 -21 L 2 -24 M-1 -28 L 1 -30" stroke="#c98a12" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M-2.4 -4 L -0.6 -24" stroke="#fff3b8" strokeWidth="1.4" strokeLinecap="round" />
  </g>
);

/** Enhjørningens hoved (koordinater som Hest i creatures.tsx). */
const enhjoerningHoved = (
  <>
    <path d="M192 26 L 194 6 L 204 24 Z" fill={EH_HVID} />
    <path d="M195 22 L 196 11 L 201 22 Z" fill="#f7c6d6" />
    {enhjoerningHorn}
    <path d="M186 24 C 200 16, 216 22, 224 36 C 232 48, 246 64, 244 74 C 240 82, 228 80, 220 74 C 208 68, 198 60, 190 50 C 184 42, 182 32, 186 24 Z" fill={EH_HVID} />
    <ellipse cx="238" cy="73" rx="8" ry="6.5" fill="#f7d0dc" />
    <ellipse cx="240" cy="72" rx="1.8" ry="2.4" fill="#c4859b" />
    <path d="M226 78 q 6 3 11 0" stroke="#c4859b" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    {/* Pandelokken i regnbuefarver. */}
    <path d="M186 22 C 194 16, 204 22, 203 34 C 196 32, 190 28, 186 22 Z" fill="#f472b6" />
    <path d="M188 25 C 194 24, 198 30, 197 37 C 192 34, 189 30, 188 25 Z" fill="#facc15" />
    <path d="M186 28 C 189 30, 191 34, 190 40 C 187 37, 185 33, 186 28 Z" fill="#38bdf8" />
    {EYE(210, 41, 4)}
    <path d="M212 36.6 l 2.4 -3.4 M214.4 38.6 l 3.6 -2" stroke="#1d1a17" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="218" cy="54" r="4.5" fill="#f9a8c4" opacity="0.55" />
  </>
);

/** Nakkekammen, når den går, og når hovedet er løftet. */
const kamGaar = bezier([138, 92], [144, 58], [162, 36], [190, 26]);
const kamStolt = bezier([136, 90], [140, 52], [156, 28], [180, 14]);

/** Hvid enhjørning med regnbuemanke — står den stille, løfter den stolt hovedet og et forben. */
const unicorn: CreatureSpec = {
  name: "Enhjørningen",
  rarity: "legendary",
  height: 30.5,
  aspect: 250 / 246,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 -36 250 246",
  art: (
    <>
      {regnbueHale}
      <g className="zoo-leg zoo-leg-a">
        <rect x="142" y="112" width="15" height="98" rx="7" fill={EH_SKYGGE} />
        <rect x="142" y="198" width="15" height="12" rx="4" fill={EH_HOV_MOERK} />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="48" y="112" width="15" height="98" rx="7" fill={EH_SKYGGE} />
        <rect x="48" y="198" width="15" height="12" rx="4" fill={EH_HOV_MOERK} />
      </g>
      <g className="zoo-torso">
        <ellipse cx="108" cy="104" rx="72" ry="34" fill={EH_HVID} />
        <path d="M138 84 C 148 54, 166 36, 190 28 L 218 50 C 200 62, 192 84, 184 114 Z" fill={EH_HVID} />
        <ellipse cx="108" cy="126" rx="48" ry="9" fill="#ece6f8" />
        {regnbueManke(kamGaar, false)}
        <g className="zoo-fx-sparkle">{GLIMT(98, 98, 5)}</g>
        <g className="zoo-fx-sparkle" style={fx("0.8s")}>{GLIMT(60, 118, 4, "#ffd1f0")}</g>
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="158" y="114" width="16" height="96" rx="7" fill={EH_HVID} />
        <rect x="158" y="198" width="16" height="12" rx="4" fill={EH_HOV} />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="114" width="16" height="96" rx="7" fill={EH_HVID} />
        <rect x="62" y="198" width="16" height="12" rx="4" fill={EH_HOV} />
      </g>
      <g className="zoo-head">
        {enhjoerningHoved}
        <g className="zoo-fx-sparkle" style={fx("0.4s")}>{GLIMT(225, -8, 4, "#fff6c2")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Halen vifter. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.2s", "100% 0%"), animationDuration: "1.2s" }}>{regnbueHale}</g>
      <rect x="142" y="112" width="15" height="98" rx="7" fill={EH_SKYGGE} />
      <rect x="142" y="198" width="15" height="12" rx="4" fill={EH_HOV_MOERK} />
      <rect x="48" y="112" width="15" height="98" rx="7" fill={EH_SKYGGE} />
      <rect x="48" y="198" width="15" height="12" rx="4" fill={EH_HOV_MOERK} />
      <ellipse cx="108" cy="104" rx="72" ry="34" fill={EH_HVID} />
      {/* Nakken rejst. */}
      <path d="M136 86 C 144 50, 158 28, 178 16 L 210 33 C 194 52, 190 84, 184 114 Z" fill={EH_HVID} />
      <ellipse cx="108" cy="126" rx="48" ry="9" fill="#ece6f8" />
      {regnbueManke(kamStolt, true)}
      {/* Nære forben løftet stolt; de andre tre står, hvor de står, når den går. */}
      <path d="M166 118 L 188 146 L 182 168" stroke={EH_HVID} strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M182.6 166 L 181 174" stroke={EH_HOV} strokeWidth="16" strokeLinecap="round" />
      <rect x="62" y="114" width="16" height="96" rx="7" fill={EH_HVID} />
      <rect x="62" y="198" width="16" height="12" rx="4" fill={EH_HOV} />
      {/* Hovedet løftet højt. */}
      <g transform="translate(-8 -12) rotate(-10 190 50)">{enhjoerningHoved}</g>
      {/* Hornspidsen funkler. */}
      <g className="zoo-fx-sparkle">{GLIMT(209, -25, 6, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(222, -14, 3.4, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.35s")}>{STJERNE(196, -20, 3, "#ffe98a")}</g>
      {/* Stjerner og hjerter stiger op. */}
      <g className="zoo-fx-rise">{HJERTE(132, 30, 6, "#f472b6")}</g>
      <g className="zoo-fx-rise" style={fx("0.8s")}>{STJERNE(110, 44, 5, "#facc15")}</g>
      <g className="zoo-fx-rise" style={fx("1.6s")}>{HJERTE(150, 6, 5, "#a78bfa")}</g>
      <g className="zoo-fx-rise" style={fx("1.2s")}>{STJERNE(236, 6, 4.5, "#38bdf8")}</g>
      <g className="zoo-fx-rise" style={fx("2s")}>{HJERTE(84, 52, 5, "#fb7185")}</g>
      <g className="zoo-fx-sparkle" style={fx("1s")}>{GLIMT(100, 96, 5)}</g>
    </>
  ),
};

export const specialsThree: Record<string, CreatureSpec> = {
  goldenHen,
  moonCow,
  unicorn,
};
