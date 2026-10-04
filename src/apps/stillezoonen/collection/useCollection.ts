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
  const [classes, setClasses] = useState<ZooClass[]>([]);
  const [sightings, setSightings] = useState<Map<string, Map<string, Spot>>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [storedActive, setStoredActive] = useState(() => loadActive(userKey));

  useEffect(() => {
    let alive = true;
    getZooData()
      .then((data) => {
        if (!alive) return;
        if (!data) {
          setLoadError(true);
          return;
        }
        setClasses(data.classes);
        // Flet med det, der er spottet imens (svaret kan komme sent) — ikke erstat.
        setSightings((local) => merge(toMap(data.sightings), local));
        setLoaded(true);
        setLoadError(false);
      })
      .catch(() => alive && setLoadError(true));
    return () => {
      alive = false;
    };
  }, [attempt]);

  // Prøv selv igen et par gange (med længere pause hver gang).
  useEffect(() => {
    if (!loadError || attempt >= 4) return;
    const id = window.setTimeout(() => setAttempt((a) => a + 1), 2000 * (attempt + 1));
    return () => window.clearTimeout(id);
  }, [loadError, attempt]);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  // En slettet (eller ukendt) klasse falder tilbage til lærerens egen samling.
  // Indtil klasserne er hentet, beholdes valget (så en fejl ikke skifter samling).
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

  /** En figur er spottet i den aktive samling. Returnerer true, hvis den er ny. */
  const record = useCallback((theme: string, creature: string) => {
    const collection = activeRef.current;
    const key = sightingKey(collection, theme);
    const isNew = !sightingsRef.current.get(key)?.has(creature);
    setSightings((prev) => {
      const next = new Map(prev);
      const spots = new Map(next.get(key) ?? []);
      const old = spots.get(creature);
      spots.set(creature, old ? { ...old, count: old.count + 1 } : { firstSeen: Date.now(), count: 1 });
      next.set(key, spots);
      return next;
    });
    recordSighting(collection, theme, creature).catch(() => {});
    return isNew;
  }, []);

  const addClass = useCallback(async (name: string) => {
    const res = await createClass(name);
    if (res.ok) setClasses((cs) => sortClasses([...cs, res.cls]));
    return res;
  }, []);

  const changeClass = useCallback(async (id: string, name: string) => {
    const res = await renameClass(id, name);
    if (res.ok) setClasses((cs) => sortClasses(cs.map((c) => (c.id === id ? res.cls : c))));
    return res;
  }, []);

  const removeClass = useCallback(async (id: string) => {
    const res = await deleteClass(id);
    if (res.ok) {
      setClasses((cs) => cs.filter((c) => c.id !== id));
      setSightings((prev) => {
        const next = new Map(prev);
        for (const key of next.keys()) if (key.startsWith(`${id}\u0000`)) next.delete(key);
        return next;
      });
    }
    return res;
  }, []);

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

/** Foren serverens og de lokale fund: højeste antal og tidligste dato vinder. */
function merge(server: Map<string, Map<string, Spot>>, local: Map<string, Map<string, Spot>>) {
  const result = new Map(server);
  for (const [key, spots] of local) {
    const merged = new Map(result.get(key) ?? []);
    for (const [kind, spot] of spots) {
      const other = merged.get(kind);
      merged.set(
        kind,
        other
          ? { firstSeen: Math.min(other.firstSeen, spot.firstSeen), count: Math.max(other.count, spot.count) }
          : spot,
      );
    }
    result.set(key, merged);
  }
  return result;
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
