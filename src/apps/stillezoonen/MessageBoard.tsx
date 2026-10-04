"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useFloatingWindow } from "../shared/useFloatingWindow";

const MESSAGE_KEY = "stillezoonen:message";
const MAX_LENGTH = 500;
const MIN_FONT = 12;
const MAX_FONT = 320;

function loadMessage() {
  try {
    return localStorage.getItem(MESSAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
function saveMessage(text: string) {
  try {
    if (text) localStorage.setItem(MESSAGE_KEY, text);
    else localStorage.removeItem(MESSAGE_KEY);
  } catch {}
}

/**
 * Beskedtavle: et vindue i temaets stil, som timeren kan flyttes og trækkes
 * større. Teksten bliver så stor som muligt og skrumper, når der kommer mere
 * på, så den altid passer i vinduet. Beskeden huskes i browseren.
 */
export function MessageBoard({
  theme,
  zIndex,
  onClose,
}: {
  theme: string;
  zIndex: number;
  onClose: () => void;
}) {
  const [text, setText] = useState(loadMessage);
  // En tom tavle åbner direkte i redigering.
  const [editing, setEditing] = useState(() => !loadMessage());
  const [draft, setDraft] = useState(text);
  const editor = useRef<HTMLTextAreaElement>(null);

  const { shown, bar, resize } = useFloatingWindow({
    storageKey: "stillezoonen:message-window",
    // Øverst til højre under knapperne — timeren starter til venstre.
    fallback: { x: window.innerWidth - 16 - 380, y: 72, w: 380, h: 240 },
    minW: 220,
    minH: 160,
  });

  useEffect(() => {
    if (editing) editor.current?.focus({ preventScroll: true });
  }, [editing]);

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
  };
  const save = () => {
    const next = draft.trim();
    setText(next);
    saveMessage(next);
    setEditing(!next);
  };
  const remove = () => {
    setText("");
    setDraft("");
    saveMessage("");
    setEditing(true);
    onClose();
  };

  return (
    <section
      className="ft-window mb-window"
      data-theme={theme}
      data-editing={editing || undefined}
      style={{ left: shown.x, top: shown.y, width: shown.w, height: shown.h, zIndex }}
      aria-label="Beskedtavle"
    >
      <header className="ft-bar mb-bar" {...bar}>
        <span className="ft-grip" aria-hidden="true">
          ⠿
        </span>
        <span className="ft-title">Besked</span>
        {editing ? (
          <button type="button" className="mb-btn mb-primary" onClick={save} disabled={!draft.trim()}>
            Vis
          </button>
        ) : (
          <button type="button" className="mb-btn" onClick={startEdit} aria-label="Redigér beskeden">
            <PencilIcon /> Redigér
          </button>
        )}
        {(text || draft) && (
          <ConfirmButton
            title="Slet beskeden?"
            message="Beskeden fjernes fra tavlen, og tavlen lukkes."
            confirmLabel="Ja, slet"
            onConfirm={remove}
            className="ft-icon mb-icon"
          >
            <span className="sr-only">Slet beskeden</span>
            <TrashIcon />
          </ConfirmButton>
        )}
        <button type="button" className="ft-icon mb-icon" onClick={onClose} aria-label="Luk beskedtavlen">
          ✕
        </button>
      </header>

      <div className="mb-body">
        {editing ? (
          <textarea
            ref={editor}
            className="mb-editor"
            value={draft}
            maxLength={MAX_LENGTH}
            placeholder="Skriv en besked til klassen …"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl/Cmd + Enter viser beskeden; Enter alene giver ny linje.
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (draft.trim()) save();
              }
            }}
            aria-label="Besked"
          />
        ) : (
          <FitText text={text} />
        )}
      </div>

      <div className="ft-resize" {...resize} aria-hidden="true" />
    </section>
  );
}

/**
 * Tekst, der fylder sin boks: største skriftstørrelse hvor alt kan være uden
 * at ord brydes midt i. Kun hvis selv den mindste størrelse ikke kan rumme et
 * meget langt ord, brydes ordet.
 */
function FitText({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const outer = box.current;
    const el = inner.current;
    if (!outer || !el) return;
    const fit = () => {
      const fits = () =>
        el.offsetHeight <= outer.clientHeight + 0.5 && el.scrollWidth <= outer.clientWidth + 0.5;
      el.style.overflowWrap = "normal";
      let lo = MIN_FONT;
      let hi = Math.max(MIN_FONT, Math.min(MAX_FONT, outer.clientHeight));
      // Binær søgning på hele pixel.
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        if (fits()) lo = mid;
        else hi = mid;
      }
      el.style.fontSize = `${lo}px`;
      if (!fits()) el.style.overflowWrap = "anywhere";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={box} className="mb-fit">
      <p ref={inner} className="mb-text">
        {text}
      </p>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}
