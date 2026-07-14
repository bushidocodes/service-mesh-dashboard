import { spacingScale } from "style/styleFunctions";
import styled from "styled-components";

const ButtonGroup = styled.div<{ toolbar?: boolean }>`
  display: flex;
  flex-direction: row;
  * + * {
    margin-left: ${spacingScale(0.5)};
  }
  ${(props) =>
    props.toolbar ? `padding: ${spacingScale(0)} ${spacingScale(1)};` : ""};
`;

export default ButtonGroup;
