import _ from "lodash";
import { createSelector } from "reselect";

import { microserviceStatuses } from "utils/constants";

// Reselect Input Selectors

export const getMetrics = (state) => state.instance.metrics;
export const getDashboards = (state) => state.dashboards;
export const getServices = (state) => state.fabric.services;

export const getFabricServer = (state) => state.settings.fabricServer;
export const getSelectedInstanceID = (state) => state.fabric.selectedInstanceID;
export const getSelectedServiceSlug = (state) =>
  state.fabric.selectedServiceSlug;

/**
 * Reselect selector that returns the current selected service from the Redux store
 * if it is found and null if not found
 */
export const getSelectedService = createSelector(
  [getSelectedServiceSlug, getServices],
  (slug, services) => {
    if (Object.hasOwn(services, slug)) {
      return services[slug];
    } else {
      return null;
    }
  }
);

/**
 * Reselect selector that returns the runtime attribute of
 * the currently selected service or null
 */
export const getRuntime = createSelector(
  [getFabricServer, getSelectedService],
  (fabricServer, service, staticRuntime) => {
    if (fabricServer) {
      return service ? service.runtime : null;
    } else {
      return null;
    }
  }
);

export const getBaseInstanceRoute = createSelector(
  [getDashboards, getMetrics, getSelectedServiceSlug, getSelectedInstanceID],
  (dashboards, metrics, selectedServiceSlug, selectedInstanceID) => {
    return selectedServiceSlug && selectedInstanceID
      ? `/${selectedServiceSlug}/${selectedInstanceID}`
      : "";
  }
);

/**
 * A Reselect selector factory
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
export function metricsKeySelectorGenerator(keyQuery, isPrefix = true) {
  const filterFunc = isPrefix
    ? (key) => key.substr(0, keyQuery.length) === keyQuery
    : (key) => key.includes(keyQuery);
  return createSelector([getMetrics], (metrics) =>
    _.pick(metrics, Object.keys(metrics).filter(filterFunc))
  );
}

/**
 * A Reselect selector that filters the metrics and only returns the timeseries
 * that starts with the string 'route'.
 */
export const getRoutesMetrics = metricsKeySelectorGenerator("route");

/**
 * A Reselect selector that generates a special hierarchical tree structure of route data
 * from the timeseries keys. It's used to render the special Route dashboards for the JVM
 */
export const getRoutesTree = createSelector(getRoutesMetrics, (routesMetrics) =>
  _buildRoutesTree(routesMetrics)
);

function _buildRoutesTree(routeMetrics) {
  const keys = Object.keys(routeMetrics);
  if (keys.length > 0) {
    return keys.reduce((acc, key) => {
      const matchSet = key.match(
        /route(.*)\/(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\/.*/
      );
      // Array.prototype.match returns null if RegExp didn't match
      if (matchSet) {
        let [, path, verb] = matchSet;
        // Finagle represents a GET on the root routes as "/route/GET"
        if (path === "") {
          path = "/";
        }
        if (!acc[path]) {
          acc[path] = [verb];
        } else if (!acc[path].includes(verb)) {
          acc[path] = [...acc[path], verb];
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
  let statusCount = _.countBy(
    _.values(services).map((service) => {
      let status = computeStatus(
        service.instances.length,
        service.minimum,
        service.maximum
      );
      return _.includes(microserviceStatuses, status) ? status : "Down";
    })
  );
  return _.assign(statusCount, { total: _.values(services).length });
});

/**
 * Computes and returns string representation of status for a service
 * @param {number} count  - service.instances.length (number of instances)
 * @param {number} min - service.minimum
 * @param {number} max - service.maximum
 * @returns {string} - "Down" || "Stable" || "Warning"
 */
export function computeStatus(count, min, max) {
  if (count === 0) {
    return "Down";
  } else if (count >= min && count <= max) {
    return "Stable";
  } else {
    return "Warning";
  }
}
