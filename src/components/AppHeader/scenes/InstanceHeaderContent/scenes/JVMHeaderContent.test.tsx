import state from "json/mockReduxState";
import mockState from "json/mockReduxState";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { renderWithIntl } from "utils/i18nTesting";
import JVMHeaderContent from "./JVMHeaderContent";

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
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
