import moxios from "moxios";
import { fetchInstanceThreads } from "./apis";

// Note: Outside of src directory, so module directory import not possible
import threads from "../../../../json-mock/jvm/threads";

describe("App", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("fetches a threads endpoint and returns a promise which resolves to the result", (done) => {
    moxios.stubRequest("/admin/threads", {
      status: 200,
      response: threads
    });
    fetchInstanceThreads("/admin/threads")
      .then((result) => expect(result).toMatchObject(threads))
      .then(() => done());
  });
  it("fetches a threads endpoint and returns a promise which resolves to a rejection when the request didn't return JSON as expected", () => {
    moxios.stubRequest("/admin/threads2", {
      status: 200,
      response: '<!DOCTYPE html><html lang="en"><body></body></html>'
    });
    expect(fetchInstanceThreads("/admin/threads2")).rejects.toMatch(
      "The data object didn't contain JSON as expected"
    );
  });
});
