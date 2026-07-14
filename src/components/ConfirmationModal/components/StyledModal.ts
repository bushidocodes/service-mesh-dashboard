import { contrastColor, spacingScale } from "style/styleFunctions";
import { COLOR_ALT_BACKGROUND } from "style/styleVariables";
import styled from "styled-components";

const modalBackgroundColor = COLOR_ALT_BACKGROUND;
const modalHeightBasis = "400px";
const modalWidthBasis = "500px";

/** Native dialog panel for ConfirmationModal. */
const StyledModal = styled.dialog`
  backdrop-filter: blur(10px);
  background-color: ${modalBackgroundColor.fade(0.15).string()};
  border: none;
  border-radius: 3px;
  color: ${contrastColor(modalBackgroundColor, 0.95, undefined).string()};
  display: flex;
  flex-direction: column;
  height: ${modalHeightBasis};
  padding: ${spacingScale(3)};
  width: ${modalWidthBasis};

  &:focus {
    outline: 0;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.45);
  }
`;

export default StyledModal;
