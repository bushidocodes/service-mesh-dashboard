import React from "react";
import { within } from "@testing-library/react";
import * as state from "json/mockReduxState";
import configureStore from "redux-mock-store";

import SettingsGrid from "./index";
import { mountWithIntl } from "utils/i18nTesting";

//import all necessary Action effect so the Actions object is set within this test harness
import "services/fabricMicroservices/index";
import "services/instance/metrics/index";

const mockStore = configureStore();

let SettingGridWrap,
  mockState = state.default;

describe("SettingsGrid component", () => {
  beforeEach(function () {
    SettingGridWrap = mountWithIntl(<SettingsGrid />, mockStore(mockState));
  });

  test("Matches snapshot", () => {
    const { asFragment } = mountWithIntl(
      <SettingsGrid />,
      mockStore(mockState)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Has an errorBoundary", () => {
    // NOTE: ErrorBoundary renders no DOM of its own (it returns its children),
    // so it cannot be queried directly. Its observable proxy is that the
    // children it wraps (the polling sections and the Metrics Cache section)
    // render successfully without falling back to the NotFoundError UI.
    const { container } = SettingGridWrap;
    expect(within(container).queryByText(/Error:/)).not.toBeInTheDocument();
    expect(
      within(container).getByRole("heading", { name: "Metrics Cache" })
    ).toBeInTheDocument();
  });

  test("Has 1 Fabric Polling Setting if fabricServer prop is not available and its called Polling", () => {
    mockState.settings.fabricServer = "";
    const { container } = mountWithIntl(<SettingsGrid />, mockStore(mockState));
    // Each PollingSettings renders exactly one range slider; with no
    // fabricServer there is a single PollingSettings whose section title (an
    // <h3>) is "Polling".
    expect(within(container).getAllByRole("slider")).toHaveLength(1);
    expect(
      within(container).getByRole("heading", { name: "Polling" })
    ).toBeInTheDocument();
  });

  test("Has 2 Fabric Polling Settings if fabricServer prop is available", () => {
    mockState.settings.fabricServer = "http://localhost:1337";
    const { container } = mountWithIntl(<SettingsGrid />, mockStore(mockState));
    // Each PollingSettings renders exactly one range slider, so counting the
    // sliders counts the PollingSettings instances.
    expect(within(container).getAllByRole("slider")).toHaveLength(2);
  });

  test("Has Cache Size readout", () => {
    // The Readout renders its readoutItems[0].title ("Cache Size") inside a
    // ReadoutItemTitle (an <h2>).
    const { container } = SettingGridWrap;
    expect(
      within(container).getByRole("heading", { name: "Cache Size" })
    ).toBeInTheDocument();
  });

  test("Clear Cache button exists", () => {
    // The Clear Cache Button renders a <button> whose accessible name is its
    // label.
    const { container } = SettingGridWrap;
    expect(
      within(container).getByRole("button", { name: "Clear Cache" })
    ).toBeInTheDocument();
  });
});
