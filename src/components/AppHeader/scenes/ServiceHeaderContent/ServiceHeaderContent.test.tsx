import state from "json/mockReduxState";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { renderWithIntl } from "utils/i18nTesting";
import ServiceHeaderContent from "./ServiceHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter
    initialEntries={[
      "/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3"
    ]}
  >
    <Routes>
      <Route
        path="*"
        element={<ServiceHeaderContent store={configureMockStore()(state)} />}
      />
    </Routes>
  </MemoryRouter>
);

describe("ServiceHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
