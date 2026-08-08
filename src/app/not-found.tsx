import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "404 — Signal lost",
  description: "That route is not on this terminal.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center px-6 py-24"
      >
        <p className="label">{"// navigation fault"}</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
          404 — SIGNAL LOST
        </h1>
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-muted">
          No page at this coordinates. The uplink is still online — pick a known
          sector below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs tracking-widest">
          <Link
            href="/"
            className="rounded border border-accent/40 bg-accent/10 px-4 py-2 text-accent transition-colors hover:bg-accent/20"
          >
            [ HOME ]
          </Link>
          <Link
            href="/blog/"
            className="rounded border border-border px-4 py-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            [ DISPATCH LOG ]
          </Link>
          <Link
            href="/#builds"
            className="rounded border border-border px-4 py-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            [ BUILDS ]
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
