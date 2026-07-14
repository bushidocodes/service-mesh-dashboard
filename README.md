<h1 align="center">
  <br>
  <img src="./docs/assets/decipher-logo.png" alt="Decipher Logo" width="50">
  <br>
  Grey Matter Fabric Dashboard (old)
  <br>
</h1>

_Note: This is a historical repository of GM Fabric Dashboard releases provided under the ISC and MIT licenses. All releases after v1.0.6 are only available as a licensed commercial product. To learn more about this, please visit <a href="http://deciphernow.com/grey-matter">the Grey Matter product page</a>_

<h4 align="center">A (deprecated) administrative UI for distributed systems built with the <a href="http://deciphernow.com/grey-matter#fabric" target="_blank">Grey Matter Fabric</a> microservice framework.</h4>


<p align="center">
  <a href="https://biomejs.dev" target="_blank">
    <img src="https://img.shields.io/badge/formatted_with-Biome-60a5fa?style=flat&logo=biome"
         alt="formatted with Biome">
  </a>
  <a href="https://www.styled-components.com/" target="_blank"><img src="https://img.shields.io/badge/styled_with-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357" alt="styled with styled-components"></a>
  <a href="https://opensource.org/licenses/mit-license.php" target="_blank"><img src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" alt="licensed under MIT"></a>
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#related-projects">Related Projects</a> •
  <a href="#license">License</a>
</p>

## Demo

<img alt="Animated GIF showing product in action" src="https://media.giphy.com/media/3o6fJ7w7GS3PyUKq2c/giphy.gif" >

## Quick Start

This project uses **pnpm** as its package manager and Node.js version manager. You do not need a separate global Node install for local development — pnpm downloads the pinned runtime on install.

#### Requirements

- [pnpm](https://pnpm.io/installation) 11+
- Node.js 22 (pinned in `.nvmrc` / `package.json` `devEngines`; pnpm can auto-download it)

#### Install and start with a mock backend

From the command-line interface, navigate to the directory where you would like to install the dashboard and run:

```bash
git clone https://github.com/DecipherNow/gm-fabric-dashboard-old.git
cd gm-fabric-dashboard-old
pnpm install
pnpm start
```

`pnpm start` runs Vite on [http://localhost:3000](http://localhost:3000) and a mock discovery service on port 9000. The page reloads when you edit source files.

Useful commands:

| Command | Purpose |
| --- | --- |
| `pnpm start` | Vite UI + mock SDS |
| `pnpm start-ui` | Vite only (no mock service) |
| `pnpm test` | Vitest (watch locally; once under CI) |
| `pnpm run lint` | Biome check |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test:e2e` | Playwright end-to-end suite |
| `pnpm build` | Production Vite build |

For more detail, see [docs/installation.md](docs/installation.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Contributor-facing tooling notes also live in `CLAUDE.md`.

If you are a systems administrator and wish to install this software with live metrics and microservices, please refer to our externally-hosted [Grey Matter Fabric documentation site](http://www.deciphernow.com/)

## Related Projects

* [Grey Matter Fabric JVM SDK](https://github.com/DecipherNow/gm-fabric-jvm)
* [Grey Matter Fabric Go SDK](https://github.com/DecipherNow/gm-fabric-go)
* [Grey Matter Fabric Passthrough Agent](https://github.com/DecipherNow/gm-fabric-jvmagent)

## License

MIT
