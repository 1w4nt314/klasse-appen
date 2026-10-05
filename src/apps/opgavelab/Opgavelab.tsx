"use client";

import { useEffect, useRef } from "react";
import type { AppProps } from "../runtime";
import { PropertiesPanel } from "./editor/PropertiesPanel";
import { SheetEditor } from "./editor/SheetEditor";
import { ToolPanel } from "./editor/ToolPanel";
import { TopBar } from "./editor/TopBar";
import { useDocument } from "./editor/useDocument";
import { newDocument } from "./model/document";
import { LIMITS } from "./model/types";
import { useSheetMeasure } from "./render/measure";
import "./opgavelab.css";

function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT";
}

export default function Opgavelab({ userKey }: AppProps) {
  void userKey; // bruges i punkt 6 (persistens er på serveren, men nøglen holder klientstate adskilt)
  const d = useDocument();
  const measure = useSheetMeasure();

  // Seneste tilstand til tastaturgenveje uden at gentilmelde lytteren ved hvert træk.
  const latest = useRef(d);
  useEffect(() => {
    latest.current = d;
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping(e.target)) return;
      const cur = latest.current;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        cur.undo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && !e.ctrlKey && !e.metaKey && cur.selectedId) {
        e.preventDefault();
        cur.remove(cur.selectedId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!d.dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [d.dirty]);

  return (
    <div className="ol-root">
      <TopBar
        name={d.doc.name}
        onName={d.setName}
        canUndo={d.canUndo}
        onUndo={d.undo}
        dirty={d.dirty}
        onNew={() => {
          // Foreløbig bekræftelse; punkt 6 erstatter den med en dialog.
          if (d.dirty && !window.confirm("Du har ugemte ændringer. Fortsæt?")) return;
          d.replace(newDocument());
        }}
      />
      <ToolPanel onAddText={d.addText} onAddFigure={d.addFigure} full={d.doc.objects.length >= LIMITS.objects} />
      <main className="ol-main">
        <SheetEditor
          doc={d.doc}
          selectedId={d.selectedId}
          measure={measure}
          onSelect={d.select}
          onMove={d.move}
          onReshape={d.reshape}
          onCommit={d.commit}
        />
      </main>
      <PropertiesPanel doc={d.doc} selected={d.selected} onUpdate={d.update} onRemove={d.remove} onSettings={d.setSettings} />
    </div>
  );
}
