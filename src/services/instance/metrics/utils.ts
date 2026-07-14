import type { RootState } from "types";
import { getFabricServer } from "utils/head";

/**
 * Build the discovery-service metrics URL for the currently selected instance.
 * Callers pass `getState()` (thunk) or a fixture root state (tests) — no global
 * jumpstate `getState` (PR-18b).
 */
export function buildDiscoveryServiceInstanceMetricsEndpoint(state: RootState) {
  const {
    // fabricServer lives on the settings slice (not fabric); the previous
    // `fabric.fabricServer` read was always undefined and silently fell back to
    // the getFabricServer() default. settings.fabricServer is initialized to
    // that same value, so this is behaviour-preserving but reads the real field.
    settings: { fabricServer = getFabricServer() },
    fabric: { selectedServiceSlug, selectedInstanceID, services }
  } = state;
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
