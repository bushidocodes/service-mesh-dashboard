import { contrastColor, edgeColor, spacingScale } from "style/styleFunctions";

import {
  CHART_BACKGROUND_COLOR,
  COLOR_CONTENT_MUTED,
  COLOR_WARNING,
  FONT_SIZE_LG
} from "style/styleVariables";
import styled from "styled-components";

const LineChartEmpty = styled.div`
  flex: 1 0 auto;
  padding: ${spacingScale(1)};

  h1,
  p,
  ul {
    margin: 0;
    padding: 0;
  }

  h1 {
    border-bottom: 1px solid ${edgeColor(CHART_BACKGROUND_COLOR)};
    color: ${contrastColor(CHART_BACKGROUND_COLOR, "100%", COLOR_WARNING)};
    font-weight: bold;
    font-size: ${FONT_SIZE_LG};
    margin-bottom: ${spacingScale(2)};
    padding-bottom: ${spacingScale(2)};
  }

  p,
  ul {
    color: ${COLOR_CONTENT_MUTED};
  }

  ul {
    list-style: circle;
    padding-left: ${spacingScale(2)};
  }
`;

export default LineChartEmpty;
