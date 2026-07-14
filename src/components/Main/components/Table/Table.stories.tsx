import Table from "./index";

const mockRoutesTableItems = [
  {
    errorPercent: "0.000",
    errorsCount: 0,
    inThroughput: 0,
    latency50: 0,
    latency99: 9,
    outThroughput: 1580,
    requests: 17725,
    requestsPerSecond_dygraph: {
      data: [
        [new Date("2017-07-18T22:13:34.314Z"), 0],
        [new Date("2017-07-18T22:13:49.215Z"), 0]
      ],
      attributes: ["time", "Requests"]
    },
    requestsPerSecond_sparkline: [0, 0],
    route: "/functionalroles",
    verb: "GET"
  },
  {
    errorPercent: "0.000",
    errorsCount: 0,
    inThroughput: 0,
    latency50: 0,
    latency99: 0,
    outThroughput: 0,
    requests: 1,
    requestsPerSecond_dygraph: {
      data: [
        [new Date("2017-07-18T22:13:34.314Z"), 0],
        [new Date("2017-07-18T22:13:49.215Z"), 0]
      ],
      attributes: ["time", "Requests"]
    },
    requestsPerSecond_sparkline: [0, 0],
    route: "/ping",
    verb: "GET"
  }
];

const mockFuncsTableItems = [
  {
    errorPercent: "0.000",
    errorsCount: 0,
    func: "CatalogStream",
    inThroughput: 227,
    latency50: 1956,
    latency90: 3469,
    latency95: 3484,
    latency99: 3484,
    latency9990: 3484,
    latency9999: 3484,
    latencyAvg: 1942.692308,
    latencyCount: 13,
    latencyMax: 3484,
    latencyMin: 600,
    outThroughput: 2889,
    requests: 18,
    requestsPerSecond_dygraph: {
      data: [
        [new Date("2017-07-18T22:13:34.314Z"), 0],
        [new Date("2017-07-18T22:13:49.215Z"), 0]
      ],
      attributes: ["time", "Requests"]
    },
    requestsPerSecond_sparkline: [0, 0]
  },
  {
    errorPercent: "0.000",
    errorsCount: 0,
    func: "OrderItem",
    inThroughput: 225,
    latency50: 2339,
    latency90: 3476,
    latency95: 3565,
    latency99: 3565,
    latency9990: 3565,
    latency9999: 3565,
    latencyAvg: 2398.615385,
    latencyCount: 13,
    latencyMax: 3565,
    latencyMin: 1345,
    outThroughput: 143,
    requests: 13,
    requestsPerSecond_dygraph: {
      data: [
        [new Date("2017-07-18T22:13:34.314Z"), 0],
        [new Date("2017-07-18T22:13:49.215Z"), 0]
      ],
      attributes: ["time", "Requests"]
    },
    requestsPerSecond_sparkline: [0, 0]
  }
];

const mockInstanceTableItems = [
  { name: "serviceID1", start_time: 600000000000 },
  { name: "serviceID2", start_time: 300000000000 },
  { name: "serviceID3", start_time: 400000000000 }
];

export default {
  title: "Table",
  component: Table
};

export const RoutesTable = {
  render: () => (
    <div style={{ width: "100%" }}>
      <Table type="Route" items={mockRoutesTableItems} />
    </div>
  )
};

export const FunctionsTable = {
  render: () => (
    <div style={{ width: "100%" }}>
      <Table type="Function" items={mockFuncsTableItems} />
    </div>
  )
};

export const InstanceTable = {
  render: () => (
    <div style={{ width: "100%" }}>
      <Table status="stable" type="Instance" items={mockInstanceTableItems} />
    </div>
  )
};
