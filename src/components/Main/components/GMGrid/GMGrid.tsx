// import { Actions } from "store/jumpstate";
import React, { Component } from "react";
// react-grid-layout v2 is hooks-based. The legacy WidthProvider(Responsive) HOC
// (from the "/legacy" compat entrypoint) is replaced by the native
// ResponsiveGridLayout — which now requires an explicit `width` — together with
// the useContainerWidth hook that measures the container. The flat
// isDraggable/isResizable props likewise became the dragConfig/resizeConfig
// objects. See issues #42 and #60.
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import { connect } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { injectIntl } from "utils/injectIntl";
import withRouter from "utils/withRouter";

import GMBasicMetrics from "./components/GMBasicMetrics";
import GMLineChart from "../GMLineChart";
import GMTable from "./components/GMTable";

import ErrorBoundary from "components/ErrorBoundary";
import { getDygraphOfValue, mapDygraphKeysToNetChange } from "utils/dygraphs";
import { getLatestAttribute, parseJSONString } from "utils/latestAttribute";
import { getSparkLineOfValue, getSparkLineOfNetChange } from "utils/sparklines";
import NotFoundError from "components/Main/components/NotFoundError";
import { ReactGridLayout, ReactResizable } from "./style";

import type { Dashboard, Metrics, RootState, RouterMatch } from "types";

// Inject react-grid-layout.css and react-resizable.css into the global stylesheet
const GridGlobalStyle = createGlobalStyle`
${ReactGridLayout};
${ReactResizable};
`;

// In v2, disabling drag/resize moved from the flat isDraggable/isResizable props
// to the dragConfig/resizeConfig objects. Hoisted so the objects stay stable
// across renders.
const STATIC_DRAG_CONFIG = { enabled: false };
const STATIC_RESIZE_CONFIG = { enabled: false };

interface ResponsiveReactGridLayoutProps {
  children?: React.ReactNode;
  [key: string]: any;
}

/**
 * Native-v2 replacement for the legacy `WidthProvider(Responsive)` HOC: measures
 * the container with the `useContainerWidth` hook and feeds the resulting width
 * to `ResponsiveGridLayout`, which (unlike the auto-sizing legacy HOC) requires
 * `width` as an explicit prop.
 *
 * The hook's ref is attached via `innerRef` to the grid's OWN root element (the
 * one carrying the `react-grid-layout` class), NOT to a separate wrapper. That
 * element is capped by the injected `.react-grid-layout` CSS (max-width 1300px,
 * margin auto). Measuring it — rather than an unconstrained wrapper — means the
 * width handed back to the grid honors that cap, so items lay out within and the
 * dashboard stays centered, exactly as the legacy WidthProvider did (which also
 * measured the grid element itself). Measuring a full-width wrapper instead made
 * items lay out for the whole viewport and overflow the cap (issue #60).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
function ResponsiveReactGridLayout({
  children,
  ...rest
}: ResponsiveReactGridLayoutProps) {
  const { width, containerRef } = useContainerWidth();
  return (
    <ResponsiveGridLayout
      width={width}
      innerRef={containerRef as React.Ref<HTMLDivElement>}
      {...rest}
    >
      {children}
    </ResponsiveGridLayout>
  );
}

interface GMGridProps {
  dashboard?: Dashboard;
  // Injected by the injectIntl() HOC on the connected default export and
  // consumed throughout renderChart() via intl.formatMessage().
  intl: any;
  match?: RouterMatch;
  metrics: Metrics;
  name?: string;
}

/**
 * Retrieves the dynamic JSON-based state from Redux for the dashboard matching the
 * React Router URL parameter and renders the appropriate UI components.
 */

// named export for unconnected component {GMGrid} for unit tests
// eslint-disable-next-line react/no-multi-comp -- colocated with the small ResponsiveReactGridLayout width-plumbing wrapper above
export class GMGrid extends Component<GMGridProps> {
  /**
   * Mapper function that renders dashboards based on JSON state
   *
   * @param {Object} chart
   * @param {string} chart.type - String representing the chart type (GMLineChart, GMTable, GMBasicMetrics)
   * @param {Object} chart.data
   * @param {Object[][]} chart.data.detailLines - Array of array of objects. The elements of the top level array are in the format expected by the parseJSONString utility function
   * @param {Object[]} chart.data.timeseries - Array of complex timeseries objects. Has a "type" attribute with a string signifying the type of timeseries (e.g. netChange)
   */
  renderChart(chart: any) {
    const { intl, metrics } = this.props;
    switch (chart.type) {
      case "GMLineChart":
        // Build out a metadata object keys by attribute
        const dygraphMetadata: Record<string, any> = {};
        chart.data.timeseries.forEach(
          ({
            attribute,
            label,
            precision,
            baseUnit,
            resultUnit
          }: {
            attribute: string;
            label: any;
            precision?: number;
            baseUnit?: string;
            resultUnit?: string;
          }) => {
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
            chart.data.timeseries.map((ts: any) => ts.attribute)
          ),
          chart.data.timeseries
            .filter((ts: any) => ts.type === "netChange")
            .map((ts: any) => ts.attribute)
        );
        return (
          <GMLineChart
            detailLines={
              chart.data.detailLines &&
              chart.data.detailLines.map((line: any) =>
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
            headers={chart.data.headers.map((header: any) =>
              intl.formatMessage(header)
            )}
            rows={chart.data.rows.map((row: any, outerIdx: number) => {
              return row.map((cell: any, innerIdx: number) => {
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
              ]: any[]) => {
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
  updateDashboardLayout(allLayouts: any) {
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
  renderDashboard(dashboard: any) {
    // While this parent div looks superfluous, it is needed to ensure the proper vertical heigh of the dashboard
    return (
      <ErrorBoundary>
        <GridGlobalStyle />
        <ResponsiveReactGridLayout
          breakpoints={dashboard.grid.breakpoints}
          cols={dashboard.grid.cols}
          dragConfig={STATIC_DRAG_CONFIG}
          resizeConfig={STATIC_RESIZE_CONFIG}
          layouts={dashboard.grid.layouts}
          onLayoutChange={(currentLayout: any, allLayouts: any) =>
            this.updateDashboardLayout(allLayouts)
          }
          rowHeight={dashboard.grid.rowHeight}
        >
          {dashboard.charts.map((chart: any) => (
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

function mapStateToProps(
  { dashboards, instance: { metrics } }: RootState,
  ownProps: any
) {
  return {
    metrics,
    dashboard: dashboards[ownProps.match.params.dashboardName]
  };
}
// default export for the connected component
export default withRouter(connect(mapStateToProps)(injectIntl(GMGrid)));
