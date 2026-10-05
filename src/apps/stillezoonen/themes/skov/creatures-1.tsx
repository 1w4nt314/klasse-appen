import { EYE, Klip } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Den danske skov, de almindelige dyr: tre hjorte, vildsvin, ræv, grævling,
 * skovmår, hare og egern. Alle er tegnet i profil, vendt mod højre, med fødderne
 * på bunden af viewBox. Fjerne ben (mørkere) tegnes før kroppen, nære ben efter.
 */

/** Rådyr: lille og let, rødbrun, hvidt spejl bagpå og små gevirer på bukken. */
const roeDeer: CreatureSpec = {
  name: "Rådyr",
  height: 17,
  aspect: 180 / 150,
  gait: "walk",
  pace: 1,
  viewBox: "19 0 180 150",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="84" width="8" height="66" rx="4" fill="#8a4c2a" />
        <rect x="120" y="142" width="8" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="50" y="84" width="8" height="66" rx="4" fill="#8a4c2a" />
        <rect x="50" y="142" width="8" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="90" cy="74" rx="50" ry="25" fill="#b8683a" />
        <ellipse cx="94" cy="89" rx="36" ry="8" fill="#e8c49a" opacity="0.8" />
        <ellipse cx="46" cy="72" rx="8" ry="12" fill="#fbf5e8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="132" y="86" width="9" height="64" rx="4" fill="#b8683a" />
        <rect x="132" y="142" width="9" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="62" y="86" width="9" height="64" rx="4" fill="#b8683a" />
        <rect x="62" y="142" width="9" height="8" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-head">
        {/* Bukkens små gevirer */}
        <path d="M150 32 L 148 10 M149 22 L 157 16 M148.5 14 L 140 8" stroke="#7b6a48" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M116 66 C 122 46, 130 34, 140 28 L 158 42 C 152 56, 146 70, 132 80 Z" fill="#b8683a" />
        <ellipse cx="158" cy="40" rx="19" ry="11" transform="rotate(26 158 40)" fill="#b8683a" />
        <ellipse cx="171" cy="48" rx="8" ry="5" transform="rotate(26 171 48)" fill="#f4e6d0" />
        <circle cx="176" cy="50.5" r="3.2" fill="#2b211c" />
        <ellipse cx="142" cy="24" rx="5" ry="11" transform="rotate(-32 142 24)" fill="#b8683a" />
        <ellipse cx="142" cy="25" rx="2.6" ry="7" transform="rotate(-32 142 25)" fill="#f0c2a8" />
        {EYE(160, 38, 3.6)}
      </g>
    </>
  ),
};

/** Kronhjortens gevir: en stang, der buer op og bagud, med brynsprosse og fem ender. */
const ANTLER =
  "M190 50 C 192 24 176 -4 150 -20 M189 40 L 207 34 M188 30 L 204 16 M181 11 L 194 -8 M167 -6 L 170 -26 M150 -20 L 146 -30 M150 -20 L 160 -30";

/** Kronhjort: stor og mørkebrun med manke og stort grenet gevir. */
const redDeer: CreatureSpec = {
  name: "Kronhjort",
  height: 33.6,
  aspect: 204 / 240,
  gait: "walk",
  pace: 0.8,
  viewBox: "28 -40 204 240",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="146" y="116" width="12" height="84" rx="5" fill="#4f2f1c" />
        <rect x="146" y="190" width="12" height="10" rx="4" fill="#2f2019" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="52" y="116" width="12" height="84" rx="5" fill="#4f2f1c" />
        <rect x="52" y="190" width="12" height="10" rx="4" fill="#2f2019" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="106" cy="114" rx="68" ry="34" fill="#7a4a2c" />
        <ellipse cx="110" cy="134" rx="46" ry="9" fill="#a67a52" opacity="0.7" />
        <ellipse cx="50" cy="112" rx="10" ry="16" fill="#d8b88e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="162" y="118" width="13" height="82" rx="5" fill="#7a4a2c" />
        <rect x="162" y="190" width="13" height="10" rx="4" fill="#2f2019" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="66" y="118" width="13" height="82" rx="5" fill="#7a4a2c" />
        <rect x="66" y="190" width="13" height="10" rx="4" fill="#2f2019" />
      </g>
      <g className="zoo-head">
        {/* Gevir: to store grenede stænger, den fjerne er mørkere og forskudt */}
        <g transform="translate(-14 5)" stroke="#a89466" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={ANTLER} />
        </g>
        <path d="M138 98 C 148 72, 164 52, 180 44 L 208 64 C 200 82, 192 104, 178 122 L 170 130 L 140 122 Z" fill="#7a4a2c" />
        {/* manke */}
        <path d="M200 76 C 194 90, 188 102, 184 118 L 178 112 L 176 122 L 170 112 L 166 118 C 172 100, 184 86, 200 76 Z" fill="#4a2a17" />
        <ellipse cx="196" cy="64" rx="22" ry="14" transform="rotate(30 196 64)" fill="#7a4a2c" />
        <ellipse cx="213" cy="76" rx="9" ry="8" fill="#c9a37a" />
        <circle cx="219" cy="79" r="4" fill="#2b211c" />
        <ellipse cx="176" cy="54" rx="6" ry="11" transform="rotate(-40 176 54)" fill="#6b4026" />
        <ellipse cx="177" cy="55" rx="3" ry="7" transform="rotate(-40 177 55)" fill="#d9a98c" />
        <g stroke="#e3d0a0" strokeWidth="7.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={ANTLER} />
        </g>
        {EYE(200, 62, 4)}
      </g>
    </>
  ),
};

