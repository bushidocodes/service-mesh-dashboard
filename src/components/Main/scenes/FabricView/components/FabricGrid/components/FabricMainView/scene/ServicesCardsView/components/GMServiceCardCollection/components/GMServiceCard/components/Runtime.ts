import { spacingScale } from "style/styleFunctions";
import { FONT_WEIGHT_SEMIBOLD } from "style/styleVariables";
import styled from "styled-components";

const Runtime = styled.span<{ cardFontColor?: string }>`
  color: ${(props) => props.cardFontColor};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  text-align: left;
  flex: 1 1 100%;
  padding-right: ${spacingScale(1)};
`;

export default Runtime;
