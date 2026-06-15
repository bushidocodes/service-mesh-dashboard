import styled from "styled-components";

import {
  FONT_STACK_DATA,
  FONT_SIZE_LG,
  COLOR_CONTENT_BACKGROUND,
  BORDER_RADIUS_BASE
} from "style/styleVariables";
import { spacingScale, contrastColor } from "style/styleFunctions";

const DataDisplay = styled.div<{ table?: boolean }>`
  background-color: ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.04).string()};
  border-radius: ${BORDER_RADIUS_BASE};
  font-family: ${FONT_STACK_DATA};
  font-size: ${FONT_SIZE_LG};
  height: 100%;
  padding: ${spacingScale(1)};
  padding-top: ${spacingScale(6)};
  ${(props) => (props.table ? "text-align: right" : "")};
`;

export default DataDisplay;
