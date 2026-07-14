import Glyph from "components/Glyphs/index";
import Icon from "components/Icon";
import Span from "components/Main/components/Span";
import React, { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { injectIntl } from "utils/injectIntl";
import DygraphWrapper from "./components/DygraphWrapper";
import LineChartContent from "./components/LineChartContent";
import LineChartDetails from "./components/LineChartDetails";
import LineChartDisplay from "./components/LineChartDisplay";
import LineChartEmpty from "./components/LineChartEmpty";
import LineChartTitle from "./components/LineChartTitle";
import LineDetail from "./components/LineDetail";
import { screenReaderGraphDescription } from "./utils";

interface GMLineChartProps {
  detailLines?: any[];
  dygraph: Record<string, any>;
  dygraphMetadata?: Record<string, unknown>;
  dygraphOptions?: Record<string, unknown>;
  expectedAttributes?: unknown[];
  height?: "xs" | "sm" | "normal" | "lg" | "xl" | "max";
  intl: any;
  timeSeries?: unknown[];
  title: string;
}

/**
 * Reuseable Dygraph-based Line Chart component for rendering a time series
 *
 * Required Props include title (the string to show at that top of the card) and time series (the data to render).
 * Optional props include any number of detailLines, an array of strings listed below the line chart.
 */

/**
 * Title, Dygraph-based chart, and optional lines of text
 * Validates timeseries data and displays error messages if a chart cannot be displayed.
 * @param {Object} props
 */
function GMLineChart({
  detailLines = [],
  dygraph,
  dygraph: { data, attributes },
  dygraphMetadata,
  dygraphOptions,
  height = "normal",
  intl,
  title
}: GMLineChartProps) {
  const expectedAttributes = dygraphMetadata
    ? Object.keys(dygraphMetadata)
    : [];
  return (
    <LineChartDisplay
      height={height}
      role="presentation"
      data-testid="line-chart"
      aria-label={
        data
          ? screenReaderGraphDescription(data, title, intl)
          : intl.formatMessage(
              {
                id: "GMLineChart.noChartableData",
                defaultMessage: "No Chartable Data",
                description: "Screen reader description for GMLineChart"
              },
              { title }
            )
      }
    >
      {title && <LineChartTitle aria-hidden={true}>{title}</LineChartTitle>}
      <LineChartContent aria-hidden={true}>
        {attributes.length === 0 ? (
          <LineChartEmpty>
            <h1>
              <Span>
                <Icon borderStyle="BorderTriangleSmall">
                  <Glyph name={"Exclamation"} />
                </Icon>
              </Span>
              <FormattedMessage
                id="GMLineChart.noChartableData"
                defaultMessage="No chartable data"
                description="Empty line chart message"
              />
            </h1>
            {expectedAttributes && expectedAttributes.length > 0 && (
              <Fragment>
                <FormattedMessage
                  id="GMLineChart.noMetricsFound"
                  defaultMessage="Could not find the following metrics:"
                  description="Empty line chart message"
                />
                <ul>
                  {expectedAttributes.map((attribute) => (
                    <li key={attribute}>{attribute}</li>
                  ))}
                </ul>
              </Fragment>
            )}
          </LineChartEmpty>
        ) : (
          <DygraphWrapper
            dygraph={dygraph}
            dygraphOptions={dygraphOptions}
            dygraphMetadata={dygraphMetadata}
          />
        )}
      </LineChartContent>
      <LineChartDetails>
        {detailLines &&
          detailLines.map((element) => (
            <LineDetail key={element}>{element}</LineDetail>
          ))}
      </LineChartDetails>
    </LineChartDisplay>
  );
}

export default injectIntl(GMLineChart);
