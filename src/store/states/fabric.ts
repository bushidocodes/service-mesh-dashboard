import { State } from "store/jumpstate";
import "services/fabricMicroservices";

const fabric = State({
  initial: {
    fabricPollingInterval: 5000,
    isPollingFabric: false,
    selectedInstanceID: null,
    servicesPollingFailures: 0,
    selectedServiceSlug: null,
    services: {} //indexed by service ID
  },
  setFabricPollingInterval(state: any, payload: any) {
    return { ...state, fabricPollingInterval: payload };
  },
  setIsPollingFabric(state: any, payload: any) {
    return { ...state, isPollingFabric: payload };
  },
  setSelectedInstanceID(state: any, payload: any) {
    return { ...state, selectedInstanceID: payload };
  },
  setServicesPollingFailures(state: any, payload: any) {
    return { ...state, servicesPollingFailures: payload };
  },
  setSelectedServiceSlug(state: any, payload: any) {
    return { ...state, selectedServiceSlug: payload };
  },
  setFabricMicroservices(state: any, services: any) {
    return { ...state, services };
  }
});

export default fabric;
