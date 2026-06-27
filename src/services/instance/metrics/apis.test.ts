import { fetchInstanceMetrics } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import metrics from "../../../../json-mock/jvm/metrics.json";

// fetchInstanceMetrics only reads response.ok and response.json(), so a stub
// Response-shaped object is enough.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("fetchInstanceMetrics", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches a metrics endpoint and returns a promise which resolves to the result", () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(metrics)
    } as Response);
    return fetchInstanceMetrics("/admin/metrics.json").then((json) => {
      expect(fetch).toHaveBeenCalledWith("/admin/metrics.json");
      expect(json).toMatchObject(metrics);
    });
  });
});
