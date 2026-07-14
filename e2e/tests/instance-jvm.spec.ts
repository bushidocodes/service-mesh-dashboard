import { expect, test } from "@playwright/test";
import { fetchServices, pickByRuntime, serviceSlug } from "../helpers/sds";
import InstancePage from "../pages/instance.page";

/** Ported from e2e-tests/tests/instance-view-jvm.js */
test.describe("Instance View: JVM", () => {
  test("JVM instance layout, summary, threads and dashboards", async ({
    page,
    request
  }) => {
    const services = await fetchServices(request);
    const svc = pickByRuntime(services, "JVM");
    expect(svc, "no metered JVM service in mock data").toBeTruthy();

    const instance = new InstancePage(page);
    await instance.goto(serviceSlug(svc!), svc!.instances[0].name);

    // Seven tabs: Summary, Routes, Threads, Explorer + HTTP/JVM/Finagle.
    await expect(instance.navTabs).toHaveCount(7);

    // JVM-specific summary readout.
    await expect(instance.readoutItem("Host CPU Cores")).toBeVisible();
    await expect(instance.readoutItem("Host CPU Cores")).toContainText(/\d/);

    // --- Threads ---
    await instance.tab("Threads").click();
    await expect(instance.threadRows.first()).toBeVisible();
    const rowCount = await instance.threadRows.count();
    const tabCount = parseInt(
      (await instance.tab("Threads").locator("dd").innerText()).replace(
        /[^0-9]/g,
        ""
      ),
      10
    );
    expect(rowCount).toBe(tabCount);

    // Expanding a thread row reveals exactly one stack trace (drawers are not
    // mounted until opened).
    await instance.threadRows.first().click();
    await expect(instance.stackTraces).toHaveCount(1);

    // --- HTTP dashboard: 4 grid items, 2 charts ---
    await instance.tab("HTTP").click();
    await expect(instance.gridItems).toHaveCount(4);
    await expect(instance.charts).toHaveCount(2);
    for (const title of [
      "Connections",
      "Data Transfer Rates",
      "Requests",
      "Response Status Codes"
    ]) {
      await expect(
        instance.gridItems.filter({ hasText: title }).first()
      ).toBeVisible();
    }

    // --- JVM dashboard: 2 grid items, 2 charts ---
    await instance.tab("JVM").click();
    await expect(instance.gridItems).toHaveCount(2);
    await expect(instance.charts).toHaveCount(2);
    await expect(instance.gridItems.filter({ hasText: "Heap" })).toBeVisible();
    await expect(
      instance.gridItems.filter({ hasText: "Classes" })
    ).toBeVisible();

    // --- Finagle dashboard: 4 grid items ---
    await instance.tab("Finagle").click();
    await expect(instance.gridItems).toHaveCount(4);
    for (const title of [
      "Timer Deviation",
      "Pending Timer Tasks",
      "Future Pool",
      "Client Registry"
    ]) {
      await expect(
        instance.gridItems.filter({ hasText: title }).first()
      ).toBeVisible();
    }
  });
});
