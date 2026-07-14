import { FONT_SIZE_BASE, FONT_STACK_DATA } from "style/styleVariables";
import styled from "styled-components";

const Title = styled.h1<{ cardFontWeight?: string }>`
  text-align: left;
  font-size: ${FONT_SIZE_BASE};
  font-family: ${FONT_STACK_DATA};
  line-height: 1.25;
  margin: 0;
  overflow: hidden;
  color: inherit;
  font-weight: ${(props) => props.cardFontWeight};
  position: relative;
  z-index: 2;
`;

export default Title;
