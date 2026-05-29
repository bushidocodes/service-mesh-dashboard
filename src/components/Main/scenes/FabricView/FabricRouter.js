import _ from "lodash";
import React, { Suspense } from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";

import FabricGrid from "./components/FabricGrid";
import generateStatusRoutes from "./utils/generateStatusRoutes";
import InstanceRouteElement from "./InstanceRouteElement";
import ServiceRouteElement from "./ServiceRouteElement";
import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";

import { serviceShape } from "components/PropTypes";

const SettingsGrid = LazyLoader({
  loader: () => import("components/Main/components/Settings")
});

/**
 * Fabric Router is a top-level router that sits between the root container and the Instance Router
 * that injects the following additional route parameters
 *
 * serviceSlug - The slug of the selected microservice
 * instanceID - The ID of the selected microservice instance of the service with the slug serviceSlug
 *
 * @export
 * @returns JSX.Element
 */
function FabricRouter({ services }) {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/settings" element={<SettingsGrid />} />
        <Route
          path="/:serviceSlug/:instanceID/*"
          element={<InstanceRouteElement services={services} />}
        />

        {/* Utility function that generates Routes for /down, /warning, and /stable */}
        {generateStatusRoutes(services)}

        <Route
          path="/:selectedServiceSlug"
          element={<ServiceRouteElement services={services} />}
        />
        {/* For the root route, mount the Fabric Grid, the element used to depict an entire Fabric of microservices*/}
        <Route
          path="/"
          element={<FabricGrid services={_.values(services)} />}
        />
      </Routes>
    </Suspense>
  );
}

// `services` is the state.fabric.services map (keyed by service slug), not a
// single service — note the _.values(services) / services[slug] / Object.keys
// access below. Validating it as a bare `serviceShape` made React check for a
// top-level `services.authorized`, which is always undefined and fired a
// "Failed prop type" warning on every render (including the initial one before
// the SDS fetch resolves). objectOf(serviceShape) is the correct shape.
FabricRouter.propTypes = {
  services: PropTypes.objectOf(serviceShape)
};

function mapStateToProps(state) {
  return { services: state.fabric.services };
}

export default connect(mapStateToProps)(FabricRouter);
