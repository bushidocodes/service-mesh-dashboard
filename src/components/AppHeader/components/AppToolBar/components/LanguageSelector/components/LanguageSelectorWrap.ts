import { COLOR_WHITE } from "style/styleVariables";
import styled from "styled-components";

const LanguageSelectorWrap = styled.div<{ visible?: boolean }>`
  color: ${COLOR_WHITE.toString()};
  font-weight: 700;
  cursor: pointer;
  > :first-child {
    ${(props) => (props.visible ? `opacity: 1;` : `opacity: 0.8;`)};
    :hover {
      opacity: 1;
    }
  }
`;

export default LanguageSelectorWrap;
