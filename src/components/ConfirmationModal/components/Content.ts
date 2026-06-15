import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const Content = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  justify-content: center;

  > svg {
    margin-top: -${spacingScale(2)};
  }
`;

export default Content;
