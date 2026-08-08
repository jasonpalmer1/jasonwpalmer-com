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
- [ ] Decide fate of private `_build` consulting page (ship or delete `ConsultingForm` + `_build`)

## P3 — private apps (separate sessions; not in cloud agent scope)

- [ ] Sous (other chat)
- [ ] Command Center / 4-Horn / wafergraph app / Who’s Starting / Our Place / visit-log / canaifeel
- [ ] Mirror any shared patterns (CSP, rate limits, edit tokens) learned here

## Ideas worth scaffolding later (not started)

- Per-post OG images for blog
- Dispatch archive index filtered by tag
- “Last shipped” auto line on homepage from newest MDX date
- Shared `visit-log` allowlist helper across sites’ `_headers`
