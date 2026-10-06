// Opgavelab — må en figur skubbes ind på arket under et hjørnetræk? (ren TS, kun `import type`).
//
// SheetEditor.fitOrPush bruger reglen for både mus og tastatur; Node-testene også. Trækkets retning er
// POINTERENS flytning (musen, eller pilens retning) — ikke håndtagets egen bevægelse: et radius-håndtag
// står altid til højre for centrum, så når musen trækkes op, flytter håndtaget sig mod højre, og et skub
// nedad ville se ud til at være "på tværs", selv om figuren gled væk fra musen.

import type { Point } from "../model/types";

/** Et skub MOD trækket må højst tage så stor en del (1 − KEEP_ALONG_DRAG) af håndtagets fremgang langs trækket. */
export const KEEP_ALONG_DRAG = 0.75;

const EPS = 1e-6;

/**
 * @param push forskydningen, der bringer figuren ind inden for margenen (pushIntoSheet)
 * @param ptr pointerens flytning siden trækkets start (tastatur: pilens retning)
 * @param handleMoved håndtagets flytning før skubbet (formændringen og dragVertex' egen forskydning)
 * @param shrinks figuren bliver mindre end ved trækkets start
 * @returns true når skubbet er i orden:
 *  - håndtaget står aldrig (efter skubbet) bag sit udgangspunkt langs trækket;
 *  - skub med trækket og på tværs af det er i orden (cylinderens r mod højre ved topmargenen: figuren
 *    rykker ned);
 *  - et skub mod trækket må højst tage 25 % af håndtagets fremgang langs trækket (en etiket, der bliver
 *    lidt bredere) — ellers stopper formændringen ved margenen, og figuren bliver, hvor den er;
 *  - bliver figuren mindre, må den rykke mod trækket, så længe skubbet pr. akse er mindre end håndtagets
 *    flytning (en etiket, der er bredere end figuren, bliver på arket, og en figur ved margenen kan stadig
 *    gøres mindre).
 */
export function pushAllowed(push: Point, ptr: Point, handleMoved: Point, shrinks: boolean): boolean {
  if (Math.abs(push.x) < EPS && Math.abs(push.y) < EPS) return true;
  const len = Math.hypot(ptr.x, ptr.y);
  if (len < EPS) return false;
  const u = { x: ptr.x / len, y: ptr.y / len };
  // Håndtagets fremgang langs trækket før skubbet, skubbets bidrag og fremgangen efter skubbet.
  const along = handleMoved.x * u.x + handleMoved.y * u.y;
  const pushAlong = push.x * u.x + push.y * u.y;
  if (along + pushAlong < -EPS) return false;
  if (pushAlong >= -EPS) return true;
  if (pushAlong >= -(1 - KEEP_ALONG_DRAG) * Math.max(along, 0) - EPS) return true;
  const smaller = (p: number, h: number) => Math.abs(p) < EPS || Math.sign(p) === Math.sign(h) || Math.abs(p) < Math.abs(h) - EPS;
  return shrinks && smaller(push.x, handleMoved.x) && smaller(push.y, handleMoved.y);
}
