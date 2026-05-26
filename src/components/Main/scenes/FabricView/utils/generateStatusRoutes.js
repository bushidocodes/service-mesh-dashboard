import React from "react";
import { Route } from "react-router";
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
    route = route.toLowerCase();
    return (
      <Route
        exact
        key={`/${route}`}
        path={`/${route}`}
        render={(props) => {
          return (
            <FabricGrid
              {...props}
              services={_.values(services).filter((service) => {
                let status = computeStatus(
                  service.instances.length,
                  service.minimum,
                  service.maximum
                );
                return status.toLowerCase() === route;
              })}
              statusView={true}
            />
          );
        }}
      />
    );
  });
}
export default generateStatusRoutes;
