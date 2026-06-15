import styled from "styled-components";

import {
  spacingScale,
  contrastColor,
  rowChildSpacing
} from "style/styleFunctions";
import {
  COLOR_CONTENT_BACKGROUND,
  TABLE_HOVER,
  TABLE_BORDER
} from "style/styleVariables";

const TableRow = styled.li.attrs({
  tabIndex: 0
})<{ isOpen?: boolean; selectable?: boolean; overflowVisible?: boolean }>`
  align-items: center;
  background-color: ${(props) =>
    props.isOpen
      ? contrastColor(COLOR_CONTENT_BACKGROUND, 0.04).string()
      : contrastColor(COLOR_CONTENT_BACKGROUND, 0).string()};
  box-shadow: inset 0 -1px ${TABLE_BORDER};
  display: flex;
  flex-wrap: wrap;
  min-height: ${spacingScale(4.5)};
  width: 100%;
  cursor: ${(props) => (props.selectable ? `pointer` : `default`)};

  &:hover {
    ${(props) => props.selectable && `background-color: ${TABLE_HOVER}; `};
  }
  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus:active:hover {
    outline: 0;
  }

  > * {
    ${rowChildSpacing()};
    ${(props) => (props.overflowVisible ? `overflow: visible;` : "")};
  }
`;

export default TableRow;
