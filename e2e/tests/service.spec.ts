import { expect, test } from "@playwright/test";
import { fetchServices, type MockService, serviceSlug } from "../helpers/sds";
import parseUptimeSeconds from "../helpers/uptime";
import ServicePage from "../pages/service.page";

/**
 * Ported from e2e-tests/tests/service-view.js
 * ("Service View Sorting and Filtering").
 *
 * The old test clicked through stable services until it found one with >=2
 * instances. Here we fetch the live service list, pick the service with the
 * most instances, and navigate straight to its computed slug — deterministic
 * and far faster than UI hunting.
 */

const isSorted = (nums: number[], dir: "asc" | "desc") =>
  nums.every((n, i) =>
    i === 0 ? true : dir === "asc" ? nums[i - 1] <= n : nums[i - 1] >= n
  );

const isSortedStr = (strs: string[], dir: "asc" | "desc") =>
  strs.every((s, i) =>
    i === 0 ? true : dir === "asc" ? strs[i - 1] <= s : strs[i - 1] >= s
  );

test.describe("Service View", () => {
  test("instance search and sorting", async ({ page, request }) => {
    const services = await fetchServices(request);

    // Pick the service with the most instances (need at least two).
    const target = services
      .filter((s) => s.instances && s.instances.length >= 2)
      .sort((a, b) => b.instances.length - a.instances.length)[0] as
      | MockService
      | undefined;
    expect(target, "no service with >=2 instances in mock data").toBeTruthy();
    const svc = target!;

    const service = new ServicePage(page);
    await service.goto(serviceSlug(svc));

    // All instances render as rows.
    await expect(service.rows).toHaveCount(svc.instances.length);
    const initialCount = svc.instances.length;

    // --- Search ---
    const firstId = svc.instances[0].name;
    await service.searchInput.fill(firstId);
    await expect(service.rows).toHaveCount(1);
    expect((await service.idTexts())[0]).toBe(firstId);

    await service.searchInput.fill("");
    await expect(service.rows).toHaveCount(initialCount);

    await service.searchInput.fill("bananagrams");
    await expect(service.rows).toHaveCount(0);

    await service.searchInput.fill("");
    await expect(service.rows).toHaveCount(initialCount);

    // --- Sort by Uptime (toggles direction on re-select) ---
    await service.chooseFromSelect("Sort", "Uptime");
    let uptimeDirFirst: "asc" | "desc" = "asc";
    await expect
      .poll(async () => {
        const u = (await service.uptimeTexts()).map(parseUptimeSeconds);
        if (isSorted(u, "asc")) {
          uptimeDirFirst = "asc";
          return true;
        }
        if (isSorted(u, "desc")) {
          uptimeDirFirst = "desc";
          return true;
        }
        return false;
      })
      .toBe(true);

    // Re-selecting toggles the sort direction.
    await service.chooseFromSelect("Sort", "Uptime");
    const uptimeDirSecond = uptimeDirFirst === "asc" ? "desc" : "asc";
    await expect
      .poll(async () =>
        isSorted(
          (await service.uptimeTexts()).map(parseUptimeSeconds),
          uptimeDirSecond
        )
      )
      .toBe(true);

    // --- Sort by Name/ID (direction-agnostic: the ascending flag carries over
    // from the previous sort, so detect the settled direction, then verify the
    // re-select toggles it). ---
    await service.chooseFromSelect("Sort", "Name");
    let nameDirFirst: "asc" | "desc" = "asc";
    await expect
      .poll(async () => {
        const ids = await service.idTexts();
        if (isSortedStr(ids, "asc")) {
          nameDirFirst = "asc";
          return true;
        }
        if (isSortedStr(ids, "desc")) {
          nameDirFirst = "desc";
          return true;
        }
        return false;
      })
      .toBe(true);

    await service.chooseFromSelect("Sort", "Name");
    const nameDirSecond = nameDirFirst === "asc" ? "desc" : "asc";
    await expect
      .poll(async () => isSortedStr(await service.idTexts(), nameDirSecond))
      .toBe(true);
  });
});
