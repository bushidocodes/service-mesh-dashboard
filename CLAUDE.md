# GM Fabric Dashboard — Claude Code guide

## Running the dev server

```bash
npm start          # starts Vite on :3000 + mock discovery service on :9000
npm run start-ui   # Vite only (no mock service)
```

## Running tests

```bash
npm test           # full Jest suite
```

From a **git worktree** on Windows, run the setup script first (see below).

## Working in a git worktree (.claude/worktrees/*)

Claude Code creates worktrees under `.claude/worktrees/` for parallel agentic
sessions. Worktrees share the main repo's git object store but have no
`node_modules` of their own. Run the setup script once per worktree before
starting the dev server or test suite:

```bash
bash scripts/worktree-setup.sh
```

This copies the Vite dep-optimizer cache and the `dygraphs` package from the
main repo's `node_modules` — the only two things Vite needs that it can't
resolve on its own. Everything else is either in the optimizer cache or
resolved at import time.

### Why a setup script instead of a junction/symlink?

Vite calls `fs.realpathSync()` on every resolved path. A junction pointing
`worktree/node_modules → repo/node_modules` causes `realpathSync` to return
paths under `repo/`, not `worktree/`, so Vite treats the main repo as the
project root and ignores edits in the worktree.

`vite.config.js` pins `root: __dirname` (derived from `import.meta.url`, not
`realpathSync`) to prevent any junction from hijacking the project root.

### Jest testMatch on Windows worktrees

`testMatch` globs use `**` prefixes rather than `<rootDir>` to avoid a
micromatch backslash-escape bug that caused Jest to find 0 tests when run from
a worktree path containing `\.claude\`.
