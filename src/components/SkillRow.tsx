"use client";

import { useInView } from "@/lib/useInView";

export default function SkillRow({
  category,
  level,
  items,
}: {
  category: string;
  level: number;
  items: string[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="hud rounded-xl p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
          {category}
        </h3>
        <span className="font-mono text-xs text-accent">
          LVL {Math.round(level / 10)}
          <span className="text-muted"> · {level}/100</span>
        </span>
      </div>
      <div
        className="bar-track mt-3"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={level}
        aria-label={`${category} skill level ${level} of 100`}
      >
        <div className="bar-fill" style={{ width: inView ? `${level}%` : 0 }} />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded border border-border bg-surface px-2 py-1 font-mono text-[0.65rem] text-muted"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
