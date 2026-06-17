"use client";

import { skills } from "@/data/profile";
import { useInView } from "@/lib/useInView";

function SkillRow({
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
      <div className="bar-track mt-3">
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

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="label">// loadout</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
          SKILL TREE
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skills.map((g) => (
            <SkillRow key={g.category} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
