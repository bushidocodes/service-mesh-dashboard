import { contrastColor, spacingScale } from "style/styleFunctions";

import {
  BORDER_RADIUS_BASE,
  COLOR_WHITE,
  FONT_SIZE_BASE
} from "style/styleVariables";
import styled from "styled-components";

const PollingSliderContainer = styled.div<{ isDisabled?: boolean }>`
  align-items: center;
  border: 1px solid ${contrastColor(COLOR_WHITE, 0.1).toString()};
  border-radius: ${BORDER_RADIUS_BASE};
  display: flex;
  flex: 0 1 50%;
  flex-direction: column;
  justify-content: center;
  margin-left: ${spacingScale(2)};
  padding: ${spacingScale(4)};
  position: relative;

  .label {
    font-size: ${FONT_SIZE_BASE};
    text-align: center;
    width: 100%;
  }

  ${(props) =>
    props.isDisabled &&
    `
    background: #f3f3f3;
    `};
`;

export default PollingSliderContainer;
