"use client";

import { useEffect, useRef } from "react";
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
  const help = useRef<HTMLDetailsElement>(null);
  // Hjælpen er åben på brede skærme og lukket på smalle (så arket ikke skubbes ned).
  useEffect(() => {
    if (help.current) help.current.open = !window.matchMedia("(max-width: 900px)").matches;
  }, []);
  return (
    <aside className="ol-tools" aria-label="Værktøjer">
      <h2 className="ol-panel-title">Tilføj</h2>
      <div className="ol-tool-list">
        <button
          type="button"
          className="ol-tool"
          aria-label="Tekst — læg en tekstboks på arket"
          onClick={onAddText}
          disabled={full}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M5 6h14M12 6v13M9 19h6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          Tekst
        </button>
        {(Object.keys(FIGURES) as FigureKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            className="ol-tool"
            aria-label={`${FIGURES[kind].name} — læg figuren på arket`}
            onClick={() => onAddFigure(kind)}
            disabled={full}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 4v16h14L5 4Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d="M5 15h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            {FIGURES[kind].name}
          </button>
        ))}
      </div>
      {full && (
        <p className="ol-hint" role="status">
          Arket er fuldt — slet et objekt for at tilføje flere.
        </p>
      )}
      <details className="ol-help" ref={help} open>
        <summary>Sådan gør du</summary>
        <ol>
          <li>Læg en trekant på arket, og træk i hjørnerne for at ændre den.</li>
          <li>Skjul eller omdøb en størrelse i panelet (fx A til X).</li>
          <li>Tryk Find X for at få et regnestykke til den skjulte størrelse.</li>
          <li>Eksporter laver opgave og svarark som to PDF-filer.</li>
        </ol>
        <p>Delete sletter, Ctrl+Z fortryder, Esc afmarkerer.</p>
      </details>
    </aside>
  );
}
