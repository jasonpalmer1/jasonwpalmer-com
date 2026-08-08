"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-6 py-24"
    >
      <p className="label">{"// runtime fault"}</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
        SIGNAL DEGRADED
      </h1>
      <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
        Something failed while rendering this sector. Retry, or jump to a known
        route.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs tracking-widest">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded border border-accent/40 bg-accent/10 px-4 py-2 text-accent transition-colors hover:bg-accent/20"
        >
          [ RETRY ]
        </button>
        <Link
          href="/"
          className="rounded border border-border px-4 py-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          [ HOME ]
        </Link>
      </div>
    </main>
  );
}
