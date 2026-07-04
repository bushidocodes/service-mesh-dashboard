# E2E migration plan: TestCafe → Playwright

## Status: COMPLETE ✅

The migration is done. The TestCafe suite and both deps are removed; the
Playwright suite (13 tests, ~22s) is green and wired into CI. The sections below
are the original plan, kept for context.

**What shipped:**
- `@playwright/test` + `playwright.config.ts` (`webServer` runs `pnpm start`),
  `test:e2e` / `:ui` / `:report` scripts, gitignore entries.
- `e2e/` tree: `tests/` (smoke, fabric, service, instance, instance-go,
  instance-jvm, i18n-spanish), `pages/` (base/fabric/service/instance page
  objects), `helpers/` (sds, uptime).
- Source instrumentation — `data-testid`s added at usage sites: `service-card`,
  `service-list-item`, `service-section(-header)`, `nav-tab`, `instance-row`,
  `instance-uptime`, `readout`, `readout-item`, `line-chart`, `data-row`,
  `route-requests`, `thread-row`, `stack-trace`, `inspector-item`,
  `language-selector` (+ `data-status` on cards/list/threads). 20 unit snapshots
  regenerated; full unit suite stays green (239 files / 420 tests).
- CI: new `e2e` job in `.github/workflows/test.yml` (installs Chromium, runs
  `pnpm test:e2e`, uploads the HTML report) — the first time E2E runs in CI.
- `e2e-tests/` (TestCafe) deleted; `testcafe` + `testcafe-react-selectors`
  removed from `package.json`.

**Mapping (old → new):** fabric-view.js → `fabric.spec.ts` (counts, search,
grouping, sorting); service-view.js → `service.spec.ts`; base-instance-view.js →
`instance.spec.ts`; instance-view-go.js → `instance-go.spec.ts`;
instance-view-jvm.js → `instance-jvm.spec.ts`;
internationalization-spanish.js → `i18n-spanish.spec.ts`.

**Reduced-fidelity notes (intentional):**
- Routes-table sorting: the old test asserted order via per-column `name`
  attributes the refactored `TableLineItem` no longer renders. The port verifies
  the **Requests** column ordering (`route-requests`) as a representative sort
  check instead of re-instrumenting all five columns.
- i18n: the port verifies Spanish rendering of the toolbar dropdowns, grid, and
  settings rather than re-walking every view, since locators are now
  locale-independent and localization is what's under test.

**Key discoveries:** hash routing (`#/…`) → tabs selectable by href, no testid;
toggle buttons expose `title` (`getByTitle`); mock data is random-per-boot so
expectations come from a live `/services` fetch (§4.2); `uptime-parser.js` had a
latent `.count`→`.length` bug, fixed in `e2e/helpers/uptime.ts`.

---


Replace the TestCafe + `testcafe-react-selectors` suite under `e2e-tests/` with a
modern Playwright (`@playwright/test`) suite, and wire it into CI (it currently
runs nowhere automatically).

## 1. Why

- `testcafe` and `testcafe-react-selectors` are the only legacy corner of an
  otherwise modern stack (Vite 6, Vitest 4, React 18, RTK 2). Playwright is the
  de-facto standard, is the assumed default in this session's tooling (a
  Playwright MCP is wired up), and gives auto-waiting, parallelism, traces, and
  a CI-friendly `webServer` runner.
- The current specs lean on two dated anti-patterns we want to retire, not port
  verbatim:
  - **Selecting React components by display name** (`ReactSelector("GMServiceCard")`)
    — couples tests to component internals and only works against a dev build.
  - **Reading component props** via `.getReact()` (`servicesGrid.getReact()` →
    `props.services` in [tests/fabric-view.js](tests/fabric-view.js)) — asserts on
    React internals rather than what the user sees.
  - **Hard `t.wait(1000)` polling loops** scattered through every spec — replaced
    by Playwright web-first assertions.

## 2. Current-state inventory

**Specs (6)** under `e2e-tests/tests/`:
- `fabric-view.js` — service counts, search filtering, group-by, sort-by (uses
  `.getReact()` + `addCustomDOMProperties`).
