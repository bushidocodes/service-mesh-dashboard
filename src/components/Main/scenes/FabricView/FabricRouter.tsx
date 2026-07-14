import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import React, { Suspense } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import type { RootState, Service } from "types";
import FabricGrid from "./components/FabricGrid";
import InstanceRouteElement from "./InstanceRouteElement";
import ServiceRouteElement from "./ServiceRouteElement";
import generateStatusRoutes from "./utils/generateStatusRoutes";

const SettingsGrid = LazyLoader({
  loader: () => import("components/Main/components/Settings")
});

interface FabricRouterProps {
  services?: Record<string, Service>;
}

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
function FabricRouter({ services }: FabricRouterProps) {
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
          element={<FabricGrid services={Object.values(services || {})} />}
        />
      </Routes>
    </Suspense>
  );
}

function mapStateToProps(state: RootState) {
  return { services: state.fabric.services };
}

export default connect(mapStateToProps)(FabricRouter);
