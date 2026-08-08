#!/usr/bin/env bash
# Apply cloud-agent audit bundles into Jason's local ~/projects trees.
# Usage:
#   ./scripts/apply-audit-bundles.sh                 # list
#   ./scripts/apply-audit-bundles.sh worldcup-bracket
#   ./scripts/apply-audit-bundles.sh all
#
# Run from anywhere; resolves paths relative to this repo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUNDLE_ROOT="$ROOT/docs/bug-audits/ready-to-apply"
PROJECTS="${PROJECTS_DIR:-$HOME/projects}"

usage() {
  cat <<EOF
Apply audit fix bundles into local project checkouts.

  PROJECTS_DIR=$PROJECTS
  BUNDLES=$BUNDLE_ROOT

Usage:
  $(basename "$0")                 list available bundles
  $(basename "$0") <name>          apply one bundle
  $(basename "$0") all             apply every bundle that has a local checkout

Names: worldcup-bracket | wafergraph-mcp | go-no-go | react-canvas-force-graph
EOF
}

apply_one() {
  local name="$1"
  local src="$BUNDLE_ROOT/$name"
  local dest="$PROJECTS/$name"

  if [[ ! -d "$src" ]]; then
    echo "ERROR: no bundle at $src" >&2
    return 1
  fi
  if [[ ! -d "$dest/.git" && ! -d "$dest" ]]; then
    echo "SKIP: $dest not found (clone or set PROJECTS_DIR). Bundle stays at:"
    echo "      $src"
    return 0
  fi

  echo "==> Applying $name → $dest"
  case "$name" in
    worldcup-bracket)
      mkdir -p "$dest/src" "$dest/migrations"
      cp "$src/src/index.js" "$dest/src/index.js"
      cp "$src/migrations/"*.sql "$dest/migrations/"
      cp "$src/package.json" "$src/README.md" "$src/CLAUDE.md" "$dest/"
      echo "    Next: cd $dest && npm run db:migrate:remote && npm run deploy"
      ;;
    wafergraph-mcp)
      mkdir -p "$dest/src/tools"
      cp "$src/src/data.ts" "$dest/src/data.ts"
      cp "$src/src/mcp-agent.ts" "$dest/src/mcp-agent.ts"
      cp "$src/src/tools/shared.ts" "$dest/src/tools/shared.ts"
      cp "$src/README.md" "$src/CLAUDE.md" "$dest/"
      echo "    Next: cd $dest && npm run typecheck && npm run deploy  # per repo CLAUDE.md"
      ;;
    go-no-go)
      cp "$src/go-no-go.js" "$dest/go-no-go.js"
      cp "$src/CLAUDE.md" "$dest/CLAUDE.md"
      echo "    Next: commit in $dest (no deploy — workflow script)"
      ;;
    react-canvas-force-graph)
      cp "$src/ForceGraph.jsx" "$dest/ForceGraph.jsx"
      echo "    Next: commit in $dest"
      ;;
    *)
      echo "ERROR: unknown bundle $name" >&2
      return 1
      ;;
  esac
  echo "    Done. Review git diff, commit, deploy from THIS machine."
}

list() {
  echo "Bundles under $BUNDLE_ROOT:"
  ls -1 "$BUNDLE_ROOT" 2>/dev/null || echo "(none)"
  echo
  echo "Local checkouts under $PROJECTS:"
  for n in worldcup-bracket wafergraph-mcp go-no-go react-canvas-force-graph; do
    if [[ -d "$PROJECTS/$n" ]]; then echo "  ✓ $n"; else echo "  · $n (missing)"; fi
  done
}

cmd="${1:-list}"
case "$cmd" in
  -h|--help|help) usage ;;
  list) list ;;
  all)
    for n in worldcup-bracket wafergraph-mcp go-no-go react-canvas-force-graph; do
      apply_one "$n" || true
    done
    ;;
  *) apply_one "$cmd" ;;
esac
