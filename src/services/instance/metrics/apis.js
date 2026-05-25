import axios from "axios";
import _ from "lodash";

// AJAX Calls to APIs
export function fetchInstanceMetrics(endpoint) {
  return (
    axios
      .get(endpoint, { responseType: "json" })
      .then((response) => response.data)
      // Cast all values to numerics and filter out NaNs
      .then((data) => _.mapValues(data, (value) => Number(value)))
      .then((data) => _.omitBy(data, (value) => Number.isNaN(value)))
  );
}
