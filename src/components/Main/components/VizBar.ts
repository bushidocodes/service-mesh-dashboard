import styled from "styled-components";

import { spacingScale, contrastColor } from "style/styleFunctions";
import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";

const VizBar = styled.div`
  background-color: ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.1).string()};
  border-radius: 1px 4px 4px 1px;
  bottom: 0;
  height: 3px;
  left: 0;
  position: absolute;
  right: ${spacingScale(2)};
`;

export default VizBar;