- `service-view.js` — instance search + uptime/ID sorting (uses `uptime-parser`).
- `base-instance-view.js`, `instance-view-go.js`, `instance-view-jvm.js` — tab /
  element presence + sorting on instance views.
- `internationalization-spanish.js` — switches locale to `es-ES`, re-runs presence
  checks with Spanish `messages` lookups.

**View-models (7)** under `e2e-tests/view-models/` — page objects holding
`ReactSelector`/`Selector` definitions; `base-view-model` + `base-instance-view-model`
are inherited by the rest.

**Helpers (2)** under `e2e-tests/helpers/`:
- `assert-sorted.js` — uses the TestCafe `t` controller; must be reworked.
- `uptime-parser.js` — pure JS (mostly portable, but has a latent
  `uptimeSubstrings.count` bug — `.count` should be `.length`; fix during port).

**Wiring**: one script, [`package.json`](../package.json) →
`"test:e2e:local": "testcafe chrome:headless ./e2e-tests/tests/*.js -a 'pnpm start' --app-init-delay 5000"`.
No CI workflow runs it.

**React components currently targeted by display name** (need stable hooks — see
§4.1): `BrandText`, `Breadcrumb`, `AppVersionLink`, `TabLink`, `LanguageSelectorWrap`,
`Header`, `LongLogo`, `Links/Link`, `FabricMainView`, `GMServiceCard`,
`ServicesListItem`, `GMServiceCardCollection`, `GMServiceHeader`, `Toolbar`,
`ToolbarLeft`, `ButtonWrap`, `TableRow`, `TableCol`, `ArrayValue`, `Readout`,
`ReadoutDisplay`, `ItemDisplay`, `LineChartDisplay`, `LineChartTitle`,
`InspectorSearch`, `InspectorHideZero`, `InspectorHideStatic`, `InspectorItem`,
plus the JVM/Go-specific ones in `instance-*-view-model.js` (~30 total).

## 3. Target architecture

```
e2e/
  playwright.config.ts        # webServer: `pnpm start`, baseURL :3000, chromium project
  fixtures/
    test.ts                   # extends base test with page-object fixtures
  pages/                      # page objects (ported view-models), testid-based locators
    base.page.ts
    fabric.page.ts
    service.page.ts
    instance-*.page.ts
    settings.page.ts
  helpers/
    uptime.ts                 # ported + bug-fixed uptime-parser
    sds-fixture.ts            # loads mock SDS data to derive expected owners/capabilities
  tests/
    fabric.spec.ts
    service.spec.ts
    instance-*.spec.ts
    i18n-spanish.spec.ts
```

Keep `e2e-tests/` until the Playwright suite is green, then delete it in the
final step.

## 4. Key decisions

### 4.1 Selector strategy — the crux

Replace display-name selection with **`data-testid` attributes** on the ~30
targeted components, plus role/text where natural. This is the bulk of the source
change.

- Add `data-testid="..."` to each component in `src/` that a view-model currently
  targets by name (e.g. `GMServiceCard` → `data-testid="service-card"`).
- Locators become `page.getByTestId("service-card")`, replacing
  `ReactSelector("GMServiceCard")`.
- Where current code does `ReactSelector("TabLink").withText(messages...)`, prefer
  a stable per-tab testid (`tab-all-services`, `tab-down`, …) so i18n locale
  changes don't break the locator (the count text stays inside via a nested
  testid like `tab-all-services-count`).
- `.gm-select__control` / `.gm-select__option` (react-select) are real CSS classes
  — port directly as `page.locator(".gm-select__control")` /
  `page.getByRole("option", { name })`.

**Decision point for the user**: testids are the recommended path but touch ~30
source components. The lower-touch alternative is to keep selecting by visible
text/CSS only (no source edits) — feasible for most presence checks but fragile
for the card/list/section grids that have no stable text. Recommendation:
testids.

### 4.2 Replacing `.getReact()` prop reads

`fabric-view.js` reads `props.services` off `FabricMainView` to compute the set of
unique owners/capabilities, then asserts the rendered section headers match.

