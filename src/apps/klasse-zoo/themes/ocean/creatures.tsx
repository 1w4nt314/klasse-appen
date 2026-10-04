import { EYE } from "../shared";
import type { CreatureSpec } from "../types";

// PLADSHOLDER — erstattes af temaets rigtige figurer.
const placeholder: CreatureSpec = {
  name: "Pladsholder",
  height: 12,
  aspect: 1,
  gait: "walk",
  pace: 1,
  viewBox: "0 0 100 100",
  art: (
    <>
      <g className="zoo-leg zoo-leg-a"><rect x="30" y="70" width="12" height="30" rx="5" fill="#666" /></g>
      <g className="zoo-leg zoo-leg-b"><rect x="58" y="70" width="12" height="30" rx="5" fill="#666" /></g>
      <g className="zoo-torso"><circle cx="50" cy="50" r="30" fill="#999" /></g>
      <g className="zoo-head">{EYE(60, 42)}</g>
    </>
  ),
};

export const creatures: Record<string, CreatureSpec> = { placeholder };
