# Shared visit-log CSP allowlist (scaffold)

**Status:** Doc + snippet printer. Sibling sites still hand-edit `_headers`.

## Problem

`visit-log.jwpalm99.workers.dev` must appear in `script-src` and `connect-src` on every site that loads `/v.js`. Easy to drift when CSP is tightened.

## Canonical fragment (jasonwpalmer.com)

```
script-src … https://visit-log.jwpalm99.workers.dev …
connect-src … https://visit-log.jwpalm99.workers.dev …
```

Beacon include (layout):

```html
<script defer src="https://visit-log.jwpalm99.workers.dev/v.js" />
```

## Claude / local

```bash
node scripts/print-visit-log-csp-snippet.mjs
# Paste into each sibling site's public/_headers CSP line.
```

Longer term: one shared include file if multi-repo packaging exists; until then keep this doc as the source of truth.
