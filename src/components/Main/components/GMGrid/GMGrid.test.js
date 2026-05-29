/* eslint-disable react/no-multi-comp, react/prop-types -- lightweight jest.mock stubs */
import React from "react";
import { render, screen } from "@testing-library/react";

import GMBasicMetrics from "./components/GMBasicMetrics";
import GMLineChart from "../GMLineChart";
import GMTable from "./components/GMTable";
import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";

// Use named export {GMGrid} for unconnected component for tests
// Connected Components section from https://redux.js.org/docs/recipes/WritingTests.html
import { GMGrid } from "./GMGrid";

// GMGrid maps a dashboard's JSON config to chart components inside an
// ErrorBoundary + responsive grid. Enzyme counted those children by type
// (.find(Comp)); RTL is DOM-based, so each child chart is replaced with an
// identifiable stub and ErrorBoundary with a pass-through stub. This keeps the
// "renders N of chart type X" assertions observable without mounting the real
// (canvas/dygraph-heavy) charts — mirroring the original shallow render.
jest.mock("../GMLineChart", () => {
  const React = require("react");
  return () => React.createElement("div", { "data-testid": "gm-line-chart" });
});
jest.mock("./components/GMTable", () => {
  const React = require("react");
  return () => React.createElement("div", { "data-testid": "gm-table" });
});
jest.mock("./components/GMBasicMetrics", () => {
  const React = require("react");
  return () =>
    React.createElement("div", { "data-testid": "gm-basic-metrics" });
});
jest.mock("components/Main/components/NotFoundError", () => {
  const React = require("react");
  return () => React.createElement("div", { "data-testid": "not-found-error" });
});
jest.mock("components/ErrorBoundary", () => {
  const React = require("react");
  return ({ children }) =>
    React.createElement("div", { "data-testid": "error-boundary" }, children);
});
// react-grid-layout/legacy measures the DOM (WidthProvider) and cannot mount in
// jsdom — the original shallow render never reached it. Stub it to a plain
// container that renders its children so the chart stubs inside stay countable.
jest.mock("react-grid-layout/legacy", () => {
  const React = require("react");
  return {
    __esModule: true,
    Responsive: ({ children }) =>
      React.createElement("div", { "data-testid": "grid" }, children),
    WidthProvider: (Comp) => Comp
  };
});

