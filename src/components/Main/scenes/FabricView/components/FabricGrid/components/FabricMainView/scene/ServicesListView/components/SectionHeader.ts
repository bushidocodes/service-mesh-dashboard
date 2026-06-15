import styled from "styled-components";

import {
  COLOR_CONTENT_BACKGROUND,
  ZINDEX_STICKY,
  CONTENT_MAX_WIDTH
} from "style/styleVariables";
import { spacingScale } from "style/styleFunctions";

const SectionHeader = styled.div`
  width: 100%;
  display: flex;
  margin: 0 auto;
  padding: 0 ${spacingScale(2)};
  position: sticky;
  top: 0;
  z-index: ${ZINDEX_STICKY};
  background-color: ${COLOR_CONTENT_BACKGROUND.string()};
  max-width: ${CONTENT_MAX_WIDTH};
`;

export default SectionHeader;
