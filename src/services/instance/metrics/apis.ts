import { mapValues, omitBy } from "utils/collections";

// AJAX Calls to APIs
export async function fetchInstanceMetrics(endpoint: string) {
  const response = await fetch(endpoint);
  // fetch only rejects on network errors, not on HTTP error statuses, so we
  // reject non-2xx responses explicitly.
  if (!response.ok) {
    return Promise.reject(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  // Cast all values to numerics and filter out NaNs
  const numericData = mapValues(data, (value) => Number(value));
  return omitBy(numericData, (value) => Number.isNaN(value));
}
