import ArrayValue from "components/ArrayValue";
import ErrorBoundary from "components/ErrorBoundary";
import LayoutSection from "components/LayoutSection";
import GMLineChart from "components/Main/components/GMLineChart";
import Readout from "components/Main/components/Readout";
import ReadoutGroup from "components/Main/components/ReadoutGroup";
import UpTime from "components/UpTime";
import { connect } from "react-redux";
import type { Metrics, RootState } from "types";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "utils/dygraphs";
import { injectIntl } from "utils/injectIntl";
import { getErrorPercent } from "utils/jvm/selectors";
import { getLatestAttribute } from "utils/latestAttribute";

interface SummaryGridProps {
  errorPercent?: string;
  intl: any;
  metrics?: Metrics;
  // string | null mirrors the fabric store slice (selected* default to null).
  selectedInstanceID?: string | null;
  selectedServiceSlug?: string | null;
}

/**
 * Static Summary page for JVM runtime
 * @function SummaryGrid
 */
function SummaryGrid({
  errorPercent,
  metrics,
  selectedInstanceID: _selectedInstanceID,
  selectedServiceSlug: _selectedServiceSlug,
  intl
}: SummaryGridProps) {
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
                        {uptime.map((el: string) => (
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

function mapStateToProps(state: RootState) {
  return {
    metrics: state.instance.metrics,
    selectedServiceSlug: state.fabric.selectedServiceSlug,
    selectedInstanceID: state.fabric.selectedInstanceID,
    errorPercent: getErrorPercent(state)
  };
}

export default connect(mapStateToProps)(injectIntl(SummaryGrid));
