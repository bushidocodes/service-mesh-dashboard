import React from "react";
import { injectIntl } from "utils/injectIntl";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import ArrayValue from "components/ArrayValue";
import ThreadCounts from "components/ThreadCounts";
import UpTime from "components/UpTime";
import { getLatestAttribute } from "utils/latestAttribute";
import { getSparkLineOfValue } from "utils/sparklines";

import type { Metrics } from "types";

interface JVMHeaderContentProps {
  basePath?: string;
  headerTabs?: React.ReactElement[];
  intl: any;
  metrics: Metrics;
}

/**
 * JVM Header Content
 * @export
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
function JVMHeaderContent({
  basePath,
  metrics,
  headerTabs,
  intl
}: JVMHeaderContentProps) {
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
                    {uptime.map((el: string) => (
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
