import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Dino-dalen, almindelige figurer: dino-unger (T. rex, langhals, triceratops),
 * et dinoæg, Dimetrodon, Kæmpeguldsmed, Microraptor og Therizinosaurus.
 * Profil mod højre, fødderne på viewBox'ens bund, fjerne ben først.
 */

const r2 = (v: number) => +v.toFixed(2);

/** Punkt på en ellipse (vinkel i grader, 0 = højre, 90 = ned). */
const ellipsePunkt = (cx: number, cy: number, rx: number, ry: number, grader: number) => {
  const a = (grader * Math.PI) / 180;
  return [r2(cx + rx * Math.cos(a)), r2(cy + ry * Math.sin(a))] as const;
};

/** En fjer som aflang ellipse, der udgår fra (x, y) i retning `grader` med længde `len`. */
const fjer = (
  key: string,
  x: number,
  y: number,
  grader: number,
  len: number,
  bredde: number,
  fill: string,
  glans?: string,
) => {
  const a = (grader * Math.PI) / 180;
  const cx = r2(x + (len / 2) * Math.cos(a));
  const cy = r2(y + (len / 2) * Math.sin(a));
  return (
    <g key={key} transform={`rotate(${grader} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={r2(len / 2)} ry={bredde} fill={fill} />
      {glans && (
        <ellipse cx={r2(cx + len * 0.06)} cy={r2(cy - bredde * 0.35)} rx={r2(len * 0.34)} ry={r2(bredde * 0.28)} fill={glans} />
      )}
    </g>
  );
};

/* ---------- T. rex-unge ---------- */

const babyRex: CreatureSpec = {
  name: "T. rex-unge",
  height: 10,
  aspect: 120 / 104,
  gait: "walk",
  pace: 1.2,
  viewBox: "0 0 120 104",
  art: (
    <>
      <path d="M30 54 C 18 56, 8 64, 2 78 C 12 76, 26 78, 38 84 Z" fill="#7cc36a" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="54" y="78" width="15" height="26" rx="7" fill="#5aa34f" />
        <rect x="54" y="96" width="24" height="8" rx="4" fill="#4a8a42" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="28" y="78" width="15" height="26" rx="7" fill="#5aa34f" />
        <rect x="28" y="96" width="24" height="8" rx="4" fill="#4a8a42" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="50" cy="64" rx="30" ry="22" fill="#7cc36a" />
        <ellipse cx="56" cy="74" rx="20" ry="11" fill="#d6efa6" />
        <ellipse cx="36" cy="46" rx="6" ry="3.5" transform="rotate(-20 36 46)" fill="#5aa34f" />
        <ellipse cx="50" cy="43" rx="6" ry="3.5" fill="#5aa34f" />
        <ellipse cx="63" cy="46" rx="6" ry="3.5" transform="rotate(20 63 46)" fill="#5aa34f" />
        <ellipse cx="14" cy="68" rx="5" ry="3" transform="rotate(-25 14 68)" fill="#5aa34f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="62" y="78" width="16" height="26" rx="7" fill="#7cc36a" />
        <rect x="62" y="96" width="26" height="8" rx="4" fill="#5aa34f" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="36" y="78" width="16" height="26" rx="7" fill="#7cc36a" />
        <rect x="36" y="96" width="26" height="8" rx="4" fill="#5aa34f" />
      </g>
      <g className="zoo-torso">
        {/* bitte arme */}
        <ellipse cx="74" cy="72" rx="8" ry="3.6" transform="rotate(28 74 72)" fill="#5aa34f" />
        <circle cx="80" cy="76" r="2.6" fill="#5aa34f" />
      </g>
      <g className="zoo-head">
        <ellipse cx="86" cy="36" rx="27" ry="25" fill="#7cc36a" />
        <ellipse cx="102" cy="44" rx="17" ry="14" fill="#7cc36a" />
        <ellipse cx="98" cy="54" rx="17" ry="6" fill="#d6efa6" />
        <path d="M84 52 Q 100 60 116 50" stroke="#3d6e3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="113" cy="39" r="1.8" fill="#3d6e3a" />
        <circle cx="80" cy="46" r="5" fill="#f4a6a0" opacity="0.6" />
        <ellipse cx="74" cy="16" rx="5" ry="3" transform="rotate(-30 74 16)" fill="#5aa34f" />
        <ellipse cx="86" cy="12" rx="5" ry="3" fill="#5aa34f" />
        {EYE(92, 31, 8)}
      </g>
    </>
  ),
};

/* ---------- Dinoæg ---------- */

const dinoEgg: CreatureSpec = {
  name: "Dinoæg",
  height: 6,
  aspect: 60 / 72,
  gait: "hop",
  pace: 1.1,
  viewBox: "0 0 60 72",
  art: (
    <>
      <path
        d="M30 2 C 46 2, 57 32, 57 50 C 57 63, 45 70, 30 70 C 15 70, 3 63, 3 50 C 3 32, 14 2, 30 2 Z"
        fill="#f4e7c6"
      />
      <path d="M42 8 C 52 22, 57 38, 57 50 C 57 63, 45 70, 30 70 C 40 62, 46 40, 42 8 Z" fill="#e3d1a2" />
      <circle cx="14" cy="44" r="4.5" fill="#8cc474" />
      <circle cx="22" cy="60" r="3.5" fill="#8cc474" />
      <circle cx="44" cy="58" r="4" fill="#8cc474" />
      <circle cx="35" cy="14" r="3" fill="#8cc474" />
      <circle cx="21" cy="20" r="2.4" fill="#8cc474" />
      <circle cx="49" cy="43" r="2.6" fill="#8cc474" />
      {/* revnen med ungen, der kigger ud */}
      <path
        d="M12 41 L 17 33 L 23 39 L 29 31 L 35 38 L 41 32 L 46 37 L 48 41 C 49 53, 40 57, 30 57 C 20 57, 11 53, 12 41 Z"
        fill="#9ad47c"
      />
      <path
        d="M12 41 L 17 33 L 23 39 L 29 31 L 35 38 L 41 32 L 46 37 L 48 41"
        stroke="#c9b27a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M29 31 L 26 24 L 31 19 L 29 12" stroke="#c9b27a" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="30" cy="54" rx="9" ry="2.6" fill="#7fbf63" />
      {EYE(22, 43, 4.6)}
      {EYE(38, 43, 4.6)}
      <path d="M27 49 Q 30 52 33 49" stroke="#3d6e3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
};

/* ---------- Langhals-unge ---------- */

const babyBrachio: CreatureSpec = {
  name: "Langhals-unge",
  height: 14,
  aspect: 150 / 130,
  gait: "walk",
  pace: 0.8,
  viewBox: "0 0 150 130",
  art: (
    <>
      <path d="M22 88 C 10 90, 4 100, 2 114 C 12 108, 22 106, 34 108 Z" fill="#6fb3c4" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="100" width="18" height="30" rx="8" fill="#4f95a8" />
        <rect x="70" y="122" width="24" height="8" rx="4" fill="#3f7d90" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="28" y="100" width="18" height="30" rx="8" fill="#4f95a8" />
        <rect x="28" y="122" width="24" height="8" rx="4" fill="#3f7d90" />
      </g>
      <g className="zoo-torso">
        <path d="M82 82 C 98 78, 104 58, 108 34" stroke="#6fb3c4" strokeWidth="25" fill="none" strokeLinecap="round" />
        <ellipse cx="56" cy="84" rx="42" ry="28" fill="#6fb3c4" />
        <ellipse cx="62" cy="96" rx="30" ry="14" fill="#d9f0f2" />
        <circle cx="36" cy="68" r="4.5" fill="#4f95a8" />
        <circle cx="52" cy="62" r="5.5" fill="#4f95a8" />
        <circle cx="70" cy="66" r="4.5" fill="#4f95a8" />
        <circle cx="96" cy="52" r="3.2" fill="#4f95a8" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="76" y="100" width="19" height="30" rx="8" fill="#6fb3c4" />
        <rect x="76" y="122" width="26" height="8" rx="4" fill="#4f95a8" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="34" y="100" width="19" height="30" rx="8" fill="#6fb3c4" />
        <rect x="34" y="122" width="26" height="8" rx="4" fill="#4f95a8" />
      </g>
      <g className="zoo-head">
        <ellipse cx="114" cy="26" rx="20" ry="17" fill="#6fb3c4" />
        <ellipse cx="128" cy="32" rx="12" ry="10" fill="#6fb3c4" />
        <ellipse cx="126" cy="38" rx="11" ry="4" fill="#d9f0f2" />
        <circle cx="132" cy="27" r="1.6" fill="#2f6577" />
        <path d="M120 38 Q 130 43 139 36" stroke="#2f6577" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="108" cy="33" r="4.5" fill="#f4a6a0" opacity="0.55" />
        {EYE(117, 21, 7.2)}
      </g>
    </>
  ),
};

/* ---------- Triceratops-unge ---------- */

const FRILL_PRIKKER = [112, 134, 156, 178, 200, 222, 244, 266].map((v) => ellipsePunkt(80, 36, 23, 27, v));

const babyTrice: CreatureSpec = {
  name: "Triceratops-unge",
  height: 8,
  aspect: 120 / 84,
  gait: "walk",
  pace: 1.0,
  viewBox: "0 0 120 84",
  art: (
    <>
      <path d="M18 56 C 8 58, 3 66, 2 76 C 10 72, 18 72, 28 74 Z" fill="#e0a860" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="70" y="62" width="15" height="22" rx="7" fill="#c58540" />
        <rect x="70" y="77" width="21" height="7" rx="3.5" fill="#a96c2e" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="24" y="62" width="15" height="22" rx="7" fill="#c58540" />
        <rect x="24" y="77" width="21" height="7" rx="3.5" fill="#a96c2e" />
      </g>
      <g className="zoo-torso">
        <ellipse cx="48" cy="56" rx="34" ry="20" fill="#e0a860" />
        <ellipse cx="52" cy="66" rx="22" ry="9" fill="#f7dfb0" />
        <circle cx="30" cy="46" r="4" fill="#c58540" />
        <circle cx="44" cy="41" r="4.5" fill="#c58540" />
        <circle cx="58" cy="43" r="3.6" fill="#c58540" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="58" y="62" width="16" height="22" rx="7" fill="#e0a860" />
        <rect x="58" y="77" width="22" height="7" rx="3.5" fill="#c58540" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="32" y="62" width="16" height="22" rx="7" fill="#e0a860" />
        <rect x="32" y="77" width="22" height="7" rx="3.5" fill="#c58540" />
      </g>
      <g className="zoo-head">
        <ellipse cx="80" cy="36" rx="27" ry="30" transform="rotate(-10 80 36)" fill="#d9685c" />
        <ellipse cx="82" cy="38" rx="17" ry="21" transform="rotate(-10 82 38)" fill="#ef8a7a" />
        {FRILL_PRIKKER.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.6" fill="#f5c7a8" />
        ))}
        <ellipse cx="96" cy="54" rx="20" ry="17" fill="#e0a860" />
        <ellipse cx="112" cy="56" rx="9" ry="8" fill="#f3dca0" />
        <path d="M104 44 L 111 34 L 115 46 Z" fill="#f7ecc8" />
        <path d="M89 40 L 93 30 L 99 41 Z" fill="#f7ecc8" />
        <circle cx="90" cy="60" r="4.5" fill="#f4a6a0" opacity="0.55" />
        <path d="M102 63 Q 110 67 117 61" stroke="#8a5a28" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {EYE(99, 51, 6.4)}
      </g>
    </>
  ),
};

/* ---------- Dimetrodon ---------- */

const SEJL_RIBBEN: ReadonlyArray<readonly [number, number]> = [
  [46, 24],
  [58, 14],
  [70, 10],
  [82, 10],
  [94, 14],
  [106, 24],
];

const dimetrodon: CreatureSpec = {
  name: "Dimetrodon",
  height: 10,
  aspect: 170 / 90,
  gait: "walk",
  pace: 0.9,
  viewBox: "0 0 170 90",
  art: (
    <>
      <path d="M36 58 C 20 60, 10 68, 3 82 C 14 78, 28 74, 42 72 Z" fill="#b9a55a" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="98" y="66" width="14" height="24" rx="7" fill="#8f7d3c" />
        <rect x="98" y="82" width="22" height="8" rx="4" fill="#76672f" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="44" y="66" width="14" height="24" rx="7" fill="#8f7d3c" />
        <rect x="44" y="82" width="22" height="8" rx="4" fill="#76672f" />
      </g>
      <g className="zoo-torso">
        <path
          d="M38 56 C 36 30, 50 8, 78 8 C 104 8, 118 30, 120 56 Z"
          fill="#e2784f"
        />
        <path d="M46 56 C 46 36, 58 22, 78 22 C 96 22, 108 36, 112 56 Z" fill="#f2a27c" />
        {SEJL_RIBBEN.map(([x, y], i) => (
          <path
            key={i}
            d={`M${r2(78 + (x - 78) * 0.55)} 56 L ${x} ${y + 3}`}
            stroke="#c9573a"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ))}
        <ellipse cx="80" cy="62" rx="46" ry="18" fill="#b9a55a" />
        <ellipse cx="84" cy="70" rx="32" ry="8" fill="#ecdca2" />
        <ellipse cx="62" cy="50" rx="6" ry="3" fill="#8f7d3c" />
        <ellipse cx="82" cy="48" rx="6" ry="3" fill="#8f7d3c" />
        <ellipse cx="102" cy="51" rx="5" ry="3" fill="#8f7d3c" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="106" y="66" width="15" height="24" rx="7" fill="#b9a55a" />
        <rect x="106" y="82" width="24" height="8" rx="4" fill="#8f7d3c" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="52" y="66" width="15" height="24" rx="7" fill="#b9a55a" />
        <rect x="52" y="82" width="24" height="8" rx="4" fill="#8f7d3c" />
      </g>
      <g className="zoo-head">
        <ellipse cx="130" cy="56" rx="22" ry="16" fill="#b9a55a" />
        <ellipse cx="148" cy="60" rx="16" ry="10" fill="#b9a55a" />
        <ellipse cx="142" cy="67" rx="16" ry="5" fill="#ecdca2" />
        <circle cx="158" cy="56" r="1.8" fill="#5e5222" />
        <path d="M132 66 Q 148 72 162 63" stroke="#5e5222" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="126" cy="62" r="4.5" fill="#f4a6a0" opacity="0.55" />
        {EYE(135, 50, 6.2)}
      </g>
    </>
  ),
};

/* ---------- Kæmpeguldsmed ---------- */

/** Et par vinger (set oppefra) over kroppen; spejles nedenunder. */
const guldsmedVinger = (
  <>
    <path d="M94 46 C 90 24, 76 6, 54 3 C 54 22, 66 40, 92 48 Z" fill="#c9ecf2" opacity="0.82" />
    <path d="M84 47 C 70 32, 48 22, 22 24 C 30 38, 54 48, 82 50 Z" fill="#a9dce8" opacity="0.82" />
    <path d="M93 45 C 84 30, 70 14, 56 6 M86 47 C 66 36, 44 28, 28 27" stroke="#6fb5c6" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="58" cy="9" r="2.6" fill="#3f8a7a" />
  </>
);

const meganeura: CreatureSpec = {
  name: "Kæmpeguldsmed",
  height: 5,
  aspect: 1.5,
  gait: "float",
  zone: "open",
  pace: 1.1,
  viewBox: "0 0 150 100",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.07s" } as React.CSSProperties}>
        {guldsmedVinger}
        <g transform="matrix(1 0 0 -1 0 100)">{guldsmedVinger}</g>
      </g>
      <g className="zoo-torso">
        <ellipse cx="46" cy="50" rx="42" ry="5.5" fill="#2f9c8a" />
        <path d="M24 44.6 V 55.4 M38 44.6 V 55.4 M52 44.6 V 55.4 M66 45 V 55" stroke="#1f7a6c" strokeWidth="2.4" />
        <path d="M6 48 L 0 44 M6 52 L 0 56" stroke="#1f7a6c" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="94" cy="50" rx="14" ry="10" fill="#2f9c8a" />
        <ellipse cx="94" cy="50" rx="6" ry="9" fill="#f2d65b" opacity="0.85" />
      </g>
      <g className="zoo-head">
        <circle cx="116" cy="50" r="14" fill="#2f9c8a" />
        <ellipse cx="120" cy="50" rx="7" ry="8" fill="#6fcdb7" />
        {EYE(118, 42, 5.4)}
        {EYE(118, 58, 5.4)}
        <path d="M126 50 Q 129 52 131 50" stroke="#1f5c50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
};

/* ---------- Microraptor ---------- */

const MR_NAVY = "#26335c";
const MR_BLAA = "#3d5eb0";
const MR_GLANS = "#8fb2ff";

const mrVingeFjer = (x: number, y: number, vinkler: number[], len: number, mork: boolean, pre: string) =>
  vinkler.map((v, i) =>
    fjer(`${pre}${i}`, x, y, v, len - (i % 2) * 3, 5.4, mork ? (i % 2 ? "#1d2748" : MR_NAVY) : i % 2 ? MR_NAVY : MR_BLAA, mork ? undefined : MR_GLANS),
  );

const microraptor: CreatureSpec = {
  name: "Microraptor",
  height: 6,
  aspect: 140 / 90,
  gait: "float",
  zone: "open",
  pace: 1.0,
  viewBox: "0 0 140 90",
  art: (
    <>
      {/* fjerne vinge (arm) */}
      <g className="zoo-wing" style={{ "--flap": "0.5s" } as React.CSSProperties}>
        {mrVingeFjer(76, 38, [198, 214, 230, 246], 44, true, "fv")}
      </g>
      <g className="zoo-torso">
        {/* hale med fjerfane */}
        <path d="M38 46 C 26 50, 16 54, 8 60" stroke={MR_NAVY} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M8 60 L 2 50 L 16 54 L 14 68 Z" fill={MR_BLAA} />
        <path d="M8 60 L 2 50 L 16 54" stroke={MR_GLANS} strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* benfjer (bagvinger) */}
        {[104, 122, 140].map((v, i) => fjer(`bf${i}`, 58, 52, v, 34 - i * 2, 5, i % 2 ? MR_NAVY : MR_BLAA, MR_GLANS))}
        <ellipse cx="62" cy="46" rx="28" ry="13" transform="rotate(-8 62 46)" fill={MR_NAVY} />
        <ellipse cx="68" cy="51" rx="18" ry="6" transform="rotate(-8 68 51)" fill="#c9d6f5" />
        <path d="M44 42 C 54 36, 66 35, 78 38" stroke={MR_GLANS} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M56 78 L 54 84 L 61 83 M62 79 L 62 85 L 68 83" stroke="#e0b24a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* nære vinge (arm) */}
      <g className="zoo-wing" style={{ "--flap": "0.5s" } as React.CSSProperties}>
        {mrVingeFjer(80, 40, [192, 208, 224, 240, 256], 48, false, "nv")}
      </g>
      <g className="zoo-head">
        <circle cx="96" cy="33" r="13" fill={MR_NAVY} />
        <ellipse cx="108" cy="38" rx="9" ry="6" fill={MR_NAVY} />
        <path d="M86 24 C 80 14, 74 12, 70 12 M90 22 C 88 12, 84 8, 80 6" stroke={MR_BLAA} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M104 43 Q 110 46 116 41" stroke="#c9d6f5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="113" cy="35" r="1.4" fill="#c9d6f5" />
        <path d="M89 27 C 94 22, 102 22, 106 26" stroke={MR_GLANS} strokeWidth="2" fill="none" strokeLinecap="round" />
        {EYE(101, 33, 5.2)}
      </g>
    </>
  ),
};

/* ---------- Therizinosaurus ---------- */

const FLOD_PUNKTER = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((v) =>
  ellipsePunkt(80, 108, 52, 42, v),
);

/** Én lang, blød og afrundet kløer — banan-agtig, ikke spids. */
const kloer = (key: string, x: number, y: number, vinkel: number, len: number, farve: string) => (
  <path
    key={key}
    transform={`translate(${x} ${y}) rotate(${vinkel})`}
    d={`M0 -5.5 C ${r2(len * 0.35)} -9, ${r2(len * 0.8)} -6, ${len} 7 C ${len + 2} 11, ${r2(len - 4)} 13, ${r2(len - 7)} 11 C ${r2(len * 0.6)} 3, ${r2(len * 0.3)} 5, 0 5.5 Z`}
    fill={farve}
  />
);

const arm = (pre: string, dx: number, dy: number, fjern: boolean) => (
  <g transform={`translate(${dx} ${dy})`}>
    <path
      d="M108 98 C 118 108, 124 118, 134 126"
      stroke={fjern ? "#b98b52" : "#c9a066"}
      strokeWidth="15"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="136" cy="128" r="9" fill={fjern ? "#d3b27a" : "#e4c68e"} />
    {[8, 30, 52].map((v, i) => kloer(`${pre}${i}`, 142, 130, v, 76 - i * 4, fjern ? "#e6dcb8" : "#f6efd8"))}
  </g>
);

const therizinosaurus: CreatureSpec = {
  name: "Therizinosaurus",
  height: 22,
  aspect: 230 / 190,
  gait: "walk",
  pace: 0.7,
  viewBox: "0 0 230 190",
  art: (
    <>
      <ellipse cx="22" cy="104" rx="21" ry="11" transform="rotate(-15 22 104)" fill="#b98b52" />
      <ellipse cx="12" cy="98" rx="9" ry="6" transform="rotate(-15 12 98)" fill="#f0dcae" />
      <g className="zoo-leg zoo-leg-a">
        <rect x="94" y="130" width="22" height="60" rx="10" fill="#a8814c" />
        <rect x="94" y="180" width="32" height="10" rx="5" fill="#8c6b45" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="52" y="130" width="22" height="60" rx="10" fill="#a8814c" />
        <rect x="52" y="180" width="32" height="10" rx="5" fill="#8c6b45" />
      </g>
      <g className="zoo-torso">{arm("fa", -6, -4, true)}</g>
      <g className="zoo-torso">
        <path d="M104 84 C 118 74, 128 50, 138 24" stroke="#d4aa6c" strokeWidth="21" fill="none" strokeLinecap="round" />
        <path d="M110 86 C 124 76, 134 54, 143 28" stroke="#f0dcae" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="80" cy="108" rx="52" ry="42" fill="#d4aa6c" />
        {FLOD_PUNKTER.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill="#d4aa6c" />
        ))}
        <ellipse cx="94" cy="122" rx="34" ry="28" fill="#f2e0b4" />
        <ellipse cx="50" cy="82" rx="10" ry="6" transform="rotate(-25 50 82)" fill="#b98b52" />
        <ellipse cx="72" cy="72" rx="10" ry="6" fill="#b98b52" />
        <ellipse cx="94" cy="70" rx="9" ry="5.5" transform="rotate(15 94 70)" fill="#b98b52" />
      </g>
      <g className="zoo-leg zoo-leg-b">
        <rect x="102" y="130" width="23" height="60" rx="10" fill="#d4aa6c" />
        <rect x="102" y="180" width="34" height="10" rx="5" fill="#a8814c" />
      </g>
      <g className="zoo-leg zoo-leg-a">
        <rect x="60" y="130" width="23" height="60" rx="10" fill="#d4aa6c" />
        <rect x="60" y="180" width="34" height="10" rx="5" fill="#a8814c" />
      </g>
      <g className="zoo-torso">{arm("na", 0, 0, false)}</g>
      <g className="zoo-head">
        <circle cx="130" cy="30" r="11" fill="#d4aa6c" />
        <ellipse cx="148" cy="17" rx="16" ry="13" fill="#d4aa6c" />
        <ellipse cx="162" cy="22" rx="9" ry="6.5" fill="#f0d9a0" />
        <path d="M153 27 Q 160 31 168 25" stroke="#7a5a30" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M138 8 C 134 0, 128 1, 126 5 M142 5 C 140 -1, 134 -2, 132 1" stroke="#b98b52" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="143" cy="25" r="4.5" fill="#f4a6a0" opacity="0.55" />
        {EYE(151, 14, 5.6)}
      </g>
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  babyRex,
  dinoEgg,
  babyBrachio,
  babyTrice,
  dimetrodon,
  meganeura,
  microraptor,
  therizinosaurus,
};