/** Dådyr: lysebrun med hvide pletter, sort-hvid hale og skovlformet gevir. */
const fallowDeer: CreatureSpec = {
  name: "Dådyr",
  height: 20,
  aspect: 200 / 170,
  gait: "walk",
  pace: 0.95,
  viewBox: "0 0 200 170",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="120" y="96" width="9" height="74" rx="4" fill="#9a6a3a" />
        <rect x="120" y="161" width="9" height="9" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="46" y="96" width="9" height="74" rx="4" fill="#9a6a3a" />
        <rect x="46" y="161" width="9" height="9" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-torso">
        <path d="M42 74 C 32 80, 32 98, 38 108" stroke="#3a2f28" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="92" cy="88" rx="52" ry="25" fill="#c98d52" />
        <ellipse cx="96" cy="103" rx="38" ry="7" fill="#f3e2c0" />
        <ellipse cx="46" cy="86" rx="8" ry="13" fill="#fdf6e4" />
        <circle cx="64" cy="74" r="3" fill="#fdf6e4" />
        <circle cx="82" cy="68" r="3" fill="#fdf6e4" />
        <circle cx="100" cy="72" r="3" fill="#fdf6e4" />
        <circle cx="118" cy="70" r="3" fill="#fdf6e4" />
        <circle cx="72" cy="88" r="3" fill="#fdf6e4" />
        <circle cx="92" cy="86" r="3" fill="#fdf6e4" />
        <circle cx="112" cy="88" r="3" fill="#fdf6e4" />
        <circle cx="60" cy="96" r="2.6" fill="#fdf6e4" />
        <circle cx="130" cy="82" r="2.6" fill="#fdf6e4" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="132" y="98" width="10" height="72" rx="4" fill="#c98d52" />
        <rect x="132" y="161" width="10" height="9" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="98" width="10" height="72" rx="4" fill="#c98d52" />
        <rect x="60" y="161" width="10" height="9" rx="3" fill="#3a2c25" />
      </g>
      <g className="zoo-head">
        {/* Skovlformet gevir */}
        <g transform="rotate(-20 154 46)">
          <path d="M150 48 L 148 32 C 142 26, 140 16, 142 8 L 147 14 L 149 6 L 154 14 L 158 7 L 160 16 L 165 11 C 166 22, 162 30, 158 34 L 157 48 Z" fill="#d6bf88" />
          <path d="M153 44 L 166 36" stroke="#d6bf88" strokeWidth="3.6" strokeLinecap="round" />
        </g>
        <path d="M120 76 C 126 58, 134 46, 144 40 L 160 54 C 152 66, 148 78, 142 88 Z" fill="#c98d52" />
        <ellipse cx="160" cy="52" rx="16" ry="10.5" transform="rotate(28 160 52)" fill="#c98d52" />
        <ellipse cx="172" cy="60" rx="7" ry="6" fill="#f3e2c0" />
        <circle cx="176" cy="62" r="3.2" fill="#2b211c" />
        <ellipse cx="143" cy="38" rx="5" ry="10" transform="rotate(-34 143 38)" fill="#c98d52" />
        <ellipse cx="143" cy="39" rx="2.6" ry="6.5" transform="rotate(-34 143 39)" fill="#f0c2a8" />
        {EYE(163, 50, 3.6)}
      </g>
    </>
  ),
};

