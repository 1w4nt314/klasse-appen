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
  const [storedActive, setStoredActive] = useState(() => loadActive(userKey));

  useEffect(() => {
    let alive = true;
    getZooData()
      .then((data) => {
        if (!alive || !data) return;
        setClasses(data.classes);
        setSightings(toMap(data.sightings));
        setLoaded(true);
      })
      .catch(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  // En slettet (eller ukendt) klasse falder tilbage til lærerens egen samling.
  const active =
    storedActive === MY_COLLECTION || !loaded || classes.some((c) => c.id === storedActive)
      ? storedActive
      : MY_COLLECTION;

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
