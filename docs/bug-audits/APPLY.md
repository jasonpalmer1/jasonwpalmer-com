# Apply fixes to other repos (Claude / local)

This cloud agent **can write to `jasonwpalmer-com` only**. Fixes for the other public repos were implemented and committed locally, then exported here because `git push` returned **403** (`cursor[bot]` lacks write access).

## Quick apply (copy files)

From a machine with push access to each repo:

```bash
# worldcup-bracket (HIGHEST PRIORITY — deploy after migrate)
cd ~/projects/worldcup-bracket   # or clone
git checkout -b cursor/bracket-put-auth-0f3d
cp -R /path/to/jasonwpalmer-com/docs/bug-audits/ready-to-apply/worldcup-bracket/* .
# ensure migrations/002-edit-token.sql is present
npm run db:migrate:remote
git add -A && git commit -m "Require per-bracket edit tokens on PUT"
git push -u origin HEAD
# open PR, then: npm run deploy

# wafergraph-mcp
cd ~/projects/wafergraph-mcp
git checkout -b cursor/mcp-compare-errors-0f3d
cp -R /path/to/jasonwpalmer-com/docs/bug-audits/ready-to-apply/wafergraph-mcp/* .
git add -A && git commit -m "Fix compare_companies unique sets and upstream errors"
git push -u origin HEAD

# go-no-go
cd ~/projects/go-no-go
git checkout -b cursor/parallel-verdict-null-0f3d
cp docs/.../ready-to-apply/go-no-go/* .
git add -A && git commit -m "Fix parallel stress null verifications"
git push -u origin HEAD

# react-canvas-force-graph
cd ~/projects/react-canvas-force-graph
git checkout -b cursor/stale-onnodepick-0f3d
cp docs/.../ready-to-apply/react-canvas-force-graph/ForceGraph.jsx .
git add -A && git commit -m "Fix stale onNodePick click handler via ref"
git push -u origin HEAD
```

## Or apply git patches

```bash
cd ~/projects/worldcup-bracket
git am /path/to/jasonwpalmer-com/docs/bug-audits/patches/worldcup-bracket-edit-token.patch
# similarly for the other three .patch files
```

## worldcup-bracket deploy checklist

1. `npm run db:migrate:remote` (**required** — adds `edit_token`, backfills random tokens)
2. `npm run deploy`
3. Tell existing pool players: old brackets keep their picks but **edit keys rotated** — use “Start new bracket” or ask admin to delete stale rows

## Grant future cloud agents push access

Add the other repos to the Cursor cloud GitHub app permissions (or run those agents with the target repo as the workspace) so patches don’t need this shuttle.
