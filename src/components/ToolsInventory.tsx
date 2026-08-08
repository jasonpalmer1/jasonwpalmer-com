"use client";

import { useEffect, useMemo, useState } from "react";
import {
  statusLabels,
  type Tool,
  type Rarity,
  type ToolStatus,
} from "@/data/tools";
import Gallery from "./Gallery";

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

const RARITY_FILTERS: Array<"all" | Rarity> = [
  "all",
  "legendary",
  "epic",
  "rare",
];
const STATUS_FILTERS: Array<"all" | ToolStatus> = [
  "all",
  "live",
  "active",
  "prototype",
  "archived",
];

function ToolCard({ tool }: { tool: Tool }) {
  const rarity = tool.rarity ?? "rare";
  return (
    <article
      id={tool.id}
      className={`hud group flex flex-col rounded-xl p-6 transition-transform hover:-translate-y-1 ${rarityGlow[rarity]} ${
        tool.featured && rarity === "legendary" ? "sm:col-span-2" : ""
      }`}
    >
      {tool.images && tool.images.length > 0 && (
        <figure className="mb-5">
          <Gallery images={tool.images} />
          {tool.imageCaption && (
            <figcaption className="mt-2 font-mono text-xs leading-snug text-muted">
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
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] ${
            tool.status === "live" || tool.status === "active"
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-border bg-surface text-muted"
          }`}
        >
          {(tool.status === "live" || tool.status === "active") && (
            <span className="pulse-dot" />
          )}
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

/** Client inventory grid with rarity + status filters (keeps Gallery interactive). */
export default function ToolsInventory({ items }: { items: Tool[] }) {
  const [rarity, setRarity] = useState<"all" | Rarity>("all");
  const [status, setStatus] = useState<"all" | ToolStatus>("all");

  // Deep links (/#tool-id) must not land on a filtered-out card.
  useEffect(() => {
    const revealHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !items.some((t) => t.id === id)) return;
      setRarity("all");
      setStatus("all");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    return () => window.removeEventListener("hashchange", revealHash);
  }, [items]);

  const visible = useMemo(() => {
    return items.filter((t) => {
      if (rarity !== "all" && (t.rarity ?? "rare") !== rarity) return false;
      if (status !== "all" && t.status !== status) return false;
      return true;
    });
  }, [items, rarity, status]);

  const chip = (active: boolean) =>
    `rounded border px-2 py-1 font-mono text-[0.65rem] tracking-widest uppercase transition-colors ${
      active
        ? "border-accent/50 bg-accent/15 text-accent"
        : "border-border bg-surface text-muted hover:border-accent/40 hover:text-accent"
    }`;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.6rem] tracking-widest text-muted">
          RARITY
        </span>
        <div role="group" aria-label="Filter builds by rarity" className="flex flex-wrap gap-2">
          {RARITY_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setRarity(f)}
              aria-pressed={rarity === f}
              className={chip(rarity === f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.6rem] tracking-widest text-muted">
          STATUS
        </span>
        <div role="group" aria-label="Filter builds by status" className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatus(f)}
              aria-pressed={status === f}
              className={chip(status === f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="ml-auto font-mono text-xs text-muted">
          {visible.length}/{items.length} SHOWN
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {visible.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="font-mono text-sm text-muted">
          {"// no builds match these filters"}
        </p>
      )}
    </>
  );
}
