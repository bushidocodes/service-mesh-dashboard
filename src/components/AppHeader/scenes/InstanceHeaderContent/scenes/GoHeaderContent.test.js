import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import state from "json/mockReduxState";
import GoHeaderContent from "./GoHeaderContent";
import { renderWithIntl } from "utils/i18nTesting";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route
        path="*"
        element={<GoHeaderContent metrics={state.instance.metrics} />}
      />
    </Routes>
  </MemoryRouter>
);

describe("GoHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
