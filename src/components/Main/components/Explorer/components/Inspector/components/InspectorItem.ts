import { spacingScale } from "style/styleFunctions";

import {
  BORDER_RADIUS_BASE,
  COLOR_HIGHLIGHT,
  COLOR_WHITE
} from "style/styleVariables";
import styled from "styled-components";

const InspectorItem = styled.div<{ active?: boolean }>`
  border-radius: ${BORDER_RADIUS_BASE};
  cursor: pointer;
  display: flex;
  padding: ${spacingScale(0.5)} ${spacingScale(1)};
  transition: all 0.2s ease;
  will-change: transform;
  word-wrap: break-word;

  &:first-child {
    margin-top: ${spacingScale(1)};
  }

  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:hover {
    color: ${COLOR_HIGHLIGHT.string()};
  }

  &:active {
    color: ${COLOR_HIGHLIGHT.string()};
    transform: scale(0.9875);
    transition-duration: 0;
  }

  &:focus:active:hover {
    outline: 0;
  }

  ${(props) =>
    props.active &&
    `background: ${COLOR_HIGHLIGHT.string()};
    color: ${COLOR_WHITE.string()} !important;
    transform: scale(1.0125);
    z-index: 999999;`};
`;

export default InspectorItem;
