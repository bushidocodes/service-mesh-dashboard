import { contrastColor } from "style/styleFunctions";
import {
  COLOR_BRAND_PRIMARY,
  COLOR_CONTENT_BACKGROUND,
  COLOR_DANGER,
  COLOR_INFO,
  COLOR_WARNING,
  FONT_STACK_BASE,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";
import styled from "styled-components";
import generateButtonIconRatio from "./utils/generateButtonIconRatio";
import generateButtonOrientation from "./utils/generateButtonOrientation";
import generateButtonSize from "./utils/generateButtonSize";
import generateButtonStyle from "./utils/generateButtonStyle";

// Maps button types to a particular color
function generateButtonTypeColor(type?: string) {
  switch (type) {
    case "danger":
      return COLOR_DANGER.rgb();
    case "info":
      return COLOR_INFO.rgb();
    case "warning":
      return COLOR_WARNING.rgb();
    case "polling":
      return COLOR_CONTENT_BACKGROUND.rgb();
    default:
    case "primary":
      return COLOR_BRAND_PRIMARY.rgb();
  }
}

const camelCaseConverter = (stringInput?: string) => {
  if (stringInput) {
    return stringInput.replace(/-([a-z])/g, function (g: string) {
      // capture group 1 is always present for this pattern
      return (g[1] ?? "").toUpperCase();
    });
  }
};

// The start of the CSS style output
const ButtonWrap = styled.button<{
  active?: boolean;
  orientation?: string;
  outline?: string;
  size?: string;
  type?: string;
  iconSize?: string;
}>`
  box-sizing: border-box;
  user-select: none;
  font-family: ${FONT_STACK_BASE};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  border-width: 1px;
  line-height: 1.4;
  border-style: solid;
  text-transform: none;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transition: all 0.1s ease;
  }

  &:focus,
  &:active {
    transition: all 0 ease;
  }

  > * {
    flex: 0 1 auto;
  }

  ${(props) => `
    ${
      props.type
        ? generateButtonStyle({
            buttonOutlineStyle: camelCaseConverter(props.outline),
            buttonBackgroundColorBase: generateButtonTypeColor(props.type),
            buttonBorderColorBase: generateButtonTypeColor(props.type),
            buttonLabelColorBase: (contrastColor as any)(
              generateButtonTypeColor(props.type),
              100
            ),
            buttonActiveStatus: props.active
          }) // has color (also code in props.outline and props.active)
        : generateButtonStyle({
            buttonOutlineStyle: camelCaseConverter(props.outline),
            buttonActiveStatus: props.active
          }) // no color
    }
    ${
      props.size
        ? generateButtonSize(props.size) // has size
        : generateButtonSize() // Icons // no size
    }
    ${
      props.iconSize
        ? generateButtonIconRatio(props.iconSize) // has iconSize
        : generateButtonIconRatio() // Orientation // no iconSize
    }
    ${
      props.orientation
        ? generateButtonOrientation(props.orientation) // has orientation
        : generateButtonOrientation() // no orientation default horizontal
    }
  `};
`;

export default ButtonWrap;
