"use client";

import { useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const progress = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Listen for the Konami code — ignore typing inside form fields.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active) return;
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
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[progress.current]) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          setActive(true);
        }
      } else {
        progress.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Modal chrome: scroll lock + Tab trap + Esc (parity with BootSequence).
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        panelRef.current?.focus();
        return;
      }
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  // Matrix rain while active (skipped when user prefers reduced motion).
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 16 * dpr;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = "アカサタナ01JPALM<>/{}#$%*+=".split("");

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(5, 6, 10, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#34f5c5";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[90] cursor-pointer"
      onClick={() => setActive(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Developer mode unlocked"
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="hud px-8 py-6 text-center outline-none"
        >
          <p className="label">cheat code accepted</p>
          <p className="mt-2 font-display text-2xl text-accent text-glow">
            DEVELOPER MODE UNLOCKED
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            ↑ ↑ ↓ ↓ ← → ← → B A · [ esc / click to exit ]
          </p>
        </div>
      </div>
    </div>
  );
}
