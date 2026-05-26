import React from "react";
import { MemoryRouter, Route } from "react-router";
import configureMockStore from "redux-mock-store";

import { renderWithIntl } from "utils/i18nTesting";
import state from "json/mockReduxState";
import FabricHeaderContent from "./FabricHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Route
      render={(props) => (
        <FabricHeaderContent {...props} store={configureMockStore()(state)} />
      )}
    />
  </MemoryRouter>
);

describe("FabricHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
