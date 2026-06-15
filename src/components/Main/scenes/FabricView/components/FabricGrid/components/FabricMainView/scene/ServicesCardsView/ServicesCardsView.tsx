import _ from "lodash";
import React from "react";
import { withRouter } from "utils/withRouter";

import GMServiceHeader from "components/Main/scenes/FabricView/components/FabricGrid/components/FabricMainView/components/GMServiceHeader";
import { microserviceStatuses } from "utils/constants";

import GMServiceCardCollection from "./components/GMServiceCardCollection";
import GMServiceCardsView from "./components/GMServiceCardsView";
import GMServiceViewContainer from "./components/GMServiceViewContainer";
import SectionContent from "./components/SectionContent";
import SectionHeader from "./components/SectionHeader";

import type { ServiceItem, RouterLocation } from "types";

interface CardsViewProps {
  ascending?: boolean;
  groupByAttribute: string;
  location?: RouterLocation;
  services: ServiceItem[];
  sortByAttribute: string;
}

function CardsView({
  ascending,
  groupByAttribute,
  sortByAttribute,
  services
}: CardsViewProps) {
  if (groupByAttribute !== "None") {
    const dataGroupedByHeader = (Object as any).groupBy(services, (item) =>
      item.headerTitle.toLowerCase()
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
        !_.isEmpty(dataGroupedByHeader[header]) &&
        !_.isEmpty(dataGroupedByHeader[header][0])
      );
    });

    return (
      <GMServiceViewContainer>
        {verifiedHeaders.map((header, i) => (
          <GMServiceCardsView key={header}>
            <SectionHeader>
              <GMServiceHeader
                headerTitle={header}
                showStatusIcon={groupByAttribute === "Status"}
              />
            </SectionHeader>
            <SectionContent>
              <GMServiceCardCollection
                items={_.orderBy(
                  dataGroupedByHeader[header],
                  [
                    (item) =>
                      sortByAttribute === "Status"
                        ? microserviceStatuses.indexOf(item.status)
                        : item.name,
                    "name"
                  ],
                  ascending ? ["asc", "asc"] : ["desc", "asc"]
                )}
              />
            </SectionContent>
          </GMServiceCardsView>
        ))}
      </GMServiceViewContainer>
    );
  } else {
    return (
      <GMServiceViewContainer>
        <GMServiceCardsView>
          <SectionContent>
            <GMServiceCardCollection
              items={_.orderBy(
                services,
                [
                  (item) =>
                    sortByAttribute === "Status"
                      ? microserviceStatuses.indexOf(item.status)
                      : item.name,
                  "name"
                ],
                ascending ? ["asc", "asc"] : ["desc", "asc"]
              )}
            />
          </SectionContent>
        </GMServiceCardsView>
      </GMServiceViewContainer>
    );
  }
}

export default withRouter(CardsView);
