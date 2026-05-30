#!/usr/bin/env bash
# Sets up node_modules stubs in a git worktree so that Vite and Jest can run
# without a full `npm install`. Run this once after creating a new worktree.
#
# Why: Vite's dep optimizer looks for node_modules relative to cwd and crashes
# if the directory doesn't exist. The `.vite` cache and the `dygraphs` package
# (which has a hard-coded alias in vite.config.js) are the only entries needed
# for the dev server to start; everything else is resolved via the optimizer
# cache. Jest similarly needs node_modules present for module resolution.
#
# Usage: bash scripts/worktree-setup.sh

set -euo pipefail

WORKTREE=$(git rev-parse --show-toplevel)
ROOT=$(git rev-parse --git-common-dir)/..
# Normalize the root path (--git-common-dir may return a .git path)
ROOT=$(cd "$ROOT" && pwd)

echo "Worktree: $WORKTREE"
echo "Repo root: $ROOT"

if [ "$WORKTREE" = "$ROOT" ]; then
  echo "Already in the main worktree — nothing to do."
  exit 0
fi

if [ ! -d "$ROOT/node_modules" ]; then
  echo "Error: $ROOT/node_modules not found. Run 'npm install' in the main repo first."
  exit 1
fi

mkdir -p "$WORKTREE/node_modules"

echo "Copying .vite dep-optimizer cache..."
cp -r "$ROOT/node_modules/.vite" "$WORKTREE/node_modules/.vite"

echo "Copying dygraphs package..."
cp -r "$ROOT/node_modules/dygraphs" "$WORKTREE/node_modules/dygraphs"

echo "Done. You can now run 'npm start' and 'npm test' from the worktree."
