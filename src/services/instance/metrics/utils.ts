import { getState } from "store/jumpstate";
import { getFabricServer } from "utils/head";

export function buildDiscoveryServiceInstanceMetricsEndpoint() {
  const {
    // fabricServer lives on the settings slice (not fabric); the previous
    // `fabric.fabricServer` read was always undefined and silently fell back to
    // the getFabricServer() default. settings.fabricServer is initialized to
    // that same value, so this is behaviour-preserving but reads the real field.
    settings: { fabricServer = getFabricServer() },
    fabric: { selectedServiceSlug, selectedInstanceID, services }
  } = getState();
  if (!selectedServiceSlug) return null;
  const service = services[selectedServiceSlug];
  if (!service) return null;
  const { name, version } = service;
  return `${fabricServer}/metrics/${name}/${version}/${selectedInstanceID}`;
}

/**
 * Clears the interval with the ID stored at window.refreshInstanceMetricsIntervalID and then
 * wipes window.refreshMetricsIntervalID
 */
export function clearInstanceMetricsPollingIntervalIfNeeded() {
  if (window.refreshInstanceMetricsPollingInterval) {
    clearInterval(window.refreshInstanceMetricsPollingInterval);
    window.refreshInstanceMetricsPollingInterval = null;
  }
}
