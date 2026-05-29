import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { StyleSheetManager } from "styled-components";
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

// stylis emits vendor prefixes (e.g. -moz-user-select, -moz-letter-spacing)
// differently across platforms, so a raw styled-components snapshot diverges
// between Linux CI and a Windows dev box. Rendering inside a StyleSheetManager
// with disableVendorPrefixes strips them, yielding a platform-stable snapshot.
const withoutVendorPrefixes = (node) => (
  <StyleSheetManager disableVendorPrefixes>{node}</StyleSheetManager>
);

// mock getFabricServer
jest.mock("../../utils/head");

// The snapshot cases live in their own block without the mountWithIntl
// beforeEach: that mount renders styled-components *with* vendor prefixes into
// the shared stylesheet, which the serializer would then fold into the snapshot
// and reintroduce the -moz- cross-platform drift we are avoiding here.
describe("AppHeader snapshots", () => {
  test("matches snapshot with instance view tabs", () => {
    const wrapper = renderWithIntl(withoutVendorPrefixes(anAppHeader));
    expect(wrapper).toMatchSnapshot();
  });

  test("matches snapshot with fabric view tabs", () => {
    // set a return value for getFabricServer() util func so that AppHeader renders <UseSDS /> and remount
    getFabricServer.mockImplementation(() => "http://localhost:1337");
    const wrapper = renderWithIntl(withoutVendorPrefixes(anAppHeader));
    expect(wrapper).toMatchSnapshot();
  });
});

describe("AppHeader component", () => {
  let AppHeaderWrapper;

  beforeEach(() => {
    AppHeaderWrapper = mountWithIntl(anAppHeader);
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
