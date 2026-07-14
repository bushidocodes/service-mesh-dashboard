import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const DismissButtonContainer = styled.div`
  position: absolute;
  cursor: pointer;
  top: ${spacingScale(1)};
  right: ${spacingScale(1)};
  transition: all 0.3s ease;
  pointer-events: auto;
  z-index: 100;
  opacity: 0.125;

  &:hover,
  &:focus {
    opacity: 1;
    transition: all 0.1s ease;
    transform: scale(1.25);
  }

  &:active {
    opacity: 1;
    transition: all 0s ease;
    transform: scale(1.1);
  }

  .Toastify__toast:hover & {
    opacity: 1;
  }
`;

export default DismissButtonContainer;
