import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { screen } from "@testing-library/react";

// utils
import { getFabricServer } from "../../utils/head";
import mockState from "json/mockReduxState";
import { renderWithIntl, mountWithIntl } from "utils/i18nTesting";

// components
import AppHeader from "./AppHeader";

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
vi.mock("../../utils/head");

// The snapshot cases live in their own block without the mountWithIntl
// beforeEach: that mount renders styled-components *with* vendor prefixes into
// the shared stylesheet, which the serializer would then fold into the snapshot
// and reintroduce the -moz- cross-platform drift we are avoiding here.
describe("AppHeader snapshots", () => {
  test("matches snapshot with instance view tabs", () => {
    const { asFragment } = renderWithIntl(anAppHeader);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot with fabric view tabs", () => {
    // set a return value for getFabricServer() util func so that AppHeader renders <UseSDS /> and remount
    vi.mocked(getFabricServer).mockImplementation(
      () => "http://localhost:1337"
    );
    const { asFragment } = renderWithIntl(anAppHeader);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("AppHeader component", () => {
  beforeEach(() => {
    mountWithIntl(anAppHeader);
  });

  // Banner renders its title in a standalone <h1> (Header). The Fabric tab scene
  // also renders <h1> tabs (including one titled "Down" for the "/Down" route),
  // but those live inside a TabLink anchor; the Banner heading does not. Pick the
  // level-1 "Down" heading that is not nested in a link.
  const getBannerHeading = () =>
    screen
      .getAllByRole("heading", { level: 1, name: "Down" })
      .find((heading) => heading.closest("a") === null);

  test("renders subcomponents", () => {
    // AppToolBar renders a <nav> (AppToolBarHeader) -> role "navigation".
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    // Banner renders its title inside a standalone <h1> (Header).
    const bannerHeading = getBannerHeading();
    expect(bannerHeading).toBeInTheDocument();
    // AppHeaderContainer is the styled.div root that wraps both the toolbar nav
    // and the banner; assert the nav lives in a <div> that also holds the banner.
    const container = nav.parentElement!;
    expect(container.tagName).toBe("DIV");
    expect(container).toContainElement(bannerHeading!);
  });

  test("passes the correct title to Banner", () => {
    // Banner renders `title` as the text of its <h1> (Header). For the "/Down"
    // route mapStateToProps resolves the title to "Down".
    expect(getBannerHeading()).toHaveTextContent("Down");
  });

  test("passes the pathname to AppToolBar", () => {
    // AppToolBar turns its `pathname` prop ("/Down") into breadcrumb links; the
    // last breadcrumb is a link labelled "Down" pointing at "/Down". Its presence
    // proves the "/Down" pathname reached AppToolBar.
    const breadcrumb = screen.getByRole("link", { name: "Down" });
    expect(breadcrumb).toHaveAttribute("href", "/Down");
  });
});
