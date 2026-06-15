import React from "react";
import { connect } from "react-redux";
import { withRouter } from "utils/withRouter";
import { injectIntl } from "react-intl";

import { microserviceStatuses } from "utils/constants";
import { getStatusCount } from "utils/selectors";
import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";

interface FabricAppHeaderContentProps {
  intl: any;
  // Always supplied by the getStatusCount selector via connect().
  statusCount: {
    Down?: number;
    Stable?: number;
    Warning?: number;
    total: number;
  };
}

function FabricAppHeaderContent({
  statusCount,
  intl
}: FabricAppHeaderContentProps) {
  return (
    <TabNav>
      <Tab
        title={intl.formatMessage({
          id: "fabricHeaderContent.allServices",
          defaultMessage: "All Services",
          description: "Fabric view tab title"
        })}
        href="/"
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "fabricHeaderContent.services",
              defaultMessage: "Services",
              description: "Fabric view tab detail"
            }),
            value: statusCount.total
          }
        ]}
      />
      {microserviceStatuses.map((status) => {
        return (
          <Tab
            title={intl.formatMessage({
              id: `fabricHeaderContent.${status.toLowerCase()}`,
              defaultMessage: `${status}`,
              description: "Fabric view tab title"
            })}
            href={`/${status}`}
            icon={status}
            lines={[
              {
                name: intl.formatMessage({
                  id: "fabricHeaderContent.services",
                  defaultMessage: "Services",
                  description: "Fabric view tab detail"
                }),
                value: statusCount[status as keyof typeof statusCount]
              }
            ]}
            key={status}
          />
        );
      })}
    </TabNav>
  );
}

function mapStateToProps(state: any) {
  return {
    statusCount: getStatusCount(state)
  };
}

export default withRouter(
  connect(mapStateToProps)(injectIntl(FabricAppHeaderContent))
);
