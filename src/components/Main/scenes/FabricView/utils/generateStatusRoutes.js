import React from "react";
import { Route } from "react-router-dom";
import _ from "lodash";

import FabricGrid from "../components/FabricGrid";

import { microserviceStatuses } from "utils/constants";
import { computeStatus } from "utils/selectors";

/**
 * Generates <Route> elements for each microservice status (/stable, /down, /warning),
 * passing only the matching services to FabricGrid.
 * @export
 * @returns JSX.Element[]
 */
function generateStatusRoutes(services) {
  return microserviceStatuses.map((status) => {
    const route = status.toLowerCase();
    const filtered = _.values(services).filter((service) => {
      const s = computeStatus(
        service.instances.length,
        service.minimum,
        service.maximum
      );
      return s.toLowerCase() === route;
    });
    return (
      <Route
        key={`/${route}`}
        path={`/${route}`}
        element={<FabricGrid services={filtered} statusView={true} />}
      />
    );
  });
}

export default generateStatusRoutes;
