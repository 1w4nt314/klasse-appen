"use client";

// Opgavelab — egenskabspanelet: parametertabel (live-værdi, Vis, Navn, Find …),
// advarsler, regnestykke-visning og sletning.

import { FMT } from "../core/format";
import {
  calcProblem,
  displayName,
  getFigureDef,
  solveParam,
  visibleParams,
} from "../model/figures";
import type {
  CalcObject,
  DocSettings,
  Document as SheetDoc,
  FigureObject,
  ParamState,
  SheetObject,
} from "../model/types";
import { ConfirmDelete } from "./ConfirmDelete";
import type { ObjectPatch } from "./useDocument";

export const ALIAS_MAX = 6;

export function PropertiesPanel({
  doc,
  selected,
  numbering,
  askDelete,
  onUpdate,
  onSetParam,
  onAddCalc,
  onSelect,
  onRequestDelete,
  onCancelDelete,
  onRemove,
  onSettings,
}: {
  doc: SheetDoc;
  selected: SheetObject | null;
  numbering: ReadonlyMap<string, string>;
  /** Id på det objekt, der venter på sletbekræftelse. */
  askDelete: string | null;
  onUpdate: (id: string, patch: ObjectPatch, key?: string) => void;
  onSetParam: (id: string, param: string, patch: Partial<ParamState>, key?: string) => void;
  onAddCalc: (figureId: string, param: string) => void;
  onSelect: (id: string | null) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onRemove: (id: string) => void;
  onSettings: (patch: Partial<DocSettings>) => void;
}) {
  if (!selected) {
    return (
      <aside className="ol-props" aria-label="Egenskaber">
        <p className="sr-only" aria-live="polite" data-ol-announce="">
          Intet er valgt.
        </p>
        <h2 className="ol-panel-title">Egenskaber</h2>
        <p className="ol-hint">Intet er valgt. Klik på et objekt på arket, eller tilføj et fra værktøjerne.</p>
      </aside>
    );
  }
  const def = selected.type === "figure" ? getFigureDef(selected.figure) : null;
  const title =
    selected.type === "text"
      ? "Tekst"
      : selected.type === "figure"
        ? `${def?.name ?? "Figur"}${numbering.get(selected.id) ? ` ${numbering.get(selected.id)}` : ""}`
        : `Regnestykke ${numbering.get(selected.id) ?? ""}`.trim();

  const calcs = selected.type === "figure" ? doc.objects.filter((o): o is CalcObject => o.type === "calc" && o.figureId === selected.id) : [];
  const confirming = askDelete === selected.id;

  return (
    <aside className="ol-props" aria-label="Egenskaber" data-ol-panel={selected.type}>
      <p className="sr-only" aria-live="polite" data-ol-announce="">
        {`Valgt: ${title}. Tryk Escape for at afmarkere.`}
      </p>
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
      {selected.type === "figure" && def && (
        <FigureSection
          fig={selected}
          doc={doc}
          calcs={calcs}
          numbering={numbering}
          onSetParam={onSetParam}
          onAddCalc={onAddCalc}
          onSelect={onSelect}
          onSettings={onSettings}
        />
      )}
      {selected.type === "calc" && <CalcSection calc={selected} doc={doc} onSelect={onSelect} />}

      {confirming ? (
        <ConfirmDelete
          question={`Slet figuren og dens ${calcs.length} ${calcs.length === 1 ? "regnestykke" : "regnestykker"}?`}
          onConfirm={() => onRemove(selected.id)}
          onCancel={onCancelDelete}
        />
      ) : (
        <button
          type="button"
          className="ol-btn ol-btn-danger"
          data-ol-delete=""
          onClick={() => (selected.type === "figure" && calcs.length > 0 ? onRequestDelete(selected.id) : onRemove(selected.id))}
        >
          {selected.type === "figure" ? "Slet figur" : selected.type === "calc" ? "Slet regnestykke" : "Slet"}
        </button>
      )}
      <p className="ol-hint">Objekter på arket: {doc.objects.length}</p>
    </aside>
  );
}

