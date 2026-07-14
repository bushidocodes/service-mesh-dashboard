import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const LineChartContent = styled.div`
  flex: 1 1 100%;
  position: relative;
  min-height: 250px;

  > * {
    margin: ${spacingScale(1)};
  }
`;

export default LineChartContent;
