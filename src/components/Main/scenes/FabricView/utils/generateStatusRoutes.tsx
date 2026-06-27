import React from "react";
import { Route } from "react-router-dom";

import FabricGrid from "../components/FabricGrid";

import { microserviceStatuses } from "utils/constants";
import { computeStatus } from "utils/selectors";

/** HOC that loops through microserviceStatuses and generates routes,
 * passing the filtered services to FabricGrid
 * @export
 * @returns JSX.Element
 **/

function generateStatusRoutes(services: any) {
  return microserviceStatuses.map((route: string) => {
    const filtered = Object.values(services).filter((service: any) => {
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
