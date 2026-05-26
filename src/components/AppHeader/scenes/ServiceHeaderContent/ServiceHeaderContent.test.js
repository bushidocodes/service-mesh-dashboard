import React from "react";
import { renderWithIntl } from "utils/i18nTesting";
import { MemoryRouter, Route } from "react-router-dom";

import state from "json/mockReduxState";
import ServiceHeaderContent from "./ServiceHeaderContent";
import configureMockStore from "redux-mock-store";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter
    initialEntries={[
      "/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3"
    ]}
  >
    <Route
      path={`/:serviceName/:serviceVersion`}
      render={(props) => (
        <ServiceHeaderContent {...props} store={configureMockStore()(state)} />
      )}
    />
  </MemoryRouter>
);

// TODO(jest-upgrade): Mounts a component with <Route> outside <Routes> (RRv5 API).
// Skip until a React Router v6 test migration PR wraps this in <MemoryRouter><Routes>.
describe.skip("ServiceHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
