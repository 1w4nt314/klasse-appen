"use client";

import { useEffect, useRef, useState } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { THEMES } from "../themes";
import { CreatureArt } from "../themes/shared";
import { MY_COLLECTION, RARITY } from "./rarity";
import type { Collection } from "./useCollection";

const dateFmt = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short" });

/**
 * Pote-oversigten: alle figurer i et tema for den valgte samling. Spottede
 * vises i farver med navn, resten som silhuet. Her vælges og styres klasserne.
 */
export function CollectionOverlay({
  collection,
  theme,
  onClose,
}: {
  collection: Collection;
  theme: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(theme);
  const [managing, setManaging] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const shown = THEMES.find((t) => t.id === tab) ?? THEMES[0];
  const spots = collection.forTheme(collection.active, shown.id);
  const kinds = Object.keys(shown.creatures);
  const found = kinds.filter((k) => spots.has(k)).length;

  const panel = useRef<HTMLElement>(null);
  // Seneste onClose i en ref: forælderen laver en ny funktion ved hver render
  // (hver gang et dyr kommer/går), og effekten må kun køre én gang.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Ved åbning: fokus på ✕. Escape lukker (men ikke mens en bekræft-dialog er
  // åben), og Tab holdes inde i oversigten.
  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || document.querySelector("dialog[open]")) return;
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = [
        ...panel.current.querySelectorAll<HTMLElement>("button:not(:disabled), input, select, [tabindex]:not([tabindex='-1'])"),
      ].filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = panel.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="zc-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <section ref={panel} className="zc-panel" role="dialog" aria-modal="true" aria-labelledby="zc-title">
        <header className="zc-head">
          <h2 id="zc-title" className="zc-title">
            <PawMark /> Samling
          </h2>
          <label className="zc-who">
            <span className="sr-only">Hvis samling</span>
            <select value={collection.active} onChange={(e) => collection.setActive(e.target.value)}>
              <option value={MY_COLLECTION}>Min samling</option>
              {collection.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="zc-btn"
            aria-expanded={managing}
            onClick={() => setManaging((m) => !m)}
          >
            Klasser
          </button>
          <button ref={closeButton} type="button" className="zc-close" onClick={onClose} aria-label="Luk samlingen">
            ✕
          </button>
        </header>

        {managing && <ClassManager collection={collection} />}

        <nav className="zc-tabs" aria-label="Tema">
          {THEMES.map((t) => (
            <button key={t.id} type="button" aria-pressed={t.id === tab} onClick={() => setTab(t.id)}>
              {t.name}
            </button>
          ))}
        </nav>

        <div className="zc-progress">
          <span>
            <strong className="tabular-nums">
              {found} af {kinds.length}
            </strong>{" "}
            {shown.noun} spottet {shown.place}
          </span>
          <span className="zc-bar" aria-hidden="true">
            <span style={{ width: `${kinds.length ? (found / kinds.length) * 100 : 0}%` }} />
          </span>
        </div>

        <ul className="zc-grid">
          {kinds.map((k) => {
            const spec = shown.creatures[k];
            const spot = spots.get(k);
            const rarity = spec.rarity ?? "common";
            return (
              <li key={k} className="zc-card" data-spotted={!!spot} data-rarity={rarity}>
                <span className="zc-art-box" aria-hidden="true">
                  {/* Spottede figurer med særlig opførsel vises i den positur. */}
                  <CreatureArt spec={spec} pose={spot ? "special" : "normal"} className="zc-art" />
                </span>
                <span className="zc-name">{spot ? spec.name : "???"}</span>
                {rarity !== "common" && <span className="zc-rarity">{RARITY[rarity].label}</span>}
                <span className="zc-meta">
                  {spot ? (
                    <>
                      Set {spot.count} {spot.count === 1 ? "gang" : "gange"} · {dateFmt.format(spot.firstSeen)}
                    </>
                  ) : (
                    "Ikke spottet endnu"
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="zc-hint">
          En figur tæller som spottet, når den har været helt fremme på skærmen i 5 sekunder.
        </p>
      </section>
    </div>
  );
}

/** Opret, omdøb og slet klasser. */
function ClassManager({ collection }: { collection: Collection }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const add = async () => {
    setError(null);
    const res = await collection.addClass(name);
    if (!res.ok) return setError(res.error);
    setName("");
  };
  const rename = async (id: string) => {
    setError(null);
    const res = await collection.changeClass(id, editName);
    if (!res.ok) return setError(res.error);
    setEditing(null);
  };

  return (
    <div className="zc-classes">
      {collection.loadError && <LoadError collection={collection} />}
      <form
        className="zc-add"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Ny klasse, fx 2.A"
          aria-label="Navn på ny klasse"
        />
        <button type="submit" className="zc-btn zc-primary" disabled={!name.trim()}>
          Opret
        </button>
      </form>
      {error && (
        <p role="alert" className="zc-error">
          {error}
        </p>
      )}
      {collection.classes.length === 0 ? (
        <p className="zc-empty">
          Ingen klasser endnu. Uden klasse samler du i din egen samling.
        </p>
      ) : (
        <ul className="zc-class-list">
          {collection.classes.map((c) => (
            <li key={c.id}>
              {editing === c.id ? (
                <form
                  className="zc-add"
                  onSubmit={(e) => {
                    e.preventDefault();
                    rename(c.id);
                  }}
                >
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      // Escape annullerer kun omdøbningen — ikke hele oversigten.
                      if (e.key === "Escape") {
                        // React lytter på document (som oversigten), så markér
                        // tasten som håndteret i stedet for at stoppe den.
                        e.preventDefault();
                        setEditing(null);
                      }
                    }}
                    maxLength={24}
                    aria-label={`Nyt navn til ${c.name}`}
                    autoFocus
                  />
                  <button type="submit" className="zc-btn zc-primary" disabled={!editName.trim()}>
                    Gem
                  </button>
                  <button type="button" className="zc-btn" onClick={() => setEditing(null)}>
                    Annullér
                  </button>
                </form>
              ) : (
                <>
                  <span className="zc-class-name">{c.name}</span>
                  <button
                    type="button"
                    className="zc-btn"
                    onClick={() => {
                      setEditing(c.id);
                      setEditName(c.name);
                    }}
                  >
                    Omdøb
                  </button>
                  <ConfirmButton
                    title={`Slet ${c.name}?`}
                    message={`Klassen og alt, hvad ${c.name} har spottet, bliver slettet. Det kan ikke fortrydes.`}
                    confirmLabel="Ja, slet"
                    onConfirm={() => collection.removeClass(c.id)}
                    className="zc-btn zc-danger"
                  >
                    Slet
                  </ConfirmButton>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Startskærmen: vælg hvem der samler (valgfrit — standard er lærerens egen samling). */
export function CollectionPicker({ collection }: { collection: Collection }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const options = [{ id: MY_COLLECTION, name: "Min samling" }, ...collection.classes];

  const add = async () => {
    setError(null);
    const res = await collection.addClass(name);
    if (!res.ok) return setError(res.error);
    collection.setActive(res.cls.id);
    setName("");
    setAdding(false);
  };

  return (
    <div className="zc-picker">
      {collection.loadError && <LoadError collection={collection} />}
      <div className="zc-chips">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={collection.active === o.id}
            onClick={() => collection.setActive(o.id)}
          >
            {o.name}
          </button>
        ))}
        {!adding && (
          <button type="button" className="zc-chip-add" onClick={() => setAdding(true)}>
            + Ny klasse
          </button>
        )}
      </div>
      {adding && (
        <form
          className="zc-add"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Fx 2.A"
            aria-label="Navn på ny klasse"
            autoFocus
          />
          <button type="submit" className="zc-btn zc-primary" disabled={!name.trim()}>
            Opret
          </button>
          <button
            type="button"
            className="zc-btn"
            onClick={() => {
              setAdding(false);
              setError(null);
              setName("");
            }}
          >
            Annullér
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="zc-error">
          {error}
        </p>
      )}
    </div>
  );
}

function LoadError({ collection }: { collection: Collection }) {
  return (
    <p role="alert" className="zc-error">
      Kunne ikke hente dine klasser.{" "}
      <button type="button" className="zc-link" onClick={collection.retry}>
        Prøv igen
      </button>
    </p>
  );
}

export function PawMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <ellipse cx="6" cy="10.5" rx="2.2" ry="2.8" />
      <ellipse cx="18" cy="10.5" rx="2.2" ry="2.8" />
      <ellipse cx="9.3" cy="6.3" rx="2.1" ry="2.7" />
      <ellipse cx="14.7" cy="6.3" rx="2.1" ry="2.7" />
    </svg>
  );
}
