import styled from "styled-components";

import { FONT_STACK_DATA, CONTENT_MAX_WIDTH } from "style/styleVariables";

const TableDisplay = styled.div`
  display: block;
  font-family: ${FONT_STACK_DATA};
  margin-left: auto;
  margin-right: auto;
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
`;

export default TableDisplay;
