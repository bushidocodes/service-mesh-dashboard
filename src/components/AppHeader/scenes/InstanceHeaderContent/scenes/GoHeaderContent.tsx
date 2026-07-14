import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import ArrayValue from "components/ArrayValue";
import UpTime from "components/UpTime";
import React from "react";
import type { Metrics } from "types";
import { injectIntl } from "utils/injectIntl";
import { getLatestAttribute } from "utils/latestAttribute";

interface GoHeaderContentProps {
  basePath?: string;
  headerTabs?: React.ReactElement[];
  intl: any;
  metrics: Metrics;
}

/**
 * Go Header Content
 * @export
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
function GoHeaderContent({
  basePath,
  metrics,
  headerTabs,
  intl
}: GoHeaderContentProps) {
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
