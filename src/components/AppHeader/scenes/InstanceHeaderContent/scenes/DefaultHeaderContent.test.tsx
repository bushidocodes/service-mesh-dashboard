import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import state from "json/mockReduxState";
import DefaultHeaderContent from "./DefaultHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route
        path="*"
        element={<DefaultHeaderContent metrics={state.instance.metrics} />}
      />
    </Routes>
  </MemoryRouter>
);

describe("DefaultHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = render(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
