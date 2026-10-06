// Opgavelab — fælles etiketter og vinkelbuer for trekanter (retvinklet og fri): hjørnenavne,
// vinkelværdier, sidetekster og vinkelbuer. Parametriseret med hjørner, sider, vinkelværdier og
// en callback for størrelsen af det mærke (vinkelbue eller retvinkelkvadrat), vinkelværdien skal
// holde sig fri af. Importerer kun render/primitives, model/* og figures/shared (ikke registry'et).

import { FMT } from "../core/format";
import { displayName } from "../model/params";
import type { ParamState, Point } from "../model/types";
import { INK, LABEL_GAP, add, besides, labelBox, r2, sub, unit } from "../render/primitives";
import type { Measure } from "../render/textLayout";
import { paramShow, sideLabel } from "./shared";
import type { Label, SheetMode } from "./types";

export type Corner = "A" | "B" | "C";
export const CORNERS: readonly Corner[] = ["A", "B", "C"];

/** mm mellem hjørnenavn og vinkelværdi, når værdien står udenfor. */
const OUTSIDE_GAP = 1.6;

/** Radius af vinkelbuen ved v mellem p og q: højst `radius`, og højst 40 % af den korteste side. */
export function arcRadius(v: Point, p: Point, q: Point, radius: number): number {
  return Math.min(radius, 0.4 * Math.min(Math.hypot(p.x - v.x, p.y - v.y), Math.hypot(q.x - v.x, q.y - v.y)));
}

/** Path-data for vinkelbuen ved v mellem retningerne mod p og q. */
export function arcPath(v: Point, p: Point, q: Point, radius: number): string {
  const u = unit(sub(p, v));
  const w = unit(sub(q, v));
  const r = arcRadius(v, p, q, radius);
  const s = add(v, u, r);
  const e = add(v, w, r);
  const sweep = u.x * w.y - u.y * w.x > 0 ? 1 : 0;
  return `M ${r2(s.x)} ${r2(s.y)} A ${r2(r)} ${r2(r)} 0 0 ${sweep} ${r2(e.x)} ${r2(e.y)}`;
}

/** En side: nøgle (a, b, c), endepunkterne og hjørnet overfor (etiketten står væk fra det). */
export type TriangleSide = { key: string; p: Corner; q: Corner; opp: Corner };

export type TriangleLabelOpts = {
  /** Figuren (parametre: synlighed og alias). */
  fig: { params: Record<string, ParamState> };
  mode: SheetMode;
  measure: Measure;
  /** Svararkets facit for skjulte parametre (param → værdi). */
  solved: Record<string, number>;
  /** Hjørnernes placering (lokale mm). */
  v: Record<Corner, Point>;
  /** Sidernes nøgler og endepunkter. */
  sides: readonly TriangleSide[];
  /** Figurens egne værdier (cm og grader): vinkelværdierne styrer placeringen; sider og vinkler vises herfra. */
  values: Record<string, number>;
  /**
   * Hvor langt (mm) fra hjørnet mærket ved vinklen rækker (vinkelbue eller retvinkelkvadrat),
   * så vinkelværdien kan holde sig fri. `shown`: vises vinklen (retvinkelmærket tegnes kun da).
   * `p`, `q`: de to andre hjørner. Udeladt: vinkelbuens radius (5 mm).
   */
  markRadius?: (k: Corner, shown: boolean, p: Point, q: Point) => number;
};

/**
 * Etiketterne for en trekant, i rækkefølgen hjørnenavn + vinkelværdi pr. hjørne (A, B, C), derefter
 * sidetekster. Svararket: skjulte parametre vises med facit i BRAND; geometrien (fx vinkelværdiens
 * placering) bruger altid figurens egne værdier.
 */
