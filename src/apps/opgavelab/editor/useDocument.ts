"use client";

// Opgavelab — dokumentets tilstand: dokument, markering, fortryd-historik (max 50).
// Historik pushes ved commit (slip af træk / panel-ændring), ikke ved hvert musetræk.

import { useMemo, useReducer } from "react";
import { makeCalc, makeFigure, makeText, newDocument, newId } from "../model/document";
import { aliasConflict, clipAlias } from "../model/figures";
import { LIMITS } from "../model/types";
import type {
  CalcObject,
  Document as SheetDoc,
  FigureShape,
  DocSettings,
  FigureKind,
  FigureObject,
  ParamState,
  SheetObject,
  TextObject,
} from "../model/types";

export const HISTORY_MAX = 50;

export type DocState = {
  doc: SheetDoc;
  selectedId: string | null;
  /** Tidligere versioner (ældst først). */
  history: SheetDoc[];
  /** Dokumentet som det så ud da et igangværende træk begyndte (null = intet træk). */
  pending: SheetDoc | null;
  /** Nøgle for den sidste sammenlægbare ændring (fx tastning i et felt). */
  lastKey: string | null;
  savedJson: string;
  savedId: string | null;
};

export type ObjectPatch = Partial<Omit<TextObject, "id" | "type">> &
  Partial<Omit<FigureObject, "id" | "type">> &
  Partial<Omit<CalcObject, "id" | "type">>;
type Patch = ObjectPatch;

export type DocAction =
  | { type: "addNew"; id: string; kind: "text" | FigureKind }
  | { type: "addCalc"; id: string; figureId: string; param: string; x?: number; y?: number }
  | { type: "update"; id: string; patch: Patch; key?: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "reshape"; id: string; shape: FigureShape; x: number; y: number }
  | { type: "commit" }
  | { type: "cancel" }
  | { type: "remove"; id: string }
  | { type: "select"; id: string | null }
  | { type: "setParam"; id: string; param: string; patch: Partial<ParamState>; key?: string }
  | { type: "setName"; name: string }
  | { type: "setSettings"; patch: Partial<DocSettings> }
  | { type: "undo" }
  | { type: "replace"; doc: SheetDoc; savedId?: string | null }
  /**
   * snapshot = dokumentet som det blev sendt til serveren (rettelser under gemningen forbliver ugemte);
   * prevName = navnet i dokumentet da gemningen begyndte (følger kun med det rensede navn, hvis det ikke er rettet siden).
   */
  | { type: "markSaved"; id: string; name?: string; snapshot?: SheetDoc; prevName?: string }
  /** Dokumentets række på serveren er væk (slettet): det regnes for ugemt. */
  | { type: "markUnsaved" };

export function initState(doc: SheetDoc = newDocument()): DocState {
  return {
    doc,
    selectedId: null,
    history: [],
    pending: null,
    lastKey: null,
    savedJson: JSON.stringify(doc),
    savedId: null,
  };
}

/** Lægger den aktuelle version i historikken og anvender ændringen. */
function commitChange(s: DocState, doc: SheetDoc, key: string | null = null, extra: Partial<DocState> = {}): DocState {
  const coalesce = key !== null && key === s.lastKey;
  const history = coalesce ? s.history : [...s.history, s.doc].slice(-HISTORY_MAX);
  return { ...s, doc, history, pending: null, lastKey: key, ...extra };
}

function mapObject(doc: SheetDoc, id: string, fn: (o: SheetObject) => SheetObject): SheetDoc {
  return { ...doc, objects: doc.objects.map((o) => (o.id === id ? fn(o) : o)) };
}

