import { contrastColor, spacingScale } from "style/styleFunctions";
import { COLOR_ALT_BACKGROUND } from "style/styleVariables";
import styled from "styled-components";

const modalBackgroundColor = COLOR_ALT_BACKGROUND;
const modalHeightBasis = "400px";
const modalWidthBasis = "500px";

/** Native dialog panel for ConfirmationModal. */
const StyledModal = styled.dialog`
  /* Author display must not override UA closed-state hiding. */
  display: none;
  backdrop-filter: blur(10px);
  background-color: ${modalBackgroundColor.fade(0.15).string()};
  border: none;
  border-radius: 3px;
  color: ${contrastColor(modalBackgroundColor, 0.95, undefined).string()};
  height: ${modalHeightBasis};
  margin: auto;
  max-height: calc(100vh - 2rem);
  max-width: calc(100vw - 2rem);
  padding: ${spacingScale(3)};
  width: ${modalWidthBasis};

  &[open] {
    display: flex;
    flex-direction: column;
  }

  /* Keep keyboard focus visible; avoid bare outline:0 on the dialog itself. */
  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${contrastColor(modalBackgroundColor, 0.95, undefined).string()};
    outline-offset: 2px;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.45);
  }
`;

export default StyledModal;
