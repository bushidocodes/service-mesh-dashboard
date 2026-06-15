import styled from "styled-components";

import {
  FONT_SIZE_XS,
  COLOR_CONTENT,
  COLOR_CONTENT_BACKGROUND
} from "style/styleVariables";
import { spacingScale, contrastColor } from "style/styleFunctions";

const Copyright = styled.p`
  font-size: ${FONT_SIZE_XS};
  margin: 0;
  flex: 0 0 100%;
  text-align: center;
  transition: opacity 0.2s ease;
  cursor: default;
  color: ${COLOR_CONTENT};

  border-top: 1px solid
    ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.1, undefined).string()};
  margin-top: ${spacingScale(1)};
  padding: ${spacingScale(1)};

  order: 3;

  @media all and (min-width: 800px) {
    order: initial;
    flex: 1 1 auto;
    padding: 0;
    margin: 0;
    border: none;
  }
`;

export default Copyright;
