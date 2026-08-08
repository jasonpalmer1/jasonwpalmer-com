// Static GET route handler — emits /rss.xml at build time with output: "export".
// Route handlers that use only GET and no dynamic request values are supported in static export.

import { getAllPosts } from "@/lib/posts";
import { profile } from "@/data/profile";

export const dynamic = "force-static";

function cdata(text: string): string {
  // CDATA cannot contain ]]> — split if present.
  return String(text || "").replace(/]]>/g, "]]]]><![CDATA[>");
}

function escXml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = getAllPosts();
  const base = `https://${profile.domain}`;

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escXml(profile.name)} — Build Log</title>
    <link>${base}/blog/</link>
    <description>Build log dispatches on AI systems, finance tools, and whatever Jason is shipping.</description>
    <language>en-US</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
