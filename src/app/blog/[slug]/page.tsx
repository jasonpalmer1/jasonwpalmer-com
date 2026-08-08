import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import SubscribeBlock from "@/components/SubscribeBlock";
import TagChip from "@/components/TagChip";
import {
  getAllPosts,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  readingMinutes,
} from "@/lib/posts";
import { profile } from "@/data/profile";

// Prevent accessing slugs not defined in generateStaticParams.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://${profile.domain}/blog/${slug}/`;
  return {
    title: `${post.meta.title} — ${profile.name}`,
    description: post.meta.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.summary,
      url,
      type: "article",
      publishedTime: post.meta.date,
      authors: [profile.name],
      images: post.meta.cover
        ? [
            {
              url: post.meta.cover,
              width: 1200,
              height: 630,
              alt: post.meta.title,
            },
          ]
        : [
            {
              url: "/og.png",
              width: 1200,
              height: 630,
              alt: `${profile.name} — ${profile.title}`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@gototownhq",
      creator: "@gototownhq",
      title: post.meta.title,
      description: post.meta.summary,
      images: post.meta.cover ? [post.meta.cover] : ["/og.png"],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://${profile.domain}/blog/${slug}/`;
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const mins = readingMinutes(post.content);
  const related = getRelatedPosts(slug, 2);

  // Article JSON-LD — mirrors the Person JSON-LD pattern in layout.tsx.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.summary,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    author: {
      "@type": "Person",
      name: profile.name,
      url: `https://${profile.domain}`,
    },
    url,
    image: post.meta.cover || `https://${profile.domain}/og.png`,
    keywords: post.meta.tags.join(", "),
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/blog/"
          className="mb-8 inline-block font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          ← DISPATCH LOG
        </Link>

        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <time
              dateTime={post.meta.date}
              className="font-mono text-[0.65rem] text-muted"
            >
              {formatDate(post.meta.date)}
            </time>
            <span className="font-mono text-[0.65rem] text-muted">
              {mins} min read
            </span>
            {post.meta.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.meta.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {post.meta.summary}
          </p>
        </header>

        {/* MDX body — custom components styled to the theme */}
        <article className="prose-blog">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {related.length > 0 && (
          <aside className="mt-12 border-t border-border pt-8">
            <p className="label">{"// related dispatches"}</p>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}/`}
                    className="font-mono text-sm text-accent/80 transition-colors hover:text-accent"
                  >
                    {r.meta.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {(newer || older) && (
          <nav
            className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
            aria-label="Adjacent dispatches"
          >
            {older ? (
              <Link
                href={`/blog/${older.slug}/`}
                className="font-mono text-xs text-muted transition-colors hover:text-accent"
              >
                ← {older.meta.title}
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/blog/${newer.slug}/`}
                className="font-mono text-xs text-muted transition-colors hover:text-accent sm:text-right"
              >
                {newer.meta.title} →
              </Link>
            ) : null}
          </nav>
        )}

        {/* Subscribe widget at the end of every post */}
        <div className="mt-16 border-t border-border pt-12">
          <SubscribeBlock />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Custom MDX components ──────────────────────────────────────────────────────

const mdxComponents = {
  h1: ({ children }: React.PropsWithChildren) => (
    <h1 className="mt-10 mb-4 font-display text-3xl font-bold tracking-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }: React.PropsWithChildren) => (
    <h2 className="mt-8 mb-3 font-display text-2xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }: React.PropsWithChildren) => (
    <h3 className="mt-6 mb-2 font-display text-xl font-bold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: React.PropsWithChildren) => (
    <p className="my-4 text-base leading-7 text-foreground/85">{children}</p>
  ),
  a: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Reject javascript:/data: etc. Solo-authored MDX is trusted, but PRs aren't.
    const safe =
      typeof href === "string" && /^(https?:\/\/|\/|#|mailto:)/i.test(href)
        ? href
        : undefined;
    return (
      <a
        href={safe}
        target={safe?.startsWith("http") ? "_blank" : undefined}
        rel={safe?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-accent-2 underline underline-offset-2 hover:text-accent transition-colors"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }: React.PropsWithChildren) => (
    <ul className="my-4 space-y-1.5 pl-5 text-base leading-7 text-foreground/85 list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }: React.PropsWithChildren) => (
    <ol className="my-4 space-y-1.5 pl-5 text-base leading-7 text-foreground/85 list-decimal">
      {children}
    </ol>
  ),
  li: ({ children }: React.PropsWithChildren) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: React.PropsWithChildren) => (
    <blockquote className="my-5 border-l-2 border-accent/50 pl-4 font-mono text-sm italic text-muted">
      {children}
    </blockquote>
  ),
  code: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => {
    // Fenced blocks render as <pre><code class="language-…"> — skip the
    // inline chip styles so they aren't double-padded.
    if (className) {
      return <code className={`${className} font-mono text-sm`}>{children}</code>;
    }
    return (
      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-accent/90">
        {children}
      </code>
    );
  },
  pre: ({ children }: React.PropsWithChildren) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-5 font-mono text-sm leading-6 text-foreground/90 [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }: React.PropsWithChildren) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: React.PropsWithChildren) => (
    <em className="italic text-foreground/80">{children}</em>
  ),
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
