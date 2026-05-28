import axios from "axios";
import { fetchInstanceMetrics } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import metrics from "../../../../json-mock/jvm/metrics";

// axios v1 dropped moxios support; mock axios.get directly. fetchInstanceMetrics
// only reads response.data, so resolving { data } reproduces moxios's stub.
jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn() }
}));

describe("fetchInstanceMetrics", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches a metrics endpoint and returns a promise which resolves to the result", () => {
    axios.get.mockResolvedValue({ data: metrics });
    return fetchInstanceMetrics("/admin/metrics.json").then((json) => {
      expect(axios.get).toHaveBeenCalledWith("/admin/metrics.json", {
        responseType: "json"
      });
      expect(json).toMatchObject(metrics);
    });
  });
});
