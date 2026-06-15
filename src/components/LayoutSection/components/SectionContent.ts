import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";
import { CONTENT_MAX_WIDTH } from "style/styleVariables";

//the id selectors here are a fix until view-app-settings.scss is refactored
const SectionContent = styled.div<{ flex?: boolean }>`
  margin: 0 auto;
  max-width: ${CONTENT_MAX_WIDTH};
  padding: ${spacingScale(1)};
  width: 100%;
  ${(props) =>
    props.flex
      ? `
      display: flex;
      justify-content: center;
      flex-direction: row;
      `
      : ""};
`;

export default SectionContent;
