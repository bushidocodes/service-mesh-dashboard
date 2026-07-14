import {
  COLOR_CONTENT_BACKGROUND,
  FONT_WEIGHT_REGULAR,
  TABLE_BORDER
} from "style/styleVariables";
import styled from "styled-components";

const TableHeader = styled.div`
  align-items: center;
  background-color: ${COLOR_CONTENT_BACKGROUND.string()};
  box-shadow: inset 0 -1px ${TABLE_BORDER};
  display: flex;
  flex-wrap: wrap;
  font-weight: ${FONT_WEIGHT_REGULAR};
  overflow: visible;
  width: 100%;
`;

export default TableHeader;
