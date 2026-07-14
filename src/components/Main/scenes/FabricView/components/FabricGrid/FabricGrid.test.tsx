import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Actions } from "store/jumpstate";
import { mountWithIntl } from "utils/i18nTesting";
// Utilities
import { computeStatus } from "utils/selectors";
// Components
import FabricGrid from "./FabricGrid";

// Mock the jumpstate effect used in FabricGrid
Actions.fetchAndStoreFabricMicroservices = vi.fn();

const mockServices = Object.values({
  "aac-remote-information-v1-0": {
    authorized: true,
    capability: "Crime Fighting",
    documentation: "https://www.google.com",
    instances: [{ name: "4o896smz6ag0000000000", start_time: 1277071626343 }],
    maximum: 7,
    metered: true,
    minimum: 4,
    name: "AAC Remote Information",
    owner: "Domain",
    runtime: "GO",
    threaded: true,
    version: "1.0",
    slug: "aac-remote-information-v1-0"
  },
  "entry-monitoring-v4-2": {
    authorized: true,
    capability: "Crime Fighting",
    documentation: "https://www.google.com",
    instances: [],
    maximum: 4,
    metered: true,
    minimum: 2,
    name: "Entry Monitoring",
    owner: "AAC",
    runtime: "JVM",
    threaded: true,
    version: "4.2",
    slug: "entry-monitoring-v4-2"
  },
  "grace-hopper-battleship-control-program-v4-6": {
    authorized: true,
    capability: "System of Record",
    documentation: "https://www.google.com",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 }
    ],
    maximum: 7,
    metered: false,
    minimum: 1,
    name: "Grace Hopper Battleship Control Program",
    slug: "grace-hopper-battleship-control-program-v4-6",
    owner: "Bootstrap",
    runtime: "COBOL",
    threaded: false,
    version: "4.6"
  }
});

// Wrap Fabric Grid in Memory Router to mock route props (history, match, location).
// FabricGrid reads its display/group/sort/search state from the URL query string
// (via the withUrlState HOC), so the previous enzyme `setUrlState(...)` calls are
// replaced by rendering at a route whose query string encodes the desired state.
const RouterWrap = (route = ["/"], services = mockServices) => {
  return (
    <MemoryRouter initialEntries={route}>
      <Routes>
        <Route path="*" element={<FabricGrid services={services} />} />
      </Routes>
    </MemoryRouter>
  );
};

// A helper function that takes in a filter string and returns only services that match
const filterServicesByStatus = (filter: string) => {
  return mockServices.filter((service) => {
    let status = computeStatus(
      service.instances.length,
      service.minimum,
      service.maximum
    );
    return status.toLowerCase() === filter;
  });
};

// DOM markers used to translate the old enzyme component queries:
// - Each GMServiceCard renders its name inside a <Title> styled.h1, so the number
//   of <h1> headings equals the number of cards rendered.
// - Each service row (card or list item) renders a single link to its detail page
//   (<a href="/{slug}">); docs links point to external URLs, so anchors whose href
//   starts with "/" count the service rows in either display mode.
// - Group headers (GMServiceHeader) for the Owner/Capability groupings render an
//   <img alt=""> services icon, which is header-exclusive, so counting those
//   distinguishes a grouped view from the ungrouped ("None") view.
const headingCount = (container: HTMLElement) =>
  container.querySelectorAll("h1").length;
const serviceLinkCount = (container: HTMLElement) =>
  container.querySelectorAll('a[href^="/"]').length;
const groupHeaderCount = (container: HTMLElement) =>
  container.querySelectorAll('img[alt=""]').length;