/** Vildsvin: mørk, børstet pels, lille snude og små hvide hjørnetænder. */
const wildBoar: CreatureSpec = {
  name: "Vildsvin",
  height: 13,
  aspect: 192 / 120,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 192 120",
  art: (
    <>
      <path d="M34 58 C 22 50, 20 64, 28 64" stroke="#3b2f29" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="108" y="84" width="16" height="36" rx="6" fill="#3b2f29" />
        <rect x="108" y="112" width="16" height="8" rx="3" fill="#1f1815" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="40" y="84" width="16" height="36" rx="6" fill="#3b2f29" />
        <rect x="40" y="112" width="16" height="8" rx="3" fill="#1f1815" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="88" cy="62" rx="62" ry="36" fill="#5b4a40" />
        <ellipse cx="118" cy="52" rx="34" ry="30" fill="#5b4a40" />
        <ellipse cx="92" cy="80" rx="42" ry="9" fill="#7a6558" opacity="0.6" />
        {/* børstekam langs ryggen */}
        <path d="M40 52 L 42 40 L 48 46 L 54 34 L 60 42 L 68 28 L 76 36 L 86 21 L 94 32 L 104 18 L 112 30 L 122 18 L 128 32 L 120 42 L 80 46 L 50 54 Z" fill="#3b2f29" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="122" y="86" width="17" height="34" rx="6" fill="#5b4a40" />
        <rect x="122" y="112" width="17" height="8" rx="3" fill="#1f1815" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="54" y="86" width="17" height="34" rx="6" fill="#5b4a40" />
        <rect x="54" y="112" width="17" height="8" rx="3" fill="#1f1815" />
      </g>
      <g className="zoo-head">
        <path d="M132 32 L 140 6 L 154 34 Z" fill="#3b2f29" />
        <path d="M138 30 L 141 14 L 148 32 Z" fill="#8a6a5c" />
        <path d="M124 52 C 124 34, 144 30, 158 40 C 168 46, 176 54, 182 62 L 182 82 C 174 90, 150 94, 136 90 C 126 84, 124 66, 124 52 Z" fill="#6a574b" />
        <ellipse cx="181" cy="73" rx="8" ry="11" fill="#d2a79b" />
        <ellipse cx="184" cy="70" rx="1.8" ry="2.8" fill="#8a5a50" />
        <ellipse cx="184" cy="78" rx="1.8" ry="2.8" fill="#8a5a50" />
        {/* små hjørnetænder */}
        <path d="M162 90 C 160 82, 164 74, 170 72 C 171 78, 170 84, 169 91 Z" fill="#fbf6e8" />
        <circle cx="140" cy="68" r="6" fill="#8a6a5c" opacity="0.5" />
        {EYE(151, 52, 3.4)}
      </g>
    </>
  ),
};

/** Ræv: orange med hvid halespids, hvide kinder og sorte sokker. */
const fox: CreatureSpec = {
  name: "Ræv",
  height: 9,
  aspect: 200 / 110,
  gait: "walk",
  pace: 1.3,
  viewBox: "0 0 200 110",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M58 62 C 40 36, 8 40, 4 70 C 6 92, 34 98, 60 80 Z" fill="#e8803a" />
        <path d="M18 47 C 9 54, 5 62, 4 70 C 5 82, 12 91, 24 94 C 17 82, 16 60, 18 47 Z" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="118" y="76" width="9" height="34" rx="4" fill="#c4651e" />
        <rect x="118" y="94" width="9" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="60" y="76" width="9" height="34" rx="4" fill="#c4651e" />
        <rect x="60" y="94" width="9" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="64" rx="44" ry="20" fill="#e8803a" />
        <ellipse cx="100" cy="76" rx="30" ry="7" fill="#f6c58e" opacity="0.8" />
        <ellipse cx="136" cy="70" rx="12" ry="12" fill="#fbf8f1" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="130" y="78" width="10" height="32" rx="4" fill="#e8803a" />
        <rect x="130" y="94" width="10" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="72" y="78" width="10" height="32" rx="4" fill="#e8803a" />
        <rect x="72" y="94" width="10" height="16" rx="4" fill="#26231f" />
      </g>
      <g className="zoo-head">
        <path d="M136 38 L 134 10 L 152 32 Z" fill="#c4651e" />
        <path d="M150 32 L 158 8 L 167 36 Z" fill="#e8803a" />
        <path d="M154 30 L 158 14 L 163 32 Z" fill="#26231f" />
        <path d="M132 54 C 130 38, 146 30, 160 34 C 170 38, 176 50, 187 58 C 180 66, 164 70, 152 68 C 140 66, 132 62, 132 54 Z" fill="#e8803a" />
        <path d="M142 62 C 152 62, 160 56, 171 53 C 178 55, 183 57, 187 58 C 180 66, 164 71, 152 69 C 146 68, 142 66, 142 62 Z" fill="#fbf8f1" />
        <circle cx="187" cy="58" r="3.8" fill="#26231f" />
        {EYE(157, 45, 3.6)}
      </g>
    </>
  ),
};

