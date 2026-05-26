import Dygraph from "dygraphs";
import { isEqual } from "lodash";
import { PropTypes } from "prop-types";
import React from "react";
import _ from "lodash";
import { formatMetricString } from "utils";

import DygraphContainer from "./components/DygraphContainer";

/**
 * Reuseable Dygraph-based Line Chart component for rendering time series data
 *
 * Required Props include title (the string to show at that top of the card) and time series (the data to render).
 *
 * Optional props include detailLines, an array of strings listed below the line chart.
 *
 * @export
 * @class DygraphWrapper
 * @extends {React.Component}
 */
export default class DygraphWrapper extends React.Component {
  static propTypes = {
    dygraph: PropTypes.object.isRequired,
    dygraphMetadata: PropTypes.object,
    dygraphOptions: PropTypes.object
  };

  state = {
    options: {}
  };

  componentDidMount() {
    const {
      dygraph: { data, attributes },
      dygraphOptions,
      dygraphMetadata
    } = this.props;
    // Build the Dygraph options object including labels
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        options: generateOptions({
          baseOptions: dygraphOptions,
          attributes,
          dygraphMetadata
        })
      },
      () => {
        this.drawChart(this.div, data, this.state.options);
      }
    );
  }

  /**
   * Instruct the existing Dygraph to update when new data is passed in as props or when labels change
   * All other changes in the options object are ignored
   * Also, resize the dygraph every time the component receives props
   * @param {Object} nextProps
   * @memberof DygraphWrapper
   */
  componentWillReceiveProps(nextProps) {
    const {
      dygraph: { data, attributes },
      dygraphOptions,
      dygraphMetadata
    } = this.props;

    const newOptions = generateOptions({
      baseOptions: dygraphOptions,
      attributes,
      dygraphMetadata
    });

    if (!isEqual(this.state.options, newOptions)) {
      this.setState({ options: newOptions }, () => {
        if (this.graph) {
          this.graph.updateOptions(this.state.options);
        } else {
          this.drawChart(this.div, data, this.state.options);
        }
      });
    }
    // Race conditions on some of the larger components like Explorer mean that
    // we can render the wrapper multiple times before the actual Dygraph is
    // rendered, causing this.graph to be undefined
    if (this.graph) {
      // Just pass the data each time because most renders are due to polling
      this.graph.updateOptions({ file: data });
      // This is getting called when not needed. Need to determine if Dygraph
      // handles this sufficiently or if we need to call this selectively
      this.graph.resize();
    }
  }

  /** Block React from ever updating and use Dygraph methods to update the physical DOM */
  shouldComponentUpdate() {
    return false;
  }

  /** Clean up when the component unmounts */
  componentWillUnmount() {
    this.graph.destroy();
    delete this.graph;
  }

  /**
   * Renders a dygraph to a physical DOM node
   *
   * @param {any} elem - Physical DOM node where the Dygraph should render
   * @param {any} data - 2D array of timeseries data powering the Dygraph
   * @param {any} options - Various options for how a Dygraph should look at feel.
   * @memberof DygraphWrapper
   */
  drawChart = (elem, data, options) => {
    this.graph = new Dygraph(elem, data, options);
    if (!this.graph) {
      console.log("error rendering Dygraph");
    }
  };

  render() {
    return (
      <DygraphContainer
        innerRef={(elem) => {
          this.div = elem;
        }}
      />
    );
  }
}

/**
 * Generates a valid Dygraph options object
 *
 * @param {any} { baseOptions = {}, attributes, dygraphMetadata }
 * @returns
 */
function generateOptions({ baseOptions = {}, attributes, dygraphMetadata }) {
  let options = { ...DEFAULT_DYGRAPH_OPTIONS, ...baseOptions };
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
    .map((elem) => elem.resultUnit)
    .filter((elem) => elem);
  const baseUnits = _.values(dygraphMetadata)
    .map((elem) => elem.baseUnit)
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
 *
 * @param {any} rawAttributes
 * @param {any} dygraphMetadata
 * @returns
 */
function generateLabels(rawAttributes, dygraphMetadata) {
  if (!rawAttributes || rawAttributes.length === 0) return {};
  const attributes = [...rawAttributes];
  if (attributes[0] !== "Time") {
    attributes.unshift("Time");
  }
  const results = attributes.map((attr, idx, arr) => {
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
 *
 * @param {any} [dygraphMetadata={}]
 * @param {any} labels
 * @returns
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
    var html = `${xAxisLabel}: ${xAxisValue}<br>`;
    html += data.series
      .map((ts, idx) => {
        const match =
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
