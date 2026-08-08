import { profile, game, socials, credentials, education } from "@/data/profile";
import HeroXp from "./HeroXp";
import LastShipped from "./LastShipped";
import CopyButton from "./CopyButton";

const credLine = [
  credentials[0]?.name?.replace(/^FINRA\s+/i, "") ?? "Series 65",
  education[0]?.school?.includes("Texas") ? "UT Austin Finance" : education[0]?.school,
]
  .filter(Boolean)
  .join(" · ");

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="label">{"// operator profile"}</p>

        <div className="mt-6 hud rounded-2xl p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              <span className="pulse-dot" /> STATUS: ONLINE
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              CALLSIGN: <span className="text-foreground">{game.callsign}</span>
              <CopyButton
                value={game.callsign}
                label="COPY"
                className="rounded border border-border px-1.5 py-0.5 text-[0.6rem] tracking-widest text-muted transition-colors hover:border-accent/40 hover:text-accent"
              />
            </span>
            <span className="font-mono text-xs text-muted">
              LOC: <span className="text-foreground">{profile.location}</span>
            </span>
            <span className="font-mono text-xs text-muted">
              CRED:{" "}
              <span className="text-foreground">{credLine}</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-foreground sm:text-7xl">
            <span className="text-glow">{profile.name}</span>
          </h1>
          <p className="mt-3 font-mono text-sm text-accent-2 text-glow-sky sm:text-base">
            {"CLASS // "}
            {game.playerClass}
          </p>

          <p className="mt-6 max-w-2xl text-xl font-semibold leading-snug text-foreground text-glow sm:text-2xl">
            {profile.tagline}
          </p>
          <p className="mt-3 max-w-2xl text-base text-foreground/80 sm:text-lg">
            {profile.subtagline}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {profile.blurb}
          </p>

          <div className="mt-6 max-w-2xl border-l-2 border-accent/40 pl-4">
            <p className="text-base font-semibold leading-snug text-foreground sm:text-lg">
              {profile.mission}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {profile.missionDetail}
            </p>
          </div>

          <HeroXp />
          <LastShipped />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#builds"
              className="rounded-md border border-accent bg-accent/10 px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background"
            >
              [ VIEW BUILDS ]
            </a>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  s.href.startsWith("http")
                    ? "me noopener noreferrer"
                    : undefined
                }
                className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/90 transition-colors hover:border-accent/60 hover:text-accent"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#uplink"
              className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/90 transition-colors hover:border-accent/60 hover:text-accent"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
