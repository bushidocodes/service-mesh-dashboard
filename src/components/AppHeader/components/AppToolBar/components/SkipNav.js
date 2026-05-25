import styled from "styled-components";
import { PropTypes } from "prop-types";

import { FONT_SIZE_SM, COLOR_WHITE, COLOR_GREEN } from "style/styleVariables";

const SkipNav = styled.button.attrs({
  onKeyDown: (props) => (evt) => {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      document.getElementById(props.skipToId).focus();
    }
  }
})`
  background-color: ${COLOR_GREEN.string()};
  border: none;
  color: ${COLOR_WHITE.string()};
  font-size: ${FONT_SIZE_SM};
  left: 0;
  position: absolute;
  padding: 0.6em;
  text-transform: uppercase;
  top: -10em;
  transition: top 0.5s ease;

  &:focus {
    top: 0;
  }
`;

SkipNav.propTypes = {
  skipToId: PropTypes.string
};

export default SkipNav;
