import { FormattedMessage } from "react-intl";
import type { AppThunk } from "store/appThunk";
import {
  setSelectedInstanceID,
  setSelectedServiceSlug
} from "store/states/fabric";
import {
  appendToMetrics,
  clearMetrics,
  setInstanceMetricsPollingInterval,
  setIsPollingInstanceMetrics,
  setMetricsPollingFailures
} from "store/states/instance";

import { reportError } from "../../notification";
import { fetchInstanceMetrics } from "./apis";
import {
  buildDiscoveryServiceInstanceMetricsEndpoint,
  clearInstanceMetricsPollingIntervalIfNeeded
} from "./utils";

/**
 * Fetch instance metrics and dispatch success or failure handlers.
 * RTK thunk (PR-18a) — replaces the jumpstate Effect of the same name.
 */
export function fetchAndStoreInstanceMetrics(
  endpoint = buildDiscoveryServiceInstanceMetricsEndpoint()
): AppThunk<Promise<void>> {
  return async (dispatch) => {
    if (!endpoint) {
      console.log(
        "Fetching metrics failed because metrics endpoint was missing"
      );
      return;
    }
    try {
      const json = await fetchInstanceMetrics(endpoint);
      dispatch(fetchMetricsSuccess(json));
    } catch (err) {
      dispatch(fetchMetricsFailure(err));
    }
  };
}

/**
 * Handle successful fetches of metrics: reset the failure counter and append
 * the sample to the metrics ring buffer.
 */
export function fetchMetricsSuccess(
  metrics: Record<string, unknown>
): AppThunk {
  return (dispatch, getState) => {
    // Reset the failure counter
    if (getState().instance.metricsPollingFailures > 0) {
      dispatch(setMetricsPollingFailures(0));
    }
    // Update Redux
    dispatch(appendToMetrics(metrics));
  };
}

/**
 * Handle metrics fetch errors: notify the user and increment a counter that
 * disables the polling interval on repeat failures.
 */
export function fetchMetricsFailure(err: unknown): AppThunk {
  return (dispatch, getState) => {
    const metricsPollingFailures = getState().instance.metricsPollingFailures;
    let errorMsg;
    if (metricsPollingFailures >= 3) {
      errorMsg = (
        <FormattedMessage
          id="instanceMetricsUtils.disableFetchError"
          defaultMessage="Automatically disabling the fetching of metrics after three attempts. You can turn polling back on in Settings."
          description="Error notification"
        />
      );
      reportError(errorMsg, false);
      dispatch(setMetricsPollingFailures(0));
      dispatch(stopPollingInstanceMetrics());
    } else {
      errorMsg = (
        <FormattedMessage
          id="instanceMetricsUtils.fetchError"
          defaultMessage="Fetching Metrics failed"
          description="Error notification"
        />
      );
      reportError(errorMsg, true, err);
      dispatch(setMetricsPollingFailures(metricsPollingFailures + 1));
    }
  };
}

/**
 * Start a polling interval for scraping metrics directly.
 * Module-level timer lives on `window.refreshInstanceMetricsPollingInterval`
 * (same as before).
 */
export function startPollingInstanceMetrics({
  endpoint,
  interval
}: {
  endpoint?: string | null;
  interval?: number;
} = {}): AppThunk {
  return (dispatch, getState) => {
    const pollEndpoint =
      endpoint ?? buildDiscoveryServiceInstanceMetricsEndpoint();
    const pollInterval =
      interval ?? getState().instance.instanceMetricsPollingInterval;
    // We need to make sure we clear any existing
    clearInstanceMetricsPollingIntervalIfNeeded();
    // Update Redux, so the UI components update
    dispatch(setIsPollingInstanceMetrics(true));
    // Perform an initial fetch
    dispatch(fetchAndStoreInstanceMetrics(pollEndpoint ?? undefined));
    // And then start the interval
    window.refreshInstanceMetricsPollingInterval = setInterval(() => {
      dispatch(fetchAndStoreInstanceMetrics(pollEndpoint ?? undefined));
    }, pollInterval);
  };
}

/**
 * Clear the polling interval for metrics scraping.
 */
export function stopPollingInstanceMetrics(): AppThunk {
  return (dispatch) => {
    // We need to make sure we clear any existing intervals
    clearInstanceMetricsPollingIntervalIfNeeded();
    // Update Redux, so the UI components update
    dispatch(setIsPollingInstanceMetrics(false));
  };
}

/**
 * Stop polling and clear the metrics cache (and fabric selection).
 */
export function stopPollingAndPurgeInstanceMetrics(): AppThunk {
  return (dispatch) => {
    console.log("Polling stopped and metrics cache cleared");
    // Reset selected service, version, and instance (fabric slice is RTK — PR-17)
    dispatch(setSelectedServiceSlug(null));
    dispatch(setSelectedInstanceID(null));
    // Stop polling
    dispatch(stopPollingInstanceMetrics());
    dispatch(setMetricsPollingFailures(0));
    // Clear metrics
    dispatch(clearMetrics());
  };
}

/**
 * Change the polling interval used to scrape instance metrics.
 */
export function changeInstanceMetricsPollingInterval(
  interval: number
): AppThunk {
  return (dispatch) => {
    dispatch(stopPollingInstanceMetrics());
    dispatch(setInstanceMetricsPollingInterval(interval));
    dispatch(startPollingInstanceMetrics());
  };
}
