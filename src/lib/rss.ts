import type { Post } from "@/lib/posts";
import { profile } from "@/data/profile";

function cdata(text: string): string {
  return String(text || "").replace(/]]>/g, "]]]]><![CDATA[>");
}

function escXml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildRssXml({
  title,
  link,
  description,
  selfPath,
  posts,
}: {
  title: string;
  link: string;
  description: string;
  selfPath: string;
  posts: Post[];
}): string {
  const base = `https://${profile.domain}`;
  const lastBuild = posts[0] ? new Date(posts[0].meta.date) : new Date();
  const lastBuildDate = Number.isNaN(lastBuild.getTime())
    ? new Date().toUTCString()
    : lastBuild.toUTCString();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}/`;
      const pub = new Date(post.meta.date);
      const pubDate = Number.isNaN(pub.getTime())
        ? new Date(0).toUTCString()
        : pub.toUTCString();
      return `
    <item>
      <title><![CDATA[${cdata(post.meta.title)}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cdata(post.meta.summary)}]]></description>
      ${post.meta.tags.map((t) => `<category>${escXml(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escXml(title)}</title>
    <link>${link}</link>
    <description>${escXml(description)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${base}${selfPath}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
