"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createClass,
  deleteClass,
  getZooData,
  recordSighting,
  renameClass,
  type Sighting,
  type ZooClass,
} from "./actions";
import { MY_COLLECTION } from "./rarity";

export type Spot = { firstSeen: number; count: number };
/** theme → creature → hvornår og hvor mange gange. */
export type CollectionSightings = Map<string, Map<string, Spot>>;

const sightingKey = (collection: string, theme: string) => `${collection}\u0000${theme}`;

/** Klassenavne huskes også i browseren, så den valgte klasse kan vises, før (eller hvis ikke) serveren svarer. */
function loadCachedClasses(userKey: string): ZooClass[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`stillezoonen:classes:${userKey}`) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((c) => typeof c?.id === "string" && typeof c?.name === "string").map((c) => ({ id: c.id, name: c.name }))
      : [];
  } catch {
    return [];
  }
}

function loadActive(userKey: string) {
  try {
    return localStorage.getItem(`stillezoonen:collection:${userKey}`) ?? MY_COLLECTION;
  } catch {
    return MY_COLLECTION;
  }
}

/**
 * Klasser og samlinger for den indloggede lærer. Data hentes fra serveren
 * ved start; nye spottede figurer vises med det samme og gemmes bagefter.
 * Den valgte samling huskes i browseren (pr. lærer).
 */
