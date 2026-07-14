import type { Metrics } from "types";
import { floatRound } from "./dygraphs";

type MetricSeries = Record<string, number | string | undefined>;

function asMetricSeries(value: unknown): MetricSeries | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MetricSeries;
  }
  return null;
}

/**
 * Returns spark line of a metric's value
 *
 * @param {Object} metrics - An arbitrary nested object passed from Redux via component props
 * @param {String} key - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getSparkLineOfValue(
  metrics: Metrics | null | undefined,
  key: string
): Array<number | string> {
  if (!metrics || !key) return [0, 0];
  const series = asMetricSeries(metrics[key]);
  const values = Object.entries(series ?? {}).map(([, val]) => val ?? 0); //ignore value at index 0
  if (!values || values.length < 2) return [0, 0];
  return values;
}

/**
 * Returns sparkline of a metric's net change since that last time the metric was polled
 *
 * @param {Object} metrics - An arbitrary nested object passed from Redux via component props
 * @param {String} key - A string representation of the path to the desired key
 * @returns {Array}
 */
export function getSparkLineOfNetChange(
  metrics: Metrics | null | undefined,
  key: string
): number[] {
  if (!metrics || !key) return [0, 0];
  const series = asMetricSeries(metrics[key]);
  const values = Object.entries(series ?? {}).map(([, val]) => val); // Ignoring the keys
  const timestamps = Object.entries(series ?? {}).map(
    ([timestamp]) => timestamp
  ); // Ignoring the keys
  if (!values || values.length < 3) return [0, 0];
  // Map over the arrays to compute the net change, and drop the first value
  const results = values
    .map((value, idx, arr) => {
      const last = arr[idx - 1];
      const currentTime = timestamps[idx];
      const lastTime = timestamps[idx - 1];
      let netChange = floatRound(
        (Number(value) - Number(last)) /
          ((Number(currentTime) - Number(lastTime)) / 1000),
        3
      );
      return idx === 0 || netChange < 0 ? 0 : netChange;
    })
    .slice(1);
  return results;
}
