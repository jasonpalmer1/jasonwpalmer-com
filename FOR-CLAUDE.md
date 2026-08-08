# FOR CLAUDE — start here (local machine)

You are picking up work that a **Cursor cloud agent** started. That agent could only push to GitHub for `jasonwpalmer-com`. **Jason deploys from this computer** (`~/projects/…` + wrangler / `/ship`), not from the cloud agent. Your job is to land the code in the right local trees and deploy.

## Read order (5 minutes)

1. **This file** — workflow + priorities  
2. [`BUG-AUDIT.md`](./BUG-AUDIT.md) — what was found/fixed + status board  
3. [`docs/bug-audits/APPLY.md`](./docs/bug-audits/APPLY.md) — copy bundles into sibling repos  
4. [`docs/feature-scaffolds/README.md`](./docs/feature-scaffolds/README.md) — optional new work already stubbed  
5. `CLAUDE.md` — site map / conventions (`~/projects/CONVENTIONS.md`, prefer `/ship`)

## Critical model

| Where | What it means for you |
|---|---|
| GitHub PR [`jasonwpalmer-com#1`](https://github.com/jasonpalmer1/jasonwpalmer-com/pull/1) | Cloud agent’s branch. **Merge or cherry-pick into local `~/projects/jasonwpalmer-com`**, then deploy with `/ship` or wrangler. |
| `docs/bug-audits/ready-to-apply/<repo>/` | **Source of truth for sibling fixes** the cloud agent could not push. Copy into `~/projects/<repo>`, commit, deploy from here. |
| Sous + private apps | Not in this cloud session. Separate chats / local checkouts. |
| Cloud agent deploy | **Do not expect cloud to have shipped prod.** Always deploy from Jason’s machine. |

## Do this first (ordered)

```bash
# 0) Site — get cloud fixes onto the machine that deploys
cd ~/projects/jasonwpalmer-com
git fetch origin
git checkout main
# Prefer: merge the PR branch, or pull main after Jason merges on GitHub
git merge origin/cursor/bug-audit-documentation-0f3d   # if not yet merged
# or: gh pr checkout 1 && /ship --prod after preview

npm run check   # lint + check:assets + build
npx wrangler d1 execute dispatch-subscribers --remote --file=migrations/0002_token_unique.sql
# Deploy site (Functions + CSP + mailing-list hardening):
# /ship --prod   OR   npx wrangler pages deploy

# 1) Worldcup — HIGH: open PUT was a real integrity hole
bash ~/projects/jasonwpalmer-com/scripts/apply-audit-bundles.sh worldcup-bracket
cd ~/projects/worldcup-bracket
npm run db:migrate:remote
npm run deploy
# Warn pool: old rows got random edit tokens — "Start new bracket" or admin delete

# 2) Other public bundles (same script)
bash ~/projects/jasonwpalmer-com/scripts/apply-audit-bundles.sh wafergraph-mcp
bash ~/projects/jasonwpalmer-com/scripts/apply-audit-bundles.sh go-no-go
bash ~/projects/jasonwpalmer-com/scripts/apply-audit-bundles.sh react-canvas-force-graph
# Deploy each per that repo's CLAUDE.md / npm run deploy
```

## Dashboard ops (not code — Jason or you with browser)

- Web3Forms: lock access key to `jasonwpalmer.com`
- Optional: Cloudflare WAF rate limit on `/api/subscribe`
- Optional Turnstile: see `docs/feature-scaffolds/turnstile-subscribe.md` (code path is stubbed; needs keys)

## After deploy — keep notes fresh

Update `CLAUDE.md` → **Current focus** when you finish a priority.  
Strike items in `BUG-AUDIT.md` status board.  
Never commit `CLAUDE.local.md`.

## Scaffolded / ready for you to finish

| Scaffold | Path | Status |
|---|---|---|
| Apply sibling audit bundles | `scripts/apply-audit-bundles.sh` | Ready to run locally |
| Build-log MDX template | `src/content/posts/_TEMPLATE.build-log.mdx` | Copy → rename → fill |
| Turnstile on subscribe | `docs/feature-scaffolds/turnstile-subscribe.md` + code hooks | Inactive until env keys set |
| Portfolio work queue | `docs/feature-scaffolds/PORTFOLIO-QUEUE.md` | Prioritized backlog for future Claude sessions |

## Also removed / changed after the first audit pass

- Deleted dead `_build` consulting page + `ConsultingForm` (restore from git if Jason wants it back)
- BootSequence is **homepage-only** (`page.tsx`); pass `buildCount` only — never import `tools[]` into it
- Shared `SiteFooter` on home + blog; skip link → `#main`
- Galleries default to `loading="lazy"`; send-dispatch skips `_` posts + sends `List-Id`
- X/`@gototownhq` is in `socials` + Twitter meta `site`/`creator`

## Quality gate before deploy (this site)

```bash
cd ~/projects/jasonwpalmer-com
npm run check   # lint + check:assets + build
# then /ship (preview) → /ship --prod with confirmation
```

## Don’t

- Don’t assume GitHub merge = live site  
- Don’t deploy worldcup without `db:migrate:remote` (edit_token column)  
- Don’t put trading infra / broker keys on this public site  
- Don’t expand Sous work here (separate chat)
- Don’t re-import `tools[]` into BootSequence — pass `buildCount` only
