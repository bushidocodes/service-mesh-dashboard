import type { AppThunk } from "store/appThunk";
import { setDashboards } from "store/states/dashboards";
import type { Dashboard } from "types";
import defaultGoDashboards from "../../json/go/dashboards.json";
import defaultJVMDashboards from "../../json/jvm/dashboards.json";

/**
 * Temporary alternative to directly load the dashboard JSON without use of the
 * localStorage worker. Intended to disable local forage functionality during
 * the initial release.
 *
 * RTK thunk (PR-17) — replaces the jumpstate Effect of the same name.
 */
export function loadDashboardsFromJSON(runtime: string): AppThunk {
  return (dispatch) => {
    switch (runtime) {
      case "JVM":
        dispatch(
          setDashboards(defaultJVMDashboards as Record<string, Dashboard>)
        );
        break;
      case "GO":
        dispatch(
          setDashboards(defaultGoDashboards as Record<string, Dashboard>)
        );
        break;
      default:
        break;
    }
  };
}
