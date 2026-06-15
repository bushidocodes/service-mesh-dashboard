import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const CancelX = styled.span`
  cursor: pointer;
  height: ${spacingScale(3)};
  position: absolute;
  right: ${spacingScale(2)};
  top: ${spacingScale(2)};
  transition: all 0.3s ease;
  width: ${spacingScale(3)};

  &:hover,
  &:focus {
    transform: scale(1.25);
    transition: all 0.1s ease;
  }

  &:active {
    transform: scale(1.1);
    transition: all 0;
  }
`;

export default CancelX;
