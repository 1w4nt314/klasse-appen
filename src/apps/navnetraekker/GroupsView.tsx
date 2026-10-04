"use client";

import { useState } from "react";
import { makeGroups, presentStudents, type ClassList, type GroupMode, type Student } from "./store";

const GROUP_COLORS = ["#1a4f8b", "#0f6b7a", "#b7791f", "#9b2c6f", "#2f7d32", "#5a4fcf", "#b42318", "#00739d"];

export function GroupsView({ cls }: { cls: ClassList }) {
  const [mode, setMode] = useState<GroupMode>({ by: "size", value: 3 });
  const [groups, setGroups] = useState<Student[][] | null>(null);
  const present = presentStudents(cls);

  const max = Math.max(2, Math.min(mode.by === "size" ? 10 : 15, present.length));
  const value = Math.min(mode.value, max);
  const generate = () => setGroups(makeGroups(present, { ...mode, value }));

  return (
    <div className="flex flex-1 flex-col gap-5">
      <section className="flex flex-wrap items-end gap-4 rounded-card border border-line bg-surface p-4">
        <fieldset>
          <legend className="mb-1.5 text-sm font-bold">Del op efter</legend>
          <div className="flex rounded-control border border-line-strong p-0.5">
            {(
              [
                ["size", "Elever pr. gruppe"],
                ["count", "Antal grupper"],
              ] as const
            ).map(([by, label]) => (
              <button
                key={by}
                type="button"
                aria-pressed={mode.by === by}
                onClick={() => setMode((m) => ({ ...m, by }))}
                className="rounded-[4px] px-3 py-1.5 text-sm font-bold text-muted aria-pressed:bg-brand aria-pressed:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <span className="mb-1.5 block text-sm font-bold" id="nt-value-label">
            {mode.by === "size" ? "Elever pr. gruppe" : "Antal grupper"}
          </span>
          <div className="flex items-center gap-1" role="group" aria-labelledby="nt-value-label">
            <button
              type="button"
              aria-label="Færre"
              onClick={() => setMode((m) => ({ ...m, value: Math.max(2, Math.min(m.value, max) - 1) }))}
              className="size-9 rounded-control border border-line-strong text-lg font-bold hover:border-brand"
            >
              −
            </button>
            <output className="w-10 text-center text-xl font-extrabold tabular-nums">
              {value}
            </output>
            <button
              type="button"
              aria-label="Flere"
              onClick={() => setMode((m) => ({ ...m, value: Math.min(max, m.value + 1) }))}
              className="size-9 rounded-control border border-line-strong text-lg font-bold hover:border-brand"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={present.length < 2}
          className="rounded-control bg-brand px-6 py-2.5 text-lg font-extrabold text-white hover:bg-brand-strong disabled:opacity-60"
        >
          {groups ? "Bland igen" : "Lav grupper"}
        </button>

        <p className="ml-auto text-sm text-muted">
          <span className="tabular-nums">{present.length}</span> elever i dag
          {present.length < cls.students.length && <> (fraværende er ikke med)</>}
        </p>
      </section>

      {present.length < 2 ? (
        <p className="text-center text-muted">Der skal være mindst to elever for at lave grupper.</p>
      ) : groups ? (
        <ul className="grid flex-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groups.map((g, i) => (
            <li
              key={`${i}-${g.map((s) => s.id).join()}`}
              className="nt-group overflow-hidden rounded-card border border-line bg-surface"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3
                className="px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-white"
                style={{ background: GROUP_COLORS[i % GROUP_COLORS.length] }}
              >
                Gruppe {i + 1}
              </h3>
              <ul className="space-y-1 px-4 py-3">
                {g.map((s) => (
                  <li key={s.id} className="text-[clamp(1.1rem,2vw,1.6rem)] font-bold leading-snug">
                    {s.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-muted">
          Vælg størrelse og tryk “Lav grupper”. Grupperne bliver så lige store som muligt.
        </p>
      )}
    </div>
  );
}
