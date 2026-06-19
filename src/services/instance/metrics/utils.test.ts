import {
  buildDiscoveryServiceInstanceMetricsEndpoint,
  clearInstanceMetricsPollingIntervalIfNeeded
} from "./utils";

import mockstate from "json/mockReduxState";

const mockGetState = vi.fn(() => mockstate);

vi.mock("store/jumpstate", () => ({
  getState: (...args: unknown[]) =>
    (mockGetState as (...a: unknown[]) => unknown)(...args)
}));

vi.mock("utils/head", () => {
  return { getFabricServer: () => "http://localhost:1337" };
});

describe("buildDiscoveryServiceInstanceMetricsEndpoint", () => {
  beforeEach(() => {
    mockGetState.mockReturnValue(mockstate);
  });

  test("builds a discovery service instance metrics endpoint", () => {
    expect(buildDiscoveryServiceInstanceMetricsEndpoint()).toBe(
      "http://localhost:1337/metrics/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3/2smao7xwboy0000000000"
    );
  });

  test("returns null when selectedServiceSlug is null", () => {
    mockGetState.mockReturnValue({
      ...mockstate,
      fabric: {
        ...mockstate.fabric,
        selectedServiceSlug: null as unknown as string
      }
    });
    expect(buildDiscoveryServiceInstanceMetricsEndpoint()).toBeNull();
  });

  test("returns null when selectedServiceSlug is not in services", () => {
    mockGetState.mockReturnValue({
      ...mockstate,
      fabric: {
        ...mockstate.fabric,
        selectedServiceSlug: "slug-not-yet-in-services"
      }
    });
    expect(buildDiscoveryServiceInstanceMetricsEndpoint()).toBeNull();
  });
});

describe("clearInstanceMetricsPollingIntervalIfNeeded", () => {
  test("clears the interval with the ID stored at window.refreshInstanceMetricsPollingInterval", () => {
    // set window.refreshInstanceMetricsPollingInterval
    window.refreshInstanceMetricsPollingInterval = setInterval(() => {}, 10);
    // make sure that it's on the window object
    expect(window).toHaveProperty("refreshInstanceMetricsPollingInterval");
    // call clearInstanceMetricsPollingIntervalIfNeeded()
    // and expect it to be null
    clearInstanceMetricsPollingIntervalIfNeeded();
    expect(window.refreshInstanceMetricsPollingInterval).toBeNull();
  });
});
