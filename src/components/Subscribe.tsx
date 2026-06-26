"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("success");
        setMessage(json.message || "Check your inbox to confirm.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.error || "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <div className="hud rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="pulse-dot" />
        <div>
          <p className="label">// dispatch log</p>
          <h3 className="font-display text-lg font-bold tracking-tight text-gradient">
            SUBSCRIBE TO THE BUILD LOG
          </h3>
        </div>
      </div>
      <p className="mt-1 font-mono text-xs text-muted">
        Dispatches on AI systems, finance tools, and whatever I&apos;m shipping. No spam.
      </p>

      {status === "success" ? (
        <div className="mt-5 rounded-md border border-accent/40 bg-accent/10 p-4 font-mono text-sm text-accent">
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              required
              disabled={status === "submitting"}
              className="w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/40 sm:flex-1 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-md border border-accent bg-accent/10 px-5 py-2 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
            >
              {status === "submitting" ? "SENDING…" : "SUBSCRIBE"}
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 font-mono text-xs text-red-400">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