function FigureSection({
  fig,
  doc,
  calcs,
  numbering,
  onSetParam,
  onAddCalc,
  onSelect,
  onSettings,
}: {
  fig: FigureObject;
  doc: SheetDoc;
  calcs: CalcObject[];
  numbering: ReadonlyMap<string, string>;
  onSetParam: (id: string, param: string, patch: Partial<ParamState>, key?: string) => void;
  onAddCalc: (figureId: string, param: string) => void;
  onSelect: (id: string | null) => void;
  onSettings: (patch: Partial<DocSettings>) => void;
}) {
  const def = getFigureDef(fig.figure);
  if (!def) return null;
  const values = def.compute(fig.shape);
  const vis = visibleParams(fig);
  const problems = calcs
    .map((c) => ({ calc: c, text: calcProblem(fig, c.param, doc.settings) }))
    .filter((p): p is { calc: CalcObject; text: string } => p.text !== null);
  const sortedCalcs = [...calcs].sort((p, q) => (numbering.get(p.id) ?? "").localeCompare(numbering.get(q.id) ?? ""));

  return (
    <>
      <table className="ol-values">
        <caption className="sr-only">Størrelser: værdi, vis på opgavearket, navn og Find</caption>
        <tbody>
          {def.params.map((p) => {
            const key = p.key;
            const st = fig.params[key] ?? { visible: true };
            const name = displayName(fig, key);
            const existing = calcs.find((c) => c.param === key);
            const reason = vis.has(key)
              ? `Skjul ${name} først — den, der skal findes, må ikke stå på opgavearket`
              : existing
                ? `Der er allerede et regnestykke for ${name}`
                : null;
            return (
              <tr key={key} data-ol-param-row={key}>
                <th scope="row">{name}</th>
                <td className="ol-val" data-ol-value={key}>
                  {p.kind === "angle" ? FMT.ang(values[key]) : FMT.len(values[key])}
                </td>
                <td className="ol-vis">
                  <label className="ol-check">
                    <input
                      type="checkbox"
                      data-ol-vis={key}
                      aria-label={`Vis ${name} på opgavearket`}
                      checked={st.visible}
                      onChange={(e) => onSetParam(fig.id, key, { visible: e.target.checked })}
                    />
                    <span>Vis</span>
                  </label>
                </td>
                <td className="ol-rename">
                  <input
                    type="text"
                    className="ol-alias"
                    data-ol-alias={key}
                    aria-label={`Nyt navn for ${key} (højst ${ALIAS_MAX} tegn)`}
                    placeholder={key}
                    maxLength={ALIAS_MAX}
                    value={st.alias ?? ""}
                    onChange={(e) =>
                      onSetParam(fig.id, key, { alias: e.target.value === "" ? undefined : e.target.value.slice(0, ALIAS_MAX) }, `alias:${fig.id}:${key}`)
                    }
                  />
                  <button
                    type="button"
                    className="ol-btn ol-find"
                    data-ol-find={key}
                    disabled={reason !== null}
                    title={reason ?? `Opret et regnestykke, der finder ${name}`}
                    aria-describedby={reason ? `ol-find-why-${key}` : undefined}
                    onClick={() => onAddCalc(fig.id, key)}
                  >
                    Find {name}
                  </button>
                  {reason && (
                    <span id={`ol-find-why-${key}`} className={vis.has(key) ? "sr-only" : "ol-find-why"}>
                      {reason}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="ol-hint">
        Skjulte størrelser står ikke på opgavearket, kun navnet. Omdøb en størrelse (fx A til X), fjern flueben ved Vis,
        og tryk Find.
      </p>
      {problems.map(({ calc, text }) => (
        <p key={calc.id} className="ol-warn" role="status" data-ol-warning={calc.id}>
          {text}
        </p>
      ))}
      {sortedCalcs.length > 0 && (
        <div className="ol-calc-list">
          <h3 className="ol-subtitle">Regnestykker</h3>
          <ul>
            {sortedCalcs.map((c) => (
              <li key={c.id}>
                <button type="button" className="ol-link" data-ol-goto-calc={c.id} onClick={() => onSelect(c.id)}>
                  <b>{numbering.get(c.id)}</b> finder {displayName(fig, c.param)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset className="ol-snap">
        <legend>Træk i hjørnerne</legend>
        <label className="ol-check">
          <input
            type="checkbox"
            data-ol-setting="snapCm"
            aria-label="Snap til 0,5 cm når du trækker i hjørnerne"
            checked={doc.settings.snapCm > 0}
            onChange={(e) => onSettings({ snapCm: e.target.checked ? 0.5 : 0 })}
          />
          <span>Snap til 0,5 cm</span>
        </label>
        <label className="ol-check">
          <input
            type="checkbox"
            data-ol-setting="snapDeg"
            aria-label="Hele grader når du trækker i hjørnerne"
            checked={doc.settings.snapDeg}
            onChange={(e) => onSettings({ snapDeg: e.target.checked })}
          />
          <span>Hele grader</span>
        </label>
        <p className="ol-hint">Hold Shift for at dreje i trin på 15°. Piletaster flytter figuren 1 mm (Shift: 5 mm); på et hjørne ændrer de trekanten.</p>
      </fieldset>
    </>
  );
}

function CalcSection({
  calc,
  doc,
  onSelect,
}: {
  calc: CalcObject;
  doc: SheetDoc;
  onSelect: (id: string | null) => void;
}) {
  const fig = doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === calc.figureId);
  if (!fig) return <p className="ol-hint">Figuren til regnestykket findes ikke.</p>;
  const sol = solveParam(fig, calc.param, doc.settings);
  const problem = calcProblem(fig, calc.param, doc.settings);
  const rhs = sol && sol.formula.includes(" = ") ? sol.formula.slice(sol.formula.indexOf(" = ") + 3) : "";
  return (
    <>
      <dl className="ol-calc-info" data-ol-calc-info="">
        <dt>Finder</dt>
        <dd>{displayName(fig, calc.param)}</dd>
        {sol && (
          <>
            <dt>Formel</dt>
            <dd data-ol-calc-formula="">{sol.formula}</dd>
            {sol.substituted !== rhs && (
              <>
                <dt>Indsat</dt>
                <dd>{`${displayName(fig, calc.param)} = ${sol.substituted}`}</dd>
              </>
            )}
            <dt>Svar</dt>
            <dd data-ol-calc-answer="">
              <b>{sol.result}</b>
            </dd>
          </>
        )}
      </dl>
      {problem && (
        <p className="ol-warn" role="status" data-ol-warning={calc.id}>
          {problem}
        </p>
      )}
      <button type="button" className="ol-btn" data-ol-goto-figure="" onClick={() => onSelect(fig.id)}>
        Gå til figur
      </button>
      <p className="ol-hint">Regnestykket hører til figuren, men kan flyttes frit på arket.</p>
    </>
  );
}
