# Scaffold: Cloudflare Turnstile on `/api/subscribe`

**Status:** Code hooks are in place and **no-op when env keys are unset**. Safe to deploy without Turnstile.

## Why

Honeypot + IP Cache rate limit + email cooldown are already live. Turnstile is the next step if bots still burn Resend quota.

## Activate (local / CF)

1. Cloudflare Dashboard → Turnstile → create widget for `jasonwpalmer.com`  
2. Local `.env` / Pages secrets:

```bash
# Public (build-time for Next)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# Secret (Pages Function only — never NEXT_PUBLIC_)
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name jasonwpalmer-com
```

3. Redeploy site (`/ship` or wrangler) so Functions see the secret and the client bundle sees the site key.

## Behaviour

| Keys set? | Client | Server |
|---|---|---|
| No | No widget rendered | Accepts requests (current honeypot/rate-limit path) |
| Yes | Renders Turnstile widget; sends `turnstileToken` in POST JSON | Verifies with `https://challenges.cloudflare.com/turnstile/v0/siteverify`; 403 on fail |

## Files

- `src/components/Subscribe.tsx` — widget mount when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set  
- `functions/api/subscribe.js` — `verifyTurnstile()` when `env.TURNSTILE_SECRET_KEY` set  
- `.env.example` — documents both vars  

## Claude checklist when finishing

- [ ] Confirm CSP `script-src` / `frame-src` allow `https://challenges.cloudflare.com` (update `public/_headers` if needed)  
- [ ] Manual test: empty token rejected when secret set  
- [ ] Strike this scaffold from README when fully rolled out  
