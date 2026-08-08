# World Cup Bracket Pool

A free bracket-prediction pool for the FIFA World Cup 2026, built for a small group of friends and open to anyone who wants to run their own. Pick winners for all 32 knockout slots, scores update automatically against real match results, and the pool at [worldcup-bracket.jwpalm99.workers.dev](https://worldcup-bracket.jwpalm99.workers.dev) is playing for a $100 charity prize.

## How it works

- Anyone can open the app and submit a bracket (public pool): pick a winner for every Round of 32 game, and the app carries your picks forward through R16, quarters, semis, and the final.
- **Your browser stores a private edit token** after the first save. Only that token (or the admin code) can update your bracket — knowing someone’s display name is not enough.
- An admin enters real results as they happen. Scoring is ESPN-style points per correct pick: **R32 = 20 · R16 = 40 · QF = 80 · SF = 160 · Final/Champion = 320** (no separate champion bonus — the Final pick *is* the champion pick).
- A live leaderboard and a browsable list of everyone else's brackets are both in the app.

## The technical angle

This is a full-stack app that ships as a **single Cloudflare Worker with no build step**. There's no bundler, no framework, no client/server split to deploy separately:

- `src/index.js` is the entire backend — routing, auth, and all `/api/*` handlers — and it also contains the entire frontend (HTML, CSS, and vanilla JS) as one big template literal that the Worker returns as the response body for any non-API request.
- The "frontend" is genuinely embedded source, not a templating trick: the inline `<script>` block is real browser JS, written carefully to avoid colliding with the outer JS template literal (no nested template literals or backticks in the client code — see `CLAUDE.md` for the escaping rules that make this work).
- Team data (`src/teams.js`) is a plain JS array that gets `JSON.stringify`-inlined into the HTML at module load, so the client has the full team list with zero extra requests.
- State lives in [D1](https://developers.cloudflare.com/d1/) (Cloudflare's SQLite), bound directly to the Worker — config/results plus brackets with per-row `edit_token`.

The result: one file to read to understand the whole app, one `wrangler deploy` to ship it, and no npm build step between editing code and seeing it live.

## Stack

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: vanilla HTML/CSS/JS, embedded in the Worker, no build step
- **Auth**: public participate + per-bracket edit token; admin unlock via `ADMIN_PASS` Worker secret. (`FRIEND_PASS` is unused / legacy.)

## Self-hosting this

You'll need a Cloudflare account and [wrangler](https://developers.cloudflare.com/workers/wrangler/) installed.

```bash
npm install
```

### 1. Create the D1 database

```bash
wrangler d1 create worldcup-bracket
```

Copy the `database_id` it prints out into `wrangler.toml` under `[[d1_databases]]`.

### 2. Run the migrations

```bash
npm run db:init:remote     # against the real D1 database
npm run db:migrate:remote  # add edit_token column + backfill (existing DBs)
npm run db:init:local      # local SQLite, for dev
npm run db:migrate:local
```

### 3. Set the admin passcode

```bash
wrangler secret put ADMIN_PASS
```

**Local dev**, in a `.dev.vars` file at the repo root (gitignored):

```
ADMIN_PASS=your-admin-code
```

### 4. Run it

```bash
npm run dev        # local dev server, wrangler dev --local
npm run deploy      # ship to Cloudflare
```

## Notes on ownership

- `POST /api/brackets` returns `{ id, editToken }` once. The client keeps `editToken` in `localStorage`.
- `PUT /api/brackets/:id` requires that token (or admin). Display name is never treated as ownership.
- After migration `002`, existing rows get random tokens — those players must save a **new** bracket from their device (or ask admin to delete the old row).

## License

MIT — see `LICENSE`.
