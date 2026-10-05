import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Småkryb og bunddyr til akvariet: søstjerne, hummer, reje, eremitkrebs,
 * tiarmet blæksprutte, nøgensnegl, ål og axolotl. Alle tegnet i profil mod højre
 * (søstjernen set lidt skråt forfra), bunddyrene med bunden på viewBox'ens bund.
 */

/** Afrunding så server og klient giver samme tal (ingen hydreringsfejl). */
const r2 = (v: number) => +v.toFixed(2);

/* ---------------------------------------------------------------- søstjerne */

const STJERNE_C = [60, 54] as const;
/** Vinkler (grader) for de fem arme: 0 = op, derefter med uret. */
const STJERNE_ARME = [-90, -18, 54, 126, 198];
const STJERNE_LAENGDE = 43;
const STJERNE_SKRAA = 0.9;

const stjerneArm = (vinkel: number, key: string) => {
  const t = (vinkel * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const [cx, cy] = STJERNE_C;
  const tipX = cx + STJERNE_LAENGDE * c;
  const tipY = cy + STJERNE_LAENGDE * STJERNE_SKRAA * s;
  // Basispunkter vinkelret på armen, ved midten.
  const b1x = cx - s * 14;
  const b1y = cy + c * 14 * STJERNE_SKRAA;
  const b2x = cx + s * 14;
  const b2y = cy - c * 14 * STJERNE_SKRAA;
  const prik = (f: number, rad: number) => (
    <circle
      key={`${key}-${f}`}
      cx={r2(cx + (tipX - cx) * f)}
      cy={r2(cy + (tipY - cy) * f)}
      r={rad}
      fill="#c9431c"
    />
  );
  return (
    <g key={key}>
      <path
        d={`M${r2(b1x)} ${r2(b1y)} L ${r2(tipX)} ${r2(tipY)} L ${r2(b2x)} ${r2(b2y)} Z`}
        fill="#f06a2c"
        stroke="#f06a2c"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d={`M${r2(cx + (tipX - cx) * 0.3)} ${r2(cy + (tipY - cy) * 0.3)} L ${r2(tipX)} ${r2(tipY)}`}
        stroke="#ff9a58"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      {prik(0.45, 2.4)}
      {prik(0.68, 2.1)}
      {prik(0.88, 1.7)}
    </g>
  );
};

const starfish: CreatureSpec = {
  name: "Søstjerne",
  height: 6,
  aspect: 120 / 92,
  gait: "walk",
  pace: 0.4,
  zone: "ground",
  viewBox: "0 0 120 92",
  art: (
    <>
      {/* De nederste arme vipper, to og to */}
      <g className="zoo-leg zoo-leg-a">{stjerneArm(STJERNE_ARME[2], "a")}</g>
      <g className="zoo-leg zoo-leg-b">{stjerneArm(STJERNE_ARME[3], "b")}</g>
      <g className="zoo-torso">
        {stjerneArm(STJERNE_ARME[0], "c")}
        {stjerneArm(STJERNE_ARME[1], "d")}
        {stjerneArm(STJERNE_ARME[4], "e")}
        <ellipse cx="60" cy="54" rx="21" ry="19" fill="#f4743a" />
        <ellipse cx="60" cy="47" rx="14" ry="9" fill="#ff9a58" opacity="0.55" />
      </g>
      <g className="zoo-head">
        {EYE(51, 52, 3.8)}
        {EYE(69, 52, 3.8)}
        <path d="M54 61 q 6 5 12 0" stroke="#8f2a10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="60" r="3.6" fill="#ff8aa0" opacity="0.6" />
        <circle cx="77" cy="60" r="3.6" fill="#ff8aa0" opacity="0.6" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------------ hummer */

const HUMMER_BEN = "#1d4352";

const hummerBen = (x: number, key: string, cls: string) => (
  <g key={key} className={`zoo-leg ${cls}`}>
    <path
      d={`M${x} 60 L ${x + 8} 74 L ${x + 3} 87.5`}
      stroke={HUMMER_BEN}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const lobster: CreatureSpec = {
  name: "Hummer",
  height: 9,
  aspect: 190 / 90,
  gait: "walk",
  pace: 0.7,
  zone: "ground",
  viewBox: "0 0 190 90",
  art: (
    <>
      {hummerBen(64, "b1", "zoo-leg-a")}
      {hummerBen(76, "b2", "zoo-leg-b")}
      {hummerBen(88, "b3", "zoo-leg-a")}
      {hummerBen(100, "b4", "zoo-leg-b")}
      <g className="zoo-tail">
        <path d="M24 56 L 4 42 C 0 54 2 66 8 76 L 24 68 Z" fill="#1d4352" />
        <path d="M24 62 L 6 56 M24 62 L 10 70" stroke="#3a7886" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {/* Bageste klo (mørkere) */}
        <path d="M112 54 C 124 62 132 64 140 64" stroke="#1d4352" strokeWidth="8" fill="none" strokeLinecap="round" />
        <g transform="translate(144 64) scale(0.78)">
          <ellipse cx="6" cy="2" rx="14" ry="11" fill="#1d4352" />
          <path d="M4 -8 C 18 -18 34 -12 40 -2 C 30 -6 20 -4 10 2 Z" fill="#1d4352" />
          <path d="M6 8 C 20 6 34 12 36 26 C 28 20 16 18 4 16 Z" fill="#15374a" />
        </g>
        {/* Hale */}
        <path d="M62 38 C 44 36 28 42 20 52 L 22 70 C 34 72 50 70 63 65 Z" fill="#2d5f6e" />
        <path d="M33 44 C 35 52 35 62 33 71 M44 40 C 46 50 46 62 44 71 M54 38 C 56 48 56 60 55 68" stroke="#1d4352" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M22 62 C 34 68 50 66 63 60 L 63 65 C 50 70 34 72 22 70 Z" fill="#8fbcb4" />
        {/* Rygskjold */}
        <path d="M56 46 C 56 28 82 22 104 28 C 120 30 128 40 124 50 C 120 60 100 64 80 64 C 64 64 56 58 56 46 Z" fill="#2d5f6e" />
        <path d="M64 38 C 76 28 98 28 112 34 C 98 34 76 36 64 44 Z" fill="#3a7886" />
        <path d="M60 56 C 80 66 110 64 122 54 C 118 62 100 68 80 68 C 70 68 62 62 60 56 Z" fill="#8fbcb4" opacity="0.8" />
        {/* Store klo (forrest) */}
        <path d="M116 46 C 126 50 134 46 140 40" stroke="#2d5f6e" strokeWidth="10" fill="none" strokeLinecap="round" />
        <g transform="translate(144 36)">
          <path d="M6 8 C 20 6 34 12 36 26 C 28 20 16 18 4 16 Z" fill="#2d5f6e" />
          <path d="M4 -8 C 18 -18 34 -12 40 -2 C 30 -6 20 -4 10 2 Z" fill="#3a7886" />
          <ellipse cx="6" cy="2" rx="14" ry="11" fill="#3a7886" />
          <path d="M-3 -2 C -1 -6 3 -8 7 -8" stroke="#6fb0b8" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      </g>
      <g className="zoo-head">
        <path d="M120 30 C 140 14 162 10 186 6 M122 34 C 146 26 168 20 188 20" stroke="#3a7886" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M114 32 L 116 24" stroke="#1d4352" strokeWidth="3" strokeLinecap="round" />
        <circle cx="117" cy="21" r="6" fill="#fff" />
        {EYE(118, 21, 4)}
        <path d="M106 51 q 5 4 10 0" stroke="#10303d" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="102" cy="55" r="3.4" fill="#ff9a8a" opacity="0.5" />
      </g>
    </>
  ),
};

/* -------------------------------------------------------------------- reje */

const shrimp: CreatureSpec = {
  name: "Reje",
  height: 5,
  aspect: 150 / 76,
  gait: "swim",
  pace: 1.2,
  viewBox: "0 0 150 76",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M17 53 L 35 53 C 38 60 37 68 32 73 L 26 67 L 20 73 C 15 67 14 59 17 53 Z" fill="#f08f92" opacity="0.95" />
        <path d="M26 55 L 21 69 M26 55 L 26 65 M26 55 L 31 69" stroke="#fde0da" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {/* Følehorn */}
        <path d="M102 30 C 118 14 134 12 148 18 M104 34 C 124 30 138 36 146 46" stroke="#e98f92" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Små ben under bugen */}
        <path d="M58 22 l -2 11 M68 23 l -2 11 M78 26 l -1 11 M88 32 l 1 11" stroke="#e98f92" strokeWidth="2.2" strokeLinecap="round" />
        {/* Krop: gennemsigtigt rør med ringe */}
        <path d="M100 38 C 98 14 54 6 36 26 C 26 38 24 46 26 54" stroke="#f6b4b0" strokeWidth="17" fill="none" strokeLinecap="round" opacity="0.94" />
        <path d="M100 38 C 98 14 54 6 36 26 C 26 38 24 46 26 54" stroke="#e98f92" strokeWidth="17" fill="none" strokeDasharray="1.6 9" opacity="0.7" />
        <path d="M98 34 C 96 18 58 12 40 28" stroke="#fde7e2" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* Hoved og næb */}
        <ellipse cx="100" cy="36" rx="11" ry="10" fill="#f6b4b0" />
        <path d="M104 27 L 124 17 L 110 34 Z" fill="#f08f92" />
      </g>
      <g className="zoo-head">
        <circle cx="103" cy="33" r="5.6" fill="#fff" />
        {EYE(104, 33, 3.8)}
        <circle cx="96" cy="42" r="3" fill="#ff8aa0" opacity="0.55" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------- eremitkrebs */

const krabbeBen = (x: number, key: string, cls: string) => (
  <g key={key} className={`zoo-leg ${cls}`}>
    <path
      d={`M${x} 72 L ${x + 3} 80 L ${x + 1} 88`}
      stroke="#c9431c"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const hermitCrab: CreatureSpec = {
  name: "Eremitkrebs",
  height: 7,
  aspect: 126 / 90,
  gait: "walk",
  pace: 0.6,
  zone: "ground",
  viewBox: "0 0 126 90",
  art: (
    <>
      {krabbeBen(78, "k1", "zoo-leg-a")}
      {krabbeBen(88, "k2", "zoo-leg-b")}
      {krabbeBen(98, "k3", "zoo-leg-a")}
      <g className="zoo-torso">
        {/* Krebsen kigger ud af huset */}
        <ellipse cx="86" cy="64" rx="16" ry="13" fill="#e8663a" />
        <ellipse cx="88" cy="70" rx="11" ry="6" fill="#f59a72" opacity="0.6" />
        {/* Kloen */}
        <path d="M98 66 C 106 66 110 60 112 54" stroke="#d4552c" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="114" cy="48" rx="8" ry="7" fill="#e8663a" />
        <path d="M117 40 C 121 40 124 44 123 50 C 120 47 118 46 115 46 Z" fill="#d4552c" />
        {/* Sneglehuset */}
        <circle cx="46" cy="58" r="32" fill="#f4e2c2" />
        <ellipse cx="30" cy="34" rx="16" ry="14" fill="#f4e2c2" transform="rotate(-30 30 34)" />
        <path d="M46 58 a4 4 0 0 1 8 0 a8 8 0 0 1 -16 0 a14 14 0 0 1 28 0 a20 20 0 0 1 -40 0 a26 26 0 0 1 52 0" stroke="#c9683f" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M28 40 a5 5 0 0 1 8 -5 a8 8 0 0 1 -6 12" stroke="#c9683f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M22 62 C 24 78 34 86 46 88" stroke="#fff6e2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        <circle cx="60" cy="38" r="3" fill="#e9a36e" />
        <circle cx="68" cy="52" r="3" fill="#e9a36e" opacity="0.7" />
      </g>
      <g className="zoo-head">
        <path d="M88 52 L 87 42 M96 54 L 99 44" stroke="#c9431c" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="87" cy="38" r="6.4" fill="#fff" />
        <circle cx="99" cy="40" r="6.4" fill="#fff" />
        {EYE(88, 38, 4)}
        {EYE(100, 40, 4)}
        <path d="M91 64 q 5 4 10 0" stroke="#8f2a10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="84" cy="66" r="3.2" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------- tiarmet blæksprutte */

const squid: CreatureSpec = {
  name: "Tiarmet blæksprutte",
  height: 14,
  aspect: 190 / 84,
  gait: "swim",
  pace: 1,
  viewBox: "0 0 190 84",
  art: (
    <>
      <g className="zoo-tail">
        <path d="M2 42 L 26 12 C 36 14 46 22 52 28 Z" fill="#e8795c" />
        <path d="M2 42 L 26 72 C 36 70 46 62 52 56 Z" fill="#e8795c" />
      </g>
      <g className="zoo-torso">
        {/* Arme og to lange fangarme */}
        <g fill="none" strokeLinecap="round" stroke="#e8795c">
          <path d="M112 34 C 128 26 140 28 150 20" strokeWidth="5" />
          <path d="M114 40 C 130 38 146 38 158 34" strokeWidth="5" />
          <path d="M114 46 C 130 48 146 50 156 56" strokeWidth="5" />
          <path d="M112 52 C 126 60 138 64 148 72" strokeWidth="5" />
          <path d="M108 28 C 120 16 132 12 142 10" strokeWidth="5" />
          <path d="M108 58 C 118 70 128 76 138 78" strokeWidth="5" />
          <path d="M112 30 C 134 12 160 12 182 18" strokeWidth="3.4" />
          <path d="M112 56 C 134 72 160 72 182 66" strokeWidth="3.4" />
        </g>
        <ellipse cx="184" cy="18" rx="6.4" ry="4.4" fill="#d9694e" transform="rotate(10 184 18)" />
        <ellipse cx="184" cy="66" rx="6.4" ry="4.4" fill="#d9694e" transform="rotate(-10 184 66)" />
        {/* Kappen */}
        <path d="M6 42 C 30 18 76 12 100 22 L 100 62 C 76 72 30 66 6 42 Z" fill="#f29a7a" />
        <path d="M22 38 C 46 22 74 20 94 28 C 74 27 46 30 22 42 Z" fill="#f9c3a8" opacity="0.85" />
        <path d="M24 46 C 48 58 76 62 98 58 L 100 62 C 76 72 30 66 6 42 Z" fill="#e8795c" opacity="0.55" />
        <g fill="#d9694e">
          <circle cx="40" cy="42" r="3" />
          <circle cx="58" cy="36" r="3.4" />
          <circle cx="74" cy="46" r="3" />
          <circle cx="52" cy="52" r="2.6" />
          <circle cx="88" cy="38" r="2.6" />
        </g>
        <ellipse cx="102" cy="42" rx="14" ry="19" fill="#f08a6c" />
      </g>
      <g className="zoo-head">
        <circle cx="108" cy="38" r="9.5" fill="#fff" />
        {EYE(110, 38, 6.4)}
        <path d="M110 52 q 4 3 8 0" stroke="#a24d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="50" r="3.6" fill="#ff8aa0" opacity="0.55" />
      </g>
    </>
  ),
};

/* ------------------------------------------------------------- nøgensnegl */

const SNEGL_LEDDER = [
  [14, 48, 14, 8],
  [36, 44, 18, 12],
  [62, 42, 20, 14],
  [88, 42, 20, 14],
] as const;

/** En orange "fjer" (cerata) på ryggen, vippet `vinkel` grader. */
const fjer = (x: number, y: number, vinkel: number, key: string) => (
  <g key={key} transform={`translate(${x} ${y}) rotate(${vinkel})`}>
    <path d="M-4.5 2 C -6 -9 -2 -16 0 -19 C 2 -16 6 -9 4.5 2 Z" fill="#ff8f3a" />
    <circle cx="0" cy="-17" r="2.8" fill="#ffd27a" />
  </g>
);

const nudibranch: CreatureSpec = {
  name: "Nøgensnegl",
  height: 4,
  aspect: 130 / 56,
  gait: "slither",
  pace: 0.4,
  zone: "ground",
  viewBox: "0 0 130 56",
  art: (
    <>
      {SNEGL_LEDDER.map(([x, y, rx, ry], i) => (
        <g key={i} className="zoo-seg" style={{ "--i": i } as CSSProperties}>
          {fjer(x - rx * 0.35, y - ry * 0.8, -16, `f1-${i}`)}
          {fjer(x + rx * 0.35, y - ry * 0.85, 14, `f2-${i}`)}
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#8e5bd0" />
          <ellipse cx={x} cy={y + ry * 0.62} rx={rx * 0.9} ry={ry * 0.38} fill="#c9a9f0" />
          <circle cx={x - rx * 0.2} cy={y - ry * 0.1} r={i % 2 === 0 ? 2.2 : 3} fill="#ffd27a" />
        </g>
      ))}
      <g className="zoo-seg zoo-head" style={{ "--i": 4 } as CSSProperties}>
        <path d="M104 31 C 102 22 98 16 96 10 M114 31 C 116 22 120 16 124 10" stroke="#8e5bd0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="96" cy="9" r="3.4" fill="#ff8f3a" />
        <circle cx="124" cy="9" r="3.4" fill="#ff8f3a" />
        <ellipse cx="110" cy="43" rx="17" ry="13" fill="#8e5bd0" />
        <ellipse cx="112" cy="50" rx="14" ry="5.6" fill="#c9a9f0" />
        {EYE(118, 38, 3.4)}
        <path d="M118 46 q 4 3 8 -1" stroke="#4f2a8a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="106" cy="46" r="3" fill="#ff8aa0" opacity="0.55" />
      </g>
    </>
  ),
};

/* ---------------------------------------------------------------------- ål */

const AAL_AB = "M178 32 C 164 32 156 46 136 46 C 116 46 108 22 88 22 C 72 22 66 40 50 40";
const AAL_C1 = "M50 40 C 44 40 40 35 34 32";
const AAL_C2 = "M34 32 C 28 28 22 27 14 28";

const eel: CreatureSpec = {
  name: "Ål",
  height: 6,
  aspect: 200 / 60,
  gait: "swim",
  pace: 1.1,
  viewBox: "0 0 200 60",
  art: (
    <>
      <g className="zoo-tail">
        <path d={AAL_C1} stroke="#566330" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d={AAL_C2} stroke="#566330" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        <path d={AAL_AB} stroke="#6c7a3a" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d={AAL_AB} stroke="#566330" strokeWidth="2.6" fill="none" strokeLinecap="round" transform="translate(0 -4.6)" opacity="0.75" />
        <path d={AAL_AB} stroke="#dfe0a0" strokeWidth="5.2" fill="none" strokeLinecap="round" transform="translate(0 3.4)" />
        <path d="M168 37 C 160 42 155 46 150 42 C 155 35 162 33 168 35 Z" fill="#8c9a4c" />
      </g>
      <g className="zoo-head">
        <ellipse cx="181" cy="32" rx="13" ry="10" fill="#6c7a3a" />
        <ellipse cx="183" cy="37" rx="10" ry="4.6" fill="#dfe0a0" />
        {EYE(185, 28, 3.8)}
        <path d="M186 37 q 3 2.4 6 0" stroke="#3d4a1e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="176" cy="36" r="2.8" fill="#ff9a8a" opacity="0.55" />
      </g>
    </>
  ),
};

/* ----------------------------------------------------------------- axolotl */

/** En gællefjer: stilk fra (bx,by) til (tx,ty) med små fjergrene. */
const gaele = (bx: number, by: number, tx: number, ty: number, key: string, farve: string) => {
  const dx = tx - bx;
  const dy = ty - by;
  const l = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / l;
  const uy = dy / l;
  const px = -uy;
  const py = ux;
  const grene = [0.4, 0.65, 0.9].map((f, i) => {
    const mx = bx + dx * f;
    const my = by + dy * f;
    const len = 5.6 - i * 1.1;
    return `M${r2(mx + px * len + ux * 3)} ${r2(my + py * len + uy * 3)} L ${r2(mx)} ${r2(my)} L ${r2(mx - px * len + ux * 3)} ${r2(my - py * len + uy * 3)}`;
  });
  return (
    <path
      key={key}
      d={`M${bx} ${by} L ${tx} ${ty} ${grene.join(" ")}`}
      stroke={farve}
      strokeWidth="3.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

const molbenX = (x: number, farve: string, key: string, cls: string) => (
  <g key={key} className={`zoo-leg ${cls}`}>
    <path d={`M${x} 58 L ${x + 2} 75`} stroke={farve} strokeWidth="8" fill="none" strokeLinecap="round" />
    <ellipse cx={x + 4} cy="76.6" rx="7" ry="3.4" fill={farve} />
  </g>
);

const axolotl: CreatureSpec = {
  name: "Axolotl",
  height: 7,
  aspect: 152 / 80,
  gait: "walk",
  pace: 0.8,
  zone: "ground",
  viewBox: "0 0 152 80",
  art: (
    <>
      {molbenX(40, "#e48aa4", "l1", "zoo-leg-b")}
      {molbenX(100, "#e48aa4", "l2", "zoo-leg-a")}
      <g className="zoo-tail">
        <path d="M34 50 C 20 34 8 36 2 46 C 6 58 18 64 36 60 Z" fill="#f7b2c4" />
        <path d="M30 50 C 20 42 12 42 8 47" stroke="#fcd5df" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="zoo-torso">
        {/* Gællekrone: fjerneste sæt */}
        {gaele(104, 33, 72, 27, "g1", "#ee7f9c")}
        {gaele(106, 32, 80, 10, "g2", "#ee7f9c")}
        {gaele(108, 31, 96, 2, "g3", "#ee7f9c")}
        <path d="M20 48 C 40 34 90 34 114 38 L 114 66 C 90 70 40 68 20 58 Z" fill="#f7b2c4" />
        <path d="M30 46 C 50 38 88 38 110 41 C 88 42 50 44 32 52 Z" fill="#fcd5df" opacity="0.85" />
        <path d="M26 58 C 50 66 90 68 112 62 L 114 66 C 90 70 40 68 20 58 Z" fill="#e48aa4" opacity="0.5" />
        {molbenX(52, "#f7b2c4", "l3", "zoo-leg-a")}
        {molbenX(112, "#f7b2c4", "l4", "zoo-leg-b")}
      </g>
      <g className="zoo-head">
        <ellipse cx="122" cy="46" rx="28" ry="21" fill="#f7b2c4" />
        <ellipse cx="124" cy="37" rx="17" ry="7" fill="#fcd5df" opacity="0.7" />
        {gaele(116, 33, 88, 29, "g4", "#e2587f")}
        {gaele(118, 32, 98, 12, "g5", "#e2587f")}
        {gaele(121, 31, 114, 3, "g6", "#e2587f")}
        {EYE(135, 38, 4)}
        <path d="M122 51 C 130 62 143 62 149 49" stroke="#a8435e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="144" cy="43" r="1.3" fill="#a8435e" />
        <circle cx="123" cy="55" r="3.8" fill="#ff7a96" opacity="0.5" />
      </g>
    </>
  ),
};

export const yetMore: Record<string, CreatureSpec> = {
  starfish,
  lobster,
  shrimp,
  hermitCrab,
  squid,
  nudibranch,
  eel,
  axolotl,
};
