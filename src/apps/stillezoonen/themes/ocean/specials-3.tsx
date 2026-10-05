import { EYE } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Legendariske akvariedyr med særlig opførsel. `art` er figuren, når den
 * svømmer; `special` (samme viewBox) vises, mens den holder pause.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/* ------------------------------------------------------------------------ */
/* Ønskefisken (legendarisk)                                                */
/* ------------------------------------------------------------------------ */

const OF_GULD = "#fcc934";
const OF_MOERK = "#eb9a12";
const OF_LYS = "#ffe892";
const OF_GLANS = "#fffbe6";
const OF_KRONE = "#ffd84a";

/** Slørhalen: to lange, flydende flige med lyse stråler. */
const oenskeHale = (
  <>
    <path d="M56 46 C 42 30, 22 6, 4 4 C 12 20, 16 34, 26 46 C 16 56, 8 72, 4 88 C 24 84, 44 64, 56 54 Z" fill="#f6a91c" />
    <path d="M54 47 C 42 36, 28 20, 16 16 C 22 28, 28 38, 34 46 C 28 54, 20 66, 16 76 C 30 70, 44 58, 54 52 Z" fill={OF_LYS} />
    <path d="M50 46 C 38 34, 24 18, 10 9 M50 52 C 38 62, 24 74, 10 82 M48 49 L 26 46" stroke={OF_GLANS} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
  </>
);

/** Krop, finner og skæl (hovedet tegnes for sig). */
const oenskeKrop = (
  <>
    {/* Lang, flagrende rygfinne og bugfinner. */}
    <path d="M60 34 C 58 16, 70 2, 88 4 C 82 10, 90 18, 104 27 Z" fill={OF_MOERK} />
    <path d="M66 30 C 66 18, 74 10, 84 9" stroke={OF_LYS} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M68 74 C 60 86, 66 96, 78 96 C 74 90, 78 82, 84 77 Z" fill={OF_MOERK} />
    <path d="M96 76 C 96 86, 102 90, 108 88 C 106 84, 106 78, 106 72 Z" fill={OF_MOERK} />
    <ellipse cx="88" cy="50" rx="38" ry="28" fill={OF_GULD} />
    <path d="M51.6 58 A38 28 0 0 0 124.4 58 C 104 68, 72 68, 51.6 58 Z" fill={OF_LYS} opacity="0.85" />
    <path d="M62 36 C 70 28, 82 25, 94 26" stroke={OF_GLANS} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Skæl. */}
    <path d="M66 46 q 5 5 10 0 M78 40 q 5 5 10 0 M80 52 q 5 5 10 0 M64 58 q 5 5 10 0" stroke={OF_MOERK} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M100 34 C 94 42, 94 56, 100 64" stroke={OF_MOERK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </>
);

/** Lille guldkrone på issen, let på skrå. */
const oenskeKrone = (
  <g transform="translate(110 24) rotate(16)">
    <path d="M-9 2 L -10.5 -10 L -4.5 -4 L 0 -13 L 4.5 -4 L 10.5 -10 L 9 2 Z" fill={OF_KRONE} stroke="#c47f0a" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="0" cy="-2" r="1.9" fill="#e8453c" />
    <circle cx="-5.6" cy="-1" r="1.2" fill="#3b82f6" />
    <circle cx="5.6" cy="-1" r="1.2" fill="#3b82f6" />
  </g>
);

/** Brystfinnen (tegnes oven på kroppen). */
const oenskeFinne = <path d="M90 54 C 100 56, 106 64, 102 72 C 94 70, 89 63, 90 54 Z" fill={OF_MOERK} />;

