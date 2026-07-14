import { FormattedMessage } from "react-intl";
import { Actions, Effect, getState } from "store/jumpstate";

import { reportError } from "../../notification";
import { fetchInstanceMetrics } from "./apis";
import {
  buildDiscoveryServiceInstanceMetricsEndpoint,
  clearInstanceMetricsPollingIntervalIfNeeded
} from "./utils";

/**
 * Async Jumpstate Effect that fetches instance metrics and calls Redux success or failure actions
 * @param {string} endpoint - a string containing the target URL of the metrics endpoint
 * @returns
 */
async function fetchAndStoreInstanceMetricsEffect(
  endpoint = buildDiscoveryServiceInstanceMetricsEndpoint()
) {
  if (!endpoint) {
    console.log("Fetching metrics failed because metrics endpoint was missing");
    return;
  }
  try {
    const json = await fetchInstanceMetrics(endpoint);
    Actions.fetchMetricsSuccess(json);
  } catch (err) {
    Actions.fetchMetricsFailure(err);
  }
}
Effect("fetchAndStoreInstanceMetrics", fetchAndStoreInstanceMetricsEffect);

/**
 * Async Jumpstate Effect that handles successful fetches of metrics from the Fabric Server
 * @param {Object} metrics
 */
function fetchMetricsSuccessEffect(metrics: any) {
  // Reset the failure counter
  if (getState().instance.metricsPollingFailures > 0) {
    Actions.setMetricsPollingFailures(0);
  }
  // Update Redux
  Actions.appendToMetrics(metrics);
}
Effect("fetchMetricsSuccess", fetchMetricsSuccessEffect);

/**
 * Action that handles fetch thread errors, notifying the user via a popup and the console
 * and incrementing a counter that disables the polling interval on repeat failures.
 * @param {Object} err
 */
function fetchMetricsFailureEffect(err: any) {
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
    Actions.setMetricsPollingFailures(0);
    Actions.stopPollingInstanceMetrics();
  } else {
    errorMsg = (
      <FormattedMessage
        id="instanceMetricsUtils.fetchError"
        defaultMessage="Fetching Metrics failed"
        description="Error notification"
      />
    );
    reportError(errorMsg, true, err);
    Actions.setMetricsPollingFailures(metricsPollingFailures + 1);
  }
}
Effect("fetchMetricsFailure", fetchMetricsFailureEffect);

/**
 * Action that starts a polling interval for scraping metrics directly
 * @param {Object} [{
 *     endpoint = getState().settings.metricsEndpoint,
 *     interval = getState().instance.instanceMetricsPollingInterval
 *   }={}]
 */
export function startPollingInstanceMetricsEffect(
  {
    endpoint = buildDiscoveryServiceInstanceMetricsEndpoint(),
    interval = getState().instance.instanceMetricsPollingInterval
  } = {
    endpoint: buildDiscoveryServiceInstanceMetricsEndpoint(),
    interval: getState().instance.instanceMetricsPollingInterval
  }
) {
  // We need to make sure we clear any existing
  clearInstanceMetricsPollingIntervalIfNeeded();
  // Update Redux, so the UI components update
  Actions.setIsPollingInstanceMetrics(true);
  // Perform an initial fetch
  Actions.fetchAndStoreInstanceMetrics(endpoint);
  // And then start the interval
  window.refreshInstanceMetricsPollingInterval = setInterval(
    Actions.fetchAndStoreInstanceMetrics,
    interval,
    endpoint
  );
}
Effect("startPollingInstanceMetrics", startPollingInstanceMetricsEffect);

/**
 * Action that clears the polling interval for metrics scraping
 */
function stopPollingInstanceMetricsEffect() {
  // We need to make sure we clear any existing intervals
  clearInstanceMetricsPollingIntervalIfNeeded();
  // Update Redux, so the UI components update
  Actions.setIsPollingInstanceMetrics(false);
}
Effect("stopPollingInstanceMetrics", stopPollingInstanceMetricsEffect);

/**
 * Action that stops polling and clears metrics cache
 */
function stopPollingAndPurgeInstanceMetricsEffect() {
  console.log("Polling stopped and metrics cache cleared");
  // Reset selected service, version, and instance
  Actions.setSelectedServiceSlug(null);
  Actions.setSelectedInstanceID(null);
  // Stop polling
  Actions.stopPollingInstanceMetrics();
  Actions.setMetricsPollingFailures(0);
  // Clear metrics
  Actions.clearMetrics();
}

Effect(
  "stopPollingAndPurgeInstanceMetrics",
  stopPollingAndPurgeInstanceMetricsEffect
);

/**
 * Async Jumpstate effect used to change the polling interval
 * @param {number} interval
 */
function changeInstanceMetricsPollingIntervalEffect(interval: number) {
  Actions.stopPollingInstanceMetrics();
  Actions.setInstanceMetricsPollingInterval(interval);
  Actions.startPollingInstanceMetrics();
}
Effect(
  "changeInstanceMetricsPollingInterval",
  changeInstanceMetricsPollingIntervalEffect
);
