import { lore } from "@/data/profile";

export default function Lore() {
  return (
    <section id="lore" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <details className="hud group rounded-xl">
          <summary className="lore-summary flex items-center gap-3 px-5 py-4 sm:px-6">
            <span className="lore-chevron font-mono text-accent">▸</span>
            <span className="font-display text-sm font-bold tracking-widest text-foreground">
              PERSONNEL FILE
            </span>
            <span className="hidden font-mono text-[0.65rem] tracking-widest text-muted sm:inline">
              // LORE · CLASSIFIED
            </span>
            <span className="lore-cta ml-auto font-mono text-[0.65rem] tracking-widest text-accent">
              [&nbsp;
            </span>
          </summary>

          <div className="lore-body border-t border-border px-5 py-6 sm:px-6">
            <figure className="mb-7 border-b border-border pb-7 text-center">
              <blockquote className="font-display text-2xl font-bold tracking-tight text-foreground text-glow sm:text-3xl">
                &ldquo;{lore.epigraph.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-mono text-xs tracking-widest text-muted">
                — {lore.epigraph.author}
              </figcaption>
            </figure>

            <p className="font-mono text-sm leading-relaxed text-accent-2 text-glow-sky">
              {lore.principle}
            </p>
            <p className="mt-2 font-mono text-[0.65rem] tracking-widest text-muted">
              // everything below is evidence for that line
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lore.entries.map((e) => (
                <div
                  key={e.code}
                  className="rounded-lg border border-border bg-surface/60 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.65rem] text-accent">
                      {e.code}
                    </span>
                    <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-muted">
                      {e.tag}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-sm font-bold text-foreground">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {e.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
