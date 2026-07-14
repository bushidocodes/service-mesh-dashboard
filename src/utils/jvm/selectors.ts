import { createSelector } from "@reduxjs/toolkit";
import type { Metrics } from "types";
import { calculateErrorPercent, formatAsDecimalString } from "utils";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "../dygraphs";
import { getLatestAttribute } from "../latestAttribute";
import { getMetrics, getRoutesMetrics, getRoutesTree } from "../selectors";
import { getSparkLineOfNetChange } from "../sparklines";

type RouteTableRow = Record<string, unknown>;

/** Minimal thread shape used by filter/count selectors (mock ids may be strings). */
type ThreadRow = { state?: string };

// JVM - Specific Redux state (structural slices for partial mock stores)
const getCurrentThreads = (state: { threadsTable: ThreadRow[] }) =>
  state.threadsTable;
const getThreadsFilter = (state: { settings: { threadsFilter: string } }) =>
  state.settings.threadsFilter;

/**
 * A selector that takes metrics and returns percent error without % symbol
 * toLocaleString() forces three decimal points and
 * returns language sensitive representation of number (commas and periods)
 */
export const getErrorPercent = createSelector(getMetrics, (metrics) => {
  if (Object.keys(metrics).length === 0) return formatAsDecimalString(0);
  const totalRequests =
    Number(getLatestAttribute(metrics, "http/requests") || 0) +
    Number(getLatestAttribute(metrics, "https/requests") || 0);
  const totalSuccesses =
    Number(getLatestAttribute(metrics, "http/success") || 0) +
    Number(getLatestAttribute(metrics, "https/success") || 0);
  if (totalRequests > 0) {
    return calculateErrorPercent(totalRequests, totalRequests - totalSuccesses);
  } else {
    return formatAsDecimalString(0);
  }
});

/**
 * Memoized selector (createSelector from RTK) that builds the data required to render the RoutesTable component
 */
export const getRoutesTable = createSelector(
  [getRoutesTree, getRoutesMetrics],
  (routesTree: Record<string, string[]>, routesMetrics: Metrics) => {
    // Now build the table
    const routesTable: RouteTableRow[] = [];
    const routesPaths = Object.keys(routesTree);
    routesPaths.forEach((routePath: string) => {
      let baseObj = { route: routePath };
      routesTree[routePath].forEach((routeVerb: string) => {
        const requestsKey =
          routePath === "/"
            ? `route/${routeVerb}/requests`
            : `route${routePath}/${routeVerb}/requests`;
        const successesKey =
          routePath === "/"
            ? `route/${routeVerb}/status/2XX`
            : `route${routePath}/${routeVerb}/status/2XX`;

        const latency50Key = `route${routePath}/${routeVerb}/time.p50`;
        const latency99Key = `route${routePath}/${routeVerb}/time.p99`;
        const requests = getLatestAttribute(routesMetrics, requestsKey);
        const totalSuccesses = getLatestAttribute(routesMetrics, successesKey);
        const latency50 = getLatestAttribute(routesMetrics, latency50Key);
        const latency99 = getLatestAttribute(routesMetrics, latency99Key);
        const errorPercent = calculateErrorPercent(
          requests,
          requests - totalSuccesses
        );
        routesTable.push({
          ...baseObj,
          errorPercent,
          requests,
          verb: routeVerb,
          latency50,
          latency99,
          requestsPerSecond_sparkline: getSparkLineOfNetChange(
            routesMetrics,
            requestsKey
          ),
          requestsPerSecond_dygraph: mapDygraphKeysToNetChange(
            getDygraphOfValue(routesMetrics, [requestsKey])
          )
        });
      });
    });
    return routesTable;
  }
);

/**
 * Filter the current threads according to store.settings.threadsFilter in the
 * Redux store.
 */
export const getVisibleThreads = createSelector(
  [getCurrentThreads, getThreadsFilter],
  (threadsTable: ThreadRow[], threadsFilter: string) => {
    switch (threadsFilter) {
      case "active":
        return threadsTable.filter(
          (threadItem: ThreadRow) => threadItem.state === "RUNNABLE"
        );
      case "idle":
        return threadsTable.filter(
          (threadItem: ThreadRow) =>
            threadItem.state === "WAITING" ||
            threadItem.state === "TIMED_WAITING"
        );
      case "stopped":
        return threadsTable.filter(
          (threadItem: ThreadRow) =>
            threadItem.state === "TERMINATED" ||
            threadItem.state === "BLOCKED" ||
            threadItem.state === "NEW"
        );
      case "all":
      default:
        return threadsTable;
    }
  }
);

/**
 * Count the current threads according to the state and provide an object containing
 * these totals.
 */
export const getThreadCounts = createSelector(
  getCurrentThreads,
  (threadsTable: ThreadRow[] = []) => {
    return {
      active: threadsTable
        ? threadsTable.filter(
            (threadItem: ThreadRow) => threadItem.state === "RUNNABLE"
          ).length
        : 0,
      idle: threadsTable
        ? threadsTable.filter(
            (threadItem: ThreadRow) =>
              threadItem.state === "WAITING" ||
              threadItem.state === "TIMED_WAITING"
          ).length
        : 0,
      stopped: threadsTable
        ? threadsTable.filter(
            (threadItem: ThreadRow) =>
              threadItem.state === "TERMINATED" ||
              threadItem.state === "BLOCKED" ||
              threadItem.state === "NEW"
          ).length
        : 0,
      all: threadsTable.length
    };
  }
);
