import React from "react";
import { MemoryRouter, Route } from "react-router-dom";
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

// TODO(jest-upgrade): Mounts a component with <Route> outside <Routes> (RRv5 API).
// Skip until a React Router v6 test migration PR wraps this in <MemoryRouter><Routes>.
describe.skip("FabricHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
