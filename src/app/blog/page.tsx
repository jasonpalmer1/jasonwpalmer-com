import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SubscribeBlock from "@/components/SubscribeBlock";
import { getAllPosts } from "@/lib/posts";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Dispatch Log — ${profile.name}`,
  description:
    "Build log dispatches on AI systems, finance tools, and whatever Jason is shipping.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: `Dispatch Log — ${profile.name}`,
    description:
      "Build log dispatches on AI systems, finance tools, and whatever Jason is shipping.",
    url: `https://${profile.domain}/blog/`,
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="label">// dispatch log</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
            BUILD LOG
          </h1>
          <p className="mt-3 font-mono text-sm text-muted">
            Raw dispatches on what I&apos;m building, why, and what&apos;s breaking.
          </p>
        </div>

        {/* Post list */}
        <ol className="space-y-6" aria-label="Blog posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className="group block hud rounded-xl p-5 transition-transform hover:-translate-y-0.5"
              >
                {/* Timestamp + tags row */}
                <div className="flex flex-wrap items-center gap-3">
                  <time
                    dateTime={post.meta.date}
                    className="font-mono text-[0.65rem] text-muted"
                  >
                    {formatDate(post.meta.date)}
                  </time>
                  {post.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-accent/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="mt-2 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                  {post.meta.title}
                </h2>

                {/* Summary */}
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                  {post.meta.summary}
                </p>

                <span className="mt-3 inline-block font-mono text-xs text-accent/70 group-hover:text-accent transition-colors">
                  READ →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {posts.length === 0 && (
          <p className="font-mono text-sm text-muted">// no dispatches yet</p>
        )}

        {/* Subscribe widget — below the posts so the writing comes first */}
        <div className="mt-16 border-t border-border pt-12">
          <SubscribeBlock />
        </div>
      </main>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}
