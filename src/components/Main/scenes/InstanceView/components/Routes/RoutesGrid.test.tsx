import { fireEvent, screen, within } from "@testing-library/react";
// Utilities
import createTestStore from "json/createTestStore";
import mockState from "json/mockReduxState";
import { MemoryRouter } from "react-router-dom";
import { renderWithIntl } from "utils/i18nTesting";

// Components
import RoutesGrid from "./index";

// Create a real test store and initialize with mock data
const store = createTestStore(mockState);

describe("RoutesGrid View", () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <RoutesGrid />
      </MemoryRouter>,
      store
    );
  });

  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(
      <MemoryRouter>
        <RoutesGrid />
      </MemoryRouter>,
      store
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders correct components", () => {
    // TableToolbar renders the search input (a <input type="search">) and the
    // Sort By dropdown (react-select combobox); Table renders one <li role="link">
    // per route; ErrorBoundary is an invisible wrapper around Table so we assert
    // on the Table rows it guards.
    // NOTE: original counted <TableToolbar/>, <Table/> and <ErrorBoundary/> by
    // component type. RTL is DOM-based, so we assert the observable DOM each
    // produces: the toolbar's searchbox + sort combobox, and the Table's rows.
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  test("renders NotFoundError when there are no routes", () => {
    // create state with no metrics and reconfigure test store with new state
    const state = Object.assign({}, mockState, { instance: { metrics: {} } });
    const emptyStore = createTestStore(state);
    renderWithIntl(
      <MemoryRouter>
        <RoutesGrid />
      </MemoryRouter>,
      emptyStore
    );
    // NOTE: original asserted one <NotFoundError/> instance. NotFoundError
    // renders its errorMsg as text, so we assert the rendered message instead.
    expect(screen.getByText("No Routes Found")).toBeInTheDocument();
  });

  test("passes the correct props down to TableToolbar", () => {
    // NOTE: original read TableToolbar's props object directly. RTL cannot read
    // props, so we assert the DOM those props produce.
    // searchInputProps.searchPlaceholder ("Search Routes") and
    // searchInputProps.filterString ("") manifest on the search input.
    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveAttribute("placeholder", "Search Routes");
    expect(searchInput).toHaveValue("");

    // sortByProps.sortByAttribute ("route") manifests as the selected value
    // displayed in the Sort By dropdown, rendered as "Sort Route".
    const sortDropdown = screen.getByRole("combobox");
    expect(sortDropdown.closest(".gm-select__control")).toHaveTextContent(
      "Sort Route"
    );

    // sortByProps.sortByOptions manifest as the dropdown's menu options once it
    // is opened. Open the menu and assert every option label is present.
    fireEvent.keyDown(sortDropdown, { key: "ArrowDown", code: "ArrowDown" });
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByText(
      /^(Route|Requests|Error %|Latency 50%|Latency 99%)$/
    );
    expect(options.map((opt) => opt.textContent)).toEqual([
      "Route",
      "Requests",
      "Error %",
      "Latency 50%",
      "Latency 99%"
    ]);
  });

  test("passes the correct props down to Table", () => {
    // NOTE: original read Table's props (items + type:"Route"). RTL cannot read
    // props, so we assert the DOM those items produce: one row per route, each
    // showing the route path and verb. Routes are sorted ascending by route, so
    // "/functionalroles" precedes "/ping".
    const rows = screen.getAllByRole("link");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("/functionalroles");
    expect(rows[1]).toHaveTextContent("/ping");
    rows.forEach((row) => expect(row).toHaveTextContent("GET"));
  });
});
