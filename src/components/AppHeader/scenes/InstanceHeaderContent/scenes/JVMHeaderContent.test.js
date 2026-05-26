import React from "react";

import state from "json/mockReduxState";
import JVMHeaderContent from "./JVMHeaderContent";
import { renderWithIntl } from "utils/i18nTesting";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import mockState from "json/mockReduxState";

const store = configureMockStore()(mockState);

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <Provider store={store}>
    <MemoryRouter>
      <JVMHeaderContent metrics={state.instance.metrics} />
    </MemoryRouter>
  </Provider>
);

describe("JVMHeaderContent", () => {
  test("matches snapshot", () => {
    const tree = renderWithIntl(RouterWrap);
    expect(tree).toMatchSnapshot();
  });
});
