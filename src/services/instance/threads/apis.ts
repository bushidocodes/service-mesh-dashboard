export async function fetchInstanceThreads(
  endpoint: string
): Promise<Record<string, unknown>> {
  const response = await fetch(endpoint);
  // fetch only rejects on network errors, not on HTTP error statuses, so we
  // reject non-2xx responses explicitly.
  if (!response.ok) {
    return Promise.reject(`Request failed with status ${response.status}`);
  }
  // response.json() rejects with a SyntaxError when the body isn't valid JSON
  // (e.g. an HTML error page slipped past a 200). Collapse that into null so
  // both "not JSON at all" and "valid JSON but not an object" (null, a number,
  // a string) reject with the same message instead of leaking a SyntaxError.
  const data: unknown = await response.json().catch(() => null);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Promise.reject("The data object didn't contain JSON as expected");
  }
  return data as Record<string, unknown>;
}
