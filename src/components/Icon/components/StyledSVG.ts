import { ICON_VIEWBOX_SIZE } from "style/styleVariables";
import styled from "styled-components";

const StyledSVG = styled.svg.attrs({
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink: "http://www.w3.org/1999/xlink",
  viewBox: `0 0 ${ICON_VIEWBOX_SIZE} ${ICON_VIEWBOX_SIZE}`
})<{ glyphColor?: string; iconRatio?: any }>`
  z-index: 1;
  height: ${(props) => props.iconRatio * ICON_VIEWBOX_SIZE}px;
  width: ${(props) => props.iconRatio * ICON_VIEWBOX_SIZE}px;
  color: ${(props) => props.glyphColor};
  word-spacing: 0;
  vertical-align: middle;

  &:not(:root) {
    overflow: visible;
  }
`;

export default StyledSVG;
