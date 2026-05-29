import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { injectIntl } from "react-intl";

import Tab from "../../components/Tab";

import JVMHeaderContent from "./scenes/JVMHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";

import { getBaseInstanceRoute, getDashboards } from "utils/selectors";
import { parseJSONString } from "utils/latestAttribute";
import { getSparkLineOfValue, getSparkLineOfNetChange } from "utils/sparklines";

import {
  routerHistoryShape,
  routerLocationShape,
  routerMatchShape
} from "components/PropTypes";

/**
 * Main area of Header containing one or more Tabs
 * @class InstanceHeaderContent
 * @extends {Component}
 */

// named export for the unconnected component {InstanceHeaderContent} for unit tests
export class InstanceHeaderContent extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    dashboards: PropTypes.object.isRequired,
    headerTabs: PropTypes.arrayOf(PropTypes.element),
    history: routerHistoryShape,
    intl: PropTypes.object.isRequired,
    location: routerLocationShape,
    match: routerMatchShape,
    metrics: PropTypes.object.isRequired,
    runtime: PropTypes.string
  };

  renderTabs(dashboards, metrics, intl) {
    const { basePath } = this.props;
    if (Object.keys(dashboards).length > 0) {
      return _.toPairs(dashboards).map(([key, value]) => {
        let chartData, lines;
        // Render lines of text if present
        if (_.has(value, "summaryCard.lines")) {
          lines = value.summaryCard.lines.map((line) => {
            return {
              name: intl.formatMessage(line.name),
              value: parseJSONString(line.value, metrics, intl.formatMessage)
            };
          });
        }
        // Render a chart if present
        if (_.has(value, "summaryCard.chart")) {
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

function mapStateToProps(state, ownProps) {
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
