import styled from "styled-components";

import { CHART_BACKGROUND_COLOR, FONT_STACK_DATA } from "style/styleVariables";
import { chartHeight } from "style/styleFunctions";

const LineChartDisplay = styled.div.attrs({
  tabIndex: 0
})<{ height?: string }>`
  align-items: stretch;
  background-color: ${CHART_BACKGROUND_COLOR};
  border: 1px solid transparent;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  font-family: ${FONT_STACK_DATA};
  ${(props) => (props.height ? chartHeight(props.height) : "height:  100%")};
  width: 100%;
`;

export default LineChartDisplay;
