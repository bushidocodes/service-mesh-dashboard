import React from "react";
import { render } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";

import state from "json/mockReduxState";
import DefaultHeaderContent from "./DefaultHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Route
      render={(props) => (
        <DefaultHeaderContent {...props} metrics={state.instance.metrics} />
      )}
    />
  </MemoryRouter>
);

describe("DefaultHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = render(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
