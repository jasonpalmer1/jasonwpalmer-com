import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import SubscribeBlock from "@/components/SubscribeBlock";
import TagChip from "@/components/TagChip";
import { getAllTags, getPostsByTag, isValidTag, slugifyTag } from "@/lib/posts";
import { profile } from "@/data/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const slug = slugifyTag(tag);
  if (!isValidTag(slug)) return {};
  const label = `#${slug}`;
  const description = `Dispatches tagged ${label} from ${profile.name}.`;
  return {
    title: `${label} — Dispatch Log — ${profile.name}`,
    description,
    alternates: { canonical: `/blog/tag/${slug}/` },
    openGraph: {
      title: `${label} — Dispatch Log`,
      description,
      url: `https://${profile.domain}/blog/tag/${slug}/`,
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${label} — ${profile.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@gototownhq",
      creator: "@gototownhq",
      title: `${label} — Dispatch Log`,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function TagArchive({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const slug = slugifyTag(tag);
  if (!isValidTag(slug)) notFound();

  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          href="/blog/"
          className="mb-8 inline-block font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← DISPATCH LOG
        </Link>

        <div className="mb-12">
          <p className="label">{"// tag archive"}</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
            #{slug}
          </h1>
          <p className="mt-3 font-mono text-sm text-muted">
            {posts.length} dispatch{posts.length === 1 ? "" : "es"} tagged{" "}
            <span className="text-accent">#{slug}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="/blog/"
              className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              ALL
            </Link>
            <TagChip tag={slug} active />
          </div>
        </div>

        <ol className="space-y-6" aria-label={`Posts tagged ${slug}`}>
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
                  {post.meta.tags.map((t) => (
                    <TagChip key={t} tag={t} />
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
