import { Actions } from "store/jumpstate";
import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { withRouter } from "utils/withRouter";

import AppContent from "./components/AppContent";
import ErrorBoundary from "components/ErrorBoundary";
import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";

import { getFabricServer } from "utils/head";
import type { Dashboard } from "types";

interface MainProps {
  dashboards?: Record<string, Dashboard>;
  fabricServer?: string;
  runtime?: string;
}

const FabricRouter = LazyLoader({
  loader: () => import("./scenes/FabricView")
});

/**
 * Base React Component of GM Fabric Dashboard
 * @class Main
 * @extends {Component}
 */

class Main extends Component<MainProps> {
  /** Perform initial setup when the App first loads */
  componentDidMount() {
    const fabricServer = getFabricServer();
    if (fabricServer) {
      console.log("Fabric Server Detected");
      // Begin polling Fabric-wide metrics from the Fabric Server
      Actions.startPollingFabricMicroservices({ endpoint: fabricServer });
    } else {
      console.log("Fabric Server Not Defined!");
    }
  }

  componentDidUpdate() {
    const { dashboards, runtime } = this.props;
    // If the app initially loads before we've gotten a response from the Fabric Server, load the dynamic dashboards
    // once we figure out the runtime
    if (Object.keys(dashboards).length === 0 && runtime) {
      console.log(`Loading dashboards for ${runtime}`);
      Actions.loadDashboardsFromJSON(runtime);
    }
  }

  render() {
    return (
      <AppContent id="main-content" tabIndex={0}>
        {/* main-content id is here so that SkipNav can focus on it */}
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <FabricRouter />
          </Suspense>
        </ErrorBoundary>
      </AppContent>
    );
  }
}

function mapStateToProps(state) {
  const { dashboards } = state;
  return {
    dashboards
  };
}

export default withRouter(connect(mapStateToProps)(Main));
