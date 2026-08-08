"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Press `?` (Shift+/) outside form fields for operator terminal shortcuts.
 * Esc / click dismisses. Tab stays inside the dialog while open.
 */
export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (open && e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (open && e.key === "Tab") {
        e.preventDefault();
        panelRef.current?.focus();
        return;
      }
      if (!open && e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="hud w-full max-w-md rounded-xl p-6 outline-none"
      >
        <p className="label">{"// operator shortcuts"}</p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          KEYBINDS
        </h2>
        <dl className="mt-5 space-y-3 font-mono text-xs text-muted">
          <div className="flex justify-between gap-4">
            <dt className="text-accent">?</dt>
            <dd>This help panel</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-accent">Esc</dt>
            <dd>Skip boot / close overlays</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-accent">↑↑↓↓←→←→BA</dt>
            <dd>Developer mode</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-accent">← →</dt>
            <dd>Gallery slides (when focused)</dd>
          </div>
        </dl>
        <p className="mt-6 font-mono text-[0.65rem] tracking-widest text-muted/60">
          [ esc / click to close ]
        </p>
      </div>
    </div>
  );
}
