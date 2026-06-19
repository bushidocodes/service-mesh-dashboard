import React from "react";
import type { MockInstance } from "vitest";
import configureStore from "redux-mock-store";
import { screen, within } from "@testing-library/react";

import { renderWithIntl } from "utils/i18nTesting";
import mockState from "json/mockReduxStateGO";

import SummaryGrid from "./Summary";

const mockStore = configureStore()(mockState);

// The Uptime readout derives its value from `Date.now() - startTime`, so without
// a frozen clock the rendered output (and thus the snapshot) drifts second to
// second. Pin `Date.now` to a fixed instant for deterministic, repeatable runs.
const FIXED_NOW = 1507230248562;
let nowSpy: MockInstance;

describe("GO > SummaryGrid component", () => {
  beforeEach(() => {
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  test("Matched the snapshot", () => {
    const { asFragment } = renderWithIntl(<SummaryGrid />, mockStore);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Has an error boundary", () => {
    // NOTE: ErrorBoundary renders no DOM of its own; it renders children unless
    // it catches an error, in which case it shows a NotFoundError fallback.
    // We assert the proxy that the boundary rendered its children (the dashboard
    // content) and did NOT fall back to the error UI.
    renderWithIntl(<SummaryGrid />, mockStore);
    expect(screen.getByRole("heading", { name: "Vitals" })).toBeInTheDocument();
    expect(screen.queryByText(/^Error:/)).not.toBeInTheDocument();
  });

  test("Has a layout section that contains 'vital' dashboards", () => {
    renderWithIntl(<SummaryGrid />, mockStore);
    expect(screen.getAllByRole("heading", { name: "Vitals" })).toHaveLength(1);
  });

  test("Has a read out group that contains three readout dashboards", () => {
    renderWithIntl(<SummaryGrid />, mockStore);
    // Each Readout renders one ReadoutDisplay card; the three cards are the
    // direct children of the single ReadoutGroup. Walk up from a known readout
    // title (h2) to the ReadoutGroup and count its child cards.
    const uptimeTitle = screen.getByRole("heading", { name: "Uptime" });
    const readoutCard =
      uptimeTitle.parentElement!.parentElement!.parentElement!;
    const readoutGroup = readoutCard!.parentElement!;
    expect(readoutGroup.children).toHaveLength(3);
  });

  test("Has an 'uptime' dashboard in first position", () => {
    renderWithIntl(<SummaryGrid />, mockStore);
    const uptimeTitle = screen.getByRole("heading", { name: "Uptime" });
    const readoutCard =
      uptimeTitle.parentElement!.parentElement!.parentElement!;
    const readoutGroup = readoutCard!.parentElement!;
    expect(readoutGroup.children[0]).toHaveTextContent("Uptime");
  });

  test("Has an 'average response time' dashboard in second position", () => {
    renderWithIntl(<SummaryGrid />, mockStore);
    const responseTitle = screen.getByRole("heading", {
      name: "Avg. Response Time"
    });
    const readoutCard =
      responseTitle.parentElement!.parentElement!.parentElement!;
    const readoutGroup = readoutCard!.parentElement!;
    const secondReadout = within(readoutGroup.children[1] as HTMLElement);
    expect(
      secondReadout.getByRole("heading", { name: "Avg. Response Time" })
    ).toBeInTheDocument();
    expect(
      secondReadout.getByRole("heading", { name: "Error Rate" })
    ).toBeInTheDocument();
  });

  test("Has a 'host CPU utilized' dashboard in third position", () => {
    renderWithIntl(<SummaryGrid />, mockStore);
    const cpuTitle = screen.getByRole("heading", { name: "Host CPU Utilized" });
    const readoutCard = cpuTitle.parentElement!.parentElement!.parentElement!;
    const readoutGroup = readoutCard!.parentElement!;
    expect(readoutGroup.children[2]).toHaveTextContent("Host CPU Utilized");
  });

  test("Has a chart with correct props passed down", () => {
    const { container } = renderWithIntl(<SummaryGrid />, mockStore);
    // NOTE: enzyme inspected the GMLineChart's `dygraph` prop directly (single
    // chart, prop named "dygraph", attributes including "Time"). RTL is
    // DOM-based, so we assert the observable result of that prop. The chart's
    // title and presentation surface are aria-hidden / role="presentation", so
    // they are queried by text / attribute rather than by accessible role.
    // Exactly one chart title is rendered, and because the dygraph has chartable
    // attributes (including "Time") the chart mounts a dygraph canvas surface
    // rather than the "No chartable data" empty state.
    expect(screen.getByText("Requests Per Second")).toBeInTheDocument();
    expect(container.querySelectorAll("[role='presentation']")).toHaveLength(1);
    expect(screen.queryByText(/No chartable data/i)).not.toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
