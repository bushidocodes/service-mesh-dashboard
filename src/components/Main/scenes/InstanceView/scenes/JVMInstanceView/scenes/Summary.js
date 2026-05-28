import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { injectIntl } from "react-intl";

import LayoutSection from "components/LayoutSection";
import GMLineChart from "components/Main/components/GMLineChart";
import Readout from "components/Main/components/Readout";
import ReadoutGroup from "components/Main/components/ReadoutGroup";
import ErrorBoundary from "components/ErrorBoundary";
import UpTime from "components/UpTime";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "utils/dygraphs";
import { getLatestAttribute } from "utils/latestAttribute";
import { getErrorPercent } from "utils/jvm/selectors";

import ArrayValue from "components/ArrayValue";
import { metricsShape } from "components/PropTypes";

/**
 * Static Summary page for JVM runtime
 * @function SummaryGrid
 */
function SummaryGrid({
  errorPercent,
  metrics,
  selectedInstanceID,
  selectedServiceSlug,
  intl
}) {
  return (
    <ErrorBoundary>
      <LayoutSection
        title={intl.formatMessage({
          id: "summary.vitals",
          defaultMessage: "Vitals",
          description: "Vitals header text"
        })}
        icon={"EKG"}
      >
        <ReadoutGroup>
          <Readout
            readoutItems={[
              {
                detail: intl.formatTime(
                  getLatestAttribute(metrics, "jvm/start_time"),
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                  }
                ),
                icon: "Summary",
                title: intl.formatMessage({
                  id: "summary.uptime",
                  defaultMessage: "Uptime",
                  description: "Uptime detail text"
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
          />

          <Readout
            primary={true}
            readoutItems={[
              {
                icon: "Timer",
                title: intl.formatMessage({
                  id: "summary.responseTime",
                  defaultMessage: "Avg. Response Time",
                  description: "Response time title text"
                }),
                value: getLatestAttribute(
                  metrics,
                  "time/2XX.avg",
                  3,
                  "ms",
                  "ms"
                )
              },
              {
                icon: "Exclamation",
                iconBorderStyle: "BorderTriangleSmall",
                iconBorderWidth: 2,
                title: intl.formatMessage({
                  id: "summary.errorRate",
                  defaultMessage: "Error Rate",
                  description: "Error rate title text"
                }),
                value: `${errorPercent}%`
              }
            ]}
          />

          <Readout
            readoutItems={[
              {
                icon: "CPU",
                title: intl.formatMessage({
                  id: "summary.hostCPUCores",
                  defaultMessage: "Host CPU Cores",
                  description: "Host CPU Cores title text"
                }),
                value: `${getLatestAttribute(metrics, "jvm/num_cpus")}`
              }
            ]}
          />
        </ReadoutGroup>
      </LayoutSection>

      <LayoutSection
        title={intl.formatMessage({
          id: "summary.statistics",
          defaultMessage: "Statistics",
          description: "Statistics header text"
        })}
        icon="Scatterplot"
      >
        <div style={{ height: "250px" }}>
          <GMLineChart
            dygraph={mapDygraphKeysToNetChange(
              getDygraphOfValue(metrics, ["https/requests", "http/requests"])
            )}
            dygraphMetadata={{
              "https/requests": {
                label: "HTTPS"
              },
              "http/requests": {
                label: "HTTP"
              }
            }}
            title={intl.formatMessage({
              id: "summary.requestsPerSecond",
              defaultMessage: "Requests Per Second",
              description: "Requests Per Second title text"
            })}
          />
        </div>
      </LayoutSection>
    </ErrorBoundary>
  );
}

SummaryGrid.propTypes = {
  errorPercent: PropTypes.string,
  metrics: metricsShape,
  selectedInstanceID: PropTypes.string,
  selectedServiceSlug: PropTypes.string
};

function mapStateToProps(state) {
  return {
    metrics: state.instance.metrics,
    selectedServiceSlug: state.fabric.selectedServiceSlug,
    selectedInstanceID: state.fabric.selectedInstanceID,
    errorPercent: getErrorPercent(state)
  };
}

export default connect(mapStateToProps)(injectIntl(SummaryGrid));
