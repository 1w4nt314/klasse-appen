/**
 * Navnetrækkerens data og logik. Ren TypeScript uden React, så den kan testes
 * direkte. Alt gemmes KUN i lærerens browser (localStorage) — navnene sendes
 * aldrig til serveren.
 */

export type Student = { id: string; name: string };

export type ClassList = {
  id: string;
  name: string;
  students: Student[];
  /** Elever der endnu ikke er trukket i denne runde. */
  pool: string[];
  /** Fraværende elever — gælder kun den dag de er markeret. */
  absent: { date: string; ids: string[] };
};

export type Store = {
  version: 1;
  classes: ClassList[];
  activeId: string | null;
};

export const STORAGE_KEY = "navnetraekker:v1";
export const MAX_STUDENTS = 60;
export const MAX_NAME_LENGTH = 40;

export const emptyStore = (): Store => ({ version: 1, classes: [], activeId: null });

/** Kryptografisk tilfældigt heltal i [0, n). */
export function randomInt(n: number): number {
  if (n <= 1) return 0;
  const buf = new Uint32Array(1);
  // Afvis de øverste værdier, så fordelingen bliver helt jævn.
  const limit = Math.floor(0x1_0000_0000 / n) * n;
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % n;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const newId = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Én elev pr. linje (eller kommasepareret). Tomme linjer og ekstra mellemrum fjernes. */
export function parseNames(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((n) => n.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_STUDENTS);
}

/** Navne der forekommer mere end én gang (uanset store/små bogstaver). */
export function duplicateNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  for (const n of names) seen.set(n.toLocaleLowerCase("da"), (seen.get(n.toLocaleLowerCase("da")) ?? 0) + 1);
  return [...new Set(names.filter((n) => (seen.get(n.toLocaleLowerCase("da")) ?? 0) > 1))];
}

export function createClass(name: string, names: string[]): ClassList {
  const students = names.map((n) => ({ id: newId(), name: n }));
  return {
    id: newId(),
    name: name.trim() || "Min klasse",
    students,
    pool: students.map((s) => s.id),
    absent: { date: today(), ids: [] },
  };
}

/**
 * Opdatér elevlisten. Elever der beholder deres navn, beholder også deres id
 * og plads i runden; nye elever kommer med i den igangværende runde.
 */
export function updateStudents(cls: ClassList, names: string[]): ClassList {
  const unused = [...cls.students];
  const students = names.map((name) => {
    const i = unused.findIndex((s) => s.name === name);
    if (i >= 0) return unused.splice(i, 1)[0];
    return { id: newId(), name };
  });
  const ids = new Set(students.map((s) => s.id));
  const oldIds = new Set(cls.students.map((s) => s.id));
  const pool = [
    ...cls.pool.filter((id) => ids.has(id)),
    ...students.filter((s) => !oldIds.has(s.id)).map((s) => s.id),
  ];
  return {
    ...cls,
    students,
    pool,
    absent: { ...cls.absent, ids: cls.absent.ids.filter((id) => ids.has(id)) },
  };
}

/** Fraværende i dag (en markering fra en tidligere dag tæller ikke). */
export function absentToday(cls: ClassList, date = today()): Set<string> {
  return new Set(cls.absent.date === date ? cls.absent.ids : []);
}

export function toggleAbsent(cls: ClassList, id: string, date = today()): ClassList {
  const current = absentToday(cls, date);
  if (current.has(id)) current.delete(id);
  else current.add(id);
  return { ...cls, absent: { date, ids: [...current] } };
}

export function presentStudents(cls: ClassList, date = today()): Student[] {
  const absent = absentToday(cls, date);
  return cls.students.filter((s) => !absent.has(s.id));
}

export type DrawResult = {
  cls: ClassList;
  student: Student | null;
  /** true hvis alle tilstedeværende havde været oppe, så en ny runde startede. */
  newRound: boolean;
};

/**
 * Træk en elev retfærdigt: ingen trækkes igen, før alle tilstedeværende har
 * været oppe i runden. Fraværende springes over, men beholder deres plads.
 */
export function drawStudent(cls: ClassList, date = today()): DrawResult {
  const present = presentStudents(cls, date);
  if (present.length === 0) return { cls, student: null, newRound: false };

  const presentIds = new Set(present.map((s) => s.id));
  let pool = cls.pool.filter((id) => cls.students.some((s) => s.id === id));
  let available = pool.filter((id) => presentIds.has(id));
  let newRound = false;

  if (available.length === 0) {
    // Ny runde: alle kommer i spil igen. Fraværende står stadig i puljen,
    // så de kommer til, når de er tilbage.
    pool = cls.students.map((s) => s.id);
    available = pool.filter((id) => presentIds.has(id));
    newRound = true;
  }

  const id = available[randomInt(available.length)];
  return {
    cls: { ...cls, pool: pool.filter((p) => p !== id) },
    student: cls.students.find((s) => s.id === id) ?? null,
    newRound,
  };
}

