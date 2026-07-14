import { spacingScale } from "style/styleFunctions";

import {
  COLOR_CONTENT_BACKGROUND,
  CONTENT_MAX_WIDTH,
  ZINDEX_STICKY
} from "style/styleVariables";
import styled from "styled-components";

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
