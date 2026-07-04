import React from "react";
import { connect } from "react-redux";
import type { RootState } from "types";
import { withRouter } from "utils/withRouter";
import { injectIntl } from "utils/injectIntl";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";

interface ServiceHeaderContentProps {
  instanceCount?: number;
  intl: any;
  pathname?: string;
}

function ServiceHeaderContent({
  instanceCount,
  pathname,
  intl
}: ServiceHeaderContentProps) {
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

function mapStateToProps(state: RootState, ownProps: any) {
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
