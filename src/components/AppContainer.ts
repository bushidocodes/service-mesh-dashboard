import styled from "styled-components";

import { APP_FOOTER_HEIGHT } from "style/styleVariables";

// toolbar wrapper - do not display scrollbar
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;

  @media all and (min-width: 800px) {
    padding: 0 0 ${APP_FOOTER_HEIGHT};
  }
`;

export default AppContainer;
