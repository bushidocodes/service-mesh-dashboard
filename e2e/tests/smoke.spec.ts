import { test, expect } from "@playwright/test";

/**
 * Scaffold smoke test — validates the Playwright harness end to end before any
 * specs are ported:
 *   1. the `webServer` (`pnpm start`) boots and serves the app on :3000,
 *   2. the app renders, and
 *   3. the Vite proxy to the mock discovery service (:9000) works.
 * Intentionally uses no React-component / testid selectors yet.
 */

test("app shell renders", async ({ page }) => {
  await page.goto("/");

  // The footer Decipher/GitHub link is always present and locale-independent,
  // so it's a stable proof the React app mounted.
  await expect(
    page.locator('a[href="http://github.com/DecipherNow"]')
  ).toBeVisible();
});

test("mock discovery service is reachable through the Vite proxy", async ({
  request
}) => {
  const res = await request.get("/services");
  expect(res.ok()).toBeTruthy();

  const services = await res.json();
  expect(Array.isArray(services)).toBeTruthy();
  expect(services.length).toBeGreaterThan(0);

  // Shape check on the fields the ported specs will rely on.
  const sample = services[0];
  expect(sample).toHaveProperty("name");
  expect(sample).toHaveProperty("owner");
  expect(sample).toHaveProperty("capability");
  expect(sample).toHaveProperty("runtime");
});