Port by **deriving expected data from the live mock SDS response instead of
React props** (`helpers/sds.ts`): the mock discovery service generates its
service list *randomly at startup* (`json-mock/discovery-service/data.js` uses
`Math.random()` / `_.sample`), so a static fixture import would NOT match what's
rendered. Instead fetch the live list directly from the mock SDS on :9000
(`request.get("http://localhost:9000/services")` — there is no dev proxy, see
issue #211) — it's stable for the life of the one `webServer` process —
compute unique owners/capabilities in the test, and assert against rendered
`service-section-header` testids. This is effectively what `.getReact()` read
indirectly (the same data, post-render), minus the React-internals coupling.

### 4.3 Waiting

Delete every `while (count===0) { await t.wait(1000) }` loop and `--app-init-delay`.
Use web-first assertions: `await expect(page.getByTestId("service-card")).toHaveCount(n)`,
`await expect(locator).toBeVisible()`. Playwright auto-waits and retries.

### 4.4 Sorting helpers

- `assert-sorted.js` → `helpers` function taking a `Locator`, reading
  `allInnerTexts()`, asserting numeric order in JS (mirrors the existing
  TestCafe-3 workaround in `fabric-view.js:349` that already does JS-side
  lexicographic comparison).
- `addCustomDOMProperties(indexInGrid)` (sort-by-status test) → compute order from
  `locator.evaluateAll(...)` or simply assert the ordered sequence of
  `data-status` attributes via `allInnerTexts()`.
- `uptime-parser` → port to `helpers/uptime.ts`, fixing `.count` → `.length`.

### 4.5 i18n

Keep importing `src/messages` for text assertions, but base **locators** on
locale-independent testids so the Spanish spec only changes expected *text*, not
selectors. Locale switch (`linkLanguages` → `linkLanguagesEs`) ports directly.

## 5. Phased steps

1. **Scaffold** — add `@playwright/test`; `pnpm exec playwright install --with-deps chromium`;
   create `e2e/playwright.config.ts` with a `webServer` running `pnpm start`
   (baseURL `http://localhost:3000`, reuse server locally, fail on missing in CI).
2. **Add testids** — instrument the ~30 `src/` components (§4.1). Mechanical;
   one PR-sized chunk. Verify nothing else keys off those nodes.
3. **Port helpers** — `uptime.ts` (+ bugfix), `sds-fixture.ts`, sorting assertion.
4. **Port page objects** — view-models → `e2e/pages/*.page.ts` as Playwright
   page-object classes taking `page`.
5. **Port specs one at a time**, simplest → hardest:
   `instance-view-go` / `instance-view-jvm` / `base-instance-view` (presence
   checks) → `service-view` (sorting) → `i18n-spanish` → `fabric-view` (the
   getReact/grouping/custom-DOM-prop one). Run each green before the next.
6. **Wire CI** — new GitHub Actions job: setup-node from `.nvmrc`, `pnpm install`,
   `playwright install`, `pnpm test:e2e`, upload HTML report/trace on failure.
   (First time these tests run automatically.)
7. **Swap scripts & deps** — `test:e2e` / `test:e2e:ui` scripts; remove
   `testcafe` + `testcafe-react-selectors` from `package.json`; `pnpm install`.
8. **Delete `e2e-tests/`** and update `CLAUDE.md` (testing section) to describe the
   Playwright suite.

## 6. Risks / watch-items

- **Mock-data determinism** — sorting/count assertions depend on the mock SDS
  payload (JVM vs Go services, down/warning/stable mix). Confirm it's static;
  derive expectations from the fixture (§4.2) rather than hard-coding.
- **Grouping test** is the hardest single port (loses `getReact`); §4.2 is the
  plan but validate the fixture truly matches what's rendered.
- **react-select interactions** — opening menus before options exist in the DOM
  is already encoded in the view-models' comments; Playwright auto-wait handles
  it, but verify menu portal rendering.
- **Scope of testid edits** — touches production components. Keep them inert
  (`data-testid` only) and confirm no snapshot/Vitest tests assert on their
  absence.

## 7. Effort

Roughly: scaffold + CI ~0.5d; testids ~0.5–1d; helpers/page-objects ~0.5d;
spec ports ~1.5–2d (fabric-view dominates); cleanup ~0.5d. ~3–4 focused days.
Lands cleanly as a stacked sequence of small PRs (scaffold → testids → port specs
→ remove TestCafe).
