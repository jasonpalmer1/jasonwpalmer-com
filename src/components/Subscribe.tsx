"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

// Just the form mechanics (email input + button + states). Presentation —
// heading, card, copy — lives in SubscribeBlock so there's a single header.
export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = e.currentTarget;
    const honeypot = new FormData(form).get("botcheck");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, botcheck: honeypot || "" }),
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

  if (status === "success") {
    return (
      <div
        role="status"
        className="mx-auto max-w-md rounded-md border border-accent/40 bg-accent/10 p-4 font-mono text-sm text-accent"
      >
        ✓ {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
      {/* Honeypot — leave empty. Server drops submissions when filled. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
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
        <p className="mt-2 font-mono text-xs text-red-400" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
