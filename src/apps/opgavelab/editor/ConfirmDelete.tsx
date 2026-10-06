"use client";

// Lille inline-bekræftelse (ingen window.confirm): spørgsmål + "Ja, slet" / "Annullér".
// "Annullér" får fokus, og Escape annullerer.

import { useEffect, useRef } from "react";

export function ConfirmDelete({
  question,
  onConfirm,
  onCancel,
}: {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);
  return (
    <div
      className="ol-confirm"
      role="alertdialog"
      aria-label="Bekræft sletning"
      aria-describedby="ol-confirm-q"
      data-ol-confirm=""
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onCancel();
        }
      }}
    >
      <p id="ol-confirm-q" className="ol-confirm-q">
        {question}
      </p>
      <div className="ol-confirm-actions">
        <button type="button" className="ol-btn ol-btn-danger" data-ol-confirm-yes="" onClick={onConfirm}>
          Ja, slet
        </button>
        <button type="button" className="ol-btn" ref={cancelRef} data-ol-confirm-no="" onClick={onCancel}>
          Annullér
        </button>
      </div>
    </div>
  );
}
