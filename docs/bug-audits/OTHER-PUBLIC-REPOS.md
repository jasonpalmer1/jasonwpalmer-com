# Public GitHub Repo Audit — Handoff for Claude Code

**Auditor:** Cursor cloud agent  
**Date:** 2026-08-08  
**Scope:** Real bugs / security / correctness only (no style nits)  
**Repos audited (cloned):** `wafergraph-mcp`, `worldcup-bracket`, `claude-code-setup`, `react-canvas-force-graph`, `go-no-go`  
**Forks:** `awesome-mcp-servers`, `jasonpalmer1` profile — **not cloned here; skipped**

---

> **Parent index:** [`BUG-AUDIT.md`](../../BUG-AUDIT.md) (portfolio status + jasonwpalmer-com findings).
> **Sous:** out of scope — separate chat.


## 1. wafergraph-mcp

**URL:** https://github.com/jasonpalmer1/wafergraph-mcp  
**Stack:** Cloudflare Worker + Durable Object (`agents` `McpAgent`), TypeScript, Zod, Streamable HTTP MCP at `/mcp`, KV usage telemetry, live-fetches `wafergraph.com/data/{companies,deals}.json` + vendored taxonomy snapshot.  
**Agent docs:** Has `CLAUDE.md` (good).  
**Entry points:** `src/index.ts` (routes), `src/mcp-agent.ts` (tools 1–9), `src/tools/*` (tools 10–30), `scripts/smoke.mjs`.

### Findings

| Severity | Location | Description | Suggested fix |
|---|---|---|---|
| **MEDIUM** | `src/mcp-agent.ts:325–391` (`compare_companies`) | Tool description and README claim **shared and unique** supply-chain counterparties. Implementation only returns `shared_suppliers` / `shared_customers` — unique sets are never computed. Agents relying on uniqueness get incomplete answers. | Compute per-company unique suppliers/customers (in set A not in others) and add to payload, **or** drop “unique” from description/README. |
| **MEDIUM** | All tool handlers + `src/data.ts:57–71` | Upstream fetch failures / non-JSON content-type **throw**. Tool handlers have no try/catch; a cold-cache upstream outage surfaces as an unhandled MCP error instead of a structured `errorResult`. | Wrap `getCompanies`/`getDeals` calls (or `fetchJSON`) and return `errorResult("upstream data temporarily unavailable", { detail })`. |
| **MEDIUM** | Public `/mcp` (intentional) | **No auth, no rate limiting.** Expensive tools (`find_paths_between` DFS budget 20k, `simulate_disruption`, `find_single_source_dependencies`) are free DoS amplifiers on Workers Free plan / KV write volume. Documented as public/read-only; still a real availability risk. | Cloudflare WAF / rate-limit rules per IP or session; optionally soft-cap concurrent DO sessions; keep exploration budgets (already present on path search). |
| **LOW** | `src/mcp-agent.ts:52` vs `package.json` / `server.json` | MCP server advertises `version: "1.2.0"` while package/`server.json` are `1.2.1`. | Bump `McpServer` version to match release. |
| **LOW** | `README.md:34` vs `src/tools/screen.ts:438` | README documents `resolve_ticker({inputs})`; actual schema field is `queries`. Misleads agents/docs consumers. | Align README (and any registry copy) to `queries`. |
| **LOW** | `CLAUDE.md:23` | File map still says `toAllowedCompany()` **drops** `key_products`; code includes it (re-enabled 2026-07-19). Stale agent guidance. | Update CLAUDE.md file-map line. |
| **INFO** | `src/landing.ts` + `src/index.ts:16–18` | Landing page embeds `url.origin` into install snippets. Host is Cloudflare-controlled in normal deploy; low risk of Host-header phishing via install URL display. | Optional allowlist of known origins (`mcp.wafergraph.com`) before rendering. |
| **INFO** | `src/usage.ts` | Non-atomic KV increment (documented). Acceptable at current volume. | None required unless volume grows. |
| **INFO** | Design | No auth is intentional (public dataset). CORS permissive via `McpAgent.serve()`. Telemetry sanitizes clientInfo for KV keys. Graph search has caps. Field whitelist is sound. | — |

### Out of scope / notes
- Content accuracy of wafergraph upstream JSON.
- Cost/pricing of Workers/KV at scale beyond DoS note.
- Smoke case `get_deal: { id: "amd_xilinx" }` may or may not match live deal ids (depends on upstream); not verified live in this audit.

**Verdict:** Solid, carefully written public MCP server. Highest-value fixes: complete `compare_companies` uniqueness (or docs), graceful upstream errors, optional rate limits.

---

## 2. worldcup-bracket

