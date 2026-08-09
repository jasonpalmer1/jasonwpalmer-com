import type { Metadata } from "next";
import Nav from "@/components/Nav";

// Root layout.tsx sets title/canonical/OG for the whole site; without this
// override, every unmatched URL (and every invalid /blog/[slug]) silently
// inherited the homepage's title + canonical="/" + OG card, so a broken
// link looked, in the tab and in any share preview, exactly like the
// homepage. `alternates: {}` clears the inherited canonical instead of
// pointing it at "/".
// Next auto-injects <meta name="robots" content="noindex"> on any 404
// response, so no explicit robots field is needed here.
export const metadata: Metadata = {
  title: "404: Route Not Found",
  description: "This page doesn't exist — the route you followed is broken or out of date.",
  alternates: {},
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-mono text-xs tracking-widest text-accent">
          // ERR_ROUTE_NOT_FOUND
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          404
        </h1>
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
          This route doesn&apos;t resolve. The link is broken, out of date, or
          never existed.
        </p>
        <a
          href="/"
          className="mt-8 rounded-md border border-accent bg-accent/10 px-6 py-3 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background"
        >
          [ RETURN HOME ]
        </a>
      </main>
    </>
  );
}
