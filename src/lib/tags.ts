/** Client-safe tag slug helpers (no fs — safe to import from client components). */

const TAG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
