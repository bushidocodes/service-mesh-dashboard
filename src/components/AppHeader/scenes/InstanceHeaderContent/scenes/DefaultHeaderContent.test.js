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

// TODO(jest-upgrade): Mounts a component with <Route> outside <Routes> (RRv5 API).
// Skip until a React Router v6 test migration PR wraps this in <MemoryRouter><Routes>.
describe.skip("DefaultHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = render(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
