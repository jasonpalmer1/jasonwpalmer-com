// Static GET route handler — emits /rss.xml at build time with output: "export".

import { getAllPosts } from "@/lib/posts";
import { buildRssXml } from "@/lib/rss";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const base = `https://${profile.domain}`;
  const xml = buildRssXml({
    title: `${profile.name} — Build Log`,
    link: `${base}/blog/`,
    description:
      "Build log dispatches on AI systems, finance tools, and whatever Jason is shipping.",
    selfPath: "/rss.xml",
    posts,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
