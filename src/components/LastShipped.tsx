import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

/**
 * One-line "last dispatch" pointer for the homepage.
 * CLAUDE: safe to move/restyle; data comes from newest MDX post at build time.
 */
export default function LastShipped() {
  const newest = getAllPosts()[0];
  if (!newest) return null;

  return (
    <p className="mt-6 font-mono text-xs tracking-wide text-muted">
      <span className="text-accent/80">LAST DISPATCH</span>
      {" · "}
      <time dateTime={newest.meta.date}>{newest.meta.date}</time>
      {" · "}
      <Link
        href={`/blog/${newest.slug}/`}
        className="text-foreground/80 underline-offset-2 transition-colors hover:text-accent hover:underline"
      >
        {newest.meta.title}
      </Link>
    </p>
  );
}
