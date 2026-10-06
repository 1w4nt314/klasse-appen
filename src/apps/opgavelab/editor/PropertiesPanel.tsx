"use client";

// Opgavelab — egenskabspanelet: parametertabel (live-værdi, Vis, Navn, Find …),
// advarsler, regnestykke-visning og sletning.

import { useId, useState } from "react";
import { DRILL_OPS, OP_SIGN } from "../core/drill";
import { newSeed } from "../model/document";
import { blockProblem, blockProblemText, figureProblem } from "../render/placeBlock";
import { layoutDrill, layoutFormula } from "../render/drillLayout";
import type { Measure } from "../render/textLayout";
import { formatByKind } from "../core/format";
import {
  aliasConflict,
  calcDrift,
  calcProblem,
  clipAlias,
  displayName,
  defOf,
  solveParam,
  visibleParams,
} from "../model/figures";
import { ALIAS_MAX, LIMITS } from "../model/types";
import type {
  CalcObject,
  DocSettings,
  Document as SheetDoc,
  DrillConfig,
  DrillObject,
  DrillOp,
  FigureObject,
  FormulaObject,
  ParamState,
  SheetObject,
} from "../model/types";
import { ConfirmDelete } from "./ConfirmDelete";
import type { ObjectPatch } from "./useDocument";

