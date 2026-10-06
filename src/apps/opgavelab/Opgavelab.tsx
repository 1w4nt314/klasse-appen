"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { kindNoun } from "./core/format";
import type { AppProps } from "../runtime";
import { deleteDoc, listDocs, loadDoc, saveDoc } from "./actions";
import type { DocSummary } from "./actions";
import { ConfirmDialog, fmtTime, fmtWhen, LoadDialog, SaveAsDialog } from "./editor/dialogs";
import { PageBar } from "./editor/PageBar";
import { PropertiesPanel } from "./editor/PropertiesPanel";
import { SheetEditor } from "./editor/SheetEditor";
import { ToolPanel } from "./editor/ToolPanel";
import { TopBar, type ExportedFiles, type TopStatus, type View } from "./editor/TopBar";
import { useDocument, type FitFigure } from "./editor/useDocument";
import { buildPdfs, downloadBlob, downloadBoth, preparePdfExport, type PdfFiles } from "./export/pdf";
import { makeDrill, makeFigure, makeFormula, makeText, newDocument, newSeed } from "./model/document";
import { calcDriftInfo, defOf, displayName, solveParam } from "./model/figures";
import { LIMITS } from "./model/types";
import type { Document as SheetDoc, FigureObject, ParamState } from "./model/types";
import { cleanName, parseDocument } from "./model/validate";
import { loadSheetFonts, measureText, useSheetMeasure } from "./render/measure";
import type { Measure } from "./render/textLayout";
import { calcStray, placeCalc } from "./render/placeCalc";
import { layoutFormula, numberSheet } from "./render/drillLayout";
import { blockProblem, blockProblemText, figureProblem, fitFigure, placeBlock, placeFigure, placeOnPage, placeText } from "./render/placeBlock";
import { SheetSvg } from "./render/SheetSvg";
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
  | { kind: "deleteDoc"; doc: DocSummary }
  /** Slet siden `index` (0-baseret), som har `count` objekter (regnestykker tæller med). */
  | { kind: "deletePage"; index: number; count: number }
  | { kind: "exportWarn"; unsolved: string[]; formula: string[]; drift: string[]; layout: string[]; layoutTitle: string };

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

const EXPORT_FAILED = "PDF-eksporten mislykkedes. Prøv igen — virker det stadig ikke, så genindlæs siden.";
const NEED_NAME = "Giv opgaven et navn først — navnet bruges som filnavn på de to PDF-filer.";

/**
 * Regnestykker, som svararket ikke kan udregne (vises som "?"), fx ["1a (X)"]; formel-linjer, der
 * ikke kan regnes ud (svararket viser "= ?"), fx ["2b (3 · (4 +)"]; regnestykker, hvis facit
 * (regnet på de viste tal) afviger tydeligt fra figuren (calcDrift), fx
 * ["Svararket vil vise a ≈ 0,0 cm for 1a, men siden er tegnet 1,0 cm"]; og blokke, der går ud
 * over arket eller dækker andet, som færdige sætninger.
 */
