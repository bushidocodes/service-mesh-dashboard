import { Actions } from "jumpstate";
import { PropTypes } from "prop-types";
import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";

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
    const { runtime } = this.props;
    let RuntimeRouter;
    switch (runtime) {
      case "JVM":
        RuntimeRouter = JVMRouter;
        break;
      case "GO":
        RuntimeRouter = GoRouter;
        break;
      default:
        RuntimeRouter = DefaultRouter;
    }
    return (
      <Suspense fallback={<Loading />}>
        <RuntimeRouter />
      </Suspense>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedServiceSlug: state.fabric.selectedServiceSlug,
    selectedInstanceID: state.fabric.selectedInstanceID
  };
}

export default connect(mapStateToProps)(InstanceView);
