# Per-tag RSS feeds

**Status:** Live.

- Shared builder: `src/lib/rss.ts`
- Site feed: `/rss.xml`
- Tag feeds: `/rss/tag/<tag>/` via `src/app/rss/tag/[tag]/route.ts`
- Tag archive UI links to its RSS; `_headers` sets feed Content-Type
