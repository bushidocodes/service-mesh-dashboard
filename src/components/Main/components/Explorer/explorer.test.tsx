import { screen, within } from "@testing-library/react";
// Utilities
import mockState from "json/mockReduxState";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import { renderWithIntl } from "utils/i18nTesting";

// Components
import Explorer from "./index";

// Create a mock store and initialize with mock data
const store = configureStore()(mockState);

// Wrap Explorer in Memory Router to mock route props (history, match, location)
const RouterWrap = (
  <Provider store={store}>
    <MemoryRouter>
      <Routes>
        <Route path="*" element={<Explorer />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

// The metrics keys the store exposes (sorted, with the "timestamps" key removed
// by Explorer.hideKeys). With both hide filters off these are passed verbatim to
// Inspector as `data` and rendered one-per-InspectorItem.
const expectedKeys = Object.keys(mockState.instance.metrics)
  .sort()
  .filter((key) => key !== "timestamps");

describe("Explorer View", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders correct components", () => {
    renderWithIntl(RouterWrap);
    // Inspector renders a search input and a list (proves ErrorBoundary,
    // ViewExplorer and MetricsList all rendered, since the list is nested
    // inside each of them).
    expect(
      screen.getByRole("searchbox", { name: "Search All Metrics" })
    ).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    // NOTE: ErrorBoundary, ViewExplorer, MetricsList and MetricsGraphDisplay
    // produce no role/text/attribute distinct from the DOM they wrap, so they
    // cannot be queried as components. The placeholder message proves
    // MetricsGraphDisplay rendered its branch.
    expect(screen.getByText("Select a metric to display")).toBeInTheDocument();
  });

  test("passes the correct props down to Inspector", () => {
    renderWithIntl(RouterWrap);

    // data={keys}: Inspector renders one item per key, so the rendered item
    // count proves the full key list was passed down.
    const list = screen.getByRole("list");
    const items = within(list).getAllByText(/.+/);
    expect(items).toHaveLength(expectedKeys.length);

    // searchQuery="": the search field is empty.
    expect(
      screen.getByRole("searchbox", { name: "Search All Metrics" })
    ).toHaveValue("");

    // hideZeroMetric=false / hideStaticMetric=false: both checkboxes unchecked.
    const hideZero = document.querySelector('input[name="hideZeroMetric"]');
    const hideStatic = document.querySelector('input[name="hideStaticMetric"]');
    expect(hideZero).not.toBeChecked();
    expect(hideStatic).not.toBeChecked();

    // NOTE: tabIndex={0} has no observable DOM manifestation. Inspector lists it
    // in propTypes but never consumes it in render (InspectorItem hardcodes its
    // own tabIndex="0"), so there is nothing in the DOM to assert it against.
  });
});
