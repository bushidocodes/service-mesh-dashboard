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

If JVM microservice (gm-fabric-jvm) :
Edit `./index.html` by replacing `__RUNTIME__` with `JVM`

If GO microservice (gm-fabric-go):
Edit `./index.html` by replacing `__RUNTIME__` with `GO`

If Service Discovery Service (SDS) microservice (mock-sds):
In development, `pnpm start` already runs the mock SDS on port 9000 and the app falls back to that endpoint when `fabricServer` is the `__FABRIC_SERVER__` placeholder. For production static deploys, set the `fabricServer` meta tag in `index.html` (or inject it at serve time) to your Fabric server base URL.

## Use

### General Users trying the Dashboard

1. Ensure a microservice is running on your system serving metrics, or use the mock SDS via `pnpm start`
2. From the project directory, run `pnpm install` once, then `pnpm start`. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Report bugs or desired enhancements on [the project's issues page](https://github.com/DecipherNow/gm-fabric-dashboard/issues)
4. When finished, stop the local server serving your dashboard (and perhaps the local server serving your microservice) by pressing `control+c` on the respective terminals running these servers

### Developers building, testing, and integrating the Dashboard

#### Requirements

- [pnpm](https://pnpm.io/installation) 11+
- Node.js 22 (pinned in `.nvmrc` / `package.json`; `pnpm install` can auto-download it)

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

#### `pnpm build` to prepare the Dashboard for deployment to the core `gm-fabric-jvm` project

This builds the app for production with Vite to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

Once built, the production bundle is minified and ready for deployment. The dashboard assumes that it is monitoring a microservice at the root path with Twitter Server metrics accessible at `/admin/metrics.json` and `/admin/threads`. The dashboard itself is served from `/gmadmin/`.

In order to support deployment of the dashboard to monitor a microservice that doesn't own the root path, this projects injects the string template `__BASE_URL__` in the minified index.html file and JS bundle that can be replaced to set the desired path. For your convenience, a BASH script is provided to simplify this deployment process and provide an undo option.

For example, if you are going to deploy the dashboard to a microservice located at `http://www.deciphernow.com/my/awesome/microservice/`, your dashboard will be located at the path `/my/awesome/microservice/gmadmin/` and poll endpoints at `/my/awesome/microservice/admin/metrics.json` and `/my/awesome/microservice/admin/threads`. To configure the dashboard for this path,`cd` into the ./build directory and execute `sudo ./setPath.sh /my/awesome/microservice/gmadmin/`. Please note that the path should have both an opening and a trailing slash. Additionally, the path must terminate in `/gmadmin/` to allow the dashboard to properly determine the URLs of the scrape targets. If you do not have `/gmadmin/` at the end of the string you pass into `setPath.sh`, the deployment script will fail and exit. After running this script successfully, your application is ready to be deployed.

In case of error or mis-configuration, your original `index.html` has been backed up to `index.html.old`. To revert to the backup, run `sudo ./setPath.sh undo` and rerun with the correct argument.

In addition to `__BASE_URL__`, the HEAD of index.html also has an meta attribute with a `__BASE_RUNTIME__` template string. This signifies to the dashboard whether the dashboard intends to scrape a Finagle-style `metrics.json` or an alternate Decipher-designed metrics endpoint provided by a Go microservice. The permissable values are `JVM`, `GO`, or `ENVOY`. Currently, the `setPath.sh` script does not modify this template.
