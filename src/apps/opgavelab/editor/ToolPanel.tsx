"use client";

import { useEffect, useRef } from "react";
import { FIGURES, GROUPS, figuresInGroup } from "../model/figures";
import type { FigureKind } from "../model/types";

export function ToolPanel({
  onAddText,
  onAddFigure,
  onAddDrill,
  onAddFormula,
  full,
}: {
  onAddText: () => void;
  onAddFigure: (kind: FigureKind) => void;
  /** Læg et regneark på arket (seedet laves i handleren). */
  onAddDrill: () => void;
  /** Læg en formelblok på arket. */
  onAddFormula: () => void;
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
      <div className="ol-tool-groups">
        <fieldset className="ol-tool-group" data-ol-group="tekst">
          <legend>Tekst</legend>
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
          </div>
        </fieldset>
        {/* Én gruppe pr. figurgruppe i registry'et (GROUPS i figures/registry.ts); tomme grupper vises ikke. */}
        {GROUPS.map((group) => {
          const kinds = figuresInGroup(group.key);
          if (kinds.length === 0) return null;
          return (
            <fieldset key={group.key} className="ol-tool-group" data-ol-group={group.key}>
              <legend>{group.title}</legend>
              <div className="ol-tool-list">
                {kinds.map((kind) => {
                  const def = FIGURES[kind];
                  return (
                    <button
                      key={kind}
                      type="button"
                      className="ol-tool"
                      data-ol-tool={kind}
                      aria-label={`${def.name} — læg figuren på arket`}
                      onClick={() => onAddFigure(kind)}
                      disabled={full}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        {def.icon()}
                      </svg>
                      {def.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        <fieldset className="ol-tool-group" data-ol-group="regning">
          <legend>Regning</legend>
          <div className="ol-tool-list">
            <button
              type="button"
              className="ol-tool"
              data-ol-tool="drill"
              aria-label="Regneark — læg plus-, minus-, gange- og divisionsstykker på arket"
              onClick={onAddDrill}
              disabled={full}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M4 6h3M5.5 4.5v3M10 6h10M4 12h3M10 12h10M4 18h3M10 18h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              Regneark
            </button>
            <button
              type="button"
              className="ol-tool"
              data-ol-tool="formula"
              aria-label="Formler — skriv dine egne regnestykker, fx 3 · (4 + 5), med facit på svararket"
              onClick={onAddFormula}
              disabled={full}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M3 13h3l3 6 5-14h7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Formler
            </button>
          </div>
        </fieldset>
      </div>
      {full && (
        <p className="ol-hint" role="status">
          Arket er fuldt — slet et objekt for at tilføje flere.
        </p>
      )}
      <details className="ol-help" ref={help} open>
        <summary>Sådan gør du</summary>
        <ol>
          <li>Vælg en figur i grupperne (fx Trekanter), og træk i hjørnerne for at ændre den.</li>
          <li>Skjul eller omdøb en størrelse i panelet (fx A til X).</li>
          <li>Tryk Find X for at få et regnestykke til den skjulte størrelse.</li>
          <li>Regneark (under Regning) laver plus-, minus-, gange- og divisionsstykker med svar på svararket.</li>
          <li>Formler (under Regning): skriv ét stykke pr. linje, fx 3 · (4 + 5) — facit kommer på svararket.</li>
          <li>Eksporter laver opgave og svarark som to PDF-filer.</li>
        </ol>
        <p>Delete sletter, Ctrl+Z fortryder, Esc afmarkerer.</p>
        <p>På en touchskærm: tryk én gang for at markere en figur, og træk den derefter.</p>
      </details>
    </aside>
  );
}
