import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Normalize a front-matter tag into a URL slug. */
export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidTag(tag: string): boolean {
  return TAG_RE.test(slugifyTag(tag));
}

export interface PostMeta {
  title: string;
  date: string; // ISO date string e.g. "2025-10-14"
  summary: string;
  tags: string[];
  cover?: string;
  /** Optional tool ids from `src/data/tools.ts` — linked as related builds. */
  builds?: string[];
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
  const builds = Array.isArray(data.builds)
    ? data.builds.filter((b): b is string => typeof b === "string")
    : undefined;
  return { title, date, summary, tags, cover, builds };
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
  // Skip _TEMPLATE.* / underscore drafts, and anything outside SLUG_RE so
  // index/RSS/sitemap never link to slugs that generateStaticParams omits.
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .filter((f) => SLUG_RE.test(f.replace(/\.mdx$/, "")));
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

/** Unique tag slugs across all posts (sorted). */
export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.meta.tags) {
      const slug = slugifyTag(tag);
      if (TAG_RE.test(slug)) set.add(slug);
    }
  }
  return [...set].sort();
}

/** Posts that carry a given tag (newest first). */
export function getPostsByTag(tag: string): Post[] {
  const slug = slugifyTag(tag);
  if (!TAG_RE.test(slug)) return [];
  return getAllPosts().filter((post) =>
    post.meta.tags.some((t) => slugifyTag(t) === slug),
  );
}

/** Approximate reading time from MDX body (~200 wpm). */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Other posts sharing at least one tag, newest first (excludes `slug`). */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const tags = new Set(current.meta.tags.map(slugifyTag));
  if (tags.size === 0) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .filter((p) => p.meta.tags.some((t) => tags.has(slugifyTag(t))))
    .slice(0, limit);
}
