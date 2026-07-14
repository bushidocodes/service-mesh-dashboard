import { expect, test } from "@playwright/test";
import { fetchServices, pickByRuntime, serviceSlug } from "../helpers/sds";
import InstancePage from "../pages/instance.page";

/**
 * Ported from e2e-tests/tests/base-instance-view.js — behaviors common to all
 * instance runtimes (summary layout, routes table, explorer). Uses a JVM
 * instance as the representative case.
 *
 * Note: the old routes test asserted sort order via per-column `name`
 * attributes that the refactored TableLineItem no longer renders. We verify the
 * Requests column ordering (instrumented with data-testid="route-requests") as
 * the representative sort check rather than re-instrumenting all five columns.
 */

const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
const isSorted = (nums: number[], dir: "asc" | "desc") =>
  nums.every((n, i) =>
    i === 0 ? true : dir === "asc" ? nums[i - 1] <= n : nums[i - 1] >= n
  );

test.describe("Instance View (common)", () => {
  let instance: InstancePage;

  test.beforeEach(async ({ page, request }) => {
    const services = await fetchServices(request);
    const svc = pickByRuntime(services, "JVM");
    expect(svc, "no metered JVM service in mock data").toBeTruthy();
    instance = new InstancePage(page);
    await instance.goto(serviceSlug(svc!), svc!.instances[0].name);
  });

  test("summary view layout", async ({ page }) => {
    await expect(page.getByText("Vitals", { exact: true })).toBeVisible();
    await expect(page.getByText("Statistics", { exact: true })).toBeVisible();

    await expect(instance.readouts).toHaveCount(3);

    await expect(instance.readoutItem("Uptime")).toContainText(
      /\d+d\s+\d+h\s+\d+m\s+\d+s/
    );
    await expect(instance.readoutItem("Avg. Response Time")).toContainText(
      /ms|—|-/
    );
    await expect(instance.readoutItem("Error Rate")).toContainText("%");
    await expect(instance.chart("Requests Per Second")).toBeVisible();
  });

  test("routes table functionality", async ({ page }) => {
    await instance.tab("Routes").click();

    await expect(instance.dataRows.first()).toBeVisible();
    // No chart is mounted until a row is expanded.
    await expect(instance.charts).toHaveCount(0);

    await instance.dataRows.last().click();
    await expect(instance.charts).toHaveCount(1);

    // Search keeps at least one row, clearing restores rows.
    await instance.routesSearch.fill("r");
    await expect(instance.dataRows.first()).toBeVisible();
    await instance.routesSearch.fill("");
    await expect(instance.dataRows.first()).toBeVisible();

    // Sort by Requests (direction-agnostic: detect, then verify toggle).
    await instance.chooseFromSelect("Sort", "Requests");
    let dir: "asc" | "desc" = "asc";
    await expect
      .poll(async () => {
        const vals = (await instance.routeRequests.allInnerTexts()).map(
          parseNum
        );
        if (isSorted(vals, "asc")) {
          dir = "asc";
          return true;
        }
        if (isSorted(vals, "desc")) {
          dir = "desc";
          return true;
        }
        return false;
      })
      .toBe(true);

    await instance.chooseFromSelect("Sort", "Requests");
    const opposite = dir === "asc" ? "desc" : "asc";
    await expect
      .poll(async () =>
        isSorted(
          (await instance.routeRequests.allInnerTexts()).map(parseNum),
          opposite
        )
      )
      .toBe(true);
  });

  test("explorer functionality", async () => {
    // Let the summary (and its metrics fetch) settle before leaving it.
    await expect(instance.readouts.first()).toBeVisible();
    await instance.tab("Explorer").click();

    // No graph until a metric is selected.
    await expect(instance.charts).toHaveCount(0);

    await expect(instance.inspectorItems.first()).toBeVisible();
    const firstItem = (
      await instance.inspectorItems.first().innerText()
    ).trim();

    await instance.inspectorItems.first().click();
    await expect(instance.charts).toHaveCount(1);
    await expect(instance.chart(firstItem)).toBeVisible();

    // Searching narrows the list to matching metrics.
    await instance.inspectorSearch.fill(firstItem);
    await expect
      .poll(async () => {
        const texts = await instance.inspectorItems.allInnerTexts();
        return (
          texts.length > 0 &&
          texts.every((t) => t.toLowerCase().includes(firstItem.toLowerCase()))
        );
      })
      .toBe(true);

    await instance.inspectorSearch.fill("bananagrams");
    await expect(instance.inspectorItems).toHaveCount(0);
    await instance.inspectorSearch.fill("");

    // "Hide static" forces "hide zero" checked and disabled.
    await instance.hideZero.click();
    await instance.hideZero.click();
    await instance.hideStatic.click();
    await expect(instance.hideZero).toBeChecked();
    await expect(instance.hideZero).toBeDisabled();
    await instance.hideStatic.click();
    await expect(instance.hideZero).not.toBeChecked();
  });
});
