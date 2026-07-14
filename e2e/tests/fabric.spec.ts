import { expect, test } from "@playwright/test";
import { fetchServices, uniqueLower } from "../helpers/sds";
import FabricPage from "../pages/fabric.page";

/**
 * Ported from e2e-tests/tests/fabric-view.js ("Validate Service Counts").
 *
 * Proof-of-concept for the TestCafe → Playwright migration. Demonstrates the
 * replacement patterns for the old suite's core idioms:
 *  - `ReactSelector("GMServiceCard").count` → `expect(locator).toHaveCount(n)`
 *    with auto-retry (no more `while (count === 0) t.wait(1000)` polling loops).
 *  - tab navigation by route href instead of by translated link text.
 *  - reading the per-tab count badge and asserting the rendered grid matches.
 */
test.describe("Fabric View", () => {
  test("service counts match across views and status tabs", async ({
    page
  }) => {
    const fabric = new FabricPage(page);
    await fabric.goto();

    // Wait for the discovery data to load and the grid to render.
    await expect(fabric.serviceCards.first()).toBeVisible();

    // The "All Services" tab total must equal the number of rendered cards.
    const allServicesCount = await fabric.readTabCount("/");
    expect(allServicesCount).toBeGreaterThan(0);
    await expect(fabric.serviceCards).toHaveCount(allServicesCount);

    // Switching to the List view shows the same number of items.
    await fabric.listButton.click();
    await expect(fabric.serviceListItems).toHaveCount(allServicesCount);

    // Back to Cards.
    await fabric.cardsButton.click();
    await expect(fabric.serviceCards).toHaveCount(allServicesCount);

    // Each status tab's badge count must equal the cards shown under it.
    for (const status of ["/Down", "/Warning", "/Stable"]) {
      await fabric.tab(status).click();
      const statusCount = await fabric.readTabCount(status);
      await expect(fabric.serviceCards).toHaveCount(statusCount);
    }
  });

  // Ported from fabric-view.js ("Validate Filtering: Search").
  test("search filters the service cards", async ({ page }) => {
    const fabric = new FabricPage(page);
    await fabric.goto();
    await expect(fabric.serviceCards.first()).toBeVisible();

    const initialCount = await fabric.serviceCards.count();

    // Derive a search term from a real card's displayed name (strip the
    // truncation ellipsis, as the old test did), then lowercase it.
    let term = await fabric.serviceCards
      .last()
      .locator("a")
      .first()
      .innerText();
    if (term.includes("...")) term = term.slice(0, -4);
    term = term.toLowerCase();

    await fabric.searchInput.fill(term);

    // Every remaining card must contain the search term (auto-retried until the
    // grid settles), replacing the old `while (count===0) t.wait(1000)` loop.
    await expect
      .poll(async () => {
        const texts = await fabric.serviceCards.allInnerTexts();
        return (
          texts.length > 0 && texts.every((t) => t.toLowerCase().includes(term))
        );
      })
      .toBe(true);

    // Nonsense search → no cards.
    await fabric.searchInput.fill("bananagrams");
    await expect(fabric.serviceCards).toHaveCount(0);

    // Cleared search → original set restored.
    await fabric.searchInput.fill("");
    await expect(fabric.serviceCards).toHaveCount(initialCount);
  });

  // Ported from fabric-view.js ("Validate Filtering: Grouping").
  // Replaces the old `.getReact()` props read with a live /services fetch.
  test("grouping splits services into the expected sections", async ({
    page,
    request
  }) => {
    const fabric = new FabricPage(page);
    await fabric.goto();
    await expect(fabric.serviceCards.first()).toBeVisible();

    const services = await fetchServices(request);

    // Group by Owner. Poll the header set (not the count) since consecutive
    // groupings can yield the same section count while the content re-renders.
    await fabric.chooseFromSelect("Group", "Owner");
    const owners = uniqueLower(services, "owner");
    await expect
      .poll(async () => (await fabric.sectionHeaderTexts()).sort())
      .toEqual([...owners].sort());

    // Group by Capability
    await fabric.chooseFromSelect("Group", "Capability");
    const capabilities = uniqueLower(services, "capability");
    await expect
      .poll(async () => (await fabric.sectionHeaderTexts()).sort())
      .toEqual([...capabilities].sort());

    // Group by Status — always the three statuses, in fixed order.
    await fabric.chooseFromSelect("Group", "Status");
    await expect
      .poll(async () => fabric.sectionHeaderTexts())
      .toEqual(["down", "warning", "stable"]);

    // Group by None — one section, no headers.
    await fabric.chooseFromSelect("Group", "None");
    await expect(fabric.sections).toHaveCount(1);
    await expect(fabric.sectionHeaders).toHaveCount(0);
  });

  // Ported from fabric-view.js ("Validate Filtering: Sorting").
  // Replaces the addCustomDOMProperties index trick with a `data-status` read.
  test("sorting orders cards by status then name", async ({ page }) => {
    const fabric = new FabricPage(page);
    await fabric.goto();
    await expect(fabric.serviceCards.first()).toBeVisible();

    // Flatten the grid so sort order is observable across all cards.
    await fabric.chooseFromSelect("Group", "None");

    // Sort by Status → Down, then Warning, then Stable.
    await fabric.chooseFromSelect("Sort", "Status");
    const order = ["Down", "Warning", "Stable"];
    await expect
      .poll(async () => {
        const ranks = (await fabric.cardStatuses()).map((s) =>
          order.indexOf(s)
        );
        return ranks.every((r, i) => i === 0 || ranks[i - 1] <= r);
      })
      .toBe(true);

    // Sort by Name → alphabetical (ascending).
    await fabric.chooseFromSelect("Sort", "Name");
    await expect
      .poll(async () => {
        const names = (await fabric.serviceCards.allInnerTexts()).map((t) =>
          t.toLowerCase()
        );
        return names.every((n, i) => i === 0 || names[i - 1] <= n);
      })
      .toBe(true);
  });
});
