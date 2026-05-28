import _ from "lodash";
import React from "react";
import { PropTypes } from "prop-types";
import { injectIntl } from "react-intl";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import ArrayValue from "components/ArrayValue";
import { metricsShape } from "components/PropTypes";
import UpTime from "components/UpTime";
import { getLatestAttribute } from "utils/latestAttribute";

GoHeaderContent.propTypes = {
  basePath: PropTypes.string,
  headerTabs: PropTypes.arrayOf(PropTypes.element),
  metrics: metricsShape.isRequired
};

/**
 * Go Header Content
 * @export
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
function GoHeaderContent({ basePath, metrics, headerTabs, intl }) {
  return (
    <TabNav>
      <Tab
        href={`${basePath}/summary`}
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "goHeaderContent.uptime",
              defaultMessage: "Uptime",
              description: "Tab detail"
            }),
            value: (
              <UpTime
                startTime={getLatestAttribute(metrics, "system/start_time")}
                render={(uptime) => (
                  <ArrayValue>
                    {_.map(uptime, (el) => (
                      <span key={el}>{el} </span>
                    ))}
                  </ArrayValue>
                )}
              />
            )
          }
        ]}
        tabIndex={0}
        title={intl.formatMessage({
          id: "goHeaderContent.summary",
          defaultMessage: "Summary",
          description: "Tab title"
        })}
      />
      <Tab
        href={`${basePath}/routes`}
        icon="Functions"
        lines={[
          {
            name: intl.formatMessage({
              id: "goHeaderContent.requests",
              defaultMessage: "Requests",
              description: "Tab detail"
            }),
            value: Number(
              getLatestAttribute(metrics, "HTTP/requests") +
                getLatestAttribute(metrics, "HTTPS/requests")
            ).toLocaleString()
          }
        ]}
        tabIndex={0}
        title={intl.formatMessage({
          id: "goHeaderContent.routes",
          defaultMessage: "Routes",
          description: "Tab title"
        })}
      />
      <Tab
        href={`${basePath}/functions`}
        icon="Functions"
        lines={[
          {
            name: intl.formatMessage({
              id: "goHeaderContent.requests",
              defaultMessage: "Requests",
              description: "Tab detail"
            }),
            value: getLatestAttribute(metrics, "RPC/requests", 0)
          }
        ]}
        tabIndex={0}
        title={intl.formatMessage({
          id: "goHeaderContent.functions",
          defaultMessage: "Functions",
          description: "Tab title"
        })}
      />
      {headerTabs}
      {/* Holding off on the configuration tab until we have something to configure */}
      {/* <TabGroup> */}
      <Tab
        href={`${basePath}/explorer`}
        icon="Explorer"
        tabIndex={0}
        title={intl.formatMessage({
          id: "goHeaderContent.explorer",
          defaultMessage: "Explorer",
          description: "Tab title"
        })}
      />
    </TabNav>
  );
}

export default injectIntl(GoHeaderContent);