**URL:** https://github.com/jasonpalmer1/worldcup-bracket  
**Stack:** Single Cloudflare Worker (`src/index.js`) embedding full HTML/CSS/JS; D1 SQLite; shared admin passcode via Worker secrets. Live: `worldcup-bracket.jwpalm99.workers.dev`.  
**Agent docs:** Has `CLAUDE.md` (partially stale vs code).  
**Entry points:** `src/index.js` (API + embedded UI), `src/teams.js`, `migrations/001-init.sql`.

### Findings

| Severity | Location | Description | Suggested fix |
|---|---|---|---|
| **HIGH** | `src/index.js:113–131` | **`PUT /api/brackets/:id` has no auth and no ownership check.** Anyone (any origin) who knows an id can overwrite name + picks. Ids are public via unauthenticated `GET /api/brackets`. Integrity of the pool is trivially attackable. | Require a per-bracket edit token (returned on create, stored client-side) **or** require `x-pass` + match creator secret; reject updates that don’t present the token. |
| **HIGH** | `src/index.js:100–111` + `481–485` + CORS `*` | **Unauthenticated `POST /api/brackets`** (intentional “public pool”) + **`Access-Control-Allow-Origin: *`** + no rate/size limits → any website or bot can spam/insert brackets and (with PUT) vandalize. CLAUDE.md incorrectly claims POST “requires x-pass”. | Keep public submit if desired, but: (1) rate-limit by IP, (2) cap `name` length and `picks_json` size, (3) validate pick keys/values against allowed team set, (4) fix docs. Prefer edit-token model for PUT. |
| **HIGH** | Client `onNameChange` / `findMyBracket` (`631–640`, `531–535`) | **Name-as-ownership:** typing another player’s name loads their `id` and subsequent Save issues PUT over their row. Combined with open PUT, this is the primary UX attack path (no API knowledge needed). | Separate “claim code” / edit token from display name; never bind edit rights to display-name match alone. |
| **MEDIUM** | `README.md:8`, `CLAUDE.md:43` vs `src/index.js:376`, `437–448`, `680` | **Scoring docs wrong.** Docs: R32=1, R16=2, QF=4, SF=8, F=16, **champion bonus=32**. Code/UI: 20/40/80/160/320 and **no separate champion bonus** (Final correct pick is just `F_0` at 320). Leaderboard math ≠ README. | Update README + CLAUDE.md to match `ROUND_POINTS` (and clarify “Champion 320” = Final pick, not a bonus). |
| **MEDIUM** | `POST`/`PUT` bracket handlers | **No validation of `picks`:** arbitrary JSON shape/size accepted. Pollutes leaderboard; D1 storage abuse. | Whitelist keys `R32_0..F_0`; values must be known team names; reject oversized payloads. |
| **MEDIUM** | `POST /api/login` | **No rate limiting** on admin pass guessing. Shared passcode model makes online brute force meaningful. | CF rate limit / Turnstile / lockout after N failures; prefer longer high-entropy admin secret. |
| **MEDIUM** | Docs vs runtime auth model | README still describes friend passcode gate; client `init()` auto-sets `appRole='friend'` with **empty pass** and never gates the UI. `FRIEND_PASS` is effectively dead. CLAUDE API notes contradict code. | Rewrite README/CLAUDE to “public participate / admin unlock only”; remove or document dead `FRIEND_PASS`. |
| **LOW** | `PUT /api/brackets/:id` | Returns `{ ok: true }` even if `id` does not exist (0 rows updated). Client can believe a save worked. | Check D1 `meta.changes` / re-SELECT; return 404 if missing. |
| **LOW** | `localStorage` `wc_pass` | Admin pass persisted in cleartext localStorage (XSS would steal it). XSS surface is mitigated by `escHtml`/`jsq` on user content — keep that discipline. | Prefer sessionStorage or short-lived token; Content-Security-Policy. |
| **INFO** | SQL | Parameterized D1 binds — **no SQL injection**. | — |
| **INFO** | XSS | Display paths use `escHtml`; onclick args use `jsq`. Generally solid for stored name/pick display. | Keep validating picks server-side so malicious pick strings never reach onclick builders from cascade logic. |

### Out of scope / notes
- Tournament bracket topology vs real FIFA 2026 draw (default slot heuristic is a product choice).
- Prize / charity logistics.
- D1 `database_id` in `wrangler.toml` is expected public config, not a secret.

**Verdict:** Highest-priority repo for fixes. Pool integrity is currently **not enforceable** against a motivated stranger. Fix PUT auth/ownership first, then validation + docs/scoring alignment.

---

## 3. claude-code-setup

**URL:** https://github.com/jasonpalmer1/claude-code-setup  
**Stack:** Docs/templates + shell/Python hooks for Claude Code (not a deployed service).  
**Agent docs:** Has `CLAUDE.md` + `CLAUDE.md.template`.

### Findings

