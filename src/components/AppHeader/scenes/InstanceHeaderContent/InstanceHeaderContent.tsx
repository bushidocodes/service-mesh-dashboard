import { useIntl } from "react-intl";
import { useAppSelector } from "store/hooks";
import type { Dashboard, Metrics } from "types";
import { has } from "utils/collections";
import { parseJSONString } from "utils/latestAttribute";
import { getBaseInstanceRoute, getDashboards } from "utils/selectors";
import { getSparkLineOfNetChange, getSparkLineOfValue } from "utils/sparklines";
import Tab from "../../components/Tab";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import JVMHeaderContent from "./scenes/JVMHeaderContent";

/**
 * Build dynamic dashboard summary tabs from dashboard JSON config.
 */
function renderTabs(
  dashboards: Record<string, Dashboard>,
  metrics: Metrics,
  intl: ReturnType<typeof useIntl>,
  basePath?: string
) {
  if (Object.keys(dashboards).length > 0) {
    return Object.entries(dashboards).map(([key, value]: [string, any]) => {
      let chartData, lines;
      // Render lines of text if present
      if (has(value, "summaryCard.lines")) {
        lines = value.summaryCard.lines.map((line: any) => {
          return {
            name: intl.formatMessage(line.name),
            value: parseJSONString(line.value, metrics, intl.formatMessage)
          };
        });
      }
      // Render a chart if present
      if (has(value, "summaryCard.chart")) {
        if (value.summaryCard.chart.type === "value") {
          chartData = getSparkLineOfValue(
            metrics,
            value.summaryCard.chart.dataAttribute
          );
        } else if (value.summaryCard.chart.type === "netChange") {
          chartData = getSparkLineOfNetChange(
            metrics,
            value.summaryCard.chart.dataAttribute
          );
        }
      }
      return (
        <Tab
          chartData={chartData}
          href={`${basePath}/${key}`}
          icon={value.summaryCard.icon}
          key={`/${key}`}
          lines={lines}
          title={intl.formatMessage(value.summaryCard.name)}
        />
      );
    });
  }
}

/**
 * Main area of Header containing one or more Tabs, switching on service runtime.
 */
function InstanceHeaderContent() {
  const intl = useIntl();
  const metrics = useAppSelector((state) => state.instance.metrics);
  const services = useAppSelector((state) => state.fabric.services);
  const selectedServiceSlug = useAppSelector(
    (state) => state.fabric.selectedServiceSlug
  );
  const basePath = useAppSelector(getBaseInstanceRoute);
  const dashboards = useAppSelector(getDashboards);
  const runtime =
    services && selectedServiceSlug && services[selectedServiceSlug]
      ? services[selectedServiceSlug].runtime
      : "";

  const headerTabs = renderTabs(dashboards, metrics, intl, basePath);

  switch (runtime) {
    case "JVM":
      return (
        <JVMHeaderContent
          basePath={basePath}
          metrics={metrics}
          headerTabs={headerTabs}
        />
      );
    case "GO":
      return (
        <GoHeaderContent
          basePath={basePath}
          metrics={metrics}
          headerTabs={headerTabs}
        />
      );
    default:
      return (
        <DefaultHeaderContent
          basePath={basePath}
          metrics={metrics}
          headerTabs={headerTabs}
        />
      );
  }
}

export default InstanceHeaderContent;
