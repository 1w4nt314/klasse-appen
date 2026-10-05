import type { CSSProperties } from "react";
import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

/**
 * Flere almindelige svævende og flyvende rumvæsner. Samme stil som
 * creatures.tsx: flade farver, lidt neon, vendt mod højre.
 */

/** Punkterne til en femtakket stjerne (afrundet, så server og klient er enige). */
function stjerne(cx: number, cy: number, ydre: number, indre: number): string {
  const punkter: string[] = [];
  for (let i = 0; i < 10; i++) {
    const vinkel = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? ydre : indre;
    punkter.push(`${+(cx + r * Math.cos(vinkel)).toFixed(2)},${+(cy + r * Math.sin(vinkel)).toFixed(2)}`);
  }
  return punkter.join(" ");
}

/** Lille firetakket glimt. */
function glimt(cx: number, cy: number, s: number): string {
  const t = s * 0.25;
  const p = (x: number, y: number) => `${+x.toFixed(2)} ${+y.toFixed(2)}`;
  return `M${p(cx, cy - s)} L${p(cx + t, cy - t)} L${p(cx + s, cy)} L${p(cx + t, cy + t)} L${p(cx, cy + s)} L${p(cx - t, cy + t)} L${p(cx - s, cy)} L${p(cx - t, cy - t)} Z`;
}

