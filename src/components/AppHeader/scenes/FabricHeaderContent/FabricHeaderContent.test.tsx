import createTestStore from "json/createTestStore";
import state from "json/mockReduxState";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithIntl } from "utils/i18nTesting";
import FabricHeaderContent from "./FabricHeaderContent";

const store = createTestStore(state);

// Router is necessary because of the <Tab />'s which need a router context.
// react-redux requires the store via <Provider> (legacy `store` prop is ignored).
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route path="*" element={<FabricHeaderContent />} />
    </Routes>
  </MemoryRouter>
);

describe("FabricHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap, store);
    expect(asFragment()).toMatchSnapshot();
  });
});
