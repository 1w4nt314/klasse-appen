import type { CSSProperties } from "react";
import { EYE, Klip } from "../shared";
import { fx, GLIMT, HJERTE, STJERNE } from "../fx";
import type { CreatureSpec } from "../types";

/**
 * Sjældne havdyr med særlig opførsel (anden omgang). `art` er figuren, når den
 * svømmer/går; `special` (samme viewBox) vises, mens den holder pause.
 * Animationer: zoo-fx-*-klasserne i zoo.css.
 */

/** Afrunder til én decimal (beregnede koordinater). */
const rund = (v: number) => Math.round(v * 10) / 10;

/** Usynlig lodret boks: gør en fx-gruppe højere, så procent-animationer (bob/rise) flytter længere. */
const boks = (x: number, y: number, h: number) => <rect x={x} y={y} width="1" height={h} fill="none" />;

/** fx() med egen varighed. */
const fxv = (d: string, origin: string | undefined, varighed: string) =>
  ({ ...fx(d, origin), animationDuration: varighed }) as CSSProperties;

/* ------------------------------------------------------------------------ */
/* Multitasker-blæksprutten                                                 */
/* ------------------------------------------------------------------------ */

const BLAEK_BAG = "#7a49b4";
const BLAEK_FOR = "#9366cc";
const BLAEK_KROP = "#a678dc";
const BLAEK_LYS = "#c4a0ec";
const SUGEKOP = "#d7bff0";
const KASKET = "#ef5a3c";
const KASKET_MOERK = "#c8432a";

/** Den lille kasket med skyggen fremad (koordinater som Blæksprutte i creatures.tsx). */
const kasket = (
  <>
    <path d="M60 16 C 58 -10, 108 -14, 112 12 C 100 2, 74 4, 60 16 Z" fill={KASKET} />
    <path d="M68 8 C 72 -2, 82 -5, 92 -5" stroke="#ff8f72" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M85 -5 C 87 0, 87 4, 86 7" stroke={KASKET_MOERK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M104 10 C 116 2, 132 4, 140 12 C 128 17, 114 17, 104 14 Z" fill={KASKET_MOERK} />
    <circle cx="84" cy="-6" r="3" fill="#fff" />
  </>
);

/** Kappen (hovedet) med pletter. */
const blaekKappe = (
  <>
    <ellipse cx="82" cy="44" rx="44" ry="40" fill={BLAEK_KROP} transform="rotate(8 82 44)" />
    <path d="M46 50 C 46 28, 58 14, 76 12 C 62 22, 56 36, 58 54 Z" fill={BLAEK_LYS} opacity="0.7" />
    <circle cx="60" cy="24" r="3.4" fill={BLAEK_LYS} />
    <circle cx="52" cy="46" r="3" fill="#8a58c4" />
  </>
);

/** Store øjne og kinder. */
const blaekOejne = (
  <>
    <circle cx="86" cy="52" r="9.5" fill="#fff" />
    <circle cx="112" cy="52" r="9.5" fill="#fff" />
    {EYE(89, 52, 6)}
    {EYE(115, 52, 6)}
    <circle cx="76" cy="66" r="4.4" fill="#ff8aa0" opacity="0.5" />
    <circle cx="116" cy="66" r="3.6" fill="#ff8aa0" opacity="0.5" />
  </>
);

const arm = (d: string, farve: string, bredde = 12) => (
  <path d={d} stroke={farve} strokeWidth={bredde} fill="none" strokeLinecap="round" />
);

