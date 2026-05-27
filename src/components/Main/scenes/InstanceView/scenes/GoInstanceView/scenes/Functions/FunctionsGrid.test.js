import React from "react";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import _ from "lodash";

import * as noFuncState from "json/mockReduxState";
import * as state from "json/mockReduxStateMetrics";
import FunctionsGrid from "./index";
import NotFoundError from "components/Main/components/NotFoundError";
import { mountWithIntl, renderWithIntl } from "utils/i18nTesting";

//import Action effects
import "services";
import Table from "components/Main/components/Table";

const mockStore = configureStore();
const mockState = state.default,
  noMetricsState = noFuncState.default;

// Filter out metrics starting with the key function
noMetricsState.instance.metrics = _.omitBy(
  noFuncState.default.instance.metrics,
  (value, key) => key.substr(0, 8) === "function"
);
let wrapper;

const FunctionsGridWithMockStore = (
  <MemoryRouter>
    <FunctionsGrid store={mockStore(mockState)} />
  </MemoryRouter>
);
const FunctionsGridWithMissingMetricsStore = (
  <MemoryRouter>
    <FunctionsGrid store={mockStore(noMetricsState)} />
  </MemoryRouter>
);

const sortByOptions = [
  {
    value: "func",
    label: "Function"
  },
  {
    value: "requests",
    label: "Requests"
  },
  {
    value: "errorCount",
    label: "Error %"
  },
  {
    value: "latency50",
    label: "Latency 50%"
  },
  {
    value: "latency99",
    label: "Latency 99%"
  }
];

describe("Go Instance Functions View: <FunctionsGrid/>", () => {
  test("Matches snapshot", () => {
    const tree = renderWithIntl(FunctionsGridWithMockStore);
    expect(tree).toMatchSnapshot();
  });

  // FunctionsGridWithMissingMetricsStore does not contain any functions data
  test("returns NotFoundError if no functions are found ", () => {
    wrapper = mountWithIntl(FunctionsGridWithMissingMetricsStore);
    expect(wrapper.find(NotFoundError).length).toBe(1);
  });

  test("returns correct number of <Table> and does not render <NotFoundError> when functions are found ", () => {
    wrapper = mountWithIntl(FunctionsGridWithMockStore);
    expect(wrapper.find(Table).length).toBe(1);
    expect(wrapper.find(NotFoundError).length).toBe(0);
  });
});

describe("FunctionsGrid Child Components", () => {
  beforeEach(() => {
    wrapper = mountWithIntl(FunctionsGridWithMockStore);
  });

  test("passes props to TableToolbar", () => {
    expect(wrapper.find("TableToolbar").props()).toMatchObject({
      searchInputProps: {
        filterString: "",
        searchPlaceholder: "Search Functions"
      },
      sortByProps: {
        sortByOptions,
        sortByAttribute: "func"
      }
    });
  });

  test("passes functions as props to Table", () => {
    expect(wrapper.find(Table).props()).toMatchObject({
      items: [
        {
          errorPercent: "0",
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
          requests: 13
        },
        {
          errorPercent: "0",
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
          requests: 13
        }
      ]
    });
  });
});