const spaceJelly: CreatureSpec = {
  name: "Rumvandmand",
  height: 14,
  aspect: 100 / 124,
  gait: "float",
  pace: 0.8,
  zone: "open",
  viewBox: "0 0 100 124",
  art: (
    <>
      {/* Bløde fangarme */}
      <path d="M24 60 C 14 76, 34 86, 24 100 C 20 106, 22 112, 26 118" stroke="#5fe3d8" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M62 62 C 72 76, 54 88, 64 102 C 68 108, 66 114, 62 120" stroke="#5fe3d8" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M78 58 C 90 72, 74 84, 82 96 C 85 101, 84 106, 80 110" stroke="#b48cff" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M38 62 C 28 78, 48 88, 40 102 C 37 108, 38 114, 42 122" stroke="#b48cff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M50 64 C 44 80, 58 92, 52 106 C 50 111, 50 115, 52 119" stroke="#ff9fd8" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* Klokken */}
      <path
        d="M8 62 C 4 24, 30 6, 50 6 C 72 6, 96 24, 92 62 Q 82 70, 72 62 Q 62 70, 50 62 Q 38 70, 28 62 Q 18 70, 8 62 Z"
        fill="#b48cff"
        opacity="0.82"
      />
      <path d="M20 58 C 18 30, 34 16, 50 16 C 66 16, 82 30, 80 58 Q 70 62, 60 58 Q 50 64, 40 58 Q 30 62, 20 58 Z" fill="#7fefe6" opacity="0.4" />
      <path d="M22 36 C 26 24, 36 16, 48 14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
      {/* Lysende prikker */}
      <circle cx="26" cy="46" r="3.4" fill="#ffe14d" />
      <circle cx="40" cy="26" r="2.8" fill="#5fe3d8" />
      <circle cx="58" cy="22" r="3" fill="#ff9fd8" />
      <circle cx="34" cy="54" r="2.2" fill="#fff" />
      <circle cx="72" cy="22" r="2.4" fill="#ffe14d" />
      <circle cx="84" cy="38" r="2.8" fill="#5fe3d8" />
      {/* Ansigt */}
      {EYE(56, 40, 4.6)}
      {EYE(74, 40, 4.6)}
      <circle cx="82" cy="50" r="4" fill="#ff9fd8" opacity="0.7" />
      <path d="M60 48 q 6 6 12 0" stroke="#5a2fb0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
};

const miniUfo: CreatureSpec = {
  name: "Mini-UFO",
  height: 8,
  aspect: 120 / 76,
  gait: "float",
  pace: 1.2,
  zone: "open",
  viewBox: "0 0 120 76",
  art: (
    <>
      {/* Lille alien der kigger ud */}
      <path d="M58 24 C 56 16, 58 10, 62 6" stroke="#e85fb0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="5.5" r="3.6" fill="#ffe14d" />
      <circle cx="62" cy="36" r="16" fill="#ff8fd0" />
      <circle cx="54" cy="26" r="2" fill="#f06cb8" />
      <circle cx="56" cy="35" r="7" fill="#fff" />
      <circle cx="71" cy="34" r="7" fill="#fff" />
      {EYE(58, 35, 4.2)}
      {EYE(73, 34, 4.2)}
      <path d="M62 45 q 4 3 8 0" stroke="#b02a7c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Kuppel */}
      <path d="M30 46 C 28 4, 92 4, 90 46 Z" fill="#c5f7ff" opacity="0.28" />
      <path d="M38 34 C 42 20, 52 14, 64 14" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
      {/* Tallerken */}
      <path d="M12 52 C 22 74, 98 74, 108 52 Z" fill="#2fb5ae" />
      <ellipse cx="60" cy="50" rx="56" ry="14" fill="#6fe0d4" />
      <ellipse cx="60" cy="45" rx="42" ry="6.5" fill="#bff5ee" opacity="0.7" />
      {/* Blinkende lys */}
      <circle cx="20" cy="52" r="4.6" fill="#ffe14d" />
      <circle cx="38" cy="58" r="4.6" fill="#ff7ac8" />
      <circle cx="60" cy="61" r="4.6" fill="#ffe14d" />
      <circle cx="82" cy="58" r="4.6" fill="#ff7ac8" />
      <circle cx="100" cy="52" r="4.6" fill="#ffe14d" />
      <circle cx="19" cy="51" r="1.6" fill="#fff" />
      <circle cx="59" cy="60" r="1.6" fill="#fff" />
      <circle cx="99" cy="51" r="1.6" fill="#fff" />
      {/* Små glimt */}
      <path d={glimt(8, 22, 5)} fill="#ffe14d" />
      <path d={glimt(112, 28, 4)} fill="#ff9fd8" />
    </>
  ),
};

const spaceWhale: CreatureSpec = {
  name: "Rumhval",
  height: 18,
  aspect: 180 / 104,
  gait: "float",
  pace: 0.6,
  zone: "open",
  viewBox: "0 0 180 104",
  art: (
    <>
      {/* Stjernestøv fra blæsehullet */}
      <path d="M112 24 C 110 14, 104 10, 98 6 M120 24 C 122 14, 128 10, 134 6" stroke="#8ff0ee" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={glimt(97, 6, 5)} fill="#ffe14d" />
      <path d={glimt(135, 6, 5)} fill="#ffe14d" />
      <path d={glimt(116, 6, 4)} fill="#8ff0ee" />
      {/* Halen med opadvendt finne */}
      <path d="M26 58 C 16 54, 12 46, 13 38 L 25 38 C 27 46, 32 52, 42 58 Z" fill="#2b4fb3" />
      <path d="M19 40 C 12 34, 2 30, 1 18 C 8 20, 14 22, 19 28 C 23 22, 29 20, 36 18 C 35 30, 25 34, 19 40 Z" fill="#8ff0ee" />
      {/* Krop */}
      <path
        d="M20 58 C 24 34, 66 24, 108 26 C 148 28, 172 44, 172 60 C 172 80, 142 92, 100 90 C 66 88, 34 80, 20 58 Z"
        fill="#2b4fb3"
      />
      <path
        d="M40 70 C 70 88, 130 94, 160 76 C 168 70, 172 64, 172 60 C 150 76, 100 78, 40 70 Z"
        fill="#7fa6ff"
      />
      <path d="M52 36 C 70 28, 96 26, 116 28" stroke="#4a73e0" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Stjerner på ryggen */}
      <polygon points={stjerne(60, 40, 6.4, 2.8)} fill="#ffe14d" />
      <polygon points={stjerne(88, 34, 5, 2.2)} fill="#fff" />
      <polygon points={stjerne(112, 38, 6.4, 2.8)} fill="#ff9fd8" />
      <circle cx="74" cy="46" r="1.8" fill="#fff" />
      <circle cx="98" cy="46" r="1.8" fill="#8ff0ee" />
      <circle cx="46" cy="50" r="1.6" fill="#ffe14d" />
      {/* Lys finne */}
      <path d="M92 74 C 82 84, 76 96, 86 102 C 98 100, 110 88, 114 76 Z" fill="#8ff0ee" />
      <path d="M92 78 C 88 86, 86 94, 88 99" stroke="#bff5ee" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ansigt */}
      <circle cx="140" cy="54" r="7.4" fill="#fff" />
      {EYE(142, 54, 4.6)}
      <circle cx="132" cy="68" r="5" fill="#ff9fb8" opacity="0.6" />
      <path d="M144 70 q 10 8 24 -2" stroke="#12276b" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};

