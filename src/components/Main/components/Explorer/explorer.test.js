import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mountWithIntl, renderWithIntl } from "utils/i18nTesting";

// Utilities
import mockState from "json/mockReduxState";

// Components
import Explorer from "./index.js";
import ViewExplorer from "./components/ViewExplorer";
import MetricsList from "./components/MetricsList";
import MetricsGraphDisplay from "./components/MetricsGraphDisplay";

// Create a mock store and initialize with mock data
const store = configureStore()(mockState);

// Wrap Explorer in Memory Router to mock route props (history, match, location)
const RouterWrap = (
  <Provider store={store}>
    <MemoryRouter>
      <Route render={(props) => <Explorer {...props} />} />
    </MemoryRouter>
  </Provider>
);

let wrapper;

describe("Explorer View", () => {
  beforeEach(() => {
    wrapper = mountWithIntl(RouterWrap);
  });

  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });

  test("renders correct components", () => {
    // react components
    expect(wrapper.find("ErrorBoundary")).toHaveLength(1);
    expect(wrapper.find("Inspector")).toHaveLength(1);
    // styled-components
    expect(wrapper.find(ViewExplorer)).toHaveLength(1);
    expect(wrapper.find(MetricsList)).toHaveLength(1);
    expect(wrapper.find(MetricsGraphDisplay)).toHaveLength(1);
  });

  test("passes the correct props down to Inspector", () => {
    const instance = wrapper.find("Explorer").instance();
    const expectedProps = {
      data: instance.props.keys,
      searchQuery: "",
      tabIndex: 0,
      hideZeroMetric: false,
      hideStaticMetric: false
    };
    expect(wrapper.find("Inspector").props()).toMatchObject(expectedProps);
  });
});
