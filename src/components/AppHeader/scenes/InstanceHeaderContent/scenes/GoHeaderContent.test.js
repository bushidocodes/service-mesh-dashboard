import React from "react";
import { MemoryRouter, Route } from "react-router";

import state from "json/mockReduxState";
import GoHeaderContent from "./GoHeaderContent";
import { renderWithIntl } from "utils/i18nTesting";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Route
      render={(props) => (
        <GoHeaderContent {...props} metrics={state.instance.metrics} />
      )}
    />
  </MemoryRouter>
);

describe("GoHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
