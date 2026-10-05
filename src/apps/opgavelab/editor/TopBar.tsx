"use client";

import Link from "next/link";

export type View = "opgave" | "svarark";
/** Gemmestatus i topbaren: "Gemt kl. 14.32" / "Ikke gemt" / fejl. */
export type TopStatus = { text: string; tone: "ok" | "warn" | "error" };

export function TopBar({
  view,
  onView,
  name,
  onName,
  canUndo,
  onUndo,
  onNew,
  onSave,
  onSaveCopy,
  onLoad,
  busy,
  status,
}: {
  view: View;
  onView: (view: View) => void;
  name: string;
  onName: (name: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  onNew: () => void;
  onSave: () => void;
  /** null = "Gem som kopi" er ikke tilgængelig (opgaven er ikke gemt endnu). */
  onSaveCopy: (() => void) | null;
  onLoad: () => void;
  busy: boolean;
  status: TopStatus | null;
}) {
  return (
    <header className="ol-topbar">
      <Link href="/apps" className="ol-back">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Alle apps
      </Link>
      <h1 className="ol-title">Opgavelab</h1>
      <label className="ol-name">
        <span className="sr-only">Navn på opgaven</span>
        <input
          type="text"
          value={name}
          maxLength={60}
          placeholder="Navn på opgaven"
          onChange={(e) => onName(e.target.value)}
        />
      </label>
      <div className="ol-view" role="group" aria-label="Visning af arket">
        <span className="ol-view-label" aria-hidden="true">
          Vis:
        </span>
        {(["opgave", "svarark"] as const).map((v) => (
          <button
            key={v}
            type="button"
            className="ol-view-btn"
            data-ol-view={v}
            aria-pressed={view === v}
            onClick={() => onView(v)}
          >
            {v === "opgave" ? "Opgave" : "Svarark"}
          </button>
        ))}
      </div>
      {status && (
        <span
          className="ol-dirty"
          data-ol-status={status.tone}
          role={status.tone === "error" ? "alert" : "status"}
        >
          {status.text}
        </span>
      )}
      <div className="ol-top-actions">
        <button type="button" className="ol-btn" data-ol-new="" onClick={onNew} disabled={busy}>
          Ny
        </button>
        <button type="button" className="ol-btn" data-ol-save="" onClick={onSave} disabled={busy}>
          Gem
        </button>
        {onSaveCopy && (
          <button type="button" className="ol-btn" data-ol-save-copy="" onClick={onSaveCopy} disabled={busy}>
            Gem som kopi
          </button>
        )}
        <button type="button" className="ol-btn" data-ol-load="" onClick={onLoad} disabled={busy}>
          Indlæs
        </button>
        <button type="button" className="ol-btn" disabled title="Kommer i et senere trin">
          Eksporter
        </button>
        <button type="button" className="ol-btn ol-btn-strong" onClick={onUndo} disabled={!canUndo}>
          Fortryd
        </button>
      </div>
    </header>
  );
}
