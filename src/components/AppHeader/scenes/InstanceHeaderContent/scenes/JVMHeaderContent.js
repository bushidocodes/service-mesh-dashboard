import _ from "lodash";
import React from "react";
import { PropTypes } from "prop-types";
import { injectIntl } from "react-intl";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import ArrayValue from "components/ArrayValue";
import { metricsShape } from "components/PropTypes";
import ThreadCounts from "components/ThreadCounts";
import UpTime from "components/UpTime";
import { getLatestAttribute } from "utils/latestAttribute";
import { getSparkLineOfValue } from "utils/sparklines";

JVMHeaderContent.propTypes = {
  basePath: PropTypes.string,
  headerTabs: PropTypes.arrayOf(PropTypes.element),
  intl: PropTypes.object.isRequired,
  metrics: metricsShape.isRequired
};

/**
 * JVM Header Content
 * @export
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
function JVMHeaderContent({ basePath, metrics, headerTabs, intl }) {
  return (
    <TabNav>
      <Tab
        href={`${basePath}/summary`}
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "jvmHeaderContent.uptime",
              defaultMessage: "Uptime",
              description: "Tab detail"
            }),
            value: (
              <UpTime
                startTime={getLatestAttribute(metrics, "jvm/start_time")}
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
          id: "jvmHeaderContent.summary",
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
              id: "jvmHeaderContent.requests",
              defaultMessage: "Requests",
              description: "Tab detail"
            }),
            value: Number(
              getLatestAttribute(metrics, "http/requests") +
                getLatestAttribute(metrics, "https/requests")
            ).toLocaleString()
          }
        ]}
        tabIndex={0}
        title={intl.formatMessage({
          id: "jvmHeaderContent.routes",
          defaultMessage: "Routes",
          description: "Tab title"
        })}
      />
      <Tab
        chartData={getSparkLineOfValue(metrics, "jvm/thread/count")}
        href={`${basePath}/threads`}
        icon="Threads"
        lines={[
          {
            name: intl.formatMessage({
              id: "jvmHeaderContent.threads",
              defaultMessage: "Threads",
              description: "Tab detail"
            }),
            value: <ThreadCounts render={(threadCounts) => threadCounts.all} />
          }
        ]}
        tabIndex={0}
        title={intl.formatMessage({
          id: "jvmHeaderContent.threads",
          defaultMessage: "Threads",
          description: "Tab title"
        })}
      />
      {headerTabs}
      {/* Holding off on the configuration tab until we have something to configure */}
      {/* <TabGroup> */}
      <Tab
        href={`${basePath}/explorer`}
        icon="Explorer"
        title={intl.formatMessage({
          id: "jvmHeaderContent.explorer",
          defaultMessage: "Explorer",
          description: "Tab title"
        })}
      />
      {/* <Tab
          href={`${basePath}/configuration`}
          icon="search"
          title="Configuration"
        />
      </TabGroup> */}
    </TabNav>
  );
}

export default injectIntl(JVMHeaderContent);
