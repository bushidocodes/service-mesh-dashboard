import { configureStore } from "@reduxjs/toolkit";
import { metricsMiddlewareOptions } from "store/middlewareOptions";
import dashboards from "store/states/dashboards";
import fabric from "store/states/fabric";
import instance from "store/states/instance";
import settings from "store/states/settings";
import threadsTable from "store/states/threadsTable";
import type { RootState } from "types";

/**
 * Real Redux store for unit tests. Uses the same reducers and default
 * middleware options as production (including `instance.metrics` serializable/
 * immutable ignores). No action-logger middleware (KD-18).
 *
 * `preloadedState` is intentionally loose: fixture JSON (`mockReduxState*`) is
 * structural test data that is not a perfect `RootState` (partial slices,
 * stringly-typed chart configs, etc.). RTK still fills missing slice keys from
 * each reducer's initial state.
 */
export function createTestStore(
  preloadedState?: Partial<RootState> | Record<string, unknown>
) {
  return configureStore({
    reducer: {
      dashboards,
      fabric,
      instance,
      settings,
      threadsTable
    },
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(metricsMiddlewareOptions)
  });
}

export default createTestStore;
