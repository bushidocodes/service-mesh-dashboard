import { Component } from "react";
import { FormattedMessage } from "react-intl";
import { injectIntl } from "utils/injectIntl";
import InspectorData from "./components/InspectorData";
import InspectorHideStatic from "./components/InspectorHideStatic";
import InspectorHideZero from "./components/InspectorHideZero";
import InspectorItem from "./components/InspectorItem";
import InspectorSearch from "./components/InspectorSearch";
import InspectorToolbar from "./components/InspectorToolbar";
import InspectorWrap from "./components/InspectorWrap";

interface InspectorProps {
  data: string[];
  hideStaticMetric?: boolean;
  hideZeroMetric?: boolean;
  intl: any;
  onChange: (...args: any[]) => any;
  onClick: (...args: any[]) => any;
  onSearch: (...args: any[]) => any;
  searchQuery?: string;
  selectedMetric?: string;
  tabIndex?: number;
}

/** Filterable list of selectable string */
class Inspector extends Component<InspectorProps> {
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
      ? data.filter((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
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
                data-testid="inspector-item"
                key={key}
                onClick={(evt: any) => {
                  onClick(evt.target.innerText);
                  evt.target.blur();
                }}
                onKeyDown={(evt: any) => {
                  if (evt.keyCode === 13) {
                    onClick(evt.target.innerText);
                  }
                }}
                tabIndex={0}
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