describe("Fabric Grid Main View", () => {
  test("renders all services in cards view", () => {
    const { container } = mountWithIntl(RouterWrap());
    // Cards view (default) renders one <h1> title per card and no list rows.
    expect(headingCount(container)).toBe(3);
    expect(serviceLinkCount(container)).toBe(3);
    expect(container).toHaveTextContent("AAC Remote Information");
    expect(container).toHaveTextContent("Entry Monitoring");
    expect(container).toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });

  test("renders all services in list view", () => {
    const { container } = mountWithIntl(RouterWrap());
    // Toggle to list view by clicking the "List" display-type button.
    fireEvent.click(screen.getByTitle("List"));
    // List rows render the name in a <div>, not an <h1>, so there are no card
    // headings, while each service still renders one detail link.
    expect(headingCount(container)).toBe(0);
    expect(serviceLinkCount(container)).toBe(3);
    expect(container).toHaveTextContent("AAC Remote Information");
    expect(container).toHaveTextContent("Entry Monitoring");
    expect(container).toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });

  test("groups services by Owner, Capability, Status, and None", () => {
    // Group by "Status" (groupByAttribute's default)
    let view = mountWithIntl(RouterWrap());
    expect(view.container.innerHTML.toLowerCase()).toContain("down");
    expect(view.container.innerHTML.toLowerCase()).toContain("warning");
    expect(view.container.innerHTML.toLowerCase()).toContain("stable");
    // Group by "Owner"
    view = mountWithIntl(RouterWrap(["/?groupByAttribute=Owner"]));
    expect(view.container.innerHTML.toLowerCase()).toContain("domain");
    expect(view.container.innerHTML.toLowerCase()).toContain("aac");
    expect(view.container.innerHTML.toLowerCase()).toContain("bootstrap");
    // Group by "Capability"
    view = mountWithIntl(RouterWrap(["/?groupByAttribute=Capability"]));
    expect(view.container.innerHTML.toLowerCase()).toContain(
      "system of record"
    );
    expect(view.container.innerHTML.toLowerCase()).toContain("crime fighting");
    // Group by "None" (there should be no grouping headers present)
    // NOTE: the original assertion `html().includes("GMServiceHeader")` checked
    // for an enzyme component name that never appears in real HTML, so it was
    // vacuous. Instead assert the observable result of "None": no group-header
    // services icon is rendered, and the header-exclusive Owner/Capability titles
    // are absent from the output.
    view = mountWithIntl(RouterWrap(["/?groupByAttribute=None"]));
    expect(groupHeaderCount(view.container)).toBe(0);
    expect(view.container.innerHTML.toLowerCase()).not.toContain("domain");
    expect(view.container.innerHTML.toLowerCase()).not.toContain(
      "system of record"
    );
  });

  test("sorts services by name and status", () => {
    // Sort by "Name"
    let html = mountWithIntl(
      RouterWrap(["/?groupByAttribute=None&sortByAttribute=Name"])
    ).container.innerHTML;
    // Find and compare indices to determine the sorting order
    let first = html.indexOf("AAC Remote Information");
    let second = html.indexOf("Entry Monitoring");
    let third = html.indexOf("Grace Hopper Battleship Control Program");
    expect(first).toBeLessThan(second);
    expect(second).toBeLessThan(third);
    // Sort by "Status"
    html = mountWithIntl(
      RouterWrap(["/?groupByAttribute=None&sortByAttribute=Status"])
    ).container.innerHTML;
    // Sorting by status flips the order of Entry monitoring and AAC
    first = html.indexOf("Entry Monitoring");
    second = html.indexOf("AAC Remote Information");
    third = html.indexOf("Grace Hopper Battleship Control Program");

    expect(first).toBeLessThan(second);
    expect(second).toBeLessThan(third);
  });

  test("filters services based on searchQuery", () => {
    const { container } = mountWithIntl(RouterWrap(["/?searchQuery=Grace"]));
    expect(container).not.toHaveTextContent("AAC Remote Information");
    expect(container).not.toHaveTextContent("Entry Monitoring");
    expect(container).toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });
});

describe("Fabric Grid Status Views", () => {
  // In the following tests, we have to generate filtered services to pass down to the route,
  // to mock what we do in FabricGrid router
  test("render the correct services in stable view", () => {
    const filteredServices = filterServicesByStatus("stable");
    const { container } = mountWithIntl(
      RouterWrap(["/stable"], filteredServices)
    );

    // Check that there is only one stable card rendered
    expect(headingCount(container)).toBe(1);
    expect(container).not.toHaveTextContent("AAC Remote Information");
    expect(container).not.toHaveTextContent("Entry Monitoring");
    expect(container).toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });

  test("render the correct services in warning view", () => {
    const filteredServices = filterServicesByStatus("warning");
    const { container } = mountWithIntl(
      RouterWrap(["/warning"], filteredServices)
    );
    // Check that there is only one warning card rendered
    expect(headingCount(container)).toBe(1);
    expect(container).toHaveTextContent("AAC Remote Information");
    expect(container).not.toHaveTextContent("Entry Monitoring");
    expect(container).not.toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });

  test("render the correct services in down view", () => {
    const filteredServices = filterServicesByStatus("down");
    const { container } = mountWithIntl(
      RouterWrap(["/down"], filteredServices)
    );
    // Check that there is only one down card rendered
    expect(headingCount(container)).toBe(1);
    expect(container).not.toHaveTextContent("AAC Remote Information");
    expect(container).toHaveTextContent("Entry Monitoring");
    expect(container).not.toHaveTextContent(
      "Grace Hopper Battleship Control Program"
    );
  });
});
