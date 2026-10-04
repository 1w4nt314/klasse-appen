"use client";

import { useRef, useState } from "react";
import {
  createClass,
  duplicateNames,
  exportStore,
  MAX_CLASSES,
  MAX_NAME_LENGTH,
  MAX_STUDENTS,
  parseImport,
  parseNames,
  splitNames,
  updateStudents,
  type ClassList,
  type Store,
  type StudentRow,
} from "./store";

export function ClassEditor({
  cls,
  store,
  onSave,
  onImport,
  onDelete,
  onCancel,
  onClearAll,
}: {
  /** null = ny klasse. */
  cls: ClassList | null;
  store: Store;
  onSave: (cls: ClassList, isNew: boolean) => void;
  onImport: (classes: ClassList[]) => void;
  onDelete: (id: string) => void;
  onCancel?: () => void;
  onClearAll: () => void;
}) {
  const [name, setName] = useState(cls?.name ?? "");
  // Ny klasse: ét tekstfelt. Eksisterende klasse: én række pr. elev, så hver
  // elev beholder sin plads i runden og sit fravær, uanset omdøbning og dubletter.
  const [rows, setRows] = useState<StudentRow[]>(
    () => cls?.students.map((s) => ({ id: s.id, name: s.name })) ?? [],
  );
  const [text, setText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pasted = splitNames(text);
  const names = cls
    ? [...rows.map((r) => r.name.trim()).filter(Boolean), ...pasted]
    : pasted;
  const dupes = duplicateNames(names);
  const tooMany = names.length > MAX_STUDENTS;
  const atClassLimit = !cls && store.classes.length >= MAX_CLASSES;

  const save = () => {
    if (names.length === 0 || atClassLimit) return;
    if (cls) {
      const all = [...rows, ...pasted.map((n) => ({ name: n }))];
      onSave({ ...updateStudents(cls, all), name: name.trim() || cls.name }, false);
    } else onSave(createClass(name, parseNames(text)), true);
  };

  const importDisabled = store.classes.length >= MAX_CLASSES;

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
      if (file.size > 1_000_000) throw new Error("Filen er for stor til at være en klasseliste.");
      const room = MAX_CLASSES - store.classes.length;
      const classes = parseImport(await file.text());
      if (classes.length > room)
        throw new Error(
          `Filen har ${classes.length} klasser, men der er kun plads til ${Math.max(room, 0)} mere (højst ${MAX_CLASSES}). Slet nogle klasser først.`,
        );
      onImport(classes);
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

        {cls && (
          <div className="mt-4">
            <p className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
              Elever
              <span className="font-normal text-muted tabular-nums">{names.length} elever</span>
            </p>
            {rows.length === 0 ? (
              <p className="text-sm text-muted">Ingen elever endnu.</p>
            ) : (
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {rows.map((r, i) => (
                  <li key={r.id ?? i} className="flex gap-1.5">
                    <input
                      value={r.name}
                      maxLength={MAX_NAME_LENGTH}
                      aria-label={`Elev ${i + 1}`}
                      onChange={(e) =>
                        setRows((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                      }
                      className="min-w-0 flex-1 rounded-control border border-line-strong bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <button
                      type="button"
                      onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                      aria-label={`Fjern ${r.name || `elev ${i + 1}`}`}
                      className="rounded-control px-2 text-sm font-bold text-muted hover:bg-danger-soft hover:text-danger"
                    >
                      Fjern
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <label className="mt-4 block">
          <span className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
            {cls ? "Tilføj nye elever – én pr. linje" : "Elever – én pr. linje"}
            {!cls && <span className="font-normal text-muted tabular-nums">{names.length} elever</span>}
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={cls ? 4 : 12}
            placeholder={cls ? "Nye elever …" : "Ida\nNoah\nFreja\nMarkus M.\nMarkus L."}
            className="block w-full rounded-control border border-line-strong bg-surface px-3 py-2.5 font-mono text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <p className="mt-1.5 text-xs text-muted">
          Du kan indsætte direkte fra et regneark eller Aula. Brug gerne kun fornavn og evt. forbogstav.
        </p>
        {atClassLimit && (
          <p className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
            Du har {MAX_CLASSES} klasser, som er det højeste antal. Slet en klasse for at oprette en ny.
          </p>
        )}

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
            disabled={names.length === 0 || atClassLimit}
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
              disabled={importDisabled}
              className="rounded-control border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand disabled:opacity-50"
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
          <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-muted">
            Listerne bliver liggende her efter du logger ud. Bruger du en fælles computer, så slet
            dem, når du er færdig.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Slet alle dine klasselister fra denne computer? Gem dem evt. som fil først."))
                onClearAll();
            }}
            disabled={store.classes.length === 0}
            className="mt-2 w-full rounded-control px-4 py-2 text-sm font-bold text-danger hover:bg-danger-soft disabled:opacity-50"
          >
            Slet alle klasselister fra denne computer
          </button>
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
