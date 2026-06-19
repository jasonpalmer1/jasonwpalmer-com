"use client";

import { useState } from "react";

// Web3Forms public access key — designed to live in client-side HTML.
// Submissions are relayed to the owner's inbox; the email address never
// appears anywhere on the page.
const ACCESS_KEY = "15d9048e-fd86-4578-8772-1d8a59525dce";

type Status = "idle" | "sending" | "ok" | "error";

const inputClass =
  "w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/40";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const payload = {
      access_key: ACCESS_KEY,
      subject: "New message from jasonwpalmer.com",
      ...Object.fromEntries(new FormData(form).entries()),
    };
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
        setError(json.message || "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error — please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="mt-8 rounded-md border border-accent/40 bg-accent/10 p-6 text-center font-mono text-sm text-accent">
        ✓ TRANSMISSION RECEIVED — I&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
      {/* honeypot — bots fill this; Web3Forms drops the submission */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
            NAME
          </span>
          <input name="name" type="text" required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
            YOUR EMAIL
          </span>
          <input name="email" type="email" required className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
          MESSAGE
        </span>
        <textarea name="message" required rows={4} className={inputClass} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md border border-accent bg-accent/10 px-6 py-3 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {status === "sending" ? "SENDING…" : "[ SEND MESSAGE ]"}
        </button>
        {status === "error" && (
          <span className="font-mono text-xs text-red-400">{error}</span>
        )}
      </div>
    </form>
  );
}
