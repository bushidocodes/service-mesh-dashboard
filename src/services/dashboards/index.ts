import { Actions, Effect } from "store/jumpstate";
import defaultJVMDashboards from "../../json/jvm/dashboards.json";
import defaultGoDashboards from "../../json/go/dashboards.json";

/**
 * This effect is a temporary alternative to directly load the dashboard JSON without use of the
 * localStorage worker. The intended use of this Effect is to disable local forage functionality
 * during the initial release
 * @param {string}
 * @returns
 */
function loadDashboardsFromJSONEffect(runtime: string) {
  // Check runtime and pass the runtime appropriate JSON file to Actions.updateDashboardsRedux
  switch (runtime) {
    case "JVM":
      return Actions.setDashboards(defaultJVMDashboards);
    case "GO":
      return Actions.setDashboards(defaultGoDashboards);
    default:
      return;
  }
}
Effect("loadDashboardsFromJSON", loadDashboardsFromJSONEffect);
