import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";

import mockMappedServices from "json/mockMappedServices";

import ServicesCardsView from "./ServicesCardsView";
import GMServiceCardCollection from "./components/GMServiceCardCollection";
import GMServiceCardsView from "./components/GMServiceCardsView";
import GMServiceViewContainer from "./components/GMServiceViewContainer";

import GMServiceHeader from "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader";

const RouterWrap = (
  route,
  services = mockMappedServices,
  groupByAttribute = "Status"
) => {
  return (
    <MemoryRouter initialEntries={route}>
      <Route
        render={(props) => (
          <ServicesCardsView
            {...props}
            groupByAttribute={groupByAttribute}
            sortByAttribute={"Name"}
            services={services}
          />
        )}
      />
    </MemoryRouter>
  );
};

// used to filter mockMappedServices and return filtered array of mock mapped services
const filterServicesByStatus = (filter) => {
  return mockMappedServices.filter((service) => {
    return service.status.toLowerCase() === filter;
  });
};

let wrapper;

describe("ServicesCardsView component rendering", () => {
  beforeEach(function () {
    wrapper = mount(RouterWrap(["/"]));
  });

  //snapshot test is left out as the randomly generated key requires updating snapshot each time
  xtest("Has a snapshot", () => {
    wrapper = shallow(RouterWrap(["/"]));
    expect(wrapper).toMatchSnapshot();
  });

  test("Has a GMServicesViewContainer", () => {
    expect(wrapper.find(GMServiceViewContainer).length).toBe(1);
  });

  test("Has a GMServicesViewContainer wrapper", () => {
    expect(wrapper.find(GMServiceViewContainer).length).toBe(1);
  });

  test("Has a 3 GMServiceCardsView when we pass services with all statuses ", () => {
    expect(wrapper.find(GMServiceCardsView).length).toBe(3);
  });
});

describe("ServicesCardsView functionality", () => {
  const filteredServices = filterServicesByStatus("stable");
  test("Has appropriate heading when group filter is applied ", () => {
    wrapper = mount(RouterWrap(["/"], filteredServices, "Owner"));
    expect(wrapper.find(GMServiceHeader).props().headerTitle).toBe("stable");
    expect(wrapper.find(GMServiceHeader).props().showStatusIcon).toBe(false);
  });

  test("Has only one GMServiceCardCollection when group filter is set to none", () => {
    wrapper = mount(RouterWrap(["/"], filteredServices, "None"));
    expect(wrapper.find(GMServiceCardCollection).length).toBe(1);
  });

  test("Has a 1 GMServiceCardsView when we only pass stable services to the component ", () => {
    wrapper = mount(RouterWrap(["/"], filteredServices, "Status"));
    expect(wrapper.find(GMServiceCardsView).length).toBe(1);
  });

  test("Has a 0 GMServiceCardsView within GMServicesViewContainer when we don't pass in any services ", () => {
    const filteredServicesEmpty = filterServicesByStatus("");
    wrapper = mount(RouterWrap(["/"], filteredServicesEmpty, "Status"));
    expect(wrapper.find(GMServiceViewContainer).length).toBe(1);
    expect(wrapper.find(GMServiceCardsView).length).toBe(0);
  });
});
