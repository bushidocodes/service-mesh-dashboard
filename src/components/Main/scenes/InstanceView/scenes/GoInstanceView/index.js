import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { PropTypes } from "prop-types";

import { LazyLoader } from "components/LazyLoader";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";

const SummaryGrid = LazyLoader({
  loader: () => import("./scenes/Summary")
});

const FunctionsGrid = LazyLoader({
  loader: () => import("./scenes/Functions")
});

const RoutesGrid = LazyLoader({
  loader: () => import("../../components/Routes")
});

const SettingsGrid = LazyLoader({
  loader: () => import("components/Main/components/Settings")
});

const Explorer = LazyLoader({
  loader: () => import("components/Main/components/Explorer")
});

const GMGrid = LazyLoader({
  loader: () => import("components/Main/components/GMGrid")
});

GoInstanceRouter.propTypes = {
  baseURL: PropTypes.string
};

/**
 * Go Runtime Router
 * @export
 * @returns JSX.Element
 */
export default function GoInstanceRouter({ baseURL }) {
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
      <Route component={RoutesGrid} path={`${baseURL}/routes`} />
      <Route component={FunctionsGrid} path={`${baseURL}/functions`} />
      {/* General Routes shared by all runtimes */}
      {/* Only route to settings if this we aren't using FabricRouter */}
      {!baseURL && <Route component={SettingsGrid} exact path="/settings" />}
      <Route component={Explorer} path={`${baseURL}/explorer`} />
      {/* Catch all route for dynamically generated dashboards */}
      <Route component={GMGrid} path={`${baseURL}/:dashboardName`} />
      {/* Should never match, but included just in case */}
      <Route component={NotFound} path="*" />
    </Switch>
  );
}
