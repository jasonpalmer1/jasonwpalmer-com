import { tools, statusLabels, type Tool, type Rarity } from "@/data/tools";

const rarityClass: Record<Rarity, string> = {
  legendary: "rarity-legendary",
  epic: "rarity-epic",
  rare: "rarity-rare",
};
const rarityGlow: Record<Rarity, string> = {
  legendary: "glow-border-legendary",
  epic: "glow-border-epic",
  rare: "glow-border-rare",
};

function ToolCard({ tool }: { tool: Tool }) {
  const rarity = tool.rarity ?? "rare";
  return (
    <article
      id={tool.id}
      className={`hud group flex flex-col rounded-xl p-6 transition-transform hover:-translate-y-1 ${rarityGlow[rarity]} ${
        tool.featured ? "sm:col-span-2" : ""
      }`}
    >
      {tool.image && (
        <figure className="mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.image}
            alt={tool.imageAlt ?? `${tool.name} screenshot`}
            loading="lazy"
            className="w-full rounded-lg border border-border"
          />
          {tool.imageCaption && (
            <figcaption className="mt-2 font-mono text-[0.65rem] leading-snug text-muted/70">
              {tool.imageCaption}
            </figcaption>
          )}
        </figure>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden>
            {tool.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded border px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest ${rarityClass[rarity]}`}
              >
                {rarity}
              </span>
              {tool.year && (
                <span className="font-mono text-[0.6rem] text-muted">
                  {tool.year}
                </span>
              )}
            </div>
            <h3 className="mt-1 font-display text-lg font-bold text-foreground">
              {tool.name}
            </h3>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[0.65rem] text-accent">
          <span className="pulse-dot" />
          {statusLabels[tool.status].toUpperCase()}
        </span>
      </div>

      <p className="mt-2 font-mono text-xs text-accent-2">{tool.tagline}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
        {tool.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {tool.stack.map((t) => (
          <li
            key={t}
            className="rounded border border-border bg-surface px-2 py-1 font-mono text-[0.65rem] text-muted"
          >
            {t}
          </li>
        ))}
      </ul>

      {(tool.liveUrl || tool.sourceUrl) && (
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 font-mono text-sm">
          {tool.liveUrl && (
            <a
              href={tool.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent transition-colors hover:text-glow"
            >
              [ LAUNCH → ]
            </a>
          )}
          {tool.sourceUrl && (
            <a
              href={tool.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              [ SOURCE ]
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function Tools() {
  return (
    <section id="builds" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="label">// inventory</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
              BUILDS
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {tools.length} UNLOCKED
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
