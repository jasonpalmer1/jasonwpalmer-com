import { platforms, type Platform } from "@/data/platforms";
import Counter from "@/components/Counter";

function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <article className="hud glow-border-epic flex flex-col rounded-xl p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {platform.icon}
        </span>
        <div>
          {platform.year && (
            <span className="font-mono text-[0.6rem] text-muted">
              {platform.year}
            </span>
          )}
          <h3 className="mt-1 font-display text-lg font-bold text-foreground">
            {platform.name}
          </h3>
        </div>
      </div>

      <p className="mt-2 font-mono text-xs text-accent-2">{platform.tagline}</p>

      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        {platform.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-5">
        {platform.stats.map((s) => (
          <div key={s.label} className="bg-surface px-3 py-4 text-center sm:px-4">
            <div className="font-display text-xl font-bold text-accent text-glow sm:text-2xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="label mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {platform.note && (
        <p className="mt-4 font-mono text-xs text-muted">{platform.note}</p>
      )}
    </article>
  );
}

export default function Platforms() {
  return (
    <section id="platforms" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="label">{"// distribution"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
              PLATFORMS
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {platforms.length} TRACKED
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {platforms.map((p) => (
            <PlatformCard key={p.id} platform={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
