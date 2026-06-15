import styled from "styled-components";

import { CONTENT_MAX_WIDTH } from "style/styleVariables";
import { spacingScale } from "style/styleFunctions";

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 ${spacingScale(1)};
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export default SectionContent;
