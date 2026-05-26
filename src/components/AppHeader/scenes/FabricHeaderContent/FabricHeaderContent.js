import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl, intlShape } from "react-intl";

import { microserviceStatuses } from "utils/constants";
import { getStatusCount } from "utils/selectors";
import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";

FabricAppHeaderContent.propTypes = {
  intl: PropTypes.object.isRequired,
  statusCount: PropTypes.shape({
    Down: PropTypes.number,
    Stable: PropTypes.number,
    Warning: PropTypes.number,
    total: PropTypes.number.isRequired
  })
};

function FabricAppHeaderContent({ statusCount, intl }) {
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
                value: statusCount[status]
              }
            ]}
            key={status}
          />
        );
      })}
    </TabNav>
  );
}

function mapStateToProps(state) {
  return {
    intl: intlShape.isRequired,
    statusCount: getStatusCount(state)
  };
}

export default withRouter(
  connect(mapStateToProps)(injectIntl(FabricAppHeaderContent))
);
