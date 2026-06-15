import styled from "styled-components";

import { contrastColor } from "style/styleFunctions";
import {
  FONT_SIZE_BASE,
  COLOR_ALT_BACKGROUND,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";

const APP_TOOLBAR_BACKGROUND_COLOR = COLOR_ALT_BACKGROUND.string();

const BrandText = styled.span`
  color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 1).string()};
  flex: 0 0 auto;
  font-size: ${FONT_SIZE_BASE};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  letter-spacing: 0.03em;
  > a {
    color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 0.85).string()};
    &:hover {
      color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 1).string()};
    }
  }
`;

export default BrandText;
