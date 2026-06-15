import styled from "styled-components";

import {
  FONT_SIZE_BASE,
  BORDER_RADIUS_BASE,
  COLOR_ALT_BACKGROUND
} from "style/styleVariables";
import { contrastColor, spacingScale } from "style/styleFunctions";

// Z-index positions these above the preceding Banner Title in order to ensure they're visible above the Banner Title's shadow
const Extra = styled.a`
  background-color: ${contrastColor(COLOR_ALT_BACKGROUND, 0.2).string()};
  border-radius: ${BORDER_RADIUS_BASE};
  color: ${contrastColor(COLOR_ALT_BACKGROUND, 0.9).string()};
  display: inline-block;
  font-size: ${FONT_SIZE_BASE};
  padding: ${spacingScale(0.25)} ${spacingScale(1)};
  position: relative;
  transition: all 0.15s ease;
  z-index: 2;

  &:not(:last-child) {
    margin-right: ${spacingScale(1)};
  }

  &:hover {
    background-color: ${contrastColor(COLOR_ALT_BACKGROUND, 0.25).string()};
    color: ${contrastColor(COLOR_ALT_BACKGROUND, 1).string()};
  }

  &:active {
    background-color: ${contrastColor(COLOR_ALT_BACKGROUND, 0).string()};
    color: ${contrastColor(COLOR_ALT_BACKGROUND, 1).string()};
  }
`;

export default Extra;