/** Læg en trukket elev tilbage i runden (fx hvis eleven ikke var klar). */
export function putBack(cls: ClassList, id: string): ClassList {
  if (cls.pool.includes(id) || !cls.students.some((s) => s.id === id)) return cls;
  return { ...cls, pool: [...cls.pool, id] };
}

export function resetRound(cls: ClassList): ClassList {
  return { ...cls, pool: cls.students.map((s) => s.id) };
}

/** Hvor mange tilstedeværende der mangler at komme op i runden. */
export function remainingInRound(cls: ClassList, date = today()): number {
  const present = new Set(presentStudents(cls, date).map((s) => s.id));
  return cls.pool.filter((id) => present.has(id)).length;
}

export type GroupMode = { by: "size" | "count"; value: number };

/**
 * Fordel elever i tilfældige grupper med så ens størrelse som muligt.
 * "size" = ca. så mange pr. gruppe, "count" = så mange grupper.
 */
export function makeGroups(students: Student[], mode: GroupMode): Student[][] {
  const n = students.length;
  if (n === 0) return [];
  const value = Math.max(1, Math.floor(mode.value));
  // Ved "size": aldrig en gruppe på under value-1 (og aldrig en elev alene),
  // så 23 elever i par giver 10 par og én gruppe på 3 — ikke én der står alene.
  const count =
    mode.by === "count"
      ? Math.min(value, n)
      : Math.max(1, Math.min(Math.round(n / value), Math.floor(n / Math.max(2, value - 1))));
  const groups: Student[][] = Array.from({ length: count }, () => []);
  shuffle(students).forEach((s, i) => groups[i % count].push(s));
  return groups;
}

/** Læs gemte data og ret op på alt der ikke passer (gamle formater, manuelle ændringer). */
export function sanitizeStore(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return emptyStore();
  const r = raw as Partial<Store>;
  const classes = Array.isArray(r.classes)
    ? r.classes.flatMap((c): ClassList[] => {
        if (!c || typeof c !== "object" || typeof c.name !== "string") return [];
        const students = Array.isArray(c.students)
          ? c.students
              .filter(
                (s): s is Student =>
                  !!s && typeof s.id === "string" && typeof s.name === "string" && s.name.trim() !== "",
              )
              .slice(0, MAX_STUDENTS)
              .map((s) => ({ id: s.id, name: s.name.slice(0, MAX_NAME_LENGTH) }))
          : [];
        const ids = new Set(students.map((s) => s.id));
        const pool = Array.isArray(c.pool) ? c.pool.filter((id) => ids.has(id)) : [...ids];
        const absent =
          c.absent && typeof c.absent.date === "string" && Array.isArray(c.absent.ids)
            ? { date: c.absent.date, ids: c.absent.ids.filter((id) => ids.has(id)) }
            : { date: today(), ids: [] };
        return [
          {
            id: typeof c.id === "string" ? c.id : newId(),
            name: c.name.slice(0, 60),
            students,
            pool,
            absent,
          },
        ];
      })
    : [];
  const activeId =
    typeof r.activeId === "string" && classes.some((c) => c.id === r.activeId)
      ? r.activeId
      : (classes[0]?.id ?? null);
  return { version: 1, classes, activeId };
}

/** Fil til at flytte klasselister mellem computere. */
export function exportStore(store: Store): string {
  return JSON.stringify(
    {
      app: "klasse-appen/navnetraekker",
      version: 1,
      exportedAt: new Date().toISOString(),
      classes: store.classes.map((c) => ({ name: c.name, students: c.students.map((s) => s.name) })),
    },
    null,
    2,
  );
}

/** Indlæs en eksportfil. Klasserne tilføjes som nye klasser. */
export function parseImport(text: string): ClassList[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Filen kunne ikke læses. Er det en fil fra Navnetrækkeren?");
  }
  const classes = (data as { classes?: unknown })?.classes;
  if (!Array.isArray(classes)) throw new Error("Filen indeholder ingen klasselister.");
  const result = classes.flatMap((c) => {
    if (!c || typeof c.name !== "string" || !Array.isArray(c.students)) return [];
    const names = parseNames(c.students.filter((s: unknown) => typeof s === "string").join("\n"));
    return [createClass(c.name.slice(0, 60), names)];
  });
  if (result.length === 0) throw new Error("Filen indeholder ingen klasselister.");
  return result;
}
