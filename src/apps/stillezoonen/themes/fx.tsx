import type { CSSProperties } from "react";

/**
 * Hjælpere til figurer med særlig opførsel (`special`). Animationerne ligger
 * i zoo.css som zoo-fx-*-klasser; `fx()` giver en gruppe forsinkelse og drejepunkt.
 */

/** Forsinkelse (og evt. drejepunkt) til en zoo-fx-gruppe. */
export const fx = (d: string, origin?: string) =>
  ({ "--d": d, ...(origin ? { transformOrigin: origin } : {}) }) as CSSProperties;

/** Lille node (♪). Nodehovedet sidder i (x, y); `s` skalerer. */
export const NODE = (x: number, y: number, farve: string, s = 1) => (
  <>
    <ellipse cx={x} cy={y} rx={3.4 * s} ry={2.6 * s} transform={`rotate(-20 ${x} ${y})`} fill={farve} />
    <path d={`M${x + 3 * s} ${y - s} v ${-11 * s} q ${4 * s} ${2 * s} ${6 * s} ${6 * s}`} stroke={farve} strokeWidth={1.8 * s} fill="none" strokeLinecap="round" />
  </>
);

/** Firtakket glimt med buede sider (gnist). */
export const GLIMT = (x: number, y: number, r: number, farve = "#fff") => (
  <path d={`M${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill={farve} />
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
  <path d={`M${x} ${y + r * 0.9} C ${x - r * 1.6} ${y - r * 0.2}, ${x - r * 0.6} ${y - r * 1.4}, ${x} ${y - r * 0.4} C ${x + r * 0.6} ${y - r * 1.4}, ${x + r * 1.6} ${y - r * 0.2}, ${x} ${y + r * 0.9} Z`} fill={farve} />
);