const flutterWing: CreatureSpec = {
  name: "Flagrevinge",
  height: 8,
  aspect: 140 / 90,
  gait: "float",
  pace: 1.3,
  zone: "open",
  viewBox: "0 0 140 90",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.25s" } as CSSProperties}>
        {[false, true].map((spejl) => (
          <g key={String(spejl)} transform={spejl ? "matrix(-1 0 0 1 140 0)" : undefined}>
            <path
              d="M54 46 C 44 24, 20 20, 2 30 C 10 36, 10 44, 8 52 C 16 50, 22 54, 22 62 C 30 56, 40 58, 46 66 C 50 60, 54 58, 58 58 Z"
              fill="#6a3fb8"
            />
            <path d="M54 50 C 44 34, 28 30, 14 34 M52 56 C 40 48, 26 46, 16 50" stroke="#a07ae8" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <circle cx="22" cy="44" r="3.2" fill="#ff9fd8" />
            <circle cx="38" cy="52" r="2.6" fill="#ffe14d" />
          </g>
        ))}
      </g>
      {/* Store ører */}
      <path d="M50 38 C 42 20, 46 6, 56 4 C 64 8, 66 22, 66 34 Z" fill="#7a4fc9" />
      <path d="M54 34 C 50 22, 52 14, 56 11 C 60 16, 61 24, 61 32 Z" fill="#ff9fd8" />
      <path d="M90 38 C 98 20, 94 6, 84 4 C 76 8, 74 22, 74 34 Z" fill="#7a4fc9" />
      <path d="M86 34 C 90 22, 88 14, 84 11 C 80 16, 79 24, 79 32 Z" fill="#ff9fd8" />
      {/* Krop */}
      <circle cx="70" cy="52" r="27" fill="#8a5bd8" />
      <ellipse cx="74" cy="62" rx="17" ry="14" fill="#cbb0ff" />
      <path d="M62 78 q -2 8 4 8 M80 78 q 2 8 -4 8" stroke="#6a3fb8" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Ansigt */}
      <circle cx="62" cy="48" r="8.6" fill="#fff" />
      <circle cx="82" cy="48" r="8.6" fill="#fff" />
      {EYE(64, 48, 5.2)}
      {EYE(84, 48, 5.2)}
      <circle cx="94" cy="62" r="4" fill="#ff9fb8" opacity="0.6" />
      <path d="M68 62 q 6 6 12 0" stroke="#4b2a8c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
};

