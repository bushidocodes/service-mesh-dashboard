import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const IconWrapper = styled.div`
  &:not(:empty) {
    margin-right: ${spacingScale(0.5)};
    margin-left: -${spacingScale(0.5)};
  }
`;

export default IconWrapper;
