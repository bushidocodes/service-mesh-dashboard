import Modal from "react-modal";
import { contrastColor, spacingScale } from "style/styleFunctions";
import { COLOR_ALT_BACKGROUND } from "style/styleVariables";
import styled from "styled-components";

const modalBackgroundColor = COLOR_ALT_BACKGROUND;
const modalHeightBasis = "400px";
const modalWidthBasis = "500px";

// Add a media query to make left a calc below 600px;
const StyledModal = styled(Modal)`
  backdrop-filter: blur(10px);
  background-color: ${modalBackgroundColor.fade(0.15).string()};
  border-radius: 3px;
  color: ${contrastColor(modalBackgroundColor, 0.95, undefined).string()};
  display: flex;
  flex-direction: column;
  height: ${modalHeightBasis};
  left: 50%;
  margin-top: -${parseInt(modalHeightBasis, 10) / 2}px;
  opacity: 0;
  padding: ${spacingScale(3)};
  position: absolute;
  top: 50vh;
  transform: translateX(-50%) translateY(50px) scale(0.98);
  transition: all 0.2s ease;
  width: ${modalWidthBasis};

  > [class*="Content"] > * {
    position: relative;
    top: 0.5em;
    transition: all 0.4s cubic-bezier(0.1, 0.5, 0.2, 1.3);
    transition: all 0.4s ease;
  }

  [class*="after-close"] > & {
    opacity: 0;
    transform: translateX(-50%) translateY(0) scale(0.5);

    > [class*="Content"] > * {
      top: 1em;
    }
  }

  [class*="after-open"] > & {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);

    &:focus {
      outline: 0;
    }

    > [class*="Content"] > * {
      top: 0;
    }
  }
`;

export default StyledModal;
