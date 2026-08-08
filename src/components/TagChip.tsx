import Link from "next/link";
import { slugifyTag } from "@/lib/posts";

/** Clickable dispatch tag → /blog/tag/<slug>/ */
export default function TagChip({
  tag,
  className = "",
}: {
  tag: string;
  className?: string;
}) {
  const slug = slugifyTag(tag);
  return (
    <Link
      href={`/blog/tag/${slug}/`}
      className={`rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.6rem] text-accent/70 transition-colors hover:border-accent/40 hover:text-accent ${className}`}
    >
      #{tag}
    </Link>
  );
}
