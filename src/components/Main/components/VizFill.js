import styled from "styled-components";
import { PropTypes } from "prop-types";

import { COLOR_SUCCESS, COLOR_DANGER } from "style/styleVariables";

const VizFill = styled.div`
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

VizFill.propTypes = {
  colorDegree: PropTypes.number,
  width: PropTypes.number
};

export default VizFill;
