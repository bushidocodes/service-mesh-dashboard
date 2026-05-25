import moxios from "moxios";
import { fetchInstanceMetrics } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import metrics from "../../../../json-mock/jvm/metrics";

describe("App", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("fetches a metrics endpoint and returns a promise which resolves to the result", (done) => {
    moxios.stubRequest("/admin/metrics.json", {
      status: 200,
      response: metrics
    });
    fetchInstanceMetrics("/admin/metrics.json", "JVM")
      .then((json) => expect(json).toMatchObject(metrics))
      .then(() => done());
  });
});
