import filesize from "filesize";
import { Actions } from "jumpstate";
import objectSizeOf from "object-sizeof";
import { PropTypes } from "prop-types";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import PollingSettings from "./components/PollingSettings";
import Button from "components/Button";
import LayoutSection from "components/LayoutSection";
import ErrorBoundary from "components/ErrorBoundary";
import ConfirmationModal from "components/ConfirmationModal";
import Readout from "components/Main/components/Readout";

/**
 * Settings Page containing controls for things like polling rate, local storage, etc.
 * @param {Object} props - See proptypes for details
 */
class SettingsGrid extends Component {
  static propTypes = {
    fabricPollingInterval: PropTypes.number,
    fabricServer: PropTypes.string,
    instanceMetricsPollingInterval: PropTypes.number,
    intl: PropTypes.object.isRequired,
    isPollingFabric: PropTypes.bool,
    isPollingInstanceMetrics: PropTypes.bool,
    metricsCacheSize: PropTypes.string,
    selectedInstanceID: PropTypes.string
  };

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
      metricsCacheSize,
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
                    id: "settingsGrid.cacheSize",
                    defaultMessage: "Cache Size",
                    description: "Metrics cache readout text"
                  }),
                  value: `${metricsCacheSize}`,
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
  dashboards,
  fabric: { fabricPollingInterval, isPollingFabric, selectedInstanceID },
  instance: {
    metrics,
    instanceMetricsPollingInterval,
    isPollingInstanceMetrics
  }
}) {
  return {
    fabricPollingInterval,
    fabricServer,
    instanceMetricsPollingInterval,
    isPollingFabric,
    isPollingInstanceMetrics,
    selectedInstanceID,
    metricsCacheSize: filesize(objectSizeOf(metrics))
  };
}

export default connect(mapStateToProps)(injectIntl(SettingsGrid));
