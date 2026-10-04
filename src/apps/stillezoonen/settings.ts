export const TEMPOS = [
  { label: "Langsomt", seconds: 20 },
  { label: "Normalt", seconds: 10 },
  { label: "Hurtigt", seconds: 5 },
] as const;

export type Settings = {
  threshold: number;
  tempo: number;
  maxAnimals: number;
  theme: string;
  /** Vis den flytbare timer. */
  timer: boolean;
  /** Vis beskedtavlen. */
  board: boolean;
};
export const DEFAULTS: Settings = {
  threshold: 55,
  tempo: 10,
  maxAnimals: 12,
  theme: "jungle",
  timer: false,
  board: false,
};
export const STORAGE_KEY = "stillezoonen:settings";
/** Fra før appen hed Stillezoonen. */
const OLD_STORAGE_KEY = "klasse-zoo:settings";


export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
