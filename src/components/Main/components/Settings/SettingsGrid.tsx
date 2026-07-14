import Button from "components/Button";
import ConfirmationModal from "components/ConfirmationModal";
import ErrorBoundary from "components/ErrorBoundary";
import LayoutSection from "components/LayoutSection";
import Readout from "components/Main/components/Readout";
import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Actions } from "store/jumpstate";
import type { RootState } from "types";
import { injectIntl } from "utils/injectIntl";
import PollingSettings from "./components/PollingSettings";

interface SettingsGridProps {
  // The polling interval/flag props always come from the fabric and instance
  // store slices, which initialize them (intervals 5000, flags false), so they
  // are never undefined at render. This component is connect()-ed, so external
  // callers never pass them directly.
  fabricPollingInterval: number;
  // string | null mirrors the settings/fabric store slices (default to null).
  fabricServer?: string | null;
  instanceMetricsPollingInterval: number;
  intl: any;
  isPollingFabric: boolean;
  isPollingInstanceMetrics: boolean;
  metricsSampleCount?: number;
  selectedInstanceID?: string | null;
}

interface SettingsGridState {
  isClearCacheModelOpen: boolean;
}

/**
 * Settings Page containing controls for things like polling rate, local storage, etc.
 * @param {Object} props - See proptypes for details
 */
class SettingsGrid extends Component<SettingsGridProps, SettingsGridState> {
  state = {
    isClearCacheModelOpen: false
  };

  clearCacheClickAction = () => {
    this.setState({ isClearCacheModelOpen: true });
  };

  render() {
    const {
      fabricPollingInterval,
      fabricServer,
      intl,
      isPollingFabric,
      isPollingInstanceMetrics,
      metricsSampleCount,
      instanceMetricsPollingInterval,
      selectedInstanceID
    } = this.props;

    const button = (
      <Button
        clickAction={this.clearCacheClickAction}
        glyph="Close"
        label={intl.formatMessage({
          id: "settingsGrid.clearCache",
          defaultMessage: "Clear Cache",
          description: "Metrics cache readout button label"
        })}
        tabIndex={0}
      />
    );

    return (
      <Fragment>
        <ConfirmationModal
          isOpen={this.state.isClearCacheModelOpen}
          onCancel={() => this.setState({ isClearCacheModelOpen: false })}
          onConfirm={() => {
            Actions.clearMetrics();
            this.setState({ isClearCacheModelOpen: false });
          }}
          question={intl.formatMessage({
            id: "settingsGrid.modal.question",
            defaultMessage:
              "Are you sure that you want to clear the cached metrics data?",
            description: "Modal prompt"
          })}
          secondary={intl.formatMessage({
            id: "settingsGrid.modal.secondary",
            defaultMessage: "This action cannot be undone.",
            description: "Modal prompt warning"
          })}
        />
        <ErrorBoundary>
          {fabricServer && (
            <PollingSettings
              changePollingInterval={
                Actions.changeFabricMicroservicesPollingInterval
              }
              stopPolling={Actions.stopPollingFabricMicroservices}
              startPolling={Actions.startPollingFabricMicroservices}
              interval={fabricPollingInterval}
              isPolling={isPollingFabric}
              glyph="Fabric"
              title={intl.formatMessage({
                id: "settingsGrid.fabricPolling",
                defaultMessage: "Fabric Polling",
                description: "Polling settings section title"
              })}
            />
          )}
          <PollingSettings
            changePollingInterval={Actions.changeInstanceMetricsPollingInterval}
            stopPolling={Actions.stopPollingInstanceMetrics}
            startPolling={Actions.startPollingInstanceMetrics}
            interval={instanceMetricsPollingInterval}
            isPolling={isPollingInstanceMetrics}
            isDisabled={!selectedInstanceID}
            glyph="ServiceInstance"
            title={
              fabricServer
                ? intl.formatMessage({
                    id: "settingsGrid.instancePolling",
                    defaultMessage: "Instance Polling",
                    description: "Polling settings section title"
                  })
                : intl.formatMessage({
                    id: "settingsGrid.polling",
                    defaultMessage: "Polling",
                    description: "Polling settings section title"
                  })
            }
            tooltipContent={intl.formatMessage({
              id: "settingsGrid.tooltip",
              defaultMessage: "Select an instance to turn on polling",
              description: "Polling settings section title"
            })}
          />
          <LayoutSection
            icon={"Tape"}
            title={intl.formatMessage({
              id: "settingsGrid.metricsCache",
              defaultMessage: "Metrics Cache",
              description: "Metrics cache readout title"
            })}
            flex
          >
            <Readout
              cacheCard={true}
              readoutItems={[
                {
                  title: intl.formatMessage({
                    id: "settingsGrid.samples",
                    defaultMessage: "Samples",
                    description: "Metrics cache sample-count readout text"
                  }),
                  value: `${metricsSampleCount ?? 0}`,
                  children: button
                }
              ]}
            />
          </LayoutSection>
        </ErrorBoundary>
      </Fragment>
    );
  }
}

function mapStateToProps({
  settings: { fabricServer },
  fabric: { fabricPollingInterval, isPollingFabric, selectedInstanceID },
  instance: {
    metrics,
    instanceMetricsPollingInterval,
    isPollingInstanceMetrics
  }
}: RootState) {
  const timestamps = (metrics as { timestamps?: string[] })?.timestamps;
  return {
    fabricPollingInterval,
    fabricServer,
    instanceMetricsPollingInterval,
    isPollingFabric,
    isPollingInstanceMetrics,
    selectedInstanceID,
    metricsSampleCount: Array.isArray(timestamps) ? timestamps.length : 0
  };
}

export default connect(mapStateToProps)(injectIntl(SettingsGrid));
