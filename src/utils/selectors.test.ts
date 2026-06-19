import state from "../json/mockReduxState";

import {
  getRoutesMetrics,
  getRoutesTree,
  metricsKeySelectorGenerator,
  getDashboards,
  getMetrics,
  getServices,
  getFabricServer,
  getSelectedInstanceID,
  getSelectedService,
  getSelectedServiceSlug,
  getStatusCount,
  getRuntime
} from "./selectors";

const simpleState = {
  instance: {
    metrics: {
      "fake/wacky_system": {
        1511370076883: 2
      },
      "system/cpu_cores": {
        1511370076883: 2
      }
    }
  }
};

describe("getMetrics", () => {
  test("takes a state object and returns state.instance.metrics", () => {
    expect(getMetrics(state)).toEqual(state.instance.metrics);
  });
});

describe("getDashboards", () => {
  test("takes a state object and returns state.dashboards", () => {
    expect(getDashboards(state)).toEqual(state.dashboards);
  });
});

describe("getServices", () => {
  test("takes a state object and returns state.fabric.services", () => {
    expect(getServices(state)).toEqual(state.fabric.services);
  });
});

describe("getFabricServer", () => {
  test("takes a state object and returns state.settings.fabricServer", () => {
    expect(getFabricServer(state)).toEqual(state.settings.fabricServer);
  });
});

describe("getSelectedInstanceID", () => {
  test("takes a state object and returns state.fabric.selectedInstanceID", () => {
    expect(getSelectedInstanceID(state)).toEqual(
      state.fabric.selectedInstanceID
    );
  });
});

describe("getSelectedServiceSlug", () => {
  test("takes a state object and returns state.fabric.selectedService", () => {
    expect(getSelectedServiceSlug(state)).toEqual(
      state.fabric.selectedServiceSlug
    );
  });
});

describe("getSelectedService", () => {
  test("returns the current selected service from the Redux store if it is found and null if not found", () => {
    expect(getSelectedService(state)).toMatchObject(
      state.fabric.services[
        "authentication-statistics-file-resource-network-export-icpf-mail-domain-end-v4-3"
      ]
    );
    // create a modified state where fabric.selectedService, fabric.selectedServiceVersion,
    // and fabric.selectedInstanceID are not defined
    let modState = Object.assign({}, state, {
      fabric: {
        fabricPollingInterval: 10000,
        isPollingFabric: true,
        services: {}
      }
    });
    expect(getSelectedService(modState)).toBeNull();
  });
});

describe("getRuntime", () => {
  test("returns the runtime attribute of the currently selected serviceif there is a selected service", () => {
    expect(getRuntime(state)).toEqual("GO");
  });

  test("returns null if  there is no selected service", () => {
    // create a modified state where fabric.selectedService, fabric.selectedServiceVersion,
    // and fabric.selectedInstanceID are not defined
    let modState = Object.assign({}, state, {
      fabric: {
        fabricPollingInterval: 10000,
        isPollingFabric: true,
        services: {}
      }
    });
    expect(getRuntime(modState)).toBeNull();
  });
});

// NOTE: the former `generateHeaderTabs` selector was removed; tab generation now
// lives in InstanceHeaderContent.renderTabs() and is covered by that component's
// test suite. The disabled selector tests that targeted it have been deleted.

describe("metricsKeySelectorGenerator", () => {
  test("returns a Reselect selector", () => {
    // keyQuery is irrelevant here — we only assert the shape of the returned
    // selector. (Previously this called with no args; that compiled only because
    // jest.requireActual typed the module as `any`. The real signature requires
    // keyQuery, so pass one.)
    expect(metricsKeySelectorGenerator("system")).toHaveProperty("resultFunc");
    expect(metricsKeySelectorGenerator("system")).toHaveProperty(
      "recomputations"
    );
    expect(metricsKeySelectorGenerator("system")).toHaveProperty(
      "resetRecomputations"
    );
  });
  test("returns all keys strictly matching a prefix when isPrefix is true", () => {
    expect(metricsKeySelectorGenerator("system")(simpleState)).toEqual({
      "system/cpu_cores": { 1511370076883: 2 }
    });
  });
  test("returns all keys loosely containing a string when isPrefix is false", () => {
    expect(metricsKeySelectorGenerator("system", false)(simpleState)).toEqual({
      "fake/wacky_system": { 1511370076883: 2 },
      "system/cpu_cores": { 1511370076883: 2 }
    });
  });
});

