import type { ReactNode } from "react";

/** Shared slugify for MDX heading ids + TOC (must stay in sync). */
export function slugifyHeading(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Pull ## / ### headings from raw MDX for a table of contents. */
export function extractToc(content: string): TocItem[] {
  const nextId = createHeadingIdAllocator();
  const items: TocItem[] = [];
  for (const line of content.split("\n")) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].replace(/[*_`~\[\]]/g, "").trim();
    if (!text) continue;
    items.push({ id: nextId(text), text, level });
  }
  return items;
}

/** Flatten React children to plain text for heading id generation. */
export function childrenToText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (typeof children === "object" && "props" in children) {
    const el = children as { props?: { children?: ReactNode } };
    return childrenToText(el.props?.children);
  }
  return "";
}

/** Allocate unique heading ids in document order (shared by TOC + MDX render). */
export function createHeadingIdAllocator() {
  const seen = new Map<string, number>();
  return (text: string) => {
    let id = slugifyHeading(text);
    const n = (seen.get(id) ?? 0) + 1;
    seen.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    return id;
  };
}
