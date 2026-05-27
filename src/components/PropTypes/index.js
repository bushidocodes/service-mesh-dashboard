import { PropTypes } from "prop-types";

// Metrics Shape
// The only predictable key in a metrics onbject is the timestamps key
export const metricsShape = PropTypes.shape({
  timestamps: PropTypes.arrayOf(PropTypes.string)
});

// React Router Location Shape
// Based on https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/location.md
export const routerLocationShape = PropTypes.shape({
  hash: PropTypes.string.isRequired,
  key: PropTypes.string, // Only present for Browser History Router
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.object
});

// getStatusCount Results Shape

// Button Style Shape

// React Router History Shape
// Updated for React Router v6: the withRouter shim (utils/withRouter.js) provides
// only the subset of history methods that the app actually uses. v4-specific fields
// (action, block, createHref, length, listen) are not available in v6.
export const routerHistoryShape = PropTypes.shape({
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  location: routerLocationShape.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired
});
// React Router Match Shape
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/match.md
export const routerMatchShape = PropTypes.shape({
  isExact: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
});

// Dashboard shape

// Readout Item Container Style Shape

// Readout Items Style Shape

// Readout Items Value Shape

// Instance Object
export const serviceInstanceShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  start_time: PropTypes.number.isRequired
});

// Fabric Services Object
// from state.fabric.services
export const serviceShape = PropTypes.shape({
  authorized: PropTypes.bool.isRequired,
  capability: PropTypes.string.isRequired,
  documentation: PropTypes.string.isRequired,
  instances: PropTypes.oneOfType([
    PropTypes.arrayOf(serviceInstanceShape),
    PropTypes.array
  ]),
  maximum: PropTypes.number.isRequired,
  metered: PropTypes.bool.isRequired,
  minimum: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  runtime: PropTypes.string.isRequired,
  threaded: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired
});

// Array of { headerTitle, name, version, docsLink, status }
// headerTitle: Thing that we group by
// name: Name of the service
// version: Version of the service
// docsLink: URL to the documentation
// status: string equal to "Stable", "Warning", or "Down"

// Dashboard Chart
const dychartTimeseriesPointShape = PropTypes.shape({
  attribute: PropTypes.string.isRequired,
  baseUnit: PropTypes.string,
  label: PropTypes.string.isRequired,
  precision: PropTypes.number,
  resultUnit: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string
});
const gmLineChartShape = PropTypes.shape({
  data: PropTypes.shape({
    timeseries: PropTypes.arrayOf(dychartTimeseriesPointShape)
  }),
  title: PropTypes.string,
  type: PropTypes.string.isRequired
});
const gmBasicMetricsChartShape = PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  title: PropTypes.string,
  type: PropTypes.string.isRequired
});

const gmTableChartShape = PropTypes.shape({
  data: {
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
  },
  title: PropTypes.string,
  type: PropTypes.string.isRequired
});

const dashboardLayoutItemShape = PropTypes.shape({
  h: PropTypes.number.isRequired,
  i: PropTypes.string.isRequired,
  minH: PropTypes.number.isRequired,
  minW: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
});

const gridShape = PropTypes.shape({
  breakpoints: PropTypes.shape({
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number
  }),
  cols: PropTypes.shape({
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number
  }),
  layouts: PropTypes.shape({
    lg: PropTypes.arrayOf(dashboardLayoutItemShape),
    md: PropTypes.arrayOf(dashboardLayoutItemShape),
    sm: PropTypes.arrayOf(dashboardLayoutItemShape)
  }),
  rowHeight: PropTypes.number
});

export const dashboardShape = PropTypes.shape({
  charts: PropTypes.arrayOf(
    PropTypes.oneOfType([
      gmLineChartShape,
      gmBasicMetricsChartShape,
      gmTableChartShape
    ])
  ),
  grid: gridShape,
  name: PropTypes.string,
  runtime: PropTypes.string,
  summaryCard: PropTypes.shape({
    icon: PropTypes.string,
    lines: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.arrayOf(
          PropTypes.shape({
            baseUnit: PropTypes.string,
            precision: PropTypes.number,
            resultUnit: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.string
          })
        )
      })
    )
  })
});

export const threadsTableItemShape = PropTypes.shape({
  daemon: PropTypes.bool,
  name: PropTypes.string,
  priority: PropTypes.number,
  stack: PropTypes.arrayOf(PropTypes.string),
  state: PropTypes.string
});

export const serviceItemShape = PropTypes.shape({
  authorized: PropTypes.bool,
  docsLink: PropTypes.string,
  headerTitle: PropTypes.string,
  instances: PropTypes.arrayOf(serviceInstanceShape),
  metered: PropTypes.bool,
  name: PropTypes.string,
  runtime: PropTypes.string,
  status: PropTypes.string,
  version: PropTypes.string
});
