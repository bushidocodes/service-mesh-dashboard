import { fetchInstanceThreads } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import threads from "../../../../json-mock/jvm/threads.json";

// fetchInstanceThreads only reads response.ok and response.json(), so a stub
// Response-shaped object is enough.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("fetchInstanceThreads", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches a threads endpoint and returns a promise which resolves to the result", () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(threads)
    } as Response);
    return fetchInstanceThreads("/admin/threads").then((result) => {
      expect(fetch).toHaveBeenCalledWith("/admin/threads");
      expect(result).toMatchObject(threads);
    });
  });

  it("rejects when the body isn't valid JSON (e.g. an HTML error page)", () => {
    // A real Response.json() rejects with a SyntaxError on a non-JSON body;
    // the function should surface its own message rather than the SyntaxError.
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON"))
    } as Response);
    return expect(fetchInstanceThreads("/admin/threads2")).rejects.toMatch(
      "The data object didn't contain JSON as expected"
    );
  });

  it("rejects when the body is valid JSON but not an object", () => {
    // response.json() resolves any JSON value; a threads payload must be an
    // object, so scalars and null are rejected too.
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null)
    } as Response);
    return expect(fetchInstanceThreads("/admin/threads3")).rejects.toMatch(
      "The data object didn't contain JSON as expected"
    );
  });
});
