import styled from "styled-components";

import { edgeColor } from "style/styleFunctions";
import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";

const GMServiceCardsView = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${edgeColor(COLOR_CONTENT_BACKGROUND).string()};
  &:first-of-type {
    border-top: 0;
  }
`;

export default GMServiceCardsView;
