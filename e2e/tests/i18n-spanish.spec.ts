import { test, expect } from "@playwright/test";
import FabricPage from "../pages/fabric.page";

/**
 * Ported from e2e-tests/tests/internationalization-spanish.js.
 *
 * Switches the locale to Spanish via the language selector, then verifies the
 * UI re-renders in Spanish. Locators here stay locale-independent (testids,
 * hrefs) so only the asserted *text* is Spanish; navigation stays in-SPA (hash
 * routing) so the chosen locale isn't reset by a full page reload.
 */
test.describe("Internationalization: Spanish", () => {
  test("UI renders in Spanish after switching locale", async ({ page }) => {
    const fabric = new FabricPage(page);
    await fabric.goto();
    await expect(fabric.serviceCards.first()).toBeVisible();

    // Open the language widget and pick Spanish (option labels are constant).
    await page.getByTestId("language-selector").click();
    await page.getByText("Español (es)", { exact: true }).click();

    // Toolbar dropdown titles are now Spanish.
    await expect(
      page.locator(".gm-select__control").filter({ hasText: "Grupo" })
    ).toBeVisible();
    await expect(
      page.locator(".gm-select__control").filter({ hasText: "Ordenar" })
    ).toBeVisible();

    // Group options are translated.
    await page
      .locator(".gm-select__control")
      .filter({ hasText: "Grupo" })
      .click();
    await expect(
      page.getByRole("option", { name: "Propietario", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Capacidad", exact: true })
    ).toBeVisible();
    // Close the menu.
    await page.keyboard.press("Escape");

    // The grid still renders (locale-independent testid).
    expect(await fabric.serviceCards.count()).toBeGreaterThan(0);

    // Settings view renders in Spanish (in-SPA hash navigation preserves locale).
    await page.locator('a[href="#/settings"]').click();
    await expect(page.getByText("Limpiar caché")).toBeVisible();
  });
});
