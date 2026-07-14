import { contrastColor, spacingScale } from "style/styleFunctions";
import {
  COLOR_CONTENT_BACKGROUND,
  COLOR_HIGHLIGHT
} from "style/styleVariables";
import styled from "styled-components";

const Link = styled.a`
  color: ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.4, undefined).string()};
  padding: 0 ${spacingScale(1)};

  &:hover {
    color: ${COLOR_HIGHLIGHT.string()};
  }
`;

export default Link;
