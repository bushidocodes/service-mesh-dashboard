/* eslint-disable react/no-multi-comp -- lightweight jest.mock stubs */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import mockMappedServices from "json/mockMappedServices";

import ServicesCardsView from "./ServicesCardsView";
import GMServiceHeader from "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader";

// ServicesCardsView groups services and renders a tree of presentational
// components. Enzyme counted those components by type (.find(Comp)) and read
// their props; RTL is DOM-based, so each child is replaced with an identifiable
// stub. Container/section stubs pass children through so the nested counts stay
// observable; GMServiceHeader is a jest.fn so we can inspect the props it
// received (the original .find(GMServiceHeader).props() check).
jest.mock("./components/GMServiceViewContainer", () => {
  const React = require("react");
  return ({ children }) =>
    React.createElement("div", { "data-testid": "view-container" }, children);
});
jest.mock("./components/GMServiceCardsView", () => {
  const React = require("react");
  return ({ children }) =>
    React.createElement("div", { "data-testid": "cards-view" }, children);
});
jest.mock("./components/GMServiceCardCollection", () => {
  const React = require("react");
  return () => React.createElement("div", { "data-testid": "card-collection" });
});
jest.mock(
  "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader",
  () => {
    const React = require("react");
    return jest.fn(() =>
      React.createElement("div", { "data-testid": "service-header" })
    );
  }
);

const RouterWrap = (
  route,
  services = mockMappedServices,
  groupByAttribute = "Status"
) => {
  return (
    <MemoryRouter initialEntries={route}>
      <Routes>
        <Route
          path="*"
          element={
            <ServicesCardsView
              groupByAttribute={groupByAttribute}
              sortByAttribute={"Name"}
              services={services}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

// used to filter mockMappedServices and return filtered array of mock mapped services
const filterServicesByStatus = (filter) => {
  return mockMappedServices.filter((service) => {
    return service.status.toLowerCase() === filter;
  });
};

describe("ServicesCardsView component rendering", () => {
  beforeEach(() => {
    GMServiceHeader.mockClear();
  });

  // Card keys are now derived from the (deterministic) group header rather than
  // a random value, so the snapshot is stable across runs.
  test("Has a snapshot", () => {
    const { asFragment } = render(RouterWrap(["/"]));
    expect(asFragment()).toMatchSnapshot();
  });

  test("Has a GMServicesViewContainer", () => {
    render(RouterWrap(["/"]));
    expect(screen.getAllByTestId("view-container")).toHaveLength(1);
  });

  test("Has a GMServicesViewContainer wrapper", () => {
    render(RouterWrap(["/"]));
    expect(screen.getAllByTestId("view-container")).toHaveLength(1);
  });

  test("Has a 3 GMServiceCardsView when we pass services with all statuses ", () => {
    render(RouterWrap(["/"]));
    expect(screen.getAllByTestId("cards-view")).toHaveLength(3);
  });
});

describe("ServicesCardsView functionality", () => {
  const filteredServices = filterServicesByStatus("stable");

  beforeEach(() => {
    GMServiceHeader.mockClear();
  });

  test("Has appropriate heading when group filter is applied ", () => {
    render(RouterWrap(["/"], filteredServices, "Owner"));
    // The first GMServiceHeader receives headerTitle "stable" and, since the
    // group is "Owner" (not "Status"), showStatusIcon false.
    expect(GMServiceHeader.mock.calls[0][0].headerTitle).toBe("stable");
    expect(GMServiceHeader.mock.calls[0][0].showStatusIcon).toBe(false);
  });

  test("Has only one GMServiceCardCollection when group filter is set to none", () => {
    render(RouterWrap(["/"], filteredServices, "None"));
    expect(screen.getAllByTestId("card-collection")).toHaveLength(1);
  });

  test("Has a 1 GMServiceCardsView when we only pass stable services to the component ", () => {
    render(RouterWrap(["/"], filteredServices, "Status"));
    expect(screen.getAllByTestId("cards-view")).toHaveLength(1);
  });

  test("Has a 0 GMServiceCardsView within GMServicesViewContainer when we don't pass in any services ", () => {
    const filteredServicesEmpty = filterServicesByStatus("");
    render(RouterWrap(["/"], filteredServicesEmpty, "Status"));
    expect(screen.getAllByTestId("view-container")).toHaveLength(1);
    expect(screen.queryAllByTestId("cards-view")).toHaveLength(0);
  });
});
