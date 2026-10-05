"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { numberDocument } from "./core/numbering";
import type { AppProps } from "../runtime";
import { deleteDoc, listDocs, loadDoc, saveDoc } from "./actions";
import type { DocSummary } from "./actions";
import { ConfirmDialog, fmtTime, fmtWhen, LoadDialog, SaveAsDialog } from "./editor/dialogs";
import { PropertiesPanel } from "./editor/PropertiesPanel";
import { SheetEditor } from "./editor/SheetEditor";
import { ToolPanel } from "./editor/ToolPanel";
import { TopBar, type TopStatus, type View } from "./editor/TopBar";
import { useDocument } from "./editor/useDocument";
import { newDocument } from "./model/document";
import { figureBoundsOnSheet } from "./model/figures";
import { LIMITS } from "./model/types";
import { parseDocument } from "./model/validate";
import { useSheetMeasure } from "./render/measure";
import { placeCalc } from "./render/placeCalc";
import "./opgavelab.css";

function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT";
}

type DialogState =
  | null
  | { kind: "saveAs"; copy: boolean; name: string }
  | { kind: "load" }
  | { kind: "discard"; next: "new" | "load" }
  | { kind: "overwrite"; name: string; copy: boolean }
  | { kind: "deleteDoc"; doc: DocSummary };

const STALE = "Siden er blevet opdateret — genindlæs siden (dine ændringer er ikke gemt).";
const OFFLINE = "Forbindelsen svigtede. Prøv igen om lidt — dine ændringer er ikke gemt.";

