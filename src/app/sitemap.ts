// app/sitemap.ts — replaces the hand-maintained public/sitemap.xml.
// Next.js sitemap.ts is supported in static export (it's a cached special Route Handler).
// public/sitemap.xml has been deleted to avoid a filename conflict with this generated one.

export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${profile.domain}`;
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}/`,
    lastModified: new Date(post.meta.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((tag) => {
    const tagged = getPostsByTag(tag);
    const newest = tagged[0]?.meta.date;
    return {
      url: `${base}/blog/tag/${tag}/`,
      lastModified: new Date(newest ?? "1970-01-01"),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  // NOT `new Date()`. Build time means every deploy tells Google these two
  // pages changed, whether they did or not — and a sitemap caught claiming a
  // freshness it can't back is one Google learns to discount. The blog index
  // is exactly as fresh as its newest post; the homepage is the newer of that
  // post or the last real edit to the homepage's own copy (SITE_UPDATED below,
  // which is why it is a hand-bumped constant and not a timestamp).
  const SITE_UPDATED = "2026-08-09"; // bump when the homepage copy changes
  const newestPost = posts
    .map((p) => p.meta.date)
    .sort()
    .pop();
  const homeDate = [SITE_UPDATED, newestPost].filter(Boolean).sort().pop()!;

  return [
    {
      url: `${base}/`,
      lastModified: new Date(homeDate),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/blog/`,
      lastModified: new Date(newestPost ?? SITE_UPDATED),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
