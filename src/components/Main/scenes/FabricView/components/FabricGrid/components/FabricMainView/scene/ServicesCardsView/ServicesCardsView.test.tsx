import { render, screen } from "@testing-library/react";
import GMServiceHeader from "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader";
import mockMappedServices from "json/mockMappedServices";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ServicesCardsView from "./ServicesCardsView";

// ServicesCardsView groups services and renders a tree of presentational
// components. Enzyme counted those components by type (.find(Comp)) and read
// their props; RTL is DOM-based, so each child is replaced with an identifiable
// stub. Container/section stubs pass children through so the nested counts stay
// observable; GMServiceHeader is a vi.fn so we can inspect the props it
// received (the original .find(GMServiceHeader).props() check).
// Vitest mock factories are hoisted and ESM-shaped: default-imported stubs go
// on `default`, and real React comes from the async `vi.importActual`.
vi.mock("./components/GMServiceViewContainer", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "view-container" }, children)
  };
});
vi.mock("./components/GMServiceCardsView", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "cards-view" }, children)
  };
});
vi.mock("./components/GMServiceCardCollection", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: () =>
      React.createElement("div", { "data-testid": "card-collection" })
  };
});
vi.mock(
  "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader",
  async () => {
    const React = await vi.importActual<typeof import("react")>("react");
    return {
      default: vi.fn(() =>
        React.createElement("div", { "data-testid": "service-header" })
      )
    };
  }
);

const RouterWrap = (
  route: string[],
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
const filterServicesByStatus = (filter: string) => {
  return mockMappedServices.filter((service) => {
    return service.status.toLowerCase() === filter;
  });
};

describe("ServicesCardsView component rendering", () => {
  beforeEach(() => {
    vi.mocked(GMServiceHeader).mockClear();
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
    vi.mocked(GMServiceHeader).mockClear();
  });

  test("Has appropriate heading when group filter is applied ", () => {
    render(RouterWrap(["/"], filteredServices, "Owner"));
    // The first GMServiceHeader receives headerTitle "stable" and, since the
    // group is "Owner" (not "Status"), showStatusIcon false.
    expect(vi.mocked(GMServiceHeader).mock.calls[0][0].headerTitle).toBe(
      "stable"
    );
    expect(vi.mocked(GMServiceHeader).mock.calls[0][0].showStatusIcon).toBe(
      false
    );
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
