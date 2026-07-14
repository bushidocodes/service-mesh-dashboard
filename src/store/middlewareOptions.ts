/**
 * High-frequency `instance/appendToMetrics` writes a large nested map.
 * Ignore that path (and the action) so dev serializable/immutable checks do
 * not O(n)-walk the metrics bag on every poll. RTK already disables these
 * checks in production builds. (PR-18b / KD-16)
 *
 * Shared by the production store and `createTestStore` so unit tests exercise
 * the same middleware configuration.
 */
export const metricsMiddlewareOptions = {
  serializableCheck: {
    ignoredPaths: ["instance.metrics"],
    ignoredActions: ["instance/appendToMetrics"]
  },
  immutableCheck: {
    ignoredPaths: ["instance.metrics"]
  }
};
