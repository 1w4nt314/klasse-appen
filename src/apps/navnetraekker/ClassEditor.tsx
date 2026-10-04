"use client";

import { useRef, useState } from "react";
import {
  createClass,
  duplicateNames,
  exportStore,
  MAX_STUDENTS,
  parseImport,
  parseNames,
  updateStudents,
  type ClassList,
  type Store,
} from "./store";

export function ClassEditor({
  cls,
  store,
  onSave,
  onImport,
  onDelete,
  onCancel,
}: {
  /** null = ny klasse. */
  cls: ClassList | null;
  store: Store;
  onSave: (cls: ClassList, isNew: boolean) => void;
  onImport: (classes: ClassList[]) => void;
  onDelete: (id: string) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(cls?.name ?? "");
  const [text, setText] = useState(cls ? cls.students.map((s) => s.name).join("\n") : "");
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const names = parseNames(text);
  const dupes = duplicateNames(names);
  const tooMany = text.split(/[\n,;]+/).filter((n) => n.trim()).length > MAX_STUDENTS;

  const save = () => {
    if (names.length === 0) return;
    if (cls) onSave({ ...updateStudents(cls, names), name: name.trim() || cls.name }, false);
    else onSave(createClass(name, names), true);
  };

  const download = () => {
    const blob = new Blob([exportStore(store)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "klasselister-navnetraekker.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const readFile = async (file: File) => {
    setImportError(null);
    try {
      onImport(parseImport(await file.text()));
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Filen kunne ikke læses.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-2xl font-semibold text-brand-strong">
          {cls ? "Ret klasseliste" : "Ny klasse"}
        </h2>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-bold">Navn på klassen</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Fx 4.b eller Matematik hold 2"
            className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
            Elever – én pr. linje
            <span className="font-normal text-muted tabular-nums">{names.length} elever</span>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder={"Ida\nNoah\nFreja\nMarkus M.\nMarkus L."}
            className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 font-mono text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <p className="mt-1.5 text-xs text-muted">
          Du kan indsætte direkte fra et regneark eller Aula. Brug gerne kun fornavn og evt. forbogstav.
        </p>

        {dupes.length > 0 && (
          <p className="mt-3 rounded-control bg-accent-soft px-3 py-2 text-sm text-accent">
            Der er flere med navnet <strong>{dupes.join(", ")}</strong>. Tilføj et forbogstav, så
            klassen kan se, hvem der er trukket.
          </p>
        )}
        {tooMany && (
          <p className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
            Der kan højst være {MAX_STUDENTS} elever i en klasse. Resten er ikke med.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={names.length === 0}
            className="rounded-control bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-strong disabled:opacity-60"
          >
            {cls ? "Gem ændringer" : "Opret klasse"}
          </button>
          {onCancel && !cls && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-control border border-line-strong px-5 py-2.5 font-bold hover:border-brand hover:text-brand"
            >
              Annullér
            </button>
          )}
          {cls && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Slet klassen “${cls.name}”? Det kan ikke fortrydes.`)) onDelete(cls.id);
              }}
              className="ml-auto rounded-control px-4 py-2.5 font-bold text-danger hover:bg-danger-soft"
            >
              Slet klasse
            </button>
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-card border border-line bg-surface p-5">
          <h3 className="font-extrabold">Gemt kun på denne computer</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Navnene gemmes kun her i browseren og sendes aldrig til Klasse-appen. Skal du bruge
            listerne på en anden computer, så gem en fil og åbn den derovre.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={download}
              disabled={store.classes.length === 0}
              className="rounded-control border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand disabled:opacity-50"
            >
              Gem klasselister som fil
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-control border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand"
            >
              Hent klasselister fra fil
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = "";
              }}
            />
          </div>
          {importError && (
            <p role="alert" className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
              {importError}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
