import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const DataSparkline = styled.div`
  opacity: 0.7;
  text-align: left;
  display: inline-block;
  width: 6em;
  padding-left: ${spacingScale(1)};
  height: ${spacingScale(3)};
`;

export default DataSparkline;
