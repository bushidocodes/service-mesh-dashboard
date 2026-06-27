import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config for the GM Fabric Dashboard.
 *
 * Replaces the legacy TestCafe runner. The `webServer` block boots the same
 * `pnpm start` the dev workflow uses — Vite on :3000 (which proxies /services
 * and /metrics to the mock discovery service on :9000). Tests run against the
 * proxied origin, so they never talk to :9000 directly.
 *
 * Note on test data: the mock SDS generates its service list randomly at
 * startup (json-mock/discovery-service/data.js), but it stays stable for the
 * life of the server process. Tests that need the expected service set fetch it
 * live from `/services` rather than hard-coding or importing a static fixture.
 */
export default defineConfig({
  testDir: "./e2e/tests",
  // Specs drive shared app state (locale switching, navigation), so keep a
  // single worker for now; revisit once specs are isolated per-context.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],

  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe"
  }
});
