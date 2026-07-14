import { contrastColor, spacingScale } from "style/styleFunctions";

import {
  BORDER_RADIUS_BASE,
  COLOR_CONTENT_BACKGROUND,
  FONT_SIZE_LG,
  FONT_STACK_DATA
} from "style/styleVariables";
import styled from "styled-components";

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
