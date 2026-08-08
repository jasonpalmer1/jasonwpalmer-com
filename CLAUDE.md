# jasonwpalmer.com — CLAUDE.md

Personal site / live résumé at **[jasonwpalmer.com](https://jasonwpalmer.com)**: a finance operator & systems builder's portfolio, styled as a cyberpunk "operator terminal" (boot sequence, HUD panels, live age/XP, build cards with rarity tiers). Content-driven — the tool showcase doubles as an always-current record of what Jason has built.

Conventions: follows `~/projects/CONVENTIONS.md` (stack, deploy, autonomy, quality gate).

> PUBLIC site. Trading tools, broker creds (Public.com), and strategy specifics must NEVER appear here. Generic mentions ("trading tools", "options/futures curriculum", "DuckDB") are fine; concrete trading infra/keys are not.

## Current focus / next steps
_Keep this current — it's the fastest way to pick up work._
- **⭐ Cloud-agent handoff (2026-08-08):** Read **`FOR-CLAUDE.md` first.** Deploys happen from **this machine** (`~/projects` + `/ship` / wrangler), not from Cursor cloud. Site fixes are on branch `cursor/bug-audit-documentation-0f3d` / PR #1 — merge locally, run D1 `0002`, deploy. Sibling fixes: `bash scripts/apply-audit-bundles.sh worldcup-bracket` (then migrate+deploy). Queue + scaffolds: `docs/feature-scaffolds/`. Details: `BUG-AUDIT.md`. **Sous** = separate chat.
- **Content upkeep** (the real ongoing job): keep `src/data/tools.ts` (build cards), `src/data/platforms.ts`, and `src/data/profile.ts` current as Jason ships things.
- **Blog/build-log cadence**: posts live in `src/content/posts/` (currently `build-log-001`, `build-log-002`, `valley-of-death-financing`). Add build-log posts as projects ship; blog + RSS plumbing is already wired.
- **Contact**: Web3Forms (`ContactForm.tsx` / `ConsultingForm.tsx`) — access key is hardcoded client-side by design; confirm domain lock in the Web3Forms dashboard. Form still posts to `https://api.web3forms.com/submit`.
- **Mailing list (self-hosted, replaced Beehiiv)**: native form → `functions/api/subscribe.js` (honeypot + IP/email cooldowns) → **D1** `dispatch-subscribers` → confirm/unsubscribe via GET interstitial + POST. Sending uses **Resend** (`scripts/send-dispatch.mjs`, run `npm run send-dispatch -- <slug>`; `--dry` to preview). Ops: **`MAILING-LIST.md`**. Needs `RESEND_API_KEY` Pages secret + domain verified in Resend. D1 binding in `wrangler.toml`.

## Tech stack
- **Next.js 16** (App Router, React 19) — static export (`output: "export"` → `out/`).
- **Tailwind CSS v4** (PostCSS plugin, no config file) + **TypeScript**.
- **MDX** blog via `next-mdx-remote` + `gray-matter` front-matter.
- **Cloudflare Pages** hosting (zero server runtime). `trailingSlash: true`, images unoptimized.
- Follows the managed `@AGENTS.md` Next-16 breaking-changes ruleset (read `node_modules/next/dist/docs/` before writing Next code).

## Architecture & data flow
Content lives in plain TS data files; components render it; Next statically exports HTML.
- `src/data/profile.ts` → bio, tagline, gamified "player" framing (level=age, XP=days into year, computed live in browser from `birthDate`), stats, skills, experience, education, socials.
- `src/data/tools.ts` → the build/tool showcase cards (typed `Tool[]` with status/rarity/featured).
- `src/content/posts/*.mdx` → blog posts (front-matter: title, date, summary, tags). `src/lib/posts.ts` reads them at build time for the blog index, `[slug]` pages, and RSS.
- `src/app/page.tsx` composes the homepage from components in a fixed order.

## File map
- `src/app/` — App Router. `page.tsx` (homepage composition), `layout.tsx` (root + SEO metadata/JSON-LD + visit-log beacon), `globals.css` (Tailwind + theme), `sitemap.ts`, `rss.xml/route.ts`, `blog/page.tsx` + `blog/[slug]/page.tsx`, app icons (`icon.png`, `favicon.ico`, `apple-icon.png`). (`/build` still redirects home via `public/_redirects`.)
- `src/components/` — UI: `Nav`, `Hero` + `HeroXp` (client age/XP island), `Stats`, `Tools`, `Platforms`, `Skills` + `SkillRow`, `Resume`, `Lore`, `Contact`, `ContactForm` (Web3Forms via `lib/web3forms.ts`), `Subscribe` / `SubscribeBlock` (native D1 list), `Gallery`, `FloatingActions`, `BootSequence` (takes `buildCount` — do not import `tools[]` into it), `KonamiEasterEgg`, `Counter`.
- `src/data/` — `profile.ts`, `tools.ts`, `platforms.ts`. **Edit content here.** (Beehiiv `newsletter.ts` is gone.)
- `src/content/posts/` — blog `.mdx` files.
- `src/lib/` — `posts.ts` (MDX loader), `useInView.ts` (scroll-reveal hook).
- `functions/api/` — Pages Functions: `subscribe.js`, `confirm.js`, `unsubscribe.js`.
- `public/` — `og.png`, `robots.txt`, `_headers` (CSP allows visit-log + CF insights; Beehiiv removed), `_redirects`, `builds/` screenshots.
- `docs/bug-audits/` — portfolio audit + APPLY bundles for other repos.
- `scripts/` — `gen-brand-assets.js`, `send-dispatch.mjs`.
- `FOR-CLAUDE.md` — **local-first handoff** (start here after cloud-agent work).
- `BUG-AUDIT.md` — audit status board; `docs/bug-audits/` bundles; `docs/feature-scaffolds/` optional work.
- `scripts/apply-audit-bundles.sh` — copy sibling-repo fixes into `~/projects/<repo>`.
- Config: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `wrangler.toml`, `.env.example`.

## Entry points — run / build / deploy
```bash
npm install
npm run dev        # next dev → http://localhost:3000
npm run build      # next build → ./out (static)
npm run lint       # eslint
npx wrangler pages deploy        # wrangler.toml drives output dir + D1 binding (Functions)
# (the old `wrangler pages deploy out --project-name=jasonwpalmer-com` / /ship form still works too —
#  it also picks up the wrangler.toml D1 binding + Functions bundle. Either is fine.)
```
Prefer `/ship` (build → quality gate → preview; never prod without `--prod` + confirmation).

## Where content/data lives
Most edits are in **`src/data/profile.ts`** and **`src/data/tools.ts`**; blog posts in **`src/content/posts/*.mdx`**. Components rarely change. Env keys (contact form) in `.env.example`.

@AGENTS.md

_Machine-local session notes live in `CLAUDE.local.md` (gitignored — never commit it)._
