"use client";

// Simpelt skelet — punkt 5 bygger egenskabspanelet ud (synlighed, navne, Find …).

import { FMT } from "../core/format";
import { displayName, getFigureDef } from "../model/figures";
import type { Document as SheetDoc, SheetObject } from "../model/types";
import type { ObjectPatch } from "./useDocument";

export function PropertiesPanel({
  doc,
  selected,
  onUpdate,
  onRemove,
}: {
  doc: SheetDoc;
  selected: SheetObject | null;
  onUpdate: (id: string, patch: ObjectPatch, key?: string) => void;
  onRemove: (id: string) => void;
}) {
  if (!selected) {
    return (
      <aside className="ol-props" aria-label="Egenskaber">
        <h2 className="ol-panel-title">Egenskaber</h2>
        <p className="ol-hint">Intet er valgt. Klik på et objekt på arket, eller tilføj et fra værktøjerne.</p>
      </aside>
    );
  }
  const def = selected.type === "figure" ? getFigureDef(selected.figure) : null;
  const values = selected.type === "figure" && def ? def.compute(selected.shape) : null;
  const title = selected.type === "text" ? "Tekst" : selected.type === "figure" ? (def?.name ?? "Figur") : "Regnestykke";
  return (
    <aside className="ol-props" aria-label="Egenskaber">
      <h2 className="ol-panel-title">{title}</h2>
      {selected.type === "text" && (
        <label className="ol-field">
          <span>Tekst</span>
          <textarea
            rows={5}
            maxLength={2000}
            value={selected.text}
            onChange={(e) => onUpdate(selected.id, { text: e.target.value }, `text:${selected.id}`)}
          />
        </label>
      )}
      {selected.type === "figure" && def && values && (
        <table className="ol-values">
          <tbody>
            {def.params.map((p) => (
              <tr key={p.key}>
                <th scope="row">{displayName(selected, p.key)}</th>
                <td>{p.kind === "angle" ? FMT.ang(values[p.key]) : FMT.len(values[p.key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selected.type === "calc" && (
        <p className="ol-hint">Regnestykke for {selected.param} (se figuren).</p>
      )}
      <button type="button" className="ol-btn ol-btn-danger" onClick={() => onRemove(selected.id)}>
        Slet
      </button>
      <p className="ol-hint">Objekter på arket: {doc.objects.length}</p>
    </aside>
  );
}
