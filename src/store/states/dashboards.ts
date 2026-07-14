import { State } from "store/jumpstate";

const dashboards = State({
  initial: {},
  setDashboards(_state: any, dashboards: any) {
    return dashboards;
  }
});

export default dashboards;
