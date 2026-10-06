"use client";

// Opgavelab — sidebjælken over arket: "Side 2 af 3", én knap pr. side, Forrige/Næste og side-handlinger
// (tilføj, flyt frem/tilbage, slet). Ren visning; Opgavelab.tsx ejer tilstanden og bekræftelsen ved sletning.
// Tastatur: knapperne er almindelige knapper (Tab); PageUp/PageDown skifter side (SheetEditor).

import { useId } from "react";
import { LIMITS } from "../model/types";

/** Over så mange sider erstattes side-knapperne af en liste (så bjælken ikke fylder en hel række på telefonen). */
export const PAGE_TABS_MAX = 8;

export function PageBar({
  page,
  pageCount,
  onPage,
  onAdd,
  onRemove,
  onMove,
}: {
  /** Aktiv side (0-baseret). */
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  /** Ny tom side efter den aktive. */
  onAdd: () => void;
  /** Sletter den aktive side (Opgavelab spørger først, hvis siden har indhold). */
  onRemove: () => void;
  /** −1: flyt siden frem (mod side 1), 1: flyt den tilbage. */
  onMove: (dir: -1 | 1) => void;
}) {
  const limitId = useId();
  const full = pageCount >= LIMITS.pages;
  const n = page + 1;
  const tabs = pageCount <= PAGE_TABS_MAX;

  return (
    <nav className="ol-pagebar" aria-label="Sider" data-ol-pagebar="">
      <p className="ol-pagebar-status" role="status" aria-live="polite" data-ol-page-status="">
        {`Side ${n} af ${pageCount}`}
      </p>
      <div className="ol-pagebar-nav">
        <button
          type="button"
          className="ol-btn ol-pagebar-step"
          data-ol-page-prev=""
          aria-label="Forrige side"
          disabled={page <= 0}
          onClick={() => onPage(page - 1)}
        >
          <span aria-hidden="true">‹</span>
          <span className="ol-pagebar-word"> Forrige</span>
        </button>
        {tabs ? (
          <div className="ol-pagetabs" role="group" aria-label="Vælg side">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className="ol-pagetab"
                data-ol-page-tab={i}
                aria-pressed={i === page}
                aria-label={`Side ${i + 1}`}
                onClick={() => onPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        ) : (
          <select
            className="ol-pagebar-select"
            data-ol-page-select=""
            aria-label="Gå til side"
            value={page}
            onChange={(e) => onPage(Number(e.target.value))}
          >
            {Array.from({ length: pageCount }, (_, i) => (
              <option key={i} value={i}>
                {`Side ${i + 1}`}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="ol-btn ol-pagebar-step"
          data-ol-page-next=""
          aria-label="Næste side"
          disabled={page >= pageCount - 1}
          onClick={() => onPage(page + 1)}
        >
          <span className="ol-pagebar-word">Næste </span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="ol-pagebar-actions">
        <button
          type="button"
          className="ol-btn"
          data-ol-page-add=""
          disabled={full}
          aria-describedby={full ? limitId : undefined}
          onClick={onAdd}
        >
          + Tilføj side
        </button>
        <button
          type="button"
          className="ol-btn"
          data-ol-page-move="-1"
          disabled={page <= 0}
          aria-label={`Flyt side ${n} frem`}
          title="Flyt siden frem (bytter med siden før)"
          onClick={() => onMove(-1)}
        >
          Flyt frem
        </button>
        <button
          type="button"
          className="ol-btn"
          data-ol-page-move="1"
          disabled={page >= pageCount - 1}
          aria-label={`Flyt side ${n} tilbage`}
          title="Flyt siden tilbage (bytter med siden efter)"
          onClick={() => onMove(1)}
        >
          Flyt tilbage
        </button>
        <button
          type="button"
          className="ol-btn ol-pagebar-remove"
          data-ol-page-remove=""
          disabled={pageCount <= 1}
          aria-label={`Slet side ${n}`}
          onClick={onRemove}
        >
          Slet side
        </button>
        {full && (
          <span id={limitId} className="ol-pagebar-hint" data-ol-page-limit="">
            {`Højst ${LIMITS.pages} sider`}
          </span>
        )}
      </div>
    </nav>
  );
}
