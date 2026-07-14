import { COLOR_BLACK, COLOR_WHITE, ZINDEX_TOOLTIP } from "style/styleVariables";
import styled from "styled-components";

const TooltipWrap = styled.div<{ disabled?: boolean }>`
  border-bottom: 1px solid ${COLOR_BLACK.mix(COLOR_WHITE, 0.85).string()};
  cursor: ${(props) => (props.disabled ? "default" : "help")};
  display: inline-block;
  position: relative;

  :hover > :last-child {
    ${(props) =>
      props.disabled
        ? ""
        : `opacity: 1;

    visibility: visible;
    z-index: ${ZINDEX_TOOLTIP};`};
  }
`;

export default TooltipWrap;
