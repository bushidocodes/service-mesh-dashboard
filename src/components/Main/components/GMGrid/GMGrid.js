// import { Actions } from "jumpstate";
import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { connect } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { injectIntl } from "react-intl";
import withRouter from "utils/withRouter";

import GMBasicMetrics from "./components/GMBasicMetrics";
import GMLineChart from "../GMLineChart";
import GMTable from "./components/GMTable";

import ErrorBoundary from "components/ErrorBoundary";
import {
  dashboardShape,
  routerMatchShape,
  metricsShape
} from "components/PropTypes";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "utils/dygraphs";
import { getLatestAttribute, parseJSONString } from "utils/latestAttribute";
import { getSparkLineOfValue, getSparkLineOfNetChange } from "utils/sparklines";
import NotFoundError from "components/Main/components/NotFoundError";
import { ReactGridLayout, ReactResizable } from "./style";

// Inject react-grid-layout.css and react-resizable.css into the global stylesheet
const GridGlobalStyle = createGlobalStyle`
${ReactGridLayout};
${ReactResizable};
`;

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * Retrieves the dynamic JSON-based state from Redux for the dashboard matching the
 * React Router URL parameter and renders the appropriate UI components.
 */

// named export for unconnected component {GMGrid} for unit tests
export class GMGrid extends Component {
  static propTypes = {
    dashboard: dashboardShape,
    match: routerMatchShape,
    metrics: metricsShape.isRequired,
    name: PropTypes.string
  };

  /**
   * Mapper function that renders dashboards based on JSON state
   *
   * @param {Object} chart
   * @param {string} chart.type - String representing the chart type (GMLineChart, GMTable, GMBasicMetrics)
   * @param {Object} chart.data
   * @param {Object[][]} chart.data.detailLines - Array of array of objects. The elements of the top level array are in the format expected by the parseJSONString utility function
   * @param {Object[]} chart.data.timeseries - Array of complex timeseries objects. Has a "type" attribute with a string signifying the type of timeseries (e.g. netChange)
   */
  renderChart(chart) {
    const { intl, metrics } = this.props;
    switch (chart.type) {
      case "GMLineChart":
        // Build out a metadata object keys by attribute
        const dygraphMetadata = {};
        chart.data.timeseries.forEach(
          ({ attribute, label, precision, baseUnit, resultUnit }) => {
            dygraphMetadata[attribute] = {
              label: intl.formatMessage(label),
              precision,
              baseUnit,
              resultUnit
            };
          }
        );
        const dygraph = mapDygraphKeysToNetChange(
          getDygraphOfValue(
            metrics,
            chart.data.timeseries.map((ts) => ts.attribute)
          ),
          chart.data.timeseries
            .filter((ts) => ts.type === "netChange")
            .map((ts) => ts.attribute)
        );
        return (
          <GMLineChart
            detailLines={
              chart.data.detailLines &&
              chart.data.detailLines.map((line) =>
                parseJSONString(line, metrics, intl.formatMessage)
              )
            }
            height="max"
            dygraph={dygraph}
            title={intl.formatMessage(chart.title)}
            dygraphMetadata={dygraphMetadata}
          />
        );
      case "GMTable":
        return (
          <GMTable
            headers={chart.data.headers.map((header) =>
              intl.formatMessage(header)
            )}
            rows={chart.data.rows.map((row, outerIdx) => {
              return row.map((cell, innerIdx) => {
                // The first item in a row is a i18n label of what's in the label
                return innerIdx > 0
                  ? getLatestAttribute(metrics, cell)
                  : intl.formatMessage(cell);
              });
            })}
            title={intl.formatMessage(chart.title)}
          />
        );
      case "GMBasicMetrics":
        return (
          <GMBasicMetrics
            detailLines={chart.data.detailLines.map(
              ([
                heading,
                key,
                priority,
                sparklineKey = null,
                sparklineType = null
              ]) => {
                const results = [
                  intl.formatMessage(heading),
                  getLatestAttribute(metrics, key),
                  priority
                ];
                if (sparklineKey && sparklineType) {
                  if (sparklineType === "value") {
                    results.push(getSparkLineOfValue(metrics, sparklineKey));
                  } else if (sparklineType === "netChange") {
                    results.push(
                      getSparkLineOfNetChange(metrics, sparklineKey)
                    );
                  }
                }
                return results;
              }
            )}
            title={intl.formatMessage(chart.title)}
          />
        );
      default:
        return "";
    }
  }

  /**
   * Event handler for updating the layout of charts on the GMGrid. It is triggered by drag-and-drop actions on the charts
   * Note that this also seems to always be called on inital render
   * @param {Object} allLayouts
   */
  updateDashboardLayout(allLayouts) {
    return;
    // Disabled for initial release
    // const updatedDashboard = Object.assign({}, this.props.dashboard, {
    //   grid: {
    //     layouts: allLayouts
    //   }
    // });
    // Namespace the dashboard properly and dispatch Jumpstate Effect to update Redux
    // We need to cast to lowercase to avoid duplicate entries
    // Actions.setDashboard({
    //   [this.props.dashboard.name.toLowerCase()]: updatedDashboard
    // });
  }

  /**
   * Renders a dashboard as a responsive grid
   * @param {Object} dashboard
   */
  renderDashboard(dashboard) {
    // While this parent div looks superfluous, it is needed to ensure the proper vertical heigh of the dashboard
    return (
      <ErrorBoundary>
        <GridGlobalStyle />
        <ResponsiveReactGridLayout
          breakpoints={dashboard.grid.breakpoints}
          cols={dashboard.grid.cols}
          isDraggable={false}
          isResizable={false}
          layouts={dashboard.grid.layouts}
          onLayoutChange={(currentLayout, allLayouts) =>
            this.updateDashboardLayout(allLayouts)
          }
          rowHeight={dashboard.grid.rowHeight}
        >
          {dashboard.charts.map((chart) => (
            <div
              data-grid={chart.position}
              key={chart.key}
              style={{
                overflow: "hidden"
              }}
            >
              {this.renderChart(chart)}
            </div>
          ))}
        </ResponsiveReactGridLayout>
      </ErrorBoundary>
    );
  }

  render() {
    const { dashboard } = this.props;
    if (!dashboard) {
      return <NotFoundError errorMsg={`Dashboard does not exist`} />;
    } else {
      return this.renderDashboard(dashboard);
    }
  }
}

function mapStateToProps({ dashboards, instance: { metrics } }, ownProps) {
  return {
    metrics,
    dashboard: dashboards[ownProps.match.params.dashboardName]
  };
}
// default export for the connected component
export default withRouter(connect(mapStateToProps)(injectIntl(GMGrid)));
