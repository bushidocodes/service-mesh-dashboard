import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Dashboard } from "types";

// RTK dashboards slice (PR-17). Action type is namespaced by default
// (`dashboards/setDashboards`) — no jumpstate flat type parity (KD-15).
const dashboardsSlice = createSlice({
  name: "dashboards",
  initialState: {} as Record<string, Dashboard>,
  reducers: {
    setDashboards(_state, action: PayloadAction<Record<string, Dashboard>>) {
      return action.payload;
    }
  }
});

export const { setDashboards } = dashboardsSlice.actions;
export default dashboardsSlice.reducer;
