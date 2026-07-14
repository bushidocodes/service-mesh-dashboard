import createTestStore from "json/createTestStore";
import state from "json/mockReduxState";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderWithIntl } from "utils/i18nTesting";
import ServiceHeaderContent from "./ServiceHeaderContent";

const store = createTestStore(state);

// Router is necessary because of the <Tab />'s which need a router context.
// react-redux requires the store via <Provider> (legacy `store` prop is ignored).
const RouterWrap = (
  <MemoryRouter
    initialEntries={[
      "/Authentication Statistics File Resource Network Export ICPF Mail Domain End/4.3"
    ]}
  >
    <Routes>
      <Route path="*" element={<ServiceHeaderContent />} />
    </Routes>
  </MemoryRouter>
);

describe("ServiceHeaderContent", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap, store);
    expect(asFragment()).toMatchSnapshot();
  });
});
