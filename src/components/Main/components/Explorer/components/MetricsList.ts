import styled from "styled-components";

import { edgeColor, spacingScale } from "style/styleFunctions";
import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";

const MetricsList = styled.div`
  border-right: 1px solid ${edgeColor(COLOR_CONTENT_BACKGROUND).string()};
  flex: 0 0 300px;
  margin-bottom: ${spacingScale(2)};
  position: relative;
  @media all and (min-width: 800px) {
    flex: 0 0 40%;
    margin-bottom: 0;
    margin-right: ${spacingScale(2)};
    max-width: 550px;
  }
`;

export default MetricsList;
