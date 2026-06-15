import { COLOR_ALT_BACKGROUND } from "style/styleVariables";
import styled from "styled-components";
import { contrastColor } from "style/styleFunctions";

const COLOR_TAB_BACKGROUND_BASE = contrastColor(COLOR_ALT_BACKGROUND, 0.175);

const TabNav = styled.div`
  display: flex;
  flex-flow: row wrap;
  color: ${contrastColor(COLOR_TAB_BACKGROUND_BASE).string()};
  background-color: ${COLOR_ALT_BACKGROUND.fade(0.7).string()};
  padding: 0 1px 1px 1px;
`;

export default TabNav;
