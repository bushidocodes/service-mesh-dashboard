import { Actions } from "jumpstate";
import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { LazyLoader } from "components/LazyLoader";

const DefaultRouter = LazyLoader({
  loader: () => import("./scenes/DefaultInstanceView")
});

const GoRouter = LazyLoader({
  loader: () => import("./scenes/GoInstanceView")
});

const JVMRouter = LazyLoader({
  loader: () => import("./scenes/JVMInstanceView")
});

/**
 * InstanceView is an intermediate router that is responsible for directing to the appropriate runtime-specific router
 * and optionally calling Actions.selectInstance if the instance isn't currently selected
 * @export
 * @param {Object} props - see propTypes
 * @returns JSX.Element
 */
class InstanceView extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired, // Computed value derived and passed from Fabric Router
    instanceID: PropTypes.string.isRequired, // Route param passed from Fabric Router
    runtime: PropTypes.string.isRequired,
    selectedInstanceID: PropTypes.string,
    selectedServiceSlug: PropTypes.string,
    serviceName: PropTypes.string, // Route param passed from Fabric Router
    serviceVersion: PropTypes.string // Route param passed from Fabric Router
  };

  componentWillMount() {
    this.selectInstanceIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.selectInstanceIfNeeded(nextProps);
  }

  /**
   * Helper function that checks if the service specified by the router params
   * differs from the current selected service instance and invokes the
   * selectInstance JumpState action if required
   *
   * @param {any} {
   *     selectedServiceSlug,
   *     selectedInstanceID,
   *     serviceSlug,
   *     instanceID
   *   }
   * @memberof InstanceView
   */
  selectInstanceIfNeeded({
    selectedServiceSlug,
    selectedInstanceID,
    serviceSlug,
    instanceID
  }) {
    if (
      serviceSlug &&
      instanceID &&
      (serviceSlug !== selectedServiceSlug || instanceID !== selectedInstanceID)
    ) {
      Actions.selectInstance({
        instanceID,
        serviceSlug
      });
    }
  }

  render() {
    const { baseURL, runtime } = this.props;
    switch (runtime) {
      case "JVM":
        return <JVMRouter baseURL={baseURL} />;
      case "GO":
        return <GoRouter baseURL={baseURL} />;
      default:
        return <DefaultRouter baseURL={baseURL} />;
    }
  }
}

function mapStateToProps(state) {
  return {
    selectedServiceSlug: state.fabric.selectedServiceSlug,
    selectedInstanceID: state.fabric.selectedInstanceID
  };
}

export default withRouter(connect(mapStateToProps)(InstanceView));
