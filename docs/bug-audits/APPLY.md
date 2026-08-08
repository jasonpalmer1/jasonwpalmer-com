# Apply fixes to other repos — **local Claude / Jason’s machine**

> **Deploy model:** Sites and Workers are deployed from **`~/projects/…` on Jason’s computer** (wrangler / `/ship`), not by the Cursor cloud agent. The cloud agent could only push `jasonwpalmer-com` to GitHub. Everything else lives as **bundles in this repo** for you to copy locally and deploy.

Master checklist: [`FOR-CLAUDE.md`](../../FOR-CLAUDE.md)

## One-liner (preferred)

```bash
cd ~/projects/jasonwpalmer-com
# After merging the cloud PR / branch onto local main:
bash scripts/apply-audit-bundles.sh              # see what’s available
bash scripts/apply-audit-bundles.sh worldcup-bracket
cd ~/projects/worldcup-bracket && npm run db:migrate:remote && npm run deploy

bash scripts/apply-audit-bundles.sh all          # every checkout that exists
```

Override checkout root if needed: `PROJECTS_DIR=/other/path bash scripts/apply-audit-bundles.sh all`

## Manual copy (same as the script)

```bash
SITE=~/projects/jasonwpalmer-com
BUNDLE=$SITE/docs/bug-audits/ready-to-apply

# worldcup-bracket (HIGHEST PRIORITY)
cd ~/projects/worldcup-bracket
cp "$BUNDLE/worldcup-bracket/src/index.js" src/index.js
cp "$BUNDLE/worldcup-bracket/migrations/"*.sql migrations/
cp "$BUNDLE/worldcup-bracket/package.json" \
   "$BUNDLE/worldcup-bracket/README.md" \
   "$BUNDLE/worldcup-bracket/CLAUDE.md" .
npm run db:migrate:remote   # REQUIRED before deploy
npm run deploy

# wafergraph-mcp
cd ~/projects/wafergraph-mcp
cp "$BUNDLE/wafergraph-mcp/src/data.ts" src/data.ts
cp "$BUNDLE/wafergraph-mcp/src/mcp-agent.ts" src/mcp-agent.ts
cp "$BUNDLE/wafergraph-mcp/src/tools/shared.ts" src/tools/shared.ts
cp "$BUNDLE/wafergraph-mcp/README.md" "$BUNDLE/wafergraph-mcp/CLAUDE.md" .
# typecheck + deploy per that repo’s CLAUDE.md

# go-no-go / react-canvas-force-graph — copy files, commit (no CF deploy)
```

## Or `git am` patches

```bash
cd ~/projects/worldcup-bracket
git am ~/projects/jasonwpalmer-com/docs/bug-audits/patches/worldcup-bracket-edit-token.patch
# likewise: wafergraph-mcp-compare-upstream.patch
#          go-no-go-parallel-verdict.patch
#          react-canvas-force-graph-onnodepick.patch
```

## worldcup-bracket deploy checklist

1. Apply bundle / patch  
2. `npm run db:migrate:remote` — adds `edit_token`, backfills random tokens  
3. `npm run deploy` from **this machine**  
4. Tell pool players: pre-migration brackets keep picks but **edit keys rotated** — use “Start new bracket” or ask admin to delete  

## After you’re done

- Mark the repo ✅ in `BUG-AUDIT.md` status board  
- Update that repo’s `CLAUDE.md` if auth/scoring docs changed (worldcup bundle already does)  
- Do **not** expect the cloud agent PR to have deployed anything to Cloudflare
