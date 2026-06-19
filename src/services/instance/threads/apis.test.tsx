import axios from "axios";
import { fetchInstanceThreads } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import threads from "../../../../json-mock/jvm/threads.json";

// axios v1 dropped moxios support; mock axios.get directly. fetchInstanceThreads
// only reads response.data, so resolving { data } reproduces moxios's stub.
vi.mock("axios", () => ({
  __esModule: true,
  default: { get: vi.fn() }
}));

describe("fetchInstanceThreads", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a threads endpoint and returns a promise which resolves to the result", () => {
    vi.mocked(axios.get).mockResolvedValue({ data: threads });
    return fetchInstanceThreads("/admin/threads").then((result) => {
      expect(axios.get).toHaveBeenCalledWith("/admin/threads", {
        responseType: "json"
      });
      expect(result).toMatchObject(threads);
    });
  });

  it("rejects when the request didn't return JSON as expected", () => {
    // A non-object body (e.g. an HTML error page) should be rejected.
    vi.mocked(axios.get).mockResolvedValue({
      data: '<!DOCTYPE html><html lang="en"><body></body></html>'
    });
    return expect(fetchInstanceThreads("/admin/threads2")).rejects.toMatch(
      "The data object didn't contain JSON as expected"
    );
  });
});
