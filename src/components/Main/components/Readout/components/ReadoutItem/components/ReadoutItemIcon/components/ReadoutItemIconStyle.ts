import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const ReadoutItemIconStyle = styled.div`
  flex: 0 0 ${spacingScale(10)};
  height: ${spacingScale(6)};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export default ReadoutItemIconStyle;
