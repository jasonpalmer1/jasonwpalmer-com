import { profile, game, socials } from "@/data/profile";

const xSocial = socials.find((s) => s.label === "X");

/** Shared chrome for home + blog — copyright, domain, Konami hint. */
export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
        <span className="flex items-center gap-2">
          <span className="pulse-dot" /> SYS.ONLINE · © {new Date().getFullYear()}{" "}
          {profile.name}
        </span>
        <span className="tracking-widest">
          {game.callsign}
          {" // "}
          {profile.domain}
          {" // BUILT WITH NEXT.JS × CLOUDFLARE // "}
          {xSocial ? (
            <a
              href={xSocial.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              @GOTOTOWNHQ
            </a>
          ) : (
            "@GOTOTOWNHQ"
          )}
        </span>
      </div>
      <p className="pb-6 text-center font-mono text-[0.6rem] tracking-widest text-muted/40">
        psst — try ↑ ↑ ↓ ↓ ← → ← → B A
      </p>
    </footer>
  );
}
