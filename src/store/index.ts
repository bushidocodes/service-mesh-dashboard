// Commented out imports are used by currently disabled local storage functionality

import {
  configureStore,
  type ThunkDispatch,
  type UnknownAction
} from "@reduxjs/toolkit";
// redux-logger is a CJS/UMD module whose logger fn lives at both `.default`
// and the named `logger` export. Vite 8's Rolldown dep-optimizer resolves the
// *default* import to the namespace object (not a function), which makes
// configureStore throw "each middleware provided ... must be a function" at
// boot. Use the named export, which is stable across the esbuild→Rolldown
// interop change. (esbuild in Vite ≤7 resolved the default correctly.)
import { logger } from "redux-logger";
import type { RootState } from "types";
import { CreateJumpstateMiddleware } from "./jumpstate";

import dashboards from "./states/dashboards";
import fabric from "./states/fabric";
import instance from "./states/instance";
import settings from "./states/settings";
import threadsTable from "./states/threadsTable";

// Create the Redux store using reducers and middlewares.
// Thunk middleware is required for fabric/dashboard AppThunks (PR-17).
// Immutable/serializable checks stay off until PR-18b restores full
// getDefaultMiddleware with instance.metrics ignores. Jumpstate middleware
// remains for residual instance/threads Effects.
const store = configureStore({
  reducer: {
    dashboards,
    fabric,
    instance,
    settings,
    threadsTable
  },
  middleware: (getDefaultMiddleware) => {
    const defaults = getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      actionCreatorCheck: false
    });
    return process.env.NODE_ENV === `development`
      ? defaults.concat(CreateJumpstateMiddleware(), logger)
      : defaults.concat(CreateJumpstateMiddleware());
  }
});

// Explicit ThunkDispatch: concat(CreateJumpstateMiddleware()) widens the
// inferred middleware tuple enough that `typeof store.dispatch` drops thunk
// overload resolution for AppThunk call sites.
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
export type { AppThunk } from "./appThunk";
export default store;
