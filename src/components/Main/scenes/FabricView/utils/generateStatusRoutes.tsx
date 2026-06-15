import React from "react";
import { Route } from "react-router-dom";
import _ from "lodash";

import FabricGrid from "../components/FabricGrid";

import { microserviceStatuses } from "utils/constants";
import { computeStatus } from "utils/selectors";

/** HOC that loops through microserviceStatuses and generates routes,
 * passing the filtered services to FabricGrid
 * @export
 * @returns JSX.Element
 **/

function generateStatusRoutes(services) {
  return microserviceStatuses.map((route) => {
    const filtered = _.values(services).filter((service) => {
      let status = computeStatus(
        service.instances.length,
        service.minimum,
        service.maximum
      );
      return status === route;
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
