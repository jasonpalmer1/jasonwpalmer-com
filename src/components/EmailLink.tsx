"use client";

import { useEffect, useState } from "react";

// The address is base64-encoded so the plain string never appears in the
// static HTML or the JS bundle as a literal — it's only assembled in the
// browser at runtime. Defeats automated email-address harvesters/spam bots.
const ENCODED = "andwYWxtOTlAZ21haWwuY29t";

export default function EmailLink({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmail(atob(ENCODED));
    } catch {
      /* no-op */
    }
  }, []);

  // Pre-hydration / no-JS: render a non-harvestable placeholder.
  if (!email) {
    return (
      <span className={className} aria-hidden>
        {label ?? "[ email ]"}
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {label ?? `[ ${email} ]`}
    </a>
  );
}
