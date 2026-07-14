import { configureStore } from "@reduxjs/toolkit";
import { CreateJumpstateMiddleware } from "store/jumpstate";
import dashboards from "store/states/dashboards";
import fabric from "store/states/fabric";
import instance from "store/states/instance";
import settings from "store/states/settings";
import threadsTable from "store/states/threadsTable";
import type { RootState } from "types";

/**
 * Real Redux store for unit tests. Uses the same reducers as production,
 * thunk middleware (fabric/dashboard/instance AppThunks), and Jumpstate
 * middleware (wires shim `getState`/`dispatch` for metrics utils; no Effect()
 * registrations remain after PR-18a) — but never attaches redux-logger
 * (noise in CI; logger removal is PR-18b / KD-18).
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
    // Thunk + Jumpstate — do **not** attach redux-logger here.
    // `as any` keeps the middleware chain loose (same as pre-PR-17 helper).
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
        actionCreatorCheck: false
      }).concat(CreateJumpstateMiddleware()) as any
  });
}

export default createTestStore;