const bubbleAlien: CreatureSpec = {
  name: "Boblevæsen",
  height: 12,
  aspect: 1,
  gait: "float",
  pace: 0.8,
  zone: "open",
  viewBox: "0 0 100 100",
  art: (
    <>
      {/* Lille alien */}
      <path d="M44 31 C 42 24, 38 20, 34 16" stroke="#52b95a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M62 31 C 64 24, 68 20, 72 16" stroke="#52b95a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="15" r="3.8" fill="#ff7ac8" />
      <circle cx="72" cy="15" r="3.8" fill="#ffe14d" />
      <ellipse cx="52" cy="76" rx="14" ry="12" fill="#52b95a" />
      <path d="M40 72 C 32 74, 30 66, 34 62 M64 72 C 72 74, 74 66, 70 62" stroke="#6fd36b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M44 86 q -2 5 3 5 M58 86 q 2 5 -3 5" stroke="#52b95a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="53" cy="50" r="22" fill="#7fe07a" />
      <circle cx="40" cy="56" r="2.6" fill="#6bd066" />
      <circle cx="46" cy="38" r="2.2" fill="#6bd066" />
      <circle cx="53" cy="48" r="7" fill="#fff" />
      <circle cx="69" cy="48" r="7" fill="#fff" />
      {EYE(55, 48, 4.2)}
      {EYE(71, 48, 4.2)}
      <circle cx="73" cy="58" r="3.4" fill="#ff9fb8" opacity="0.6" />
      <path d="M56 60 q 5 5 10 0" stroke="#2f8a3b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Sæbeboblen */}
      <circle cx="50" cy="50" r="46" fill="#c5f7ff" opacity="0.22" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#9fe8ff" strokeWidth="2.6" opacity="0.9" />
      <path d="M18 60 C 14 44, 20 30, 30 22" stroke="#ff9fd8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M82 40 C 86 54, 80 68, 70 76" stroke="#ffe14d" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M26 24 C 32 16, 42 11, 52 10" stroke="#fff" strokeWidth="4.4" fill="none" strokeLinecap="round" opacity="0.9" />
      <circle cx="18" cy="68" r="2.6" fill="#fff" opacity="0.9" />
      {/* Små bobler */}
      <circle cx="93" cy="90" r="5" fill="#c5f7ff" opacity="0.35" stroke="#9fe8ff" strokeWidth="1.6" />
      <circle cx="7" cy="94" r="3" fill="#c5f7ff" opacity="0.35" stroke="#9fe8ff" strokeWidth="1.4" />
    </>
  ),
};

const ringPlanet: CreatureSpec = {
  name: "Ringplanet",
  height: 12,
  aspect: 130 / 76,
  gait: "float",
  pace: 0.7,
  zone: "open",
  viewBox: "0 0 130 76",
  art: (
    <>
      {/* Ringens bagside */}
      <g transform="rotate(-14 65 38)">
        <ellipse cx="65" cy="38" rx="62" ry="12" fill="none" stroke="#5fe3d8" strokeWidth="7" />
        <ellipse cx="65" cy="38" rx="62" ry="12" fill="none" stroke="#bff5ee" strokeWidth="2" />
      </g>
      {/* Planeten */}
      <circle cx="65" cy="38" r="32" fill="#ff9d5c" />
      <path d="M46 16 C 56 11, 74 11, 84 15" stroke="#ffb98a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="46" cy="27" rx="6" ry="2.6" fill="#fff" opacity="0.4" transform="rotate(-40 46 27)" />
      {/* Kratere */}
      <ellipse cx="44" cy="40" rx="6.4" ry="5" fill="#e67c3c" />
      <ellipse cx="44" cy="39" rx="3.6" ry="2.6" fill="#f08a4c" />
      <ellipse cx="54" cy="56" rx="5" ry="3.6" fill="#e67c3c" />
      <ellipse cx="86" cy="54" rx="4.4" ry="3.4" fill="#e67c3c" />
      <ellipse cx="80" cy="16" rx="3.4" ry="2.4" fill="#e67c3c" />
      {/* Ansigt */}
      <circle cx="68" cy="27" r="7.4" fill="#fff" />
      <circle cx="87" cy="27" r="7.4" fill="#fff" />
      {EYE(70, 27, 4.6)}
      {EYE(89, 27, 4.6)}
      <circle cx="94" cy="38" r="3.8" fill="#ff7a8a" opacity="0.55" />
      <path d="M72 38 q 7 6 14 0" stroke="#a8431a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {/* Ringens forside */}
      <g transform="rotate(-14 65 38)">
        <path d="M3 38 A 62 12 0 0 0 127 38" fill="none" stroke="#5fe3d8" strokeWidth="7" />
        <path d="M3 38 A 62 12 0 0 0 127 38" fill="none" stroke="#bff5ee" strokeWidth="2" />
      </g>
    </>
  ),
};

