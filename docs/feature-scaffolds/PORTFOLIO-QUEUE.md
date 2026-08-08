# Portfolio work queue — Claude backlog

Ordered for Jason’s local machine. Strike through when done; add dates.

## P0 — deploy cloud agent work (this week)

- [ ] Merge/checkout `jasonwpalmer-com` PR branch → `/ship` (or wrangler) **from this computer**
- [ ] `migrations/0002_token_unique.sql` on remote D1
- [ ] `apply-audit-bundles.sh worldcup-bracket` → migrate → `npm run deploy`
- [ ] Web3Forms domain lock in dashboard

## P1 — finish public sibling fixes

- [ ] wafergraph-mcp bundle + deploy
- [ ] go-no-go + react-canvas-force-graph commits
- [ ] Update each repo’s CLAUDE.md “current focus” after deploy

## P2 — site content / product

- [ ] New build-log from `_TEMPLATE.build-log.mdx` when something ships
- [ ] Activate Turnstile if subscribe spam appears (`docs/feature-scaffolds/turnstile-subscribe.md`)
- [ ] CF WAF rate rule on `/api/subscribe` (dashboard)
- [x] Deleted private `_build` consulting draft + `ConsultingForm` (2026-08-08) — restore from git if needed

## P3 — private apps (separate sessions; not in cloud agent scope)

- [ ] Sous (other chat)
- [ ] Command Center / 4-Horn / wafergraph app / Who’s Starting / Our Place / visit-log / canaifeel
- [ ] Mirror any shared patterns (CSP, rate limits, edit tokens) learned here

## Done by cloud agent after initial audit (no action unless reverting)

- BootSequence `buildCount` (no tools[] in client), lazy galleries + intrinsic sizes
- `npm run check:assets`, blog ItemList JSON-LD, meta/twitter alignment
- Deleted `_build` / ConsultingForm; X in socials; Konami form-field guard
- `LastShipped` homepage line from newest MDX date
- BootSequence homepage-only (blog/RSS inbound skips overlay)
- Skip link + shared `SiteFooter`; ContactForm access_key lock; Lore labels in HTML
- Static asset long-cache + RSS `lastBuildDate` / Content-Type; gallery `aria-current`
- Nav: client `Link` for dispatches + pinned SUBSCRIBE CTA; post OG/twitter parity
- Dispatch `List-Id` header in `send-dispatch.mjs`
- Subscribe: validate before rate limit; no confirm cooldown unless Resend succeeded; double-submit + Turnstile ready gate
- Post slug filter aligned across index/RSS/sitemap; Counter announces final value; BootSequence Tab trap
- `MAILING-LIST.md` matches GET interstitial + POST confirm/unsub

## Ideas worth scaffolding later (not started)

- Implement `gen-post-og.mjs` renderer (PNG output)
- Client-side blog filter without navigation (optional UX)

## Scaffolded this loop (cloud agent)

- [x] Tag archive routes + TagChip (`docs/feature-scaffolds/tag-archive.md`) — live
- [x] Per-post OG stub script + doc (`docs/feature-scaffolds/per-post-og.md`) — renderer TODO
- [x] confirm/unsub `noindex` + `Disallow: /api/` in robots.txt
- [x] ContactForm double-submit guard; Konami Tab trap + scroll lock
- [x] Prev/next dispatch nav; footer + blog RSS link
- [x] Unsubscribe unknown-token 404; send-dispatch dry-run / exit / `_` slug guards
- [x] Branded `not-found.tsx`; Tools status pulse only for live/active
- [x] Platforms grid cols from `stats.length`; reading time + related posts
- [x] CopyButton (callsign + post URL); BlogPosting `timeRequired`; print CSS
- [x] TagChip `aria-current` + tag-page ALL clear; Stats cols from length; progressbar roles
- [x] Per-tag RSS (`/rss/tag/<tag>/`) + shared `lib/rss.ts`
- [x] visit-log CSP snippet doc/script; optional front-matter `builds:` → homepage anchors
- [x] Confirm GET validates pending token; success page shows unsub link
- [x] `npm run check`; `start` serves `out/`; `error.tsx` + `manifest.ts`; SubscribeBlock RSS
- [x] `global-error.tsx`; Person JSON-LD image; MDX heading ids + TOC; FloatingActions focus/inert
