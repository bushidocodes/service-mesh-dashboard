import React from "react";

import ServicesCardsView from "./scene/ServicesCardsView";
import ServicesListView from "./scene/ServicesListView";

import ErrorBoundary from "components/ErrorBoundary";
import { computeStatus } from "utils/selectors";

interface FabricMainViewProps {
  ascending?: boolean;
  displayType: string;
  groupByAttribute: string;
  services: unknown[];
  sortByAttribute: string;
}

// receive filtered 'services' from FabricGrid
export default function FabricMainView({
  ascending,
  displayType,
  groupByAttribute,
  sortByAttribute,
  services
}: FabricMainViewProps) {
  // Do data transformation stuff
  const mappedServices = services.map((service: any) => {
    return {
      ...service,
      authorized: service.authorized,
      headerTitle: computeHeaderTitle(groupByAttribute, service),
      docsLink: service.documentation,
      status: computeStatus(
        service.instances.length,
        service.minimum,
        service.maximum
      )
    };
  });

  if (displayType === "Cards") {
    return (
      <ErrorBoundary>
        <ServicesCardsView
          groupByAttribute={groupByAttribute}
          sortByAttribute={sortByAttribute}
          services={mappedServices}
          ascending={ascending}
        />
      </ErrorBoundary>
    );
  } else if (displayType === "List") {
    return (
      <ErrorBoundary>
        <ServicesListView
          groupByAttribute={groupByAttribute}
          sortByAttribute={sortByAttribute}
          services={mappedServices}
          ascending={ascending}
        />
      </ErrorBoundary>
    );
  }
}

function computeHeaderTitle(groupByAttribute, service) {
  switch (groupByAttribute) {
    case "Status":
      return computeStatus(
        service.instances.length,
        service.minimum,
        service.maximum
      );
    case "Owner":
      return service.owner || "No Owner Defined";
    case "Capability":
      return service.capability || "No Capability Defined";
    case "None":
    default:
      return "none";
  }
}
