"use client";

import { useEffect, useState } from "react";
import { game } from "@/data/profile";

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

/** Client-only rank + XP bar (avoids SSR/hydration mismatch on live age). */
export default function HeroXp() {
  const [age, setAge] = useState<AgeStats | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const a = computeAge(game.birthDate);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = requestAnimationFrame(() => setAge(a));
    const t1 = setTimeout(() => setXp(a.xpPct), reduce ? 0 : 400);
    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
    };
  }, []);

  const level = age?.level ?? "··";
  const daysSince = age?.daysSince ?? 0;
  const daysInYear = age?.daysInYear ?? 365;
  const nextLevel = typeof level === "number" ? level + 1 : "··";

  return (
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
      <div
        className="bar-track mt-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(xp)}
        aria-label={`Year XP ${Math.round(xp)} percent`}
      >
        <div className="bar-fill" style={{ width: `${xp}%` }} />
      </div>
    </div>
  );
}
