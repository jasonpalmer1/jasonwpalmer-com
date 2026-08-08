# Portfolio bug audit — handoff for Claude Code

**Status:** Site fixes + local-first Claude handoff ready. Sibling-repo fixes are **bundles** — deploy from Jason’s machine.  
**Auditor/fixer:** Cursor cloud agent “Mistral AI code review”  
**Agent URL:** https://cursor.com/agents/bc-019fe37e-4f87-7e91-8d87-7c53ad270f3d  
**Date:** 2026-08-08  
**Branch:** `cursor/bug-audit-documentation-0f3d`

> **START HERE:** [`FOR-CLAUDE.md`](./FOR-CLAUDE.md) — local deploy model, ordered tasks, scaffolds.  
> **Sous:** out of scope (separate chat).  
> **Cloud cannot deploy your sites.** Copy/merge locally → `/ship` or wrangler from `~/projects/…`.

---

## How Claude should use this

1. Read **`FOR-CLAUDE.md`** (local-first workflow).  
2. Merge this branch into local `~/projects/jasonwpalmer-com` and **deploy from that machine**.  
3. Run `bash scripts/apply-audit-bundles.sh worldcup-bracket` (then migrate + deploy).  
4. Walk [`docs/feature-scaffolds/PORTFOLIO-QUEUE.md`](./docs/feature-scaffolds/PORTFOLIO-QUEUE.md).

Companion: [`docs/bug-audits/OTHER-PUBLIC-REPOS.md`](./docs/bug-audits/OTHER-PUBLIC-REPOS.md) · apply: [`docs/bug-audits/APPLY.md`](./docs/bug-audits/APPLY.md)

---

## Status board

| Codebase | Audited | Fixed? | Claude action |
|---|---|---|---|
| **jasonwpalmer-com** | ✅ | ✅ in this branch | Merge locally → lint/build → D1 `0002` → `/ship` |
| **worldcup-bracket** | ✅ | ✅ bundle only | `apply-audit-bundles.sh` → migrate → `npm run deploy` |
| **wafergraph-mcp** | ✅ | ✅ bundle only | apply script → typecheck → deploy |
| **go-no-go** | ✅ | ✅ bundle only | apply script → commit |
| **react-canvas-force-graph** | ✅ | ✅ bundle only | apply script → commit |
| **claude-code-setup** | ✅ | n/a | — |
| **Sous** + private apps | ❌ | — | Separate local sessions |

---

## jasonwpalmer-com — what this branch changed

Security: subscribe rate limit/cooldown/honeypot, optional Turnstile hooks (off until keys set), confirm/unsub interstitial + token rotate, CSP (visit-log, CF insights, Turnstile origins), List-Unsubscribe, JSON-LD escape, MDX `javascript:` reject.

UX/perf/org: portrait galleries, boot a11y, in-view counters, posts/RSS hardening, Hero/Skills RSC islands, legendary-only featured span, content number sync, lint green.

Scaffolding for Claude: `FOR-CLAUDE.md`, `scripts/apply-audit-bundles.sh`, build-log `_TEMPLATE`, Turnstile feature doc, `PORTFOLIO-QUEUE.md`.

**Still optional:** Activate Turnstile keys; CF WAF on `/api/subscribe`; Web3Forms domain lock (dashboard).

---

## Priority remaining for Claude (local)

| Pri | Action |
|---|---|
| 1 | Local merge + deploy **jasonwpalmer-com** |
| 2 | Apply + migrate + deploy **worldcup-bracket** |
| 3 | Other bundles via `apply-audit-bundles.sh` |
| 4 | Private app audits in their own checkouts |
| 5 | Pick from `docs/feature-scaffolds/PORTFOLIO-QUEUE.md` |
