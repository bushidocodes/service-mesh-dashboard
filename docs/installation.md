### Using Docker

#### 1. Install Docker

Download and install the binary for [Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac), [Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows), or [Linux](https://store.docker.com/search?architecture=amd64&offering=community&operating_system=linux&platform=server&q=&type=edition)

#### 2. Use docker to start an example Grey Matter Microservice

##### For a JVM-based microservice:

Run `docker run -it -p 1337:9990 spmcbride1201/gm-fab-jvm`

After starting your microservice, you should see a valid JSON file [at this endpoint](http://localhost:1337/admin/metrics.json). If you see JSON data, you are ready to proceed.

##### For a Go-based microservice:

Run `docker run -it -p 1337:10001 drfogout/metricssimple`

After starting your microservice, you should see a valid JSON file [at this endpoint](http://localhost:1337/metrics). If you see JSON data, you are ready to proceed.

## Configuration

### Fabric server endpoint

The only HTML-level static config is the `fabricServer` meta tag in root `index.html`:

```html
<meta property="fabricServer" content="__FABRIC_SERVER__">
```

- **Development:** leave the `__FABRIC_SERVER__` placeholder. `pnpm start` runs the mock discovery service on port 9000; the app falls back to that endpoint when the meta value is still the placeholder.
- **Production:** set `content` to your Fabric / SDS base URL, or inject it at serve time (the `docker-prod` Express server replaces `__FABRIC_SERVER__` from the `FABRIC_SERVER` env var).

### Service runtime (JVM / GO / ENVOY)

Runtime is **not** configured via an HTML meta tag. When a fabric server is configured, the dashboard reads each service’s `runtime` field from SDS metadata (`getRuntime` in `src/utils/selectors.ts`). The Docker JVM/Go examples above only provide metrics endpoints for local exploration; they do not require editing `index.html` for runtime.

## Use

### General Users trying the Dashboard

1. Ensure a microservice is running on your system serving metrics, or use the mock SDS via `pnpm start`
2. From the project directory, run `pnpm install` once, then `pnpm start`. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Report bugs or desired enhancements on [the project's issues page](https://github.com/DecipherNow/gm-fabric-dashboard/issues)
4. When finished, stop the local server serving your dashboard (and perhaps the local server serving your microservice) by pressing `control+c` on the respective terminals running these servers

### Developers building, testing, and integrating the Dashboard

#### Requirements

- [pnpm](https://pnpm.io/installation) 11+
- Node.js 22 (pinned in `.nvmrc` and `package.json` `devEngines`; pnpm can auto-download it on install)

#### `pnpm start` to develop features and crush bugs

This runs the app in development mode: Vite on [http://localhost:3000](http://localhost:3000) and a mock discovery service on port 9000. You can open the source code in your editor of choice, and the page will reload if you make edits.

Use `pnpm start-ui` if you only need the Vite UI without the mock SDS.

We suggest use of the [Biome](https://biomejs.dev/guides/editors/first-party-extensions/) editor extension and [EditorConfig](http://editorconfig.org/#download) to apply the project's style and lint rules.

Additionally, if you are a VS Code user, this project has a custom dictionary for the [Code Spellchecker extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

#### `pnpm test` to enhance front-end unit test coverage

This runs the **Vitest** test runner (watch mode locally; a single run under CI).

```bash
pnpm test                 # watch (local)
pnpm exec vitest run      # one-shot
pnpm run update-snapshots # update snapshots under CI-like settings
```

#### `pnpm run lint` and `pnpm typecheck`

```bash
pnpm run lint      # Biome check
pnpm run lint:fix  # Biome autofix
pnpm typecheck     # tsc --noEmit
```

#### `pnpm test:e2e` for end-to-end coverage

Playwright drives Chromium against the real dev stack (`pnpm start`). First-time setup may need `pnpm exec playwright install chromium`.

```bash
pnpm test:e2e          # headless
pnpm test:e2e:ui       # interactive UI mode
pnpm test:e2e:report   # open the last HTML report
```

#### `pnpm build` for a production bundle

```bash
pnpm build
```

This builds the app with Vite into the `build` folder (see `vite.config.js` `outDir`). The bundle is minified and ready to serve as static assets.

**Fabric server injection:** the built `index.html` keeps the `__FABRIC_SERVER__` placeholder on the `fabricServer` meta tag. Replace it with your SDS/Fabric base URL before or at serve time. The Docker production image does this for you: `pnpm run build-docker` builds via `docker-prod/Dockerfile`, and `docker-prod/server/app.js` substitutes `__FABRIC_SERVER__` from the `FABRIC_SERVER` environment variable on each HTML response.

There is no local `setPath.sh` / `__BASE_URL__` / `__BASE_RUNTIME__` rewrite tooling in this repo anymore. For product-specific deployment paths, use the externally hosted Grey Matter documentation.
