# Tag-filtered dispatch archive

**Status:** Live scaffold — routes + chips wired. Claude can restyle or add counts.

## What shipped

- `getAllTags()` / `getPostsByTag()` / `slugifyTag()` in `src/lib/posts.ts`
- Static pages: `src/app/blog/tag/[tag]/page.tsx` (`generateStaticParams`)
- `TagChip` links from blog index, post header, and tag pages
- Sitemap includes `/blog/tag/<tag>/`

## Finish / polish (optional)

- Add per-tag counts in the blog index chip row
- RSS per tag (`/rss/tag/<tag>.xml`) if subscribers want topic feeds
- Redirect unknown tags already handled via `dynamicParams = false` + `notFound()`
