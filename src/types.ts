// Shared domain types for the dashboard.
//
// These TypeScript interfaces replace the runtime `prop-types` shapes that used
// to live in `components/PropTypes` and a few selectors (issue #172). Converted
// .tsx components import the type they need from here, e.g.
//   import type { Service } from "types";
// The legacy runtime `components/PropTypes/index.js` shapes module is kept only
// until every importer has been migrated, then removed with the prop-types dep.

/**
 * A metrics object. The only predictable key is the `timestamps` array; every
 * other key is a metric name mapping to an array of string values.
 */
export interface Metrics {
  timestamps?: string[];
  [metricName: string]: unknown;
}

/**
 * React Router location. Mirrors the subset the app reads (see the v6 withRouter
 * shim, utils/withRouter.js).
 */
export interface RouterLocation {
  hash: string;
  /** Only present for the Browser History router. */
  key?: string;
  pathname: string;
  search: string;
  // Navigation state is an opaque, caller-defined bag (e.g. ServiceView reads
  // `state.message`); `any` keeps those reads ergonomic under the loose config.
  state?: any;
}

/**
 * React Router history. The v6 withRouter shim provides only the subset of
 * methods the app actually uses (the v4 fields action/block/createHref/length/
 * listen are not available).
 */
export interface RouterHistory {
  go: (delta: number) => void;
  goBack: () => void;
  goForward: () => void;
  location: RouterLocation;
  // Accept a path string or a location-descriptor object ({ state }, etc.),
  // matching how the withRouter shim forwards to React Router's navigate().
  push: (path: string | object) => void;
  replace: (path: string | object) => void;
}

/** React Router match object. */
export interface RouterMatch {
  isExact: boolean;
  params: Record<string, string>;
  path: string;
  url: string;
}

/** A single running instance of a fabric service. */
export interface ServiceInstance {
  name: string;
  start_time: number;
}

/** A fabric service as it appears in `state.fabric.services`. */
export interface Service {
  authorized: boolean;
  capability: string;
  documentation: string;
  instances?: ServiceInstance[];
  maximum: number;
  metered: boolean;
  minimum: number;
  name: string;
  owner: string;
  runtime: string;
  threaded: boolean;
  version: string;
}

/**
 * A react-intl message descriptor. Several dashboard fields accept either a
 * plain string or one of these (consumed via intl.formatMessage).
 */
export interface IntlMessageDescriptor {
  id: string;
  defaultMessage?: string;
  description?: string;
}

/** A field that is either a plain string or a react-intl message descriptor. */
export type StringOrIntlMessage = string | IntlMessageDescriptor;

export interface DychartTimeseriesPoint {
  attribute: string;
  baseUnit?: string;
  label: StringOrIntlMessage;
  precision?: number;
  resultUnit?: string;
  type: string;
  value?: string;
}

export interface GMLineChartConfig {
  key: string;
  data?: {
    timeseries?: DychartTimeseriesPoint[];
  };
  title?: StringOrIntlMessage;
  type: string;
}

export interface GMBasicMetricsChartConfig {
  key: string;
  data?: string[][];
  title?: StringOrIntlMessage;
  type: string;
}

export interface GMTableChartConfig {
  key: string;
  data?: {
    headers?: string[];
    rows?: string[][];
  };
  title?: StringOrIntlMessage;
  type: string;
}

export type DashboardChartConfig =
  | GMLineChartConfig
  | GMBasicMetricsChartConfig
  | GMTableChartConfig;

export interface DashboardLayoutItem {
  h: number;
  i: string;
  minH: number;
  minW: number;
  w: number;
  x: number;
  y: number;
}

export interface DashboardGrid {
  breakpoints?: { lg?: number; md?: number; sm?: number };
  cols?: { lg?: number; md?: number; sm?: number };
  layouts?: {
    lg?: DashboardLayoutItem[];
    md?: DashboardLayoutItem[];
    sm?: DashboardLayoutItem[];
  };
  rowHeight?: number;
}

export interface DashboardSummaryCardLineValue {
  baseUnit?: string;
  precision?: number;
  resultUnit?: string;
  type?: string;
  value?: string;
}

export interface DashboardSummaryCardLine {
  name?: StringOrIntlMessage;
  value?: DashboardSummaryCardLineValue[];
}

export interface DashboardSummaryCard {
  icon?: string;
  name?: StringOrIntlMessage;
  lines?: DashboardSummaryCardLine[];
}

export interface Dashboard {
  charts?: DashboardChartConfig[];
  grid?: DashboardGrid;
  name?: string;
  runtime?: string;
  summaryCard?: DashboardSummaryCard;
}

/** A row in the JVM threads table. */
export interface ThreadsTableItem {
  daemon?: boolean;
  id?: number;
  name?: string;
  priority?: number;
  stack?: string[];
  state?: string;
  /** Added by ThreadsTable when grouping rows by state bucket. */
  header?: string;
}

/**
 * A service as displayed in the fabric list/cards (a flattened view of
 * {@link Service} with derived display fields).
 */
export interface ServiceItem {
  authorized?: boolean;
  docsLink?: string;
  headerTitle?: string;
  instances?: ServiceInstance[];
  metered?: boolean;
  name?: string;
  runtime?: string;
  status?: string;
  version?: string;
}

/** Aggregated JVM thread counts by state bucket (see utils/jvm/selectors). */
export interface ThreadCounts {
  active?: number;
  idle?: number;
  stopped?: number;
  all?: number;
}

// ---------------------------------------------------------------------------
// Redux store shape
//
// One interface per slice (see src/store/states/*), composed into RootState.
// Field types mirror each slice's `initial` value. `selected*` slugs and
// `fabricServer` are `string | null` because the store initializes them to
// null. mapStateToProps functions annotate their argument as RootState.
// ---------------------------------------------------------------------------

/** `state.fabric` — discovered services and polling/selection state. */
export interface FabricState {
  fabricPollingInterval: number;
  isPollingFabric: boolean;
  selectedInstanceID: string | null;
  servicesPollingFailures: number;
  selectedServiceSlug: string | null;
  /** Services indexed by service slug. */
  services: Record<string, Service>;
}

/** `state.instance` — the selected instance's metrics and polling state. */
export interface InstanceState {
  instanceMetricsPollingInterval: number;
  isPollingInstanceMetrics: boolean;
  metricsPollingFailures: number;
  metrics: Metrics;
  threadsError: Record<string, unknown>;
}

/** `state.settings` — app configuration. */
export interface SettingsState {
  fabricServer: string | null;
  threadsFilter: string;
  locale: string;
}

/** The complete Redux state tree (see src/store/index). */
export interface RootState {
  dashboards: Record<string, Dashboard>;
  fabric: FabricState;
  instance: InstanceState;
  settings: SettingsState;
  threadsTable: ThreadsTableItem[];
}
