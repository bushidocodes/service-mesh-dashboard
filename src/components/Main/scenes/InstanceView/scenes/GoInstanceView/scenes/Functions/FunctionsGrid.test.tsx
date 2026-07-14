import { fireEvent, screen, within } from "@testing-library/react";
import createTestStore from "json/createTestStore";
import * as noFuncState from "json/mockReduxState";
import * as state from "json/mockReduxStateMetrics";
import { MemoryRouter } from "react-router-dom";
import { omitBy } from "utils/collections";
import { renderWithIntl } from "utils/i18nTesting";
import FunctionsGrid from "./index";

//import Action effects
import "services";

const mockState = state.default,
  noMetricsState = noFuncState.default;

// Filter out metrics starting with the key function
noMetricsState.instance.metrics = omitBy(
  noFuncState.default.instance.metrics,
  (_value, key) => key.substr(0, 8) === "function"
) as typeof noMetricsState.instance.metrics;

const FunctionsGridWithMockStore = (
  <MemoryRouter>
    <FunctionsGrid />
  </MemoryRouter>
);
const FunctionsGridWithMissingMetricsStore = (
  <MemoryRouter>
    <FunctionsGrid />
  </MemoryRouter>
);

const metricsStore = createTestStore(mockState);
const noMetricsStore = createTestStore(noMetricsState);

const sortByOptions = [
  {
    value: "func",
    label: "Function"
  },
  {
    value: "requests",
    label: "Requests"
  },
  {
    value: "errorCount",
    label: "Error %"
  },
  {
    value: "latency50",
    label: "Latency 50%"
  },
  {
    value: "latency99",
    label: "Latency 99%"
  }
];

describe("Go Instance Functions View: <FunctionsGrid/>", () => {
  test("Matches snapshot", () => {
    const { asFragment } = renderWithIntl(
      FunctionsGridWithMockStore,
      metricsStore
    );
    expect(asFragment()).toMatchSnapshot();
  });

  // FunctionsGridWithMissingMetricsStore does not contain any functions data
  test("returns NotFoundError if no functions are found ", () => {
    // NotFoundError renders the "No Functions Found" message; assert that
    // observable text rather than the (RTL-unqueryable) component type.
    renderWithIntl(FunctionsGridWithMissingMetricsStore, noMetricsStore);
    expect(screen.getByText("No Functions Found")).toBeInTheDocument();
  });

  test("returns correct number of <Table> and does not render <NotFoundError> when functions are found ", () => {
    renderWithIntl(FunctionsGridWithMockStore, metricsStore);
    // NOTE: RTL cannot count component instances. The single <Table> renders
    // the function rows (role="link"); their presence is the observable proxy
    // for "one Table rendered", and the absence of the "No Functions Found"
    // message stands in for "zero <NotFoundError>".
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
    expect(screen.queryByText("No Functions Found")).not.toBeInTheDocument();
  });
});

describe("FunctionsGrid Child Components", () => {
  beforeEach(() => {
    renderWithIntl(FunctionsGridWithMockStore, metricsStore);
  });

  test("passes props to TableToolbar", () => {
    // searchInputProps.searchPlaceholder + filterString: the search input is
    // rendered with the placeholder/aria-label "Search Functions" and an empty
    // value (filterString === "").
    const searchInput = screen.getByRole("searchbox", {
      name: "Search Functions"
    });
    expect(searchInput).toHaveAttribute("placeholder", "Search Functions");
    expect(searchInput).toHaveValue("");

    // sortByProps.sortByAttribute "func" maps to the option labelled
    // "Function", which the sort dropdown displays as its selected value.
    const sortSelect = screen.getByRole("combobox");
    const toolbarRight = sortSelect.closest(".gm-select__control");
    expect(
      within(toolbarRight as HTMLElement).getByText("Function")
    ).toBeInTheDocument();

    // sortByProps.sortByOptions: open the sort dropdown and assert every option
    // label is rendered, in order.
    fireEvent.focus(sortSelect);
    fireEvent.keyDown(sortSelect, { key: "ArrowDown", code: "ArrowDown" });
    const options = screen.getAllByRole("option");
    expect(options.map((opt) => opt.textContent)).toEqual(
      sortByOptions.map((opt) => opt.label)
    );
  });

  test("passes functions as props to Table", () => {
    // The Table maps each function in its `items` prop to a row (role="link").
    // Assert the two expected functions render, in order, as the observable
    // proxy for the items array passed to <Table>.
    const rows = screen.getAllByRole("link");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("CatalogStream");
    expect(rows[1]).toHaveTextContent("OrderItem");
  });
});
