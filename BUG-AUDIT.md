# Portfolio bug audit — handoff for Claude Code

**Status:** Fixes implemented for jasonwpalmer-com in this PR; other-repo fixes ready to apply (push blocked from this agent)  
**Auditor/fixer run:** Cursor cloud agent “Mistral AI code review”  
**Agent URL:** https://cursor.com/agents/bc-019fe37e-4f87-7e91-8d87-7c53ad270f3d  
**Date:** 2026-08-08  
**Branch:** `cursor/bug-audit-documentation-0f3d`  
**Scope:** Real bugs / security / correctness.

> **Prior Mistral work:** None at start. This run audited, then implemented what it could.
> **Sous:** out of scope (separate chat).
> **Push limit:** `cursor[bot]` can push **only** `jasonwpalmer-com`. Other repos → see [`docs/bug-audits/APPLY.md`](./docs/bug-audits/APPLY.md).

---

## How Claude should use this

1. Merge/deploy **this** PR (jasonwpalmer-com fixes are live code, not docs-only anymore).
2. Apply other-repo bundles via [`docs/bug-audits/APPLY.md`](./docs/bug-audits/APPLY.md) — **worldcup-bracket first**.
3. Private apps still need separate checkouts (not visible to this token).

Companion audit detail: [`docs/bug-audits/OTHER-PUBLIC-REPOS.md`](./docs/bug-audits/OTHER-PUBLIC-REPOS.md)

---

## Status board

| Codebase | Audited | Fixed here? | Notes |
|---|---|---|---|
| **jasonwpalmer-com** | ✅ | ✅ **shipped in this branch** | CSP, subscribe abuse, confirm/unsub interstitial, token rotate, List-Unsubscribe, honeypot |
| **worldcup-bracket** | ✅ | ✅ code ready, **push 403** | Bundle + patch in `docs/bug-audits/` — **migrate 002 then deploy** |
| **wafergraph-mcp** | ✅ | ✅ code ready, **push 403** | unique counterparties + upstream guard + version/docs |
| **go-no-go** | ✅ | ✅ code ready, **push 403** | parallel null filter + incomplete-lens fail |
| **react-canvas-force-graph** | ✅ | ✅ code ready, **push 403** | onNodePick ref + hexA |
| **claude-code-setup** | ✅ | n/a | No material bugs |
| **Sous** + private apps | ❌ | — | Need local/private agent sessions |

---

## jasonwpalmer-com — what changed in this branch

| Was | Now |
|---|---|
| H1 Subscribe abuse (no rate limit / re-send) | Per-IP Cache API limit, 15m per-email confirm cooldown, honeypot `botcheck`, uniform success copy |
| H2 CSP Beehiiv / blocked visit-log + CF | `public/_headers` allowlists visit-log + cloudflareinsights; Beehiiv removed |
| M1 Email enumeration | Same success message always |
| M2 GET prefetch confirm/unsub | GET = interstitial; POST mutates; confirm only `pending`; token rotated on confirm |
| M3 Resend failures | `res.ok` checked (still non-fatal for row write) |
| M6 List-Unsubscribe | Headers added in `send-dispatch.mjs` |
| M7 Function HTML headers | CSP/nosniff/frame on confirm + unsubscribe pages |
| L7 JSON-LD `<` breakout | Escaped `\u003c` in `layout.tsx` |

**Still open / optional on this site:** Turnstile (stronger than honeypot), MDX sanitize for untrusted authors, RSS CDATA hardening, `UNIQUE(token)` migration, Web3Forms domain-lock (dashboard action — documented in `.env.example`).

---

## Priority remaining for Claude

| Pri | Action |
|---|---|
| 1 | Apply + migrate + deploy **worldcup-bracket** (`APPLY.md`) |
| 2 | Deploy **jasonwpalmer-com** (this PR) so Functions + CSP ship |
| 3 | Apply wafergraph-mcp / go-no-go / force-graph bundles |
| 4 | Private codebase audits (Sous chat; others need checkout) |
| 5 | Optional: CF WAF rate rule on `/api/subscribe` as belt-and-suspenders |

---

## Suggested Claude follow-ups

```
Task A — worldcup-bracket (do first)
  Follow docs/bug-audits/APPLY.md
  npm run db:migrate:remote && npm run deploy
  Warn pool players: edit tokens rotated for pre-existing rows

Task B — jasonwpalmer-com
  Merge this PR and deploy Pages (secrets already set)
  Confirm Web3Forms domain lock in dashboard

Task C — other public repos
  Apply remaining ready-to-apply bundles / patches

Task D — private codebases
  Sous (other chat), Command Center, 4-Horn, wafergraph app,
  Who’s Starting, Our Place, canaifeel, visit-log, classified fantasy
```
