import React from "react";
import { screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { renderWithIntl } from "utils/i18nTesting";

import ServiceView from "./ServiceView";

const mockData = {
  instances: [
    { name: "serviceID1", start_time: 600000000000 },
    { name: "serviceID2", start_time: 300000000000 },
    { name: "serviceID3", start_time: 400000000000 }
  ],
  selectedServiceSlug: "cool-service-v1-0",
  serviceIsMetered: true,
  status: "stable"
};

// Wrap Service View in Memory Router to mock route props (history, match, location)
const RouterWrap = (
  <MemoryRouter>
    <Routes>
      <Route path="*" element={<ServiceView {...mockData} />} />
    </Routes>
  </MemoryRouter>
);

describe("Service View", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(RouterWrap);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders all instances", () => {
    renderWithIntl(RouterWrap);
    // Each instance renders a GMServiceTableLineItem whose name is shown inside a
    // GMLink (an <a>). Three instances therefore produce three instance links.
    const instanceLinks = screen.getAllByRole("link");
    expect(instanceLinks).toHaveLength(3);
    expect(screen.getByText("serviceID1")).toBeInTheDocument();
    expect(screen.getByText("serviceID2")).toBeInTheDocument();
    expect(screen.getByText("serviceID3")).toBeInTheDocument();
  });

  test("passes the correct props down to TableToolbar", () => {
    renderWithIntl(RouterWrap);
    // searchInputProps: filterString "" -> empty search input;
    // searchPlaceholder "Search Instances" -> input placeholder.
    const searchInput = document.querySelector('input[type="search"]');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
    expect(searchInput).toHaveAttribute("placeholder", "Search Instances");
    // sortByProps.sortByAttribute "name" -> the sort-by dropdown's hidden input
    // value, and the selected option's label ("Name") is rendered as text.
    const sortByInput = document.querySelector(
      'input[name="form-field-sort-by"]'
    );
    expect(sortByInput).toBeInTheDocument();
    expect(sortByInput).toHaveValue("name");
    // sortByOptions -> the selected value renders the "Name" label for the
    // sortByAttribute "name". (The "Uptime" option is only rendered into the DOM
    // when the dropdown menu is open, so the closed-state observable proxy is the
    // selected "Name" label.)
    // NOTE: enzyme asserted the full sortByOptions array on TableToolbar's props.
    // RTL can only observe the currently selected option ("Name") in the closed
    // dropdown; the option labels are not in the DOM until the menu is opened.
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("passes the correct props down to ThreadsTable", () => {
    renderWithIntl(RouterWrap);
    // type "Instance" -> the table renders the Instance column headers.
    expect(screen.getByText("Instance")).toBeInTheDocument();
    // "Uptime" appears both as a sort option label proxy and as a column header;
    // assert it is present as a table header.
    expect(screen.getAllByText("Uptime").length).toBeGreaterThanOrEqual(1);
    // items (the three instances) -> three rendered rows, one link each, with the
    // selectedServiceSlug + name forming each link's href.
    const instanceLinks = screen.getAllByRole("link");
    expect(instanceLinks).toHaveLength(3);
    const firstRow = screen.getByText("serviceID1").closest("a");
    expect(firstRow).toHaveAttribute("href", "/cool-service-v1-0/serviceID1");
  });
});
