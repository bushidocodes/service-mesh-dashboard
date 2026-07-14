import {
  COLOR_BLACK,
  COLOR_WHITE,
  FONT_STACK_BASE,
  ZINDEX_TOOLTIP
} from "style/styleVariables";
import styled from "styled-components";

const LanguageSelectorContent = styled.ul<{ visible?: boolean }>`
  position: absolute;
  background-color: ${COLOR_WHITE.string()};
  border-radius: 6px;
  color: ${COLOR_BLACK.string()};
  font-family: ${FONT_STACK_BASE};
  font-weight: 700;
  opacity: 0;
  padding: 10px;
  margin: 5px 0;
  text-align: right;
  transition: opacity 1s;
  visibility: hidden;
  white-space: normal;
  width: 120px;
  z-index: ${ZINDEX_TOOLTIP};
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.visible &&
    `right: 6em;
     opacity: 1;
     visibility: visible;`};
`;

export default LanguageSelectorContent;
