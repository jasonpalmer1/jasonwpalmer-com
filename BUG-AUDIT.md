# Portfolio bug audit — handoff for Claude Code

**Status:** COMPLETE (documentation only — no code fixes in this pass)  
**Auditor run:** Cursor cloud agent named “Mistral AI code review”  
**Agent URL:** https://cursor.com/agents/bc-019fe37e-4f87-7e91-8d87-7c53ad270f3d  
**Date:** 2026-08-08  
**Branch:** `cursor/bug-audit-documentation-0f3d`  
**Scope:** Real bugs / security / correctness. Not style nits.

> **Prior Mistral work:** None. This agent run *is* the “Mistral AI code review” chat.
> When it started, the repo had no audit artifacts, no prior findings file, and no
> commits from a previous Mistral pass. Sous is explicitly out of scope here
> (separate chat).

---

## How Claude should use this

1. Read this file first for portfolio priority.
2. Fix **worldcup-bracket** HIGH items before anything else (pool integrity).
3. Fix **jasonwpalmer-com** HIGH items next (subscribe abuse + CSP).
4. Work other public-repo findings by severity.
5. Private / local-only codebases were **not** accessible from this environment — list at bottom; open separate agent sessions with those repos checked out.

Companion detail for other public repos (same audit):  
→ [`docs/bug-audits/OTHER-PUBLIC-REPOS.md`](./docs/bug-audits/OTHER-PUBLIC-REPOS.md)

---

## Inventory — what was / was not audited

| Codebase | Access | Audited? | Notes |
|---|---|---|---|
| **jasonwpalmer-com** (this repo) | ✅ workspace @ `3fe4e48` | ✅ Yes | Findings below |
| **worldcup-bracket** | ✅ public clone @ `0545028` | ✅ Yes | **Highest severity** — see companion doc |
| **wafergraph-mcp** | ✅ public clone @ `fbfd8ad` | ✅ Yes | Companion doc |
| **react-canvas-force-graph** | ✅ public clone @ `003ae74` | ✅ Yes | Companion doc |
| **go-no-go** | ✅ public clone @ `092d912` | ✅ Yes | Companion doc |
| **claude-code-setup** | ✅ public clone @ `6584bf2` | ✅ Yes | No material bugs |
| awesome-mcp-servers / -1, jasonpalmer1 profile | public forks/README | ⏭ Skipped | Not product code |
| **Sous** | private / other chat | ❌ Out of scope | User said separate chat owns this |
| Command Center, 4-Horn, wafergraph.com app, Who’s Starting, Our Place, canaifeel, visit-log worker, classified fantasy tracker | private or not on `jasonpalmer1` public GH | ❌ Not accessible | Need local checkout or private-repo agent |

`gh` listed **zero private repos** for this token — only the public set above is visible here.

---

## Priority fix order (whole portfolio)

| Pri | Repo | Item | Severity |
|---|---|---|---|
| 1 | worldcup-bracket | Unauthenticated `PUT /api/brackets/:id` + name-as-ownership | **HIGH** |
| 2 | worldcup-bracket | Open POST spam + no pick validation + CORS `*` | **HIGH** |
| 3 | jasonwpalmer-com | Subscribe API: no rate limit / confirm-email bombing | **HIGH** |
| 4 | jasonwpalmer-com | CSP blocks visit-log + CF beacon; still allowlists Beehiiv | **HIGH** |
| 5 | worldcup-bracket | Scoring/auth docs wrong vs code | MEDIUM |
| 6 | jasonwpalmer-com | Confirm/unsub GET-prefetch + token not rotated | MEDIUM |
| 7 | wafergraph-mcp | `compare_companies` missing “unique” counterparties | MEDIUM |
| 8 | go-no-go | Parallel stress null-verdict bug | MEDIUM |
| 9 | react-canvas-force-graph | Stale `onNodePick` closure | MEDIUM |

---

## jasonwpalmer-com findings

**Stack:** Next.js 16 static export → Cloudflare Pages; Pages Functions + D1 mailing list; Resend; Web3Forms contact.  
**SHA audited:** `3fe4e48` on `main` (docs branch cut from here).

### HIGH

#### H1 — Subscribe endpoint has no abuse controls
- **Where:** `functions/api/subscribe.js` (POST handler ~L82–178); UI `src/components/Subscribe.tsx`
- **What:** Anyone can POST emails. For pending/unsubscribed rows, each call **rotates the token and re-sends** a Resend confirmation. Enables inbox bombing, Resend spend/reputation burn, D1 spam. No honeypot/Turnstile on subscribe (contact forms have `botcheck`).
- **Fix:** Cloudflare rate limit (per IP) + per-email confirm cooldown (e.g. 1 send / 15–60 min). Add Turnstile or honeypot verified server-side before calling Resend.

#### H2 — CSP out of sync with live third parties
- **Where:** `public/_headers` L6–7; scripts loaded in `src/app/layout.tsx` L124–133
- **What:** `script-src` still allowlists Beehiiv, but **does not** allow:
  - `https://visit-log.jwpalm99.workers.dev` (always loaded)
  - `https://static.cloudflareinsights.com` (when beacon token set)
  So visit-log / CF analytics scripts are **blocked** by CSP on static pages. Dead Beehiiv origins remain in `script-src` / `connect-src`.
