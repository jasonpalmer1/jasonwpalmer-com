"use client";

import { useState } from "react";

/** Small HUD control — copies `value` to clipboard with brief feedback. */
export default function CopyButton({
  value,
  label,
  copiedLabel = "COPIED",
  className = "",
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={className}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? copiedLabel : label}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
