# Per-post OG images

**Status:** SVG generator live — `npm run gen:og -- --write` → `public/og/<slug>.svg`.

## Already wired

- `PostMeta.cover` in `src/lib/posts.ts`
- Blog post metadata/JSON-LD uses `cover` when set; else `/og.png`

## Activate on a post

```bash
npm run gen:og -- --write
# then in front-matter:
# cover: "/og/build-log-001.svg"
```

PNG via sharp/`@vercel/og` is optional later if a crawler rejects SVG.
