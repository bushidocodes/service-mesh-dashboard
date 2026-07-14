import { Route } from "react-router-dom";
import type { Service } from "types";
import { microserviceStatuses } from "utils/constants";
import { computeStatus } from "utils/selectors";
import FabricGrid from "../components/FabricGrid";

/** HOC that loops through microserviceStatuses and generates routes,
 * passing the filtered services to FabricGrid
 * @export
 * @returns JSX.Element
 **/

function generateStatusRoutes(services?: Record<string, Service>) {
  return microserviceStatuses.map((route: string) => {
    const filtered = Object.values(services || {}).filter((service) => {
      let status = computeStatus(
        service.instances?.length ?? 0,
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
