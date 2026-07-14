import state from "json/mockReduxState";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { renderWithIntl } from "utils/i18nTesting";
import FabricHeaderContent from "./FabricHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route
        path="*"
        element={<FabricHeaderContent store={configureMockStore()(state)} />}
      />
    </Routes>
  </MemoryRouter>
);

describe("FabricHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
