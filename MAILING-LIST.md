# Dispatch Mailing List — Operator Guide

Self-hosted newsletter for jasonwpalmer.com. Subscribers confirm via email (double opt-in); dispatches are sent manually via a Node script.

## Architecture

```
Browser → POST /api/subscribe (CF Pages Function)
        → D1 "dispatch-subscribers" (stores email + token, status=pending)
        → Resend API (confirmation email with /api/confirm?token=...)
        → Subscriber clicks confirm
        → GET /api/confirm (CF Pages Function) → D1 status=confirmed

npm run send-dispatch -- <slug>
        → wrangler d1 (fetches confirmed subscribers)
        → Resend API (dispatch email per subscriber, 600ms throttle)
        → Each email has /api/unsubscribe?token=... footer link
```

**Files:**
- `functions/api/subscribe.js` — POST handler (validate, store, send confirmation)
- `functions/api/confirm.js` — GET handler (confirm token → status=confirmed)
- `functions/api/unsubscribe.js` — GET handler (token → status=unsubscribed, idempotent)
- `migrations/0001_subscribers.sql` — D1 schema
- `scripts/send-dispatch.mjs` — manual send script
- `src/components/Subscribe.tsx` — in-page subscribe form
- `wrangler.toml` — Pages + D1 binding config

**D1 database:** `dispatch-subscribers` (id: `93ef2925-5d85-44ed-b8bc-4bfead311275`)

---

## One-Time Setup

### 1. Create a Resend account and verify your domain

1. Go to [resend.com](https://resend.com) and create a free account.
2. In the Resend dashboard → **Domains** → **Add Domain** → enter `jasonwpalmer.com`.
3. Resend will provide DNS records (DKIM, SPF, DMARC). Add them to Cloudflare DNS for `jasonwpalmer.com`.
4. Wait for Resend to verify (usually a few minutes after DNS propagation).
5. In Resend → **API Keys** → create a key with "Sending access". Copy it.

> The `FROM_EMAIL` uses `dispatch@jasonwpalmer.com`. Resend allows any `*@<verified-domain>` as the from address — no additional mailbox setup needed.

### 2. Add the Resend API key as a Cloudflare Pages secret

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name jasonwpalmer-com
# Paste the key when prompted
```

This keeps the key out of `wrangler.toml` (which is committed). `SITE_URL` and `FROM_EMAIL` are set in `wrangler.toml` [vars] and are non-sensitive.

### 3. Apply the D1 migration

The D1 database is already created. Apply the schema:

```bash
npx wrangler d1 execute dispatch-subscribers --remote --file=migrations/0001_subscribers.sql
```

Verify:

```bash
npx wrangler d1 execute dispatch-subscribers --remote --command "SELECT * FROM subscribers LIMIT 5;"
```

### 4. Deploy the site

```bash
npx wrangler pages deploy out --project-name=jasonwpalmer-com
# or: /ship --prod
```

The `functions/api/*.js` files are picked up automatically by Cloudflare Pages Functions.

---

## Recurring Workflow: Sending a Dispatch

After publishing a new post to `src/content/posts/<slug>.mdx`:

**1. Preview (dry run — no emails sent):**
```bash
npm run send-dispatch -- <slug> --dry
# or for the newest post by date:
npm run send-dispatch -- --dry
```

**2. Send:**
```bash
npm run send-dispatch -- <slug>
# or newest post:
npm run send-dispatch
```

The script:
- Resolves the post (slug arg or newest by frontmatter `date`)
- Fetches confirmed subscribers from D1 via `wrangler d1 execute --remote`
- POSTs to Resend one email per subscriber (~600ms apart)
- Prints a sent/failed summary

**Requires:** `RESEND_API_KEY` in `.env` at repo root (or exported in shell). Not needed in Cloudflare secrets for local script use — only the Pages Function needs it there.

---

## Environment Variables Summary

| Variable | Where set | Purpose |
|---|---|---|
| `RESEND_API_KEY` | CF Pages secret + local `.env` | Resend sending auth |
| `SITE_URL` | `wrangler.toml` [vars] | Confirmation/unsubscribe links |
| `FROM_EMAIL` | `wrangler.toml` [vars] | Email from address |

---

## Security Notes

- All D1 queries use parameterized bindings (`prepare().bind().run()`).
- `RESEND_API_KEY` is never logged or returned in any response.
- Tokens are generated with `crypto.randomUUID()` — never sequential IDs.
- Email validated server-side (regex + 254-char cap + lowercase/trim).
- Double opt-in: subscribers are `pending` until they click the confirmation link.
- Unsubscribe is idempotent and token-based (no auth required, no email exposed).
