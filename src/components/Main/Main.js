import { Actions } from "jumpstate";
import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AppContent from "./components/AppContent";
import { LazyLoader } from "components/LazyLoader";

import { getFabricServer } from "utils/head";
import { dashboardShape } from "components/PropTypes";

const FabricRouter = LazyLoader({
  loader: () => import("./scenes/FabricView")
});

/**
 * Base React Component of GM Fabric Dashboard
 * @class Main
 * @extends {Component}
 */

class Main extends Component {
  static propTypes = {
    dashboards: PropTypes.objectOf(dashboardShape),
    fabricServer: PropTypes.string,
    runtime: PropTypes.string
  };

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

  componentWillUpdate({ dashboards, runtime }) {
    // If the app initially loads before we've gotten a response from the Fabric Server, load the dynamic dashboards
    // once we figure out the runtime
    if (Object.keys(dashboards).length === 0 && runtime) {
      console.log(`Loading dashboards for ${runtime}`);
      Actions.loadDashboardsFromJSON(runtime);
    }
  }

  render() {
    return (
      <AppContent id="main-content" tabIndex="0">
        {/* main-content id is here so that SkipNav can focus on it */}
        <FabricRouter />
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