export function PropertiesPanel({
  doc,
  selected,
  numbering,
  measure,
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
  measure: Measure;
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
  const def = selected.type === "figure" ? defOf(selected) : null;
  const title =
    selected.type === "text"
      ? "Tekst"
      : selected.type === "figure"
        ? `${def?.name ?? "Figur"}${numbering.get(selected.id) ? ` ${numbering.get(selected.id)}` : ""}`
        : selected.type === "drill"
          ? `Regneark ${numbering.get(selected.id) ?? ""}`.trim()
          : selected.type === "formula"
            ? `Formler ${numbering.get(selected.id) ?? ""}`.trim()
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
          measure={measure}
          onSetParam={onSetParam}
          onAddCalc={onAddCalc}
          onSelect={onSelect}
          onSettings={onSettings}
        />
      )}
      {selected.type === "calc" && <CalcSection calc={selected} doc={doc} onSelect={onSelect} />}
      {selected.type === "drill" && (
        <DrillSection key={selected.id} drill={selected} doc={doc} numbering={numbering} measure={measure} onUpdate={onUpdate} />
      )}
      {selected.type === "formula" && (
        <FormulaSection key={selected.id} formula={selected} doc={doc} numbering={numbering} measure={measure} onUpdate={onUpdate} />
      )}

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
          {selected.type === "figure"
            ? "Slet figur"
            : selected.type === "calc"
              ? "Slet regnestykke"
              : selected.type === "drill"
                ? "Slet regneark"
                : selected.type === "formula"
                  ? "Slet formler"
                  : "Slet"}
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
  measure,
  onSetParam,
  onAddCalc,
  onSelect,
  onSettings,
}: {
  fig: FigureObject;
  doc: SheetDoc;
  calcs: CalcObject[];
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  onSetParam: (id: string, param: string, patch: Partial<ParamState>, key?: string) => void;
  onAddCalc: (figureId: string, param: string) => void;
  onSelect: (id: string | null) => void;
  onSettings: (patch: Partial<DocSettings>) => void;
}) {
  const def = defOf(fig);
  const values = def.compute(fig.shape);
  const vis = visibleParams(fig);
  const problems = calcs
    .map((c) => ({ calc: c, text: calcProblem(fig, c.param, doc.settings) ?? calcDrift(fig, c.param, doc.settings) }))
    .filter((p): p is { calc: CalcObject; text: string } => p.text !== null);
  const layoutProblem = figureProblem(doc, fig, numbering, measure);
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
            // Størrelser uden regel (fx trapezets ben): ingen Find, med en forklaring under tabellen.
            const noRule = def.solvableFrom(key).length === 0;
            const reason = noRule
              ? (p.noFind ?? `${name} kan ikke findes med et regnestykke`)
              : vis.has(key)
                ? `Skjul ${name} først — den, der skal findes, må ikke stå på opgavearket`
                : existing
                  ? `Der er allerede et regnestykke for ${name}`
                  : null;
            return (
              <tr key={key} data-ol-param-row={key}>
                <th scope="row">{name}</th>
                <td className="ol-val" data-ol-value={key}>
                  {formatByKind(p.kind, values[key])}
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
                  <AliasInput key={`${fig.id}:${key}`} fig={fig} param={key} alias={st.alias} onSetParam={onSetParam} />
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
                    <span id={`ol-find-why-${key}`} className={vis.has(key) || noRule ? "sr-only" : "ol-find-why"}>
                      {reason}
                    </span>
                  )}
                  {noRule && (
                    <span className="ol-find-why ol-find-why-short" aria-hidden="true" data-ol-find-why={key}>
                      Kan ikke findes
                    </span>
                  )}
                  {reason && !noRule && vis.has(key) && (
                    // Kort, synlig årsag for musebrugere (den fulde tekst står i title og for skærmlæsere).
                    <span className="ol-find-why ol-find-why-short" aria-hidden="true" data-ol-find-why={key}>
                      Skjul først
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
      {[...new Set(def.params.filter((p) => def.solvableFrom(p.key).length === 0).map((p) => p.noFind ?? ""))]
        .filter((t) => t !== "")
        .map((t) => (
          <p key={t} className="ol-hint" data-ol-nofind-hint="">
            {t}
          </p>
        ))}
      {(def.type === "box" || def.type === "cube") && (
        <p className="ol-hint" data-ol-depth-hint="">
          Dybden tegnes halv størrelse (skråbillede).
        </p>
      )}
      {def.params.some((p) => p.derived) && (
        <p className="ol-hint" data-ol-derived-hint="">
          Afledte mål (fx areal og omkreds) er skjult som standard. Sæt flueben ved Vis, så står de under figuren.
        </p>
      )}
      {layoutProblem && (
        <p className="ol-warn" role="status" data-ol-figure-warning={fig.id}>
          {`${blockProblemText(layoutProblem, "Figuren").join(". ")} — ${
            layoutProblem.outside.length > 0 ? "flyt den, gør den mindre, eller giv størrelserne kortere navne" : "flyt den"
          }.`}
        </p>
      )}
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

/**
 * Navnefelt for én parameter. Et navn, der allerede er i brug på figuren, bliver stående i
 * feltet med fejlbeskeden "Navnet er allerede i brug", men gemmes ikke; forlades feltet,
 * vender det tilbage til det gemte navn.
 */
function AliasInput({
  fig,
  param,
  alias,
  onSetParam,
}: {
  fig: FigureObject;
  param: string;
  alias: string | undefined;
  onSetParam: (id: string, param: string, patch: Partial<ParamState>, key?: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  // Det indtastede, mens feltet redigeres: reduceren gemmer aliaset trimmet, så et mellemrum
  // midt i et navn ("v 1") kan skrives færdigt uden at forsvinde undervejs.
  const [typing, setTyping] = useState<string | null>(null);
  const errId = `ol-alias-err-${fig.id}-${param}`;
  return (
    <>
      <input
        type="text"
        className="ol-alias"
        data-ol-alias={param}
        aria-label={`Nyt navn for ${param} (højst ${ALIAS_MAX} tegn)`}
        aria-invalid={draft !== null ? true : undefined}
        aria-describedby={draft !== null ? errId : undefined}
        placeholder={param}
        maxLength={ALIAS_MAX * 2}
        value={draft ?? typing ?? alias ?? ""}
        onChange={(e) => {
          const v = clipAlias(e.target.value);
          if (aliasConflict(fig, param, v)) {
            setDraft(v);
            return;
          }
          setDraft(null);
          setTyping(v);
          onSetParam(fig.id, param, { alias: v === "" ? undefined : v }, `alias:${fig.id}:${param}`);
        }}
        onBlur={() => {
          setDraft(null);
          setTyping(null);
        }}
      />
      {draft !== null && (
        <span id={errId} className="ol-alias-error" role="alert" data-ol-alias-error={param}>
          Navnet er allerede i brug
        </span>
      )}
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
  const drift = calcDrift(fig, calc.param, doc.settings);
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
              {sol.approx && <span className="ol-hint"> (afrundet)</span>}
            </dd>
          </>
        )}
      </dl>
      {(problem ?? drift) && (
        <p className="ol-warn" role="status" data-ol-warning={calc.id}>
          {problem ?? drift}
        </p>
      )}
      <button type="button" className="ol-btn" data-ol-goto-figure="" onClick={() => onSelect(fig.id)}>
        Gå til figur
      </button>
      <p className="ol-hint">Regnestykket hører til figuren, men kan flyttes frit på arket.</p>
    </>
  );
}

// ---- regneark ----

const OP_NAMES: Record<DrillOp, string> = { add: "Plus", sub: "Minus", mul: "Gange", div: "Division" };
const TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** Helt tal i [min, max] fra et felt (kun cifre), ellers null. */
function parseInt0(text: string, min: number, max: number): number | null {
  if (!/^\d{1,6}$/.test(text.trim())) return null;
  const n = Number(text);
  return n >= min && n <= max ? n : null;
}

/** Heltalsfelt med kladde: en ugyldig indtastning vises med fejl, men gemmes ikke i dokumentet. */
function IntField({
  name,
  label,
  value,
  min,
  max,
  unit,
  onCommit,
}: {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onCommit: (n: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const errId = useId();
  const shown = draft ?? String(value);
  const bad = draft !== null && parseInt0(draft, min, max) === null;
  return (
    <div className="ol-drill-row">
      <label className="ol-drill-field">
        <span>{label}</span>
        <input
          type="text"
          inputMode="numeric"
          className="ol-num"
          data-ol-drill={name}
          value={shown}
          aria-invalid={bad || undefined}
          aria-describedby={bad ? errId : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = parseInt0(e.target.value, min, max);
            if (n !== null && n !== value) onCommit(n);
          }}
          onBlur={() => setDraft(null)}
        />
        {unit && <span className="ol-unit">{unit}</span>}
      </label>
      {bad && (
        <span id={errId} className="ol-field-error" role="alert" data-ol-drill-error={name}>
          {`Skriv et helt tal fra ${min} til ${max}`}
        </span>
      )}
    </div>
  );
}

/** To heltalsfelter (mindste og største tal). Gemmes først, når begge er gyldige og mindste ≤ største. */
function RangeField({
  name,
  label,
  lo,
  hi,
  onCommit,
}: {
  name: string;
  label: string;
  lo: number;
  hi: number;
  onCommit: (lo: number, hi: number) => void;
}) {
  const [draft, setDraft] = useState<{ lo: string | null; hi: string | null }>({ lo: null, hi: null });
  const errId = useId();
  const N = LIMITS.drillNumberMax;
  const sLo = draft.lo ?? String(lo);
  const sHi = draft.hi ?? String(hi);
  const pLo = parseInt0(sLo, 0, N);
  const pHi = parseInt0(sHi, 0, N);
  const error =
    pLo === null || pHi === null
      ? `Skriv hele tal fra 0 til ${N.toLocaleString("da-DK")}`
      : pLo > pHi
        ? "Mindste tal skal være ≤ største"
        : null;
  const change = (which: "lo" | "hi", v: string) => {
    const next = { ...draft, [which]: v };
    setDraft(next);
    const a = parseInt0(next.lo ?? String(lo), 0, N);
    const b = parseInt0(next.hi ?? String(hi), 0, N);
    if (a !== null && b !== null && a <= b && (a !== lo || b !== hi)) onCommit(a, b);
  };
  const field = (which: "lo" | "hi", text: string, what: string) => (
    <input
      type="text"
      inputMode="numeric"
      className="ol-num"
      data-ol-drill={`${name}${which === "lo" ? "Min" : "Max"}`}
      aria-label={`${label}, ${what}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errId : undefined}
      value={text}
      onChange={(e) => change(which, e.target.value)}
      // Gyldige kladder er allerede gemt og kan slippes; ugyldige bliver stående med fejlen.
      onBlur={() =>
        setDraft((d) => {
          const a = parseInt0(d.lo ?? String(lo), 0, N);
          const b = parseInt0(d.hi ?? String(hi), 0, N);
          return a !== null && b !== null && a <= b ? { lo: null, hi: null } : d;
        })
      }
    />
  );
  return (
    <div className="ol-drill-row">
      <div className="ol-drill-field ol-range" role="group" aria-label={label}>
        <span>{label}</span>
        {field("lo", sLo, "mindste")}
        <span className="ol-unit">til</span>
        {field("hi", sHi, "største")}
      </div>
      {error && (
        <span id={errId} className="ol-field-error" role="alert" data-ol-drill-error={name}>
          {error}
        </span>
      )}
    </div>
  );
}

function DrillSection({
  drill,
  doc,
  numbering,
  measure,
  onUpdate,
}: {
  drill: DrillObject;
  doc: SheetDoc;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  onUpdate: (id: string, patch: ObjectPatch, key?: string) => void;
}) {
  const c = drill.config;
  const set = (patch: Partial<DrillConfig>, key?: string) =>
    onUpdate(drill.id, { config: { ...c, ...patch } }, key ? `drill:${drill.id}:${key}` : undefined);
  const hasDecimalOps = c.ops.includes("add") || c.ops.includes("sub");
  const layout = layoutDrill(drill, numbering.get(drill.id) ?? "", measure);
  const problem = blockProblem(doc, drill, numbering, measure);
  const warnings = problem ? blockProblemText(problem, "Regnearket") : [];

  return (
    <>
      <p className="ol-hint" data-ol-drill-info="">
        {`${c.count} ${c.count === 1 ? "opgave" : "opgaver"} med svar på svararket. Flyt blokken ved at trække i den.`}
      </p>
      <button type="button" className="ol-btn" data-ol-reroll="" onClick={() => onUpdate(drill.id, { seed: newSeed() })}>
        Nye tal
      </button>

      {warnings.length > 0 && (
        <p className="ol-warn ol-warn-sticky" role="status" data-ol-drill-warning={drill.id}>
          {`${warnings.join(". ")}. Gør blokken mindre (færre opgaver, flere kolonner eller smallere), eller flyt den.`}
        </p>
      )}
      {layout.columns < c.columns && (
        <p className="ol-hint" data-ol-drill-cols="">
          {`Kun ${layout.columns} ${layout.columns === 1 ? "kolonne" : "kolonner"} er plads til i den valgte bredde.`}
        </p>
      )}

      <fieldset className="ol-snap ol-drill-group">
        <legend>Regningsarter</legend>
        {DRILL_OPS.map((op) => {
          const on = c.ops.includes(op);
          return (
            <label key={op} className="ol-check">
              <input
                type="checkbox"
                data-ol-drill-op={op}
                checked={on}
                // Mindst én regningsart: den sidste kan ikke fjernes.
                disabled={on && c.ops.length === 1}
                onChange={(e) => set({ ops: DRILL_OPS.filter((o) => (o === op ? e.target.checked : c.ops.includes(o))) })}
              />
              <span>{`${OP_NAMES[op]} (${OP_SIGN[op]})`}</span>
            </label>
          );
        })}
      </fieldset>

      <fieldset className="ol-snap ol-drill-group">
        <legend>Tal</legend>
        <RangeField name="a" label="Første tal" lo={c.aMin} hi={c.aMax} onCommit={(aMin, aMax) => set({ aMin, aMax }, "a")} />
        <RangeField name="b" label="Andet tal" lo={c.bMin} hi={c.bMax} onCommit={(bMin, bMax) => set({ bMin, bMax }, "b")} />
        <p className="ol-hint">
          Ved division er første tal kvotienten (uden rest) eller dividenden (med rest), og andet tal er divisoren
          (aldrig 1, når området går til 2 eller mere). Med rest er dividenden mindst lige så stor som divisoren.
        </p>
      </fieldset>

      <fieldset className="ol-snap ol-drill-group" data-ol-drill-tables="">
        <legend>Tabeller (gange og division)</legend>
        <div className="ol-tables">
          {TABLES.map((t) => (
            <label key={t} className="ol-check ol-table-check">
              <input
                type="checkbox"
                data-ol-drill-table={t}
                aria-label={`${t}-tabellen`}
                checked={c.tables.includes(t)}
                onChange={(e) => set({ tables: TABLES.filter((x) => (x === t ? e.target.checked : c.tables.includes(x))) })}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
        <p className="ol-hint">
          {c.tables.length > 0
            ? "Gange og division bruger kun de valgte tabeller (andet tal-området gælder ikke)."
            : "Ingen valgt: gange og division bruger andet tal-området."}
        </p>
      </fieldset>

      <fieldset className="ol-snap ol-drill-group">
        <legend>Regler</legend>
        <label className="ol-drill-field">
          <span>Division</span>
          <select data-ol-drill="division" value={c.division} onChange={(e) => set({ division: e.target.value === "remainder" ? "remainder" : "exact" })}>
            <option value="exact">Går op (uden rest)</option>
            <option value="remainder">Med rest</option>
          </select>
        </label>
        <label className="ol-check">
          <input type="checkbox" data-ol-drill="noNegative" checked={c.noNegative} onChange={(e) => set({ noNegative: e.target.checked })} />
          <span>Ingen negative svar (minus)</span>
        </label>
        <label className="ol-drill-field">
          <span>Decimaler</span>
          <select
            data-ol-drill="decimals"
            value={c.decimals}
            disabled={!hasDecimalOps}
            aria-describedby="ol-decimals-note"
            onChange={(e) => set({ decimals: Number(e.target.value) === 2 ? 2 : Number(e.target.value) === 1 ? 1 : 0 })}
          >
            <option value={0}>Ingen (hele tal)</option>
            <option value={1}>1 decimal</option>
            <option value={2}>2 decimaler</option>
          </select>
        </label>
        <p className="ol-hint" id="ol-decimals-note" data-ol-decimals-note="">
          {hasDecimalOps ? "Decimaler bruges kun ved plus og minus." : "Decimaler kan kun bruges sammen med plus eller minus."}
        </p>
      </fieldset>

      <fieldset className="ol-snap ol-drill-group">
        <legend>Layout</legend>
        <IntField name="count" label="Antal opgaver" value={c.count} min={1} max={LIMITS.drillCount} onCommit={(count) => set({ count }, "count")} />
        <label className="ol-drill-field">
          <span>Kolonner</span>
          <select
            data-ol-drill="columns"
            value={c.columns}
            onChange={(e) => set({ columns: Math.min(4, Math.max(1, Number(e.target.value))) as DrillConfig["columns"] })}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <IntField
          name="width"
          label="Bredde"
          unit="mm"
          value={Math.round(drill.width)}
          min={LIMITS.drillWidthMin}
          max={LIMITS.drillWidthMax}
          onCommit={(width) => onUpdate(drill.id, { width }, `drill:${drill.id}:width`)}
        />
        <label className="ol-drill-field">
          <span>Overskrift</span>
          <input
            type="text"
            data-ol-drill="title"
            maxLength={LIMITS.drillTitle}
            value={c.title}
            onChange={(e) => set({ title: e.target.value }, "title")}
          />
        </label>
      </fieldset>
    </>
  );
}

/** Linjerne i tekstfeltet → fejl, hvis der er for mange eller en er for lang (så gemmes de ikke). */
function linesError(lines: string[]): string | null {
  if (lines.length > LIMITS.formulaLines) return `Højst ${LIMITS.formulaLines} linjer`;
  const long = lines.findIndex((l) => l.length > LIMITS.formulaLineChars);
  return long >= 0 ? `Linje ${long + 1} er for lang (højst ${LIMITS.formulaLineChars} tegn)` : null;
}

/** Lille note under en formel-linje, hvor der stod noget efter "=" (fx læreren skrev svaret selv). */
function IgnoredNote({ label }: { label: string }) {
  return (
    <span className="ol-formula-note" data-ol-formula-ignored={label}>
      Teksten efter = bruges ikke — facit regnes ud af appen.
    </span>
  );
}

function FormulaSection({
  formula,
  doc,
  numbering,
  measure,
  onUpdate,
}: {
  formula: FormulaObject;
  doc: SheetDoc;
  numbering: ReadonlyMap<string, string>;
  measure: Measure;
  onUpdate: (id: string, patch: ObjectPatch, key?: string) => void;
}) {
  // Kladde: kun en ugyldig tekst (for mange/lange linjer) holdes her; gyldig tekst gemmes straks.
  const [draft, setDraft] = useState<string | null>(null);
  const errId = useId();
  const helpId = useId();
  const shown = draft ?? formula.lines.join("\n");
  const draftError = draft !== null ? linesError(draft.split("\n")) : null;
  const layout = layoutFormula(formula, numbering.get(formula.id) ?? "", measure);
  const problem = blockProblem(doc, formula, numbering, measure);
  const warnings = problem ? blockProblemText(problem, "Formelblokken") : [];

  return (
    <>
      <label className="ol-field">
        <span>Regnestykker (ét pr. linje)</span>
        <textarea
          rows={6}
          data-ol-formula="lines"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          maxLength={LIMITS.formulaLines * (LIMITS.formulaLineChars + 1)}
          value={shown}
          aria-invalid={draftError ? true : undefined}
          aria-describedby={draftError ? `${errId} ${helpId}` : helpId}
          onChange={(e) => {
            const text = e.target.value.replace(/\r\n?/g, "\n");
            const lines = text.split("\n");
            if (linesError(lines)) {
              setDraft(text);
              return;
            }
            setDraft(null);
            onUpdate(formula.id, { lines }, `formula:${formula.id}:lines`);
          }}
        />
      </label>
      {draftError && (
        <p id={errId} className="ol-field-error" role="alert" data-ol-formula-error="lines">
          {`${draftError} — ændringen er ikke gemt.`}
        </p>
      )}
      <p className="ol-hint" id={helpId}>
        {"Brug + − · : ^ ² ³ √ π og parenteser, og komma som decimaltegn. * og / virker også. \"=\" til sidst kan udelades; tekst efter \"=\" bruges ikke."}
      </p>

      {warnings.length > 0 && (
        <p className="ol-warn ol-warn-sticky" role="status" data-ol-formula-warning={formula.id}>
          {`${warnings.join(". ")}. Flyt blokken, eller fjern nogle linjer.`}
        </p>
      )}

      <div className="ol-formula-results" data-ol-formula-results="">
        <h3 className="ol-subtitle">Facit</h3>
        {layout.items.length === 0 ? (
          <p className="ol-hint">Ingen regnestykker endnu.</p>
        ) : (
          <ul className="ol-formula-list">
            {layout.items.map((it) =>
              it.error ? (
                <li key={it.label} className="ol-formula-bad" role="status" data-ol-formula-line={it.label} data-ol-formula-status="error">
                  <span className="ol-formula-label">{it.label}</span>
                  <span>
                    <span className="ol-formula-expr">{it.text}</span> <span className="ol-field-error">{it.error}</span>
                    {it.ignored && <IgnoredNote label={it.label} />}
                  </span>
                </li>
              ) : (
                <li key={it.label} data-ol-formula-line={it.label} data-ol-formula-status="ok">
                  <span className="ol-formula-label">{it.label}</span>
                  <span>
                    <span className="ol-formula-expr">{`${it.textSvar} ${it.answer}`}</span>
                    {it.ignored && <IgnoredNote label={it.label} />}
                  </span>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      <fieldset className="ol-snap ol-drill-group">
        <legend>Layout</legend>
        <label className="ol-drill-field">
          <span>Decimaler i facit</span>
          <select
            data-ol-formula="decimals"
            value={formula.decimals}
            onChange={(e) => {
              const n = Number(e.target.value);
              onUpdate(formula.id, { decimals: (Number.isInteger(n) && n >= 0 && n <= 4 ? n : 2) as FormulaObject["decimals"] });
            }}
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "Ingen (hele tal)" : n === 1 ? "Højst 1" : `Højst ${n}`}
              </option>
            ))}
          </select>
        </label>
        <IntField
          name="width"
          label="Bredde"
          unit="mm"
          value={Math.round(formula.width)}
          min={LIMITS.drillWidthMin}
          max={LIMITS.drillWidthMax}
          onCommit={(width) => onUpdate(formula.id, { width }, `formula:${formula.id}:width`)}
        />
        <label className="ol-drill-field">
          <span>Overskrift</span>
          <input
            type="text"
            data-ol-formula="title"
            maxLength={LIMITS.formulaTitle}
            value={formula.title}
            onChange={(e) => onUpdate(formula.id, { title: e.target.value }, `formula:${formula.id}:title`)}
          />
        </label>
      </fieldset>
    </>
  );
}
