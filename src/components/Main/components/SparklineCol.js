import { spacingScale } from "style/styleFunctions";

import TableCol from "./TableCol";

const SparklineCol = TableCol.extend`
  padding-top: ${spacingScale(0.5)};
  padding-bottom: ${spacingScale(0.5)};

  svg {
    height: ${spacingScale(3)};
  }
`;

export default SparklineCol;
