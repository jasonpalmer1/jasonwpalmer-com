"use client";

import { useEffect, useRef, useState } from "react";
import { BEEHIIV_FORM_ID, BEEHIIV_LOADER_SRC } from "@/data/newsletter";

export default function Subscribe() {
  if (BEEHIIV_FORM_ID) {
    return <BeehiivForm />;
  }
  return <PlaceholderForm />;
}

// Live Beehiiv v3 embed. The loader script can't be rendered as raw JSX (React
// won't execute it), so we inject it into a ref'd container on mount. The loader
// locates itself via its data-beehiiv-form attribute and renders the form there.
function BeehiivForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Guard against double-injection (StrictMode re-mount / re-render).
    if (container.querySelector("script[data-beehiiv-form]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = BEEHIIV_LOADER_SRC;
    script.setAttribute("data-beehiiv-form", BEEHIIV_FORM_ID);
    container.appendChild(script);
  }, []);

  // No hud wrapper here — the Beehiiv form renders its own card. Just constrain
  // and center it so it doesn't blow out to full width.
  return <div ref={containerRef} className="mx-auto w-full max-w-md" />;
}

// Placeholder shown when BEEHIIV_FORM_ID is empty.
function PlaceholderForm() {
  const [email, setEmail] = useState("");

  return (
    <div className="hud rounded-xl p-6 sm:p-8">
      <SubscribeHeader />
      <p className="mt-1 font-mono text-xs text-muted">
        Dispatches on AI systems, finance tools, and whatever I&apos;m shipping. No spam.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/40 sm:flex-1"
        />
        <button
          type="button"
          disabled
          title="Beehiiv embed coming soon — set BEEHIIV_FORM_ID in src/data/newsletter.ts to activate"
          className="rounded-md border border-accent/40 bg-accent/10 px-5 py-2 font-mono text-sm font-semibold tracking-wide text-accent/60 cursor-not-allowed"
        >
          SUBSCRIBE — SOON
        </button>
      </div>

      <p className="mt-3 font-mono text-[0.65rem] text-muted/60">
        // placeholder — set BEEHIIV_FORM_ID in <code className="text-accent/70">src/data/newsletter.ts</code> to go live
      </p>
    </div>
  );
}

function SubscribeHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="pulse-dot" />
      <div>
        <p className="label">// dispatch log</p>
        <h3 className="font-display text-lg font-bold tracking-tight text-gradient">
          SUBSCRIBE TO THE BUILD LOG
        </h3>
      </div>
    </div>
  );
}
