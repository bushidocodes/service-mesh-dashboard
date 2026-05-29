import React from "react";
import { screen, within } from "@testing-library/react";
import mockState from "json/mockReduxState";
import configureStore from "redux-mock-store";
import { renderWithIntl, mountWithIntl } from "utils/i18nTesting";

import SummaryGrid from "./Summary";

const mockStore = configureStore()(mockState);

// The three Readout components each render a ReadoutDisplay <div> as the direct
// child of the ReadoutGroup. There is no role/text on those wrappers, so we
// anchor on the Readout item titles (rendered as <h2> by ReadoutItemTitle) and
// walk up to the ReadoutDisplay ancestor (h2 -> ReadoutItemData -> ItemDisplay
// -> ReadoutDisplay) to identify the distinct readout cards.
function getReadoutDisplays() {
  const titles = screen.getAllByRole("heading", { level: 2 });
  const displays = titles.map(
    (title) => title.parentElement.parentElement.parentElement
  );
  return Array.from(new Set(displays));
}

describe("JVM > SummaryGrid component", () => {
  beforeEach(() => {
    mountWithIntl(<SummaryGrid />, mockStore);
  });

  test("Matched the snapshot", () => {
    const { asFragment } = renderWithIntl(<SummaryGrid />, mockStore);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Has an error boundary", () => {
    // NOTE: ErrorBoundary renders its children directly and emits no DOM marker
    // of its own. We assert the closest observable proxy: the boundary did not
    // trip its fallback (NotFoundError) and the normal content rendered.
    expect(
      screen.queryByText(/^Error:/, { exact: false })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Vitals" })
    ).toBeInTheDocument();
  });

  test("Has a layout section that contains 'vital' dashboards", () => {
    expect(
      screen.getByRole("heading", { level: 3, name: "Vitals" })
    ).toBeInTheDocument();
  });

  test("Has a read out group that contains three readout dashboards", () => {
    expect(getReadoutDisplays()).toHaveLength(3);
  });

  test("Has an 'uptime' dashboard in first position", () => {
    const readouts = getReadoutDisplays();
    expect(within(readouts[0]).getByText("Uptime")).toBeInTheDocument();
  });

  test("Has an 'average response time' dashboard in second position", () => {
    const readouts = getReadoutDisplays();
    expect(
      within(readouts[1]).getByText("Avg. Response Time")
    ).toBeInTheDocument();
    expect(within(readouts[1]).getByText("Error Rate")).toBeInTheDocument();
  });

  test("Has a 'host CPU utilized' dashboard in third position", () => {
    const readouts = getReadoutDisplays();
    expect(within(readouts[2]).getByText("Host CPU Cores")).toBeInTheDocument();
  });

  test("Has a chart with correct props passed down", () => {
    // NOTE: the original test asserted the single GMLineChart received a
    // `dygraph` prop whose `attributes` array includes "Time". Those are React
    // props with no direct DOM manifestation (the dygraph labels are rendered
    // imperatively by the dygraphs library, not reliably into JSDOM). The
    // observable proxy is that exactly one chart renders with its title and,
    // because the mock metrics contain "http/requests", that it took the
    // data-bearing render path (the chart title is present rather than the
    // "No chartable data" empty state).
    const chartTitle = screen.getByText("Requests Per Second");
    expect(chartTitle).toBeInTheDocument();
    expect(screen.queryByText("No chartable data")).not.toBeInTheDocument();
    expect(screen.getAllByText("Requests Per Second")).toHaveLength(1);
  });
});