describe("getRouteMetrics", () =>
  test("returns an object of the metrics that have a key containing the string `route`", () => {
    expect(getRoutesMetrics(state)).toEqual({
      "route/functionalroles/GET/errors.count": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/functionalroles/GET/in_throughput": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/functionalroles/GET/latency_ms.avg": {
        1500416014314: 1.205696,
        1500416029215: 1.205696,
        1500416044215: 1.205696,
        1500416059217: 1.205696,
        1500416074215: 1.205696,
        1500416089215: 1.205696,
        1500416104216: 1.205696,
        1500416119215: 1.205696,
        1500416134216: 1.205696
      },
      "route/functionalroles/GET/latency_ms.count": {
        1500416014314: 316,
        1500416029215: 316,
        1500416044215: 316,
        1500416059217: 316,
        1500416074215: 316,
        1500416089215: 316,
        1500416104216: 316,
        1500416119215: 316,
        1500416134216: 316
      },
      "route/functionalroles/GET/latency_ms.max": {
        1500416014314: 17,
        1500416029215: 17,
        1500416044215: 17,
        1500416059217: 17,
        1500416074215: 17,
        1500416089215: 17,
        1500416104216: 17,
        1500416119215: 17,
        1500416134216: 17
      },
      "route/functionalroles/GET/latency_ms.min": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/functionalroles/GET/latency_ms.p50": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/functionalroles/GET/latency_ms.p90": {
        1500416014314: 3,
        1500416029215: 3,
        1500416044215: 3,
        1500416059217: 3,
        1500416074215: 3,
        1500416089215: 3,
        1500416104216: 3,
        1500416119215: 3,
        1500416134216: 3
      },
      "route/functionalroles/GET/latency_ms.p95": {
        1500416014314: 5,
        1500416029215: 5,
        1500416044215: 5,
        1500416059217: 5,
        1500416074215: 5,
        1500416089215: 5,
        1500416104216: 5,
        1500416119215: 5,
        1500416134216: 5
      },
      "route/functionalroles/GET/latency_ms.p99": {
        1500416014314: 9,
        1500416029215: 9,
        1500416044215: 9,
        1500416059217: 9,
        1500416074215: 9,
        1500416089215: 9,
        1500416104216: 9,
        1500416119215: 9,
        1500416134216: 9
      },
      "route/functionalroles/GET/latency_ms.p9990": {
        1500416014314: 17,
        1500416029215: 17,
        1500416044215: 17,
        1500416059217: 17,
        1500416074215: 17,
        1500416089215: 17,
        1500416104216: 17,
        1500416119215: 17,
        1500416134216: 17
      },
      "route/functionalroles/GET/latency_ms.p9999": {
        1500416014314: 17,
        1500416029215: 17,
        1500416044215: 17,
        1500416059217: 17,
        1500416074215: 17,
        1500416089215: 17,
        1500416104216: 17,
        1500416119215: 17,
        1500416134216: 17
      },
      "route/functionalroles/GET/latency_ms.sum": {
        1500416014314: 381,
        1500416029215: 381,
        1500416044215: 381,
        1500416059217: 381,
        1500416074215: 381,
        1500416089215: 381,
        1500416104216: 381,
        1500416119215: 381,
        1500416134216: 381
      },
      "route/functionalroles/GET/out_throughput": {
        1500416014314: 1580,
        1500416029215: 1580,
        1500416044215: 1580,
        1500416059217: 1580,
        1500416074215: 1580,
        1500416089215: 1580,
        1500416104216: 1580,
        1500416119215: 1580,
        1500416134216: 1580
      },
      "route/functionalroles/GET/requests": {
        1500416014314: 17725,
        1500416029215: 17725,
        1500416044215: 17725,
        1500416059217: 17725,
        1500416074215: 17725,
        1500416089215: 17725,
        1500416104216: 17725,
        1500416119215: 17725,
        1500416134216: 17725
      },
      "route/ping/GET/requests": {
        1500416014314: 1,
        1500416029215: 1,
        1500416044215: 1,
        1500416059217: 1,
        1500416074215: 1,
        1500416089215: 1,
        1500416104216: 1,
        1500416119215: 1,
        1500416134216: 1
      },
      "route/ping/GET/response_size.count": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/ping/GET/status/200": {
        1500416014314: 1,
        1500416029215: 1,
        1500416044215: 1,
        1500416059217: 1,
        1500416074215: 1,
        1500416089215: 1,
        1500416104216: 1,
        1500416119215: 1,
        1500416134216: 1
      },
      "route/ping/GET/status/2XX": {
        1500416014314: 1,
        1500416029215: 1,
        1500416044215: 1,
        1500416059217: 1,
        1500416074215: 1,
        1500416089215: 1,
        1500416104216: 1,
        1500416119215: 1,
        1500416134216: 1
      },
      "route/ping/GET/time.count": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/ping/GET/time/200.count": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      },
      "route/ping/GET/time/2XX.count": {
        1500416014314: 0,
        1500416029215: 0,
        1500416044215: 0,
        1500416059217: 0,
        1500416074215: 0,
        1500416089215: 0,
        1500416104216: 0,
        1500416119215: 0,
        1500416134216: 0
      }
    });
  }));

describe("getRoutesTree", () =>
  test("returns a hierarchical representation of the keys nested under their corresponding routes and HTTP verbs", () => {
    expect(getRoutesTree(state)).toEqual({
      "/functionalroles": ["GET"],
      "/ping": ["GET"]
    });
  }));

describe("getStatusCount", () => {
  test("takes an array of service objects and returns an object with a count for each status", () => {
    expect(getStatusCount(state)).toMatchObject({ Warning: 3, total: 3 });
  });
});
