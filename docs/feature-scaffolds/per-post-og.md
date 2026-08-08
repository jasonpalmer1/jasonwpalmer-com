# Per-post OG images (scaffold)

**Status:** Stub only — metadata already reads `cover` from front-matter; generator not run yet.

## Already wired

- `PostMeta.cover` in `src/lib/posts.ts`
- `src/app/blog/[slug]/page.tsx` uses `cover` for Open Graph / Twitter / JSON-LD when set
- Falls back to `/og.png`

## To finish (Claude / local)

1. Run or extend `scripts/gen-post-og.mjs` (stub) to emit `public/og/<slug>.png`
2. Add to each post front-matter: `cover: "/og/<slug>.png"`
3. Document in `_TEMPLATE.build-log.mdx`
4. Optionally add `npm run gen:og` to `package.json`

No secrets required. Prefer the existing brand colors (`#05060a`, `#34f5c5`, Orbitron-ish monospace title).
