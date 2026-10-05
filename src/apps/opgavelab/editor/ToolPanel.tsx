"use client";

import { FIGURES } from "../model/figures";
import type { FigureKind } from "../model/types";

export function ToolPanel({
  onAddText,
  onAddFigure,
  full,
}: {
  onAddText: () => void;
  onAddFigure: (kind: FigureKind) => void;
  /** Arket har nået grænsen for antal objekter. */
  full: boolean;
}) {
  return (
    <aside className="ol-tools" aria-label="Værktøjer">
      <h2 className="ol-panel-title">Tilføj</h2>
      <div className="ol-tool-list">
        <button type="button" className="ol-tool" onClick={onAddText} disabled={full}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 6h14M12 6v13M9 19h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          Tekst
        </button>
        {(Object.keys(FIGURES) as FigureKind[]).map((kind) => (
          <button key={kind} type="button" className="ol-tool" onClick={() => onAddFigure(kind)} disabled={full}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 4v16h14L5 4Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d="M5 15h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            {FIGURES[kind].name}
          </button>
        ))}
      </div>
      <p className="ol-hint">
        Klik på et værktøj for at lægge det på arket. Træk i et objekt for at flytte det.
        Delete sletter, Ctrl+Z fortryder.
      </p>
    </aside>
  );
}
