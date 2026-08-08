import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import SubscribeBlock from "@/components/SubscribeBlock";
import BlogIndexClient from "@/components/BlogIndexClient";
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

  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.meta.title,
    summary: p.meta.summary,
    date: p.meta.date,
    tags: p.meta.tags,
  }));

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
        </div>

        <BlogIndexClient posts={items} tags={tags} />

        <div className="mt-16 border-t border-border pt-12">
          <SubscribeBlock />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