export function reducer(s: DocState, a: DocAction): DocState {
  switch (a.type) {
    case "addNew": {
      if (s.doc.objects.length >= LIMITS.objects) return s;
      const existing = s.doc.objects.filter((o) => (a.kind === "text" ? o.type === "text" : o.type === "figure")).length;
      const obj = a.kind === "text" ? makeText(a.id, existing) : makeFigure(a.id, a.kind, existing);
      if (!obj) return s;
      return commitChange(s, { ...s.doc, objects: [...s.doc.objects, obj] }, null, { selectedId: obj.id });
    }
    case "addCalc": {
      const fig = s.doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === a.figureId);
      if (!fig || !(a.param in fig.params) || s.doc.objects.length >= LIMITS.objects) return s;
      // Ét regnestykke pr. størrelse.
      if (s.doc.objects.some((o) => o.type === "calc" && o.figureId === fig.id && o.param === a.param)) return s;
      const siblings = s.doc.objects.filter((o) => o.type === "calc" && o.figureId === fig.id).length;
      const base = makeCalc(a.id, fig, a.param, siblings);
      const calc = { ...base, x: a.x ?? base.x, y: a.y ?? base.y };
      return commitChange(s, { ...s.doc, objects: [...s.doc.objects, calc] }, null, { selectedId: calc.id });
    }
    case "update": {
      if (!s.doc.objects.some((o) => o.id === a.id)) return s;
      const doc = mapObject(s.doc, a.id, (o) => ({ ...o, ...a.patch }) as SheetObject);
      return commitChange(s, doc, a.key ?? null);
    }
    case "move": {
      const o = s.doc.objects.find((x) => x.id === a.id);
      if (!o || (o.x === a.x && o.y === a.y)) return s;
      return {
        ...s,
        pending: s.pending ?? s.doc,
        doc: mapObject(s.doc, a.id, (x) => ({ ...x, x: a.x, y: a.y })),
      };
    }
    case "reshape": {
      // Hjørnetræk: som "move" lægges ændringen i det igangværende træk (ét fortryd-trin ved commit).
      const fig = s.doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === a.id);
      if (!fig) return s;
      const prev = fig.shape as Record<string, unknown>;
      const next = a.shape as Record<string, unknown>;
      const same = fig.x === a.x && fig.y === a.y && Object.keys(next).every((k) => prev[k] === next[k]);
      if (same) return s;
      // Formen kommer fra samme figurs dragVertex (samme figurtype som `fig`).
      return {
        ...s,
        pending: s.pending ?? s.doc,
        doc: mapObject(s.doc, a.id, () => ({ ...fig, shape: a.shape, x: a.x, y: a.y }) as FigureObject),
      };
    }
    case "commit": {
      if (!s.pending) return s;
      const changed = s.pending !== s.doc;
      return {
        ...s,
        pending: null,
        lastKey: null,
        history: changed ? [...s.history, s.pending].slice(-HISTORY_MAX) : s.history,
      };
    }
    case "cancel":
      return s.pending ? { ...s, doc: s.pending, pending: null } : s;
    case "remove": {
      const o = s.doc.objects.find((x) => x.id === a.id);
      if (!o) return s;
      // En figur tager sine regnestykker med sig.
      const objects = s.doc.objects.filter((x) => x.id !== a.id && !(o.type === "figure" && x.type === "calc" && x.figureId === a.id));
      return commitChange(s, { ...s.doc, objects }, null, { selectedId: s.selectedId === a.id ? null : s.selectedId });
    }
    case "select":
      return s.selectedId === a.id ? s : { ...s, selectedId: a.id };
    case "setParam": {
      const fig = s.doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === a.id);
      if (!fig || !(a.param in fig.params)) return s;
      const patch = { ...a.patch };
      if ("alias" in patch) {
        // Et navn, der allerede er i brug på figuren, gemmes ikke (panelet viser fejlen).
        // Trimmet (som displayName og validate.ts): kun mellemrum = intet alias.
        const alias = patch.alias === undefined ? "" : clipAlias(patch.alias.trim()).trim();
        if (aliasConflict(fig, a.param, alias)) return s;
        patch.alias = alias === "" ? undefined : alias;
      }
      const next: ParamState = { ...fig.params[a.param], ...patch };
      const doc = mapObject(s.doc, a.id, (o) => ({ ...(o as FigureObject), params: { ...(o as FigureObject).params, [a.param]: next } }));
      return commitChange(s, doc, a.key ?? null);
    }
    case "setName":
      return { ...s, doc: { ...s.doc, name: a.name } };
    case "setSettings":
      return commitChange(s, { ...s.doc, settings: { ...s.doc.settings, ...a.patch } });
    case "undo": {
      const base = s.pending ?? null;
      if (base) return { ...s, doc: base, pending: null };
      const prev = s.history[s.history.length - 1];
      if (!prev) return s;
      const selectedId = s.selectedId && prev.objects.some((o) => o.id === s.selectedId) ? s.selectedId : null;
      // Navnet hører ikke til historikken: behold det aktuelle.
      return {
        ...s,
        doc: { ...prev, name: s.doc.name },
        history: s.history.slice(0, -1),
        lastKey: null,
        selectedId,
      };
    }
    case "replace":
      return { ...initState(a.doc), savedId: a.savedId ?? null };
    case "markSaved": {
      const base = a.snapshot ?? s.doc;
      const name = a.name ?? base.name;
      // Navnet i feltet følger det rensede navn, hvis det ikke er rettet siden.
      const doc = s.doc.name === (a.prevName ?? base.name) ? { ...s.doc, name } : s.doc;
      return { ...s, doc, savedId: a.id, savedJson: JSON.stringify({ ...base, name }) };
    }
    case "markUnsaved":
      return { ...s, savedId: null, savedJson: "" };
  }
}

