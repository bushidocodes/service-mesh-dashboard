import React from "react";
import configureStore from "redux-mock-store";

import { shallowWithIntl, renderWithIntl } from "utils/i18nTesting";
import mockState from "json/mockReduxStateGO";

import LayoutSection from "components/LayoutSection";
import GMLineChart from "components/Main/components/GMLineChart";
import Readout from "components/Main/components/Readout";
import ErrorBoundary from "components/ErrorBoundary";
import SummaryGrid from "./Summary";

const mockStore = configureStore()(mockState);

const SummaryGridWrap = shallowWithIntl(<SummaryGrid store={mockStore} />)
  .dive()
  .dive();

describe("GO > SummaryGrid component", () => {
  test("Matched the snapshot", () => {
    const tree = renderWithIntl(<SummaryGrid store={mockStore} />);
    expect(tree).toMatchSnapshot();
  });

  test("Has an error boundary", () => {
    expect(SummaryGridWrap.find(ErrorBoundary).length).toBe(1);
  });

  test("Has a layout section that contains 'vital' dashboards", () => {
    expect(
      SummaryGridWrap.find(LayoutSection).find({ title: "Vitals" })
    ).toHaveLength(1);
  });

  test("Has a read out group that contains three readout dashboards", () => {
    expect(SummaryGridWrap.find(Readout)).toHaveLength(3);
  });

  test("Has an 'uptime' dashboard in first position", () => {
    expect(SummaryGridWrap.find(Readout).at(0).html().includes("Uptime")).toBe(
      true
    );
  });

  test("Has an 'average response time' dashboard in second position", () => {
    expect(
      SummaryGridWrap.find(Readout).at(1).html().includes("Avg. Response Time")
    ).toBe(true);
    expect(
      SummaryGridWrap.find(Readout).at(1).html().includes("Error Rate")
    ).toBe(true);
  });

  test("Has a 'host CPU utilized' dashboard in third position", () => {
    expect(
      SummaryGridWrap.find(Readout).at(2).html().includes("Host CPU Utilized")
    ).toBe(true);
  });

  test("Has a chart with correct props passed down", () => {
    expect(SummaryGridWrap.find(GMLineChart).length).toBe(1);
    expect(
      Object.keys(SummaryGridWrap.find(GMLineChart).props()).includes("dygraph")
    ).toBe(true);
    expect(
      SummaryGridWrap.find(GMLineChart)
        .props()
        .dygraph.attributes.includes("Time")
    ).toBe(true);
  });
});