| Severity | Location | Description | Suggested fix |
|---|---|---|---|
| **LOW** | `hooks/session-end-log.sh:26` | Interpolates transcript path into `claude -p "..."` string. Paths with quotes/newlines could break or confuse the prompt (local hook; attacker needs filesystem control). | Pass path via argv/env; avoid embedding raw path in natural-language prompt, or shell-escape. |
| **INFO** | Hooks overall | `context-firewall.py` / `token-ledger.py` fail closed on parse errors; ledger write is atomic (`os.replace`). Good. | — |
| **INFO** | `routines/monday-cockpit.sh` | Contains placeholders `<REPORTS_DIR>` / `<PULSE_LOG_PATH>` — expected for a template; not a runtime bug until customized. | — |

### Out of scope
- Whether Claude Code hook JSON schema changes over time.
- Operational cost of SessionEnd auto-`/log`.

**Verdict:** No material security bugs in the shipped hooks/templates. Docs/setup repo; shallow review sufficient.

---

## 4. react-canvas-force-graph

**URL:** https://github.com/jasonpalmer1/react-canvas-force-graph  
**Stack:** Single React component (`ForceGraph.jsx`) + example; canvas 2D force layout; no build/publish package metadata beyond source.  
**Agent docs:** Has `CLAUDE.md`.

### Findings

| Severity | Location | Description | Suggested fix |
|---|---|---|---|
| **MEDIUM** | `ForceGraph.jsx:125–432` | `useEffect` omits `onNodePick` from the dependency array (eslint-disable). If parent passes a new callback, click handler keeps a **stale closure** until `sig`/other deps change. | Include `onNodePick` in deps, or store it in a ref updated each render and read from the ref in `onClick`. |
| **LOW** | `ForceGraph.jsx:457–465` (`hexA`) | Only correctly parses 6-digit `#rrggbb`. Short `#rgb` or 8-digit `#rrggbbaa` produce wrong colors (verified: `#5b8` → `rgba(0,5,184,1)`). Default color is fine. | Support 3/4/6/8 digit hex or document “6-digit only”. |
| **INFO** | Lifecycle | Cleanup cancels rAF, disconnects IO, removes listeners — solid. Empty `nodes` doesn’t divide-by-zero (map yields `[]`). Tooltip uses React text nodes (no HTML XSS). | — |

### Out of scope
- Visual/physics tuning, packaging as npm module.

**Verdict:** Mostly clean demo component. Fix stale `onNodePick` if consumers rely on identity-changing callbacks.

---

## 5. go-no-go

**URL:** https://github.com/jasonpalmer1/go-no-go  
**Stack:** Claude Code workflow script (`go-no-go.js`) — prompt/schema orchestration for multi-agent viability proofing. No server.  
**Agent docs:** **No `CLAUDE.md` / `AGENTS.md`.** Has `README.md` + `PROTOCOL.md`.

### Findings

| Severity | Location | Description | Suggested fix |
|---|---|---|---|
| **MEDIUM** | `go-no-go.js:305–311` | Parallel stress path: `.then(v => ({ finding: f, verdict: v }))` always returns a truthy object even when `agent()` returns `null`. `filter(Boolean)` does **not** drop failed verifications; synth may see `verdict: null`. Serial path only pushes when `v` is truthy — **behavior diverges**. | Filter with `verifs.filter(x => x && x.verdict)`; mirror serial path. |
| **LOW** | `go-no-go.js:316–325` | If some lenses return `null`, workflow continues and synthesizes on partial `cleanLensData` without failing or renormalizing weights. Composite can be misleading. | Fail closed if `cleanLensData.length !== lenses.length`, or recompute weights over survivors and flag incompleteness in digest. |
| **INFO** | Weights | Commercial and purpose lens weights each sum to 100 — correct. | — |
| **INFO** | `~` paths | Explicitly rejected — good sandbox note. | — |

### Out of scope
- Quality of LLM research / verdict accuracy.
- Claude Code `agent`/`parallel`/`phase` host APIs.

**Verdict:** Logic gap on parallel null verifications is the main real bug. Add agent docs (`CLAUDE.md`) when convenient.

---

## Priority order for Claude Code follow-up

1. **worldcup-bracket** — close unauthenticated PUT + ownership hole; validate picks; fix scoring/auth docs.  
2. **wafergraph-mcp** — implement or un-document unique counterparties; graceful upstream errors; consider rate limits; version/README nits.  
3. **go-no-go** — fix parallel verification null handling (+ optional incomplete-lens guard).  
4. **react-canvas-force-graph** — stale `onNodePick` closure.  
5. **claude-code-setup** — optional path-escaping hardening only.

---

## Agent-docs summary

| Repo | CLAUDE.md / agent docs |
|---|---|
| wafergraph-mcp | Yes (minor staleness on `key_products`) |
| worldcup-bracket | Yes (stale auth + scoring) |
| claude-code-setup | Yes |
| react-canvas-force-graph | Yes |
| go-no-go | **Missing** |
