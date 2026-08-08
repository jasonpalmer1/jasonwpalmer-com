"use client";

import { useEffect, useRef, useState } from "react";

// A bottom-right control that appears once the user scrolls past the fold — so
// people deep in the page (where the sticky top bar is easy to miss) always have
// a quick way back to the top.
export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // If the control hides while focused, move focus to main (avoid aria-hidden trap).
  useEffect(() => {
    if (wasVisible.current && !visible) {
      if (btnRef.current && document.activeElement === btnRef.current) {
        const main = document.getElementById("main");
        if (main instanceof HTMLElement) {
          if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
          main.focus({ preventScroll: true });
        } else {
          btnRef.current.blur();
        }
      }
    }
    wasVisible.current = visible;
  }, [visible]);

  const toTop = () => {
    let behavior: ScrollBehavior = "smooth";
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        behavior = "auto";
      }
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior });
    const main = document.getElementById("main");
    if (main instanceof HTMLElement) {
      if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
      main.focus({ preventScroll: true });
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 flex items-center gap-2 transition-all duration-300 sm:bottom-6 sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      inert={!visible ? true : undefined}
    >
      <button
        ref={btnRef}
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={visible ? 0 : -1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
