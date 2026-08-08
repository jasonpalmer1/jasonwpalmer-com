# Feature scaffolds — for Claude

These are **intentional stubs / optional paths** laid down by the cloud audit agent so you can finish features without rediscovering design. Nothing here is required for the security deploy.

| Scaffold | Doc | Code touchpoints | Activate by |
|---|---|---|---|
| Turnstile on subscribe | [turnstile-subscribe.md](./turnstile-subscribe.md) | `Subscribe.tsx`, `functions/api/subscribe.js`, `.env.example` | Set Turnstile site + secret keys |
| Build-log post template | — | `src/content/posts/_TEMPLATE.build-log.mdx` | Copy → rename → fill → `npm run send-dispatch` |
| Last dispatch on homepage | — | `src/components/LastShipped.tsx` (in Hero) | Live — restyle/move as needed |
| Tag archive | [tag-archive.md](./tag-archive.md) | `blog/tag/[tag]`, `TagChip`, `posts.ts` | Live |
| Per-tag RSS | [tag-rss.md](./tag-rss.md) | `lib/rss.ts`, `rss/tag/[tag]/route.ts` | Live |
| Per-post OG images | [per-post-og.md](./per-post-og.md) | `scripts/gen-post-og.mjs` → `public/og/*.svg` | `npm run gen:og -- --write` + set `cover:` |
| visit-log CSP allowlist | [visit-log-csp.md](./visit-log-csp.md) | `scripts/print-visit-log-csp-snippet.mjs` | Paste into sibling `_headers` |
| Builds rarity filter | [builds-rarity-filter.md](./builds-rarity-filter.md) | `ToolsInventory.tsx` | Live |
| Portfolio backlog | [PORTFOLIO-QUEUE.md](./PORTFOLIO-QUEUE.md) | n/a | Pick next item when idle |

When you finish a scaffold, delete or rewrite its doc so the queue stays honest.
