import React from "react";
import { MemoryRouter, Route } from "react-router";
import { Actions } from "jumpstate";
import _ from "lodash";

// Utilities
import { computeStatus } from "utils/selectors";
import { mountWithIntl } from "utils/i18nTesting";
// Components
import FabricGrid from "./FabricGrid";

// Mock the jumpstate effect used in FabricGrid
Actions.fetchAndStoreFabricMicroservices = jest.fn();

const mockServices = _.values({
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

// Wrap Fabric Grid in Memory Router to mock route props (history, match, location)
const RouterWrap = (route = ["/"], services = mockServices) => {
  return (
    <MemoryRouter initialEntries={route}>
      <Route
        render={(props) => <FabricGrid {...props} services={services} />}
      />
    </MemoryRouter>
  );
};

// A helper function that takes in a filter string and returns only services that match
const filterServicesByStatus = (filter) => {
  return mockServices.filter((service) => {
    let status = computeStatus(
      service.instances.length,
      service.minimum,
      service.maximum
    );
    return status.toLowerCase() === filter;
  });
};

const urlStateDefaults = {
  displayType: "Cards",
  groupByAttribute: "Status",
  searchQuery: "",
  sortByAttribute: "Name"
};

let FabricGridWrap = mountWithIntl(RouterWrap());

describe("Fabric Grid Main View", () => {
  afterEach(() => {
    // Reset the url bar state to defaults after every test
    FabricGridWrap.find("FabricGrid").props().setUrlState(urlStateDefaults);
  });

  test("renders all services in cards view", () => {
    expect(FabricGridWrap.find("GMServiceCard")).toHaveLength(3);
    expect(FabricGridWrap.find("GMServiceListItem")).toHaveLength(0);
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(true);
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(true);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(true);
  });

  test("renders all services in list view", () => {
    FabricGridWrap.find("button[title='List']").simulate("click");
    expect(FabricGridWrap.find("ServicesListItem")).toHaveLength(3);
    expect(FabricGridWrap.find("GMServiceCard")).toHaveLength(0);
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(true);
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(true);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(true);
  });

  test("groups services by Owner, Capability, Status, and None", () => {
    // Group by "Status" (groupByAttribute's default)
    expect(FabricGridWrap.html().includes("down")).toBe(true);
    expect(FabricGridWrap.html().includes("warning")).toBe(true);
    expect(FabricGridWrap.html().includes("stable")).toBe(true);
    // Group by "Owner"
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ groupByAttribute: "Owner" });
    expect(FabricGridWrap.html().includes("domain")).toBe(true);
    expect(FabricGridWrap.html().includes("aac")).toBe(true);
    expect(FabricGridWrap.html().includes("bootstrap")).toBe(true);
    // Group by "Capability"
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ groupByAttribute: "Capability" });
    expect(FabricGridWrap.html().includes("system of record")).toBe(true);
    expect(FabricGridWrap.html().includes("crime fighting")).toBe(true);
    // Group by "None" (there should be no headers present)
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ groupByAttribute: "None" });
    expect(FabricGridWrap.html().includes("GMServiceHeader")).toBe(false);
  });

  test("sorts services by name and status", () => {
    // Sort by "Name"
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ groupByAttribute: "None", sortByAttribute: "Name" });
    // Find and compare indices to determine the sorting order
    let first = FabricGridWrap.html().indexOf("AAC Remote Information");
    let second = FabricGridWrap.html().indexOf("Entry Monitoring");
    let third = FabricGridWrap.html().indexOf(
      "Grace Hopper Battleship Control Program"
    );
    expect(first).toBeLessThan(second);
    expect(second).toBeLessThan(third);
    // Sort by "Status"
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ groupByAttribute: "None", sortByAttribute: "Status" });
    // Sorting by status flips the order of Entry monitoring and AAC
    first = FabricGridWrap.html().indexOf("Entry Monitoring");
    second = FabricGridWrap.html().indexOf("AAC Remote Information");

    expect(first).toBeLessThan(second);
    expect(second).toBeLessThan(third);
  });

  test("filters services based on searchQuery", () => {
    FabricGridWrap.find("FabricGrid")
      .props()
      .setUrlState({ searchQuery: "Grace" });
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(
      false
    );
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(false);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(true);
  });
});

describe("Fabric Grid Status Views", () => {
  afterEach(() => {
    FabricGridWrap.find("FabricGrid").props().setUrlState(urlStateDefaults);
  });

  // In the following tests, we have to generate filtered services to pass down to the route,
  // to mock what we do in FabricGrid router
  test("render the correct services in stable view", () => {
    const filteredServices = filterServicesByStatus("stable");
    FabricGridWrap = mountWithIntl(RouterWrap(["/stable"], filteredServices));

    // Check that there is only one stable card rendered
    expect(FabricGridWrap.find("GMServiceCard")).toHaveLength(1);
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(
      false
    );
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(false);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(true);
  });

  test("render the correct services in warning view", () => {
    const filteredServices = filterServicesByStatus("warning");
    FabricGridWrap = mountWithIntl(RouterWrap(["/warning"], filteredServices));
    // Check that there is only one warning card rendered
    expect(FabricGridWrap.find("GMServiceCard")).toHaveLength(1);
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(true);
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(false);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(false);
  });

  test("render the correct services in down view", () => {
    const filteredServices = filterServicesByStatus("down");
    FabricGridWrap = mountWithIntl(RouterWrap(["/down"], filteredServices));
    // Check that there is only one down card rendered
    expect(FabricGridWrap.find("GMServiceCard")).toHaveLength(1);
    expect(FabricGridWrap.html().includes("AAC Remote Information")).toBe(
      false
    );
    expect(FabricGridWrap.html().includes("Entry Monitoring")).toBe(true);
    expect(
      FabricGridWrap.html().includes("Grace Hopper Battleship Control Program")
    ).toBe(false);
  });
});