const shootingStar: CreatureSpec = {
  name: "Stjerneskud",
  height: 9,
  aspect: 160 / 66,
  gait: "float",
  pace: 1.3,
  zone: "open",
  viewBox: "0 0 160 66",
  art: (
    <>
      {/* Glitrende hale */}
      <path d="M122 26 C 70 26, 40 18, 4 24 C 36 30, 56 34, 122 38 Z" fill="#ff9fd8" opacity="0.85" />
      <path d="M122 34 C 72 36, 42 40, 6 52 C 44 50, 70 46, 122 44 Z" fill="#5fe3d8" opacity="0.85" />
      <path d="M122 30 C 76 30, 50 30, 14 36 C 52 38, 76 38, 122 38 Z" fill="#ffe14d" opacity="0.9" />
      <path d={glimt(24, 16, 6)} fill="#fff" />
      <path d={glimt(52, 46, 5)} fill="#ffe14d" />
      <path d={glimt(72, 14, 4)} fill="#5fe3d8" />
      <path d={glimt(40, 28, 3.4)} fill="#ff9fd8" />
      <circle cx="12" cy="40" r="2.2" fill="#fff" />
      <circle cx="62" cy="26" r="2" fill="#fff" />
      <circle cx="84" cy="52" r="2.4" fill="#ffe14d" />
      {/* Stjernen */}
      <polygon points={stjerne(127, 35, 29, 15)} fill="#ffd84a" stroke="#ffd84a" strokeWidth="6" strokeLinejoin="round" />
      <polygon points={stjerne(127, 35, 20, 11)} fill="#fff0a0" opacity="0.7" />
      <circle cx="119" cy="33" r="6.4" fill="#fff" />
      <circle cx="135" cy="33" r="6.4" fill="#fff" />
      {EYE(121, 33, 4)}
      {EYE(137, 33, 4)}
      <circle cx="142" cy="42" r="3.2" fill="#ff7a8a" opacity="0.55" />
      <path d="M123 42 q 6 5 12 0" stroke="#c4742a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
};

const jetpackAlien: CreatureSpec = {
  name: "Jetpack-alien",
  height: 13,
  aspect: 110 / 132,
  gait: "float",
  pace: 1,
  zone: "open",
  viewBox: "0 0 110 132",
  art: (
    <>
      {/* Flammer */}
      <path d="M17 106 C 12 116, 18 124, 23 131 C 29 124, 34 116, 29 106 Z" fill="#ff9d1f" />
      <path d="M20 108 C 18 114, 21 120, 23 124 C 26 120, 28 114, 26 108 Z" fill="#ffe14d" />
      <path d="M33 106 C 28 116, 34 124, 39 131 C 45 124, 50 116, 45 106 Z" fill="#ff9d1f" />
      <path d="M36 108 C 34 114, 37 120, 39 124 C 42 120, 44 114, 42 108 Z" fill="#ffe14d" />
      {/* Jetpack */}
      <rect x="11" y="64" width="19" height="44" rx="9" fill="#7a63c9" />
      <rect x="28" y="64" width="19" height="44" rx="9" fill="#9a83e8" />
      <rect x="11" y="78" width="19" height="6" fill="#ffd84a" />
      <rect x="28" y="78" width="19" height="6" fill="#ffd84a" />
      <circle cx="20" cy="70" r="2.6" fill="#ff7ac8" />
      <circle cx="37" cy="70" r="2.6" fill="#5fe3d8" />
      {/* Ben */}
      <rect x="52" y="100" width="11" height="18" rx="5.5" fill="#3e86e0" />
      <rect x="70" y="102" width="11" height="16" rx="5.5" fill="#5aa8ff" />
      <ellipse cx="60" cy="119" rx="9" ry="4" fill="#3e86e0" />
      <ellipse cx="78" cy="119" rx="9" ry="4" fill="#5aa8ff" />
      {/* Krop */}
      <ellipse cx="62" cy="86" rx="24" ry="24" fill="#5aa8ff" />
      <ellipse cx="68" cy="90" rx="13" ry="16" fill="#c4e0ff" />
      <path d="M40 78 C 48 76, 52 82, 52 90" stroke="#ffd84a" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Arm */}
      <path d="M78 82 C 88 82, 94 74, 96 66" stroke="#3e86e0" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="64" r="5" fill="#5aa8ff" />
      {/* Hoved */}
      <path d="M58 14 C 56 8, 54 5, 50 3" stroke="#3e86e0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="49" cy="4" r="4" fill="#ff7ac8" />
      <circle cx="64" cy="40" r="29" fill="#6db6ff" />
      <circle cx="46" cy="46" r="3.2" fill="#4e9cf0" />
      <circle cx="52" cy="26" r="2.6" fill="#4e9cf0" />
      <circle cx="62" cy="38" r="9" fill="#fff" />
      <circle cx="82" cy="38" r="9" fill="#fff" />
      {EYE(64, 38, 5.4)}
      {EYE(84, 38, 5.4)}
      <circle cx="88" cy="52" r="4.2" fill="#ff9fb8" opacity="0.6" />
      <path d="M68 53 q 7 7 14 0" stroke="#1d4f99" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  ),
};

