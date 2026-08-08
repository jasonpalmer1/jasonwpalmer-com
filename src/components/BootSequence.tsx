"use client";

import { useEffect, useState } from "react";
import { tools } from "@/data/tools";

const LINES = (name: string) => [
  "> initializing operator terminal v2.7 …",
  "> establishing secure uplink … OK",
  `> loading profile: ${name.toUpperCase().replace(/\s+/g, "_")} …`,
  "> decrypting credentials … OK",
  `> mounting builds [${tools.length}] … OK`,
  "> ACCESS GRANTED",
];

function storageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Private mode / blocked storage — boot still works for this session.
  }
}

export default function BootSequence({ name }: { name: string }) {
  const lines = LINES(name);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Start as not-mounted so SSR markup matches; decide after mount.
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (storageGet("booted") === "1") return;
    // Skip the theatrical boot when the user prefers reduced motion.
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        storageSet("booted", "1");
        return;
      }
    } catch {
      /* ignore */
    }
    // Defer past the effect body — avoids cascading-render lint on an
    // intentional client-only mount gate (SSR must render inactive).
    const t = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Lock scroll + Escape to skip while the overlay is up.
  useEffect(() => {
    if (!active || hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        storageSet("booted", "1");
        setDone(true);
        setShown(lines.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, hidden, lines.length]);

  useEffect(() => {
    if (!active) return;
    if (shown >= lines.length) {
      const t = setTimeout(() => setDone(true), 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 120 : 230);
    return () => clearTimeout(t);
  }, [active, shown, lines.length]);

  useEffect(() => {
    if (!done) return;
    storageSet("booted", "1");
    const t = setTimeout(() => setHidden(true), 650);
    return () => clearTimeout(t);
  }, [done]);

  const skip = () => {
    storageSet("booted", "1");
    setDone(true);
    setShown(lines.length);
  };

  if (!active || hidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Boot sequence"
      onClick={skip}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        done ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-lg px-8 font-mono text-sm">
        {lines.slice(0, shown).map((l, i) => {
          const granted = l.includes("ACCESS GRANTED");
          return (
            <p
              key={i}
              className={granted ? "mt-2 text-accent text-glow" : "text-muted"}
            >
              {l}
            </p>
          );
        })}
        {shown < lines.length && (
          <span className="text-accent blink">█</span>
        )}
        <p className="mt-8 text-[0.65rem] tracking-widest text-muted/60">
          [ click or Esc to skip ]
        </p>
      </div>
    </div>
  );
}
