// Commented out imports are used by currently disabled local storage functionality

import { configureStore, Tuple } from "@reduxjs/toolkit";
// redux-logger is a CJS/UMD module whose logger fn lives at both `.default`
// and the named `logger` export. Vite 8's Rolldown dep-optimizer resolves the
// *default* import to the namespace object (not a function), which makes
// configureStore throw "each middleware provided ... must be a function" at
// boot. Use the named export, which is stable across the esbuild→Rolldown
// interop change. (esbuild in Vite ≤7 resolved the default correctly.)
import { logger } from "redux-logger";
import { CreateJumpstateMiddleware } from "./jumpstate";

import dashboards from "./states/dashboards";
import fabric from "./states/fabric";
import instance from "./states/instance";
import settings from "./states/settings";
import threadsTable from "./states/threadsTable";

// Create the Redux store using reducers and middlewares.
// middleware: () => new Tuple(...) replaces RTK's default middleware set so only
// the jumpstate shim (and optional logger) run — preserving pre-v5 behaviour.
const store = configureStore({
  reducer: {
    dashboards,
    fabric,
    instance,
    settings,
    threadsTable
  },
  middleware: () =>
    process.env.NODE_ENV === `development`
      ? new Tuple(CreateJumpstateMiddleware(), logger)
      : new Tuple(CreateJumpstateMiddleware())
});

export type AppDispatch = typeof store.dispatch;
export default store;
