"use client";

// Opgavelab — dialoger: Gem som, Indlæs-liste og bekræftelser.
// Bygget på <dialog> + showModal: Escape lukker, fokus fanges i dialogen og
// gendannes til knappen, der åbnede den. Ved bekræftelser har "Annullér" fokus.

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { DocSummary } from "../actions";
import { LIMITS } from "../model/types";

const timeFmt = new Intl.DateTimeFormat("da-DK", { hour: "2-digit", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short" });
const dayYearFmt = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", year: "numeric" });

/** "14.32" */
export const fmtTime = (ts: number) => timeFmt.format(new Date(ts));
/** "5. okt. kl. 14.32" (med årstal, hvis det ikke er i år). */
export function fmtWhen(ts: number, now = Date.now()) {
  const d = new Date(ts);
  const sameYear = d.getFullYear() === new Date(now).getFullYear();
  return `${(sameYear ? dayFmt : dayYearFmt).format(d)} kl. ${fmtTime(ts)}`;
}

// Fokus gendannes til det element, der åbnede den FØRSTE dialog — også når én dialog
// afløses af en anden (fx Slet-bekræftelse → listen igen).
let openDialogs = 0;
let returnTo: HTMLElement | null = null;
let restoreTimer: ReturnType<typeof setTimeout> | null = null;

function Modal({
  title,
  onClose,
  children,
  wide,
  name,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  name: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (openDialogs === 0 && !restoreTimer) {
      returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    openDialogs++;
    if (!dlg.open) dlg.showModal();
    // Det element, der skal have fokus (fx "Annullér"), ellers første fokuserbare.
    dlg.querySelector<HTMLElement>("[data-ol-autofocus]")?.focus();
    return () => {
      if (dlg.open) dlg.close();
      openDialogs--;
      if (openDialogs === 0) {
        if (restoreTimer) clearTimeout(restoreTimer);
        restoreTimer = setTimeout(() => {
          restoreTimer = null;
          if (openDialogs === 0 && returnTo && returnTo.isConnected) returnTo.focus();
          if (openDialogs === 0) returnTo = null;
        }, 0);
      }
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={wide ? "ol-dialog ol-dialog-wide" : "ol-dialog"}
      data-ol-dialog={name}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Escape: lad React lukke dialogen i stedet for browseren.
        e.preventDefault();
        closeRef.current();
      }}
    >
      <div className="ol-dialog-body">
        <h2 id={titleId} className="ol-dialog-title">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}

/** Gem som: navnefelt (forudfyldt). */
export function SaveAsDialog({
  title = "Gem opgaven",
  initialName,
  error,
  busy,
  onSave,
  onClose,
}: {
  title?: string;
  initialName: string;
  error: string | null;
  busy: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);
  const empty = name.trim() === "";
  return (
    <Modal title={title} onClose={onClose} name="saveas">
      <form
        className="ol-dialog-form"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!empty && !busy) onSave(name);
        }}
      >
        <label className="ol-field">
          <span>Navn på opgaven</span>
          <input
            type="text"
            value={name}
            maxLength={LIMITS.nameChars}
            data-ol-autofocus=""
            data-ol-save-name=""
            aria-invalid={touched && empty}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
        {touched && empty && (
          <p className="ol-dialog-error" role="alert">
            Skriv et navn først.
          </p>
        )}
        {error && (
          <p className="ol-dialog-error" role="alert" data-ol-dialog-error="">
            {error}
          </p>
        )}
        <div className="ol-dialog-actions">
          <button type="submit" className="ol-btn ol-btn-strong" disabled={busy} data-ol-save-submit="">
            {busy ? "Gemmer…" : "Gem"}
          </button>
          <button type="button" className="ol-btn" onClick={onClose} data-ol-cancel="">
            Annullér
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Lærerens opgaver, nyeste først, med Åbn og Slet. */
export function LoadDialog({
  docs,
  loading,
  error,
  busy,
  currentId,
  onOpen,
  onDelete,
  onClose,
}: {
  docs: DocSummary[] | null;
  loading: boolean;
  error: string | null;
  busy: boolean;
  currentId: string | null;
  onOpen: (doc: DocSummary) => void;
  onDelete: (doc: DocSummary) => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Indlæs en opgave" onClose={onClose} wide name="load">
      {loading && <p className="ol-dialog-note">Henter dine opgaver…</p>}
      {error && (
        <p className="ol-dialog-error" role="alert" data-ol-dialog-error="">
          {error}
        </p>
      )}
      {!loading && docs && docs.length === 0 && <p className="ol-dialog-note">Du har ingen gemte opgaver endnu.</p>}
      {!loading && docs && docs.length > 0 && (
        <ul className="ol-doclist" aria-label="Dine gemte opgaver">
          {docs.map((doc) => (
            <li key={doc.id} className="ol-doc" data-ol-doc={doc.id} data-ol-doc-name={doc.name}>
              <div className="ol-doc-info">
                <span className="ol-doc-name">
                  {doc.name}
                  {doc.id === currentId && <span className="ol-doc-current"> (åben)</span>}
                </span>
                <span className="ol-doc-when">ændret {fmtWhen(doc.updatedAt)}</span>
              </div>
              <button
                type="button"
                className="ol-btn ol-btn-strong"
                data-ol-open=""
                aria-label={`Åbn ${doc.name}`}
                disabled={busy}
                onClick={() => onOpen(doc)}
              >
                Åbn
              </button>
              <button
                type="button"
                className="ol-btn ol-btn-danger"
                data-ol-delete=""
                aria-label={`Slet ${doc.name}`}
                disabled={busy}
                onClick={() => onDelete(doc)}
              >
                Slet
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="ol-dialog-actions">
        <button type="button" className="ol-btn" onClick={onClose} data-ol-autofocus="" data-ol-cancel="">
          Luk
        </button>
      </div>
    </Modal>
  );
}

/** Bekræftelse med "Annullér" som standardfokus. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger,
  busy,
  error,
  wide,
  onConfirm,
  onCancel,
}: {
  title: string;
  /** En tekst (ét afsnit) eller færdig opmærkning (fx eksport-advarslernes liste pr. side). */
  message: ReactNode;
  confirmLabel: string;
  wide?: boolean;
  danger?: boolean;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel} name="confirm" wide={wide}>
      {typeof message === "string" ? (
        <p className="ol-dialog-note" data-ol-confirm-message="">
          {message}
        </p>
      ) : (
        <div className="ol-dialog-note" data-ol-confirm-message="">
          {message}
        </div>
      )}
      {error && (
        <p className="ol-dialog-error" role="alert" data-ol-dialog-error="">
          {error}
        </p>
      )}
      <div className="ol-dialog-actions">
        <button
          type="button"
          className={danger ? "ol-btn ol-btn-danger" : "ol-btn ol-btn-strong"}
          data-ol-confirm-yes=""
          disabled={busy}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
        <button type="button" className="ol-btn" data-ol-autofocus="" data-ol-confirm-no="" onClick={onCancel}>
          Annullér
        </button>
      </div>
    </Modal>
  );
}
