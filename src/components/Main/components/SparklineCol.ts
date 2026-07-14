import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

import TableCol from "./TableCol";

const SparklineCol = styled(TableCol)`
  padding-top: ${spacingScale(0.5)};
  padding-bottom: ${spacingScale(0.5)};

  svg {
    height: ${spacingScale(3)};
  }
`;

export default SparklineCol;
