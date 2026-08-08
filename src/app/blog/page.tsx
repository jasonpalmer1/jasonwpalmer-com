import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import SubscribeBlock from "@/components/SubscribeBlock";
import TagChip from "@/components/TagChip";
import { getAllPosts, getAllTags } from "@/lib/posts";
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
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `Dispatch Log — ${profile.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gototownhq",
    creator: "@gototownhq",
    title: `Dispatch Log — ${profile.name}`,
    description:
      "Build log dispatches on AI systems, finance tools, and whatever Jason is shipping.",
    images: ["/og.png"],
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const base = `https://${profile.domain}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/blog/${post.slug}/`,
      name: post.meta.title,
    })),
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="label">{"// dispatch log"}</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
            BUILD LOG
          </h1>
          <p className="mt-3 font-mono text-sm text-muted">
            Raw dispatches on what I&apos;m building, why, and what&apos;s breaking.{" "}
            <a
              href="/rss.xml"
              className="text-accent/80 transition-colors hover:text-accent"
            >
              RSS
            </a>
          </p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by tag">
              {tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Post list — tags sit outside the post Link (no nested anchors) */}
        <ol className="space-y-6" aria-label="Blog posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="hud rounded-xl p-5 transition-transform hover:-translate-y-0.5">
                <div className="flex flex-wrap items-center gap-3">
                  <time
                    dateTime={post.meta.date}
                    className="font-mono text-[0.65rem] text-muted"
                  >
                    {formatDate(post.meta.date)}
                  </time>
                  {post.meta.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </div>
                <Link href={`/blog/${post.slug}/`} className="group mt-2 block">
                  <h2 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                    {post.meta.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                    {post.meta.summary}
                  </p>
                  <span className="mt-3 inline-block font-mono text-xs text-accent/70 transition-colors group-hover:text-accent">
                    READ →
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ol>

        {posts.length === 0 && (
          <p className="font-mono text-sm text-muted">{"// no dispatches yet"}</p>
        )}

        {/* Subscribe widget — below the posts so the writing comes first */}
        <div className="mt-16 border-t border-border pt-12">
          <SubscribeBlock />
        </div>
      </main>
      <SiteFooter />
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
