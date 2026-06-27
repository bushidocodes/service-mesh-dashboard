import { test, expect } from "@playwright/test";
import InstancePage from "../pages/instance.page";
import { fetchServices, pickByRuntime, serviceSlug } from "../helpers/sds";

/** Ported from e2e-tests/tests/instance-view-go.js */
test.describe("Instance View: Go", () => {
  test("Go instance layout, summary and Go dashboard", async ({
    page,
    request
  }) => {
    const services = await fetchServices(request);
    const svc = pickByRuntime(services, "GO");
    expect(svc, "no metered Go service in mock data").toBeTruthy();

    const instance = new InstancePage(page);
    await instance.goto(serviceSlug(svc!), svc!.instances[0].name);

    // Five tabs: Summary, Routes, Functions, Explorer + the Go dashboard.
    await expect(instance.navTabs).toHaveCount(5);

    // Go-specific summary readouts.
    await expect(instance.readoutItem("Host CPU Utilized")).toBeVisible();
    await expect(instance.readoutItem("Memory Utilized")).toBeVisible();
    await expect(instance.readoutItem("Host CPU Utilized")).toContainText("%");

    // Go dashboard view → two grid items titled Heap and Goroutines.
    await instance.tab("Go").click();
    await expect(instance.gridItems).toHaveCount(2);
    await expect(instance.gridItems.nth(0)).toContainText("Heap");
    await expect(instance.gridItems.nth(1)).toContainText("Goroutines");
  });
});
