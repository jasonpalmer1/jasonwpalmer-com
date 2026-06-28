"use client";

import { useEffect, useState } from "react";

// A bottom-right control cluster that appears once the user scrolls past the
// fold — so people deep in the page (where the sticky top bar is easy to miss)
// always have a way back to the top and a one-tap path to the consulting page.
export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [onBuild, setOnBuild] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    // Sync client-only state off the effect body (avoids set-state-in-effect).
    // /build already IS the consulting page — don't show a redundant CTA there.
    const sync = () => {
      setOnBuild(window.location.pathname.replace(/\/$/, "") === "/build");
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 flex items-center gap-2 transition-all duration-300 sm:bottom-6 sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {!onBuild && (
        <a
          href="/build/"
          className="whitespace-nowrap rounded-full border border-accent/40 bg-accent/10 px-4 py-2.5 font-mono text-xs tracking-widest text-accent shadow-lg shadow-accent/10 backdrop-blur-md transition-colors hover:bg-accent/20"
        >
          BUILD WITH ME →
        </a>
      )}
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
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
