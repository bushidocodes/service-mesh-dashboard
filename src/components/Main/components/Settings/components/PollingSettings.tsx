import Button from "components/Button";
import LayoutSection from "components/LayoutSection";
import Tooltip from "components/Tooltip";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { contrastColor } from "style/styleFunctions";
import { COLOR_SUCCESS, COLOR_WHITE } from "style/styleVariables";
import { debounce } from "utils/collections";
import InputRange from "./components/InputRange";
import PollingBtnContainer from "./components/PollingBtnContainer";
import PollingSliderContainer from "./components/PollingSliderContainer";

interface PollingSettingsProps {
  changePollingInterval: (...args: any[]) => any;
  glyph: string;
  interval: number;
  isDisabled?: boolean;
  isPolling: boolean;
  startPolling: (...args: any[]) => any;
  stopPolling: (...args: any[]) => any;
  title: string;
  tooltipContent?: string;
}

/**
 * Control to start/stop polling and change the polling rate
 * Styled to resemble a Readout and intended to be a child of SettingsGrid
 */
function PollingSettings({
  changePollingInterval,
  glyph,
  interval,
  isDisabled = false,
  isPolling,
  startPolling,
  stopPolling,
  title,
  tooltipContent
}: PollingSettingsProps) {
  const intl = useIntl();
  // Use local state to have a "loosely" controlled component whereby the slider
  // slides smoothly and changes to Redux are debounced.
  const [localInterval, setLocalInterval] = useState(interval / 1000);
  const debouncedSetInterval = useMemo(
    () => debounce(changePollingInterval, 1000),
    [changePollingInterval]
  );

  const buttonGlyph = isPolling ? "Pause" : "Play";
  const buttonLabel = isPolling
    ? intl.formatMessage({
        id: "pollingSettings.button.pause",
        defaultMessage: "Pause Polling",
        description: "Button label"
      })
    : intl.formatMessage({
        id: "pollingSettings.button.resume",
        defaultMessage: "Resume Polling",
        description: "Button label"
      });

  return (
    <LayoutSection title={title} icon={glyph} flex>
      <Tooltip
        content={tooltipContent}
        position="left"
        disabled={!isDisabled}
        containerStyle={{ border: "none" }}
        contentStyle={{ top: "0px" }}
      >
        <PollingBtnContainer isDisabled={isDisabled}>
          <Button
            clickAction={() => {
              if (isPolling) {
                stopPolling();
              } else {
                startPolling();
              }
            }}
            glyph={buttonGlyph}
            glyphRatio={3}
            glyphColor={
              isDisabled
                ? contrastColor(COLOR_WHITE, 0.7).toString()
                : COLOR_SUCCESS.string()
            }
            disabled={isDisabled}
            label={buttonLabel}
            orientation={"vertical"}
            outline={"raised"}
            size={"xl"}
            tabIndex={0}
            type={"polling"}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 0
            }}
            labelStyle={{
              fontSize: "14px",
              position: "absolute",
              bottom: "10px",
              width: "100%",
              left: "0px"
            }}
          />
        </PollingBtnContainer>
      </Tooltip>

      <PollingSliderContainer
        isDisabled={isDisabled}
        id={`ctrl-slider-${title}`}
      >
        <InputRange
          aria-labelledby={`interval-name-${title}`}
          disabled={isDisabled}
          max={120}
          min={5}
          onChange={(e) => {
            const value = Number(e.target.value);
            setLocalInterval(value);
            debouncedSetInterval(value * 1000);
          }}
          value={localInterval}
        />
        <span className="label" id={`interval-name-${title}`}>
          {`${localInterval}s `}
          {intl.formatMessage({
            id: "pollingSettings.pollingIntervals",
            defaultMessage: "Polling Interval(s)",
            description: "Input Range label"
          })}
        </span>
      </PollingSliderContainer>
    </LayoutSection>
  );
}

export default PollingSettings;
