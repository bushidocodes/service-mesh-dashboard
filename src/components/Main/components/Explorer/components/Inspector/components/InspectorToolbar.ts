import styled from "styled-components";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";
import { edgeColor, spacingScale } from "style/styleFunctions";

const InspectorToolbar = styled.div`
  align-items: stretch;
  box-shadow: 0 1px 0 0 ${edgeColor(COLOR_CONTENT_BACKGROUND).string()};
  display: flex;
  flex: 0 0 ${spacingScale(14)};
  flex-direction: column;

  > * {
    padding: ${spacingScale(1)};
    display: flex;
    flex: 1 1 auto;
  }
`;

export default InspectorToolbar;
