"use client";

import { useState } from "react";

// Web3Forms public access key — designed to live in client-side HTML.
// Submissions are relayed to the owner's inbox; the email address never
// appears anywhere on the page.
const ACCESS_KEY = "15d9048e-fd86-4578-8772-1d8a59525dce";

type Status = "idle" | "sending" | "ok" | "error";

const inputClass =
  "w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/40";

export default function ConsultingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const payload = {
      access_key: ACCESS_KEY,
      subject: "New consulting inquiry — jasonwpalmer.com",
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
        ✓ TRANSMISSION RECEIVED — I&apos;ll be in touch within 48 hours.
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

      {/* Row 1: Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
            NAME
          </span>
          <input name="name" type="text" required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
            EMAIL
          </span>
          <input name="email" type="email" required className={inputClass} />
        </label>
      </div>

      {/* Row 2: Company / Role */}
      <label className="block">
        <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
          COMPANY / ROLE
        </span>
        <input name="company_role" type="text" required className={inputClass} />
      </label>

      {/* Row 3: What do you want built? */}
      <label className="block">
        <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
          WHAT DO YOU WANT BUILT?
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className={inputClass}
        />
      </label>

      {/* Row 4: Budget range */}
      <label className="block">
        <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
          BUDGET RANGE
        </span>
        <select
          name="budget"
          required
          defaultValue=""
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>
            -- Select a range --
          </option>
          <option value="&lt;$10k">Under $10K</option>
          <option value="$10k–$30k">$10K – $30K</option>
          <option value="$30k–$75k">$30K – $75K</option>
          <option value="$75k+">$75K+</option>
          <option value="not-sure">Not sure yet — let&apos;s talk</option>
        </select>
      </label>

      {/* Row 5: Timeline */}
      <label className="block">
        <span className="mb-1 block font-mono text-xs tracking-wide text-muted">
          TIMELINE
        </span>
        <select
          name="timeline"
          required
          defaultValue=""
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>
            -- Select timeline --
          </option>
          <option value="asap">ASAP / urgent</option>
          <option value="1-month">Within a month</option>
          <option value="1-3-months">1–3 months</option>
          <option value="exploring">Just exploring</option>
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md border border-accent bg-accent/10 px-6 py-3 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background disabled:opacity-50"
        >
          {status === "sending" ? "SENDING…" : "[ OPEN CHANNEL ]"}
        </button>
        {status === "error" && (
          <span className="font-mono text-xs text-red-400">{error}</span>
        )}
      </div>
    </form>
  );
}
