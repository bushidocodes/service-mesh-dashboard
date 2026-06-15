import styled from "styled-components";

import { spacingScale, contrastColor } from "style/styleFunctions";
import {
  COLOR_CONTENT_BACKGROUND,
  CONTENT_MAX_WIDTH
} from "style/styleVariables";

const Header = styled.header`
  align-items: center;
  border-top: 1px solid
    ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.15, undefined).string()};
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  max-width: ${CONTENT_MAX_WIDTH};
  padding: ${(spacingScale(1), spacingScale(2))};
  width: 100%;
`;

export default Header;