function calcWarnings(
  doc: SheetDoc,
  numbering: ReadonlyMap<string, string>,
  measure: Measure,
): { unsolved: string[]; formula: string[]; drift: string[]; layout: string[]; layoutTitle: string } {
  const unsolved: string[] = [];
  const formula: string[] = [];
  const drift: string[] = [];
  // Blokke, der går ud over arket eller dækker andre objekter, fx "Regneark 1 går ud over arkets bund — …".
  const layout: string[] = [];
  let drillLayout = false;
  let figureLayout = false;
  let strayLayout = false;
  for (const o of doc.objects) {
    if (o.type === "figure") {
      // Figurer, der går ud over margenen (fx et langt navn på en størrelse); overlap markeres kun i editoren.
      const p = figureProblem(doc, o, numbering, measure);
      if (!p || p.outside.length === 0) continue;
      figureLayout = true;
      const nr = numbering.get(o.id) ?? "";
      layout.push(
        ...blockProblemText({ outside: p.outside, covers: [] }, `${defOf(o).name} ${nr}`.trim()).map(
          (t) => `${t} — flyt den, gør den mindre, eller giv størrelserne kortere navne.`,
        ),
      );
      continue;
    }
    if (o.type !== "drill" && o.type !== "formula") continue;
    const nr = numbering.get(o.id) ?? "";
    if (o.type === "formula") {
      for (const it of layoutFormula(o, nr, measure).items) if (it.error) formula.push(`${it.label} (${it.text.replace(/ =$/, "")})`);
    }
    const p = blockProblem(doc, o, numbering, measure);
    if (!p) continue;
    if (o.type === "drill") drillLayout = true;
    const suffix = o.type === "drill" ? "flyt det, eller vælg færre opgaver." : "flyt den, eller fjern nogle linjer.";
    layout.push(...blockProblemText(p, `${o.type === "drill" ? "Regneark" : "Formler"} ${nr}`.trim()).map((t) => `${t} — ${suffix}`));
  }
  for (const o of doc.objects) {
    if (o.type !== "calc") continue;
    const fig = doc.objects.find((f): f is FigureObject => f.type === "figure" && f.id === o.figureId);
    const num = numbering.get(o.id);
    // Regnestykket står ved en anden figur (eller et regneark) end sin egen: eleven kan ikke se, hvad "2a" hører til.
    const strayId = fig ? calcStray(doc, o, numbering, measure) : null;
    const stray = strayId ? doc.objects.find((x) => x.id === strayId) : undefined;
    if (fig && stray) {
      strayLayout = true;
      const figName = `figur ${numbering.get(fig.id) ?? ""}`.trim();
      const kind = stray.type === "figure" ? "figur" : stray.type === "drill" ? "regneark" : "formlerne";
      const otherName = `${kind} ${numbering.get(stray.id) ?? ""}`.trim();
      layout.push(`Regnestykke ${num ?? ""} hører til ${figName}, men står ved ${otherName} — flyt det hen til ${figName}.`);
    }
    if (fig && solveParam(fig, o.param, doc.settings)) {
      const d = calcDriftInfo(fig, o.param, doc.settings);
      if (d)
        drift.push(
          `Svararket vil vise ${d.name} ${d.approx ? "≈" : "="} ${d.result}${num ? ` for ${num}` : ""}, men ${
            kindNoun(d.kind)
          } er tegnet ${d.drawn}`,
        );
      continue;
    }
    const name = fig ? displayName(fig, o.param) : o.param;
    unsolved.push(num ? `${num} (${name})` : name);
  }
  return {
    unsolved,
    formula,
    drift,
    layout,
    layoutTitle: drillLayout
      ? "Regnearket passer ikke på arket"
      : figureLayout
        ? "En figur går ud over arket"
        : strayLayout && !layout.some((t) => !t.startsWith("Regnestykke "))
          ? "Et regnestykke står ved en anden figur"
          : "Formlerne passer ikke på arket",
  };
}

