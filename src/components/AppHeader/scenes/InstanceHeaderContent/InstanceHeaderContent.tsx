import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "utils/injectIntl";
import { has } from "utils/collections";

import Tab from "../../components/Tab";

import JVMHeaderContent from "./scenes/JVMHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";

import { getBaseInstanceRoute, getDashboards } from "utils/selectors";
import { parseJSONString } from "utils/latestAttribute";
import { getSparkLineOfValue, getSparkLineOfNetChange } from "utils/sparklines";

import type {
  RootState,
  RouterHistory,
  RouterLocation,
  RouterMatch
} from "types";

interface InstanceHeaderContentProps {
  basePath?: string;
  dashboards: Record<string, any>;
  headerTabs?: React.ReactElement[];
  history?: RouterHistory;
  intl: any;
  location?: RouterLocation;
  match?: RouterMatch;
  metrics: Record<string, unknown>;
  runtime?: string;
}

/**
 * Main area of Header containing one or more Tabs
 * @class InstanceHeaderContent
 * @extends {Component}
 */

// named export for the unconnected component {InstanceHeaderContent} for unit tests
export class InstanceHeaderContent extends Component<InstanceHeaderContentProps> {
  renderTabs(
    dashboards: Record<string, any>,
    metrics: Record<string, unknown>,
    intl: any
  ) {
    const { basePath } = this.props;
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

  render() {
    const { basePath, metrics, runtime, dashboards, intl } = this.props;
    const headerTabs = this.renderTabs(dashboards, metrics, intl);
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
}

function mapStateToProps(state: RootState, ownProps: any) {
  const {
    instance: { metrics },
    fabric: { services, selectedServiceSlug }
  } = state;

  return {
    metrics,
    runtime:
      services && selectedServiceSlug && services[selectedServiceSlug]
        ? state.fabric.services[selectedServiceSlug].runtime
        : "",
    basePath: getBaseInstanceRoute(state),
    dashboards: getDashboards(state)
  };
}

export default connect(mapStateToProps)(injectIntl(InstanceHeaderContent));
