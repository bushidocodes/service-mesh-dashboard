import { COLOR_DANGER, COLOR_SUCCESS } from "style/styleVariables";
import styled from "styled-components";

const VizFill = styled.div<{ colorDegree?: number; width?: number }>`
  background-color: currentColor;
  border-radius: inherit;
  bottom: 0;
  color: ${(props) =>
    props.colorDegree
      ? `${COLOR_SUCCESS.mix(COLOR_DANGER, props.colorDegree / 100)}`
      : "currentColor"};
  left: 0;
  min-width: 2px;
  position: absolute;
  top: 0;
  width: ${(props) => (props.width ? `${props.width}%` : "0%")};
`;

export default VizFill;
