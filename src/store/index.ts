// Commented out imports are used by currently disabled local storage functionality

import {
  configureStore,
  type ThunkDispatch,
  type UnknownAction
} from "@reduxjs/toolkit";
import type { RootState } from "types";

import { metricsMiddlewareOptions } from "./middlewareOptions";
import dashboards from "./states/dashboards";
import fabric from "./states/fabric";
import instance from "./states/instance";
import settings from "./states/settings";
import threadsTable from "./states/threadsTable";

// Create the Redux store using reducers and RTK default middleware.
// No action-logger middleware (KD-18) — use the Redux DevTools browser
// extension in development (`configureStore` enables it automatically).
const store = configureStore({
  reducer: {
    dashboards,
    fabric,
    instance,
    settings,
    threadsTable
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(metricsMiddlewareOptions)
});

// Explicit ThunkDispatch keeps AppThunk overload resolution stable for
// service call sites (same pattern as PR-17/18a).
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
export type { AppThunk } from "./appThunk";
export { metricsMiddlewareOptions } from "./middlewareOptions";
export default store;
