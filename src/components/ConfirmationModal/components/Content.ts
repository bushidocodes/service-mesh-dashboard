import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

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