export function useCollection(userKey: string) {
  const [classes, setClasses] = useState<ZooClass[]>(() => loadCachedClasses(userKey));
  const [sightings, setSightings] = useState<Map<string, Map<string, Spot>>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [storedActive, setStoredActive] = useState(() => loadActive(userKey));

  /**
   * Løbenumre: Next udfører server-handlinger én ad gangen i den rækkefølge,
   * de sendes. Et svar fra getZooData (nr. F) indeholder derfor præcis de
   * spottinger, der er sendt før nr. F — dem sendt efter lægges oven i.
   */
  const seq = useRef(0);
  const recent = useRef<{ seq: number; key: string; kind: string; at: number }[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    const fetchSeq = ++seq.current;
    getZooData()
      .then((data) => {
        if (!alive) return;
        if (!data) {
          setLoadError(true);
          return;
        }
        recent.current = recent.current.filter((r) => r.seq > fetchSeq);
        const base = toMap(data.sightings);
        for (const r of recent.current) bump(base, r.key, r.kind, r.at);
        setClasses(data.classes);
        setSightings(base);
        loadedRef.current = true;
        setLoaded(true);
        setLoadError(false);
        try {
          localStorage.setItem(`stillezoonen:classes:${userKey}`, JSON.stringify(data.classes));
        } catch {}
      })
      .catch(() => alive && setLoadError(true));
    return () => {
      alive = false;
    };
  }, [attempt, userKey]);

  // Prøv selv igen et par gange (med længere pause hver gang).
  useEffect(() => {
    if (!loadError || attempt >= 4) return;
    const id = window.setTimeout(() => setAttempt((a) => a + 1), 2000 * (attempt + 1));
    return () => window.clearTimeout(id);
  }, [loadError, attempt]);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  // En slettet (eller ukendt) klasse falder tilbage til lærerens egen samling.
  // Indtil klasserne er hentet, beholdes valget (så en fejl ikke skifter samling).
  // Navnet kommer fra de huskede klasser, så det vises rigtigt imens.
  const active =
    storedActive === MY_COLLECTION || !loaded || classes.some((c) => c.id === storedActive)
      ? storedActive
      : MY_COLLECTION;
  useEffect(() => {
    if (!loaded || active === storedActive) return;
    try {
      localStorage.setItem(`stillezoonen:collection:${userKey}`, active);
    } catch {}
  }, [loaded, active, storedActive, userKey]);

  const setActive = useCallback(
    (id: string) => {
      setStoredActive(id);
      try {
        localStorage.setItem(`stillezoonen:collection:${userKey}`, id);
      } catch {}
    },
    [userKey],
  );

  const forTheme = useCallback(
    (collection: string, theme: string) => sightings.get(sightingKey(collection, theme)) ?? EMPTY,
    [sightings],
  );

  /** Seneste værdier i refs, så animationsløkken kan kalde `record` uden at genstarte. */
  const activeRef = useRef(active);
  const sightingsRef = useRef(sightings);
  useEffect(() => {
    activeRef.current = active;
    sightingsRef.current = sightings;
  });

  /**
   * En figur er spottet i den aktive samling. Returnerer true, hvis den er ny.
   * Før samlingen er hentet, vides det ikke — så aldrig "ny" (ingen falske toasts).
   */
  const record = useCallback((theme: string, creature: string) => {
    const collection = activeRef.current;
    const key = sightingKey(collection, theme);
    const isNew = loadedRef.current && !sightingsRef.current.get(key)?.has(creature);
    const at = Date.now();
    recent.current.push({ seq: ++seq.current, key, kind: creature, at });
    setSightings((prev) => {
      const next = new Map(prev);
      bump(next, key, creature, at);
      return next;
    });
    recordSighting(collection, theme, creature).catch(() => {});
    return isNew;
  }, []);

  // Ændringer i klasserne huskes også i browseren.
  const cacheClasses = useCallback(
    (cs: ZooClass[]) => {
      try {
        localStorage.setItem(`stillezoonen:classes:${userKey}`, JSON.stringify(cs));
      } catch {}
      return cs;
    },
    [userKey],
  );

  const addClass = useCallback(async (name: string) => {
    const res = await createClass(name);
    if (res.ok) setClasses((cs) => cacheClasses(sortClasses([...cs, res.cls])));
    return res;
  }, [cacheClasses]);

  const changeClass = useCallback(async (id: string, name: string) => {
    const res = await renameClass(id, name);
    if (res.ok) setClasses((cs) => cacheClasses(sortClasses(cs.map((c) => (c.id === id ? res.cls : c)))));
    return res;
  }, [cacheClasses]);

  const removeClass = useCallback(async (id: string) => {
    const res = await deleteClass(id);
    if (res.ok) {
      setClasses((cs) => cacheClasses(cs.filter((c) => c.id !== id)));
      setSightings((prev) => {
        const next = new Map(prev);
        for (const key of next.keys()) if (key.startsWith(`${id}\u0000`)) next.delete(key);
        return next;
      });
    }
    return res;
  }, [cacheClasses]);

  const activeName = useMemo(
    () => (active === MY_COLLECTION ? "Min samling" : (classes.find((c) => c.id === active)?.name ?? "Min samling")),
    [active, classes],
  );

  return {
    loaded,
    loadError,
    retry,
    classes,
    active,
    activeName,
    setActive,
    forTheme,
    record,
    addClass,
    changeClass,
    removeClass,
  };
}

const EMPTY: ReadonlyMap<string, Spot> = new Map();

const sortClasses = (cs: ZooClass[]) =>
  [...cs].sort((a, b) => a.name.localeCompare(b.name, "da", { numeric: true }));

/** Én spotting mere af `kind` (ændrer `map` på plads; kopierer den indre Map). */
function bump(map: Map<string, Map<string, Spot>>, key: string, kind: string, at: number) {
  const spots = new Map(map.get(key) ?? []);
  const old = spots.get(kind);
  spots.set(kind, old ? { ...old, count: old.count + 1 } : { firstSeen: at, count: 1 });
  map.set(key, spots);
}

function toMap(rows: Sighting[]) {
  const map = new Map<string, Map<string, Spot>>();
  for (const r of rows) {
    const key = sightingKey(r.collection, r.theme);
    if (!map.has(key)) map.set(key, new Map());
    map.get(key)!.set(r.creature, { firstSeen: r.firstSeen, count: r.count });
  }
  return map;
}

export type Collection = ReturnType<typeof useCollection>;
