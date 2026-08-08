import { notFound } from "next/navigation";
import {
  getAllTags,
  getPostsByTag,
  isValidTag,
  slugifyTag,
} from "@/lib/posts";
import { buildRssXml } from "@/lib/rss";
import { profile } from "@/data/profile";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ tag: string }> },
) {
  const { tag } = await context.params;
  const slug = slugifyTag(tag);
  if (!isValidTag(slug)) notFound();

  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();

  const base = `https://${profile.domain}`;
  const xml = buildRssXml({
    title: `${profile.name} — #${slug}`,
    link: `${base}/blog/tag/${slug}/`,
    description: `Dispatches tagged #${slug} from ${profile.name}.`,
    selfPath: `/rss/tag/${slug}/`,
    posts,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
