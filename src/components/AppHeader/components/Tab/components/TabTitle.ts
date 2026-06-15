import styled from "styled-components";

import { spacingScale, contrastColor } from "style/styleFunctions";
import {
  COLOR_ALT_BACKGROUND,
  FONT_SIZE_LG,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";

const COLOR_TAB_BACKGROUND_BASE = contrastColor(COLOR_ALT_BACKGROUND, 0.175);

const TabTitle = styled.div`
  color: ${contrastColor(COLOR_TAB_BACKGROUND_BASE, 1).string()};
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: ${spacingScale(0.5)} 0 0;

  h1 {
    font-size: ${FONT_SIZE_LG};
    flex: 1 1 100%;
    line-height: 1;
    margin: 0;
    font-weight: ${FONT_WEIGHT_SEMIBOLD};
    text-transform: capitalize;
  }
`;

export default TabTitle;