export function useDocument() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initState());

  const dirty = useMemo(() => JSON.stringify(state.doc) !== state.savedJson, [state.doc, state.savedJson]);

  const actions = useMemo(
    () => ({
      addText: () => dispatch({ type: "addNew", id: newId(), kind: "text" }),
      addFigure: (kind: FigureKind) => dispatch({ type: "addNew", id: newId(), kind }),
      addCalc: (figureId: string, param: string, x?: number, y?: number) =>
        dispatch({ type: "addCalc", id: newId("c"), figureId, param, x, y }),
      update: (id: string, patch: Patch, key?: string) => dispatch({ type: "update", id, patch, key }),
      move: (id: string, x: number, y: number) => dispatch({ type: "move", id, x, y }),
      reshape: (id: string, shape: FigureShape, x: number, y: number) => dispatch({ type: "reshape", id, shape, x, y }),
      commit: () => dispatch({ type: "commit" }),
      cancel: () => dispatch({ type: "cancel" }),
      remove: (id: string) => dispatch({ type: "remove", id }),
      select: (id: string | null) => dispatch({ type: "select", id }),
      setParam: (id: string, param: string, patch: Partial<ParamState>, key?: string) =>
        dispatch({ type: "setParam", id, param, patch, key }),
      setName: (name: string) => dispatch({ type: "setName", name }),
      setSettings: (patch: Partial<DocSettings>) => dispatch({ type: "setSettings", patch }),
      undo: () => dispatch({ type: "undo" }),
      replace: (doc: SheetDoc, savedId?: string | null) => dispatch({ type: "replace", doc, savedId }),
      markSaved: (id: string, name?: string, snapshot?: SheetDoc, prevName?: string) =>
        dispatch({ type: "markSaved", id, name, snapshot, prevName }),
      markUnsaved: () => dispatch({ type: "markUnsaved" }),
    }),
    [],
  );

  const selected = state.doc.objects.find((o) => o.id === state.selectedId) ?? null;
  return {
    doc: state.doc,
    selectedId: state.selectedId,
    selected,
    canUndo: state.history.length > 0 || state.pending !== null,
    dirty,
    savedId: state.savedId,
    historyLength: state.history.length,
    ...actions,
  };
}

export type DocumentApi = ReturnType<typeof useDocument>;
