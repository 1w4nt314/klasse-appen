"use client";

import { memo, useEffect, useRef, useState } from "react";
import { FIGURES, GROUPS, figuresInGroup } from "../model/figures";
import type { FigureKind } from "../model/types";

/** memo: tegnes kun om, når handlerne, "full" eller "waiting" skifter (ikke ved hvert træk-trin). */
export const ToolPanel = memo(function ToolPanel({
  onAddText,
  onAddFigure,
  onAddDrill,
  onAddFormula,
  full,
  waiting = false,
}: {
  onAddText: () => void;
  onAddFigure: (kind: FigureKind) => void;
  /** Læg et regneark på arket (seedet laves i handleren). */
  onAddDrill: () => void;
  /** Læg en formelblok på arket. */
  onAddFormula: () => void;
  /** Arket har nået grænsen for antal objekter. */
  full: boolean;
  /** Arkets font hentes endnu: knapperne venter (placeringen måles med den rigtige font). */
  waiting?: boolean;
}) {
  const off = full || waiting;
  // Hintet vises først, når fonten har været mere end 0,4 s om det (en hurtig indlæsning blinker ikke).
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!waiting) return;
    const t = window.setTimeout(() => setSlow(true), 400);
    return () => window.clearTimeout(t);
  }, [waiting]);
  const help = useRef<HTMLDetailsElement>(null);
  // Hjælpen er åben på brede skærme og lukket på smalle (så arket ikke skubbes ned).
  useEffect(() => {
    if (help.current) help.current.open = !window.matchMedia("(max-width: 900px)").matches;
  }, []);
  return (
    <aside className="ol-tools" aria-label="Værktøjer" aria-busy={waiting || undefined} data-ol-tools-waiting={waiting ? "" : undefined}>
      <h2 className="ol-panel-title">Tilføj</h2>
      {waiting && slow && !full && (
        <p className="ol-hint" role="status" data-ol-fonts-wait="">
          Henter arkets skrifttype …
        </p>
      )}
      <div className="ol-tool-groups">
        <fieldset className="ol-tool-group" data-ol-group="tekst">
          <legend>Tekst</legend>
          <div className="ol-tool-list">
            <button
              type="button"
              className="ol-tool"
              aria-label="Tekst — læg en tekstboks på arket"
              onClick={onAddText}
              disabled={off}
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
                      disabled={off}
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
              disabled={off}
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
              disabled={off}
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
          <li>Vælg en figur, og træk i hjørnerne eller håndtagene.</li>
          <li>Skjul eller omdøb en størrelse i panelet, og tryk Find X for at få et regnestykke.</li>
          <li>Regneark laver regnestykker i flere regningsarter med svar på svararket.</li>
          <li>Formler: skriv ét stykke pr. linje, fx 3 · (4 + 5) — facit kommer på svararket.</li>
          <li>Brug sidebjælken over arket til at tilføje, slette og flytte A4-sider (PageUp/PageDown skifter side).</li>
          <li>Eksporter laver opgave og svarark som to PDF-filer med alle sider.</li>
        </ol>
        <p>Delete sletter, Ctrl+Z fortryder, Esc afmarkerer.</p>
        <p>På en touchskærm: tryk én gang for at markere en figur, og træk den derefter.</p>
      </details>
    </aside>
  );
});
