# Feature scaffolds — for Claude

These are **intentional stubs / optional paths** laid down by the cloud audit agent so you can finish features without rediscovering design. Nothing here is required for the security deploy.

| Scaffold | Doc | Code touchpoints | Activate by |
|---|---|---|---|
| Turnstile on subscribe | [turnstile-subscribe.md](./turnstile-subscribe.md) | `Subscribe.tsx`, `functions/api/subscribe.js`, `.env.example` | Set Turnstile site + secret keys |
| Build-log post template | — | `src/content/posts/_TEMPLATE.build-log.mdx` | Copy → rename → fill → `npm run send-dispatch` |
| Portfolio backlog | [PORTFOLIO-QUEUE.md](./PORTFOLIO-QUEUE.md) | n/a | Pick next item when idle |

When you finish a scaffold, delete or rewrite its doc so the queue stays honest.