/** Kører en server action; en kastet fejl (ny deploy, udløbet session, netværk) bliver til en venlig tekst. */
async function guarded<T>(fn: () => Promise<T>): Promise<{ value: T } | { thrown: string }> {
  try {
    return { value: await fn() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const stale = /Failed to find Server Action|Server Action .* was not found|failed-to-find-server-action|unexpected response was received|Server action not found/i.test(msg);
    return { thrown: stale ? STALE : OFFLINE };
  }
}

/** "Gemt kl. 14.32" (i dag) eller "Gemt 5. okt. kl. 14.32". Kaldes kun fra hændelser, ikke under rendering. */
function savedLabel(ts: number): string {
  return new Date(ts).toDateString() === new Date().toDateString() ? `Gemt kl. ${fmtTime(ts)}` : `Gemt ${fmtWhen(ts)}`;
}

export default function Opgavelab({ userKey }: AppProps) {
  void userKey; // persistens er på serveren (lærerens konto); nøglen holder klientstate adskilt
  const d = useDocument();
  const measure = useSheetMeasure();
  const [view, setView] = useState<View>("opgave");
  // Figur (eller objekt), der venter på sletbekræftelse.
  const [askDelete, setAskDelete] = useState<string | null>(null);
  const numbering = useMemo(() => numberDocument(d.doc, figureBoundsOnSheet), [d.doc]);

  // ---- Persistens ----
  const [dialog, setDialog] = useState<DialogState>(null);
  const [err, setErr] = useState<string | null>(null);
  const [savedText, setSavedText] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "other" | null>(null);
  const busyRef = useRef(false);
  const [docs, setDocs] = useState<DocSummary[] | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);

  const { select: selectObject, remove: removeObject } = d;
  const select = useCallback(
    (id: string | null) => {
      setAskDelete(null);
      selectObject(id);
    },
    [selectObject],
  );
  const remove = useCallback(
    (id: string) => {
      setAskDelete(null);
      removeObject(id);
    },
    [removeObject],
  );

  // Seneste tilstand til tastaturgenveje uden at gentilmelde lytteren ved hvert træk.
  const latest = useRef(d);
  useEffect(() => {
    latest.current = d;
  });

  /** Én server-handling ad gangen (UI'et låser knapperne imens). */
  async function exclusive<T>(kind: "save" | "other", fn: () => Promise<T>): Promise<{ value: T } | { thrown: string } | null> {
    if (busyRef.current) return null;
    busyRef.current = true;
    setBusy(kind);
    setErr(null);
    try {
      return await guarded(fn);
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }

  async function doSave(rawName: string, opts: { overwrite?: boolean; copy?: boolean } = {}) {
    const prevName = latest.current.doc.name;
    const snapshot = { ...latest.current.doc, name: rawName };
    const id = opts.copy ? null : latest.current.savedId;
    const r = await exclusive("save", () => saveDoc({ id, name: rawName, data: snapshot, overwrite: opts.overwrite === true }));
    if (!r) return;
    if ("thrown" in r) return setErr(r.thrown);
    const res = r.value;
    if (res.ok) {
      d.markSaved(res.id, res.name, snapshot, prevName);
      setSavedText(savedLabel(res.updatedAt));
      setDialog(null);
    } else if (res.error === "exists") {
      const name = rawName.replace(/\s+/g, " ").trim();
      if (res.existsId) setDialog({ kind: "overwrite", name, copy: opts.copy === true });
      else setErr(`Der findes allerede en opgave med navnet ${name}.`);
    } else {
      setErr(res.error);
    }
  }

  function onSave() {
    const name = d.doc.name;
    if (name.trim() === "") {
      setErr(null);
      setDialog({ kind: "saveAs", copy: false, name: "" });
    } else void doSave(name);
  }

  function onSaveCopy() {
    const base = d.doc.name.trim();
    const name = base ? `${base.slice(0, LIMITS.nameChars - 7)} (kopi)` : "";
    setErr(null);
    setDialog({ kind: "saveAs", copy: true, name });
  }

  async function showLoad() {
    setErr(null);
    setDocs(null);
    setDocsLoading(true);
    setDialog({ kind: "load" });
    const r = await exclusive("other", () => listDocs());
    setDocsLoading(false);
    if (!r) return;
    if ("thrown" in r) return setErr(r.thrown);
    if (r.value === null) return setErr("Kunne ikke hente dine opgaver. Prøv igen om lidt.");
    setDocs(r.value);
  }

  function resetEditor() {
    setAskDelete(null);
    setErr(null);
    setSavedText(null);
    d.replace(newDocument());
    setDialog(null);
  }

  function onNew() {
    if (d.dirty) setDialog({ kind: "discard", next: "new" });
    else resetEditor();
  }

  function onLoad() {
    if (d.dirty) setDialog({ kind: "discard", next: "load" });
    else void showLoad();
  }

  async function openDoc(doc: DocSummary) {
    const r = await exclusive("other", () => loadDoc(doc.id));
    if (!r) return;
    if ("thrown" in r) return setErr(r.thrown);
    const res = r.value;
    if (!res.ok) return setErr(res.error);
    // Valideres igen i klienten, før det når editoren.
    const parsed = parseDocument(res.doc);
    if (!parsed) return setErr("Opgaven kan ikke åbnes — indholdet er beskadiget.");
    setAskDelete(null);
    d.replace({ ...parsed, name: res.name }, res.id);
    setSavedText(savedLabel(doc.updatedAt));
    setDialog(null);
  }

  async function removeDoc(doc: DocSummary) {
    const r = await exclusive("other", () => deleteDoc(doc.id));
    if (!r) return;
    if ("thrown" in r) return setErr(r.thrown);
    if (!r.value.ok && r.value.error !== "Opgaven findes ikke.") return setErr(r.value.error);
    if (doc.id === latest.current.savedId) {
      d.markUnsaved();
      setSavedText(null);
    }
    void showLoad();
  }

  const act = useRef({ save: onSave });
  useEffect(() => {
    act.current = { save: onSave };
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (document.querySelector("dialog[open]")) return; // en dialog er åben
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        act.current.save();
        return;
      }
      if (isTyping(e.target)) return;
      const cur = latest.current;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        cur.undo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && !e.ctrlKey && !e.metaKey && cur.selectedId) {
        e.preventDefault();
        const sel = cur.selected;
        // En figur med regnestykker spørger først (PropertiesPanel viser bekræftelsen).
        if (sel?.type === "figure" && cur.doc.objects.some((o) => o.type === "calc" && o.figureId === sel.id)) {
          setAskDelete(sel.id);
        } else {
          setAskDelete(null);
          cur.remove(cur.selectedId);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!d.dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [d.dirty]);

  const status: TopStatus | null =
    busy === "save"
      ? { text: "Gemmer…", tone: "warn" }
      : err && !dialog
        ? { text: err, tone: "error" }
        : d.dirty
          ? { text: "Ikke gemt", tone: "warn" }
          : savedText
            ? { text: savedText, tone: "ok" }
            : null;

  const closeDialog = () => {
    setErr(null);
    setDialog(null);
  };

  return (
    <div className="ol-root">
      <TopBar
        view={view}
        onView={setView}
        name={d.doc.name}
        onName={d.setName}
        canUndo={d.canUndo}
        onUndo={d.undo}
        onNew={onNew}
        onSave={onSave}
        onSaveCopy={d.savedId ? onSaveCopy : null}
        onLoad={onLoad}
        busy={busy !== null}
        status={status}
      />
      <ToolPanel onAddText={d.addText} onAddFigure={d.addFigure} full={d.doc.objects.length >= LIMITS.objects} />
      <main className="ol-main">
        <SheetEditor
          doc={d.doc}
          mode={view}
          selectedId={d.selectedId}
          measure={measure}
          onSelect={select}
          onMove={d.move}
          onReshape={d.reshape}
          onCommit={d.commit}
        />
      </main>
      <PropertiesPanel
        doc={d.doc}
        selected={d.selected}
        numbering={numbering}
        askDelete={askDelete}
        onUpdate={d.update}
        onSetParam={d.setParam}
        onAddCalc={(figureId, param) => {
          const fig = d.doc.objects.find((o) => o.type === "figure" && o.id === figureId);
          if (!fig || fig.type !== "figure") return;
          const at = placeCalc(d.doc, fig, param, measure);
          d.addCalc(figureId, param, at.x, at.y);
        }}
        onSelect={select}
        onRequestDelete={setAskDelete}
        onCancelDelete={() => setAskDelete(null)}
        onRemove={remove}
        onSettings={d.setSettings}
      />
      {dialog?.kind === "saveAs" && (
        <SaveAsDialog
          title={dialog.copy ? "Gem som kopi" : "Gem opgaven"}
          initialName={dialog.name}
          error={err}
          busy={busy === "save"}
          onSave={(name) => void doSave(name, { copy: dialog.copy })}
          onClose={closeDialog}
        />
      )}
      {dialog?.kind === "load" && (
        <LoadDialog
          docs={docs}
          loading={docsLoading}
          error={err}
          busy={busy !== null}
          currentId={d.savedId}
          onOpen={(doc) => void openDoc(doc)}
          onDelete={(doc) => {
            setErr(null);
            setDialog({ kind: "deleteDoc", doc });
          }}
          onClose={closeDialog}
        />
      )}
      {dialog?.kind === "discard" && (
        <ConfirmDialog
          title="Ugemte ændringer"
          message="Du har ugemte ændringer. Fortsæt uden at gemme?"
          confirmLabel="Fortsæt"
          onCancel={closeDialog}
          onConfirm={() => {
            if (dialog.next === "new") resetEditor();
            else void showLoad();
          }}
        />
      )}
      {dialog?.kind === "overwrite" && (
        <ConfirmDialog
          title="Navnet er i brug"
          message={`Der findes allerede en opgave med navnet ${dialog.name}. Overskriv?`}
          confirmLabel="Overskriv"
          danger
          busy={busy === "save"}
          error={err}
          onCancel={() => {
            setErr(null);
            setDialog({ kind: "saveAs", copy: dialog.copy, name: dialog.name });
          }}
          onConfirm={() => void doSave(dialog.name, { overwrite: true, copy: dialog.copy })}
        />
      )}
      {dialog?.kind === "deleteDoc" && (
        <ConfirmDialog
          title="Slet opgaven"
          message={`Slet opgaven ${dialog.doc.name} for altid?${
            dialog.doc.id === d.savedId ? " Den er åben lige nu og bliver ugemt i editoren." : ""
          }`}
          confirmLabel="Slet"
          danger
          busy={busy !== null}
          error={err}
          onCancel={() => void showLoad()}
          onConfirm={() => void removeDoc(dialog.doc)}
        />
      )}
    </div>
  );
}
