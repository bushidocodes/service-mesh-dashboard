import { FormattedMessage } from "react-intl";
import { loadDashboardsFromJSON } from "services/dashboards";
import { reportError } from "services/notification";
import type { AppThunk } from "store/appThunk";
import { Actions } from "store/jumpstate";
import {
  setFabricMicroservices,
  setFabricPollingInterval,
  setIsPollingFabric,
  setSelectedInstanceID,
  setSelectedServiceSlug,
  setServicesPollingFailures
} from "store/states/fabric";
import type { Service } from "types";
import { clearFabricIntervalIfNeeded, slugifyMicroservice } from "utils";
import { memoize } from "utils/collections";
import { getFabricServer } from "utils/head";

const memoizedSlugifyMicroservice = memoize(slugifyMicroservice);

/** Service from SDS plus the client-side slug used as the store index key. */
export type ServiceWithSlug = Service & { slug: string };

/**
 * Narrow an SDS list entry to {@link Service}. Requires `name` and `version`
 * (used for slug generation); the remaining Service fields are present on real
 * discovery payloads and are trusted after the object shape check.
 */
function asService(value: unknown): Service | null {
  if (value == null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.name !== "string" || typeof record.version !== "string") {
    return null;
  }
  return value as Service;
}

export async function fetchFabricMicroservices(
  fabricServer: string
): Promise<Record<string, ServiceWithSlug>> {
  if (!fabricServer) return Promise.reject("Invalid endpoint");
  const response = await fetch(`${fabricServer}/services`);
  // fetch only rejects on network errors, not on HTTP error statuses, so we
  // reject non-2xx responses explicitly — the polling failure counter relies on
  // rejection to back off.
  if (!response.ok) {
    return Promise.reject(`Request failed with status ${response.status}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    return Promise.reject("The data object didn't contain JSON as expected");
  }
  const withSlugs: ServiceWithSlug[] = [];
  for (const item of data) {
    const service = asService(item);
    if (!service) {
      return Promise.reject("Invalid service entry in discovery response");
    }
    withSlugs.push({
      ...service,
      slug: memoizedSlugifyMicroservice(service.name, service.version)
    });
  }
  return withSlugs.reduce<Record<string, ServiceWithSlug>>(
    (result, service) => {
      result[service.slug] = service;
      return result;
    },
    {}
  );
}

/**
 * Fetch services from the Fabric Server and update Redux based on success or
 * error states.
 */
export function fetchAndStoreFabricMicroservices(
  fabricServer = getFabricServer()
): AppThunk<Promise<void>> {
  return async (dispatch) => {
    if (!fabricServer) {
      console.log(
        "Fetching microservices failed because Discovery Service endpoint was missing"
      );
      return;
    }
    try {
      const results = await fetchFabricMicroservices(fabricServer);
      dispatch(fetchFabricMicroservicesSuccess(results));
    } catch (err) {
      dispatch(fetchFabricMicroservicesFailure(err));
    }
  };
}

/**
 * Handle successful fetches of services from the Fabric Server: reset the
 * failure counter and update redux with the current services.
 */
export function fetchFabricMicroservicesSuccess(
  services: Record<string, Service>
): AppThunk {
  return (dispatch, getState) => {
    if (getState().fabric.servicesPollingFailures > 0) {
      dispatch(setServicesPollingFailures(0));
    }
    dispatch(setFabricMicroservices(services));
  };
}

/**
 * Handle errors when fetching services from a Fabric Server, notifying the user
 * via a popup and the console and incrementing a counter that disables the
 * polling interval on repeat failures.
 */
export function fetchFabricMicroservicesFailure(err: unknown): AppThunk {
  return (dispatch, getState) => {
    const servicesPollingFailures = getState().fabric.servicesPollingFailures;
    console.log("Failed: ", servicesPollingFailures);
    // If there have already been four failures (0, 1, 2, 3, 4), this is the
    // fifth failure, so notify the user and stop polling
    let errorMsg;
    if (servicesPollingFailures > 3) {
      errorMsg = (
        <FormattedMessage
          id="fabricMicroservices.disableFetchError"
          defaultMessage="Automatically disabling the fetching of Fabric microservices after three attempts."
          description="Error notification"
        />
      );
      reportError(errorMsg, false, err);
      dispatch(setServicesPollingFailures(0));
      dispatch(stopPollingFabricMicroservices());
      // Otherwise just increment the counter and warn the user;
    } else {
      errorMsg = (
        <FormattedMessage
          id="fabricMicroservices.fetchError"
          defaultMessage="Fetching Fabric Microservices failed"
          description="Error notification"
        />
      );
      reportError(errorMsg, true, err);
      dispatch(setServicesPollingFailures(servicesPollingFailures + 1));
    }
  };
}

/**
 * Change the polling interval used to retrieve Fabric-wide data from the
 * Fabric Server.
 */
export function changeFabricMicroservicesPollingInterval(
  interval: number
): AppThunk {
  return (dispatch) => {
    dispatch(stopPollingFabricMicroservices());
    dispatch(setFabricPollingInterval(interval));
    dispatch(startPollingFabricMicroservices());
  };
}

/**
 * Start a polling interval for retrieving services from the Fabric Server.
 * Module-level timer lives on `window.refreshFabricIntervalID` (same as before).
 */
export function startPollingFabricMicroservices({
  interval
}: {
  interval?: number;
} = {}): AppThunk {
  return (dispatch, getState) => {
    const pollInterval = interval ?? getState().fabric.fabricPollingInterval;
    // We need to make sure we clear any existing
    clearFabricIntervalIfNeeded();
    // Update Redux, so the UI components update
    dispatch(setIsPollingFabric(true));
    // Perform an initial fetch
    dispatch(fetchAndStoreFabricMicroservices());
    // And then start the interval
    window.refreshFabricIntervalID = setInterval(() => {
      dispatch(fetchAndStoreFabricMicroservices());
    }, pollInterval);
  };
}

/**
 * Clear the polling interval for fabric microservices.
 */
export function stopPollingFabricMicroservices(): AppThunk {
  return (dispatch) => {
    // We need to make sure we clear any existing intervals
    clearFabricIntervalIfNeeded();
    // Update Redux, so the UI components update
    dispatch(setIsPollingFabric(false));
  };
}

/**
 * Select a microservice instance. Because the dashboard only allows a single
 * microservice instance to be selected and polled at any given time, this
 * clears and resets the polling interval and metrics cache each time a new
 * microservice instance is selected.
 *
 * Instance metrics start/stop/clear remain jumpstate Effects until PR-18a.
 */
export function selectInstance({
  instanceID,
  serviceSlug
}: {
  instanceID: string;
  serviceSlug: string;
}): AppThunk {
  return (dispatch, getState) => {
    const { fabric } = getState();
    if (instanceID !== fabric.selectedInstanceID) {
      // Check if the new instance is a different microservice and update as needed
      if (serviceSlug && serviceSlug !== fabric.selectedServiceSlug) {
        dispatch(setSelectedServiceSlug(serviceSlug));
      }
      dispatch(setSelectedInstanceID(instanceID));
      // Stop Polling (instance metrics still jumpstate)
      Actions.stopPollingInstanceMetrics();
      // Clear Metrics when we change instances
      Actions.clearMetrics();
      // and then start polling
      Actions.startPollingInstanceMetrics();
      // and then load dashboards
      const runtime = fabric?.services?.[serviceSlug]?.runtime ?? "";
      // Note: If we don't know the runtime we ran this function before getting a
      // response from the Fabric server so we don't know what type of runtime
      // the microservice is. The current workaround is in componentDidUpdate in
      // Main.
      if (runtime) {
        dispatch(loadDashboardsFromJSON(runtime));
      }
    }
  };
}
