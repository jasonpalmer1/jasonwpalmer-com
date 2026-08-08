"use client";

/**
 * Root-layout failure boundary — must define its own html/body (replaces layout).
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#05060a",
          color: "#e5e7eb",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <title>Signal degraded — Jason Palmer</title>
        <main style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#6b7280" }}>
            {"// root fault"}
          </p>
          <h1 style={{ fontSize: 28, margin: "8px 0 16px", color: "#34f5c5" }}>
            SIGNAL DEGRADED
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#9ca3af" }}>
            The operator terminal failed to boot this view.
            {error?.digest ? ` Digest: ${error.digest}` : ""}
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                padding: "10px 16px",
                background: "rgba(52,245,197,0.15)",
                border: "1px solid rgba(52,245,197,0.4)",
                color: "#34f5c5",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              [ RETRY ]
            </button>
            {/* Plain <a>: global-error replaces the root layout — avoid next/link. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "10px 16px",
                border: "1px solid #1f2937",
                color: "#9ca3af",
                textDecoration: "none",
              }}
            >
              [ HOME ]
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
