import { spacingScale } from "style/styleFunctions";

import { FONT_SIZE_SM } from "style/styleVariables";
import styled from "styled-components";

const SecondaryText = styled.span`
  margin-left: ${spacingScale(0.5)};
  opacity: 0.6;
  font-size: ${FONT_SIZE_SM};
`;

export default SecondaryText;
