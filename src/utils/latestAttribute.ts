import type { IntlMessageDescriptor, Metrics } from "types";
import { formatMetricString } from "./index";

// Dashboard Utility Functions

// The client-side Redux store expresses metrics over time as a hierarchy of JavaScript objects.
// At the lowest level, a metric is represented by a key of the metric name and a complex object
// representing the value of that metric over time. The complex object has keys
// equal to a UNIX timestamp and values equal to the value of the metric at the associated timestamp.
// When the client fetches metrics data from the server, the data is deconstructed and the value
// of each attribute is appended to the appropriate complex object with a key equal to the timestamp
// of when the fetched data was received from the server.

// These utility functions are provided to transform this data into time series, spark lines, and
// other data structures capable of being consumed by front-end components.

type MetricSeries = Record<string, number | string | undefined>;

/** A fragment of a dashboard summary line (string literal or latest-metric token). */
export interface ParseJSONLineElement {
  type?: string;
  value?: string | IntlMessageDescriptor;
  baseUnit?: string;
  resultUnit?: string;
  precision?: number;
}

function asMetricSeries(value: unknown): MetricSeries | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MetricSeries;
  }
  return null;
}

/**
 * Returns the most recent value of a particular attribute as a number or string
 * @param {Object} metrics - An arbitrary nested object passed from Redux via component props
 * @param {String} key - A string representation of the path to the desired key
 * @param {number} precision - A int representing the number of decimal places
 * @param {String} baseUnit - A string representation of base unit of the metric
 * @param {String} resultUnit - A string representation of unit you would like to convert to
 * @returns {Number|String}
 */

// Unformatted reads return a number so arithmetic/call sites type-check.
export function getLatestAttribute(
  metrics: Metrics | null | undefined,
  key: string | null | undefined
): number;
// With precision/units, formatMetricString produces a display string.
export function getLatestAttribute(
  metrics: Metrics | null | undefined,
  key: string | null | undefined,
  precision: number,
  baseUnit?: string,
  resultUnit?: string
): string;
export function getLatestAttribute(
  metrics: Metrics | null | undefined,
  key: string | null | undefined,
  precision?: number,
  baseUnit?: string,
  resultUnit?: string
): number | string {
  if (!metrics || !key) return 0;
  // A direct property lookup is used rather than a path-aware getter because
  // metrics is a flat object keyed by the full metric string (which itself
  // contains "." and "/"), not a nested structure.
  const fullPath = asMetricSeries(metrics[key]);
  if (!fullPath) return 0;
  const latestAttribute =
    fullPath[
      Object.keys(fullPath)
        .sort((a, b) => Number(a) - Number(b))
        .at(-1) as string
    ];
  // if baseUnit, resultUnit, and precision and falsy, we pass the value back as a
  // number and leave i18n up to the component calling this function
  if (!baseUnit && !resultUnit && !precision && typeof precision !== "number") {
    return Number(latestAttribute ?? 0);
  } else {
    return formatMetricString(
      latestAttribute ?? 0,
      baseUnit,
      resultUnit,
      precision
    );
  }
}

/**
 * Helper function that inspects the JSON string format for type of 'latest',
 * retrieves the value if required, and formats as a string
 * @param {String[]|String} line
 * @param {Object} metrics
 */
export function parseJSONString(
  line: string | ParseJSONLineElement[] | null | undefined,
  metrics: Metrics | null | undefined,
  formatMessage?: (message: IntlMessageDescriptor) => string
): string {
  if (Array.isArray(line)) {
    return line
      .map((element) => {
        if (element.type === "string") {
          if (
            formatMessage &&
            element.value &&
            typeof element.value === "object"
          ) {
            return formatMessage(element.value);
          }
          if (
            element.value &&
            typeof element.value === "object" &&
            "defaultMessage" in element.value
          ) {
            return element.value.defaultMessage ?? "";
          }
          return typeof element.value === "string" ? element.value : "";
        } else if (
          element.type === "latest" &&
          element.baseUnit &&
          element.resultUnit &&
          element.precision
        ) {
          return getLatestAttribute(
            metrics,
            typeof element.value === "string" ? element.value : undefined,
            element.precision,
            element.baseUnit,
            element.resultUnit
          );
        } else {
          return getLatestAttribute(
            metrics,
            typeof element.value === "string" ? element.value : undefined,
            3
          ).toLocaleString();
        }
      })
      .join(" ");
  } else {
    return line ?? "";
  }
}
