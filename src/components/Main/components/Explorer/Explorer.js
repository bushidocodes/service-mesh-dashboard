import _ from "lodash";
import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import GMLineChart from "../GMLineChart";
import { getDygraphOfValue } from "utils/dygraphs";

import Inspector from "./components/Inspector";
import ViewExplorer from "./components/ViewExplorer";
import MetricsList from "./components/MetricsList";
import MetricsGraphDisplay from "./components/MetricsGraphDisplay";

import ErrorBoundary from "components/ErrorBoundary";
import { metricsShape } from "components/PropTypes";
import withUrlState from "components/withUrlState";

/**
 * General purpose component for rendering any arbitrary timeseries data stored in Redux
 * Uses Inspector to search and select keys.
 * @class Explorer
 * @extends {Component}
 */

class Explorer extends Component {
  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string), // Metrics keys
    metrics: metricsShape,
    setUrlState: PropTypes.func.isRequired,
    urlState: PropTypes.object.isRequired
  };

  componentDidMount() {
    this._checkedOnInitialLoad();
  }

  /**
   * One time purpose function for initially loading checkboxes 'checked' or nothing.
   * We may be able to get rid of document.querySelector if we restyle the 'checked' tick.
   * @class Explorer
   */
  _checkedOnInitialLoad() {
    // HTML attribute checked means: checked by default, when the page loads.
    // The DOM property checked is actually the current state of the checkbox
    // and is either true/false (exists or doesn't exist <input type=checkbox checked> or <input type=checkbox >),
    // and this will change when the checkbox is clicked, but isn't visible when you inspect the HTML.
    // This can be confusing because setting visible 'checked' attribute
    // on checkbox input fields does not set the actual html checked attribute,
    // but it refers to javascript checked property on the element.
    const { hideZeroMetric, hideStaticMetric } = this.props.urlState;
    // display initial checkbox tick after page loads
    if (hideZeroMetric === "true") {
      const hideZeroInput = document.querySelector(
        'input[name="hideZeroMetric"]'
      );
      hideZeroInput.setAttribute("checked", hideZeroInput.checked);
    }

    if (hideStaticMetric === "true") {
      const hideStaticInput = document.querySelector(
        'input[name="hideStaticMetric"]'
      );
      hideStaticInput.setAttribute("checked", hideStaticInput.checked);
    }
  }
  /**
   * Takes key object and metrics object and filter them on hide features
   * @param {Object}
   * @memberof Explorer
   */
  hideKeys = (rawKeys, metrics) => {
    let { hideZeroMetric = "false", hideStaticMetric = "false" } =
      this.props.urlState;
    // the following booleans are passed down from urlState as strings, so we need to parse them
    hideZeroMetric = JSON.parse(hideZeroMetric);
    hideStaticMetric = JSON.parse(hideStaticMetric);

    // Filter out the timestamps key, which does not point to valid timeseries
    // data but instead provides information about the range of time expressed
    const keys = rawKeys.filter((key) => key !== "timestamps");

    // return original keys if hide features are turned off
    if (!hideZeroMetric && !hideStaticMetric) {
      return keys;
    } else if (hideStaticMetric) {
      // static filter is more inclusive than zero filter
      return keys.filter((key) => {
        // Get the values associated with a key and only return if
        // there is more than one unique value
        const valuesOfKey = _.values(metrics[key]);
        return _.uniq(valuesOfKey).length > 1;
      });
    } else if (hideZeroMetric) {
      return keys.filter((key) => {
        return !_.values(metrics[key]).every((val) => val === 0);
      });
    } else return null;
  };

  render() {
    const {
      metrics,
      keys,
      setUrlState,
      urlState: {
        selectedMetric,
        hideZeroMetric = "false",
        hideStaticMetric = "false",
        filterString = ""
      }
    } = this.props;

    // filter keys if hide filter is on
    const filteredKeys = this.hideKeys(keys, metrics);

    return (
      <ErrorBoundary>
        <ViewExplorer>
          <MetricsList>
            <Inspector
              data={filteredKeys}
              hideZeroMetric={JSON.parse(hideZeroMetric)}
              hideStaticMetric={JSON.parse(hideStaticMetric)}
              onClick={(selectedMetric) => setUrlState({ selectedMetric })}
              onChange={(checked, name) =>
                setUrlState({
                  [name]: checked
                })
              }
              onSearch={(filterString) => setUrlState({ filterString })}
              searchQuery={filterString}
              selectedMetric={selectedMetric}
              tabIndex={0}
            />
          </MetricsList>
          <MetricsGraphDisplay>
            {selectedMetric && this.props.keys.includes(selectedMetric) ? (
              <GMLineChart
                height={"normal"}
                dygraph={getDygraphOfValue(metrics, [selectedMetric])}
                title={selectedMetric}
              />
            ) : (
              <FormattedMessage
                id="explorer.selectMetric"
                defaultMessage="Select a metric to display"
                description="Placeholder for GMLineChart"
              />
            )}
          </MetricsGraphDisplay>
        </ViewExplorer>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps({ instance: { metrics } }) {
  return {
    metrics,
    keys: Object.keys(metrics).sort()
  };
}

export default connect(mapStateToProps)(withUrlState()(Explorer));
