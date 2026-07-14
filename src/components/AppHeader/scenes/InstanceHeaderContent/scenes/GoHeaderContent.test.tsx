import state from "json/mockReduxState";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithIntl } from "utils/i18nTesting";
import GoHeaderContent from "./GoHeaderContent";

// Router is necessary because of the <Tab />'s which need a router context
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route
        path="*"
        element={<GoHeaderContent metrics={state.instance.metrics} />}
      />
    </Routes>
  </MemoryRouter>
);

describe("GoHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });
});
