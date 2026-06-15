import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { spacingScale, contrastColor } from "style/styleFunctions";
import {
  COLOR_ALT_BACKGROUND,
  COLOR_WHITE,
  COLOR_HIGHLIGHT,
  FONT_WEIGHT_REGULAR
} from "style/styleVariables";

const TAB_WIDTH_BASE = "1%";
const COLOR_TAB_BACKGROUND_BASE = contrastColor(COLOR_ALT_BACKGROUND, 0.175);
const COLOR_TAB_BACKGROUND_ACTIVE = contrastColor(COLOR_ALT_BACKGROUND, 0.3);
const COLOR_TAB_HIGHLIGHT = COLOR_HIGHLIGHT;

// Wrap NavLink in a plain function component so styled-components v2 can wrap it.
// React Router v6 exports NavLink as a forwardRef object, which styled-components v2
// rejects because it checks typeof target === "function".
// In v6, NavLink is always exact by default — the "exact" attr is no longer needed.
function NavLinkWrapper(props: any) {
  return <NavLink {...props} />;
}

// Note: Edge requires the overflow: hidden property to maintian
// equal sized cards. flex-basis is not sufficient!
const TabLink = styled(NavLinkWrapper)`
  background-color: ${COLOR_TAB_BACKGROUND_BASE.string()};
  font-weight: ${FONT_WEIGHT_REGULAR};
  flex: 1 1 ${TAB_WIDTH_BASE};
  margin: 1px 1px 0 0;
  overflow: hidden;
  padding: ${spacingScale(0.5)} ${spacingScale(1)} ${spacingScale(1)};
  position: relative;
  transition: all 0.15s ease;

  &::after {
    border-radius: 1px;
    box-shadow: 0 0 1em 1px ${COLOR_TAB_HIGHLIGHT.string()};
    color: inherit;
    content: "";
    height: 1px;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }

  &:hover {
    background-color: ${
      /* sc-value */ COLOR_TAB_BACKGROUND_BASE.mix(
        COLOR_TAB_BACKGROUND_ACTIVE,
        0.3
      ).string()
    };

    &:after {
      opacity: 0.5;
    }
  }

  &.active {
    background-color: ${COLOR_TAB_BACKGROUND_ACTIVE.string()};
    &:after {
      background-color: ${COLOR_TAB_HIGHLIGHT.mix(COLOR_WHITE, 0.3).string()};
      opacity: 1;
      transition: 0.1s;
    }
  }

  &:active {
    &:after {
      background-color: ${COLOR_TAB_HIGHLIGHT.mix(COLOR_WHITE, 0.3).string()};
      opacity: 1;
      transition: 0.1s;
    }
  }

  &:focus {
    outline: ${COLOR_TAB_HIGHLIGHT.string()} auto 3px;
  }
`;

export default TabLink;