/** "1a (X)" / "1a (X) og 2b (c)". */
function joinList(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
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
  const numbering = useMemo(() => numberSheet(d.doc, measure), [d.doc, measure]);

  // Værktøjsknapperne: faste handlere (ToolPanel er memo), så værktøjspanelet ikke tegnes om ved hvert
  // træk-trin. Placeringen regnes ud fra det seneste dokument (ref'en opdateres efter hver render).
  const placeRef = useRef({ doc: d.doc, measure, page: d.page });
  useEffect(() => {
    placeRef.current = { doc: d.doc, measure, page: d.page };
  });
  const { addText, addFigure, addDrill, addFormula } = d;
  const toolHandlers = useMemo(
    () => ({
      onAddText: () => {
        // Første ledige plads, så teksten ikke lægges oven på en figur (figurer står nu øverst til venstre).
        const { doc, measure, page } = placeRef.current;
        const at = placeText(doc, makeText("probe", 0, page), measure, page);
        addText({ x: at.x, y: at.y });
      },
      onAddFigure: (kind: Parameters<typeof addFigure>[0]) => {
        // Placering i event-handleren: første ledige plads (som regneark), så figurer ikke lægges oven i hinanden.
        const { doc, measure, page } = placeRef.current;
        const probe = makeFigure("probe", kind, 0, page);
        const at = probe ? placeFigure(doc, probe, measure, page) : null;
        addFigure(kind, at ? { x: at.x, y: at.y } : undefined);
      },
      onAddDrill: () => {
        // Seed og placering i event-handleren: første ledige plads, så blokken ikke dækker noget.
        const { doc, measure, page } = placeRef.current;
        const seed = newSeed();
        const at = placeBlock(doc, makeDrill("probe", 0, seed, page), measure, page);
        addDrill(seed, { x: at.x, y: at.y });
      },
      onAddFormula: () => {
        const { doc, measure, page } = placeRef.current;
        const at = placeBlock(doc, makeFormula("probe", 0, page), measure, page);
        addFormula({ x: at.x, y: at.y });
      },
    }),
    [addText, addFigure, addDrill, addFormula],
  );

  // ---- Persistens ----
  const [dialog, setDialog] = useState<DialogState>(null);
  const [err, setErr] = useState<string | null>(null);
  const [savedText, setSavedText] = useState<string | null>(null);
  // Besked efter indlæsning (fx "Navnet X var brugt to gange — a hedder igen a"); vises til næste ændring.
  const [loadNote, setLoadNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "other" | null>(null);
  const busyRef = useRef(false);
  const [docs, setDocs] = useState<DocSummary[] | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);

  // ---- PDF-eksport ----
  const [exporting, setExporting] = useState(false);
  const exportingRef = useRef(false);
  // Dokumentet, der lige nu eksporteres (monteres skjult uden editor-overlay).
  const [stageDoc, setStageDoc] = useState<SheetDoc | null>(null);
  const opgaveSvgRef = useRef<SVGSVGElement>(null);
  const svarSvgRef = useRef<SVGSVGElement>(null);
  // Seneste eksport (Blobs), så hver fil kan hentes igen. Gælder kun det uændrede dokument.
  const [exported, setExported] = useState<{ doc: SheetDoc; files: PdfFiles } | null>(null);

  const { select: selectObject, remove: removeObject, setParam: setParamRaw } = d;
  // Panelændringer på en figur (navn, Vis): gør et nyt navn figuren bredere end pladsen ved margenen, skubbes
  // den ind på arket (fitFigure); kan den ikke være der, markeres den (figureProblem: panel, overlay, eksport).
  const setParam = useCallback(
    (id: string, param: string, patch: Partial<ParamState>, key?: string) => {
      const fit: FitFigure = (fig, doc) => fitFigure(fig, numberSheet(doc, measure).get(fig.id) ?? "", measure);
      setParamRaw(id, param, patch, key, fit);
    },
    [setParamRaw, measure],
  );

  // ---- Sider ----
  const { removePage: removePageRaw, moveToPage: moveToPageRaw } = d;
  /** Efter en sletning: lad fokus blive i sidebjælken (knappen kan være blevet deaktiveret, eller dialogen lukket). */
  const refocusPageBar = () =>
    window.setTimeout(() => {
      const a = document.activeElement;
      if (a && a !== document.body && !(a instanceof HTMLButtonElement && a.disabled)) return;
      document.querySelector<HTMLElement>("[data-ol-page-tab][aria-pressed=true], [data-ol-page-select]")?.focus();
    }, 60);
  /** "Slet side": en tom side straks, en side med indhold først efter bekræftelse (Ctrl+Z gendanner den). */
  function onRemovePage() {
    const cur = latest.current;
    const index = cur.page;
    if (cur.doc.pageCount <= 1) return;
    const count = cur.doc.objects.filter((o) => o.page === index).length;
    if (count === 0) {
      cur.removePage(index);
      refocusPageBar();
    } else {
      setDialog({ kind: "deletePage", index, count });
    }
  }
  /** Panelets "Side": figur, tekst eller blok til en anden side (en figur tager sine regnestykker med). */
  const moveToPage = useCallback(
    (id: string, page: number) => {
      const { doc, measure } = placeRef.current;
      const o = doc.objects.find((x) => x.id === id);
      if (!o || o.type === "calc" || o.page === page) return;
      const at = placeOnPage(doc, o, page, measure);
      setAskDelete(null);
      moveToPageRaw(id, page, at);
    },
    [moveToPageRaw],
  );

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
      setLoadNote(null);
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
    setLoadNote(null);
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
    const notes = [...(Array.isArray(res.notes) ? res.notes : [])];
    const parsed = parseDocument(res.doc, notes);
    if (!parsed) return setErr("Opgaven kan ikke åbnes — indholdet er beskadiget.");
    setAskDelete(null);
    d.replace({ ...parsed, name: res.name }, res.id);
    setSavedText(savedLabel(doc.updatedAt));
    setLoadNote(notes.length > 0 ? `${notes.join(". ")}.` : null);
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
      setLoadNote(null);
    }
    void showLoad();
  }

  async function runExport(doc: SheetDoc, name: string) {
    if (exportingRef.current) return;
    exportingRef.current = true;
    setExporting(true);
    setErr(null);
    setDialog(null);
    try {
      // Biblioteker og fontbytes hentes først nu (ikke i sidens første JavaScript).
      await Promise.all([preparePdfExport(), loadSheetFonts()]);
      await document.fonts.ready;
      flushSync(() => setStageDoc(doc));
      const opgaveSvg = opgaveSvgRef.current;
      const svarSvg = svarSvgRef.current;
      if (!opgaveSvg || !svarSvg) throw new Error("Eksport-arkene blev ikke monteret");
      const files = await buildPdfs({ opgaveSvg, svarSvg, name });
      setStageDoc(null);
      setExported({ doc, files });
      await downloadBoth(files);
    } catch (e) {
      console.warn("Opgavelab: PDF-eksport fejlede", e);
      setErr(EXPORT_FAILED);
    } finally {
      setStageDoc(null);
      exportingRef.current = false;
      setExporting(false);
    }
  }

  function onExport() {
    if (exportingRef.current) return;
    const doc = latest.current.doc;
    const name = cleanName(doc.name);
    if (!name) {
      setDialog(null);
      setErr(NEED_NAME);
      document.querySelector<HTMLInputElement>(".ol-name input")?.focus();
      return;
    }
    const w = calcWarnings(doc, numberSheet(doc, measure), measure);
    if (w.unsolved.length > 0 || w.formula.length > 0 || w.drift.length > 0 || w.layout.length > 0) {
      setErr(null);
      setDialog({ kind: "exportWarn", ...w });
    } else void runExport(doc, name);
  }

  const exportedFiles: ExportedFiles | null =
    exported && exported.doc === d.doc
      ? {
          opgaveName: exported.files.opgave.fileName,
          svarName: exported.files.svarark.fileName,
          onAgain: (which) => {
            const f = exported.files[which];
            downloadBlob(f.blob, f.fileName);
          },
          onClose: () => setExported(null),
        }
      : null;

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
      if (e.key === "Escape" && !e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const cur = latest.current;
        if (cur.selectedId) {
          e.preventDefault();
          setAskDelete(null);
          cur.select(null);
          // Panelet forsvinder: læg fokus på arket, så tastaturbrugeren ikke mister sin plads.
          const target = e.target;
          if (target instanceof Element && target.closest(".ol-props, .ol-sheet")) {
            document.querySelector<SVGSVGElement>(".ol-sheet svg")?.focus({ preventScroll: true });
          }
        }
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
          : loadNote
            ? { text: loadNote, tone: "warn" }
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
        onExport={onExport}
        exporting={exporting}
        exported={exportedFiles}
        busy={busy !== null}
        status={status}
      />
      <ToolPanel
        {...toolHandlers}
        full={d.doc.objects.length >= LIMITS.objects}
      />
      <main className="ol-main">
        <PageBar
          page={d.page}
          pageCount={d.doc.pageCount}
          onPage={d.setPage}
          onAdd={d.addPage}
          onRemove={onRemovePage}
          onMove={d.movePage}
        />
        <SheetEditor
          doc={d.doc}
          mode={view}
          page={d.page}
          onPage={d.setPage}
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
        measure={measure}
        askDelete={askDelete}
        onUpdate={d.update}
        onSetParam={setParam}
        onAddCalc={(figureId, param) => {
          const fig = d.doc.objects.find((o) => o.type === "figure" && o.id === figureId);
          if (!fig || fig.type !== "figure") return;
          const at = placeCalc(d.doc, fig, param, measure);
          d.addCalc(figureId, param, at.x, at.y);
        }}
        onSelect={select}
        onMoveToPage={moveToPage}
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
      {dialog?.kind === "deletePage" && (
        <ConfirmDialog
          title="Slet side"
          message={`Slet side ${dialog.index + 1} og dens ${dialog.count} ${
            dialog.count === 1 ? "objekt" : "objekter"
          }? Du kan fortryde med Fortryd (Ctrl+Z).`}
          confirmLabel="Slet side"
          danger
          onCancel={closeDialog}
          onConfirm={() => {
            removePageRaw(dialog.index);
            setDialog(null);
            refocusPageBar();
          }}
        />
      )}
      {dialog?.kind === "exportWarn" && (
        <ConfirmDialog
          title={
            dialog.unsolved.length > 0
              ? "Ikke alle regnestykker kan løses"
              : dialog.formula.length > 0
                ? "Ikke alle formler kan regnes ud"
                : dialog.drift.length > 0
                  ? "Svararket afviger fra figuren"
                  : dialog.layoutTitle
          }
          message={[
            dialog.unsolved.length > 0
              ? `Svararket vil vise ? for ${joinList(dialog.unsolved)}, fordi ${
                  dialog.unsolved.length === 1 ? "den" : "de"
                } ikke kan findes ud fra det, der er synligt på figuren.`
              : "",
            dialog.formula.length > 0
              ? `Svararket vil vise ? for ${joinList(dialog.formula)}, fordi ${
                  dialog.formula.length === 1 ? "stykket" : "stykkerne"
                } ikke kan regnes ud — se fejlen i formelblokkens panel.`
              : "",
            ...dialog.drift.map((t) => `${t} — vis fx andre størrelser.`),
            ...dialog.layout,
            "Eksportér alligevel?",
          ]
            .filter(Boolean)
            .join(" ")}
          confirmLabel="Eksportér alligevel"
          onCancel={closeDialog}
          onConfirm={() => {
            const name = cleanName(latest.current.doc.name);
            if (name) void runExport(latest.current.doc, name);
            else closeDialog();
          }}
        />
      )}
      {stageDoc && (
        <div className="ol-export-stage" aria-hidden="true" data-ol-export-stage="">
          <SheetSvg doc={stageDoc} mode="opgave" measure={measureText} svgRef={opgaveSvgRef} />
          <SheetSvg doc={stageDoc} mode="svarark" measure={measureText} svgRef={svarSvgRef} />
        </div>
      )}
    </div>
  );
}
