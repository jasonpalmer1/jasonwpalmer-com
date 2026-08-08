import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface PostMeta {
  title: string;
  date: string; // ISO date string e.g. "2025-10-14"
  summary: string;
  tags: string[];
  cover?: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
}

function normalizeMeta(data: Record<string, unknown>, slug: string): PostMeta {
  const title = typeof data.title === "string" && data.title.trim()
    ? data.title.trim()
    : slug;
  const date =
    typeof data.date === "string" && !Number.isNaN(Date.parse(data.date))
      ? data.date
      : "1970-01-01";
  const summary = typeof data.summary === "string" ? data.summary : "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : [];
  const cover = typeof data.cover === "string" ? data.cover : undefined;
  return { title, date, summary, tags, cover };
}

function readPost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    meta: normalizeMeta(data as Record<string, unknown>, slug),
    content,
  };
}

/** Return all posts sorted newest-first. */
function listPostFiles(): string[] {
  // Skip _TEMPLATE.* and other underscore-prefixed drafts/scaffolds.
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
}

export function getAllPosts(): Post[] {
  const files = listPostFiles();
  const posts = files.map(readPost);
  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}

/** Return a single post by slug. Returns null if not found. */
export function getPostBySlug(slug: string): Post | null {
  if (!SLUG_RE.test(slug)) return null;
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;
  return readPost(`${slug}.mdx`);
}

/** Return all slugs — used by generateStaticParams. */
export function getAllSlugs(): string[] {
  return listPostFiles()
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => SLUG_RE.test(slug));
}
