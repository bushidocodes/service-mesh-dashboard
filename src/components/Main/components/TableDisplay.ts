import { CONTENT_MAX_WIDTH, FONT_STACK_DATA } from "style/styleVariables";
import styled from "styled-components";

const TableDisplay = styled.div`
  display: block;
  font-family: ${FONT_STACK_DATA};
  margin-left: auto;
  margin-right: auto;
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
`;

export default TableDisplay;
