import styled from "styled-components";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";
import { edgeColor, spacingScale } from "style/styleFunctions";

const SectionContainer = styled.section`
  display: flex;
  flex-flow: column nowrap;
  margin: ${spacingScale(1)} 0 0;
  border-top: 1px solid ${edgeColor(COLOR_CONTENT_BACKGROUND).string()};
  position: relative;
  z-index: 1;

  &:first-of-type {
    border-top: 0;
  }
`;

export default SectionContainer;
