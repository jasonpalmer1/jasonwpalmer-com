import Link from "next/link";
import { game } from "@/data/profile";

// Section links are absolute (/#…) so they work from any page, not just home.
const sectionLinks = [
  { href: "/#builds", label: "BUILDS" },
  { href: "/#platforms", label: "PLATFORMS" },
  { href: "/#skills", label: "SKILLS" },
  { href: "/#log", label: "LOG" },
  { href: "/#uplink", label: "UPLINK" },
  { href: "/blog/", label: "DISPATCHES", clientNav: true },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded focus:border focus:border-accent focus:bg-surface focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-accent"
      >
        Skip to content
      </a>
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Brand → home */}
        <Link
          href="/"
          aria-label="Home"
          className="flex shrink-0 items-center gap-2 font-mono text-sm"
        >
          <span className="pulse-dot" />
          <span className="font-display font-bold tracking-widest text-gradient">
            {game.callsign}
          </span>
          <span className="hidden text-[0.65rem] tracking-widest text-muted sm:inline">
            {"// SYS.ONLINE"}
          </span>
        </Link>

        {/* Links — scroll horizontally on narrow screens; CTA stays pinned */}
        <ul className="flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto font-mono text-[0.7rem] [scrollbar-width:none] sm:justify-end sm:gap-2 sm:text-xs [&::-webkit-scrollbar]:hidden">
          {sectionLinks.map((l) => (
            <li key={l.href} className="shrink-0">
              {l.clientNav ? (
                <Link
                  href={l.href}
                  className="block whitespace-nowrap rounded px-2 py-1.5 tracking-widest text-muted transition-colors hover:bg-surface hover:text-accent"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  className="block whitespace-nowrap rounded px-2 py-1.5 tracking-widest text-muted transition-colors hover:bg-surface hover:text-accent"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/#subscribe"
          className="shrink-0 whitespace-nowrap rounded border border-accent/40 bg-accent/10 px-2 py-1.5 font-mono text-[0.7rem] tracking-widest text-accent transition-colors hover:bg-accent/20 sm:text-xs"
        >
          SUBSCRIBE
        </Link>
      </nav>
    </header>
  );
}
