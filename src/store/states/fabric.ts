import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FabricState, Service } from "types";

// Side-import so fabric microservice thunks load when this slice is registered
// (historical Effect registration used the same pattern; module cache avoids
// double work with services/index.ts).
import "services/fabricMicroservices";

const initialState: FabricState = {
  fabricPollingInterval: 5000,
  isPollingFabric: false,
  selectedInstanceID: null,
  servicesPollingFailures: 0,
  selectedServiceSlug: null,
  services: {} // indexed by service slug
};

// RTK fabric slice (PR-17). Action types are namespaced by default
// (`fabric/setFabricMicroservices`, …) — no jumpstate flat type parity (KD-15).
const fabricSlice = createSlice({
  name: "fabric",
  initialState,
  reducers: {
    setFabricPollingInterval(state, action: PayloadAction<number>) {
      state.fabricPollingInterval = action.payload;
    },
    setIsPollingFabric(state, action: PayloadAction<boolean>) {
      state.isPollingFabric = action.payload;
    },
    setSelectedInstanceID(state, action: PayloadAction<string | null>) {
      state.selectedInstanceID = action.payload;
    },
    setServicesPollingFailures(state, action: PayloadAction<number>) {
      state.servicesPollingFailures = action.payload;
    },
    setSelectedServiceSlug(state, action: PayloadAction<string | null>) {
      state.selectedServiceSlug = action.payload;
    },
    setFabricMicroservices(
      state,
      action: PayloadAction<Record<string, Service>>
    ) {
      state.services = action.payload;
    }
  }
});

export const {
  setFabricPollingInterval,
  setIsPollingFabric,
  setSelectedInstanceID,
  setServicesPollingFailures,
  setSelectedServiceSlug,
  setFabricMicroservices
} = fabricSlice.actions;

export default fabricSlice.reducer;
