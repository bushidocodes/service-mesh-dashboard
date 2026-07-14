import { State } from "store/jumpstate";
import type { FabricState, Service } from "types";
import "services/fabricMicroservices";

const fabric = State({
  initial: {
    fabricPollingInterval: 5000,
    isPollingFabric: false,
    selectedInstanceID: null,
    servicesPollingFailures: 0,
    selectedServiceSlug: null,
    services: {} //indexed by service ID
  } satisfies FabricState,
  setFabricPollingInterval(state: FabricState, payload: number) {
    return { ...state, fabricPollingInterval: payload };
  },
  setIsPollingFabric(state: FabricState, payload: boolean) {
    return { ...state, isPollingFabric: payload };
  },
  setSelectedInstanceID(state: FabricState, payload: string | null) {
    return { ...state, selectedInstanceID: payload };
  },
  setServicesPollingFailures(state: FabricState, payload: number) {
    return { ...state, servicesPollingFailures: payload };
  },
  setSelectedServiceSlug(state: FabricState, payload: string | null) {
    return { ...state, selectedServiceSlug: payload };
  },
  setFabricMicroservices(
    state: FabricState,
    services: Record<string, Service>
  ) {
    return { ...state, services };
  }
});

export default fabric;
