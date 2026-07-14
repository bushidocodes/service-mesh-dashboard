import mockstate from "json/mockReduxState";
import type { RootState } from "types";
import {
  buildDiscoveryServiceInstanceMetricsEndpoint,
  clearInstanceMetricsPollingIntervalIfNeeded
} from "./utils";

vi.mock("utils/head", () => {
  return { getFabricServer: () => "http://localhost:1337" };
});

describe("buildDiscoveryServiceInstanceMetricsEndpoint", () => {
  test("builds a discovery service instance metrics endpoint", () => {
    expect(
      buildDiscoveryServiceInstanceMetricsEndpoint(
        mockstate as unknown as RootState
      )
    ).toBe(
      "http://localhost:1337/metrics/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3/2smao7xwboy0000000000"
    );
  });

  test("returns null when selectedServiceSlug is null", () => {
    const state = {
      ...mockstate,
      fabric: {
        ...mockstate.fabric,
        selectedServiceSlug: null as unknown as string
      }
    } as unknown as RootState;
    expect(buildDiscoveryServiceInstanceMetricsEndpoint(state)).toBeNull();
  });

  test("returns null when selectedServiceSlug is not in services", () => {
    const state = {
      ...mockstate,
      fabric: {
        ...mockstate.fabric,
        selectedServiceSlug: "slug-not-yet-in-services"
      }
    } as unknown as RootState;
    expect(buildDiscoveryServiceInstanceMetricsEndpoint(state)).toBeNull();
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
