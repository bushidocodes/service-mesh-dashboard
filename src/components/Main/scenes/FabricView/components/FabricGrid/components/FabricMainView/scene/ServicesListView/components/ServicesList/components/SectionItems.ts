import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const SectionItems = styled.div`
  width: 100%;
  display: flex;
  margin: -${spacingScale(0.5)} 0 0;
  flex-direction: column;

  > div {
    margin: ${spacingScale(0.5)} 0;
  }
`;

export default SectionItems;
