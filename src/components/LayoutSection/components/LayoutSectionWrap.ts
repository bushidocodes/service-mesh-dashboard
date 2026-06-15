import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";
import { COLOR_CONTENT } from "style/styleVariables";

const LayoutSectionWrap = styled.section`
  align-items: stretch;
  color: ${COLOR_CONTENT.string()};
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  margin-bottom: ${spacingScale(4)};

  &:first-of-type {
    > * {
      border-top: 0;
    }
  }
`;

export default LayoutSectionWrap;
