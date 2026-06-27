import { State } from "store/jumpstate";
import objectSizeOf from "object-sizeof";
import { omit } from "utils/collections";

const METRICS_CACHE_MAX_BYTES = 100000000; // ~100MB is 100000000

// State Objects
const instance = State({
  initial: {
    instanceMetricsPollingInterval: 5000,
    isPollingInstanceMetrics: false,
    metricsPollingFailures: 0,
    metrics: {},
    threadsError: {}
  },
  setInstanceMetricsPollingInterval(state: any, payload: any) {
    return { ...state, instanceMetricsPollingInterval: payload };
  },
  setIsPollingInstanceMetrics(state: any, payload: any) {
    return { ...state, isPollingInstanceMetrics: payload };
  },
  setMetricsPollingFailures(state: any, payload: any) {
    return { ...state, metricsPollingFailures: payload };
  },
  setThreadsError(state: any, payload: any) {
    return { ...state, threadsError: payload };
  },
  appendToMetrics(state: any, payload: any) {
    // Check the size of the state
    // If the size of the state exceeds the max capacity,
    // find the earliest timestamp wipe all associated metrics from all known keys
    const result =
      objectSizeOf(state.metrics) > METRICS_CACHE_MAX_BYTES
        ? _sliceMetrics(state.metrics)
        : { ...state.metrics };
    // Generate a timestamp for the new metrics poll
    const existingTimestamps = result.timestamps ? result.timestamps : [];
    const latestTimestamp = Date.now() + "";
    // And add it to the ordered index of timestamps
    result.timestamps = [...existingTimestamps, latestTimestamp];
    // And deep merge the new results into the keys of the existing state object
    Object.keys(payload).forEach((metric) => {
      result[metric] = {
        ...result[metric],
        [latestTimestamp]: payload[metric]
      };
    });
    return { ...state, metrics: result };
  },
  clearMetrics(state: any, payload: any) {
    return { ...state, metrics: {} };
  }
});

export default instance;

/**
 * Slices off the oldest timeseries data for all the metrics in a metrics object.
 * This is used to keep the Redux store of metrics from getting too large
 *
 * Note - A metrics object is a complex object that groups together timeseries data
 * for a bunch of different metrics. The top level object is keyed by the name
 * of each metric. The value of each of those keys is another object that contains
 * keys of UNIX timestamps and values of the value of the metric at that timestamp.
 *
 * @param {any} [source={}]
 * @returns Object containing timeseries with all but the oldest timestamp
 */
export function _sliceMetrics(source = {}) {
  // Deeply clone the complex object to make sure the function stays pure
  let metrics: any = structuredClone(source);
  // Grab the first timestamp in the ordered array and throw an error if not
  // as expected
  const oldestTimestamp =
    metrics.timestamps && metrics.timestamps[0] ? metrics.timestamps[0] : null;
  if (!oldestTimestamp) {
    throw new Error(
      "Metrics Object did not contain an ordered array of timestamps"
    );
  }
  // Go through each metric and omit the oldest timestamp
  Object.keys(metrics).forEach((metric) => {
    // Ignore the ordered array of timestamps
    if (metric !== "timestamps") {
      metrics[metric] = omit(metrics[metric], oldestTimestamp);
    }
  });
  // Finally update the array of timestamps
  metrics.timestamps.shift();
  return metrics;
}
