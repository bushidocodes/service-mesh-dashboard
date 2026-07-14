import { spacingScale } from "style/styleFunctions";
import { FONT_SIZE_XS, FONT_WEIGHT_SEMIBOLD } from "style/styleVariables";
import styled from "styled-components";

const AppVersionLink = styled.a`
  color: white;
  flex: 0 0 auto;
  font-size: ${FONT_SIZE_XS};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  opacity: 1;
  padding: 0 ${spacingScale(1)};

  &:hover {
    color: white;
    opacity: 1;
  }
`;

export default AppVersionLink;
