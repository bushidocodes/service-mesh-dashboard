import React, { Fragment } from "react";
import { isEmpty, orderBy } from "utils/collections";
import { withRouter } from "utils/withRouter";

import ServicesList from "./components/ServicesList";
import SectionContainer from "./components/SectionContainer";
import SectionContent from "./components/SectionContent";
import SectionHeader from "./components/SectionHeader";

import GMServiceHeader from "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader";
import { microserviceStatuses } from "utils/constants";

import type { ServiceItem, RouterLocation } from "types";

interface ListViewProps {
  ascending?: boolean;
  groupByAttribute: string;
  location?: RouterLocation;
  services: ServiceItem[];
  sortByAttribute: string;
}

function ListView({
  ascending,
  groupByAttribute,
  sortByAttribute,
  services
}: ListViewProps) {
  // get unique headers
  if (groupByAttribute !== "None") {
    const dataGroupedByHeader = Object.groupBy(services, (item: ServiceItem) =>
      (item.headerTitle ?? "").toLowerCase()
    );
    const headerTitles = Object.keys(dataGroupedByHeader);

    let headers;

    // If we are sorting by status, use microServiceStatuses as the headers
    // as they need to be in the order "Down, Warning, Stable"
    if (groupByAttribute === "Status") {
      headers = microserviceStatuses.map((item) => item.toLowerCase());
    } else {
      headers = headerTitles;
    }

    let verifiedHeaders = headers.filter((header) => {
      // checks to make sure there are microservices within the array
      return (
        !isEmpty(dataGroupedByHeader[header]) &&
        !isEmpty(dataGroupedByHeader[header]?.[0])
      );
    });

    return (
      <Fragment>
        {verifiedHeaders.map((header, i) => (
          <SectionContainer key={header}>
            <SectionHeader>
              <GMServiceHeader
                headerTitle={header}
                showStatusIcon={groupByAttribute === "Status"}
              />
            </SectionHeader>
            <SectionContent>
              <ServicesList
                items={orderBy(
                  dataGroupedByHeader[header],
                  [
                    (item) =>
                      sortByAttribute === "Status"
                        ? microserviceStatuses.indexOf(item.status ?? "")
                        : item.name,
                    "name"
                  ],
                  ascending ? ["asc", "asc"] : ["desc", "asc"]
                )}
                groupByAttribute={groupByAttribute}
              />
            </SectionContent>
          </SectionContainer>
        ))}
      </Fragment>
    );
  } else {
    return (
      <SectionContainer>
        <SectionContent>
          <ServicesList
            items={orderBy(
              services,
              [
                (item) =>
                  sortByAttribute === "Status"
                    ? microserviceStatuses.indexOf(item.status ?? "")
                    : item.name,
                "name"
              ],
              ascending ? ["asc", "asc"] : ["desc", "asc"]
            )}
          />
        </SectionContent>
      </SectionContainer>
    );
  }
}

export default withRouter(ListView);
