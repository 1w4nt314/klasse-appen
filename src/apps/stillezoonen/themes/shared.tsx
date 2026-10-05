import type { CSSProperties } from "react";
import type { CreatureSpec } from "./types";

/** Øje med pupil og lille lysglimt. `zoo-eye` blinker via CSS. */
export const EYE = (cx: number, cy: number, r = 3.6) => (
  <g className="zoo-eye">
    <circle cx={cx} cy={cy} r={r} fill="#1d1a17" />
    <circle cx={cx + r * 0.35} cy={cy - r * 0.35} r={r * 0.35} fill="#fff" />
  </g>
);

export function CreatureArt({
  spec,
  className,
  style,
  pose = "normal",
}: {
  spec: CreatureSpec;
  className?: string;
  style?: CSSProperties;
  /** "special": figurens særlige opførsel (hvis den har en). */
  pose?: "normal" | "special";
}) {
  return (
    <svg
      viewBox={spec.viewBox}
      className={className}
      style={style}
      role="img"
      aria-label={spec.name}
      overflow="visible"
    >
      {pose === "special" && spec.special ? spec.special : spec.art}
    </svg>
  );
}
