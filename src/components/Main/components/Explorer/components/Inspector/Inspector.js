import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";

import InspectorWrap from "./components/InspectorWrap";
import InspectorToolbar from "./components/InspectorToolbar";
import InspectorData from "./components/InspectorData";
import InspectorItem from "./components/InspectorItem";
import InspectorSearch from "./components/InspectorSearch";
import InspectorHideZero from "./components/InspectorHideZero";
import InspectorHideStatic from "./components/InspectorHideStatic";

/** Filterable list of selectable string */
class Inspector extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    hideStaticMetric: PropTypes.bool,
    hideZeroMetric: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
    searchQuery: PropTypes.string,
    selectedMetric: PropTypes.string
  };

  render() {
    const {
      data,
      onClick,
      onSearch,
      onChange,
      searchQuery,
      selectedMetric,
      intl
    } = this.props;
    let { hideZeroMetric, hideStaticMetric } = this.props;
    // Filter out keys that don't match the searchQuery
    const filteredData = searchQuery
      ? data.filter(
          (i) => i.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
        )
      : data;

    // ticking checkbox to hide all static metrics automatically
    // ticks and disables the other checkbox that hides zero metrics
    // (all static metrics includes zero metrics)
    if (hideStaticMetric) hideZeroMetric = hideStaticMetric;
    return (
      <InspectorWrap>
        <InspectorToolbar>
          <InspectorSearch
            onChange={(evt) => onSearch(evt.target.value)}
            placeholder={intl.formatMessage({
              id: "inspector.searchPlaceholder",
              defaultMessage: "Search",
              description: "Search placeholder"
            })}
            aria-label={intl.formatMessage({
              id: "inspector.searchAriaLabel",
              defaultMessage: "Search All Metrics",
              description: "Aria label for search input"
            })}
            type="search"
            value={searchQuery}
          />
          <label>
            <InspectorHideZero
              onChange={(evt) => onChange(evt.target.checked, evt.target.name)}
              checked={hideZeroMetric}
              disabled={hideStaticMetric}
            />
            <FormattedMessage
              id="inspector.hideZeroMetric"
              defaultMessage="Hide all metrics with only zero values"
              description="Label for checkbox"
            />
          </label>
          <label>
            <InspectorHideStatic
              onChange={(evt) => onChange(evt.target.checked, evt.target.name)}
              checked={hideStaticMetric}
            />
            <FormattedMessage
              id="inspector.hideStaticMetric"
              defaultMessage="Hide all static metrics"
              description="Label for checkbox"
            />
          </label>
        </InspectorToolbar>
        {data.length > 0 && (
          <InspectorData>
            {filteredData.map((key) => (
              <InspectorItem
                active={selectedMetric === key}
                key={key}
                onClick={(evt) => {
                  onClick(evt.target.innerText);
                  evt.target.blur();
                }}
                onKeyDown={(evt) => {
                  if (evt.keyCode === 13) {
                    onClick(evt.target.innerText);
                  }
                }}
                tabIndex="0"
              >
                {key}
              </InspectorItem>
            ))}
          </InspectorData>
        )}
      </InspectorWrap>
    );
  }
}

export default injectIntl(Inspector);