export function triangleLabels(o: TriangleLabelOpts): Label[] {
  const { fig, measure, v, values } = o;
  const show = paramShow(fig, o.mode, values, o.solved);
  const out: Label[] = [];
  const neighbors: Record<Corner, [Point, Point]> = {
    A: [v.B, v.C],
    B: [v.A, v.C],
    C: [v.A, v.B],
  };

  // Sidetekster og hjørnenavne placeres først, så vinkelværdier uden for figuren kan undgå dem.
  const sideLabels: Label[] = [];
  for (const s of o.sides) {
    const name = displayName(fig, s.key);
    const text = show.shown(s.key) ? `${name} = ${FMT.len(show.value(s.key))}` : name;
    const sl = sideLabel(v[s.p], v[s.q], v[s.opp], text, measure);
    sideLabels.push({
      key: `side${s.key}`,
      text,
      c: sl.c,
      hw: sl.hw,
      hh: sl.hh,
      fill: show.color(s.key),
      data: { "data-ol-param": s.key },
      dir: sl.dir,
      n: sl.n,
    });
  }
  const nameLabels = {} as Record<Corner, { label: Label; bis: Point; nb: { hw: number; hh: number } }>;
  for (const k of CORNERS) {
    const [p, q] = neighbors[k];
    // Vinkelhalveringslinjen ind i trekanten; hjørnenavnet står modsat (udad).
    const bis = unit(add(unit(sub(p, v[k])), unit(sub(q, v[k]))));
    const name = displayName(fig, k);
    const nb = labelBox(name, measure, true);
    const outward = { x: -bis.x, y: -bis.y };
    nameLabels[k] = {
      bis,
      nb,
      label: {
        key: `name${k}`,
        text: name,
        c: besides(v[k], outward, 1.6, nb.hw, nb.hh),
        ...nb,
        bold: true,
        fill: INK,
        data: { "data-ol-name": k },
      },
    };
  }
  // Små figurer: en sideetiket, der rammer et hjørnenavn, glider det mindste stykke langs siden.
  const overlaps = (a: Label, c: Point, b: Label) =>
    Math.abs(c.x - b.c.x) < a.hw + b.hw + 1.2 && Math.abs(c.y - b.c.y) < a.hh + b.hh + 0.6;
  for (const sl of sideLabels) {
    const names = CORNERS.map((k) => nameLabels[k].label);
    if (!sl.dir || !names.some((nl) => overlaps(sl, sl.c, nl))) continue;
    const dir = sl.dir;
    let moved = false;
    search: for (let t = 0.5; t <= 8; t += 0.5) {
      for (const sgn of [1, -1]) {
        const at = add(sl.c, dir, sgn * t);
        if (!names.some((nl) => overlaps(sl, at, nl))) {
          sl.c = at;
          moved = true;
          break search;
        }
      }
    }
    // Er etiketten bredere end siden, rykkes den i stedet længere væk fra figuren.
    if (!moved && sl.n) {
      for (let t = 0.5; t <= 8; t += 0.5) {
        const at = add(sl.c, sl.n, t);
        if (!names.some((nl) => overlaps(sl, at, nl))) {
          sl.c = at;
          break;
        }
      }
    }
  }
  const obstacles: Label[] = [...sideLabels, ...CORNERS.map((k) => nameLabels[k].label)];

  for (const k of CORNERS) {
    const [p, q] = neighbors[k];
    const { bis, nb, label: nameLabel } = nameLabels[k];
    out.push(nameLabel);

    if (!show.shown(k)) continue;
    // Vinkelværdien står på halveringslinjen så langt inde, at boksen hverken rammer
    // siderne, vinkelbuen eller retvinkel-kvadratet.
    const text = FMT.ang(show.value(k));
    const { hw, hh } = labelBox(text, measure);
    const along = Math.abs(bis.x) * hw + Math.abs(bis.y) * hh;
    const across = Math.abs(bis.y) * hw + Math.abs(bis.x) * hh;
    const theta = (values[k] * Math.PI) / 360; // halv vinkel
    const dSides = along + (LABEL_GAP + across * Math.cos(theta)) / Math.max(Math.sin(theta), 0.02);
    const inner = o.markRadius ? o.markRadius(k, show.shown(k), p, q) : arcRadius(v[k], p, q, 5);
    const dInner = along + inner + 0.6;
    const minSide = Math.min(Math.hypot(p.x - v[k].x, p.y - v[k].y), Math.hypot(q.x - v[k].x, q.y - v[k].y));
    const want = Math.max(dSides, dInner);
    let c: Point;
    if (want <= 0.6 * minSide) {
      c = add(v[k], bis, want);
    } else {
      // Ikke plads inde i vinklen (små figurer): værdien står udenfor på samme linje som
      // hjørnenavnet, helst lige til højre for det ("A  53,1°"), ellers til venstre.
      const nameC = nameLabel.c;
      const right = { x: nameC.x + nb.hw + OUTSIDE_GAP + hw, y: nameC.y };
      const left = { x: nameC.x - nb.hw - OUTSIDE_GAP - hw, y: nameC.y };
      const hits = (at: Point) =>
        obstacles.some(
          (ob) => ob !== nameLabel && Math.abs(at.x - ob.c.x) < hw + ob.hw + 0.3 && Math.abs(at.y - ob.c.y) < hh + ob.hh + 0.3,
        );
      c = !hits(right) || hits(left) ? right : left;
    }
    const angle: Label = { key: `ang${k}`, text, c, hw, hh, fill: show.color(k), data: { "data-ol-param": k } };
    out.push(angle);
    obstacles.push(angle);
  }
  out.push(...sideLabels);
  return out;
}
