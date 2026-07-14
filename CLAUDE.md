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
pnpm test            # Vitest — watches locally, runs once under CI
pnpm exec vitest run # one-shot run (what CI does)
pnpm run update-snapshots
```

The test runner is **Vitest** (issue #197 replaced Jest + Babel with it). Vitest
reuses [`vite.config.js`](vite.config.js) — same JSX-in-`.js` pre-pass, `src`
path aliases, and styled-components plugin as the build — so there is no second
transform pipeline. Key points:

- `globals: true`, so `describe`/`it`/`expect`/`vi` are implicit (no per-file
  imports). Use `vi.*`, never `jest.*`. `vi.importActual` is **async** (Jest's
  `requireActual` was sync), and `vi.mock` factories for default-imported
  modules must return `{ default: … }`.
- Test-only behaviour in `vite.config.js` is gated on `process.env.VITEST` (set
  by Vitest), **not** `NODE_ENV` — the e2e suite runs the real dev server with
  `NODE_ENV=test` and must not get the test stubs.
- `config/vitest/jestSetup.js` + `jestTestFrameworkSetup.js` are the setup
  files; `config/vitest/rtlWrapper.js` is the ESM StyleSheetManager render
  wrapper, aliased over `@testing-library/react`.
- Line coverage floor is **60%** (`test.coverage.thresholds.lines` via
  `@vitest/coverage-v8`). CI runs `pnpm test:coverage`. Stories and
  test/json/image fixtures are excluded; Glyphs remain in the denominator.
- `jest-styled-components` is still used for the **snapshot CSS serializer**
  only (style assertions use `@testing-library/jest-dom`'s `toHaveStyle`).
  `babel-plugin-styled-components` runs with `displayName: false` (and
  `minify: false`) in tests so componentIds keep the `sc-` prefix and
  snapshot spacing stays stable; it is inlined via `server.deps.inline` so
  it shares the one styled-components instance.

## End-to-end tests (Playwright)

The E2E suite lives in [`e2e/`](e2e) and runs on **Playwright**
(`@playwright/test`). It replaced the legacy TestCafe + `testcafe-react-selectors`
suite — do **not** re-add those deps.

```bash
pnpm test:e2e          # headless run (CI runs this); boots the app itself
pnpm test:e2e:ui       # interactive UI mode
pnpm test:e2e:report   # open the last HTML report
pnpm typecheck:e2e     # tsc --noEmit -p e2e (Playwright specs + config)
pnpm exec playwright install chromium   # one-time browser download
```

- [`playwright.config.ts`](playwright.config.ts)'s `webServer` runs `pnpm start`
  (Vite :3000 and the mock SDS on :9000). There is no dev proxy — the app
  fetches from the mock via an absolute URL + CORS (issue #211), so tests
  that need the mock talk to :9000 directly too. Locally the dev server is
  reused, in CI (`CI=true`) Playwright owns it. The `Test` workflow runs the
  suite as the `e2e` job — the first time the E2E tests run in CI at all.
- **Selector strategy:** prefer user-facing/stable hooks over component
  internals (the anti-pattern TestCafe's `ReactSelector` encouraged). Tabs are
  selected by route `href` (hash routing → `#/…`) or the `data-testid="nav-tab"`
  on `TabLink`; status/sort dropdowns by the `.gm-select__*` classes; everything
  else by `data-testid`s added at component usage sites (`service-card`,
  `instance-row`, `readout`, `line-chart`, `inspector-item`, …). styled-components
  v6 auto-forwards `data-*`, so these are one-line, snapshot-safe additions.
- **Test data is random per server boot** (`json-mock/discovery-service/data.js`),
  but stable for one run. Specs that need the service set fetch it live via
  `e2e/helpers/sds.ts` (`fetchServices`, `serviceSlug`, `pickByRuntime`) rather
  than hard-coding — `serviceSlug`/`computeStatus`/`slugify` there mirror
  `src/utils` and must stay in sync.
- Use web-first assertions (`toHaveCount`, `expect.poll`) — never fixed waits.

## State management (Redux Toolkit)

The app store is **Redux Toolkit** `configureStore` with `createSlice` reducers
under [`src/store/states/`](src/store/states) and async work as typed
`AppThunk`s in `src/services/**`. Typed hooks live in
[`src/store/hooks.ts`](src/store/hooks.ts) (`useAppDispatch` /
`useAppSelector`).

- **Do not** re-add the npm `jumpstate` package or a local shim — the
  `store/jumpstate` layer was removed in PR-18b (issue #39 follow-through).
- Default RTK middleware is on. `instance.metrics` is ignored by the
  serializable/immutable checks (high-frequency appends); see
  [`src/store/middlewareOptions.ts`](src/store/middlewareOptions.ts).
- There is **no** console action logger in the middleware chain. In
  development, inspect state with the
  **[Redux DevTools](https://github.com/reduxjs/redux-devtools) browser
  extension** — `configureStore` enables the DevTools hook automatically;
  no app code is required.

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

The `vite.config.js` `root: __dirname` pin is **independently correct** and
stays regardless of package manager:

- **Vite root pin.** Vite calls `fs.realpathSync()` on resolved paths. With a
  junctioned `node_modules` that would make Vite treat the *main* repo as the
  project root and ignore worktree edits. `vite.config.js` pins
  `root: __dirname` (derived from `import.meta.url`, not `realpathSync`) so the
  worktree is always the root. pnpm's `node_modules` is real (not a junction to
  the main repo), so this is belt-and-suspenders, but keep it. Vitest's
  `test.include`/`exclude` globs are relative (`src/**`, `**/.claude/worktrees/**`)
  and resolve against this root. (The old Jest `testMatch` `**`-prefix hack —
  which dodged a micromatch backslash bug on `\.claude\` worktree paths — went
  away with Jest in issue #197.)

- **dygraphs alias.** `vite.config.js` aliases `dygraphs` to
  `node_modules/dygraphs/src-es5/dygraph.js`. This resolves fine through pnpm's
  symlinked `node_modules`. `dygraphs` is on `~2.2.1`. The earlier `~2.1.0` pin
  (issue #67) was because 2.2.x added a `getComputedStyle(maindiv).padding*`
  check that logs `"Main div contains padding; graph will misbehave"` unless
  every padding longhand is exactly `"0px"`. jsdom returns `""` (not `"0px"`)
  for an unstyled div, so the check tripped the `console.error`-as-throw test
  setup and broke every dygraph-mounting test. Fixed by declaring an explicit
  `padding: 0` on `DygraphContainer` (a visual no-op — default was already
  zero — that makes jsdom resolve the longhands to `"0px"`).
