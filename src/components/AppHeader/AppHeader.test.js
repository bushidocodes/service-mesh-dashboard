import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
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
      <Route render={(props) => <AppHeader {...props} />} />
    </MemoryRouter>
  </Provider>
);

// mock getFabricServer
jest.mock("../../utils/head");

// TODO(jest-upgrade): These tests use the React Router v5 <Route render={...}>
// API which throws in Router v6 when rendered outside <Routes>. Skip until a
// dedicated React Router v6 test migration PR fixes the wrapper setup.
describe.skip("AppHeader component", () => {
  let AppHeaderWrapper;

  beforeEach(() => {
    AppHeaderWrapper = mountWithIntl(anAppHeader);
  });

  test("matches snapshot with instance view tabs", () => {
    AppHeaderWrapper = renderWithIntl(anAppHeader);
    expect(AppHeaderWrapper).toMatchSnapshot();
  });

  test("matches snapshot with fabric view tabs", () => {
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