- **Fix:** Remove Beehiiv. Add visit-log + cloudflareinsights to `script-src`. Keep `connect-src` covering their beacons.

### MEDIUM

| ID | Where | Issue | Fix |
|---|---|---|---|
| M1 | `subscribe.js` L122–124 | Confirmed emails return different copy → email enumeration | Always same success message |
| M2 | `confirm.js` / `unsubscribe.js` | GET + long-lived tokens; prefetch can auto-confirm/unsub; token not rotated after confirm | POST + interstitial; rotate/clear confirm token; separate unsub token; expire pending |
| M3 | `subscribe.js` L151–170 | Resend non-OK responses swallowed; client still `ok: true`; response text leaks whether `RESEND_API_KEY` is set | Check `res.ok`; unify client messages |
| M4 | `ContactForm.tsx` / `ConsultingForm.tsx` L8 | Web3Forms key hardcoded; `.env.example` silent; CLAUDE.md wrong about env key | Document; enable Web3Forms domain lock; optional env for rotation |
| M5 | `blog/[slug]/page.tsx` + MDX | No rehype-sanitize; `javascript:` hrefs possible in MDX | Fine for solo author; treat MDX as code; optionally sanitize |
| M6 | `scripts/send-dispatch.mjs` | Missing `List-Unsubscribe` / `List-Unsubscribe-Post` headers | Add RFC 8058 headers |
| M7 | Function HTML responses | Likely miss `public/_headers` CSP/HSTS; `SITE_URL` interpolated unescaped | Set headers on Function responses; escape |

### LOW

| ID | Where | Issue |
|---|---|---|
| L1 | `rss.xml/route.ts` | CDATA `]]>` / unescaped `<category>` can break RSS |
| L2 | `lib/posts.ts` | Frontmatter cast with no validation — missing `tags`/`date` can crash |
| L3 | `lib/posts.ts` `getPostBySlug` | No slug allowlist (mitigated by `dynamicParams = false`) |
| L4 | `migrations/0001_subscribers.sql` | No `UNIQUE(token)` / status CHECK |
| L5 | `Subscribe.tsx` | No honeypot (unlike contact forms) |
| L6 | `subscribe.js` INSERT | Concurrent first-subscribe can UNIQUE-fail → 500 |
| L7 | JSON-LD `dangerouslySetInnerHTML` | Should escape `<` → `\u003c` |

### INFO

- `_build/page.tsx` + `/build` → 301 home: Consulting “Work With Me” page not publicly routed; `ConsultingForm` effectively dead.
- README still mentions client-assembled email; site uses Web3Forms.
- Birthdate in `profile.ts` is intentional for age gamification.

### npm audit (transitive, 2026-08-08)

7 advisories (0 critical, 6 high, 1 moderate) in deps: `next`, `postcss`, `sharp`, `nanoid`, `js-yaml`, `brace-expansion`, `@tailwindcss/postcss`. None look like direct app-logic bugs; re-run `npm audit` / bump Next when fixing.

### Positive practices (keep these)

- Parameterized D1 everywhere; double opt-in; UUID tokens; Resend key not client-exposed.
- Contact honeypot; no `mailto:` on page.
- Static export + `dynamicParams = false`.
- Baseline headers: HSTS, frame deny, nosniff.
- Dispatch HTML uses `escHtml` for title/summary.

---

## Documentation drift in this repo (fix when convenient)

| CLAUDE.md / docs claim | Reality |
|---|---|
| Only one blog post (`build-log-001`) | **3 posts** incl. `build-log-002`, `valley-of-death-financing` |
| `Subscribe` is Beehiiv | Native `/api/subscribe` → D1 |
| `src/data/newsletter.ts` exists | **Deleted / missing** |
| Contact key “see `.env.example`” | Key hardcoded in form components |
| Component/data file map incomplete | Missing Platforms, Gallery, FloatingActions, SubscribeBlock, ConsultingForm, `platforms.ts` |
| `_headers` Beehiiv allowlist | Stale after Beehiiv removal |

---

## What this PR does / does not do

**Does:** Commit this audit + companion doc; point `CLAUDE.md` at it; lightly refresh stale CLAUDE.md inventory so Claude isn’t misled.

**Does not:** Implement the security fixes (left for Claude / follow-up PRs per repo). Does not touch Sous.

---

## Suggested Claude follow-ups (copy-paste tasks)

```
Task A — worldcup-bracket (CRITICAL path)
  1. Add per-bracket edit token on POST; require it on PUT
  2. Stop treating display name as ownership in the client
  3. Validate picks shape/size/teams; rate-limit POST
  4. Align README + CLAUDE.md scoring + auth model with code

Task B — jasonwpalmer-com
  1. Rate-limit + confirm cooldown on /api/subscribe; Turnstile/honeypot
  2. Fix CSP in public/_headers (drop Beehiiv; allow visit-log + CF insights)
  3. Uniform subscribe responses; check Resend res.ok
  4. Token rotation on confirm; consider POST confirm/unsub

Task C — remaining public repos
  See docs/bug-audits/OTHER-PUBLIC-REPOS.md

Task D — private codebases (need checkout)
  Sous (other chat), Command Center, 4-Horn, wafergraph app,
  Who’s Starting, Our Place, canaifeel, visit-log, classified fantasy
```