/** Én fjerformet antenne (venstre side); spejles til højre. */
const fjerAntenne = (
  <>
    <path d="M58 32 C 44 28, 36 16, 34 3 C 48 7, 58 18, 62 32 Z" fill="#dff0ff" />
    <path d="M60 32 C 50 24, 42 14, 36 5" stroke="#7fb8f0" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M52 27 l -7 2 M48 22 l -7 3 M44 16 l -6 4 M55 24 l -3 -6 M50 18 l -1 -6" stroke="#7fb8f0" strokeWidth="1.6" strokeLinecap="round" />
  </>
);

/** Venstre vinge (for- og bagvinge med måneprik); spejles til højre. */
const mølVinge = (
  <>
    <path d="M56 48 C 46 12, 14 6, 4 30 C 0 50, 22 62, 56 62 Z" fill="#a8d4ff" />
    <path d="M56 46 C 48 22, 26 16, 14 32 C 12 44, 26 54, 56 56 Z" fill="#d6ebff" />
    <circle cx="26" cy="36" r="9.4" fill="#fff6c9" />
    <circle cx="29" cy="34" r="7.2" fill="#d6ebff" />
    <path d="M56 62 C 34 62, 16 78, 24 94 C 42 98, 56 84, 58 66 Z" fill="#8fc2f5" />
    <circle cx="36" cy="82" r="3" fill="#fff6c9" />
  </>
);

const moonMoth: CreatureSpec = {
  name: "Månemøl",
  height: 9,
  aspect: 130 / 100,
  gait: "float",
  pace: 0.9,
  zone: "open",
  viewBox: "0 0 130 100",
  art: (
    <>
      <g className="zoo-wing" style={{ "--flap": "0.4s" } as CSSProperties}>
        <g>{mølVinge}</g>
        <g transform="matrix(-1 0 0 1 130 0)">{mølVinge}</g>
      </g>
      {/* Fjerantenner */}
      <g>{fjerAntenne}</g>
      <g transform="matrix(-1 0 0 1 130 0)">{fjerAntenne}</g>
      {/* Blød, fnuggede krop */}
      <ellipse cx="65" cy="62" rx="13" ry="24" fill="#f4f9ff" />
      <circle cx="56" cy="74" r="4" fill="#f4f9ff" />
      <circle cx="74" cy="76" r="4" fill="#f4f9ff" />
      <circle cx="65" cy="36" r="15" fill="#f4f9ff" />
      <circle cx="65" cy="46" r="5" fill="#dff0ff" />
      {EYE(61, 35, 3.8)}
      {EYE(73, 35, 3.8)}
      <circle cx="78" cy="42" r="2.6" fill="#ff9fb8" opacity="0.6" />
      <path d="M64 42 q 3 3 6 0" stroke="#5a8fcf" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
};

export const evenMore: Record<string, CreatureSpec> = {
  spaceJelly,
  miniUfo,
  spaceWhale,
  flutterWing,
  bubbleAlien,
  ringPlanet,
  shootingStar,
  jetpackAlien,
  moonMoth,
};
