"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

/**
 * Knap der åbner en "Er du sikker?"-dialog før en handling udføres.
 * Bruger <dialog> med showModal, så fokus holdes i dialogen og Escape annullerer.
 */
export function ConfirmButton({
  children,
  title,
  message,
  confirmLabel,
  onConfirm,
  tone = "danger",
  className,
  disabled,
}: {
  children: ReactNode;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<unknown> | void;
  tone?: "danger" | "brand";
  className?: string;
  disabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const confirmClass =
    tone === "danger"
      ? "bg-danger text-white hover:opacity-90"
      : "bg-brand text-white hover:bg-brand-strong";

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-card border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-ink/40"
      >
        <div className="p-5">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <div className="mt-2 text-sm leading-relaxed text-muted">{message}</div>
          {error && (
            <p role="alert" className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            {/* Annullér har fokus som standard, så Enter ikke bekræfter ved et uheld. */}
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="rounded-control border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand"
            >
              Annullér
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  setError(null);
                  try {
                    const result = await onConfirm();
                    // Server-handlinger svarer { ok: false, error? } når de afviser.
                    if (result && typeof result === "object" && "ok" in result && result.ok === false) {
                      const msg = "error" in result && typeof result.error === "string" ? result.error : null;
                      setError(msg ?? "Det lykkedes ikke. Prøv igen.");
                      return;
                    }
                    setOpen(false);
                  } catch {
                    setError("Der skete en fejl. Tjek forbindelsen og prøv igen.");
                  }
                })
              }
              className={`rounded-control px-4 py-2 text-sm font-bold disabled:opacity-60 ${confirmClass}`}
            >
              {pending ? "Et øjeblik …" : confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
