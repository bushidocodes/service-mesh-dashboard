import React from "react";
import { MemoryRouter } from "react-router-dom";
import { screen, within } from "@testing-library/react";
import { Actions } from "store/jumpstate";
import configureMockStore from "redux-mock-store";
import { CreateJumpstateMiddleware } from "store/jumpstate";

// Utilities
import mockState from "json/mockReduxState";
import { renderWithIntl } from "utils/i18nTesting";

// Components
import ThreadsGrid from "./index";

// Mock the jumpstate effect used in ThreadsGrid
Actions.fetchAndStoreInstanceThreads = vi.fn();

// Create a mock store and initialize with mock data
const store = configureMockStore([CreateJumpstateMiddleware()])(mockState);

// react-redux v8 requires the store to come from <Provider> (the legacy `store`
// prop is ignored), and withUrlState relies on react-router, so the connected
// ThreadsGrid is rendered inside a <MemoryRouter> with the store supplied via
// renderWithIntl's second argument.
const RouterWrap = (
  <MemoryRouter>
    <ThreadsGrid />
  </MemoryRouter>
);

describe("ThreadsGrid View", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap, store);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders correct components", () => {
    // NOTE: enzyme asserted on the presence of the TableToolbar, ThreadsTable,
    // and ErrorBoundary component instances. RTL is DOM-based, so we assert on
    // the observable DOM each renders:
    //   - TableToolbar renders the "Search Threads" searchbox and the group-by /
    //     sort-by dropdowns (react-select hidden inputs).
    //   - ThreadsTable renders the thread rows (role="link").
    //   - ErrorBoundary renders its children with no error fallback, which is
    //     evidenced by the table content being present.
    renderWithIntl(RouterWrap, store);
    expect(
      screen.getByRole("searchbox", { name: "Search Threads" })
    ).toBeInTheDocument();
    expect(
      document.querySelector('input[name="form-field-group-by"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('input[name="form-field-sort-by"]')
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  test("passes the correct props down to TableToolbar", () => {
    // NOTE: enzyme read TableToolbar's props object directly. RTL cannot inspect
    // props, so we assert on the DOM those props produce:
    //   - searchInputProps.searchPlaceholder ("Search Threads") -> searchbox
    //     placeholder/aria-label.
    //   - searchInputProps.filterString ("") -> searchbox value.
    //   - groupByProps.groupByAttribute ("none") -> value of the group-by
    //     react-select hidden input.
    //   - sortByProps.sortByAttribute ("id") -> value of the sort-by react-select
    //     hidden input.
    // The option lists (groupByOptions / sortByOptions) are not rendered into the
    // DOM until the dropdown is opened; their selected value is the observable
    // proxy asserted here.
    renderWithIntl(RouterWrap, store);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search Threads"
    });
    expect(searchInput).toHaveAttribute("placeholder", "Search Threads");
    expect(searchInput).toHaveValue("");

    const groupByInput = document.querySelector(
      'input[name="form-field-group-by"]'
    );
    expect(groupByInput).toHaveValue("none");

    const sortByInput = document.querySelector(
      'input[name="form-field-sort-by"]'
    );
    expect(sortByInput).toHaveValue("id");
  });

  test("passes the correct props down to ThreadsTable", () => {
    // NOTE: enzyme read ThreadsTable's `filteredThreadData` prop and matched it
    // against the single RUNNABLE thread (id "2", "Test Runnable") that
    // getVisibleThreads derives from the mock store (threadsFilter "active").
    // RTL cannot inspect props, so we assert on the rendered row: exactly one
    // thread row (role="link") containing the id and name of that thread.
    renderWithIntl(RouterWrap, store);

    const rows = screen.getAllByRole("link");
    expect(rows).toHaveLength(1);

    const row = rows[0];
    expect(within(row).getByText("2")).toBeInTheDocument();
    expect(within(row).getByText("Test Runnable")).toBeInTheDocument();
  });
});
