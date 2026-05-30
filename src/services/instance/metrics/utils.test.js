import {
  buildDiscoveryServiceInstanceMetricsEndpoint,
  clearInstanceMetricsPollingIntervalIfNeeded
} from "./utils";

import mockstate from "json/mockReduxState";

jest.mock("store/jumpstate", () => {
  return {
    getState: () => mockstate
  };
});

jest.mock("utils/head", () => {
  return { getFabricServer: () => "http://localhost:1337" };
});

describe("buildDiscoveryServiceInstanceMetricsEndpoint", () => {
  test("builds a discovery service instance metrics endpoint", () => {
    expect(buildDiscoveryServiceInstanceMetricsEndpoint()).toBe(
      "http://localhost:1337/metrics/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3/2smao7xwboy0000000000"
    );
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
