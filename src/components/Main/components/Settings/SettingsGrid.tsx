import Button from "components/Button";
import ConfirmationModal from "components/ConfirmationModal";
import ErrorBoundary from "components/ErrorBoundary";
import LayoutSection from "components/LayoutSection";
import Readout from "components/Main/components/Readout";
import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { useAppSelector } from "store/hooks";
import { Actions } from "store/jumpstate";
import PollingSettings from "./components/PollingSettings";

/**
 * Settings Page containing controls for things like polling rate, local storage, etc.
 */
function SettingsGrid() {
  const intl = useIntl();
  const [isClearCacheModelOpen, setIsClearCacheModelOpen] = useState(false);

  const fabricServer = useAppSelector((state) => state.settings.fabricServer);
  const fabricPollingInterval = useAppSelector(
    (state) => state.fabric.fabricPollingInterval
  );
  const isPollingFabric = useAppSelector(
    (state) => state.fabric.isPollingFabric
  );
  const selectedInstanceID = useAppSelector(
    (state) => state.fabric.selectedInstanceID
  );
  const instanceMetricsPollingInterval = useAppSelector(
    (state) => state.instance.instanceMetricsPollingInterval
  );
  const isPollingInstanceMetrics = useAppSelector(
    (state) => state.instance.isPollingInstanceMetrics
  );
  const metricsSampleCount = useAppSelector(
    (state) => state.instance.metrics.timestamps?.length ?? 0
  );

  const clearCacheClickAction = () => {
    setIsClearCacheModelOpen(true);
  };

  const button = (
    <Button
      clickAction={clearCacheClickAction}
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
        isOpen={isClearCacheModelOpen}
        onCancel={() => setIsClearCacheModelOpen(false)}
        onConfirm={() => {
          Actions.clearMetrics();
          setIsClearCacheModelOpen(false);
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
                value: `${metricsSampleCount}`,
                children: button
              }
            ]}
          />
        </LayoutSection>
      </ErrorBoundary>
    </Fragment>
  );
}

export default SettingsGrid;
