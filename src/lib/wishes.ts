/** Fælles konstanter for ønskelisten (bruges både på serveren og i browseren). */

export const WISH_CATEGORIES = {
  app: "Ny app",
  feature: "Forbedring",
  other: "Andet",
} as const;
export type WishCategory = keyof typeof WISH_CATEGORIES;

export const WISH_STATUSES = {
  open: "Ny",
  planned: "Planlagt",
  in_progress: "I gang",
  done: "Lavet",
} as const;
export type WishStatus = keyof typeof WISH_STATUSES;

export const MAX_TITLE = 100;
export const MAX_BODY = 1000;
/** Højst så mange nye ønsker pr. lærer pr. døgn. */
export const MAX_PER_DAY = 10;

/** Kun egne nøgler — `"__proto__" in obj` er sandt for alle objekter. */
export const isCategory = (v: unknown): v is WishCategory =>
  typeof v === "string" && Object.hasOwn(WISH_CATEGORIES, v);
export const isStatus = (v: unknown): v is WishStatus =>
  typeof v === "string" && Object.hasOwn(WISH_STATUSES, v);
