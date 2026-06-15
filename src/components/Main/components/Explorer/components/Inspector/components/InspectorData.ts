import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const InspectorData = styled.ul`
  flex: 1 1 100%;
  margin: 0 auto;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  padding: 0 ${spacingScale(1)};
  width: 100%;
  word-break: break-all;
`;

export default InspectorData;
