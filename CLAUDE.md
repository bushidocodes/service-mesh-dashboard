# GM Fabric Dashboard — Claude Code guide

This project uses **pnpm** as its package manager **and** its Node.js version
manager. You do not need nvm, npm, or a global Node install — pnpm handles both.

## First-time setup

```bash
pnpm install       # installs deps AND auto-downloads the pinned Node.js
                   # (version comes from .nvmrc / use-node-version in .npmrc)
```

The pinned Node version lives in two kept-in-sync places:

- `.npmrc` → `use-node-version` — what pnpm runs scripts with locally.
- `.nvmrc` — what CI's `actions/setup-node` installs.

To change Node versions for the project, edit both, then `pnpm install`.

## Running the dev server

```bash
pnpm start         # starts Vite on :3000 + mock discovery service on :9000
pnpm start-ui      # Vite only (no mock service)
```

## Running tests

```bash
pnpm test          # full Jest suite
```

## Working in a git worktree (.claude/worktrees/*)

Claude Code creates worktrees under `.claude/worktrees/` for parallel agentic
sessions. Worktrees share the main repo's git object store but have no
`node_modules` of their own. Just run:

```bash
pnpm install       # seconds — packages hard-link from pnpm's global store
```

There is **no setup script** anymore. pnpm hard-links packages from its global
content-addressable store, so each worktree gets a complete, self-contained
`node_modules` in seconds with no disk duplication and no copying of caches.
(The old `scripts/worktree-setup.sh` npm hack was removed in the pnpm migration,
issue #108.)

### Why pnpm fixes worktrees (and why the old hacks are still needed elsewhere)

The `vite.config.js` `root: __dirname` pin and the relative Jest `testMatch`
globs are **independently correct** and stay regardless of package manager:

- **Vite root pin.** Vite calls `fs.realpathSync()` on resolved paths. With a
  junctioned `node_modules` that would make Vite treat the *main* repo as the
  project root and ignore worktree edits. `vite.config.js` pins
  `root: __dirname` (derived from `import.meta.url`, not `realpathSync`) so the
  worktree is always the root. pnpm's `node_modules` is real (not a junction to
  the main repo), so this is belt-and-suspenders, but keep it.

- **Jest testMatch globs.** They use `**` prefixes rather than `<rootDir>` to
  avoid a micromatch backslash-escape bug that made Jest find 0 tests when run
  from a worktree path containing `\.claude\` on Windows.

- **dygraphs alias.** `vite.config.js` aliases `dygraphs` to
  `node_modules/dygraphs/src-es5/dygraph.js`. This resolves fine through pnpm's
  symlinked `node_modules`. `dygraphs` is pinned to `~2.1.0` (issue #67 — 2.2.x
  breaks the Summary tests); the pnpm lockfile keeps it at 2.1.0.

## Git hooks in worktrees (gotcha)

Hooks are husky v9. `core.hooksPath` **should be the relative value `.husky/_`**
(set in the shared `.git/config`), which git resolves against each worktree's
own root — so every worktree and the main repo runs its **own** hooks.

Two failure modes to know about:

1. **Per-worktree absolute override → runs the *main* repo's hooks.** A worktree
   may carry a per-worktree `core.hooksPath` pointing at the *main* checkout's
   `.husky/_` (absolute). Then the worktree runs the **main checkout's** hook
   files, not its own. That's harmless for pre-migration branches, but this
   branch pins Node via `devEngines.runtime`, and if the main checkout's hooks
   still call `npx`, the commit dies with `EBADDEVENGINES` (npm/npx enforces
   `devEngines` against the running Node). Fix one worktree:

   ```bash
   git config --worktree --unset core.hooksPath   # fall back to shared .husky/_
   git config core.hooksPath .husky/_             # (shared) ensure it's relative
   ```

   The structural fix is this migration itself: its hooks call the local bins
   directly (`lint-staged`, `commitlint`) instead of `npx`, so once the npx-free
   hooks are on the branch the main checkout uses, the whole class of failure
   goes away regardless of who sets `hooksPath`.

2. **Never run `husky` with an argument** (e.g. `husky --version`). husky v9 has
   no flags — it treats the arg as the hooks dir and runs
   `git config core.hooksPath <arg>/_`, silently corrupting it (e.g. to
   `--version/_`). To check the version use `pnpm why husky` or read
   `package.json`.
