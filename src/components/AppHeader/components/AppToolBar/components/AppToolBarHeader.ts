import styled from "styled-components";

import { contrastColor, spacingScale } from "style/styleFunctions";
import {
  FONT_SIZE_BASE,
  FONT_STACK_BASE,
  COLOR_ALT_BACKGROUND
} from "style/styleVariables";

const APP_TOOLBAR_HEIGHT = spacingScale(4.25);
const APP_TOOLBAR_FONT_SIZE = FONT_SIZE_BASE;
const APP_TOOLBAR_BACKGROUND_COLOR = "transparent";
const APP_TOOLBAR_TEXT_COLOR = contrastColor(COLOR_ALT_BACKGROUND).string();

const AppToolBarHeader = styled.nav`
  align-items: center;
  background-color: ${APP_TOOLBAR_BACKGROUND_COLOR};
  color: ${APP_TOOLBAR_TEXT_COLOR};
  display: flex;
  flex: 0 0 ${APP_TOOLBAR_HEIGHT};
  flex-direction: row;
  font-family: ${FONT_STACK_BASE};
  font-size: ${APP_TOOLBAR_FONT_SIZE};
`;

export default AppToolBarHeader;
