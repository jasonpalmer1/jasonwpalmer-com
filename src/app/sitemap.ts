// app/sitemap.ts — replaces the hand-maintained public/sitemap.xml.
// Next.js sitemap.ts is supported in static export (it's a cached special Route Handler).
// public/sitemap.xml has been deleted to avoid a filename conflict with this generated one.

export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
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

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/blog/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...postEntries,
  ];
}
