import React from "react";
import { screen, fireEvent, within } from "@testing-library/react";
import { renderWithIntl, withIntl } from "utils/i18nTesting";

import TableToolbar from "./index";

const sortByOptions = [
  {
    value: "Name",
    label: "Name"
  },
  {
    value: "Status",
    label: "Status"
  }
];

const groupByOptions = [
  {
    value: "Owner",
    label: "Owner"
  },
  {
    value: "Status",
    label: "Status"
  }
];

const mockFabricViewProps = {
  displayTypeProps: {
    displayType: "Cards" as const,
    setDisplayType: vi.fn()
  },
  searchInputProps: {
    filterString: "",
    setFilterString: vi.fn(),
    searchPlaceholder: "Search Services"
  },
  groupByProps: {
    groupByOptions,
    groupByAttribute: "Status",
    setGroupByAttribute: vi.fn()
  },
  sortByProps: {
    sortByOptions,
    sortByAttribute: "Name",
    setSortByAttribute: vi.fn()
  }
};

describe("Table Toolbar", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(
      <TableToolbar {...mockFabricViewProps} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders search box", () => {
    const { container } = renderWithIntl(
      <TableToolbar {...mockFabricViewProps} />
    );
    expect(container.querySelectorAll('input[type="search"]')).toHaveLength(1);
  });

  test("calls setFilterString when search input field changes", () => {
    const setFilterString = vi.fn();
    renderWithIntl(
      <TableToolbar
        {...mockFabricViewProps}
        searchInputProps={{
          ...mockFabricViewProps.searchInputProps,
          setFilterString
        }}
      />
    );
    const searchInput = document.querySelector('input[type="search"]')!;
    fireEvent.change(searchInput, { target: { value: "foo" } });
    expect(setFilterString).toHaveBeenCalled();
  });

  test("does not render search box if searchInputProps is not provided", () => {
    const { container } = renderWithIntl(
      <TableToolbar {...mockFabricViewProps} searchInputProps={null as any} />
    );
    expect(container.querySelectorAll('input[type="search"]')).toHaveLength(0);
  });

  test("renders display type buttons", () => {
    renderWithIntl(<TableToolbar {...mockFabricViewProps} />);
    expect(screen.getByRole("button", { name: "Cards" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "List" })).toBeInTheDocument();
  });

  test("calls setDisplayType when a display type button is clicked", () => {
    const setDisplayType = vi.fn();
    renderWithIntl(
      <TableToolbar
        {...mockFabricViewProps}
        displayTypeProps={{ displayType: "Cards", setDisplayType }}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cards" }));
    expect(setDisplayType).toHaveBeenCalled();
  });

  test("does not render display type buttons if displayTypeProps is not provided", () => {
    renderWithIntl(
      <TableToolbar {...mockFabricViewProps} displayTypeProps={null as any} />
    );
    expect(screen.queryByRole("button", { name: "Cards" })).toBeNull();
    expect(screen.queryByRole("button", { name: "List" })).toBeNull();
  });

  test("adds an active class to button that matches displayType", () => {
    // NOTE: enzyme asserted on Button's `active` prop directly. RTL is DOM-based,
    // so we assert on the observable styled-components output the `active` prop
    // produces: an active button renders with the brand-primary background color,
    // an inactive button with the white/default background. We compare the
    // resolved background-color style of each button before and after switching
    // displayType to "List".
    const { rerender } = renderWithIntl(
      <TableToolbar {...mockFabricViewProps} />
    );
    let cardButton = screen.getByRole("button", { name: "Cards" });
    let listButton = screen.getByRole("button", { name: "List" });
    const cardActiveBg = getComputedStyle(cardButton).backgroundColor;
    const listInactiveBg = getComputedStyle(listButton).backgroundColor;
    expect(cardActiveBg).not.toBe(listInactiveBg);

    rerender(
      withIntl(
        <TableToolbar
          {...mockFabricViewProps}
          displayTypeProps={{ displayType: "List", setDisplayType: vi.fn() }}
        />
      )
    );
    cardButton = screen.getByRole("button", { name: "Cards" });
    listButton = screen.getByRole("button", { name: "List" });
    // After switching, the List button takes on the active background that the
    // Cards button had, and vice versa.
    expect(getComputedStyle(listButton).backgroundColor).toBe(cardActiveBg);
    expect(getComputedStyle(cardButton).backgroundColor).toBe(listInactiveBg);
  });

  // TODO: Figure out how to simulate a change event with react-select so we can test onChange handlers

  test("renders a group by dropdown with a value equal to groupByAttribute", () => {
    renderWithIntl(<TableToolbar {...mockFabricViewProps} />);
    const hiddenInput = document.querySelector(
      'input[name="form-field-group-by"]'
    );
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveValue("Status");
  });

  test("does not render a group by dropdown if groupByProps is not provided", () => {
    renderWithIntl(
      <TableToolbar {...mockFabricViewProps} groupByProps={null as any} />
    );
    expect(
      document.querySelector('input[name="form-field-group-by"]')
    ).toBeNull();
  });

  test("renders a sort by dropdown", () => {
    renderWithIntl(<TableToolbar {...mockFabricViewProps} />);
    const hiddenInput = document.querySelector(
      'input[name="form-field-sort-by"]'
    );
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveValue("Name");
  });

  test("does not render a group by dropdown if sortByProps is not provided", () => {
    renderWithIntl(
      <TableToolbar {...mockFabricViewProps} sortByProps={null as any} />
    );
    expect(
      document.querySelector('input[name="form-field-sort-by"]')
    ).toBeNull();
  });

  test("optional children props render additional nodes into their corresponding columns", () => {
    renderWithIntl(
      <TableToolbar
        {...mockFabricViewProps}
        toolbarLeftChildren={<h1>Left Child</h1>}
        toolbarCenterChildren={<h1>Center Child</h1>}
        toolbarRightChildren={<h1>Right Child</h1>}
      />
    );
    const headers = screen.getAllByRole("heading", { level: 1 });
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent("Left Child");
    expect(headers[1]).toHaveTextContent("Center Child");
    expect(headers[2]).toHaveTextContent("Right Child");
  });
});
