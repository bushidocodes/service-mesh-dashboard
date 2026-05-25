import styled from "styled-components";
import { PropTypes } from "prop-types";
import { spacingScale } from "style/styleFunctions";
import { FONT_WEIGHT_SEMIBOLD } from "style/styleVariables";

const Runtime = styled.span`
  color: ${(props) => props.cardFontColor};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  text-align: left;
  flex: 1 1 100%;
  padding-right: ${spacingScale(1)};
`;

Runtime.propTypes = {
  cardFontColor: PropTypes.string
};

export default Runtime;
