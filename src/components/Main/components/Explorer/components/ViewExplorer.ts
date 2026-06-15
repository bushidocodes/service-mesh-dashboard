import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const ViewExplorer = styled.div`
  align-items: stretch;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  padding: 0 ${spacingScale(2)} ${spacingScale(2)};
  @media all and (min-width: 800px) {
    flex-direction: row;
  }
`;

export default ViewExplorer;
