import type { CSSProperties } from "react";

/**
 * Hjælpere til figurer med særlig opførsel (`special`). Animationerne ligger
 * i zoo.css som zoo-fx-*-klasser; `fx()` giver en gruppe forsinkelse og drejepunkt.
 */

/** Afrunder til 2 decimaler, så koordinaterne ikke får lange flydende-komma-haler. */
const t = (v: number) => +v.toFixed(2);

/** Forsinkelse (og evt. drejepunkt) til en zoo-fx-gruppe. */
export const fx = (d: string, origin?: string) =>
  ({ "--d": d, ...(origin ? { transformOrigin: origin } : {}) }) as CSSProperties;

/** Lille node (♪). Nodehovedet sidder i (x, y); `s` skalerer. */
export const NODE = (x: number, y: number, farve: string, s = 1) => (
  <>
    <ellipse cx={x} cy={y} rx={t(3.4 * s)} ry={t(2.6 * s)} transform={`rotate(-20 ${x} ${y})`} fill={farve} />
    <path d={`M${t(x + 3 * s)} ${t(y - s)} v ${t(-11 * s)} q ${t(4 * s)} ${t(2 * s)} ${t(6 * s)} ${t(6 * s)}`} stroke={farve} strokeWidth={t(1.8 * s)} fill="none" strokeLinecap="round" />
  </>
);

/** Firtakket glimt med buede sider (gnist). */
export const GLIMT = (x: number, y: number, r: number, farve = "#fff") => (
  <path d={`M${x} ${t(y - r)} Q ${x} ${y} ${t(x + r)} ${y} Q ${x} ${y} ${x} ${t(y + r)} Q ${x} ${y} ${t(x - r)} ${y} Q ${x} ${y} ${x} ${t(y - r)} Z`} fill={farve} />
);

/** Femtakket stjerne. */
export const STJERNE = (x: number, y: number, r: number, farve: string) => (
  <polygon
    fill={farve}
    points={Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
    }).join(" ")}
  />
);

/** Lille hjerte med midten i (x, y). */
export const HJERTE = (x: number, y: number, r: number, farve: string) => (
  <path d={`M${x} ${t(y + r * 0.9)} C ${t(x - r * 1.6)} ${t(y - r * 0.2)}, ${t(x - r * 0.6)} ${t(y - r * 1.4)}, ${x} ${t(y - r * 0.4)} C ${t(x + r * 0.6)} ${t(y - r * 1.4)}, ${t(x + r * 1.6)} ${t(y - r * 0.2)}, ${x} ${t(y + r * 0.9)} Z`} fill={farve} />
);
