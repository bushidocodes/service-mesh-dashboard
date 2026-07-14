import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const ReadoutItemData = styled.div<{ paddingLeft?: string | number }>`
  align-items: stretch;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  padding: ${spacingScale(1)} 0;

  &:first-child {
    padding-left: ${(props) =>
      props.paddingLeft ? props.paddingLeft : spacingScale(2)};
  }
`;

export default ReadoutItemData;
