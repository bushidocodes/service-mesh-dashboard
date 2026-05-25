import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl, intlShape } from "react-intl";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";

ServiceHeaderContent.propTypes = {
  instanceCount: PropTypes.number,
  intl: intlShape.isRequired,
  pathname: PropTypes.string
};

function ServiceHeaderContent({ instanceCount, pathname, intl }) {
  return (
    <TabNav>
      <Tab
        title={intl.formatMessage({
          id: "serviceHeaderContent.instances",
          defaultMessage: "Instances",
          description: "Service view tab title"
        })}
        href={pathname}
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "serviceHeaderContent.instances",
              defaultMessage: "Instances",
              description: "Service view tab detail"
            }),
            value: instanceCount || 0
          }
        ]}
      />
    </TabNav>
  );
}

function mapStateToProps(state, ownProps) {
  const {
    fabric: { services }
  } = state;
  const {
    match: {
      params: { selectedServiceSlug }
    },
    location: { pathname }
  } = ownProps;
  return {
    instanceCount:
      services &&
      services[selectedServiceSlug] &&
      services[selectedServiceSlug].instances &&
      services[selectedServiceSlug].instances.length,
    pathname
  };
}

export default withRouter(
  connect(mapStateToProps)(injectIntl(ServiceHeaderContent))
);