/** Blæksprutte med kasket — holder den pause, laver hver arm noget forskelligt. */
const multitaskOctopus: CreatureSpec = {
  name: "Multitasker-blæksprutten",
  rarity: "rare",
  height: 22,
  aspect: 214 / 160,
  gait: "float",
  pace: 0.8,
  viewBox: "0 0 214 160",
  art: (
    <g transform="translate(44 30)">
      <g fill="none" strokeLinecap="round">
        <path d="M52 80 C 34 92, 50 108, 30 114 C 22 116, 16 112, 14 106" stroke={BLAEK_BAG} strokeWidth="11" />
        <path d="M70 84 C 56 100, 72 116, 54 124" stroke={BLAEK_BAG} strokeWidth="11" />
        <path d="M96 84 C 108 100, 92 114, 106 124" stroke={BLAEK_BAG} strokeWidth="11" />
        <path d="M112 78 C 128 90, 116 106, 134 112 C 140 114, 144 110, 144 104" stroke={BLAEK_BAG} strokeWidth="11" />
      </g>
      <g className="zoo-torso">
        <g fill="none" strokeLinecap="round">
          <path d="M44 76 C 22 80, 26 102, 8 100" stroke={BLAEK_FOR} strokeWidth="12" />
          <path d="M62 82 C 48 96, 56 114, 40 122" stroke={BLAEK_FOR} strokeWidth="12" />
          <path d="M84 84 C 82 100, 76 112, 84 124" stroke={BLAEK_FOR} strokeWidth="12" />
          <path d="M106 82 C 118 96, 108 112, 122 122" stroke={BLAEK_FOR} strokeWidth="12" />
        </g>
        <g fill={SUGEKOP}>
          <circle cx="12" cy="99" r="2.2" /><circle cx="25" cy="94" r="2.2" />
          <circle cx="42" cy="119" r="2.2" /><circle cx="50" cy="104" r="2.2" />
          <circle cx="83" cy="108" r="2.2" /><circle cx="86" cy="120" r="2.2" />
          <circle cx="118" cy="118" r="2.2" /><circle cx="112" cy="102" r="2.2" />
        </g>
        {blaekKappe}
        <circle cx="106" cy="20" r="3" fill="#8a58c4" />
      </g>
      <g className="zoo-head">
        {blaekOejne}
        <path d="M94 70 q 8 6 16 0" stroke="#5b3390" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {kasket}
      </g>
    </g>
  ),
  special: (
    <g transform="translate(44 30)">
      {/* Staffeli med lærred til venstre. */}
      <g stroke="#b07a3a" strokeWidth="3" strokeLinecap="round">
        <path d="M-22 48 V 128" stroke="#8a5e2c" />
        <path d="M-30 80 L -36 128 M-14 80 L -8 128" />
      </g>
      <rect x="-36" y="52" width="28" height="32" rx="1.5" fill="#fffaf0" stroke="#b07a3a" strokeWidth="2.4" />
      <g fill="none" strokeLinecap="round" strokeWidth="3">
        <path d="M-31 76 C -30 64, -14 64, -13 76" stroke="#e8463c" />
        <path d="M-27 76 C -26 69, -18 69, -17 76" stroke="#f6c636" />
      </g>
      <circle cx="-28" cy="60" r="3.2" fill="#3b8fe0" />
      <path d="M-38 86 H -6" stroke="#b07a3a" strokeWidth="3.4" strokeLinecap="round" />
      {/* Bagerste arme: én vinker, én taler i telefon, to hviler. */}
      {arm("M70 84 C 56 100, 72 116, 54 124", BLAEK_BAG, 11)}
      {arm("M96 84 C 108 100, 92 114, 106 124", BLAEK_BAG, 11)}
      <g className="zoo-fx-wave" style={fx("0.1s", "87% 90%")}>
        {arm("M54 42 C 36 40, 24 28, 22 12 C 21 4, 26 -2, 32 0", BLAEK_BAG, 11)}
        <g fill={SUGEKOP}>
          <circle cx="28" cy="26" r="2" /><circle cx="25" cy="14" r="2" />
        </g>
      </g>
      <g className="zoo-fx-nod" style={fxv("0.5s", "14% 79%", "1.4s")}>
        {arm("M110 72 C 130 82, 142 72, 136 58", BLAEK_BAG, 11)}
        <g transform="rotate(-12 133 44)">
          <rect x="127" y="32" width="12" height="24" rx="3" fill="#2d2a3e" />
          <rect x="129" y="35" width="8" height="16" rx="1.5" fill="#7fd3f7" />
          <path d="M131 33.5 h 4" stroke="#7a7690" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {arm("M128 54 q 6 6 12 0", BLAEK_BAG, 7)}
      </g>
      {/* Forreste arme: maler, læser, drikker kaffe, hviler. */}
      {arm("M88 84 C 90 100, 84 112, 92 124", BLAEK_FOR)}
      <g className="zoo-fx-wave" style={fxv("0.6s", "91% 62%", "0.7s")}>
        {arm("M48 72 C 30 76, 22 62, 8 68", BLAEK_FOR)}
        <path d="M12 64 L -6 74" stroke="#c98a3c" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-4 72.9 L -8 75.1" stroke="#b9bec6" strokeWidth="4" />
        <ellipse cx="-11" cy="77" rx="4.5" ry="3" transform="rotate(-30 -11 77)" fill="#3b8fe0" />
        {arm("M7 61 q -5 6 1 10", BLAEK_FOR, 7)}
      </g>
      <g className="zoo-fx-nod" style={fxv("0.9s", "43% 12%", "2.2s")}>
        {arm("M72 82 C 60 92, 54 106, 58 118", BLAEK_FOR)}
        <path d="M80 121.5 L 61 117 L 61 90 L 80 94.5 L 99 90 L 99 117 Z" fill="#2f6fb0" />
        <path d="M80 96.5 L 63 92.5 L 63 114.5 L 80 118.5 Z" fill="#fffaf0" />
        <path d="M80 96.5 L 97 92.5 L 97 114.5 L 80 118.5 Z" fill="#fffaf0" />
        <path d="M66 97.5 l 11 2.6 M66 102.5 l 11 2.6 M66 107.5 l 8 1.9 M83 100.1 l 11 -2.6 M83 105.1 l 11 -2.6 M83 110.1 l 8 -1.9" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
        {/* Siden, der vendes. */}
        <g className="zoo-fx-flip" style={{ animationDuration: "3s" }}>
          <path d="M80 96.5 L 97 92.5 L 97 114.5 L 80 118.5 Z" fill="#f3ead6" stroke="#e2d6bd" strokeWidth="0.8" />
          <path d="M83 100.1 l 11 -2.6 M83 105.1 l 11 -2.6" stroke="#b9ab92" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <path d="M80 95.5 v 24" stroke="#245a92" strokeWidth="1.5" />
        {arm("M56 114 C 57 122, 64 123, 68 120", BLAEK_FOR, 8)}
      </g>
      <g className="zoo-fx-wave" style={fxv("1.3s", "9% 65%", "2s")}>
        {boks(150, 36, 1)}
        {arm("M104 80 C 116 98, 132 102, 144 96", BLAEK_FOR)}
        <path d="M156 84 c 7 0, 7 10, -1 10" stroke="#fdfaf3" strokeWidth="3" fill="none" />
        <path d="M138 80 h 18 l -2 18 q -7 3 -14 0 Z" fill="#fdfaf3" />
        <path d="M138.6 87 h 16.8" stroke="#e8463c" strokeWidth="3" />
        <ellipse cx="147" cy="80.5" rx="8.5" ry="2" fill="#6b3e1f" />
        {arm("M137 94 C 142 99, 150 99, 155 94", BLAEK_FOR, 7)}
        {/* Damp fra kaffen. */}
        <g className="zoo-fx-rise" style={fx("0s")}>
          <path d="M144 74 q -3 -4 0 -8 q 3 -4 0 -8" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
        <g className="zoo-fx-rise" style={fx("1.2s")}>
          <path d="M151 74 q -3 -4 0 -8 q 3 -4 0 -8" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      </g>
      {/* Kappen og ansigtet; munden snakker i telefonen. */}
      {blaekKappe}
      <circle cx="106" cy="20" r="3" fill="#8a58c4" />
      {blaekOejne}
      <ellipse className="zoo-fx-talk" cx="102" cy="70" rx="5.5" ry="4.5" fill="#5b3390" />
      {kasket}
      {/* "Bla bla" fra telefonen. */}
      <g className="zoo-fx-rise" style={fx("0.3s")}>
        {boks(150, 18, 14)}
        <path d="M144 26 q 3 -4 6 0 q 3 4 6 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-fx-rise" style={fx("1.5s")}>
        {boks(152, 14, 14)}
        <path d="M148 18 q 3 -4 6 0 q 3 4 6 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  ),
};

/* ------------------------------------------------------------------------ */
/* Pirat-skildpadden                                                        */
/* ------------------------------------------------------------------------ */

const GULD = "#f6c636";
const GULD_MOERK = "#d49a1c";
const HAT = "#2b2433";
const KISTE = "#a0632e";
const KISTE_MOERK = "#7a4620";

/** Skjoldet, bugskjoldet og pladerne (som Havskildpadde i creatures.tsx). */
const skjold = (
  <>
    <path d="M32 80 C 38 98, 160 100, 176 80 Z" fill="#efdca0" />
    <path d="M34 82 C 34 36, 86 18, 124 24 C 160 30, 176 58, 172 82 Z" fill="#5da05a" />
    <path d="M60 50 L 86 36 L 116 40 L 128 62 L 104 76 L 70 72 Z" fill="#8cc774" />
    <path d="M128 46 L 152 52 L 156 72 L 134 78 Z" fill="#8cc774" opacity="0.85" />
    <path d="M46 62 L 60 56 L 66 76 L 42 80 Z" fill="#8cc774" opacity="0.85" />
    <path d="M38 70 C 60 78, 150 78, 172 70 L 172 82 L 34 82 Z" fill="#3f7d48" opacity="0.5" />
  </>
);

/** Skildpaddens hoved med pirathat og klap for det fjerne øje. */
const piratHoved = (glad: boolean) => (
  <>
    <path d="M160 68 C 170 62, 182 60, 190 64 L 190 84 C 182 86, 168 86, 158 84 Z" fill="#7fb877" />
    <circle cx="190" cy="68" r="19" fill="#8cc774" />
    <ellipse cx="202" cy="76" rx="9" ry="6" fill="#a4d58c" />
    {EYE(187, 63, 4.2)}
    <circle cx="183" cy="76" r="4" fill="#ff9a8a" opacity="0.55" />
    {glad ? (
      <path d="M198 79 q 6 7 12 -1 Z" fill="#3f7d48" />
    ) : (
      <path d="M200 80 q 4 3 8 -1" stroke="#4d8a52" strokeWidth="2" fill="none" strokeLinecap="round" />
    )}
    {/* Klappen for øjet med snor. */}
    <path d="M198 57 C 192 52, 184 50, 174 52" stroke="#1d1a17" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="201" cy="61" rx="5" ry="5.5" fill="#1d1a17" />
    {/* Trekantet pirathat med guldkant og et lille kranie. */}
    <path d="M174 48 C 172 30, 206 26, 208 46 Z" fill={HAT} />
    <path d="M162 50 C 168 40, 178 46, 190 46 C 202 46, 212 38, 220 42 C 218 52, 206 54, 190 54 C 176 54, 168 56, 162 50 Z" fill={HAT} />
    <path d="M163 50 C 168 42, 178 47, 190 47 C 202 47, 212 40, 219 43" stroke={GULD} strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="191" cy="36" r="4" fill="#fff" />
    <rect x="188.6" y="38" width="4.8" height="3.6" rx="1" fill="#fff" />
    <circle cx="189.6" cy="35.8" r="1" fill={HAT} />
    <circle cx="192.4" cy="35.8" r="1" fill={HAT} />
  </>
);

/** Guldmønt. */
const moent = (x: number, y: number, r = 5.5) => (
  <>
    <circle cx={x} cy={y} r={r} fill={GULD} stroke={GULD_MOERK} strokeWidth="1.2" />
    <circle cx={x} cy={y} r={rund(r * 0.55)} fill="none" stroke={GULD_MOERK} strokeWidth="1" />
  </>
);

/** Skildpadde med pirathat og klap for øjet — holder den pause, viser den sin skattekiste frem. */
const pirateTurtle: CreatureSpec = {
  name: "Pirat-skildpadden",
  rarity: "rare",
  height: 22.4,
  aspect: 240 / 144,
  gait: "swim",
  pace: 0.6,
  viewBox: "0 0 240 144",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M44 84 C 34 86, 18 94, 4 108 C 22 112, 38 104, 50 96 Z" fill="#6aa86a" />
      </g>
      <g className="zoo-tail">
        <path d="M128 78 C 100 80, 66 96, 46 114 C 42 120, 50 124, 58 122 C 90 118, 124 106, 136 92 Z" fill="#4f8f58" />
      </g>
      {skjold}
      <g className="zoo-head">{piratHoved(false)}</g>
      <g className="zoo-tail">
        <path d="M158 76 C 130 74, 96 90, 76 110 C 72 117, 80 123, 90 121 C 124 114, 160 102, 168 88 Z" fill="#74b06e" />
      </g>
    </>
  ),
  special: (
    <>
      <path d="M44 84 C 34 86, 18 94, 4 108 C 22 112, 38 104, 50 96 Z" fill="#6aa86a" />
      <path d="M128 78 C 100 80, 66 96, 46 114 C 42 120, 50 124, 58 122 C 90 118, 124 106, 136 92 Z" fill="#4f8f58" />
      {skjold}
      {/* Det åbne låg bag skatten. */}
      <path d="M184 112 L 190 84 C 204 76, 226 78, 236 88 L 232 112 Z" fill={KISTE} />
      <path d="M190 110 L 194 89 C 205 83, 222 84, 230 92 L 227 110 Z" fill="#5a3416" />
      <path d="M190 84 C 204 76, 226 78, 236 88" stroke={GULD} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Hovedet kigger ned i kisten og nikker tilfreds. */}
      <g className="zoo-fx-nod" style={fxv("0s", "10% 90%", "1.6s")}>
        <g transform="rotate(8 172 76)">{piratHoved(true)}</g>
      </g>
      {/* Bunken af guld med en perle og en rubin. */}
      {moent(192, 104)}
      {moent(201, 103)}
      {moent(210, 103)}
      {moent(219, 104)}
      {moent(198, 98)}
      {moent(208, 97)}
      {moent(187, 109)}
      {moent(196, 109)}
      {moent(205, 108)}
      {moent(214, 109)}
      {moent(223, 109)}
      <path d="M218 93 l 5 5 l -5 5 l -5 -5 Z" fill="#e8463c" />
      <circle cx="189" cy="101" r="3.6" fill="#fdf6ec" />
      {/* Kistens forside. */}
      <rect x="182" y="112" width="50" height="30" rx="3" fill={KISTE} />
      <path d="M182 122 H 232 M182 132 H 232" stroke={KISTE_MOERK} strokeWidth="1.5" />
      <rect x="188" y="112" width="5" height="30" fill={GULD} />
      <rect x="221" y="112" width="5" height="30" fill={GULD} />
      <rect x="180" y="109" width="54" height="5" rx="2" fill={GULD_MOERK} />
      <rect x="202" y="116" width="10" height="11" rx="2" fill={GULD} />
      <circle cx="207" cy="120" r="1.6" fill={KISTE_MOERK} />
      <rect x="206.3" y="120" width="1.4" height="4" fill={KISTE_MOERK} />
      {/* Den nære luffe holder om kisten. */}
      <path d="M148 80 C 164 84, 178 96, 186 112 C 190 120, 186 128, 180 126 C 170 116, 156 102, 144 92 Z" fill="#74b06e" />
      {/* Mønter der hopper op af kisten, og glimt i guldet. */}
      <g className="zoo-fx-rise" style={fxv("0s", undefined, "1.8s")}>
        {boks(224, 74, 26)}
        {moent(224, 96, 4.5)}
      </g>
      <g className="zoo-fx-rise" style={fxv("0.9s", undefined, "1.8s")}>
        {boks(232, 74, 26)}
        {moent(232, 96, 3.6)}
      </g>
      <g className="zoo-fx-sparkle" style={fx("0s")}>{GLIMT(214, 92, 5, "#fff8c8")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{GLIMT(231, 102, 4.5, "#fff8c8")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{GLIMT(186, 100, 4, "#fff8c8")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{GLIMT(233, 126, 4, "#fff8c8")}</g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Cirkussælen                                                              */
/* ------------------------------------------------------------------------ */

const SAEL = "#929eac";
const SAEL_MOERK = "#6d7987";
const SAEL_LYS = "#c9d2dc";
const SAEL_PLET = "#7a8694";
const CIRKUS = "#d8332f";

/** Lille rød cirkushat (kegle med kvast), sidder skævt på hovedet. */
const cirkushat = (
  <g transform="rotate(12 146 126)">
    <path d="M135 127 L 146 102 L 157 127 Z" fill={CIRKUS} />
    <path d="M140.3 115 L 151.7 115" stroke="#fff" strokeWidth="2.4" />
    <ellipse cx="146" cy="127" rx="12.5" ry="3.6" fill={GULD} />
    <circle cx="146" cy="101" r="4.2" fill={GULD} />
    <circle cx="144.8" cy="99.8" r="1.4" fill="#fff3a8" />
  </g>
);

/** Sælens hoved med snude, knurhår og cirkushat (hovedets midte i 146,146). */
const saelHoved = (
  <>
    {cirkushat}
    <circle cx="146" cy="146" r="22" fill={SAEL} />
    <circle cx="136" cy="136" r="3" fill={SAEL_PLET} />
    <ellipse cx="164" cy="156" rx="11" ry="8.5" fill={SAEL_LYS} />
    <ellipse cx="172" cy="151" rx="4" ry="3" fill="#2b2a33" />
    <path d="M161 163 q 4 3 8 0" stroke="#4a4f58" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <g fill={SAEL_MOERK}>
      <circle cx="162" cy="154" r="0.9" /><circle cx="166" cy="156" r="0.9" /><circle cx="162" cy="158" r="0.9" />
    </g>
    <path d="M166 155 l 11 -3 M166 158 l 11 1 M165 161 l 10 4" stroke="#4a4f58" strokeWidth="1" strokeLinecap="round" />
    {EYE(150, 142, 6.2)}
    <circle cx="147" cy="158" r="4" fill="#ff9a8a" opacity="0.5" />
  </>
);

/** Pie-stykker til den stribede badebold. */
const BOLD_FARVER = ["#e8463c", "#fdfaf3", "#f6c636", "#fdfaf3", "#3b8fe0", "#fdfaf3"];
const badebold = (cx: number, cy: number, r: number) => (
  <>
    {BOLD_FARVER.map((farve, i) => {
      const a1 = (i * Math.PI) / 3;
      const a2 = ((i + 1) * Math.PI) / 3;
      const d = `M${cx} ${cy} L ${rund(cx + r * Math.cos(a1))} ${rund(cy + r * Math.sin(a1))} A ${r} ${r} 0 0 1 ${rund(cx + r * Math.cos(a2))} ${rund(cy + r * Math.sin(a2))} Z`;
      return <path key={i} d={d} fill={farve} />;
    })}
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c9b9a0" strokeWidth="1" />
    <circle cx={cx} cy={cy} r="4" fill="#fdfaf3" stroke="#c9b9a0" strokeWidth="1" />
  </>
);

/** Grå-plettet sæl med rød cirkushat — holder den pause, står den på halen og balancerer en bold. */
const circusSeal: CreatureSpec = {
  name: "Cirkussælen",
  rarity: "rare",
  height: 31,
  aspect: 180 / 190,
  gait: "swim",
  pace: 0.9,
  viewBox: "0 0 180 190",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M36 168 C 26 160, 14 152, 4 152 C 9 162, 9 172, 4 182 C 14 182, 26 176, 36 172 Z" fill={SAEL_MOERK} />
        <path d="M9 167 l 14 1" stroke="#5c6774" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <path d="M28 170 C 32 150, 70 136, 112 136 C 140 136, 158 148, 158 164 C 158 180, 132 188, 98 188 C 66 188, 32 184, 28 170 Z" fill={SAEL} />
        <path d="M40 178 C 70 184, 120 184, 156 168 C 154 182, 130 189, 98 189 C 70 189, 48 186, 40 178 Z" fill={SAEL_LYS} />
        <g fill={SAEL_PLET}>
          <ellipse cx="70" cy="152" rx="4.5" ry="3" />
          <circle cx="90" cy="146" r="3" />
          <circle cx="54" cy="162" r="3" />
          <ellipse cx="104" cy="154" rx="3.5" ry="2.6" />
          <circle cx="118" cy="144" r="2.6" />
          <circle cx="80" cy="166" r="2.4" />
        </g>
      </g>
      <g className="zoo-head">{saelHoved}</g>
      <g className="zoo-tail">
        <path d="M118 166 C 112 178, 100 186, 86 188 C 82 184, 92 174, 106 166 Z" fill={SAEL_MOERK} />
      </g>
    </>
  ),
  special: (
    <>
      {/* Små stjerner i manegen. */}
      <g className="zoo-fx-sparkle" style={fx("0s")}>{STJERNE(36, 36, 6, GULD)}</g>
      <g className="zoo-fx-sparkle" style={fx("0.5s")}>{STJERNE(160, 30, 5, "#fff3a8")}</g>
      <g className="zoo-fx-sparkle" style={fx("0.9s")}>{STJERNE(28, 110, 5, "#fff3a8")}</g>
      <g className="zoo-fx-sparkle" style={fx("1.2s")}>{STJERNE(160, 152, 5.5, GULD)}</g>
      {/* Halefinnerne spredt ud som fødder. */}
      <path d="M72 184 C 60 178, 48 180, 40 188 C 52 190, 64 190, 74 190 Z" fill={SAEL_MOERK} />
      <path d="M106 184 C 118 178, 130 180, 138 188 C 126 190, 114 190, 104 190 Z" fill={SAEL_MOERK} />
      {/* Kroppen står lodret. */}
      <path d="M70 186 C 54 160, 56 118, 74 96 C 84 84, 106 84, 116 96 C 126 112, 126 152, 112 186 Z" fill={SAEL} />
      <path d="M102 100 C 120 108, 124 150, 112 184 L 98 184 C 110 152, 110 120, 102 100 Z" fill={SAEL_LYS} />
      <g fill={SAEL_PLET}>
        <ellipse cx="74" cy="130" rx="3" ry="4.5" />
        <circle cx="68" cy="152" r="3" />
        <circle cx="82" cy="112" r="2.6" />
        <circle cx="78" cy="170" r="3.2" />
        <circle cx="90" cy="142" r="2.4" />
      </g>
      {/* Hovedet bøjet bagover med snuden i vejret. */}
      <g transform="translate(-44 -74) rotate(-60 146 146)">{saelHoved}</g>
      {/* Badebolden vipper på snuden og snurrer. */}
      <g className="zoo-fx-bob" style={fxv("0s", undefined, "0.5s")}>
        {boks(120, 10, 100)}
        <g className="zoo-fx-spin" style={fx("0s")}>{badebold(120, 29, 19)}</g>
      </g>
      <path d="M108 20 C 110 15, 115 12, 120 12" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Lufferne klapper. */}
      <g className="zoo-fx-shake" style={fxv("0s", "0% 90%", "0.35s")}>
        <path d="M108 100 C 118 90, 132 82, 144 80 C 150 79, 151 85, 146 88 C 136 92, 124 100, 114 108 Z" fill={SAEL_MOERK} />
      </g>
      <g className="zoo-fx-wave" style={fxv("0s", "4% 82%", "0.35s")}>
        <path d="M102 114 C 116 104, 132 94, 144 90 C 150 88, 152 94, 147 97 C 136 102, 120 112, 108 122 Z" fill="#7f8b99" />
      </g>
      <g className="zoo-fx-sparkle" style={fxv("0.1s", undefined, "0.7s")}>
        <path d="M157 77 l 4 -5 M160 87 l 7 0 M157 97 l 4 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------------ */
/* Ferie-krabben                                                            */
/* ------------------------------------------------------------------------ */

const KRABBE = "#f06048";
const KRABBE_MOERK = "#d0402e";
const KRABBE_KLO = "#e8553f";
const KRABBE_LYS = "#f2735a";

/** Solbriller, der er gledet lidt ned, så øjnene kigger op over kanten (koordinater som Krabbe). */
const solbriller = (
  <>
    <path d="M63 19 q 3 -3 6 0" stroke="#1d1a17" strokeWidth="2" fill="none" />
    <ellipse cx="54" cy="21" rx="10" ry="6.5" fill="#1f2433" stroke="#ffd23c" strokeWidth="1.6" />
    <ellipse cx="76" cy="21" rx="10" ry="6.5" fill="#1f2433" stroke="#ffd23c" strokeWidth="1.6" />
    <path d="M48 21 l 4 -3.5 M70 21 l 4 -3.5" stroke="#8fa6d8" strokeWidth="1.6" strokeLinecap="round" />
  </>
);

/** Krabbens øjne på stilke med solbriller og smil. */
const krabbeAnsigt = (
  <>
    <path d="M54 30 V 20 M76 30 V 20" stroke={KRABBE_MOERK} strokeWidth="4" strokeLinecap="round" />
    <circle cx="54" cy="16" r="8" fill="#fff" />
    <circle cx="76" cy="16" r="8" fill="#fff" />
    {EYE(55, 13, 4.2)}
    {EYE(77, 13, 4.2)}
    {solbriller}
    <path d="M58 48 q 7 6 14 0" stroke="#9a2a1c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="46" r="4.2" fill="#ff9a8a" opacity="0.55" />
    <circle cx="86" cy="46" r="4.2" fill="#ff9a8a" opacity="0.55" />
  </>
);

const krabbeBen = (d: string) => (
  <path d={d} stroke={KRABBE_MOERK} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
);

/** Parasollens skærm: hvid med røde striber og takket kant. */
const SKAERM = "M8 36 Q 56 -4 104 36 Q 92 30, 80 36 Q 68 30, 56 36 Q 44 30, 32 36 Q 20 30, 8 36 Z";

/** Krabbe med solbriller — holder den pause, slapper den af i en liggestol med en drink. */
const vacationCrab: CreatureSpec = {
  name: "Ferie-krabben",
  rarity: "rare",
  height: 14.4,
  aspect: 170 / 130,
  gait: "walk",
  pace: 1,
  zone: "ground",
  viewBox: "0 0 170 130",
  art: (
    <g transform="translate(20 58)">
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M38 50 L 22 50 L 18 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M40 57 L 26 61 L 24 68")}</g>
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M50 62 L 41 66 L 39 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M92 50 L 108 50 L 112 68")}</g>
      <g className="zoo-leg zoo-leg-a">{krabbeBen("M90 57 L 104 61 L 106 68")}</g>
      <g className="zoo-leg zoo-leg-b">{krabbeBen("M80 62 L 89 66 L 91 68")}</g>
      <g className="zoo-torso">
        <path d="M30 24 C 24 8, 10 6, 6 16 C 4 26, 14 32, 22 32 Z" fill={KRABBE_KLO} />
        <path d="M100 24 C 106 8, 120 6, 124 16 C 126 26, 116 32, 108 32 Z" fill={KRABBE_KLO} />
        <path d="M14 14 L 6 4 L 22 8 Z" fill={KRABBE_LYS} />
        <path d="M116 14 L 124 4 L 108 8 Z" fill={KRABBE_LYS} />
        <path d="M26 36 C 26 30, 32 28, 38 30 M104 36 C 104 30, 98 28, 92 30" stroke={KRABBE_MOERK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="65" cy="46" rx="38" ry="22" fill={KRABBE} />
        <ellipse cx="65" cy="56" rx="30" ry="10" fill="#f68a74" opacity="0.6" />
      </g>
      <g className="zoo-head">{krabbeAnsigt}</g>
    </g>
  ),
  special: (
    <>
      {/* Parasollen. */}
      <path d="M56 26 L 42 128" stroke="#e8e2d4" strokeWidth="3.5" strokeLinecap="round" />
      <g transform="rotate(8 56 26)">
        <Klip form={<path d={SKAERM} />}>
          <path d={SKAERM} fill="#fdfaf3" />
          {[0, 1, 2, 3].map((i) => (
            <polygon key={i} points={`56,8 ${8 + 24 * i},40 ${20 + 24 * i},40`} fill="#e8463c" />
          ))}
        </Klip>
        <circle cx="56" cy="15" r="3" fill="#e8463c" />
      </g>
      {/* Liggestolen. */}
      <g stroke="#c98a3c" strokeWidth="4.5" strokeLinecap="round">
        <path d="M34 128 L 54 54" />
        <path d="M62 128 L 122 92" />
        <path d="M124 128 L 112 100" />
      </g>
      <path d="M54 58 C 58 92, 68 112, 88 113 C 102 113, 112 104, 118 94" stroke="#fdfaf3" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M54 58 C 58 92, 68 112, 88 113 C 102 113, 112 104, 118 94" stroke="#3b8fe0" strokeWidth="11" fill="none" strokeDasharray="7 7" />
      {/* Benene dingler. */}
      {krabbeBen("M62 100 L 46 106 L 42 118")}
      {krabbeBen("M66 108 L 54 116 L 52 126")}
      {krabbeBen("M104 96 L 120 100 L 126 112")}
      {krabbeBen("M98 104 L 110 112 L 112 122")}
      {/* Kroppen læner sig tilbage. */}
      <g transform="translate(17 44) rotate(-20 65 46)">
        <ellipse cx="65" cy="46" rx="38" ry="22" fill={KRABBE} />
        <ellipse cx="65" cy="56" rx="30" ry="10" fill="#f68a74" opacity="0.6" />
        {krabbeAnsigt}
      </g>
      {/* Kloen med drinken (sugerør og papirparaply). */}
      <path d="M106 84 C 116 80, 124 76, 128 70" stroke={KRABBE_MOERK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <g transform="translate(20 42)">
        <path d="M100 24 C 106 8, 120 6, 124 16 C 126 26, 116 32, 108 32 Z" fill={KRABBE_KLO} />
      </g>
      <g transform="translate(0 6)">
        <path d="M140 30 L 146 14 L 152 12" stroke="#ff6fa8" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M135 30 L 131 16" stroke="#c98a3c" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M123 19 Q 129 8 139 13 Z" fill="#56c3a6" />
        <path d="M130 28 L 146 28 L 143 50 L 133 50 Z" fill="#e6f6ff" opacity="0.75" />
        <path d="M131 34 L 145 34 L 143 50 L 133 50 Z" fill="#ffa53a" />
        <circle cx="131" cy="29" r="5" fill="#ffcf4a" stroke="#f39a1c" strokeWidth="1.4" />
      </g>
      <g transform="translate(20 42)">
        <path d="M116 14 L 124 4 L 108 8 Z" fill={KRABBE_LYS} />
      </g>
      {/* Den anden klo vinker dovent. */}
      <g className="zoo-fx-wave" style={fxv("0s", "96% 95%", "2.2s")}>
        <path d="M62 82 C 50 78, 42 70, 40 62" stroke={KRABBE_MOERK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <g transform="translate(14 26)">
          <path d="M30 24 C 24 8, 10 6, 6 16 C 4 26, 14 32, 22 32 Z" fill={KRABBE_KLO} />
          <path d="M14 14 L 6 4 L 22 8 Z" fill={KRABBE_LYS} />
        </g>
      </g>
      {/* Små hjerter stiger op: den har det dejligt. */}
      <g className="zoo-fx-rise" style={fx("0s")}>
        {boks(112, 40, 16)}
        {HJERTE(112, 50, 4, "#ff6f91")}
      </g>
      <g className="zoo-fx-rise" style={fx("1.2s")}>
        {boks(118, 34, 16)}
        {HJERTE(118, 44, 3.2, "#ffd0dc")}
      </g>
    </>
  ),
};

export const specialsTwo: Record<string, CreatureSpec> = {
  multitaskOctopus,
  pirateTurtle,
  circusSeal,
  vacationCrab,
};
