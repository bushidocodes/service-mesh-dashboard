import { createSelector } from "reselect";
import _ from "lodash";

import { getLatestAttribute } from "../latestAttribute";
import { getRoutesTree, getRoutesMetrics } from "../selectors";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "../dygraphs";
import { getSparkLineOfNetChange } from "../sparklines";
import { calculateErrorPercent } from "utils";
import { metricsKeySelectorGenerator } from "utils/selectors";

/**
 * A reselect selector that builds the data required to render the RoutesTable component
 */
export const getRoutesTable = createSelector(
  [getRoutesTree, getRoutesMetrics],
  (routesTree, routesMetrics) => {
    // Now build the table
    const routesTable = [];
    const routesPaths = Object.keys(routesTree);
    routesPaths.forEach((routePath) => {
      let baseObj = { route: routePath };
      routesTree[routePath].forEach((routeVerb) => {
        const errorsCountKey = `route${routePath}/${routeVerb}/errors.count`;
        const inThroughputKey = `route${routePath}/${routeVerb}/in_throughput`;
        const outThroughputKey = `route${routePath}/${routeVerb}/out_throughput`;
        const latency50Key = `route${routePath}/${routeVerb}/latency_ms.p50`;
        const latency99Key = `route${routePath}/${routeVerb}/latency_ms.p99`;
        const requestsKey = `route${routePath}/${routeVerb}/requests`;

        const errorsCount = getLatestAttribute(routesMetrics, errorsCountKey);
        const requests = getLatestAttribute(routesMetrics, requestsKey);
        // force three decimal points at all times and return language sensitive representation of number (commas and periods)
        const errorPercent = calculateErrorPercent(requests, errorsCount);
        const inThroughput = getLatestAttribute(routesMetrics, inThroughputKey);
        const outThroughput = getLatestAttribute(
          routesMetrics,
          outThroughputKey
        );
        const latency50 = getLatestAttribute(routesMetrics, latency50Key);
        const latency99 = getLatestAttribute(routesMetrics, latency99Key);
        const requestsPerSecond_dygraph = mapDygraphKeysToNetChange(
          getDygraphOfValue(routesMetrics, [requestsKey])
        );
        const requestsPerSecond_sparkline = getSparkLineOfNetChange(
          routesMetrics,
          requestsKey
        );
        routesTable.push({
          ...baseObj,
          verb: routeVerb,
          errorsCount,
          errorPercent,
          inThroughput,
          outThroughput,
          latency50,
          latency99,
          requests,
          requestsPerSecond_dygraph,
          requestsPerSecond_sparkline
        });
      });
    });
    return routesTable;
  }
);

/**
 * A Reselect selector that filters the metrics and only returns the timeseries
 * that contain the string 'functions' somewhere in the key.
 */
export const getFunctionsMetrics = metricsKeySelectorGenerator("function");

/**
 * A Reselect selector that generates a special hierarchical tree structure of route data
 * from the timeseries keys. It's used to render the special Route dashboards for the JVM
 */
export const getFunctionsList = createSelector(
  getFunctionsMetrics,
  (functionsMetrics) => _getFunctionsList(functionsMetrics)
);

/**
 * Takes an object filtered to only have keys with "function" and returns an array of strings of function names
 * Extracts functionName from the structure function/functionName/some/other/values
 * @param {any} functionsMetrics
 * @returns
 */
function _getFunctionsList(functionsMetrics) {
  const keys = Object.keys(functionsMetrics);
  if (keys.length > 0) {
    // Grab the function name from the key, filter for uniqueness, and exclude "all" (the rollup metrics key)
    return _.without(
      _.uniq(keys.map((key) => key.match(/function\/(.*)\/.*/)[1])),
      "all"
    );
  } else {
    return [];
  }
}

export const getFunctionsTable = createSelector(
  [getFunctionsList, getFunctionsMetrics],
  (functions, functionsMetrics) =>
    _getFunctionsTable(functions, functionsMetrics)
);

function _getFunctionsTable(funcs, funcMetrics) {
  const labelKeyPairs = [
    ["errorsCount", "errors.count"],
    ["inThroughput", "in_throughput"],
    ["outThroughput", "out_throughput"],
    ["requests", "requests"],
    ["latencyAvg", "latency_ms.avg"],
    ["latencyCount", "latency_ms.count"],
    ["latencyMax", "latency_ms.max"],
    ["latencyMin", "latency_ms.min"],
    ["latencyCount", "latency_ms.count"],
    ["latency50", "latency_ms.p50"],
    ["latency90", "latency_ms.p90"],
    ["latency95", "latency_ms.p95"],
    ["latency99", "latency_ms.p99"],
    ["latency9990", "latency_ms.p9990"],
    ["latency9999", "latency_ms.p9999"]
  ];
  return funcs.map((func) => {
    const res = { func: func };
    labelKeyPairs.forEach(([label, key]) => {
      res[label] = getLatestAttribute(funcMetrics, `function/${func}/${key}`);
    });
    res["requestsPerSecond_dygraph"] = mapDygraphKeysToNetChange(
      getDygraphOfValue(funcMetrics, [`function/${func}/requests`])
    );
    res["requestsPerSecond_sparkline"] = getSparkLineOfNetChange(
      funcMetrics,
      `function/${func}/requests`
    );
    res.errorPercent = calculateErrorPercent(res.requests, res.errorsCount);
    return res;
  });
}
