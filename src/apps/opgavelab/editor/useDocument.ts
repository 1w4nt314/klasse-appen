"use client";

// Opgavelab — dokumentets tilstand: dokument, markering, fortryd-historik (max 50).
// Historik pushes ved commit (slip af træk / panel-ændring), ikke ved hvert musetræk.

import { useMemo, useReducer } from "react";
import { makeCalc, makeDrill, makeFigure, makeFormula, makeText, newDocument, newId } from "../model/document";
import { aliasConflict, clipAlias } from "../model/figures";
import { followInMargin, insertPage, moveObjectToPage, removePage, swapPages } from "../model/pages";
import { LIMITS } from "../model/types";
import type {
  CalcObject,
  Document as SheetDoc,
  FigureShape,
  DocSettings,
  DrillObject,
  FigureKind,
  FormulaObject,
  FigureObject,
  ParamState,
  SheetObject,
  TextObject,
} from "../model/types";

export const HISTORY_MAX = 50;

export type DocState = {
  doc: SheetDoc;
  selectedId: string | null;
  /** Den aktive side (0-baseret). Hører til editoren, ikke til dokumentet; altid i [0, pageCount − 1]. */
  page: number;
  /** Tidligere versioner (ældst først), hver med den side, editoren stod på, da den blev afløst. */
  history: HistoryEntry[];
  /** Dokumentet som det så ud da et igangværende træk begyndte (null = intet træk). */
  pending: SheetDoc | null;
  /** Nøgle for den sidste sammenlægbare ændring (fx tastning i et felt). */
  lastKey: string | null;
  savedJson: string;
  savedId: string | null;
};

/** En ændring af et objekts felter. `page` kan ikke sættes her (kun via moveToPage; regnestykket følger figuren). */
export type ObjectPatch = Partial<Omit<TextObject, "id" | "type" | "page">> &
  Partial<Omit<FigureObject, "id" | "type" | "page">> &
  Partial<Omit<CalcObject, "id" | "type" | "page">> &
  Partial<Omit<DrillObject, "id" | "type" | "page">> &
  Partial<Omit<FormulaObject, "id" | "type" | "page">>;
type Patch = ObjectPatch;

export type DocAction =
  /** seed: kun regneark (laves i event-handleren med newSeed, så reduceren er deterministisk); at: alle nye objekter (ledig plads fra placeFigure/placeBlock/placeText). */
  | { type: "addNew"; id: string; kind: "text" | "drill" | "formula" | FigureKind; seed?: number; at?: { x: number; y: number } }
  | { type: "addCalc"; id: string; figureId: string; param: string; x?: number; y?: number }
  | { type: "update"; id: string; patch: Patch; key?: string }
  /** follow: figurens regnestykker, der flytter med (SheetEditor: samme forskydning, holdt på arket). */
  | { type: "move"; id: string; x: number; y: number; follow?: readonly MoveTo[] }
  | { type: "reshape"; id: string; shape: FigureShape; x: number; y: number }
  | { type: "commit" }
  | { type: "cancel" }
  | { type: "remove"; id: string }
  /** Skifter til objektets side. */
  | { type: "select"; id: string | null }
  /** Aktiv side; afmarkerer, hvis det markerede objekt står på en anden side. Uden for intervallet → uændret. */
  | { type: "setPage"; page: number }
  /** Ny tom side efter den aktive (den bliver aktiv). Fuldt (LIMITS.pages) → uændret. */
  | { type: "addPage" }
  /** Sletter siden med alle objekter (regnestykker følger deres figur). Sidste side → uændret. Kan fortrydes. */
  | { type: "removePage"; index: number }
  /** Bytter den aktive side med nabosiden (dir −1 = frem, 1 = tilbage); den aktive side følger med indholdet. */
  | { type: "movePage"; dir: -1 | 1 }
  /**
   * Flytter objektet (en figur tager sine regnestykker med) til siden; at: nyt anker på målsiden (fra
   * placeFigure/placeBlock/placeText), ellers samme koordinater; follow: regnestykkernes nye placering (ellers
   * samme forskydning som figuren, holdt inden for margenen). Editoren skifter til målsiden.
   */
  | { type: "moveToPage"; id: string; page: number; at?: { x: number; y: number }; follow?: readonly MoveTo[] }
  /**
   * fit: figuren efter ændringen → figuren, der skal gemmes (Opgavelab: skubbet ind på arket, når et nyt navn
   * har gjort den bredere end pladsen ved margenen — render/placeBlock.fitFigure). Ren funktion.
   */
  | { type: "setParam"; id: string; param: string; patch: Partial<ParamState>; key?: string; fit?: FitFigure }
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

