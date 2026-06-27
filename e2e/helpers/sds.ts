import { type APIRequestContext } from "@playwright/test";

export interface MockService {
  name: string;
  version: string;
  owner: string;
  capability: string;
  runtime: string;
  minimum: number;
  maximum: number;
  authorized: boolean;
  instances: { name: string; start_time: number }[];
  [key: string]: unknown;
}

/**
 * Fetches the live service list from the mock discovery service via the Vite
 * proxy. The mock generates this list randomly at startup but keeps it stable
 * for the life of the server process, so tests derive expectations from it at
 * runtime instead of from a static fixture (see PLAYWRIGHT_MIGRATION_PLAN §4.2).
 */
export async function fetchServices(
  request: APIRequestContext
): Promise<MockService[]> {
  const res = await request.get("/services");
  if (!res.ok()) {
    throw new Error(`GET /services failed: ${res.status()}`);
  }
  return res.json();
}

/**
 * Mirrors src/utils slugify + slugifyMicroservice so tests can compute a
 * service's route ("#/<slug>") and navigate directly, instead of hunting for
 * its card in the grid. Kept in sync with src/utils/index.ts.
 */
export function slugify(input: string): string {
  return input
    .replace(/\s/g, "-")
    .replace(/[()=:.,!#$@"'/|?*+&[\]]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function serviceSlug(service: MockService): string {
  return slugify(`${service.name}-v${service.version.replace(/\./g, "-")}`);
}

/** Mirror of src/utils/selectors.ts computeStatus. */
export function computeStatus(
  count: number,
  min: number,
  max: number
): "Down" | "Stable" | "Warning" {
  if (count === 0) return "Down";
  if (count >= min && count <= max) return "Stable";
  return "Warning";
}

/**
 * Picks a metered, authorized service of the given runtime that has at least
 * `minInstances` instances — i.e. one whose instance view will load metrics.
 */
export function pickByRuntime(
  services: MockService[],
  runtime: "JVM" | "GO",
  minInstances = 1
): MockService | undefined {
  return services.find(
    (s) =>
      s.runtime === runtime &&
      s.authorized &&
      s.metered === true &&
      s.instances &&
      s.instances.length >= minInstances
  );
}

/** Unique, lowercased values of a field across the service list, first-seen order. */
export function uniqueLower(
  services: MockService[],
  field: "owner" | "capability"
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const svc of services) {
    const val = String(svc[field] ?? "").toLowerCase();
    if (!seen.has(val)) {
      seen.add(val);
      out.push(val);
    }
  }
  return out;
}
