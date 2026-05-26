import React from "react";
import { PropTypes } from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";

import { LazyLoader } from "components/LazyLoader";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";

const SummaryGrid = LazyLoader({
  loader: () => import("./scenes/Summary")
});

const ThreadsGrid = LazyLoader({
  loader: () => import("./scenes/Threads")
});

const RoutesGrid = LazyLoader({
  loader: () => import("../../components/Routes")
});

const Explorer = LazyLoader({
  loader: () => import("components/Main/components/Explorer")
});

const GMGrid = LazyLoader({
  loader: () => import("components/Main/components/GMGrid")
});

JVMInstanceRouter.propTypes = {
  baseURL: PropTypes.string
};

/**
 * JVM Runtime Router
 * @export
 * @returns JSX.Element
 */
export default function JVMInstanceRouter({ baseURL }) {
  return (
    <Switch>
      {/* Root Redirect */}
      <Route
        exact
        path={baseURL}
        render={() => <Redirect to={`${baseURL}/summary`} />}
      />
      {/* Custom Runtime Specific Stuff */}
      <Route component={SummaryGrid} path={`${baseURL}/summary`} />
      <Route component={ThreadsGrid} path={`${baseURL}/threads`} />
      <Route component={RoutesGrid} path={`${baseURL}/routes`} />
      {/* General Routes shared by all runtimes */}
      <Route component={Explorer} path={`${baseURL}/explorer`} />
      {/* Catch all route for dynamically generated dashboards */}
      <Route component={GMGrid} path={`${baseURL}/:dashboardName`} />
      {/* Should never match, but included just in case */}
      <Route component={NotFound} path="*" />
    </Switch>
  );
}
