import _ from "lodash";
import { formatMetricString } from "./index.js";

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

/**
 * Returns the most recent value of a particular attribute as a number or string
 * @param {Object} metrics - An arbitrary nested object passed from Redux via component props
 * @param {String} key - A string representation of the path to the desired key
 * @param {number} precision - A int representing the number of decimal places
 * @param {String} baseUnit - A string representation of base unit of the metric
 * @param {String} resultUnit - A string representation of unit you would like to convert to
 * @returns {Number|String}
 */

export function getLatestAttribute(
  metrics,
  key,
  precision,
  baseUnit,
  resultUnit
) {
  if (!metrics || !key) return 0;
  // _.has is not suitable because some object become arrays and auto insert
  // keys from 0...n with values of undefined.
  const fullPath = _.get(metrics, key);
  if (!fullPath) return 0;
  const latestAttribute =
    fullPath[_.last(_.keys(fullPath).sort((a, b) => a - b))];
  // if baseUnit, resultUnit, and precision and falsy, we pass the value back as a
  // number and leave i18n up to the component calling this function
  if (!baseUnit && !resultUnit && !precision && typeof precision !== "number") {
    return latestAttribute;
  } else {
    return formatMetricString(latestAttribute, baseUnit, resultUnit, precision);
  }
}

/**
 * Helper function that inspects the JSON string format for type of 'latest',
 * retrieves the value if required, and formats as a string
 * @param {String[]|String} line
 * @param {Object} metrics
 */
export function parseJSONString(line, metrics, formatMessage) {
  if (Array.isArray(line)) {
    return line
      .map((element) => {
        if (element.type === "string") {
          return formatMessage
            ? formatMessage(element.value)
            : element.value.defaultMessage;
        } else if (
          element.type === "latest" &&
          element.baseUnit &&
          element.resultUnit &&
          element.precision
        ) {
          return getLatestAttribute(
            metrics,
            element.value,
            element.precision,
            element.baseUnit,
            element.resultUnit
          );
        } else {
          return getLatestAttribute(metrics, element.value, 3).toLocaleString();
        }
      })
      .join(" ");
  } else {
    return line;
  }
}
