import axios from "axios";
import _ from "lodash";

// AJAX Calls to APIs
export async function fetchInstanceMetrics(endpoint) {
  const response = await axios.get(endpoint, { responseType: "json" });
  // Cast all values to numerics and filter out NaNs
  const numericData = _.mapValues(response.data, (value) => Number(value));
  return _.omitBy(numericData, (value) => Number.isNaN(value));
}
