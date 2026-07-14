import { createSelector } from "@reduxjs/toolkit";
import type { Dashboard, Metrics, Service } from "types";
import { countBy, pick } from "utils/collections";
import { microserviceStatuses } from "utils/constants";

// Structural slices use loose nested types (`object`) where mockReduxState and
// production RootState differ in optional/extra fields (dashboard chart unions,
// service `slug`, etc.). Selectors cast back to domain types on return.

// createSelector input selectors

export const getMetrics = (state: { instance: { metrics: Metrics } }) =>
  state.instance.metrics;
export const getDashboards = (state: { dashboards: object }) =>
  state.dashboards as Record<string, Dashboard>;
export const getServices = (state: { fabric: { services: object } }) =>
  state.fabric.services as Record<string, Service>;

export const getFabricServer = (state: {
  settings: { fabricServer: string | null };
}) => state.settings.fabricServer;
export const getSelectedInstanceID = (state: {
  fabric: { selectedInstanceID: string | null };
}) => state.fabric.selectedInstanceID;
export const getSelectedServiceSlug = (state: {
  fabric: { selectedServiceSlug: string | null };
}) => state.fabric.selectedServiceSlug;

/**
 * Memoized selector (createSelector from RTK) that returns the current selected service from the Redux store
 * if it is found and null if not found
 */
export const getSelectedService = createSelector(
  [getSelectedServiceSlug, getServices],
  (slug, services) => {
    if (slug && Object.hasOwn(services, slug)) {
      return services[slug];
    } else {
      return null;
    }
  }
);

/**
 * Memoized selector (createSelector from RTK) that returns the runtime attribute of
 * the currently selected service or null
 */
export const getRuntime = createSelector(
  [getFabricServer, getSelectedService],
  (fabricServer, service) => {
    if (fabricServer) {
      return service ? service.runtime : null;
    } else {
      return null;
    }
  }
);

export const getBaseInstanceRoute = createSelector(
  [getSelectedServiceSlug, getSelectedInstanceID],
  (selectedServiceSlug, selectedInstanceID) => {
    return selectedServiceSlug && selectedInstanceID
      ? `/${selectedServiceSlug}/${selectedInstanceID}`
      : "";
  }
);

/**
 * A createSelector factory (from RTK)
 * Returns a selector that returns all metrics with a key that includes
 * the string keyQuery. By default, the string is assumed to strictly match
 * the first characters of the key. However, the search can be forced to match
 * loosely. Note that this is more fagile because monitored microservices might
 * use the string you're querying in a way that you're not expecting!
 * @export
 * @param {string} keyQuery
 * @param {boolean} [isPrefix=true]
 * @returns function
 */
export function metricsKeySelectorGenerator(keyQuery: string, isPrefix = true) {
  const filterFunc = isPrefix
    ? (key: string) => key.substr(0, keyQuery.length) === keyQuery
    : (key: string) => key.includes(keyQuery);
  return createSelector(getMetrics, (metrics) =>
    pick(metrics, Object.keys(metrics).filter(filterFunc))
  );
}

/**
 * Memoized selector that filters the metrics and only returns the timeseries
 * that starts with the string 'route'.
 */
export const getRoutesMetrics = metricsKeySelectorGenerator("route");

/**
 * Memoized selector that generates a special hierarchical tree structure of route data
 * from the timeseries keys. It's used to render the special Route dashboards for the JVM
 */
export const getRoutesTree = createSelector(getRoutesMetrics, (routesMetrics) =>
  _buildRoutesTree(routesMetrics)
);

function _buildRoutesTree(routeMetrics: Metrics): Record<string, string[]> {
  const keys = Object.keys(routeMetrics);
  if (keys.length > 0) {
    return keys.reduce((acc: Record<string, string[]>, key: string) => {
      const matchSet = key.match(
        /route(.*)\/(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\/.*/
      );
      // Array.prototype.match returns null if RegExp didn't match
      if (matchSet) {
        let path = matchSet[1];
        const verb = matchSet[2];
        if (path == null || verb == null) return acc;
        // Finagle represents a GET on the root routes as "/route/GET"
        if (path === "") {
          path = "/";
        }
        const existing = acc[path];
        if (!existing) {
          acc[path] = [verb];
        } else if (!existing.includes(verb)) {
          acc[path] = [...existing, verb];
        }
      }
      return acc;
    }, {});
  } else {
    return {};
  }
}

/**
 * getStatusCount is a utility function that takes an array of service objects and
 * returns an object with a count for each status.
 * if status is not one of predefined microservice statuses (Down, Warning or Stable),
 * status is counted as Down
 * @param {Object[]}
 * @returns {Object}
 */
export const getStatusCount = createSelector(getServices, (services) => {
  let statusCount = countBy(
    Object.values(services).map((service: Service) => {
      let status = computeStatus(
        service.instances?.length ?? 0,
        service.minimum,
        service.maximum
      );
      return microserviceStatuses.includes(status) ? status : "Down";
    })
  );
  return Object.assign(statusCount, { total: Object.values(services).length });
});

/**
 * Computes and returns string representation of status for a service
 * @param {number} count  - service.instances.length (number of instances)
 * @param {number} min - service.minimum
 * @param {number} max - service.maximum
 * @returns {string} - "Down" || "Stable" || "Warning"
 */
export function computeStatus(count: number, min: number, max: number) {
  if (count === 0) {
    return "Down";
  } else if (count >= min && count <= max) {
    return "Stable";
  } else {
    return "Warning";
  }
}
