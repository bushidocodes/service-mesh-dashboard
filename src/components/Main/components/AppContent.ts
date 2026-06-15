import styled from "styled-components";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";

// content wrapper - display scrollbar
// flex-basis has to be set to auto because IE has trouble interpreting flex-basis: 100% and cuts off overflow content at the bottom of the div
const AppContent = styled.div`
  background-color: ${COLOR_CONTENT_BACKGROUND.string()};
  display: flex;
  flex: 1 1;
  flex-basis: auto;
  flex-direction: column;
  outline: none;
  position: relative;
`;

export default AppContent;
