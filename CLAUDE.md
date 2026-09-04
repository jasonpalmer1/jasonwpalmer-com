# jasonwpalmer.com — CLAUDE.md

Personal site / live résumé at **[jasonwpalmer.com](https://jasonwpalmer.com)**: a finance operator & systems builder's portfolio, styled as a cyberpunk "operator terminal" (boot sequence, HUD panels, live age/XP, build cards with rarity tiers). Content-driven — the tool showcase doubles as an always-current record of what Jason has built.

Conventions: follows `~/projects/CONVENTIONS.md` (stack, deploy, autonomy, quality gate).

> PUBLIC site. Trading tools, broker creds (Public.com), and strategy specifics must NEVER appear here. Generic mentions ("trading tools", "options/futures curriculum", "DuckDB") are fine; concrete trading infra/keys are not.

## Current focus / next steps
_Keep this current — it's the fastest way to pick up work._
- **2026-09-03 — GA4 HAD NEVER RUN, AND THE FIX IS NOW LIVE (`a7d6fb8`, deployment `abd4b236`).**
  This file's 08-31 note above said GA4 was "live-verified on the real apex". It verified the tag
  was PRESENT in the HTML. It was. `public/_headers` never listed `googletagmanager.com` in
  `script-src` (`git log -S googletagmanager` over that file returns nothing), so the browser
  refused to execute it and the GA4 property collected nothing for three days. Cloudflare Insights
  was blocked the same way. **Present in the markup is not running** — the only check that catches
  this is loading the page in a real browser and reading the console. Proven fixed the same way:
  a headless load of the live apex now fires a real `google-analytics.com/g/collect?…&en=page_view`
  to `G-Z05EBSHWWC`, not just a script tag.
- ⚠ **PUSHING `main` STILL DEPLOYS NOTHING HERE. Confirmed a third time 2026-09-03.** `a7d6fb8`'s
  own commit message claimed the opposite — that this repo had "turned out to be git-integrated"
  because an earlier push "deployed itself". It had not. The push produced zero new deployments and
  the live CSP was unchanged; only the explicit wrangler deploy moved it. The trap: `wrangler pages
  deployment list` shows a **Source** commit for a MANUAL deploy too, so that column can never tell
  a git build from a hand deploy. Don't re-derive this — it was already corrected on 2026-07-05.
- **Deploy with bare `npx wrangler pages deploy`** (source `~/.cloudflare.env` first). `wrangler.toml`
  carries `pages_build_output_dir = "out"`, the `DB` D1 binding and the `SITE_URL`/`FROM_EMAIL` vars;
  the older `pages deploy out --project-name=…` form bypasses that config and risks shipping without
  the Functions bundle the newsletter endpoints (`/api/subscribe`, `/api/confirm`, `/api/unsubscribe`)
  depend on. Watch for `✨ Uploading Functions bundle` in the output.
- **Privacy policy LIVE 2026-09-03 22:20** — Jason approved in the hub; merged `3bb09f4`, deployed by hand (`fcfd8b00`), verified `https://jasonwpalmer.com/privacy/` by title. `src/app/privacy/page.tsx`, linked
  from the homepage footer and `sitemap.ts`. Not a copy of ironstrikeai.com's policy: that site is
  first-party-analytics-only and says "no third-party trackers", which would be FALSE here because
  of GA4. Every claim was read out of the code (visit-log `src/beacon.js` privacy contract and its
  `form_abandon` path, the DNT/GPC gate, `migrations/0001_subscribers.sql`, `functions/api/subscribe.js`,
  the two web3forms components). If a tracker is ever added or removed, change that page in the
  same commit and bump its `EFFECTIVE` constant and the sitemap `lastModified`.
- **GA4 LIVE IN PRODUCTION (promoted 2026-08-31 on Jason's explicit go):** `src/app/layout.tsx`
  carries a manual `<head>` (first one in this layout — coexists fine with the `metadata` export,
  same pattern whosstarting already uses) with a plain gtag.js snippet, Measurement ID
  `G-Z05EBSHWWC` under the "Jason Palmer Sites" GA4 account. Committed to `main` (`725e72f`),
  then promoted via `npx wrangler pages deploy out --project-name=jasonwpalmer-com --branch=main`
  (source `~/.cloudflare.env` first) — deployment `32dc7efc`. Live-verified on the real apex, not
  just preview: the tag is present on `https://jasonwpalmer.com/` and `https://jasonwpalmer.com/blog/`
  (it's in the root layout, so every page carries it).
  ⚠ Standing: the comment in the snippet flags it for possible replacement by a Cloudflare Zaraz
  edge tag later — **never run both**, that double-counts every pageview.
  This repo still has no standing auto-deploy grant (unlike whosstarting): any future prod deploy
  needs Jason's sign-off in the conversation.
- **Content upkeep** (the real ongoing job): keep `src/data/tools.ts` (build cards) and `src/data/profile.ts` (stats/experience) current as Jason ships things. Recent commits added a Who's Starting card and iterated its blurb.
- **Blog/build-log cadence**: four posts now (`build-log-001`, `build-log-002`, `valley-of-death-financing`, `built-on-fieldy`), all live in prod. Blog + RSS + sitemap plumbing is wired; a new `.mdx` in `src/content/posts/` lands in all three automatically (verified 2026-09-03).
- **✅ `built-on-fieldy` IS LIVE IN PRODUCTION (2026-09-04, on Jason's explicit go).** Merged
  `post/built-on-fieldy` → `main` fast-forward (`849d01c`, pushed), built, deployed
  `npx wrangler pages deploy out --project-name=jasonwpalmer-com --branch=main` → deployment
  `44c1591f`. Live-verified on the APEX at https://jasonwpalmer.com/blog/built-on-fieldy/ —
  200, `<title>Built on Fieldy — Jason Palmer</title>`, self-canonical, no noindex, GA4 present,
  and the probe's negative branch was proven first against a known-bad URL (this site's 404 titles
  "404: Route Not Found", so "Built on Fieldy" cannot appear on it). Submitted to search the same
  session: IndexNow 200 + Search Console sitemap submit; Google already reports the URL
  "Discovered - currently not indexed". The link Jason hands to Fieldy is the apex URL.
  **Still owed: Jason sends the email himself (pitch Step 5).**
- **The IndexNow key file is finally LIVE** (`/51a6a251c35f43cfb472347d3dc7429a.txt`, 200) — it had
  been committed since 2026-08-05 but never deployed, so this repo had never once pinged IndexNow.
  This deploy fixed that; the 2026-09-04 autopilot run submitted 3 changed URLs, its first ever here.
- ⚠ **`sitemap-autopilot.mjs` prints "all clear — nothing to do" on a run that DID submit.** That
  line means "no breakage to notify", not "no work done" — read `autopilot.log`, not stdout, to
  confirm an IndexNow/GSC submit actually happened.
- ⚠ **Google has never crawled `/blog/` or the two build-log posts** (verified 2026-09-04 via
  `gsc-inspect.mjs`: 4 of 6 URLs "Discovered - currently not indexed", never crawled). Only the
  homepage and `valley-of-death-financing` are indexed. Worth a look before the next post.
- ⚠ **Baseline lint here is 35 errors / 2 warnings repo-wide, all pre-existing** (`react/jsx-no-comment-textnodes` in `Tools.tsx` and friends). A bare `npm run lint` exit code is therefore a meaningless quality gate — lint changed files only.
- **Contact**: recently migrated email → Web3Forms contact form. Confirm the form key is set (see `.env.example`) and the form still posts.
- **Mailing list (self-hosted, replaced Beehiiv)**: native form → `functions/api/subscribe.js` → **D1** `dispatch-subscribers` (double opt-in via `functions/api/confirm.js`; `unsubscribe.js`). Sending uses **Resend** (`scripts/send-dispatch.mjs`, run `npm run send-dispatch -- <slug>`; `--dry` to preview). One-time setup + ops in **`MAILING-LIST.md`**. Needs `RESEND_API_KEY` as a Pages secret + jasonwpalmer.com verified in Resend before confirmation/dispatch emails send. D1 binding lives in `wrangler.toml`.

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
- `src/app/` — App Router. `page.tsx` (homepage composition), `layout.tsx` (root + SEO metadata/JSON-LD), `globals.css` (Tailwind + theme), `sitemap.ts`, `rss.xml/route.ts`, `blog/page.tsx` + `blog/[slug]/page.tsx`, app icons (`icon.png`, `favicon.ico`, `apple-icon.png`).
- `src/components/` — UI: `Nav`, `Hero`, `Stats`, `Tools`, `Skills`, `Resume`, `Lore`, `Contact`, `ContactForm` (Web3Forms), `Subscribe` (Beehiiv), `BootSequence`, `KonamiEasterEgg`, `Counter`.
- `src/data/` — `profile.ts`, `tools.ts`, `newsletter.ts` (Beehiiv form id/loader). **Edit content here.**
- `src/content/posts/` — blog `.mdx` files.
- `src/lib/` — `posts.ts` (MDX loader), `useInView.ts` (scroll-reveal hook).
- `public/` — `og.png` (share card), `robots.txt`, `_headers` (Cloudflare headers).
- `scripts/gen-brand-assets.js` — regenerates branded icons.
- Config: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `.env.example`.

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
