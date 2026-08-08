# worldcup-bracket

World Cup 2026 bracket prediction pool — Cloudflare Worker + D1 SQLite.

## Stack
- **Runtime**: Cloudflare Worker (single `src/index.js`)
- **DB**: D1 SQLite, bound as `env.DB`
- **Frontend**: Embedded HTML/JS/CSS as template literal in Worker — NO build step
- **Auth**: Public participate. Per-bracket `edit_token` required on PUT. Admin via `env.ADMIN_PASS` (`x-pass` / login). `FRIEND_PASS` is legacy/unused.
- **Deploy**: `wrangler deploy`

## File map
```
src/
  index.js      — Worker: all API routes + full embedded HTML app
  teams.js      — 48 team objects {name, flag, group} for 12 groups A-L
migrations/
  001-init.sql      — config + brackets tables
  002-edit-token.sql — add/backfill edit_token (required before deploy of ownership fix)
wrangler.toml
package.json
```

## Key design decisions
- All frontend JS uses `var` + regular strings only (no template literals inside <script>)
- `${...}` expressions in HTML/CSS in the template literal are escaped as `\${...}`
- Backticks inside the template literal are escaped as `` \` ``
- teams.js TEAMS array is JSON.stringify-embedded directly into the HTML at module load
- Picks are validated server-side (whitelist keys + known team names)
- GET /api/brackets never returns `edit_token`

## API endpoints (all under /api/)
- POST /api/login — { pass } → { ok, role } (admin only in practice)
- GET  /api/config — { setup, results, locked }
- PUT  /api/config/setup — [admin] { slots: [...32] }
- PUT  /api/config/lock  — [admin] { locked: bool }
- PUT  /api/config/results — [admin] { results: {...} }
- GET  /api/brackets — { brackets: [...] } (no tokens)
- POST /api/brackets — { name, picks } → { ok, id, editToken }
- PUT  /api/brackets/:id — { name?, picks, editToken } (or admin x-pass)
- DELETE /api/brackets/:id — [admin]

## Bracket structure
- 32 slots → 16 R32 matches → 8 R16 → 4 QF → 2 SF → 1 Final
- picks_json keys: R32_0..R32_15, R16_0..R16_7, QF_0..QF_3, SF_0..SF_1, F_0
- Scoring (ESPN-style): R32=20, R16=40, QF=80, SF=160, F=320. No separate champion bonus.

## First-time setup
```bash
wrangler d1 create worldcup-bracket
# Update database_id in wrangler.toml
npm run db:init:remote
npm run db:migrate:remote
wrangler secret put ADMIN_PASS
npm run deploy
```

## Local dev
```bash
# .dev.vars with ADMIN_PASS=...
npm run db:init:local && npm run db:migrate:local
npm run dev
```

## Security notes (2026-08-08 audit fix)
- PUT without a matching editToken is rejected (was open to anyone with an id).
- Client must not bind edit rights to display-name match.
- After 002 migration, pre-existing brackets get random tokens — those devices need a fresh save.

_Machine-local session notes live in `CLAUDE.local.md` (gitignored — never commit it)._
