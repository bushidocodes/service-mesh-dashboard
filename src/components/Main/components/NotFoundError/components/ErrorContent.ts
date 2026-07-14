import { spacingScale } from "style/styleFunctions";

import {
  BORDER_RADIUS_BASE,
  COLOR_CONTENT,
  COLOR_WARNING,
  FONT_SIZE_HERO
} from "style/styleVariables";
import styled from "styled-components";

const ErrorContent = styled.div`
  align-items: center;
  border: 1px solid ${COLOR_WARNING.string()};
  border-radius: ${parseInt(BORDER_RADIUS_BASE, 10) * 2}px;
  color: ${COLOR_CONTENT.string()};
  display: inline-flex;
  flex-basis: 600px;
  flex-flow: row nowrap;
  font-size: ${FONT_SIZE_HERO};
  justify-content: center;
  margin: ${spacingScale(4)};
  padding: ${spacingScale(8)} ${spacingScale(4)};
  padding-top: ${spacingScale(8)};
  padding-bottom: ${spacingScale(8)};
`;

export default ErrorContent;
