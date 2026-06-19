import axios from "axios";
import { fetchInstanceMetrics } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import metrics from "../../../../json-mock/jvm/metrics.json";

// axios v1 dropped moxios support; mock axios.get directly. fetchInstanceMetrics
// only reads response.data, so resolving { data } reproduces moxios's stub.
vi.mock("axios", () => ({
  __esModule: true,
  default: { get: vi.fn() }
}));

describe("fetchInstanceMetrics", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a metrics endpoint and returns a promise which resolves to the result", () => {
    vi.mocked(axios.get).mockResolvedValue({ data: metrics });
    return fetchInstanceMetrics("/admin/metrics.json").then((json) => {
      expect(axios.get).toHaveBeenCalledWith("/admin/metrics.json", {
        responseType: "json"
      });
      expect(json).toMatchObject(metrics);
    });
  });
});
