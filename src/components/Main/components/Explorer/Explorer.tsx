import ErrorBoundary from "components/ErrorBoundary";
import { useUrlState } from "components/withUrlState";
import { useEffect, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useAppSelector } from "store/hooks";
import { uniq } from "utils/collections";
import { getDygraphOfValue } from "utils/dygraphs";
import GMLineChart from "../GMLineChart";
import Inspector from "./components/Inspector";
import MetricsGraphDisplay from "./components/MetricsGraphDisplay";
import MetricsList from "./components/MetricsList";
import ViewExplorer from "./components/ViewExplorer";

/**
 * General purpose component for rendering any arbitrary timeseries data stored in Redux
 * Uses Inspector to search and select keys.
 */
function Explorer() {
  const { urlState, setUrlState } = useUrlState();
  const metrics = useAppSelector((state) => state.instance.metrics);
  // Memoize so the derived key list stays reference-stable when metrics is
  // unchanged (Object.keys().sort() always allocates a new array).
  const keys = useMemo(() => Object.keys(metrics).sort(), [metrics]);

  const {
    selectedMetric,
    hideZeroMetric = "false",
    hideStaticMetric = "false",
    filterString = ""
  } = urlState;

  /**
   * One-time purpose effect for initially loading checkboxes 'checked' or nothing.
   * We may be able to get rid of document.querySelector if we restyle the 'checked' tick.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only; mirrors former componentDidMount checkbox tick setup
  useEffect(() => {
    // HTML attribute checked means: checked by default, when the page loads.
    // The DOM property checked is actually the current state of the checkbox
    // and is either true/false (exists or doesn't exist <input type=checkbox checked> or <input type=checkbox >),
    // and this will change when the checkbox is clicked, but isn't visible when you inspect the HTML.
    // This can be confusing because setting visible 'checked' attribute
    // on checkbox input fields does not set the actual html checked attribute,
    // but it refers to javascript checked property on the element.
    // display initial checkbox tick after page loads
    if (hideZeroMetric === "true") {
      const hideZeroInput = document.querySelector(
        'input[name="hideZeroMetric"]'
      );
      if (hideZeroInput) {
        hideZeroInput.setAttribute(
          "checked",
          String((hideZeroInput as HTMLInputElement).checked)
        );
      }
    }

    if (hideStaticMetric === "true") {
      const hideStaticInput = document.querySelector(
        'input[name="hideStaticMetric"]'
      );
      if (hideStaticInput) {
        hideStaticInput.setAttribute(
          "checked",
          String((hideStaticInput as HTMLInputElement).checked)
        );
      }
    }
  }, []);

  /**
   * Takes key list and metrics object and filters them on hide features
   */
  const hideKeys = (rawKeys: string[], metricsData: typeof metrics) => {
    // the following booleans are passed down from urlState as strings, so we need to parse them
    const hideZero = JSON.parse(hideZeroMetric);
    const hideStatic = JSON.parse(hideStaticMetric);

    // Filter out the timestamps key, which does not point to valid timeseries
    // data but instead provides information about the range of time expressed
    const metricKeys = rawKeys.filter((key: string) => key !== "timestamps");

    // return original keys if hide features are turned off
    if (!hideZero && !hideStatic) {
      return metricKeys;
    } else if (hideStatic) {
      // static filter is more inclusive than zero filter
      return metricKeys.filter((key: string) => {
        // Get the values associated with a key and only return if
        // there is more than one unique value
        const valuesOfKey = Object.values(metricsData[key] ?? {});
        return uniq(valuesOfKey).length > 1;
      });
    } else if (hideZero) {
      return metricKeys.filter((key: string) => {
        return !Object.values(metricsData[key] ?? {}).every((val) => val === 0);
      });
    }
    return [];
  };

  // filter keys if hide filter is on
  const filteredKeys = hideKeys(keys, metrics);

  return (
    <ErrorBoundary>
      <ViewExplorer>
        <MetricsList>
          <Inspector
            data={filteredKeys}
            hideZeroMetric={JSON.parse(hideZeroMetric)}
            hideStaticMetric={JSON.parse(hideStaticMetric)}
            onClick={(nextSelectedMetric) =>
              setUrlState({ selectedMetric: nextSelectedMetric })
            }
            onChange={(checked, name) =>
              setUrlState({
                [name]: checked
              })
            }
            onSearch={(nextFilterString) =>
              setUrlState({ filterString: nextFilterString })
            }
            searchQuery={filterString}
            selectedMetric={selectedMetric}
            tabIndex={0}
          />
        </MetricsList>
        <MetricsGraphDisplay>
          {selectedMetric && keys.includes(selectedMetric) ? (
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

export default Explorer;
