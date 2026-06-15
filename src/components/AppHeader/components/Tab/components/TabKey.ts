import styled from "styled-components";

import { contrastColor, spacingScale } from "style/styleFunctions";
import { COLOR_ALT_BACKGROUND } from "style/styleVariables";

const COLOR_TAB_BACKGROUND_BASE = contrastColor(COLOR_ALT_BACKGROUND, 0.175);

const TabKey = styled.dt`
  color: ${contrastColor(COLOR_TAB_BACKGROUND_BASE, 0.8).string()};
  padding-right: ${spacingScale(0.5)};
  display: inline-block;
`;

export default TabKey;
