import { FONT_SIZE_HERO } from "style/styleVariables";
import styled from "styled-components";

const ReadoutItemValue = styled.span`
  font-size: ${FONT_SIZE_HERO};
  word-break: break-all;
  margin: 0;
  line-height: 1.1;
  min-height: 1em;
`;

export default ReadoutItemValue;
