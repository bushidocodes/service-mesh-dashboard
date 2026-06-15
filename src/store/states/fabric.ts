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
  setFabricPollingInterval(state, payload) {
    return { ...state, fabricPollingInterval: payload };
  },
  setIsPollingFabric(state, payload) {
    return { ...state, isPollingFabric: payload };
  },
  setSelectedInstanceID(state, payload) {
    return { ...state, selectedInstanceID: payload };
  },
  setServicesPollingFailures(state, payload) {
    return { ...state, servicesPollingFailures: payload };
  },
  setSelectedServiceSlug(state, payload) {
    return { ...state, selectedServiceSlug: payload };
  },
  setFabricMicroservices(state, services) {
    return { ...state, services };
  }
});

export default fabric;