/** Grævling: grå krop, sort bug og hvidt hoved med sort stribe gennem øjet. */
const badger: CreatureSpec = {
  name: "Grævling",
  height: 8,
  aspect: 176 / 100,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 176 100",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="106" y="64" width="14" height="36" rx="6" fill="#26231f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="36" y="64" width="14" height="36" rx="6" fill="#26231f" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="22" cy="54" rx="10" ry="7" fill="#8d9096" />
        <ellipse cx="82" cy="56" rx="58" ry="30" fill="#8d9096" />
        <ellipse cx="80" cy="45" rx="48" ry="16" fill="#b4b7bb" />
        <ellipse cx="86" cy="77" rx="44" ry="10" fill="#3a3835" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="120" y="66" width="15" height="34" rx="6" fill="#33302d" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="50" y="66" width="15" height="34" rx="6" fill="#33302d" />
      </g>
      <g className="zoo-head">
        <circle cx="127" cy="27" r="8" fill="#26231f" />
        <Klip form={<path d="M122 38 C 128 24, 148 24, 158 38 C 164 46, 168 56, 168 66 C 156 74, 136 76, 126 72 C 120 64, 118 48, 122 38 Z" />}>
          <rect x="110" y="20" width="64" height="60" fill="#f4f2ee" />
          <path d="M172 52 L 126 24 L 116 40 L 170 70 Z" fill="#26231f" />
        </Klip>
        <circle cx="167" cy="64" r="4" fill="#26231f" />
        <circle cx="148" cy="47" r="5.8" fill="#f4f2ee" />
        {EYE(148, 47, 3.4)}
      </g>
    </>
  ),
};

/** Skovmår: chokoladebrun, cremegul hagesmæk og busket hale. */
const pineMarten: CreatureSpec = {
  name: "Skovmår",
  height: 7,
  aspect: 190 / 90,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 190 90",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M54 50 C 36 28, 8 34, 4 54 C 4 72, 26 80, 56 66 Z" fill="#4a2e20" />
        <path d="M10 42 C 6 48, 4 52, 4 56 C 5 66, 12 72, 20 74 C 14 66, 12 52, 10 42 Z" fill="#33201a" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="116" y="56" width="9" height="34" rx="4" fill="#3a2318" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="56" width="9" height="34" rx="4" fill="#3a2318" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="100" cy="47" rx="56" ry="17" fill="#5b3a29" />
        <ellipse cx="100" cy="58" rx="40" ry="6" fill="#7a5238" opacity="0.7" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="128" y="58" width="10" height="32" rx="4" fill="#5b3a29" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="74" y="58" width="10" height="32" rx="4" fill="#5b3a29" />
      </g>
      <g className="zoo-head">
        <ellipse cx="146" cy="52" rx="14" ry="12" fill="#5b3a29" />
        {/* to små runde ører med lys kant */}
        <circle cx="164" cy="29" r="7" fill="#f0dc9c" />
        <circle cx="164" cy="30.2" r="4.6" fill="#4a2e20" />
        <circle cx="149" cy="30" r="7.6" fill="#f0dc9c" />
        <circle cx="149" cy="31.4" r="5" fill="#5b3a29" />
        <ellipse cx="158" cy="40" rx="18" ry="14" fill="#5b3a29" />
        <ellipse cx="175" cy="47" rx="11" ry="7" transform="rotate(15 175 47)" fill="#6e4733" />
        <path d="M168 50 C 166 56, 160 60, 154 64 C 150 70, 140 70, 136 64 C 140 58, 148 56, 156 50 C 160 52, 164 52, 168 50 Z" fill="#f0dc9c" />
        <circle cx="184" cy="48" r="3" fill="#1f1512" />
        {EYE(166, 38, 3.4)}
      </g>
    </>
  ),
};

