import {
  COLOR_BLACK,
  COLOR_BRAND_PRIMARY,
  COLOR_WHITE,
  FONT_SIZE_BASE,
  FONT_STACK_BASE,
  FONT_WEIGHT_SEMIBOLD,
  LINE_HEIGHT_BASE
} from "style/styleVariables";

export const hide = `
  position: absolute;
  visibility: hidden;
  pointer-events: none;
`;

export const form_control = `
  appearance: none;
  display: flex;
  color: black;
  font-family: ${FONT_STACK_BASE};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  font-size:  ${FONT_SIZE_BASE};
  line-height:  ${LINE_HEIGHT_BASE};
  text-align: left;
  text-transform: none;
  padding: 1.4px 4px;
  background-color: ${COLOR_WHITE.toString()};
  border-radius: 3px;
  border:  1px solid ${COLOR_WHITE.mix(COLOR_BLACK, 0.05).toString()};
  border-bottom-color: ${COLOR_WHITE.mix(COLOR_BLACK, 0.1).toString()};
  user-select: auto;
  box-shadow: inset 0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  :hover {
    background-color: ${COLOR_WHITE.mix(COLOR_BLACK, 0.02).toString()};
    border-color: ${COLOR_WHITE.mix(COLOR_BLACK, 0.07).toString()};
    transition: all 0.1s ease;
    border-bottom-color: ${COLOR_WHITE.mix(COLOR_BLACK, 0.15).toString()};
    color: black;
  }
  :focus {
    outline: none;
    box-shadow: 0 0 0 2px ${COLOR_BRAND_PRIMARY.toString()};
    z-index: 1;
  }
  &::placeholder {
    color: currentColor;
    opacity: 1;
    text-align: center;
  }
  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }`;
