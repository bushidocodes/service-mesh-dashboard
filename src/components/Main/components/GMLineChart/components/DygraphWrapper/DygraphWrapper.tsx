import Dygraph from "dygraphs";
import { isEqual } from "lodash";
import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { formatMetricString } from "utils";

import DygraphContainer from "./components/DygraphContainer";

interface DygraphWrapperProps {
  dygraph: Record<string, unknown>;
  dygraphMetadata?: Record<string, unknown>;
  dygraphOptions?: Record<string, unknown>;
}

/**
 * Reuseable Dygraph-based Line Chart component for rendering time series data
 *
 * Required Props include title (the string to show at that top of the card) and time series (the data to render).
 *
 * Optional props include detailLines, an array of strings listed below the line chart.
 */
function DygraphWrapper({
  dygraph,
  dygraphOptions,
  dygraphMetadata
}: DygraphWrapperProps) {
  const graphRef = useRef<any>(null);
  const divRef = useRef<any>(null);
  const prevOptionsRef = useRef<any>({});

  // Sync Dygraph options and data on prop changes. Declared before the mount
  // effect so it runs first on the initial render — when graphRef is still
  // null the early return prevents any update, deferring all work to the
  // mount effect below.
  useEffect(() => {
    if (!graphRef.current) return;

    const { data, attributes } = dygraph;
    const newOptions = generateOptions({
      baseOptions: dygraphOptions,
      attributes,
      dygraphMetadata
    });

    if (!isEqual(prevOptionsRef.current, newOptions)) {
      prevOptionsRef.current = newOptions;
      graphRef.current.updateOptions(newOptions);
    }

    // Always push fresh data and resize; most renders come from polling
    graphRef.current.updateOptions({ file: data });
    graphRef.current.resize();
  });

  // Initialize Dygraph on mount and destroy on unmount
  useEffect(() => {
    const { data, attributes } = dygraph;
    const options = generateOptions({
      baseOptions: dygraphOptions,
      attributes,
      dygraphMetadata
    });
    prevOptionsRef.current = options;
    graphRef.current = new Dygraph(divRef.current, data, options);

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DygraphContainer
      ref={(elem) => {
        divRef.current = elem;
      }}
    />
  );
}

export default DygraphWrapper;

/**
 * Generates a valid Dygraph options object
 */
function generateOptions({ baseOptions = {}, attributes, dygraphMetadata }) {
  let options: any = { ...DEFAULT_DYGRAPH_OPTIONS, ...baseOptions };
  if (!_.has(baseOptions, "labels")) {
    options = {
      ...options,
      ...generateLabels(attributes, dygraphMetadata)
    };
  }
  options.legendFormatter = generatelegendFormatter(
    dygraphMetadata,
    options.labels,
    options.colors
  );
  // If a chart all uses the same units, label the Y axis with the
  // appropriate labels
  const resultUnits = _.values(dygraphMetadata)
    .map((elem: any) => elem.resultUnit)
    .filter((elem) => elem);
  const baseUnits = _.values(dygraphMetadata)
    .map((elem: any) => elem.baseUnit)
    .filter((elem) => elem);
  const universalUnit =
    _.uniq(resultUnits).length === 1 && _.uniq(baseUnits).length === 1;
  if (universalUnit) {
    // This width is an algorithmic swag. I assume 10 pixel width per
    // character to support three digits plus a label
    const width = 40 + resultUnits[0].length * 10;
    options.axes = {
      y: {
        axisLabelWidth: width,
        axisLabelFormatter: (y) =>
          formatMetricString(y, baseUnits[0], resultUnits[0], 0)
      }
    };
  }
  return options;
}

/**
 * Generates an array of labels for use in a Dygraph options object
 */
function generateLabels(rawAttributes, dygraphMetadata) {
  if (!rawAttributes || rawAttributes.length === 0) return {};
  const attributes = [...rawAttributes];
  if (attributes[0] !== "Time") {
    attributes.unshift("Time");
  }
  const results = attributes.map((attr) => {
    if (
      dygraphMetadata &&
      dygraphMetadata[attr] &&
      dygraphMetadata[attr].label
    ) {
      return dygraphMetadata[attr].label;
    } else {
      return attr;
    }
  });
  return { labels: results };
}

/**
 * Function factory for a dygraph legend formatter, which is used to customize
 * the text rendered in the pop over that appears when a user hovers over the graph
 */
function generatelegendFormatter(dygraphMetadata = {}, labels, colors) {
  return function legendFormatter(data) {
    if (data.x == null) {
      // This happens when there's no selection and {legend: 'always'} is set.
      // We set to an empty string to override the default behavior
      return ``;
    }
    const xAxisLabel = labels[0];
    const xAxisValue = data.xHTML;
    let html = `${xAxisLabel}: ${xAxisValue}<br>`;
    html += data.series
      .map((ts, idx) => {
        const match: any =
          _.find(_.values(dygraphMetadata), ["label", ts.label]) ||
          DEFAULT_LEGEND_FORMATTING;
        const baseUnit = match.baseUnit;
        const resultUnit = match.resultUnit;
        const precision = match.precision;
        return `<span style="color:${colors[idx]}">${
          ts.label
        }: ${formatMetricString(ts.y, baseUnit, resultUnit, precision)}</span>`;
      })
      .join("<br>");
    return html;
  };
}

const DEFAULT_DYGRAPH_OPTIONS = {
  colors: ["#3cb44b", "#e6194b", "#ffe119", "#0082c8", "#f58231", "#911eb4"],
  labelsKMB: true,
  strokeWidth: 2.0,
  legend: "always",
  fillGraph: true,
  axisLineColor: "rgb(200, 200, 200)",
  gridLineColor: "rgb(200, 200, 200)",
  animatedZooms: true,
  drawAxesAtZero: true,
  labelsSeparateLines: true,
  includeZero: true
};

const DEFAULT_LEGEND_FORMATTING = { precision: 3 };
