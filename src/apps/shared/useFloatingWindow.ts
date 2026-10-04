"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Et lille vindue, der kan flyttes (træk i titellinjen) og ændres i størrelse
 * (træk i hjørnet). Holdes altid inden for skærmen, og position og størrelse
 * huskes i browseren under `storageKey`. Bruges af timeren og beskedtavlen.
 */
export type Rect = { x: number; y: number; w: number; h: number };

type Handlers = {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
};

export function useFloatingWindow({
  storageKey,
  fallback,
  minW,
  minH,
  enlargeTo,
}: {
  storageKey: string;
  /** Første placering, før læreren har flyttet vinduet. */
  fallback: Rect;
  minW: number;
  minH: number;
  /** Midlertidig minimumsstørrelse (fx mens timeren stilles) — gemmes ikke. */
  enlargeTo?: { w: number; h: number } | null;
}) {
  const clamp = useMemo(
    () =>
      (r: Rect): Rect => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = Math.min(Math.max(r.w, minW), vw - 16);
        const h = Math.min(Math.max(r.h, minH), vh - 16);
        return {
          w,
          h,
          x: Math.min(Math.max(r.x, 8), vw - w - 8),
          y: Math.min(Math.max(r.y, 8), vh - h - 8),
        };
      },
    [minW, minH],
  );

  const [rect, setRect] = useState<Rect>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const r = JSON.parse(raw);
        if ([r.x, r.y, r.w, r.h].every((n) => typeof n === "number" && Number.isFinite(n)))
          return clamp(r);
      }
    } catch {}
    return clamp(fallback);
  });

  // Gem kun når læreren selv flytter/ændrer vinduet — ikke når det klemmes
  // midlertidigt af et lille browservindue.
  const rectRef = useRef(rect);
  useEffect(() => {
    rectRef.current = rect;
  });

  // Hold vinduet inden for skærmen, når den ændrer størrelse (fx fuld skærm).
  useEffect(() => {
    const onResize = () => setRect((r) => clamp(r));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  // Det viste vindue: evt. midlertidigt forstørret og flyttet ind på skærmen.
  // (`rect` skifter også ved resize, så det regnes om.)
  const enlargeW = enlargeTo?.w ?? 0;
  const enlargeH = enlargeTo?.h ?? 0;
  const shown = useMemo(
    () =>
      enlargeW || enlargeH
        ? clamp({ ...rect, w: Math.max(rect.w, enlargeW), h: Math.max(rect.h, enlargeH) })
        : rect,
    [rect, enlargeW, enlargeH, clamp],
  );

  const drag = useRef<{ mode: "move" | "resize"; sx: number; sy: number; start: Rect } | null>(null);
  const shownRef = useRef(shown);
  useEffect(() => {
    shownRef.current = shown;
  });

  const begin = (mode: "move" | "resize", e: ReactPointerEvent<HTMLElement>) => {
    if (mode === "move" && (e.target as HTMLElement).closest("button, input, textarea, select, a, dialog")) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    // Træk fra det, der faktisk ses, så vinduet ikke hopper ved første bevægelse.
    drag.current = { mode, sx: e.clientX, sy: e.clientY, start: shownRef.current };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (d.mode === "move") {
      // Kun positionen flyttes — lærerens egen størrelse bevares, også når
      // vinduet midlertidigt er forstørret.
      setRect((r) => {
        const moved = clamp({ ...d.start, x: d.start.x + dx, y: d.start.y + dy });
        return { ...r, x: moved.x, y: moved.y };
      });
    } else {
      setRect(clamp({ ...d.start, w: d.start.w + dx, h: d.start.h + dy }));
    }
  };
  const onPointerUp = () => {
    if (drag.current) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(rectRef.current));
      } catch {}
    }
    drag.current = null;
  };

  const bar: Handlers = {
    onPointerDown: (e) => begin("move", e),
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
  const resize: Handlers = {
    onPointerDown: (e) => begin("resize", e),
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };
  return { shown, bar, resize };
}
