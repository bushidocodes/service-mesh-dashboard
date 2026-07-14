import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InstanceState, Metrics } from "types";
import { omit } from "utils/collections";

/** ~5 minutes of history at the default 5s poll interval (KD-16). */
export const METRICS_CACHE_MAX_SAMPLES = 60;

const initialState: InstanceState = {
  instanceMetricsPollingInterval: 5000,
  isPollingInstanceMetrics: false,
  metricsPollingFailures: 0,
  metrics: {},
  threadsError: {}
};

// RTK instance slice (PR-18a). Action types are namespaced by default
// (`instance/appendToMetrics`, …) — no jumpstate flat type parity (KD-15).
const instanceSlice = createSlice({
  name: "instance",
  initialState,
  reducers: {
    setInstanceMetricsPollingInterval(state, action: PayloadAction<number>) {
      state.instanceMetricsPollingInterval = action.payload;
    },
    setIsPollingInstanceMetrics(state, action: PayloadAction<boolean>) {
      state.isPollingInstanceMetrics = action.payload;
    },
    setMetricsPollingFailures(state, action: PayloadAction<number>) {
      state.metricsPollingFailures = action.payload;
    },
    setThreadsError(state, action: PayloadAction<Record<string, unknown>>) {
      state.threadsError = action.payload;
    },
    appendToMetrics(state, action: PayloadAction<Record<string, unknown>>) {
      // Ring buffer by max timestamp sample count (KD-16). After appending the
      // new sample, evict oldest timestamps until we are at or under the limit.
      let result: Metrics = { ...state.metrics };
      // Generate a timestamp for the new metrics poll
      const existingTimestamps = result.timestamps ? result.timestamps : [];
      const latestTimestamp = Date.now() + "";
      // And add it to the ordered index of timestamps
      result.timestamps = [...existingTimestamps, latestTimestamp];
      // And deep merge the new results into the keys of the existing state object
      Object.keys(action.payload).forEach((metric) => {
        const existing = result[metric];
        result[metric] = {
          ...(typeof existing === "object" && existing !== null
            ? (existing as Record<string, unknown>)
            : {}),
          [latestTimestamp]: action.payload[metric]
        };
      });
      while (
        result.timestamps != null &&
        result.timestamps.length > METRICS_CACHE_MAX_SAMPLES
      ) {
        result = _sliceMetrics(result);
      }
      state.metrics = result;
    },
    clearMetrics(state) {
      state.metrics = {};
    }
  }
});

export const {
  setInstanceMetricsPollingInterval,
  setIsPollingInstanceMetrics,
  setMetricsPollingFailures,
  setThreadsError,
  appendToMetrics,
  clearMetrics
} = instanceSlice.actions;

export default instanceSlice.reducer;

/**
 * Slices off the oldest timeseries data for all the metrics in a metrics object.
 * This is used to keep the Redux store of metrics from getting too large
 *
 * Note - A metrics object is a complex object that groups together timeseries data
 * for a bunch of different metrics. The top level object is keyed by the name
 * of each metric. The value of each of those keys is another object that contains
 * keys of UNIX timestamps and values of the value of the metric at that timestamp.
 *
 * @param source - metrics bag (defaults to empty)
 * @returns Object containing timeseries with all but the oldest timestamp
 */
export function _sliceMetrics(source: Metrics = {}): Metrics {
  // Deeply clone the complex object to make sure the function stays pure
  let metrics: Metrics = structuredClone(source);
  // Grab the first timestamp in the ordered array and throw an error if not
  // as expected
  const oldestTimestamp =
    metrics.timestamps && metrics.timestamps[0] ? metrics.timestamps[0] : null;
  if (!oldestTimestamp || !metrics.timestamps) {
    throw new Error(
      "Metrics Object did not contain an ordered array of timestamps"
    );
  }
  // Go through each metric and omit the oldest timestamp
  Object.keys(metrics).forEach((metric) => {
    // Ignore the ordered array of timestamps
    if (metric !== "timestamps") {
      const series = metrics[metric];
      metrics[metric] = omit(
        (typeof series === "object" && series !== null ? series : {}) as Record<
          string,
          unknown
        >,
        oldestTimestamp
      );
    }
  });
  // Finally update the array of timestamps
  metrics.timestamps.shift();
  return metrics;
}
