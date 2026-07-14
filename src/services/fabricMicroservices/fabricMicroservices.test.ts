// Note: Outside of src directory, so module directory import not possible
import { staticServices } from "../../../json-mock/discovery-service/staticData";
import { fetchFabricMicroservices } from "./fabricMicroservices";

// The function under test only reads response.ok and response.json(), so a stub
// Response-shaped object is enough.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

describe("Fabric Microservices Module ", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // test with static array of mock services
  it("fetches services from the discovery service and maps them with a key of name", () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(staticServices)
    } as Response);
    return fetchFabricMicroservices("server").then((result) => {
      expect(fetch).toHaveBeenCalledWith("server/services");
      return expect(result).toMatchObject({
        "export-team-gateway-up2-management-message-resource-measurement-v1": {
          authorized: true,
          capability: "Crime Fighting",
          documentation: "https://www.google.com",
          instances: [
            {
              name: "ee0fa3669fea7e9a0adea649c46bca56",
              start_time: 1508854912461
            },
            {
              name: "8bedb4551e801f38bf149001a72a1127",
              start_time: 1508370483156
            },
            {
              name: "d9de3a9c26c6c84daaf1ceb40559d659",
              start_time: 1508170483156
            }
          ],
          maximum: 0,
          metered: true,
          minimum: 2,
          name: "Export Team Gateway Up2 Management Message Resource Measurement",
          owner: "Virtual",
          runtime: "GO",
          slug: "export-team-gateway-up2-management-message-resource-measurement-v1",
          threaded: true,
          version: "1"
        },
        "internet-option-v3-6": {
          authorized: true,
          capability: "Crime Fighting",
          documentation: "https://www.google.com",
          instances: [
            {
              name: "ee0fa3669fea7e9a0adea649c46bca56",
              start_time: 1508854912461
            },
            {
              name: "8bedb4551e801f38bf149001a72a1127",
              start_time: 1508370483156
            },
            {
              name: "d9de3a9c26c6c84daaf1ceb40559d659",
              start_time: 1508170483156
            }
          ],
          maximum: 4,
          metered: true,
          minimum: 5,
          name: "Internet Option",
          owner: "Sequential",
          runtime: "GO",
          slug: "internet-option-v3-6",
          threaded: true,
          version: "3.6"
        },
        "up2-message-network-team-entry-job-transmission-end-v4-7": {
          authorized: true,
          capability: "Crime Fighting",
          documentation: "https://www.google.com",
          instances: [
            {
              name: "ee0fa3669fea7e9a0adea649c46bca56",
              start_time: 1508854912461
            },
            {
              name: "8bedb4551e801f38bf149001a72a1127",
              start_time: 1508370483156
            },
            {
              name: "d9de3a9c26c6c84daaf1ceb40559d659",
              start_time: 1508170483156
            }
          ],
          maximum: 0,
          metered: true,
          minimum: 3,
          name: "Up2 Message Network Team Entry Job Transmission End",
          owner: "Internet",
          runtime: "GO",
          slug: "up2-message-network-team-entry-job-transmission-end-v4-7",
          threaded: true,
          version: "4.7"
        }
      });
    });
  });
  it("rejects without calling fetch when no fabricServer is given", () => {
    return expect(fetchFabricMicroservices("")).rejects.toMatch(
      "Invalid endpoint"
    );
  });

  it("rejects when the discovery service responds with a non-2xx status", () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({})
    } as Response);
    return expect(fetchFabricMicroservices("server")).rejects.toMatch(
      "Request failed with status 500"
    );
  });
});