/** Lysbuen af ønsker, der strømmer op fra kronen. */
const ONSKER = [
  { x: 121, y: 6, form: "stjerne", r: 4.4, farve: "#ffe066" },
  { x: 120, y: -10, form: "hjerte", r: 4.4, farve: "#f472b6" },
  { x: 110, y: -23, form: "stjerne", r: 5, farve: "#ffffff" },
  { x: 93, y: -30, form: "hjerte", r: 5, farve: "#fb7185" },
  { x: 75, y: -31, form: "stjerne", r: 5, farve: "#a5f3fc" },
  { x: 57, y: -27, form: "hjerte", r: 4.6, farve: "#f9a8d4" },
  { x: 42, y: -19, form: "stjerne", r: 4.4, farve: "#ffe066" },
  { x: 30, y: -9, form: "hjerte", r: 4, farve: "#c4b5fd" },
] as const;

/** Den gyldne fisk fra eventyret — holder den pause, opfylder den et ønske. */
const wishFish: CreatureSpec = {
  name: "Ønskefisken",
  rarity: "legendary",
  height: 19.5,
  aspect: 150 / 146,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 -56 150 146",
  art: (
    <>
      <g className="zoo-tail">
        {oenskeHale}
        <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(22, 30, 3.4)}</g>
      </g>
      {oenskeKrop}
      {oenskeFinne}
      <g className="zoo-fx-sparkle">{GLIMT(76, 40, 4.6)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(112, 64, 3.2)}</g>
      <g className="zoo-head">
        {EYE(111, 44, 4.4)}
        <path d="M118 57 q 4 3 8 0" stroke="#b45309" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="106" cy="56" r="4" fill="#ff9a8a" opacity="0.5" />
        {oenskeKrone}
        <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(121, 7, 3, "#fff6c2")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {/* Halen vifter blødt, mens fisken står stille i vandet. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.2s", "100% 50%"), animationDuration: "1.6s" }}>{oenskeHale}</g>
      {oenskeKrop}
      {/* Brystfinnen vifter som en tryllestav. */}
      <g className="zoo-fx-wave" style={fx("0s", "0% 0%")}>{oenskeFinne}</g>
      {/* Lukkede, glade øjne og et stort smil. */}
      <path d="M106 45 q 5 -6 10 0" stroke="#5a3410" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M115 55 q 6 7 12 0 Z" fill="#b4532a" stroke="#b4532a" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="106" cy="56" r="4.4" fill="#ff8a9a" opacity="0.6" />
      {oenskeKrone}
      {/* Den gyldne lysbue, ønskerne strømmer op ad. */}
      <path d="M116 18 C 126 -2, 114 -26, 90 -30 C 66 -34, 42 -24, 26 -4" stroke="#fff3b0" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.35" />
      {ONSKER.map((o, i) => (
        <g key={i} className="zoo-fx-rise" style={fx(`${(i * 0.3).toFixed(1)}s`)}>
          {o.form === "stjerne" ? STJERNE(o.x, o.y, o.r, o.farve) : HJERTE(o.x, o.y, o.r, o.farve)}
        </g>
      ))}
      {/* Kronen funkler. */}
      <g className="zoo-fx-sparkle">{GLIMT(110, 7, 4, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(98, 14, 3, "#fff6c2")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.95s")}>{GLIMT(124, 18, 2.8, "#fff")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.7s")}>{GLIMT(78, 42, 4.4)}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Lille Kraken (legendarisk)                                               */
/* ------------------------------------------------------------------------ */

const KR_KAPPE = "#4a3aa6";
const KR_LYS = "#6a58cf";
const KR_BAG = "#2f2680";
const KR_ARM = "#5644bd";
const KR_SUG = "#b9a9f5";
const KR_TURKIS = "#5eead4";

/** Bageste arme (mørkere), hver med krøllet spids. */
const KR_BAGARME = [
  "M50 100 C 30 108, 32 128, 16 136 C 8 140, 8 150, 16 151 C 21 151, 22 146, 18 144",
  "M84 106 C 84 126, 92 142, 86 158 C 84 164, 90 168, 94 164",
  "M118 100 C 138 108, 136 128, 152 136 C 160 140, 160 150, 152 151 C 147 151, 146 146, 150 144",
];

/** Forreste arme fra venstre mod højre. */
const KR_ARME = [
  "M56 104 C 46 124, 58 142, 42 158 C 36 164, 42 172, 48 168 C 52 165, 49 160, 46 162",
  "M74 108 C 70 128, 80 146, 68 162 C 64 168, 70 174, 75 170",
  "M96 108 C 100 128, 90 146, 102 162 C 106 168, 100 174, 95 170",
  "M114 104 C 124 124, 112 142, 128 158 C 134 164, 128 172, 122 168 C 118 165, 121 160, 124 162",
];

/** Sugekopper på de forreste arme (samme rækkefølge som KR_ARME). */
const KR_SUGEKOPPER: [number, number][][] = [
  [[51, 124], [50, 140]],
  [[73, 128], [76, 146]],
  [[97, 128], [94, 146]],
  [[119, 124], [120, 142]],
];

const kArm = (d: string, farve: string, bredde: number) => (
  <path d={d} stroke={farve} strokeWidth={bredde} fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

/** Lysende turkis prik med glorie. */
const lysPrik = (x: number, y: number, r: number) => (
  <>
    <circle cx={x} cy={y} r={r * 2.1} fill={KR_TURKIS} opacity="0.28" />
    <circle cx={x} cy={y} r={r} fill={KR_TURKIS} />
    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.4} fill="#f0fdfa" />
  </>
);

/** Kappen (hovedet) med finner, prikker og øjne; `glad` giver åben, leende mund. */
const krakenHoved = (glad: boolean) => (
  <>
    <path d="M60 44 C 42 28, 30 40, 42 58 Z" fill={KR_BAG} />
    <path d="M108 44 C 126 28, 138 40, 126 58 Z" fill={KR_BAG} />
    <path d="M40 98 C 32 58, 50 20, 84 18 C 118 20, 136 58, 128 98 C 118 112, 50 112, 40 98 Z" fill={KR_KAPPE} />
    <path d="M48 80 C 46 52, 60 32, 80 27 C 64 40, 58 56, 60 82 Z" fill={KR_LYS} opacity="0.75" />
    {lysPrik(66, 40, 2.8)}
    {lysPrik(98, 31, 2.4)}
    {lysPrik(55, 66, 2.4)}
    {lysPrik(78, 49, 2)}
    {lysPrik(66, 92, 2.2)}
    {lysPrik(122, 88, 1.8)}
    <circle cx="90" cy="68" r="12.5" fill="#fff" />
    <circle cx="116" cy="66" r="11.5" fill="#fff" />
    {EYE(92, 69, 8)}
    {EYE(118, 67, 7.4)}
    <circle cx="88.5" cy="73" r="1.6" fill="#fff" />
    <circle cx="114.5" cy="71" r="1.5" fill="#fff" />
    <circle cx="76" cy="86" r="5" fill="#ff8ab0" opacity="0.45" />
    <circle cx="127" cy="83" r="4" fill="#ff8ab0" opacity="0.45" />
    {glad ? (
      <>
        <path d="M95 89 q 8 9 16 0 Z" fill="#1e1650" stroke="#1e1650" strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse cx="103" cy="93.5" rx="3.6" ry="1.8" fill="#f472b6" />
      </>
    ) : (
      <path d="M96 90 q 7 6 14 0" stroke="#1e1650" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    )}
  </>
);

/** Prikker, der funkler i forskudt takt. */
const krakenGlimt = (
  <>
    <g className="zoo-fx-sparkle">{GLIMT(66, 40, 5, "#ccfbf1")}</g>
    <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(98, 31, 4.4, "#ccfbf1")}</g>
    <g className="zoo-fx-sparkle" style={fx("0.95s")}>{GLIMT(55, 66, 4.4, "#ccfbf1")}</g>
  </>
);

/** Det lille legetøjs-sejlskib; bunden af skroget hviler i (156, 42). */
const sejlskib = (
  <>
    <path d="M156 34 V 8" stroke="#7c4a1e" strokeWidth="2" strokeLinecap="round" />
    <path d="M156 8 l 7 2.4 l -7 2.4 Z" fill="#f59e0b" />
    <path d="M157.5 11 L 157.5 31 L 170 31 Z" fill="#fff" stroke="#cbd5e1" strokeWidth="0.8" strokeLinejoin="round" />
    <path d="M154.5 15 L 154.5 31 L 145 31 Z" fill="#fde68a" stroke="#e5c55a" strokeWidth="0.8" strokeLinejoin="round" />
    <path d="M140 33 L 172 33 L 166 42 L 146 42 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M142.5 36.5 H 169.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </>
);

/** Sød baby-kraken med lysende prikker — holder den pause, leger den med et sejlskib. */
const babyKraken: CreatureSpec = {
  name: "Lille Kraken",
  rarity: "legendary",
  height: 22,
  aspect: 192 / 180,
  gait: "float",
  pace: 0.7,
  viewBox: "-12 0 192 180",
  art: (
    <>
      {KR_BAGARME.map((d, i) => <g key={i}>{kArm(d, KR_BAG, 10)}</g>)}
      <g className="zoo-torso">
        {KR_ARME.map((d, i) => <g key={i}>{kArm(d, KR_ARM, 11)}</g>)}
        <g fill={KR_SUG}>
          {KR_SUGEKOPPER.flat().map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.1" />)}
        </g>
        {krakenHoved(false)}
        {krakenGlimt}
      </g>
    </>
  ),
  special: (
    <>
      {/* De bageste arme vinker i forskudt takt. */}
      {KR_BAGARME.map((d, i) => (
        <g key={i} className="zoo-fx-wave" style={{ ...fx(`${(i * 0.3).toFixed(1)}s`, "50% 0%"), animationDuration: "1.3s" }}>
          {kArm(d, KR_BAG, 10)}
        </g>
      ))}
      {/* Venstre forarm løftet og vinker til klassen. */}
      <g className="zoo-fx-wave" style={{ ...fx("0.4s", "100% 100%"), animationDuration: "0.7s" }}>
        {kArm("M54 100 C 36 98, 26 84, 24 68 C 23 60, 18 56, 14 60", KR_ARM, 11)}
        <circle cx="31" cy="88" r="2.1" fill={KR_SUG} />
      </g>
      {/* De to midterste arme svajer med. */}
      {KR_ARME.slice(1, 3).map((d, i) => (
        <g key={i} className="zoo-fx-wave" style={{ ...fx(`${(0.2 + i * 0.45).toFixed(2)}s`, "50% 0%"), animationDuration: "1.1s" }}>
          {kArm(d, KR_ARM, 11)}
          <g fill={KR_SUG}>
            {KR_SUGEKOPPER[i + 1].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.1" />)}
          </g>
        </g>
      ))}
      {/* Højre forarm strakt op med sejlskibet på spidsen. */}
      {kArm("M116 98 C 138 100, 150 86, 150 66 C 150 56, 152 49, 156 45", KR_ARM, 11)}
      <circle cx="141" cy="92" r="2.1" fill={KR_SUG} />
      <circle cx="150" cy="72" r="2.1" fill={KR_SUG} />
      {krakenHoved(true)}
      {krakenGlimt}
      {/* Skibet vipper frem og tilbage på armspidsen. */}
      <g className="zoo-fx-wave" style={{ ...fx("0s", "50% 100%"), animationDuration: "1.2s" }}>{sejlskib}</g>
      {/* Bobler stiger op. */}
      <g fill="none" stroke="#e0f7ff" strokeWidth="1.8">
        <g className="zoo-fx-rise"><circle cx="40" cy="28" r="3.6" /></g>
        <g className="zoo-fx-rise" style={fx("0.8s")}><circle cx="28" cy="16" r="2.6" /></g>
        <g className="zoo-fx-rise" style={fx("1.6s")}><circle cx="132" cy="22" r="3" /></g>
        <g className="zoo-fx-rise" style={fx("1.2s")}><circle cx="122" cy="10" r="2.2" /></g>
        <g className="zoo-fx-rise" style={fx("2s")}><circle cx="52" cy="12" r="2.2" /></g>
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Lygtefisken (legendarisk)                                                */
/* ------------------------------------------------------------------------ */

const LF_KROP = "#1d5966";
const LF_MOERK = "#143f4a";
const LF_LYS = "#2f8190";
const LF_BUG = "#4f9fa3";
const LF_GUL = "#fde047";
const LF_GLOED = "#fef08a";

const lygteHale = (
  <>
    <path d="M40 64 C 28 54, 16 48, 4 50 C 10 60, 10 74, 4 84 C 16 84, 28 78, 40 72 Z" fill={LF_MOERK} />
    <path d="M36 66 L 10 56 M36 70 L 10 78" stroke={LF_LYS} strokeWidth="1.6" strokeLinecap="round" />
  </>
);

/** Krop, ryg- og bugfinne, prikker og øje (mund, lygte og brystfinne tegnes for sig). */
const lygteKrop = (
  <>
    <path d="M54 38 C 54 24, 68 20, 76 30 Z" fill={LF_MOERK} />
    <path d="M60 94 C 60 104, 70 106, 76 99 Z" fill={LF_MOERK} />
    <path d="M36 66 C 36 40, 60 28, 86 30 C 112 32, 126 50, 124 70 C 122 92, 100 102, 76 100 C 54 98, 36 88, 36 66 Z" fill={LF_KROP} />
    <path d="M42 80 C 56 96, 94 102, 114 88 C 104 98, 90 102, 76 100 C 58 98, 46 90, 42 80 Z" fill={LF_BUG} opacity="0.8" />
    <path d="M48 52 C 56 40, 70 34, 84 34" stroke={LF_LYS} strokeWidth="4" fill="none" strokeLinecap="round" />
    <g fill="#7ee0d0">
      <circle cx="58" cy="60" r="1.8" /><circle cx="68" cy="50" r="1.5" /><circle cx="52" cy="72" r="1.5" /><circle cx="72" cy="64" r="1.3" />
    </g>
    <circle cx="100" cy="52" r="8.6" fill="#fff" />
  </>
);

/** Det søde smil med to små runde tandstumper. */
const lygteMund = (
  <>
    <path d="M90 72 C 100 88, 118 86, 125 66 C 116 72, 102 75, 90 72 Z" fill="#4a1a2c" stroke={LF_LYS} strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="108" cy="80" rx="6" ry="2.6" transform="rotate(-14 108 80)" fill="#f48fb1" />
    <path d="M99.5 80.4 q 2.2 -4.6 4.4 -0.6 Z M113.5 79 q 2.2 -4.6 4.4 -0.6 Z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
  </>
);

const lygteBrystfinne = <path d="M66 72 C 76 70, 84 78, 80 88 C 72 86, 66 80, 66 72 Z" fill={LF_LYS} />;

/** Sød havtaske med lysende lygte — holder den pause, læser den i lygtens skær. */
const lanternFish: CreatureSpec = {
  name: "Lygtefisken",
  rarity: "legendary",
  height: 12,
  aspect: 160 / 110,
  gait: "swim",
  pace: 0.75,
  viewBox: "0 0 160 110",
  art: (
    <>
      <g className="zoo-tail">{lygteHale}</g>
      {lygteKrop}
      {lygteBrystfinne}
      <g className="zoo-head">
        {EYE(101, 52, 5.4)}
        <circle cx="90" cy="64" r="4" fill="#ff8aa0" opacity="0.45" />
        {lygteMund}
        {/* Lygten på sin stilk fra panden. */}
        <path d="M90 32 C 86 16, 96 4, 112 6 C 122 8, 128 14, 128 21" stroke={LF_MOERK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <circle cx="128" cy="27" r="13" fill={LF_GLOED} opacity="0.3" />
        <circle cx="128" cy="27" r="6.4" fill={LF_GUL} />
        <circle cx="126" cy="25" r="2.2" fill="#fff" />
        <g className="zoo-fx-sparkle" style={{ animationDuration: "2s" }}><circle cx="128" cy="27" r="10" fill={LF_GLOED} opacity="0.55" /></g>
        <g className="zoo-fx-sparkle" style={fx("0.6s")}>{GLIMT(139, 15, 3.6, "#fffbe0")}</g>
        <g className="zoo-fx-sparkle" style={fx("1.1s")}>{GLIMT(117, 37, 2.6, "#fffbe0")}</g>
      </g>
    </>
  ),
  special: (
    <>
      {lygteHale}
      {lygteKrop}
      {/* Øjet kigger ned i bogen. */}
      {EYE(103, 55, 5.4)}
      <circle cx="90" cy="64" r="4" fill="#ff8aa0" opacity="0.55" />
      <path d="M94 74 C 102 84, 114 82, 120 72" stroke="#4a1a2c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* Lygten bøjer sig frem over bogen som en læselampe. */}
      <path d="M90 32 C 88 12, 112 2, 128 8 C 136 11, 140 16, 140 22" stroke={LF_MOERK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {/* Lyskeglen ned på bogen. */}
      <path d="M135 31 L 145 31 L 158 80 L 118 80 Z" fill={LF_GLOED} opacity="0.28" />
      {/* Den åbne bog. */}
      <path d="M137 95 L 118 90 L 118 64 L 137 69 L 156 64 L 156 90 Z" fill="#e05a47" />
      <path d="M137 71 L 120 67 L 120 88 L 137 92 Z" fill="#fffaf0" />
      <path d="M137 71 L 154 67 L 154 88 L 137 92 Z" fill="#fffaf0" />
      <path d="M123 72 l 11 2.6 M123 77 l 11 2.6 M123 82 l 8 1.9 M140 74.6 l 11 -2.6 M140 79.6 l 11 -2.6 M140 84.6 l 8 -1.9" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
      {/* Siden, der vendes. */}
      <g className="zoo-fx-flip" style={{ animationDuration: "3.6s" }}>
        <path d="M137 71 L 154 67 L 154 88 L 137 92 Z" fill="#f3ead6" stroke="#e2d6bd" strokeWidth="0.8" />
        <path d="M140 74.6 l 11 -2.6 M140 79.6 l 11 -2.6" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <path d="M137 70 v 24" stroke="#b8402f" strokeWidth="1.5" />
      {/* Brystfinnen holder bogen. */}
      <path d="M66 74 C 82 74, 104 84, 122 88 C 118 94, 100 96, 84 92 C 74 90, 66 84, 66 74 Z" fill={LF_LYS} />
      {/* Lygten lyser stærkt og pulserer. */}
      <circle cx="140" cy="28" r="11" fill={LF_GLOED} opacity="0.5" />
      <g className="zoo-fx-sparkle" style={{ animationDuration: "2.2s" }}><circle cx="140" cy="28" r="19" fill={LF_GLOED} opacity="0.45" /></g>
      <circle cx="140" cy="28" r="7.2" fill={LF_GUL} />
      <circle cx="138" cy="26" r="2.4" fill="#fff" />
      {/* Lysende plankton danser i skæret. */}
      <g className="zoo-fx-sparkle" style={fx("0.3s")}>{GLIMT(122, 16, 3, "#fffbe0")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(154, 46, 2.6, "#a7f3d0")}</g>
      <g className="zoo-fx-rise" style={fx("0.5s")}><circle cx="116" cy="50" r="1.8" fill="#a7f3d0" /></g>
      <g className="zoo-fx-rise" style={fx("1.4s")}><circle cx="152" cy="56" r="1.6" fill={LF_GLOED} /></g>
      <g className="zoo-fx-rise" style={fx("2s")}><circle cx="126" cy="44" r="1.4" fill="#a7f3d0" /></g>
    </>
  ),
};

export const specialsThree: Record<string, CreatureSpec> = {
  wishFish,
  babyKraken,
  lanternFish,
};
