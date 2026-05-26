import React from "react";
import { MemoryRouter, Route } from "react-router-dom";

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

// TODO(jest-upgrade): Mounts a component with <Route> outside <Routes> (RRv5 API).
// Skip until a React Router v6 test migration PR wraps this in <MemoryRouter><Routes>.
describe.skip("GoHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
