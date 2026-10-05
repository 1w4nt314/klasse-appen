import { useId, type CSSProperties, type ReactNode } from "react";
import type { CreatureSpec } from "./types";

/** Øje med pupil og lille lysglimt. `zoo-eye` blinker via CSS. */
export const EYE = (cx: number, cy: number, r = 3.6) => (
  <g className="zoo-eye">
    <circle cx={cx} cy={cy} r={r} fill="#1d1a17" />
    <circle cx={cx + r * 0.35} cy={cy - r * 0.35} r={r * 0.35} fill="#fff" />
  </g>
);

/**
 * Klipper `children` til formen `form`. Id'et er unikt pr. forekomst (useId),
 * så mange ens figurer på samme side ikke deler — og mister — klippet.
 */
export function Klip({ form, children }: { form: ReactNode; children: ReactNode }) {
  const id = `klip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <>
      <clipPath id={id}>{form}</clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
}

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
