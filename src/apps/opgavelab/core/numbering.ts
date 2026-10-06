// Opgavelab — semi-automatisk nummerering: blokke (figurer og regneark) "1", "2", … efter
// placering (top→bund, venstre→højre), regnestykker "1a", "1b", … pr. figur efter (y, x),
// og opgaverne i et regneark "3a"–"3t" (itemLabel). Fritstående tekst nummereres ikke.
// Samme map bruges til opgave og svarark.
//
// Ingen runtime-imports (kun `import type`).

import type { Bounds, CalcObject, Document, DrillObject, FigureObject } from "../model/types";

/**
 * Rækketolerance i mm. Figurerne sorteres efter top; en ny række starter, når en figurs
 * top ligger MERE end ROW_MM under rækkens første (øverste) figur. Inden for rækken
 * nummereres venstre→højre. Kriteriet er en afstand (ikke en fast bucket-grænse), så et
 * nudge på 1 mm ikke bytter numre på figurer, der tydeligt ligger under hinanden, og
 * rækkens anker er dens øverste figur (ikke den sidst tilføjede), så rækker ikke "kæder"
 * nedad over arket.
 */
export const ROW_MM = 5;

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
 * @param figureBounds bounding box for figuren i ARK-koordinater (mm). Andre blokke (regneark)
 *   placeres efter deres øverste venstre hjørne (x, y).
 * @returns objekt-id → nummer ("1" for figurer og regneark, "1a" for regnestykker).
 */
export function numberDocument(doc: Document, figureBounds: (fig: FigureObject) => Bounds): Map<string, string> {
  const result = new Map<string, string>();
  const blocks = doc.objects
    .map((fig, i) => ({ fig, i }))
    .filter((p): p is { fig: FigureObject | DrillObject; i: number } => p.fig.type === "figure" || p.fig.type === "drill")
    .map(({ fig, i }) => ({ fig, i, b: fig.type === "figure" ? figureBounds(fig) : { minX: fig.x, minY: fig.y, maxX: fig.x, maxY: fig.y } }));
  blocks.sort((p, q) => p.b.minY - q.b.minY || p.b.minX - q.b.minX || p.i - q.i);
  const rows: (typeof blocks)[] = [];
  for (const f of blocks) {
    const row = rows[rows.length - 1];
    if (row && f.b.minY - row[0].b.minY <= ROW_MM) row.push(f);
    else rows.push([f]);
  }
  const ordered = rows.flatMap((row) => row.sort((p, q) => p.b.minX - q.b.minX || p.b.minY - q.b.minY || p.i - q.i));

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
