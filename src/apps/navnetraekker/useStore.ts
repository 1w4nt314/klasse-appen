"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  emptyStore,
  MAX_CLASSES,
  sanitizeStore,
  STORAGE_KEY,
  uniqueName,
  type ClassList,
  type Store,
} from "./store";

/**
 * Klasselisterne i browserens localStorage, adskilt pr. lærer (nøglen indeholder
 * lærerens id), så en kollega der logger ind på samme smartboard-pc ikke ser dem.
 * Navnene forlader aldrig browseren.
 */

type Snapshot = {
  store: Store;
  /** Seneste forsøg på at gemme fejlede (privat vindue, fuld eller blokeret lagring). */
  saveFailed: boolean;
  /** De gemte data var beskadigede; en kopi er lagt under `<nøgle>:beskadiget`. */
  recovered: boolean;
};

type Entry = { snap: Snapshot; listeners: Set<() => void> };
const entries = new Map<string, Entry>();

const keyFor = (userKey: string) => `${STORAGE_KEY}:${userKey}`;

function read(key: string): Snapshot {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return { store: emptyStore(), saveFailed: true, recovered: false };
  }
  if (!raw) return { store: emptyStore(), saveFailed: false, recovered: false };
  try {
    return { store: sanitizeStore(JSON.parse(raw)), saveFailed: false, recovered: false };
  } catch {
    // Smid ikke lærerens data væk: gem den rå værdi, før noget nyt skrives.
    try {
      localStorage.setItem(`${key}:beskadiget`, raw);
    } catch {}
    return { store: emptyStore(), saveFailed: false, recovered: true };
  }
}

function entry(key: string): Entry {
  let e = entries.get(key);
  if (!e) {
    e = { snap: read(key), listeners: new Set() };
    entries.set(key, e);
  }
  return e;
}

function commit(key: string, store: Store) {
  const e = entry(key);
  let saveFailed = false;
  try {
    const json = JSON.stringify(store);
    // Skriv kun ved ændring, så to åbne faner ikke skubber til hinanden i ring.
    if (localStorage.getItem(key) !== json) localStorage.setItem(key, json);
  } catch {
    saveFailed = true;
  }
  e.snap = { ...e.snap, store, saveFailed };
  e.listeners.forEach((l) => l());
}

function subscribe(key: string, listener: () => void) {
  const e = entry(key);
  // Første abonnent efter en pause (fx efter navigation væk og tilbage): læs
  // forfra, så ændringer fra andre faner i mellemtiden ikke overskrives.
  if (e.listeners.size === 0 && !e.snap.saveFailed) {
    const fresh = read(key);
    const activeId = fresh.store.classes.some((c) => c.id === e.snap.store.activeId)
      ? e.snap.store.activeId
      : fresh.store.activeId;
    e.snap = { ...fresh, store: { ...fresh.store, activeId } };
  }
  e.listeners.add(listener);
  // En anden fane har ændret listerne: hent dem, men behold den klasse der er valgt her.
  const onStorage = (ev: StorageEvent) => {
    if (ev.key !== key) return;
    const fresh = read(key);
    const activeId = fresh.store.classes.some((c) => c.id === e.snap.store.activeId)
      ? e.snap.store.activeId
      : fresh.store.activeId;
    e.snap = { ...fresh, store: { ...fresh.store, activeId } };
    e.listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    e.listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore(userKey: string) {
  const key = keyFor(userKey);
  const snap = useSyncExternalStore(
    useCallback((l: () => void) => subscribe(key, l), [key]),
    () => entry(key).snap,
    () => entry(key).snap,
  );
  const { store } = snap;

  const actions = useMemo(() => {
    const current = () => entry(key).snap.store;
    return {
      updateClass(next: ClassList) {
        const s = current();
        const others = s.classes.filter((c) => c.id !== next.id).map((c) => c.name);
        const named = { ...next, name: uniqueName(next.name, others) };
        commit(key, { ...s, classes: s.classes.map((c) => (c.id === next.id ? named : c)) });
      },
      addClasses(added: ClassList[]) {
        if (added.length === 0) return;
        const s = current();
        // Samme navn som en eksisterende klasse → "4.b (2)", så de kan skelnes i listen.
        const taken = s.classes.map((c) => c.name);
        const named = added.map((c) => {
          const name = uniqueName(c.name, taken);
          taken.push(name);
          return { ...c, name };
        });
        // Grænsen håndhæves også her, så intet forsvinder ved næste indlæsning.
        const room = Math.max(0, MAX_CLASSES - s.classes.length);
        if (room === 0) return;
        const kept = named.slice(0, room);
        commit(key, { ...s, classes: [...s.classes, ...kept], activeId: kept[0].id });
      },
      removeClass(id: string) {
        const s = current();
        const classes = s.classes.filter((c) => c.id !== id);
        commit(key, {
          ...s,
          classes,
          activeId: s.activeId === id ? (classes[0]?.id ?? null) : s.activeId,
        });
      },
      selectClass(id: string) {
        commit(key, { ...current(), activeId: id });
      },
      /** Fjern alle klasselister fra denne computer (fx på en fælles pc). */
      clearAll() {
        commit(key, emptyStore());
        try {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}:beskadiget`);
        } catch {}
      },
    };
  }, [key]);

  const active = store.classes.find((c) => c.id === store.activeId) ?? null;
  return { ...snap, active, ...actions };
}
