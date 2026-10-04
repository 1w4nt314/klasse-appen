"use client";

import { useCallback, useEffect, useState } from "react";
import { emptyStore, sanitizeStore, STORAGE_KEY, type ClassList, type Store } from "./store";

/** Kan browseren gemme? (Ikke altid i private vinduer eller med blokeret lagring.) */
function canStore() {
  try {
    localStorage.setItem(`${STORAGE_KEY}:test`, "1");
    localStorage.removeItem(`${STORAGE_KEY}:test`);
    return true;
  } catch {
    return false;
  }
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeStore(JSON.parse(raw)) : emptyStore();
  } catch {
    return emptyStore();
  }
}

/**
 * Klasselisterne i browserens localStorage. Komponenten kører kun i browseren
 * (ssr: false), så der kan læses med det samme.
 */
export function useStore() {
  const [store, setStore] = useState<Store>(load);
  const [saveFailed] = useState(() => !canStore());

  useEffect(() => {
    try {
      const json = JSON.stringify(store);
      // Skriv kun ved ændring, så to åbne faner ikke skubber til hinanden i ring.
      if (localStorage.getItem(STORAGE_KEY) !== json) localStorage.setItem(STORAGE_KEY, json);
    } catch {
      // Blokeret lagring vises som advarsel (saveFailed); intet at gøre her.
    }
  }, [store]);

  // Hold flere faner i sync, hvis læreren har appen åben to steder.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const active = store.classes.find((c) => c.id === store.activeId) ?? null;

  const updateClass = useCallback((next: ClassList) => {
    setStore((s) => ({ ...s, classes: s.classes.map((c) => (c.id === next.id ? next : c)) }));
  }, []);

  const addClasses = useCallback((added: ClassList[]) => {
    if (added.length === 0) return;
    setStore((s) => {
      // Samme navn som en eksisterende klasse → "4.b (2)", så de kan skelnes i listen.
      const taken = new Set(s.classes.map((c) => c.name));
      const named = added.map((c) => {
        let name = c.name;
        for (let i = 2; taken.has(name); i++) name = `${c.name} (${i})`;
        taken.add(name);
        return { ...c, name };
      });
      return { ...s, classes: [...s.classes, ...named], activeId: named[0].id };
    });
  }, []);

  const removeClass = useCallback((id: string) => {
    setStore((s) => {
      const classes = s.classes.filter((c) => c.id !== id);
      return { ...s, classes, activeId: s.activeId === id ? (classes[0]?.id ?? null) : s.activeId };
    });
  }, []);

  const selectClass = useCallback((id: string) => {
    setStore((s) => ({ ...s, activeId: id }));
  }, []);

  return { store, active, updateClass, addClasses, removeClass, selectClass, saveFailed };
}
