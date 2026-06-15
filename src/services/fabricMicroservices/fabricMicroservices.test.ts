import axios from "axios";
import { fetchFabricMicroservices } from "./fabricMicroservices";

// Note: Outside of src directory, so module directory import not possible
import { staticServices } from "../../../json-mock/discovery-service/staticData";

// axios v1 dropped support for moxios (an unmaintained axios-0.x adapter
// shim). Mock axios.get directly instead — the function under test only
// reads response.data, so resolving { data } reproduces moxios's stub.
jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn() }
}));

describe("Fabric Microservices Module ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test with static array of mock services
  it("fetches services from the discovery service and maps them with a key of name", () => {
    jest.mocked(axios.get).mockResolvedValue({ data: staticServices });
    return fetchFabricMicroservices("server").then((result) => {
      expect(axios.get).toHaveBeenCalledWith("server/services", {
        responseType: "json"
      });
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
  // TODO: restore this test once moxios/axios mocking is updated
  test.todo("fetches metrics from a microservice via the discovery service");
});
