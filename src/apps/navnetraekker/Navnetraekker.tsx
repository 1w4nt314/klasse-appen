"use client";

import Link from "next/link";
import { useState } from "react";
import { ClassEditor } from "./ClassEditor";
import { DrawView } from "./DrawView";
import { GroupsView } from "./GroupsView";
import { useStore } from "./useStore";
import "./navnetraekker.css";

type View = "draw" | "groups" | "list";

const VIEWS: { id: View; label: string }[] = [
  { id: "draw", label: "Træk navn" },
  { id: "groups", label: "Grupper" },
  { id: "list", label: "Klasseliste" },
];

export default function Navnetraekker() {
  const { store, active, updateClass, addClasses, removeClass, selectClass, saveFailed } =
    useStore();
  const [view, setView] = useState<View>(active ? "draw" : "list");
  const [creating, setCreating] = useState(false);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const showEditor = !active || creating || view === "list";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
          <Link
            href="/apps"
            className="inline-flex items-center gap-1 rounded-control px-2 py-1.5 text-sm font-bold text-muted hover:bg-brand-soft hover:text-brand"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Alle apps
          </Link>
          <h1 className="font-display text-xl font-semibold text-brand-strong">Navnetrækker</h1>

          {store.classes.length > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Klasse</span>
              <select
                value={active?.id ?? ""}
                onChange={(e) => {
                  setCreating(false);
                  selectClass(e.target.value);
                }}
                className="rounded-control border border-line-strong bg-surface px-2.5 py-1.5 font-bold"
              >
                {store.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.students.length})
                  </option>
                ))}
              </select>
            </label>
          )}

          {active && (
            <nav className="flex rounded-control border border-line-strong p-0.5" aria-label="Visning">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setView(v.id);
                  }}
                  aria-pressed={view === v.id && !creating}
                  className="rounded-[4px] px-3 py-1 text-sm font-bold text-muted aria-pressed:bg-brand aria-pressed:text-white"
                >
                  {v.label}
                </button>
              ))}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setView("list");
              }}
              className="rounded-control px-2.5 py-1.5 text-sm font-bold text-muted hover:bg-brand-soft hover:text-brand"
            >
              + Ny klasse
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-control border border-line-strong px-2.5 py-1.5 text-sm font-bold hover:border-brand hover:text-brand"
            >
              Fuld skærm
            </button>
          </div>
        </div>
      </header>

      {saveFailed && (
        <p role="alert" className="bg-danger-soft px-4 py-2 text-center text-sm text-danger">
          Browseren tillader ikke at gemme her (fx i et privat vindue). Klasselisten forsvinder,
          når du lukker siden.
        </p>
      )}

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6">
        {showEditor ? (
          <ClassEditor
            key={creating || !active ? "new" : active.id}
            cls={creating ? null : active}
            onSave={(cls, isNew) => {
              if (isNew) addClasses([cls]);
              else updateClass(cls);
              setCreating(false);
              setView("draw");
            }}
            onImport={(classes) => {
              addClasses(classes);
              setCreating(false);
              setView("draw");
            }}
            onDelete={(id) => {
              removeClass(id);
              setView("draw");
            }}
            onCancel={store.classes.length > 0 ? () => setCreating(false) : undefined}
            store={store}
          />
        ) : view === "draw" ? (
          <DrawView key={active.id} cls={active} onChange={updateClass} />
        ) : (
          <GroupsView key={active.id} cls={active} />
        )}
      </main>
    </div>
  );
}