let props = {
  dashboard: {
    name: "Go",
    runtime: "GO",
    summaryCard: {
      icon: "Go",
      chart: {
        type: "value",
        dataAttribute: "go_metrics/runtime/alloc_bytes"
      },
      lines: [
        {
          name: "Heap Used",
          value: [
            {
              type: "latest",
              value: "go_metrics/runtime/alloc_bytes",
              baseUnit: "B",
              resultUnit: "MB",
              precision: 3
            },
            { type: "string", value: "MB" }
          ]
        }
      ]
    },
    grid: {
      breakpoints: { lg: 1200, md: 996, sm: 768 },
      cols: { lg: 12, md: 8, sm: 4 },
      layouts: {
        lg: [
          { i: "Heap", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
          { i: "Goroutines", x: 6, y: 0, w: 6, h: 9, minW: 4, minH: 5 }
        ],
        md: [
          { i: "Heap", x: 0, y: 0, w: 8, h: 9, minW: 4, minH: 5 },
          { i: "Goroutines", x: 0, y: 9, w: 8, h: 9, minW: 4, minH: 5 }
        ],
        sm: [
          { i: "Heap", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
          { i: "Goroutines", x: 6, y: 0, w: 6, h: 9, minW: 4, minH: 5 }
        ]
      },
      rowHeight: 60
    },
    charts: [
      {
        key: "Requests",
        title: "Requests",
        type: "GMTable",
        data: {
          headers: ["Requests", "Success"],
          rows: [
            ["http", "http/requests", "http/success"],
            ["https", "https/requests", "https/success"]
          ]
        }
      },
      {
        key: "Response Status Codes",
        title: "Response Status Codes",
        type: "GMBasicMetrics",
        data: {
          detailLines: [
            ["2XX", "status/2XX", "primary", "status/2XX", "value"],
            ["200", "status/200", "primary", "status/200", "value"],
            ["4XX", "status/4XX", "normal", "status/4XX", "value"],
            ["400", "status/400", "normal", "status/400", "value"],
            ["499", "status/499", "normal", "status/499", "value"],
            ["5XX", "status/5XX", "normal", "status/5XX", "value"],
            ["500", "status/500", "normal", "status/500", "value"]
          ]
        }
      },
      {
        key: "Heap",
        title: "Heap",
        type: "GMLineChart",
        data: {
          detailLines: [
            [
              { type: "string", value: "Garbage Collection Runs:" },
              {
                type: "latest",
                value: "go_metrics/runtime/total_gc_runs",
                precision: 3
              }
            ],
            [
              { type: "string", value: "Total GC Pause:" },
              {
                type: "latest",
                value: "go_metrics/runtime/total_gc_pause_ns",
                precision: 3,
                baseUnit: "ns",
                resultUnit: "ms"
              },
              { type: "string", value: "ms" }
            ]
          ],
          timeseries: [
            {
              type: "value",
              attribute: "go_metrics/runtime/alloc_bytes",
              label: "Go Heap Used (MB)",
              precision: 0,
              baseUnit: "B",
              resultUnit: "MB"
            }
          ]
        }
      },
      {
        key: "Goroutines",
        title: "Goroutines",
        type: "GMLineChart",
        data: {
          timeseries: [
            {
              type: "value",
              attribute: "go_metrics/runtime/num_goroutines",
              label: "# of allocated goroutines"
            }
          ]
        }
      }
    ]
  },
  match: {
    isExact: true,
    params: { dashboardName: "go" },
    path: "/",
    url: "/"
  },
  metrics: {
    timestamps: [
      "1510699694557",
      "1510699699598",
      "1510699704508",
      "1510699709508",
      "1510699714507"
    ],
    "Total/requests": {
      1510699694557: 1193438,
      1510699699598: 1193438
    },
    "HTTP/requests": {
      1510699694557: 1193388,
      1510699699598: 1193388,
      1510699704508: 1193388
    }
  },
  name: "go"
};

// The connected default export wraps GMGrid in injectIntl(), which supplies the
// `intl` prop consumed all over renderChart(). The unconnected named export used
// here gets none, so we hand it a minimal mock. This fixture passes plain strings
// (not react-intl message descriptors) as labels/titles, so formatMessage just
// echoes strings back; descriptors are handled defensively for completeness.
const intl = {
  formatMessage: (message) =>
    typeof message === "string"
      ? message
      : (message && (message.defaultMessage || message.id)) || ""
};

describe("Service Instance View: JVM/GO/HTTP <GMGrid>", () => {
  test("matches snapshot", () => {
    const { asFragment } = render(<GMGrid {...props} intl={intl} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders correct components", () => {
    render(<GMGrid {...props} intl={intl} />);
    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
  });

  test("renders appropriate chart type (<GMTable>,<GMBasicMetrics> and <GMLineChart>) when provided dashboard charts", () => {
    render(<GMGrid {...props} intl={intl} />);
    expect(screen.getAllByTestId("gm-line-chart")).toHaveLength(2);
    expect(screen.getAllByTestId("gm-table")).toHaveLength(1);
    expect(screen.getAllByTestId("gm-basic-metrics")).toHaveLength(1);
    expect(screen.queryAllByTestId("not-found-error")).toHaveLength(0);
  });

  test("returns <NotFoundError> if dashboard does not exist", () => {
    render(
      <GMGrid
        match={{ isExact: true, params: {}, path: "/", url: "/" }}
        metrics={{}}
        intl={intl}
      />
    );
    expect(screen.getByTestId("not-found-error")).toBeInTheDocument();
    expect(screen.queryAllByTestId("gm-line-chart")).toHaveLength(0);
    expect(screen.queryAllByTestId("gm-table")).toHaveLength(0);
    expect(screen.queryAllByTestId("gm-basic-metrics")).toHaveLength(0);
  });
});
