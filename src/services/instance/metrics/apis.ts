import { mapValues, omitBy } from "utils/collections";

// AJAX Calls to APIs
export async function fetchInstanceMetrics(
  endpoint: string
): Promise<Record<string, number>> {
  const response = await fetch(endpoint);
  // fetch only rejects on network errors, not on HTTP error statuses, so we
  // reject non-2xx responses explicitly.
  if (!response.ok) {
    return Promise.reject(`Request failed with status ${response.status}`);
  }
  const data: unknown = await response.json();
  // Metrics endpoints return a flat JSON object of metric name → value.
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    return Promise.reject("The data object didn't contain JSON as expected");
  }
  // Cast all values to numerics and filter out NaNs
  const numericData = mapValues(data as Record<string, unknown>, (value) =>
    Number(value)
  );
  return omitBy(numericData, (value) => Number.isNaN(value));
}
