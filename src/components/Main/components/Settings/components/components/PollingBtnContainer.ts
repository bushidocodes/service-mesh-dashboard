import styled from "styled-components";

import { COLOR_BRAND_PRIMARY, COLOR_WHITE } from "style/styleVariables";
import { contrastColor } from "style/styleFunctions";

const PollingBtnContainer = styled.div<{ isDisabled?: boolean }>`
  align-items: center;
  align-self: stretch;
  border: 1px solid ${contrastColor(COLOR_WHITE, 0.1).toString()};
  border-radius: 3px;
  display: flex;
  flex: 0 0 160px;
  flex-direction: column;
  height: 140px;
  justify-content: center;
  width: 160px;

  .label {
    bottom: 10px;
    position: absolute;
    left: 0;
    width: 100%;
  }

  > svg {
    color: ${COLOR_BRAND_PRIMARY.toString()};
    transition: all 0.3s ease;
    will-change: transform;
  }

  .btn-type-polling > svg {
    height: 100%;
  }

  &:hover svg,
  &:active svg,
  &:focus svg {
    ${(props) => !props.isDisabled && `transform: scale(1.1)`};
    transition: all 0.1s ease;
  }
  &:active svg {
    transform: scale(1);
    transition: all 0;
  }
`;

export default PollingBtnContainer;
