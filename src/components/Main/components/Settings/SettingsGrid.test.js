import React from "react";
import * as state from "json/mockReduxState";
import configureStore from "redux-mock-store";

import Button from "components/Button";
import SettingsGrid from "./index";
import { mountWithIntl } from "utils/i18nTesting";

//import all necessary Action effect so the Actions object is set within this test harness
import "services/fabricMicroservices/index.js";
import "services/instance/metrics/index.js";

const mockStore = configureStore();

let SettingGridWrap,
  mockState = state.default;

describe("SettingsGrid component", () => {
  beforeEach(function () {
    SettingGridWrap = mountWithIntl(<SettingsGrid />, mockStore(mockState));
  });

  test("Matches snapshot", () => {
    let tree = mountWithIntl(<SettingsGrid />, mockStore(mockState));
    expect(tree).toMatchSnapshot();
  });

  test("Has an errorBoundary", () => {
    expect(SettingGridWrap.find("ErrorBoundary").length).toBe(1);
  });

  test("Has 1 Fabric Polling Setting if fabricServer prop is not available and its called Polling", () => {
    mockState.settings.fabricServer = "";
    SettingGridWrap = mountWithIntl(<SettingsGrid />, mockStore(mockState));
    expect(SettingGridWrap.find("PollingSettings").find("h3").text()).toBe(
      "Polling"
    );
  });

  test("Has 2 Fabric Polling Settings if fabricServer prop is available", () => {
    mockState.settings.fabricServer = "http://localhost:1337";
    SettingGridWrap = mountWithIntl(<SettingsGrid />, mockStore(mockState));
    expect(SettingGridWrap.find("PollingSettings").length).toBe(2);
  });

  test("Has Cache Size readout", () => {
    expect(SettingGridWrap.find("Readout").props().readoutItems[0].title).toBe(
      "Cache Size"
    );
  });

  test("Clear Cache button exists", () => {
    expect(
      SettingGridWrap.find(Button).at(2).props().label === "Clear Cache"
    ).toBe(true);
  });
});
