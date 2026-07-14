import { CONTENT_MAX_WIDTH, PADDING_BASE } from "style/styleVariables";
import styled from "styled-components";

const SectionContent = styled.div`
  display: flex;
  padding: 0 ${parseInt(PADDING_BASE, 10) * 2}px
    ${parseInt(PADDING_BASE, 10) * 3}px;
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export default SectionContent;
