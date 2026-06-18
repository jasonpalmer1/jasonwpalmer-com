"use client";

import { useEffect, useState } from "react";
import { profile, game, socials } from "@/data/profile";
import EmailLink from "@/components/EmailLink";

type AgeStats = {
  level: number;
  daysSince: number;
  daysInYear: number;
  xpPct: number;
};

// LEVEL = current age. XP = days elapsed in the current year of life.
function computeAge(birthISO: string): AgeStats {
  const [y, m, d] = birthISO.split("-").map(Number);
  const now = new Date();
  const dob = new Date(y, m - 1, d);
  const hadBday =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  const level = now.getFullYear() - dob.getFullYear() - (hadBday ? 0 : 1);
  const lastBday = new Date(
    now.getFullYear() - (hadBday ? 0 : 1),
    dob.getMonth(),
    dob.getDate(),
  );
  const nextBday = new Date(
    lastBday.getFullYear() + 1,
    dob.getMonth(),
    dob.getDate(),
  );
  const DAY = 86_400_000;
  const daysSince = Math.floor((now.getTime() - lastBday.getTime()) / DAY);
  const daysInYear = Math.round((nextBday.getTime() - lastBday.getTime()) / DAY);
  return { level, daysSince, daysInYear, xpPct: (daysSince / daysInYear) * 100 };
}

export default function Hero() {
  // Compute age stats on the client (avoids hydration mismatch) and
  // animate the XP bar to the real value.
  const [age, setAge] = useState<AgeStats | null>(null);
  const [xp, setXp] = useState(0);
  useEffect(() => {
    const a = computeAge(game.birthDate);
    setAge(a);
    const t = setTimeout(() => setXp(a.xpPct), 400);
    return () => clearTimeout(t);
  }, []);

  const level = age?.level ?? "··";
  const daysSince = age?.daysSince ?? 0;
  const daysInYear = age?.daysInYear ?? 365;
  const nextLevel = typeof level === "number" ? level + 1 : "··";

  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="label">// operator profile</p>

        <div className="mt-6 hud rounded-2xl p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              <span className="pulse-dot" /> STATUS: ONLINE
            </span>
            <span className="font-mono text-xs text-muted">
              CALLSIGN: <span className="text-foreground">{game.callsign}</span>
            </span>
            <span className="font-mono text-xs text-muted">
              LOC: <span className="text-foreground">{profile.location}</span>
            </span>
            <span className="font-mono text-xs text-muted">
              CRED:{" "}
              <span className="text-foreground">Series 65 · UT Austin Finance</span>
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-foreground sm:text-7xl">
            <span className="text-glow">{profile.name}</span>
          </h1>
          <p className="mt-3 font-mono text-sm text-accent-2 text-glow-sky sm:text-base">
            CLASS // {game.playerClass}
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

          {/* Rank + XP bar */}
          <div className="mt-8 max-w-md">
            <div className="flex items-end justify-between font-mono text-xs">
              <span className="text-muted">
                RANK <span className="text-gold">{game.rank}</span> · LVL{" "}
                <span className="text-foreground">{level}</span>
              </span>
              <span className="text-muted">
                {daysSince}/{daysInYear} DAYS → LVL {nextLevel}
              </span>
            </div>
            <div className="bar-track mt-2">
              <div className="bar-fill" style={{ width: `${xp}%` }} />
            </div>
          </div>

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
                rel="noopener noreferrer"
                className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/90 transition-colors hover:border-accent/60 hover:text-accent"
              >
                {s.label}
              </a>
            ))}
            <EmailLink
              label="Email"
              className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/90 transition-colors hover:border-accent/60 hover:text-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
