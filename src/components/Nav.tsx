import { game } from "@/data/profile";

const links = [
  { href: "#builds", label: "BUILDS" },
  { href: "#skills", label: "SKILLS" },
  { href: "#log", label: "LOG" },
  { href: "#uplink", label: "UPLINK" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm">
          <span className="pulse-dot" />
          <span className="font-display font-bold tracking-widest text-gradient">
            {game.callsign}
          </span>
          <span className="hidden text-[0.65rem] tracking-widest text-muted sm:inline">
            // SYS.ONLINE
          </span>
        </a>
        <ul className="flex items-center gap-1 font-mono text-xs sm:gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded px-2.5 py-1.5 tracking-widest text-muted transition-colors hover:bg-surface hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
