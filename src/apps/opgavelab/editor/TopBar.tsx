"use client";

import Link from "next/link";

export function TopBar({
  name,
  onName,
  canUndo,
  onUndo,
  onNew,
  dirty,
}: {
  name: string;
  onName: (name: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  onNew: () => void;
  dirty: boolean;
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
      {dirty && <span className="ol-dirty">Ikke gemt</span>}
      <div className="ol-top-actions">
        <button type="button" className="ol-btn" onClick={onNew}>
          Ny
        </button>
        <button type="button" className="ol-btn" disabled title="Kommer i et senere trin">
          Gem
        </button>
        <button type="button" className="ol-btn" disabled title="Kommer i et senere trin">
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
