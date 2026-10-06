import type { Point } from "../model/types";

/** Pointerens position i arkets mm-koordinater (via skærm-CTM, så skalering og scroll håndteres). */
export function toSvg(svg: SVGSVGElement, e: { clientX: number; clientY: number }): Point | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
  return { x: pt.x, y: pt.y };
}