/**
 * Et fortryd-trin: dokumentet før ændringen og den side, editoren stod på, da ændringen skete (fx siden, hvorfra
 * en side blev tilføjet, slettet eller flyttet, eller et objekt flyttet til en anden side) — så fortryd viser den.
 */
export type HistoryEntry = { doc: SheetDoc; page: number };

/** Et objekts nye placering (DocAction "move"). */
export type MoveTo = { id: string; x: number; y: number };

/** Se DocAction "setParam". */
export type FitFigure = (fig: FigureObject, doc: SheetDoc) => FigureObject;

export function initState(doc: SheetDoc = newDocument()): DocState {
  return {
    doc,
    selectedId: null,
    page: 0,
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
  const history = coalesce ? s.history : [...s.history, { doc: s.doc, page: s.page }].slice(-HISTORY_MAX);
  return { ...s, doc, history, pending: null, lastKey: key, ...extra };
}

function mapObject(doc: SheetDoc, id: string, fn: (o: SheetObject) => SheetObject): SheetDoc {
  return { ...doc, objects: doc.objects.map((o) => (o.id === id ? fn(o) : o)) };
}

const clampPage = (page: number, doc: SheetDoc) => Math.min(Math.max(page, 0), doc.pageCount - 1);

/** Siden, editoren skal stå på, når dokumentet er ændret: det markeredes side, ellers den gamle side klemt til dokumentet. */
function pageFor(doc: SheetDoc, selectedId: string | null, page: number): number {
  return doc.objects.find((o) => o.id === selectedId)?.page ?? clampPage(page, doc);
}

/** Ny figur flyttet til `at` (ankerets placering), når den er givet. */
function withAt(fig: FigureObject | null, at: { x: number; y: number } | undefined): FigureObject | null {
  return fig && at ? { ...fig, x: at.x, y: at.y } : fig;
}

export function reducer(s: DocState, a: DocAction): DocState {
  switch (a.type) {
    case "addNew": {
      if (s.doc.objects.length >= LIMITS.objects) return s;
      const sameType = a.kind === "text" || a.kind === "drill" || a.kind === "formula" ? a.kind : "figure";
      // Forskydningen af nye objekter (cascade) tæller kun sidens objekter af samme type.
      const existing = s.doc.objects.filter((o) => o.type === sameType && o.page === s.page).length;
      const obj =
        a.kind === "text"
          ? { ...makeText(a.id, existing, s.page), ...(a.at ?? {}) }
          : a.kind === "drill"
            ? { ...makeDrill(a.id, existing, a.seed ?? 0, s.page), ...(a.at ?? {}) }
            : a.kind === "formula"
              ? { ...makeFormula(a.id, existing, s.page), ...(a.at ?? {}) }
              : withAt(makeFigure(a.id, a.kind, existing, s.page), a.at);
      if (!obj) return s;
      return commitChange(s, { ...s.doc, objects: [...s.doc.objects, obj] }, null, { selectedId: obj.id, page: obj.page });
    }
    case "addCalc": {
      const fig = s.doc.objects.find((o): o is FigureObject => o.type === "figure" && o.id === a.figureId);
      if (!fig || !(a.param in fig.params) || s.doc.objects.length >= LIMITS.objects) return s;
      // Ét regnestykke pr. størrelse.
      if (s.doc.objects.some((o) => o.type === "calc" && o.figureId === fig.id && o.param === a.param)) return s;
      const siblings = s.doc.objects.filter((o) => o.type === "calc" && o.figureId === fig.id).length;
      const base = makeCalc(a.id, fig, a.param, siblings);
      // Altid på figurens side (makeCalc); editoren skifter dertil.
      const calc = { ...base, x: a.x ?? base.x, y: a.y ?? base.y };
      return commitChange(s, { ...s.doc, objects: [...s.doc.objects, calc] }, null, { selectedId: calc.id, page: calc.page });
    }
    case "update": {
      if (!s.doc.objects.some((o) => o.id === a.id)) return s;
      // `page` kan ikke sættes herfra (typen forbyder det; her også for kald uden om typerne).
      const patch: Patch & { page?: number } = { ...a.patch };
      delete patch.page;
      const doc = mapObject(s.doc, a.id, (o) => ({ ...o, ...patch }) as SheetObject);
      return commitChange(s, doc, a.key ?? null);
    }
    case "move": {
      const o = s.doc.objects.find((x) => x.id === a.id);
      if (!o) return s;
      // En figurs regnestykker flytter med (kun figurens egne; andre id'er ignoreres).
      const to = new Map<string, MoveTo>([[a.id, a]]);
      if (o.type === "figure")
        for (const f of a.follow ?? [])
          if (s.doc.objects.some((c) => c.id === f.id && c.type === "calc" && c.figureId === o.id)) to.set(f.id, f);
      const moves = (x: SheetObject) => {
        const t = to.get(x.id);
        return t !== undefined && (x.x !== t.x || x.y !== t.y);
      };
      if (!s.doc.objects.some(moves)) return s;
      return {
        ...s,
        pending: s.pending ?? s.doc,
        doc: {
          ...s.doc,
          objects: s.doc.objects.map((x) => {
            const t = to.get(x.id);
            return t && moves(x) ? { ...x, x: t.x, y: t.y } : x;
          }),
        },
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
        history: changed ? [...s.history, { doc: s.pending, page: s.page }].slice(-HISTORY_MAX) : s.history,
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
    case "select": {
      const page = s.doc.objects.find((o) => o.id === a.id)?.page ?? s.page;
      return s.selectedId === a.id && s.page === page ? s : { ...s, selectedId: a.id, page };
    }
    case "setPage": {
      if (!Number.isInteger(a.page) || a.page < 0 || a.page >= s.doc.pageCount) return s;
      const sel = s.doc.objects.find((o) => o.id === s.selectedId);
      const selectedId = sel && sel.page !== a.page ? null : s.selectedId;
      return s.page === a.page && selectedId === s.selectedId ? s : { ...s, page: a.page, selectedId };
    }
    case "addPage": {
      const doc = insertPage(s.doc, s.page);
      if (doc === s.doc) return s;
      return commitChange(s, doc, null, { page: s.page + 1, selectedId: null });
    }
    case "removePage": {
      const doc = removePage(s.doc, a.index);
      if (doc === s.doc) return s;
      // Senere sider rykker én ned; slettes den aktive side, overtager den næste (eller den foregående, hvis det var den sidste).
      const page = a.index < s.page ? s.page - 1 : s.page;
      const selectedId = doc.objects.some((o) => o.id === s.selectedId) ? s.selectedId : null;
      return commitChange(s, doc, null, { selectedId, page: pageFor(doc, selectedId, page) });
    }
    case "movePage": {
      const j = s.page + a.dir;
      const doc = swapPages(s.doc, s.page, j);
      if (doc === s.doc) return s;
      // Den aktive side følger indholdet; markeringen står på den (flyttede) side.
      return commitChange(s, doc, null, { page: j });
    }
    case "moveToPage": {
      const follow = a.follow ? new Map(a.follow.map((f) => [f.id, f])) : null;
      const doc = moveObjectToPage(
        s.doc,
        a.id,
        a.page,
        a.at,
        follow ? (c, dx, dy) => follow.get(c.id) ?? followInMargin(c, dx, dy) : undefined,
      );
      if (doc === s.doc) return s;
      return commitChange(s, doc, null, { selectedId: a.id, page: a.page });
    }
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
      const changed: FigureObject = { ...fig, params: { ...fig.params, [a.param]: next } };
      let doc = mapObject(s.doc, a.id, () => changed);
      const fitted = a.fit ? a.fit(changed, doc) : changed;
      if (fitted !== changed) doc = mapObject(doc, a.id, () => fitted);
      return commitChange(s, doc, a.key ?? null);
    }
    case "setName":
      return { ...s, doc: { ...s.doc, name: a.name } };
    case "setSettings":
      return commitChange(s, { ...s.doc, settings: { ...s.doc.settings, ...a.patch } });
    case "undo": {
      const base = s.pending ?? null;
      if (base) return { ...s, doc: base, pending: null, page: pageFor(base, s.selectedId, s.page) };
      const entry = s.history[s.history.length - 1];
      if (!entry) return s;
      const prev = entry.doc;
      const selectedId = s.selectedId && prev.objects.some((o) => o.id === s.selectedId) ? s.selectedId : null;
      // Navnet hører ikke til historikken: behold det aktuelle. Siden: det markeredes side, ellers siden, hvor
      // ændringen skete (så fortryd af tilføj/slet/flyt side og "flyt til side" viser den gendannede tilstand).
      return {
        ...s,
        doc: { ...prev, name: s.doc.name },
        history: s.history.slice(0, -1),
        lastKey: null,
        selectedId,
        page: pageFor(prev, selectedId, entry.page),
      };
    }
    case "replace":
      // Nyt dokument: markeringen ryddes og editoren står på første side.
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
      /** at: placering (fra placeText), ellers standardplaceringen. */
      addText: (at?: { x: number; y: number }) => dispatch({ type: "addNew", id: newId(), kind: "text", at }),
      /** at: figurens anker (fra placeFigure), ellers standardplaceringen midt på arket. */
      addFigure: (kind: FigureKind, at?: { x: number; y: number }) => dispatch({ type: "addNew", id: newId(), kind, at }),
      /** seed: fra newSeed() i event-handleren; at: placering (fra placeBlock), ellers standardplaceringen. */
      addDrill: (seed: number, at?: { x: number; y: number }) =>
        dispatch({ type: "addNew", id: newId("d"), kind: "drill", seed, at }),
      /** at: placering (fra placeBlock), ellers standardplaceringen. */
      addFormula: (at?: { x: number; y: number }) => dispatch({ type: "addNew", id: newId("f"), kind: "formula", at }),
      addCalc: (figureId: string, param: string, x?: number, y?: number) =>
        dispatch({ type: "addCalc", id: newId("c"), figureId, param, x, y }),
      update: (id: string, patch: Patch, key?: string) => dispatch({ type: "update", id, patch, key }),
      move: (id: string, x: number, y: number, follow?: readonly MoveTo[]) => dispatch({ type: "move", id, x, y, follow }),
      reshape: (id: string, shape: FigureShape, x: number, y: number) => dispatch({ type: "reshape", id, shape, x, y }),
      commit: () => dispatch({ type: "commit" }),
      cancel: () => dispatch({ type: "cancel" }),
      remove: (id: string) => dispatch({ type: "remove", id }),
      select: (id: string | null) => dispatch({ type: "select", id }),
      setPage: (page: number) => dispatch({ type: "setPage", page }),
      addPage: () => dispatch({ type: "addPage" }),
      removePage: (index: number) => dispatch({ type: "removePage", index }),
      movePage: (dir: -1 | 1) => dispatch({ type: "movePage", dir }),
      moveToPage: (id: string, page: number, at?: { x: number; y: number }, follow?: readonly MoveTo[]) =>
        dispatch({ type: "moveToPage", id, page, at, follow }),
      setParam: (id: string, param: string, patch: Partial<ParamState>, key?: string, fit?: FitFigure) =>
        dispatch({ type: "setParam", id, param, patch, key, fit }),
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
    /** Den aktive side (0-baseret). */
    page: state.page,
    selected,
    canUndo: state.history.length > 0 || state.pending !== null,
    dirty,
    savedId: state.savedId,
    historyLength: state.history.length,
    ...actions,
  };
}

export type DocumentApi = ReturnType<typeof useDocument>;
