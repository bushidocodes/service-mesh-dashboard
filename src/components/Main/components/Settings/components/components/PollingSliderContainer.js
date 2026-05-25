import styled from "styled-components";

import { BORDER_RADIUS_BASE, COLOR_WHITE } from "style/styleVariables";
import { spacingScale, contrastColor } from "style/styleFunctions";
import InputRange from "./InputRange";

const PollingSliderContainer = styled.div`
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
  ${InputRange};
  ${(props) =>
    props.isDisabled && // The following controls disabled styles for PollingSliderContainer & InputRange
    `
    background: #f3f3f3;
    .input-range__label.input-range__label--value {
        color: ${contrastColor(COLOR_WHITE, 0.6).toString()};
    }
    .input-range--disabled .input-range__slider {    
        background: ${contrastColor(COLOR_WHITE, 0.6).toString()};
        cursor: default;
        border: none;
          &:hover,
          &:focus,
          &:active {
             transform: none;
          }
    }
    .input-range__track {
        cursor: default;
    }
    .input-range__slider:before {    
        border-top: 7px solid ${contrastColor(COLOR_WHITE, 0.6).toString()};
        color:${contrastColor(COLOR_WHITE, 0.6).toString()};u
    }
    `};
`;

export default PollingSliderContainer;
