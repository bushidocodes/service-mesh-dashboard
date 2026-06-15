import { State } from "store/jumpstate";

const dashboards = State({
  initial: {},
  setDashboards(state, dashboards) {
    return dashboards;
  }
});

export default dashboards;
