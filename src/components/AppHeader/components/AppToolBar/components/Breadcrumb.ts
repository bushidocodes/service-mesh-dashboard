import styled from "styled-components";

import { contrastColor, spacingScale } from "style/styleFunctions";
import { COLOR_ALT_BACKGROUND } from "style/styleVariables";
import { media } from "style/styleVariables";

const APP_TOOLBAR_BACKGROUND_COLOR = COLOR_ALT_BACKGROUND.string();

const Breadcrumb = styled.li`
  align-items: center;
  color: black;
  display: flex;
  flex: 0 0 auto;
  ${media.breadcrumbsBreakpoint200`
    max-width: calc(100vw/4);
    overflow: hidden;
  `} ${media.breadcrumbsBreakpointHandheld`
    max-width: calc(100vw/9);
    overflow: hidden;
  `} &:before {
    color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 0.8).string()};
    content: ">";
    display: flex;
    padding: 0 ${spacingScale(0.5)};
    transform: scaleX(0.5);
  }
  a {
    color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 0.85).string()};
    display: flex;
    max-width: auto;
    padding: ${spacingScale(1)} 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: ${contrastColor(APP_TOOLBAR_BACKGROUND_COLOR, 1).string()};
    }
  }

  &:first-child {
    &:before {
      content: none;
    }
    a {
      padding-left: ${spacingScale(2)};
    }
  }
`;

export default Breadcrumb;
