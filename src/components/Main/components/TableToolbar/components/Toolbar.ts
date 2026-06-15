import styled from "styled-components";

import {
  COLOR_CONTENT_BACKGROUND,
  CONTENT_MAX_WIDTH
} from "style/styleVariables";
import { contrastColor, spacingScale } from "style/styleFunctions";

const TOOLBAR_BACKGROUND_COLOR = contrastColor(COLOR_CONTENT_BACKGROUND, 0.04)
  .hsl()
  .string();

const Toolbar = styled.div`
  align-items: center;
  background-color: ${TOOLBAR_BACKGROUND_COLOR};
  display: flex;
  flex-direction: row;
  height: ${spacingScale(4.5)};
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: ${CONTENT_MAX_WIDTH};
  padding: ${spacingScale(0.25)} ${spacingScale(2)};

  @media all and (min-width: ${CONTENT_MAX_WIDTH}) {
    &:after {
      background-color: inherit;
      content: "";
      height: inherit;
      left: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }

    > * {
      position: relative;
      z-index: 2;
    }
  }
`;

export default Toolbar;
