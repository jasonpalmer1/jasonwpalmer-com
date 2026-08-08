"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TagChip from "@/components/TagChip";
import CopyButton from "@/components/CopyButton";

export type BlogIndexItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

function groupByYear(posts: BlogIndexItem[]): [string, BlogIndexItem[]][] {
  const map = new Map<string, BlogIndexItem[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4) || "undated";
    const list = map.get(year) ?? [];
    list.push(post);
    map.set(year, list);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

/** In-page search over title/summary/tags; keeps year grouping. */
export default function BlogIndexClient({
  posts,
  tags,
}: {
  posts: BlogIndexItem[];
  tags: string[];
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return posts;
    return posts.filter((p) => {
      const hay = `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [posts, query]);

  const groups = groupByYear(filtered);

  return (
    <>
      <div className="mb-8">
        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2" aria-label="Browse by tag">
            {tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
        <label className="block">
          <span className="mb-1 block font-mono text-[0.65rem] tracking-widest text-muted">
            SEARCH DISPATCHES
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="title, summary, or tag…"
            autoComplete="off"
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/40"
          />
        </label>
        {query && (
          <p className="mt-2 font-mono text-xs text-muted" role="status">
            {filtered.length} match{filtered.length === 1 ? "" : "es"} for “{q.trim()}”
          </p>
        )}
      </div>

      {groups.map(([year, yearPosts]) => (
        <section key={year} className="mb-12" aria-labelledby={`year-${year}`}>
          <h2
            id={`year-${year}`}
            className="mb-5 font-mono text-xs tracking-widest text-muted"
          >
            {"// "}
            {year}
          </h2>
          <ol className="space-y-6" aria-label={`Dispatches from ${year}`}>
            {yearPosts.map((post) => (
              <li key={post.slug}>
                <article className="hud rounded-xl p-5 transition-transform hover:-translate-y-0.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <time
                      dateTime={post.date}
                      className="font-mono text-[0.65rem] text-muted"
                    >
                      {formatDate(post.date)}
                    </time>
                    {post.tags.map((tag) => (
                      <TagChip key={tag} tag={tag} />
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}/`} className="group mt-2 block">
                    <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                      {post.summary}
                    </p>
                    <span className="mt-3 inline-block font-mono text-xs text-accent/70 transition-colors group-hover:text-accent">
                      READ →
                    </span>
                  </Link>
                  <div className="mt-3">
                    <CopyButton
                      value={`https://jasonwpalmer.com/blog/${post.slug}/`}
                      label="COPY LINK"
                      className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    />
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="font-mono text-sm text-muted">
          {query ? "// no matches" : "// no dispatches yet"}
        </p>
      )}
    </>
  );
}
