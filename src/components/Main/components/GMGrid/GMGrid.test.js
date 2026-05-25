import React from "react";
import { shallow } from "enzyme";
import GMBasicMetrics from "./components/GMBasicMetrics";
import GMLineChart from "../GMLineChart";
import GMTable from "./components/GMTable";
import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";

// Use named export {GMGrid} for unconnected component for tests
// Connected Components section from https://redux.js.org/docs/recipes/WritingTests.html
import { GMGrid } from "./GMGrid";

let wrapper;
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
  match: {},
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

xdescribe("Service Instance View: JVM/GO/HTTP <GMGrid>", () => {
  beforeEach(() => {
    wrapper = shallow(<GMGrid {...props} />);
  });

  test("matches snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("renders correct components", () => {
    expect(wrapper.find(ErrorBoundary)).toHaveLength(1);
  });

  test("renders appropriate chart type (<GMTable>,<GMBasicMetrics> and <GMLineChart>) when provided dashboard charts", () => {
    expect(wrapper.find(GMLineChart)).toHaveLength(2);
    expect(wrapper.find(GMTable)).toHaveLength(1);
    expect(wrapper.find(GMBasicMetrics)).toHaveLength(1);
    expect(wrapper.find(NotFoundError)).toHaveLength(0);
  });

  test("returns <NotFoundError> if dashboard does not exist", () => {
    wrapper = shallow(<GMGrid match={{}} metrics={{}} />);
    expect(wrapper.find(NotFoundError)).toHaveLength(1);
    expect(wrapper.find(GMLineChart)).toHaveLength(0);
    expect(wrapper.find(GMTable)).toHaveLength(0);
    expect(wrapper.find(GMBasicMetrics)).toHaveLength(0);
  });
});