/** Hare: brun med lange ører med sorte spidser, store bagben og hvid hale. */
const hare: CreatureSpec = {
  name: "Hare",
  height: 9,
  aspect: 160 / 130,
  gait: "hop",
  pace: 1.2,
  viewBox: "0 0 160 130",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a">
        <rect x="108" y="92" width="9" height="38" rx="4" fill="#8f6a40" />
        <ellipse cx="82" cy="123" rx="24" ry="7" fill="#8f6a40" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="74" cy="82" rx="48" ry="30" fill="#b88a58" />
        <ellipse cx="84" cy="102" rx="30" ry="8" fill="#efe0c6" />
        <ellipse cx="48" cy="94" rx="24" ry="30" fill="#a87a4a" />
        <circle cx="21" cy="84" r="8.5" fill="#fbf6ec" />
        <path d="M14 79 C 17 73, 23 72, 28 76" stroke="#3a2f28" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="114" y="90" width="10" height="40" rx="5" fill="#b88a58" />
        <ellipse cx="72" cy="123" rx="28" ry="7" fill="#b88a58" />
      </g>
      <g className="zoo-head">
        <g transform="translate(0 4)">
        {/* fjerne øre */}
        <Klip form={<ellipse cx="130" cy="30" rx="7" ry="25" transform="rotate(8 130 30)" />}>
          <g transform="rotate(8 130 30)">
            <ellipse cx="130" cy="30" rx="7" ry="25" fill="#8f6a40" />
            <rect x="120" y="0" width="20" height="9" fill="#26231f" />
          </g>
        </Klip>
        {/* nære øre */}
        <Klip form={<ellipse cx="112" cy="27" rx="8" ry="26" transform="rotate(-20 112 27)" />}>
          <g transform="rotate(-20 112 27)">
            <ellipse cx="112" cy="27" rx="8" ry="26" fill="#b88a58" />
            <ellipse cx="112" cy="31" rx="3.6" ry="17" fill="#e8b9a0" />
            <rect x="100" y="0" width="24" height="9" fill="#26231f" />
          </g>
        </Klip>
        </g>
        <ellipse cx="124" cy="66" rx="22" ry="17" fill="#b88a58" />
        <ellipse cx="142" cy="72" rx="12" ry="9" fill="#e6cfa6" />
        <circle cx="151" cy="71" r="3" fill="#d77f86" />
        {EYE(133, 62, 4)}
      </g>
    </>
  ),
};

/** Egern: rødbrunt med stor busket hale, øreduske og en nød i poterne. */
const squirrel: CreatureSpec = {
  name: "Egern",
  height: 6,
  aspect: 112 / 130,
  gait: "hop",
  pace: 1.3,
  viewBox: "0 0 112 130",
  art: (
    <>
      <path d="M52 118 C 12 118, 6 72, 16 44 C 24 22, 44 14, 54 28 C 60 38, 46 52, 48 68 C 50 82, 62 92, 62 106 Z" fill="#c4602c" />
      <path d="M22 52 C 26 36, 38 28, 46 34" stroke="#dc8650" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="76" cy="124" rx="16" ry="6" fill="#a84c20" />
      <g className="zoo-torso">
        <ellipse cx="70" cy="96" rx="24" ry="30" fill="#c4602c" />
        <ellipse cx="80" cy="100" rx="14" ry="22" fill="#f6e7cf" />
      </g>
      <g className="zoo-head">
        <path d="M92 36 C 92 26, 96 18, 100 12 C 103 22, 106 30, 104 40 Z" fill="#a84c20" />
        <path d="M95 22 C 95 14, 97 8, 100 3 C 104 10, 105 16, 104 24 Z" fill="#4a2414" />
        <circle cx="82" cy="52" r="19" fill="#c4602c" />
        <path d="M68 42 C 66 28, 70 18, 74 10 C 78 20, 82 30, 82 38 Z" fill="#a84c20" />
        <path d="M70 24 C 70 16, 72 10, 74 3 C 78 11, 80 17, 80 26 Z" fill="#4a2414" />
        <ellipse cx="98" cy="58" rx="9" ry="7" fill="#f6e7cf" />
        <circle cx="105" cy="56" r="2.8" fill="#2b1a14" />
        {EYE(91, 49, 3.6)}
        <ellipse cx="92" cy="84" rx="7" ry="5" fill="#c4602c" />
        <ellipse cx="100" cy="80" rx="6" ry="7" fill="#8a5a30" />
        <path d="M96 76 C 98 72, 104 72, 106 76 Z" fill="#6b4220" />
      </g>
    </>
  ),
};

export const base: Record<string, CreatureSpec> = {
  roeDeer,
  redDeer,
  fallowDeer,
  wildBoar,
  fox,
  badger,
  pineMarten,
  hare,
  squirrel,
};
