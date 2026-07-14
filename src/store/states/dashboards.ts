import { State } from "store/jumpstate";
import type { Dashboard } from "types";

const dashboards = State({
  initial: {} as Record<string, Dashboard>,
  setDashboards(
    _state: Record<string, Dashboard>,
    dashboards: Record<string, Dashboard>
  ) {
    return dashboards;
  }
});

export default dashboards;
