import Link from "next/link";
import { slugifyTag } from "@/lib/tags";

/** Clickable dispatch tag → /blog/tag/<slug>/ */
export default function TagChip({
  tag,
  active = false,
  className = "",
}: {
  tag: string;
  /** Highlight when this chip matches the current tag archive. */
  active?: boolean;
  className?: string;
}) {
  const slug = slugifyTag(tag);
  return (
    <Link
      href={`/blog/tag/${slug}/`}
      aria-current={active ? "page" : undefined}
      className={`rounded border px-1.5 py-0.5 font-mono text-[0.6rem] transition-colors ${
        active
          ? "border-accent/50 bg-accent/15 text-accent"
          : "border-border bg-surface text-accent/70 hover:border-accent/40 hover:text-accent"
      } ${className}`}
    >
      #{tag}
    </Link>
  );
}
