import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

// utils
import { getFabricServer } from "../../utils/head";
import mockState from "json/mockReduxState";
import { renderWithIntl, mountWithIntl } from "utils/i18nTesting";

// components
import AppHeader from "./AppHeader";

// styled-components
import AppHeaderContainer from "./components/AppHeaderContainer";

const store = configureMockStore()(mockState);

const anAppHeader = (
  <Provider store={store}>
    <MemoryRouter initialEntries={["/Down"]}>
      <Routes>
        <Route path="*" element={<AppHeader />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

// mock getFabricServer
jest.mock("../../utils/head");

describe("AppHeader component", () => {
  let AppHeaderWrapper;

  beforeEach(() => {
    AppHeaderWrapper = mountWithIntl(anAppHeader);
  });

  // TODO(jest-upgrade): jest-styled-components@4.9 + stylis generates
  // -moz-user-select and -moz-letter-spacing vendor prefixes on Linux
  // (CI) but not on Windows, causing snapshots to differ across platforms.
  // Skip until jest-styled-components is upgraded alongside styled-components.
  xtest("matches snapshot with instance view tabs", () => {
    AppHeaderWrapper = renderWithIntl(anAppHeader);
    expect(AppHeaderWrapper).toMatchSnapshot();
  });

  xtest("matches snapshot with fabric view tabs", () => {
    // set a return value for getFabricServer() util func so that AppHeader renders <UseSDS /> and remount
    getFabricServer.mockImplementation(() => "http://localhost:1337");
    AppHeaderWrapper = renderWithIntl(anAppHeader);
    expect(AppHeaderWrapper).toMatchSnapshot();
  });

  test("renders subcomponents", () => {
    expect(AppHeaderWrapper.find(AppHeaderContainer)).toHaveLength(1);
    expect(AppHeaderWrapper.find("AppToolBar")).toHaveLength(1);
    expect(AppHeaderWrapper.find("Banner")).toHaveLength(1);
  });

  test("passes the correct title to Banner", () => {
    expect(AppHeaderWrapper.find("Banner").props().title).toBe("Down");
  });

  test("passes the pathname to AppToolBar", () => {
    expect(AppHeaderWrapper.find("AppToolBar").props().pathname).toBe("/Down");
  });
});
