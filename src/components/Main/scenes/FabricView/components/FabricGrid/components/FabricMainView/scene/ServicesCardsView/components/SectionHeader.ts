import styled from "styled-components";

import {
  COLOR_CONTENT_BACKGROUND,
  CONTENT_MAX_WIDTH,
  PADDING_BASE,
  ZINDEX_STICKY
} from "style/styleVariables";

const SectionHeader = styled.div`
  display: flex;
  padding: ${PADDING_BASE} ${parseInt(PADDING_BASE, 10) * 2}px 0;
  position: sticky;
  top: 0;
  z-index: ${ZINDEX_STICKY};
  background-color: ${COLOR_CONTENT_BACKGROUND.string()};
  max-width: ${CONTENT_MAX_WIDTH};
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

export default SectionHeader;
