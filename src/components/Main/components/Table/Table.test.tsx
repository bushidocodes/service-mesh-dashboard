import { screen } from "@testing-library/react";
import { renderWithIntl } from "utils/i18nTesting";
import GMServiceTableLineItem from "./components/GMServiceTableLineItem";
import TableLineItem from "./components/TableLineItem";
import Table from "./index";

// Enzyme reached into the rendered tree to count TableLineItem /
// GMServiceTableLineItem instances and read the props Table passed them
// (.find(Comp).at(i).props()). RTL is DOM-based and cannot query by component
// type or read React props, so both line-item components are replaced with
// vi.fn stubs: vi.fn().mock.calls captures the exact props each received
// (preserving the prop-assertions) and a data-testid lets us count instances.
// The header components are left real so we can assert their rendered text.
// Vitest mock factories are hoisted and ESM-shaped: the vi.fn stub goes on
// `default`, and real React comes from the async `vi.importActual`.
vi.mock("./components/TableLineItem", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: vi.fn(() =>
      React.createElement("div", { "data-testid": "table-line-item" })
    )
  };
});
vi.mock("./components/GMServiceTableLineItem", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: vi.fn(() =>
      React.createElement("div", {
        "data-testid": "gm-service-table-line-item"
      })
    )
  };
});

let routesProps = {
  type: "Route",
  items: [
    {
      errorPercent: "0.000",
      errorsCount: 20,
      inThroughput: 0,
      latency50: 0,
      latency99: 3,
      outThroughput: 29945110,
      requests: 399334,
      requestsPerSecond_dygraph: {
        data: [
          ["Mon Nov 13 2017 17:22:58 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:03 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:08 GMT-0500 (EST)", 0]
        ],
        attributes: ["Time", "Requests"]
      },
      requestsPerSecond_sparkline: [0, 25, 430, 1256],
      route: "/categories",
      verb: "GET"
    },
    {
      errorPercent: "0.000",
      errorsCount: 40,
      inThroughput: 0,
      latency50: 0,
      latency99: 0,
      outThroughput: 29945110,
      requests: 0,
      requestsPerSecond_dygraph: {
        data: [
          ["Mon Nov 13 2017 17:22:58 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:03 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:08 GMT-0500 (EST)", 0]
        ],
        attributes: ["Time", "Requests"]
      },
      requestsPerSecond_sparkline: [0, 25, 430, 1256],
      route: "/topics",
      verb: "GET"
    }
  ]
};

let instancesProps = {
  items: [
    { name: "26d7cmoduw8w000000000", start_time: 134056421868 },
    { name: "52ikspsvqpo0000000000", start_time: 657503172351 },

    { name: "5uws9t7wpac0000000000", start_time: 31280519413 }
  ],
  type: "Instance",
  selectedServiceSlug:
    "authentication-management-transfer-odrive-gateway-statistics-up2-channel",
  status: "Warning"
};

describe("Table component", () => {
  beforeEach(() => {
    vi.mocked(TableLineItem).mockClear();
    vi.mocked(GMServiceTableLineItem).mockClear();
    renderWithIntl(<Table {...routesProps} />);
  });

  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(<Table {...routesProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders correct header texts", () => {
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("Requests/sec")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    // TableColLatencyHeader renders a "Latency" label plus an explanatory
    // tooltip that also contains the word, so match all and assert presence.
    expect(screen.getAllByText(/Latency/).length).toBeGreaterThan(0);
  });

  test("when provided routes data, renders <TableLineItem />", () => {
    expect(TableLineItem).toHaveBeenCalledTimes(2);
    expect(GMServiceTableLineItem).not.toHaveBeenCalled();
  });

  test("passes correct data to <TableLineItem />", () => {
    // mock.calls[i][0] is the exact props object Table passed the i-th line item.
    expect(vi.mocked(TableLineItem).mock.calls[0][0]).toEqual({
      item: "/categories",
      errorPercent: "0.000",
      latency50: 0,
      latency99: 3,
      relativeReqPercent: 100,
      requests: 399334,
      requestsPerSecond_dygraph: {
        data: [
          ["Mon Nov 13 2017 17:22:58 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:03 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:08 GMT-0500 (EST)", 0]
        ],
        attributes: ["Time", "Requests"]
      },
      requestsPerSecond_sparkline: [0, 25, 430, 1256],
      verb: "GET"
    });
    expect(vi.mocked(TableLineItem).mock.calls[1][0]).toEqual({
      item: "/topics",
      errorPercent: "0.000",
      latency50: 0,
      latency99: 0,
      relativeReqPercent: 0,
      requests: 0,
      requestsPerSecond_dygraph: {
        data: [
          ["Mon Nov 13 2017 17:22:58 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:03 GMT-0500 (EST)", 0],
          ["Mon Nov 13 2017 17:23:08 GMT-0500 (EST)", 0]
        ],
        attributes: ["Time", "Requests"]
      },
      requestsPerSecond_sparkline: [0, 25, 430, 1256],
      verb: "GET"
    });
  });
});

describe("Table component with instances prop", () => {
  beforeEach(() => {
    vi.mocked(TableLineItem).mockClear();
    vi.mocked(GMServiceTableLineItem).mockClear();
    renderWithIntl(<Table {...instancesProps} />);
  });

  test("when provided instances data, renders <GMServiceTableLineItem />", () => {
    expect(GMServiceTableLineItem).toHaveBeenCalledTimes(3);
    expect(TableLineItem).not.toHaveBeenCalled();
  });

  test("passes correct props to <GMServiceTableLineItem />", () => {
    expect(vi.mocked(GMServiceTableLineItem).mock.calls[0][0]).toHaveProperty(
      "path",
      "/authentication-management-transfer-odrive-gateway-statistics-up2-channel/26d7cmoduw8w000000000"
    );
  });
});
