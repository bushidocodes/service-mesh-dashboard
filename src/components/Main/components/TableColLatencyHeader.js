import React from "react";
import styled from "styled-components";

import { FONT_SIZE_SM, COLOR_CONTENT_MUTED } from "style/styleVariables";
import TableColHeader from "./TableColHeader";
import Tooltip from "components/Tooltip";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";

const LatencyHeaderWrap = TableColHeader.extend`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: visible;
`;

const PercentileHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
`;

const Percent = styled.div`
  font-size: ${FONT_SIZE_SM};
  color: ${COLOR_CONTENT_MUTED.string()};
`;

const Latency = styled.div`
  padding: 8px;
`;

const tooltipContent =
  "Latency 50% refers to the average latency of the 50% percentile, while Latency 99% is the average latency for the slowest 1% of responses, also known as tail latency.";

function TableColLatencyHeader({ intl }) {
  return (
    <LatencyHeaderWrap>
      <Latency>
        <Tooltip
          content={intl.formatMessage({
            id: "tableColLatencyHeader.tooltip",
            defaultMessage: tooltipContent,
            description: "Latency header explanation"
          })}
          position="left"
        >
          <FormattedMessage
            id="tableColLatencyHeader.latency"
            defaultMessage="Latency"
            description="Latency header"
          />
        </Tooltip>
      </Latency>
      <PercentileHeader>
        <Percent>50%</Percent>
        <Percent>99%</Percent>
      </PercentileHeader>
    </LatencyHeaderWrap>
  );
}

TableColLatencyHeader.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(TableColLatencyHeader);
