import styled from "styled-components";
import { PropTypes } from "prop-types";

import { spacingScale } from "style/styleFunctions";

// -webkit-flex: 1 1 0; added as a fix for flex-item not centering in safari 10.1
// for "cacheCard", set minimum height to overrule media query for  child readoutItemContainer size.  flex-basis of 100% is overruled in the parent container.
const ItemDisplay = styled.div`
  align-items: center;
  display: flex;
  flex: ${(props) => (props.flex ? props.flex : "0 1 100%")};
  -webkit-flex: 1 1 0;
  flex-direction: row;
  justify-content: center;
  min-height: ${(props) => (props.cacheCard ? "125px" : "75px")};
  padding: ${spacingScale(1)} ${spacingScale(0.5)};
  position: relative;

  & + &:before {
    border-top: 1px solid currentColor;
    content: "";
    left: 0;
    opacity: 0.125;
    position: absolute;
    right: 0;
    top: 0;
  }

  button {
    align-self: center;
    margin: ${spacingScale(1)} 0;
  }
`;

ItemDisplay.propTypes = {
  flex: PropTypes.string
};

export default ItemDisplay;
