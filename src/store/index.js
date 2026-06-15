// Commented out imports are used by currently disabled local storage functionality
import { CreateJumpstateMiddleware } from "./jumpstate";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import dashboards from "./states/dashboards";
import fabric from "./states/fabric";
import instance from "./states/instance";
import settings from "./states/settings";
import threadsTable from "./states/threadsTable";

// Prepare Redux Middlewares
const middlewares = [CreateJumpstateMiddleware()];
if (process.env.NODE_ENV === `development`) {
  middlewares.push(logger);
}

// Create the Redux store using reducers and middlewares.
// middleware: () => [...] replaces RTK's default middleware set so only the
// jumpstate shim (and optional logger) run — preserving pre-v5 behaviour.
export default configureStore({
  reducer: {
    dashboards,
    fabric,
    instance,
    settings,
    threadsTable
  },
  middleware: () => middlewares
});
