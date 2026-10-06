// Opgavelab — semi-automatisk nummerering: blokke (figurer, regneark og formelblokke) "1", "2", …
// efter placering (rækker top→bund, i rækken venstre→højre; se ROW_MM), regnestykker "1a", "1b", … pr. figur efter (y, x),
// og opgaverne i et regneark / linjerne i en formelblok "3a"–"3t" (itemLabel). Fritstående tekst nummereres ikke.
// Samme map bruges til opgave og svarark.
//
// Ingen runtime-imports (kun `import type`).

import type { Bounds, CalcObject, Document, DrillObject, FigureObject, FormulaObject } from "../model/types";

/**
 * Rækkeregel. Blokkene sorteres efter top. En blok hører til en række, hvis den står VED SIDEN AF
 * rækkens anker (dens øverste blok):
 *  - toppene ligger højst ROW_MM fra hinanden (så tynde blokke og ens figurer stadig virker), eller
 *  - de overlapper lodret med mindst ROW_OVERLAP af den laveste af de to højder
 *    (en lav figur ved siden af en høj, en cirkel ved siden af en trekant, et regneark ved en figur),
 * og den ikke står over/under (vandret overlap > ROW_OVERLAP af den smalleste bredde) en blok, der
 * allerede er i rækken — så to blokke stablet ved siden af en høj figur får hver sit nummer top→bund.
 * Inden for rækken nummereres venstre→højre — dog aldrig en blok før en blok, der står helt over den
 * (orderRow). Rækkens anker er dens øverste blok (ikke den sidst
 * tilføjede), så rækker ikke "kæder" nedad over arket, og et ryk på 1 mm bytter ikke numre på
 * rækker, der tydeligt ligger under hinanden.
 */
export const ROW_MM = 5;
export const ROW_OVERLAP = 0.5;

/** Opgavernes linjeafstand og skriftstørrelse i regneark/formelblokke (som render/drillLayout.ts). */
const EST_ROW_MM = 11;
const EST_LINE_MM = (12 * 25.4) / 72;

/**
 * Regnearkets/formelblokkens udstrækning uden tekstmåling (bruges, når kalderen ikke giver
 * layoutets rigtige boks): titel + rækker · linjeafstand, bredden som blokkens bredde.
 */
export function estimateBlockBounds(o: DrillObject | FormulaObject): Bounds {
  const title = (o.type === "drill" ? o.config.title : o.title).trim() !== "";
  const rows =
    o.type === "drill"
      ? Math.max(1, Math.ceil(Math.max(0, o.config.count) / Math.max(1, o.config.columns)))
      : Math.max(1, o.lines.filter((l) => l.trim() !== "").length);
  const h = (title ? EST_LINE_MM * 1.25 + 3 : 0) + (rows - 1) * EST_ROW_MM + EST_LINE_MM * 1.25;
  return { minX: o.x, minY: o.y, maxX: o.x + o.width, maxY: o.y + h };
}

const overlapY = (a: Bounds, b: Bounds) => Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY);
const overlapX = (a: Bounds, b: Bounds) => Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);

/** Står b ved siden af ankeret a (samme række)? */
function besides(a: Bounds, b: Bounds): boolean {
  if (b.minY - a.minY <= ROW_MM) return true;
  const ov = overlapY(a, b);
  return ov > 0 && ov >= ROW_OVERLAP * Math.min(a.maxY - a.minY, b.maxY - b.minY);
}

/** Står a og b over/under hinanden (i samme spalte)? */
function stacked(a: Bounds, b: Bounds): boolean {
  const ov = overlapX(a, b);
  return ov > 0 && ov > ROW_OVERLAP * Math.min(a.maxX - a.minX, b.maxX - b.minX);
}

/**
 * Rækkefølgen i en række: venstre→højre, men en blok kommer aldrig før en blok, der står helt OVER den
 * (bunden over dens top). Ved siden af en høj figur kan en blok øverst til højre og en mindre blok
 * længere nede i midten være i samme række; så læses den øverste først (som en lærer læser arket),
 * selv om den nederste står lidt længere til venstre.
 */
function orderRow<B extends { b: Bounds; i: number }>(row: B[]): B[] {
  const left = [...row].sort((p, q) => p.b.minX - q.b.minX || p.b.minY - q.b.minY || p.i - q.i);
  const out: B[] = [];
  while (left.length > 0) {
    // Første (venstre→højre), som ingen af de resterende står over. Findes altid: den med mindst top.
    const k = left.findIndex((f) => !left.some((m) => m !== f && m.b.maxY <= f.b.minY));
    out.push(left.splice(k < 0 ? 0 : k, 1)[0]);
  }
  return out;
}

/** 0 → "a", 25 → "z", 26 → "aa", 27 → "ab", … */
export function letters(index: number): string {
  let n = Math.max(0, Math.floor(index)) + 1;
  let out = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    out = String.fromCharCode(97 + r) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

/**
 * Etiketten på opgave nr. i (0-baseret) i blok nr: højst 26 opgaver → "3a" … "3z",
 * ellers "3.1" … "3.40" (samme på opgave og svarark).
 */
export function itemLabel(nr: string, i: number, count: number): string {
  return count <= 26 ? nr + letters(i) : `${nr}.${i + 1}`;
}

/**
 * @param figureBounds bounding box for figuren i ARK-koordinater (mm).
 * @param blockBounds regnearkets/formelblokkens udstrækning på arket (layoutets boks); udeladt →
 *   estimateBlockBounds (uden tekstmåling).
 * @returns objekt-id → nummer ("1" for figurer og blokke, "1a" for regnestykker).
 */
export function numberDocument(
  doc: Document,
  figureBounds: (fig: FigureObject) => Bounds,
  blockBounds: (o: DrillObject | FormulaObject) => Bounds = estimateBlockBounds,
): Map<string, string> {
  const result = new Map<string, string>();
  const blocks = doc.objects
    .map((fig, i) => ({ fig, i }))
    .filter(
      (p): p is { fig: FigureObject | DrillObject | FormulaObject; i: number } =>
        p.fig.type === "figure" || p.fig.type === "drill" || p.fig.type === "formula",
    )
    .map(({ fig, i }) => ({ fig, i, b: fig.type === "figure" ? figureBounds(fig) : blockBounds(fig) }));
  blocks.sort((p, q) => p.b.minY - q.b.minY || p.b.minX - q.b.minX || p.i - q.i);
  const rows: (typeof blocks)[] = [];
  for (const f of blocks) {
    // Første række (øverst), hvis anker f står ved siden af, og hvor f ikke står over/under en anden blok.
    const row = rows.find((r) => besides(r[0].b, f.b) && !r.some((m) => stacked(m.b, f.b)));
    if (row) row.push(f);
    else rows.push([f]);
  }
  const ordered = rows.flatMap(orderRow);

  const calcs = new Map<string, { calc: CalcObject; i: number }[]>();
  doc.objects.forEach((o, i) => {
    if (o.type !== "calc") return;
    const list = calcs.get(o.figureId);
    if (list) list.push({ calc: o, i });
    else calcs.set(o.figureId, [{ calc: o, i }]);
  });

  ordered.forEach(({ fig }, n) => {
    const nr = String(n + 1);
    result.set(fig.id, nr);
    const list = calcs.get(fig.id);
    if (!list) return;
    list.sort((p, q) => p.calc.y - q.calc.y || p.calc.x - q.calc.x || p.i - q.i);
    list.forEach(({ calc }, k) => result.set(calc.id, nr + letters(k)));
  });
  return result;
}
